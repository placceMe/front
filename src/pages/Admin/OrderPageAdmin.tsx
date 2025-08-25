// src/pages/admin/ProductsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Table, Button, Popconfirm, Modal, Form, Input, InputNumber, message, Space, Tag, Upload, Switch, Select,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { SearchOutlined, InboxOutlined, ReloadOutlined, UserSwitchOutlined } from "@ant-design/icons";

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

type ProductsResponse = {
  products: Product[];
  pagination: {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
};

type Category = {
  id: string;
  title?: string;
  name?: string;
};

type SellerUser = {
  id: string;
  name: string;
  surname: string;
  email: string;
  roles: string[];
  state: string;
};

const API_PRODUCTS = "http://localhost:8080/api/products";
const API_CATEGORIES = "http://localhost:8080/api/category";
const API_USERS = "http://localhost:8080/api/users";

/* --------------------  Утилиты цвета  -------------------- */
const hashCode = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
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
  const h = hashCode(key) % 360;
  const s = 65;
  const l = 45;
  const [r, g, b] = hslToRgb(h, s, l);
  const bg = `hsl(${h}, ${s}%, ${l}%)`;
  const text = textColorForBg(r, g, b);
  return { bg, text };
};
/* -------------------------------------------------------- */

/* --------------------  Настройки загрузки  -------------------- */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const isImage = (file: File) => file.type.startsWith("image/");
const beforeUploadValidate = (file: File) => {
  if (!isImage(file)) {
    message.error("Можно загружать только изображения");
    return Upload.LIST_IGNORE;
  }
  if (file.size > MAX_FILE_SIZE) {
    message.error("Файл слишком большой (макс. 5MB)");
    return Upload.LIST_IGNORE;
  }
  // возвращаем false, чтобы AntD НЕ отправлял файл сам (мы шлём в onOk)
  return false;
};
/* ------------------------------------------------------------- */

