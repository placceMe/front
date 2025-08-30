import React, { useEffect, useMemo, useState } from "react";
import {
  Table, Button, Popconfirm, Modal, Form, Input, message, Space, Tag, Select,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

type CategoryDto = {
  id: string;
  name: string;
  status: string;
  createdAt?: string;
  products?: unknown[];
  characteristics?: unknown[];
  productsCount?: number;
  characteristicsCount?: number;
};

const API_CATEGORY = "http://localhost:8080/api/category";

// Дозволені статуси (синхронно з моделлю CategoryState)
const STATUS_OPTIONS = ["Active", "Inactive", "Deleted"] as const;
const statusColor = (s: string) =>
  s === "Active" ? "green" : s === "Inactive" ? "default" : "volcano";

const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "—");
const getCount = (row: CategoryDto, keyArr: keyof CategoryDto, keyNum: keyof CategoryDto) => {
  const arr = row[keyArr] as unknown[] | undefined;
  const num = row[keyNum] as number | undefined;
  return typeof num === "number" ? num : Array.isArray(arr) ? arr.length : 0;
};

const CategoriesPage: React.FC = () => {
  const [data, setData] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryDto | null>(null);
  const [form] = Form.useForm();

  // клієнтський пошук по назві
  const [query, setQuery] = useState("");
  const q = useMemo(() => query.trim().toLowerCase(), [query]);
  const filtered = useMemo(
    () => data.filter(c => c.name?.toLowerCase().includes(q)),
    [data, q]
  );

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_CATEGORY + "/full-info");
      const list: CategoryDto[] = await res.json();
      setData(list);
    } catch (e) {
      message.error("Не вдалося завантажити категорії");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openModal = (row?: CategoryDto) => {
    setEditing(row || null);
    form.setFieldsValue(row || { name: "", status: "Active" });
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_CATEGORY}/${id}`, { method: "DELETE" });
      if (res.ok) {
        message.success("Категорію видалено");
        fetchCategories();
      } else {
        message.error("Не вдалося видалити категорію");
      }
    } catch (e) {
      message.error("Помилка сервера");
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields(); // { name, status }

      if (editing) {
        // ОНОВЛЕННЯ
        const res = await fetch(`${API_CATEGORY}/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...values }),
        });
        if (res.ok) {
          message.success("Категорію оновлено");
          closeModal();
          fetchCategories();
        } else {
          message.error("Помилка при оновленні категорії");
        }
      } else {
        // СТВОРЕННЯ
        const res = await fetch(API_CATEGORY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (res.ok) {
          message.success("Категорію створено");
          closeModal();
          fetchCategories();
        } else {
          message.error("Помилка при створенні категорії");
        }
      }
    } catch (err: any) {
      if (!err?.errorFields) {
        message.error("Помилка при збереженні");
      }
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Пошук за назвою категорії"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 320 }}
        />
        <Button icon={<ReloadOutlined />} onClick={fetchCategories}>
          Оновити
        </Button>
        <Button type="primary" onClick={() => openModal()}>Створити категорію</Button>
      </Space>

      <Table<CategoryDto>
        rowKey="id"
        dataSource={filtered}
        loading={loading}
        columns={[
          { title: "Назва", dataIndex: "name" },
          {
            title: "Статус",
            dataIndex: "status",
            render: (s: string) => <Tag color={statusColor(s)}>{s}</Tag>,
          },
          {
            title: "Товарів",
            render: (_, r) => getCount(r, "products", "productsCount"),
          },
          {
            title: "Характеристик",
            render: (_, r) => getCount(r, "characteristics", "characteristicsCount"),
          },
          { title: "Створена", dataIndex: "createdAt", render: (v) => fmtDate(v as string) },
          {
            title: "Дії",
            render: (_, r) => (
              <Space>
                <Button type="link" onClick={() => openModal(r)}>Редагувати</Button>
                <Popconfirm title="Видалити категорію?" onConfirm={() => handleDelete(r.id)}>
                  <Button danger type="link">Видалити</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        open={isOpen}
        title={editing ? "Редагувати категорію" : "Створити категорію"}
        onCancel={closeModal}
        onOk={handleSave}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Назва" rules={[{ required: true, message: "Введіть назву" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="status" label="Статус" rules={[{ required: true, message: "Оберіть статус" }]}>
            <Select
              options={STATUS_OPTIONS.map(s => ({ value: s, label: s }))}
              placeholder="Оберіть статус"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
