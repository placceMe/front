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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import { SearchOutlined, InboxOutlined, ReloadOutlined, UserSwitchOutlined } from "@ant-design/icons";

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
    { title: "Назва", dataIndex: "title", sorter: (a, b) => a.title.localeCompare(b.title) },
    { title: "Ціна", dataIndex: "price", sorter: (a, b) => a.price - b.price, render: (v: number) => `${v} ₴` },
    { title: "Кількість", dataIndex: "quantity", sorter: (a, b) => a.quantity - b.quantity },
    { title: "Колір", dataIndex: "color" },
    { title: "Вага", dataIndex: "weight" },
    {
      title: "Категорія",
      dataIndex: "categoryId",
      render: (id: string) => {
        const cat = categories.find((x) => x.id === id);
        const label = cat ? (cat.title ?? cat.name ?? "(без назви)") : id || "—";
        const { bg, text } = colorForCategory(cat ? `${cat.id}|${label}` : id || label);
        return <Tag style={{ backgroundColor: bg, color: text, border: "none" }}>{label}</Tag>;
      },
    },
    {
      title: "Продавець",
      dataIndex: "sellerId",
      render: (id?: string) => getSellerLabel(id),
    },
    {
      title: "Дії",
      fixed: "right",
      render: (_, r) => (
        <Space>
          <Button type="link" onClick={() => openModal(r)}>Редагувати</Button>
          <Popconfirm title="Видалити товар?" onConfirm={() => handleDelete(r.id)}>
            <Button danger type="link">Видалити</Button>
          </Popconfirm>
        </Space>
      ),
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
    <div>
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Пошук за назвою/описом/кольором"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          style={{ width: 300 }}
        />

        <Select
          allowClear
          placeholder="Категорія"
          style={{ minWidth: 220 }}
          value={categoryId}
          onChange={(v) => { setCategoryId(v); setPage(1); }}
          options={categoryOptions}
          loading={catLoading}
        />

        <Select
          allowClear
          placeholder="Продавець"
          style={{ minWidth: 260 }}
          value={sellerId}
          onChange={(v) => { setSellerId(v); setPage(1); }}
          options={sellerOptions}
          loading={sellersLoading}
        />

        <InputNumber placeholder="Мін. ціна" min={0} value={minPrice} onChange={(v) => setMinPrice(v ?? undefined)} />
        <InputNumber placeholder="Макс. ціна" min={0} value={maxPrice} onChange={(v) => setMaxPrice(v ?? undefined)} />

        <InputNumber placeholder="Мін. кількість" min={0} value={minQty} onChange={(v) => setMinQty(v ?? undefined)} />
        <InputNumber placeholder="Макс. кількість" min={0} value={maxQty} onChange={(v) => setMaxQty(v ?? undefined)} />

        <Input
          allowClear
          placeholder="Колір містить…"
          value={colorLike}
          onChange={(e) => { setColorLike(e.target.value); setPage(1); }}
          style={{ width: 180 }}
        />

        <Button icon={<ReloadOutlined />} onClick={() => fetchAll()}>
          Оновити
        </Button>

        <Button size="small" loading={catLoading} onClick={fetchCategories}>
          Оновити категорії
        </Button>
        <Button size="small" icon={<UserSwitchOutlined />} loading={sellersLoading} onClick={fetchSellers}>
          Оновити продавців
        </Button>

        <Button onClick={resetFilters}>Скинути фільтри</Button>

        <Button type="primary" onClick={() => openModal()}>Створити товар</Button>
      </Space>

      <Table<Product>
        rowKey="id"
        dataSource={pagedData}
        loading={loading}
        columns={columns}
        scroll={{ x: 1100 }}
        pagination={{
          current: page,
          pageSize,
          total: filtered.length,
          showSizeChanger: true,
          onChange: (p, s) => { setPage(p); setPageSize(s); },
        }}
      />

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
