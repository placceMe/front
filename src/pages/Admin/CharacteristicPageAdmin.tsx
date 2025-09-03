// src/pages/admin/CharacteristicDictAdmin.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Table, Button, Popconfirm, Modal, Form, Input, Select, Space, message, Tag,
} from "antd";
import { SearchOutlined, PlusOutlined, ReloadOutlined, DatabaseOutlined } from "@ant-design/icons";

const API_CATEGORIES = __BASE_URL__ + "/api/category";
const API_DICT = __BASE_URL__ + "/api/characteristicdict";

type Category = { id: string; name?: string; title?: string; };
type Dict = {
  id: string;
  name: string;
  code: string;
  type: string;
  categoryId: string;
  createdAt?: string;
};

const TYPE_OPTIONS = ["string", "number", "boolean", "select", "multiselect", "date", "range"] as const;

const typeColor = (t: string) =>
  t === "string" ? "blue" :
    t === "number" ? "purple" :
      t === "boolean" ? "green" :
        t === "select" ? "gold" :
          t === "multiselect" ? "magenta" :
            t === "date" ? "cyan" :
              t === "range" ? "volcano" : "default";

const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "—");

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* ------------------ детерміновані кольори для категорій ------------------ */
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
/* ------------------------------------------------------------------- */

const CharacteristicDictAdmin: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState<string | undefined>();

  const [data, setData] = useState<Dict[]>([]);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Dict | null>(null);
  const [form] = Form.useForm();

  const [query, setQuery] = useState("");
  const q = useMemo(() => query.trim().toLowerCase(), [query]);

  const filtered = useMemo(
    () =>
      data.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.code?.toLowerCase().includes(q)
      ),
    [data, q]
  );

  const catLabel = (id?: string) => {
    const c = categories.find(c => c.id === id);
    return c ? (c.name ?? c.title ?? "(без назви)") : "—";
  };

  const categoryColorMap = useMemo(() => {
    const map = new Map<string, { bg: string; text: string; }>();
    categories.forEach(c => {
      const label = c.name ?? c.title ?? "(без назви)";
      map.set(c.id, colorForCategory(`${c.id}|${label}`));
    });
    return map;
  }, [categories]);

  // ====== Fetch ======
  const fetchCategories = async () => {
    setCatLoading(true);
    try {
      const res = await fetch(API_CATEGORIES);
      const list: Category[] = await res.json();
      setCategories(list);
      if (!selectedCatId && list?.length) setSelectedCatId(list[0].id);
    } catch (e) {
      message.error("Не вдалося завантажити категорії");
    } finally {
      setCatLoading(false);
    }
  };

  const fetchDicts = async (categoryId: string) => {
    if (!categoryId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_DICT}/category/${categoryId}`);
      const list: Dict[] = await res.json();
      setData(list || []);
    } catch (e) {
      message.error("Не вдалося завантажити характеристики категорії");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { if (selectedCatId) fetchDicts(selectedCatId); }, [selectedCatId]);

  // ====== Modal ======
  const openModal = (row?: Dict) => {
    setEditing(row || null);
    form.setFieldsValue(
      row
        ? { ...row, modalCategoryId: row.categoryId }
        : { name: "", code: "", type: "string", modalCategoryId: selectedCatId }
    );
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    const curCode = form.getFieldValue("code");
    if (!curCode) {
      form.setFieldsValue({ code: slugify(v) });
    }
  };

  const validateUniqueCodeInCategory = async (_: any, value: string) => {
    const code = slugify(value || "");
    const modalCategoryId = form.getFieldValue("modalCategoryId") as string | undefined;
    if (!code || !modalCategoryId) return Promise.resolve();

    const exists = data.some(
      d =>
        d.categoryId === modalCategoryId &&
        d.code.toLowerCase() === code.toLowerCase() &&
        d.id !== editing?.id
    );
    if (exists) {
      return Promise.reject(new Error("Код вже використовується в цій категорії"));
    }
    return Promise.resolve();
  };

  // ====== CRUD ======
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload: Partial<Dict> = {
        name: values.name.trim(),
        code: slugify(values.code || values.name),
        type: values.type,
        categoryId: values.modalCategoryId,
      };

      if (editing) {
        const res = await fetch(`${API_DICT}/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...payload }),
        });
        if (res.ok) {
          message.success("Характеристику оновлено");
          closeModal();
          if (selectedCatId) fetchDicts(selectedCatId);
        } else {
          message.error("Помилка оновлення");
        }
        return;
      }

      const res = await fetch(API_DICT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        message.success("Характеристику створено");
        closeModal();
        if (selectedCatId) fetchDicts(selectedCatId);
      } else {
        message.error("Помилка створення");
      }
    } catch (err: any) {
      if (!err?.errorFields) {
        message.error("Помилка при збереженні");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_DICT}/${id}`, { method: "DELETE" });
      if (res.ok) {
        message.success("Характеристику видалено");
        if (selectedCatId) fetchDicts(selectedCatId);
      } else {
        message.error("Не вдалося видалити");
      }
    } catch {
      message.error("Помилка сервера");
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Select
          loading={catLoading}
          value={selectedCatId}
          onChange={setSelectedCatId}
          placeholder="Оберіть категорію"
          style={{ minWidth: 320 }}
          options={categories.map(c => ({
            value: c.id,
            label: c.name ?? c.title ?? "(без назви)",
          }))}
          showSearch
          filterOption={(input, option) =>
            (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
          }
        />
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Пошук за назвою чи кодом"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 320 }}
        />
        <Button icon={<ReloadOutlined />} onClick={() => selectedCatId && fetchDicts(selectedCatId)}>
          Оновити
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          disabled={!selectedCatId}
        >
          Додати характеристику
        </Button>
      </Space>

      <Table<Dict>
        rowKey="id"
        dataSource={filtered}
        loading={loading}
        columns={[
          { title: "Назва", dataIndex: "name" },
          { title: "Код", dataIndex: "code", render: (v: string) => <code>{v}</code> },
          {
            title: "Тип",
            dataIndex: "type",
            render: (t: string) => <Tag color={typeColor(t)}>{t}</Tag>,
          },
          {
            title: "Категорія",
            dataIndex: "categoryId",
            render: (id: string) => {
              const label = catLabel(id);
              const col = categoryColorMap.get(id) ?? colorForCategory(`${id}|${label}`);
              return (
                <Tag style={{ backgroundColor: col.bg, color: col.text, border: "none" }}>
                  {label}
                </Tag>
              );
            },
          },
          { title: "Створено", dataIndex: "createdAt", render: (v) => fmtDate(v as string) },
          {
            title: "Дії",
            render: (_, r) => (
              <Space>
                <Button type="link" icon={<DatabaseOutlined />} onClick={() => openModal(r)}>
                  Редагувати
                </Button>
                <Popconfirm title="Видалити характеристику?" onConfirm={() => handleDelete(r.id)}>
                  <Button danger type="link">Видалити</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        open={isOpen}
        title={editing ? "Редагувати характеристику" : "Створити характеристику"}
        onCancel={closeModal}
        onOk={handleSave}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="modalCategoryId"
            label="Категорія"
            rules={[{ required: true, message: "Оберіть категорію" }]}
          >
            <Select
              loading={catLoading}
              placeholder="Оберіть категорію"
              options={categories.map(c => ({
                value: c.id,
                label: c.name ?? c.title ?? "(без назви)",
              }))}
              showSearch
              filterOption={(input, option) =>
                (option?.label as string).toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item name="name" label="Назва" rules={[{ required: true, message: "Введіть назву" }]}>
            <Input onChange={onNameChange} />
          </Form.Item>

          <Form.Item
            name="code"
            label="Код (латиниця/цифри/дефіс)"
            tooltip="Стабільний ключ. Якщо залишити порожнім — згенерується з назви."
            rules={[
              { pattern: /^[a-z0-9-]*$/, message: "Лише латиниця, цифри та дефіс" },
              { validator: validateUniqueCodeInCategory },
            ]}
          >
            <Input placeholder="наприклад: screen-size" />
          </Form.Item>

          <Form.Item name="type" label="Тип" rules={[{ required: true, message: "Оберіть тип" }]}>
            <Select
              options={TYPE_OPTIONS.map(t => ({ value: t, label: t }))}
              placeholder="Оберіть тип"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CharacteristicDictAdmin;
