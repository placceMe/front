// src/pages/admin/ProductsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Tag,
  Upload,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Divider,
  Tooltip,
  Image,
  Badge,
} from "antd";
import {
  SearchOutlined,
  InboxOutlined,
  ReloadOutlined,
  UserSwitchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingOutlined,
  FilterOutlined,
  ClearOutlined,
  EyeOutlined,
  PictureOutlined,
  DollarOutlined,
  ShopOutlined,
  TagOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";

const { Title, Text } = Typography;

/* ===================== Типи ===================== */
type Product = {
  id: string;
  title: string;
  description?: string;
  price: number;
  color?: string;
  weight?: number;
  mainImageUrl?: string;
  categoryId: string;
  sellerId?: string;
  quantity: number;
};

type Category = { id: string; title?: string; name?: string; };
type SellerUser = {
  id: string; name: string; surname: string; email: string; roles: string[]; state: string;
};

/* ===================== API ===================== */
const API_PRODUCTS = __BASE_URL__ + "/api/products";
const API_CATEGORIES = __BASE_URL__ + "/api/category";
const API_USERS = __BASE_URL__ + "/api/users";

/* ============== Утиліти кольору для тегу категорії ============== */
const hashCode = (str: string) => {
  let h = 0; for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
  return Math.abs(h);
};
const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))] as const;
};
const textColorForBg = (r: number, g: number, b: number) =>
  (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? "#000" : "#fff";
const colorForCategory = (key: string) => {
  const h = hashCode(key) % 360, s = 65, l = 45;
  const [r, g, b] = hslToRgb(h, s, l);
  return { bg: `hsl(${h}, ${s}%, ${l}%)`, text: textColorForBg(r, g, b) };
};

/* ============== Налаштування завантаження файлів ============== */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const isImage = (file: File) => file.type.startsWith("image/");
const beforeUploadValidate = (file: File) => {
  if (!isImage(file)) { message.error("Можна завантажувати тільки зображення"); return Upload.LIST_IGNORE; }
  if (file.size > MAX_FILE_SIZE) { message.error("Файл завеликий (макс. 5MB)"); return Upload.LIST_IGNORE; }
  return false; // не аплоадимо автоматично
};

/* ===================== Компонент ===================== */
const ProductsPage: React.FC = () => {
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);

  const [sellers, setSellers] = useState<SellerUser[]>([]);
  const [sellersLoading, setSellersLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Фільтри (локально)
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [sellerId, setSellerId] = useState<string | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minQty, setMinQty] = useState<number | undefined>(undefined);
  const [maxQty, setMaxQty] = useState<number | undefined>(undefined);
  const [colorLike, setColorLike] = useState<string>("");

  // CRUD modal
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // файли (тільки для створення)
  const [mainFileList, setMainFileList] = useState<UploadFile[]>([]);
  const [galleryFileList, setGalleryFileList] = useState<UploadFile[]>([]);

  const getSellerLabel = (id?: string) => {
    const u = sellers.find((x) => x.id === id);
    return u ? `${u.name} ${u.surname} (${u.email})` : id || "—";
  };

  const fetchCategories = async () => {
    setCatLoading(true);
    try {
      const res = await fetch(API_CATEGORIES);
      setCategories(await res.json());
    } catch { message.error("Не вдалося завантажити категорії"); }
    finally { setCatLoading(false); }
  };
  const fetchSellers = async () => {
    setSellersLoading(true);
    try {
      const res = await fetch(API_USERS);
      const list: SellerUser[] = await res.json();
      setSellers((list || []).filter(u => Array.isArray(u.roles) && u.roles.includes("Saler") && u.state === "Active"));
    } catch { message.error("Не вдалося завантажити продавців"); }
    finally { setSellersLoading(false); }
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_PRODUCTS);
      const raw = await res.json();
      const items: Product[] = Array.isArray(raw) ? raw : raw?.products ?? [];
      setAll(items);
    } catch { message.error("Не вдалося завантажити товари"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); fetchSellers(); fetchAll(); }, []);

  const resetFilters = () => {
    setQ(""); setCategoryId(undefined); setSellerId(undefined);
    setMinPrice(undefined); setMaxPrice(undefined);
    setMinQty(undefined); setMaxQty(undefined);
    setColorLike("");
    setPage(1);
  };

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const color = colorLike.trim().toLowerCase();

    return all.filter(p => {
      if (categoryId && p.categoryId !== categoryId) return false;
      if (sellerId && p.sellerId !== sellerId) return false;
      if (typeof minPrice === "number" && p.price < minPrice) return false;
      if (typeof maxPrice === "number" && p.price > maxPrice) return false;
      if (typeof minQty === "number" && p.quantity < minQty) return false;
      if (typeof maxQty === "number" && p.quantity > maxQty) return false;
      if (color && !(p.color ?? "").toLowerCase().includes(color)) return false;

      if (ql) {
        const hay = `${p.title} ${p.description ?? ""} ${p.color ?? ""}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
  }, [all, q, categoryId, sellerId, minPrice, maxPrice, minQty, maxQty, colorLike]);

  // Statistics calculations
  const stats = useMemo(() => {
    const totalProducts = all.length;
    const inStock = all.filter(p => p.quantity > 0).length;
    const lowStock = all.filter(p => p.quantity > 0 && p.quantity <= 10).length;
    const outOfStock = all.filter(p => p.quantity === 0).length;
    const totalValue = all.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    return { totalProducts, inStock, lowStock, outOfStock, totalValue };
  }, [all]);

  const pagedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const openModal = (record?: Product) => {
    setEditing(record || null);
    form.setFieldsValue(
      record || {
        title: "", description: "", price: 0, color: "", weight: 0,
        categoryId: undefined, sellerId: undefined, quantity: 0,
      }
    );
    setMainFileList([]); setGalleryFileList([]);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false); setEditing(null);
    setMainFileList([]); setGalleryFileList([]);
    form.resetFields();
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_PRODUCTS}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      message.success("Товар видалено");
      setAll(prev => prev.filter(p => p.id !== id));
    } catch { message.error("Не вдалося видалити"); }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // ===== UPDATE (без зміни файлів) =====
      if (editing) {
        const res = await fetch(`${API_PRODUCTS}/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values }),
        });
        if (!res.ok) throw new Error();
        message.success("Товар оновлено");
        setAll(prev => prev.map(p => p.id === editing.id ? { ...p, ...values } : p));
        closeModal();
        return;
      }

      // ===== CREATE — тільки з файлами (MainImage + AdditionalImages) =====
      const mainFile = mainFileList[0]?.originFileObj as File | undefined;
      if (!mainFile) { message.error("Додайте головне зображення"); return; }

      const fd = new FormData();
      // PascalCase як у робочому AddProductCard
      fd.append("Title", values.title);
      if (values.description) fd.append("Description", values.description);
      fd.append("Price", String(values.price ?? 0));
      if (values.color) fd.append("Color", values.color);
      if (values.weight !== undefined) fd.append("Weight", String(values.weight ?? 0));
      fd.append("CategoryId", values.categoryId);
      if (values.sellerId) fd.append("SellerId", values.sellerId);
      fd.append("Quantity", String(values.quantity ?? 0));
      fd.append("MainImage", mainFile);
      galleryFileList.forEach((f) => {
        const file = f.originFileObj as File;
        if (file) fd.append("AdditionalImages", file);
      });

      const res = await fetch(`${API_PRODUCTS}/with-files`, { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      message.success("Товар створено (з файлами)");
      closeModal();
      fetchAll();
    } catch (err: any) {
      if (!err?.errorFields) message.error("Помилка при збереженні");
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Товар",
      dataIndex: "title",
      render: (title: string, record: Product) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {record.mainImageUrl ? (
            <Image
              src={__BASE_URL__+"/api/files/"+record.mainImageUrl}
              width={50}
              height={50}
              style={{ borderRadius: 8, objectFit: "cover" }}
              preview={{
                mask: <EyeOutlined />
              }}
            />
          ) : (
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 8,
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <PictureOutlined style={{ color: "#bfbfbf" }} />
            </div>
          )}
          <div>
            <div style={{ fontWeight: 500, color: "#262626", fontSize: 14 }}>
              {title}
            </div>
            {record.description && (
              <div style={{
                fontSize: 12,
                color: "#8c8c8c",
                maxWidth: 200,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                {record.description}
              </div>
            )}
            {record.color && (
              <div style={{ fontSize: 12, color: "#595959", marginTop: 2 }}>
                <span style={{ color: "#8c8c8c" }}>Колір:</span> {record.color}
              </div>
            )}
          </div>
        </div>
      ),
      width: 300,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Ціна / Кількість",
      dataIndex: "price",
      render: (price: number, record: Product) => (
        <div>
          <div style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#52c41a",
            display: "flex",
            alignItems: "center",
            gap: 4
          }}>
            <DollarOutlined style={{ fontSize: 14 }} />
            {price} ₴
          </div>
          <div style={{
            fontSize: 12,
            color: record.quantity > 10 ? "#52c41a" : record.quantity > 0 ? "#fa8c16" : "#f5222d",
            marginTop: 2
          }}>
            На складі: {record.quantity}
            {record.weight && ` • ${record.weight}г`}
          </div>
        </div>
      ),
      sorter: (a, b) => a.price - b.price,
      width: 140,
    },
    {
      title: "Категорія",
      dataIndex: "categoryId",
      render: (id: string) => {
        const cat = categories.find((x) => x.id === id);
        const label = cat ? (cat.title ?? cat.name ?? "(без назви)") : id || "—";
        const { bg, text } = colorForCategory(cat ? `${cat.id}|${label}` : id || label);
        return (
          <Tag
            icon={<TagOutlined />}
            style={{
              backgroundColor: bg,
              color: text,
              border: "none",
              borderRadius: 16,
              paddingInline: 12
            }}
          >
            {label}
          </Tag>
        );
      },
      width: 150,
    },
    {
      title: "Продавець",
      dataIndex: "sellerId",
      render: (id?: string) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <ShopOutlined style={{ color: "#1890ff", fontSize: 12 }} />
          <Text style={{ fontSize: 12 }}>
            {getSellerLabel(id)}
          </Text>
        </div>
      ),
      width: 180,
    },
    {
      title: "Дії",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Редагувати">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openModal(record)}
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
          <Popconfirm
            title="Видалити товар?"
            description="Ця дія незворотна. Ви впевнені?"
            onConfirm={() => handleDelete(record.id)}
            okText="Так"
            cancelText="Ні"
          >
            <Tooltip title="Видалити">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
      width: 80,
    },
  ];

  const categoryOptions = useMemo(() => categories.map(c => ({
    value: c.id,
    label: c.title ?? c.name ?? "(без назви)",
  })), [categories]);

  const sellerOptions = useMemo(() => sellers.map(u => ({
    value: u.id,
    label: `${u.name} ${u.surname} (${u.email})`,
  })), [sellers]);

  return (
    <div style={{ padding: "0 24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ paddingTop: 24, paddingBottom: 16 }}>
        <Title level={2} style={{ margin: 0, color: "#262626" }}>
          <ShoppingOutlined style={{ marginRight: 12 }} />
          Управління товарами
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Керуйте товарами, їх категоріями, цінами та наявністю на складі
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Всього товарів"
              value={stats.totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="В наявності"
              value={stats.inStock}
              prefix={<Badge status="success" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Мало на складі"
              value={stats.lowStock}
              prefix={<Badge status="warning" />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Немає в наявності"
              value={stats.outOfStock}
              prefix={<Badge status="error" />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card style={{ borderRadius: 8 }}>
        {/* Action Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {  /*  <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
              size="middle"
            >
              Додати товар
            </Button>*/}
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchAll()}
              size="middle"
            >
              Оновити
            </Button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Знайдено: {filtered.length} з {all.length}
            </Text>
          </div>
        </div>

        {/* Filters */}
        <Card
          size="small"
          style={{ marginBottom: 16, backgroundColor: "#fafafa" }}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FilterOutlined />
              <Text style={{ fontWeight: 500 }}>Фільтри</Text>
            </div>
          }
          extra={
            <Button
              size="small"
              icon={<ClearOutlined />}
              onClick={resetFilters}
              type="text"
            >
              Очистити
            </Button>
          }
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Пошук за назвою, описом, кольором"
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                allowClear
                placeholder="Фільтр по категоріях"
                style={{ width: "100%" }}
                value={categoryId}
                onChange={(v) => { setCategoryId(v); setPage(1); }}
                options={categoryOptions}
                loading={catLoading}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                allowClear
                placeholder="Фільтр по продавцях"
                style={{ width: "100%" }}
                value={sellerId}
                onChange={(v) => { setSellerId(v); setPage(1); }}
                options={sellerOptions}
                loading={sellersLoading}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input
                allowClear
                placeholder="Колір"
                value={colorLike}
                onChange={(e) => { setColorLike(e.target.value); setPage(1); }}
              />
            </Col>
          </Row>

          <Divider style={{ margin: "12px 0" }} />

          <Row gutter={[12, 8]}>
            <Col xs={12} sm={6} md={4}>
              <Text style={{ fontSize: 12, color: "#8c8c8c", display: "block", marginBottom: 4 }}>
                Ціна від:
              </Text>
              <InputNumber
                min={0}
                placeholder="Від"
                style={{ width: "100%" }}
                value={minPrice}
                onChange={(v) => { setMinPrice(v ?? undefined); setPage(1); }}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Text style={{ fontSize: 12, color: "#8c8c8c", display: "block", marginBottom: 4 }}>
                Ціна до:
              </Text>
              <InputNumber
                min={0}
                placeholder="До"
                style={{ width: "100%" }}
                value={maxPrice}
                onChange={(v) => { setMaxPrice(v ?? undefined); setPage(1); }}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Text style={{ fontSize: 12, color: "#8c8c8c", display: "block", marginBottom: 4 }}>
                Кількість від:
              </Text>
              <InputNumber
                min={0}
                placeholder="Від"
                style={{ width: "100%" }}
                value={minQty}
                onChange={(v) => { setMinQty(v ?? undefined); setPage(1); }}
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Text style={{ fontSize: 12, color: "#8c8c8c", display: "block", marginBottom: 4 }}>
                Кількість до:
              </Text>
              <InputNumber
                min={0}
                placeholder="До"
                style={{ width: "100%" }}
                value={maxQty}
                onChange={(v) => { setMaxQty(v ?? undefined); setPage(1); }}
              />
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Table<Product>
          rowKey="id"
          dataSource={pagedData}
          loading={loading}
          columns={columns}
          pagination={{
            current: page,
            pageSize,
            total: filtered.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} з ${total} записів`,
            onChange: (p, s) => { setPage(p); setPageSize(s || 10); },
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1200 }}
          size="middle"
          style={{ backgroundColor: "#fff" }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
          }
        />
      </Card>
   

      <Modal
        open={isOpen}
        title={editing ? "Редагувати товар" : "Створити товар"}
        onCancel={closeModal}
        onOk={handleSave}
        width={760}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Назва" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="Опис"><Input.TextArea rows={3} /></Form.Item>

          <Space size="middle" style={{ display: "flex" }}>
            <Form.Item name="price" label="Ціна" rules={[{ required: true }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
            <Form.Item name="quantity" label="Кількість" rules={[{ required: true }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          </Space>

          <Space size="middle" style={{ display: "flex" }}>
            <Form.Item name="color" label="Колір"><Input /></Form.Item>
            <Form.Item name="weight" label="Вага"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          </Space>

          <Space size="middle" style={{ display: "flex" }}>
            <Form.Item
              name="categoryId"
              label="Категорія"
              rules={[{ required: true, message: "Оберіть категорію" }]}
              style={{ flex: 1 }}
            >
              <Select loading={catLoading} placeholder="Оберіть категорію" options={categoryOptions} />
            </Form.Item>

            <Form.Item name="sellerId" label="Продавець" style={{ flex: 1 }}>
              <Select allowClear loading={sellersLoading} placeholder="Оберіть продавця (необов'язково)" options={sellerOptions} />
            </Form.Item>
          </Space>

          {/* Створення — лише з файлами */}
          {!editing && (
            <>
              <Form.Item
                label="Головне зображення"
                required
                validateStatus={mainFileList.length ? "success" : "error"}
                help={mainFileList.length ? undefined : "Додайте головне зображення"}
              >
                <Upload.Dragger
                  accept="image/*"
                  listType="picture-card"
                  maxCount={1}
                  fileList={mainFileList}
                  beforeUpload={beforeUploadValidate}
                  onChange={({ fileList }) => setMainFileList(fileList)}
                >
                  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                  <p className="ant-upload-text">Перетягніть головне зображення або натисніть</p>
                </Upload.Dragger>
              </Form.Item>

              <Form.Item label="Галерея (дод. зображення)">
                <Upload.Dragger
                  multiple
                  accept="image/*"
                  listType="picture-card"
                  fileList={galleryFileList}
                  beforeUpload={beforeUploadValidate}
                  onChange={({ fileList }) => setGalleryFileList(fileList)}
                >
                  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                  <p className="ant-upload-text">Перетягніть файли або натисніть для вибору</p>
                </Upload.Dragger>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