const ProductsPage: React.FC = () => {
  const [data, setData] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);

  const [sellers, setSellers] = useState<SellerUser[]>([]);
  const [sellersLoading, setSellersLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [query, setQuery] = useState("");
  const debouncedQuery = useMemo(() => query, [query]);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [withFiles, setWithFiles] = useState(false);
  const [form] = Form.useForm();

  // 🔁 Новая логика: два отдельных списка — главный и галерея
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
      const list: Category[] = await res.json();
      setCategories(list);
    } catch (e) {
      message.error("Не удалось загрузить категории");
    } finally {
      setCatLoading(false);
    }
  };

  const fetchSellers = async () => {
    setSellersLoading(true);
    try {
      const res = await fetch(API_USERS);
      const list: SellerUser[] = await res.json();
      const onlySellers = (list || []).filter(
        (u) => Array.isArray(u.roles) && u.roles.includes("Saler") && u.state === "Active"
      );
      setSellers(onlySellers);
    } catch (e) {
      message.error("Не удалось загрузить продавцов");
    } finally {
      setSellersLoading(false);
    }
  };

  const syncPagination = (pg?: ProductsResponse["pagination"]) => {
    if (!pg) return;
    setTotal(pg.totalItems ?? 0);
    setPage((prev) => (pg.currentPage && pg.currentPage !== prev ? pg.currentPage : prev));
    setPageSize((prev) => (pg.pageSize && pg.pageSize !== prev ? pg.pageSize : prev));
  };

  const fetchPaged = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * pageSize;
      const res = await fetch(`${API_PRODUCTS}?offset=${offset}&limit=${pageSize}`);
      const dto: ProductsResponse | any = await res.json();
      const items: Product[] = Array.isArray(dto) ? dto : dto.products ?? [];
      setData(items);
      if (!Array.isArray(dto) && dto.pagination) {
        syncPagination(dto.pagination);
      } else {
        setTotal(items.length);
      }
    } catch (e) {
      message.error("Не удалось загрузить товары");
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async () => {
    if (!debouncedQuery.trim()) {
      fetchPaged();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_PRODUCTS}/search?query=${encodeURIComponent(debouncedQuery)}`);
      const raw: any = await res.json();
      const items: Product[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.products)
        ? raw.products
        : [];
      const totalFromApi =
        !Array.isArray(raw) && raw?.pagination?.totalItems
          ? raw.pagination.totalItems
          : items.length;
      setData(items);
      setTotal(totalFromApi);
      if (!Array.isArray(raw) && raw?.pagination) {
        syncPagination(raw.pagination);
      }
    } catch (e) {
      message.error("Ошибка поиска");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); fetchSellers(); }, []);
  useEffect(() => { debouncedQuery.trim() ? searchProducts() : fetchPaged(); }, [page, pageSize, debouncedQuery]);

  const openModal = (record?: Product) => {
    setEditing(record || null);
    form.setFieldsValue(
      record || {
        title: "", description: "", price: 0, color: "", weight: 0,
        mainImageUrl: "", categoryId: undefined, sellerId: undefined, quantity: 0,
      }
    );
    setWithFiles(false);
    setMainFileList([]);
    setGalleryFileList([]);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
    setMainFileList([]);
    setGalleryFileList([]);
    form.resetFields();
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_PRODUCTS}/${id}`, { method: "DELETE" });
      if (res.ok) {
        message.success("Товар удалён");
        fetchPaged();
      } else {
        message.error("Не удалось удалить");
      }
    } catch (e) {
      message.error("Ошибка сервера");
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (editing) {
        // UPDATE (PUT без файлов)
        const res = await fetch(`${API_PRODUCTS}/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            price: values.price,
            color: values.color,
            weight: values.weight,
            mainImageUrl: values.mainImageUrl,
            categoryId: values.categoryId,
            quantity: values.quantity,
          }),
        });
        if (res.ok) {
          message.success("Товар обновлён");
          closeModal();
          fetchPaged();
        } else {
          message.error("Ошибка при обновлении");
        }
        return;
      }

      // CREATE
      if (withFiles) {
        // ⚠️ Требуем главное изображение
        const mainFile = mainFileList[0]?.originFileObj as File | undefined;
        if (!mainFile) {
          message.error("Добавьте главное изображение");
          return;
        }

        const fd = new FormData();
        fd.append("title", values.title);
        if (values.description) fd.append("description", values.description);
        fd.append("price", String(values.price ?? 0));
        if (values.color) fd.append("color", values.color);
        if (values.weight !== undefined) fd.append("weight", String(values.weight ?? 0));
        fd.append("categoryId", values.categoryId);
        if (values.sellerId) fd.append("sellerId", values.sellerId);
        fd.append("quantity", String(values.quantity ?? 0));

        // 🖼 главное + галерея
        fd.append("MainImage", mainFile);
        galleryFileList.forEach((f) => {
          const file = f.originFileObj as File;
          if (file) fd.append("AdditionalImages", file);
        });

        const res = await fetch(`${API_PRODUCTS}/with-files`, { method: "POST", body: fd });
        if (res.ok) {
          message.success("Товар создан (с файлами)");
          closeModal();
          fetchPaged();
        } else {
          message.error("Ошибка при создании");
        }
      } else {
        const res = await fetch(API_PRODUCTS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            price: values.price,
            color: values.color,
            weight: values.weight,
            mainImageUrl: values.mainImageUrl,
            categoryId: values.categoryId,
            sellerId: values.sellerId,
            quantity: values.quantity,
          }),
        });
        if (res.ok) {
          message.success("Товар создан");
          closeModal();
          fetchPaged();
        } else {
          message.error("Ошибка при создании");
        }
      }
    } catch (err: any) {
      if (err?.errorFields) {
        // ошибки валидации формы
      } else {
        message.error("Ошибка при сохранении");
      }
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Поиск по названию"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 280 }}
        />
        <Button icon={<ReloadOutlined />} onClick={() => { setQuery(""); fetchPaged(); }}>
          Обновить
        </Button>
        <Button type="primary" onClick={() => openModal()}>Создать товар</Button>

        <Button size="small" loading={catLoading} onClick={fetchCategories}>
          Обновить категории
        </Button>
        <Button size="small" icon={<UserSwitchOutlined />} loading={sellersLoading} onClick={fetchSellers}>
          Обновить продавцов
        </Button>
      </Space>

      <Table<Product>
        rowKey="id"
        dataSource={data}
        loading={loading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (p, s) => { setPage(p); setPageSize(s); },
        }}
        columns={[
          { title: "Название", dataIndex: "title" },
          { title: "Цена", dataIndex: "price", render: (v: number) => `${v} ₴` },
          { title: "Кол-во", dataIndex: "quantity" },
          { title: "Цвет", dataIndex: "color" },
          { title: "Вес", dataIndex: "weight" },
          {
            title: "Категория",
            dataIndex: "categoryId",
            render: (id: string) => {
              const cat = categories.find((x) => x.id === id);
              const label = cat ? (cat.title ?? cat.name ?? "(без назви)") : id || "—";
              const { bg, text } = colorForCategory(cat ? `${cat.id}|${label}` : id || label);
              return (
                <Tag style={{ backgroundColor: bg, color: text, border: "none" }}>
                  {label}
                </Tag>
              );
            },
          },
          {
            title: "Продавец",
            dataIndex: "sellerId",
            render: (id?: string) => getSellerLabel(id),
          },
          {
            title: "Действия",
            render: (_, r) => (
              <Space>
                <Button type="link" onClick={() => openModal(r)}>Редактировать</Button>
                <Popconfirm title="Удалить товар?" onConfirm={() => handleDelete(r.id)}>
                  <Button danger type="link">Удалить</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        open={isOpen}
        title={editing ? "Редактировать товар" : "Создать товар"}
        onCancel={closeModal}
        onOk={handleSave}
        width={760}
      >
        {!editing && (
          <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
            <span>Создать с файлами</span>
            <Switch checked={withFiles} onChange={setWithFiles} />
            <Button size="small" loading={catLoading} onClick={fetchCategories}>
              Обновить категории
            </Button>
            <Button size="small" icon={<UserSwitchOutlined />} loading={sellersLoading} onClick={fetchSellers}>
              Обновить продавцов
            </Button>
          </Space>
        )}

        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Название" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Space size="middle" style={{ display: "flex" }}>
            <Form.Item name="price" label="Цена" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="quantity" label="Кол-во" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Space>

          <Space size="middle" style={{ display: "flex" }}>
            <Form.Item name="color" label="Цвет"><Input /></Form.Item>
            <Form.Item name="weight" label="Вес"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          </Space>

          {/* При создании без файлов — оставляем URL */}
          {!withFiles && !editing && (
            <Form.Item name="mainImageUrl" label="Главное изображение (URL)">
              <Input placeholder="https://..." />
            </Form.Item>
          )}

          <Space size="middle" style={{ display: "flex" }}>
            <Form.Item
              name="categoryId"
              label="Категория"
              rules={[{ required: true, message: "Выберите категорию" }]}
              style={{ flex: 1 }}
            >
              <Select
                loading={catLoading}
                placeholder="Выберите категорию"
                options={categories.map((c) => ({
                  value: c.id,
                  label: c.title ?? c.name ?? "(без назви)",
                }))}
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string).toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item name="sellerId" label="Продавец" style={{ flex: 1 }}>
              <Select
                allowClear
                loading={sellersLoading}
                placeholder="Выберите продавца (опц.)"
                options={sellers.map((u) => ({
                  value: u.id,
                  label: `${u.name} ${u.surname} (${u.email})`,
                }))}
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string).toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>
          </Space>

          {/* 🔁 Новый UI загрузки изображений — только при создании с файлами */}
          {!editing && withFiles && (
            <>
              <Form.Item
                label="Главное изображение"
                required
                validateStatus={mainFileList.length ? "success" : "error"}
                help={mainFileList.length ? undefined : "Добавьте главное изображение"}
              >
                <Upload.Dragger
                  accept="image/*"
                  listType="picture-card"
                  maxCount={1}
                  fileList={mainFileList}
                  beforeUpload={beforeUploadValidate}
                  onChange={({ fileList }) => setMainFileList(fileList)}
                  onRemove={() => { setMainFileList([]); return true; }}
                >
                  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                  <p className="ant-upload-text">Перетащите главное изображение или кликните</p>
                </Upload.Dragger>
              </Form.Item>

              <Form.Item label="Галерея (доп. изображения)">
                <Upload.Dragger
                  multiple
                  accept="image/*"
                  listType="picture-card"
                  fileList={galleryFileList}
                  beforeUpload={beforeUploadValidate}
                  onChange={({ fileList }) => setGalleryFileList(fileList)}
                >
                  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                  <p className="ant-upload-text">Перетащите файлы или кликните для выбора</p>
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
