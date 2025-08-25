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
  // иногда ToDto может вернуть массивы/счётчики — подстрахуемся
  products?: unknown[];
  characteristics?: unknown[];
  productsCount?: number;
  characteristicsCount?: number;
};

const API_CATEGORY = "http://localhost:8080/api/category";

// Разрешённые статусы (синхронно с твоей моделью CategoryState)
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

  // client-side поиск по имени
  const [query, setQuery] = useState("");
  const q = useMemo(() => query.trim().toLowerCase(), [query]);
  const filtered = useMemo(
    () => data.filter(c => c.name?.toLowerCase().includes(q)),
    [data, q]
  );

  const fetchCategories = async () => {
    setLoading(true);
    console.log("📥 [fetchCategories] start");
    try {
      const res = await fetch(API_CATEGORY);
      const list: CategoryDto[] = await res.json();
      console.log("✅ [fetchCategories] success", list);
      setData(list);
    } catch (e) {
      console.error("❌ [fetchCategories] error", e);
      message.error("Не удалось загрузить категории");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openModal = (row?: CategoryDto) => {
    setEditing(row || null);
    form.setFieldsValue(row || { name: "", status: "Active" });
    setIsOpen(true);
    console.log("📂 [modal] open", row ? { mode: "edit", id: row.id } : { mode: "create" });
  };
  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
    form.resetFields();
    console.log("📂 [modal] close");
  };

  const handleDelete = async (id: string) => {
    console.log("🗑 [deleteCategory] try", id);
    try {
      const res = await fetch(`${API_CATEGORY}/${id}`, { method: "DELETE" });
      if (res.ok) {
        message.success("Категория удалена");
        console.log("✅ [deleteCategory] success", id);
        fetchCategories();
      } else {
        console.warn("⚠️ [deleteCategory] status", res.status);
        message.error("Не удалось удалить категорию");
      }
    } catch (e) {
      console.error("❌ [deleteCategory] error", e);
      message.error("Ошибка сервера");
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields(); // { name, status }
      console.log("💾 [saveCategory] submit", { values, editing });

      if (editing) {
        // UPDATE
        const res = await fetch(`${API_CATEGORY}/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editing.id, ...values }),
        });
        if (res.ok) {
          message.success("Категория обновлена");
          console.log("✅ [updateCategory] success", editing.id);
          closeModal();
          fetchCategories();
        } else {
          console.warn("⚠️ [updateCategory] status", res.status);
          message.error("Ошибка при обновлении категории");
        }
      } else {
        // CREATE
        const res = await fetch(API_CATEGORY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values), // сервис сам выставит Id/CreatedAt
        });
        if (res.ok) {
          message.success("Категория создана");
          console.log("✅ [createCategory] success");
          closeModal();
          fetchCategories();
        } else {
          console.warn("⚠️ [createCategory] status", res.status);
          message.error("Ошибка при создании категории");
        }
      }
    } catch (err: any) {
      if (err?.errorFields) {
        console.warn("⚠️ [form] validation", err.errorFields);
      } else {
        console.error("❌ [saveCategory] error", err);
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
          placeholder="Поиск по имени категории"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 320 }}
        />
        <Button icon={<ReloadOutlined />} onClick={fetchCategories}>
          Обновить
        </Button>
        <Button type="primary" onClick={() => openModal()}>Создать категорию</Button>
      </Space>

      <Table<CategoryDto>
        rowKey="id"
        dataSource={filtered}
        loading={loading}
        columns={[
          { title: "Название", dataIndex: "name" },
          {
            title: "Статус",
            dataIndex: "status",
            render: (s: string) => <Tag color={statusColor(s)}>{s}</Tag>,
          },
          {
            title: "Товаров",
            render: (_, r) => getCount(r, "products", "productsCount"),
          },
          {
            title: "Характеристик",
            render: (_, r) => getCount(r, "characteristics", "characteristicsCount"),
          },
          { title: "Создана", dataIndex: "createdAt", render: (v) => fmtDate(v as string) },
          {
            title: "Действия",
            render: (_, r) => (
              <Space>
                <Button type="link" onClick={() => openModal(r)}>Редактировать</Button>
                <Popconfirm title="Удалить категорию?" onConfirm={() => handleDelete(r.id)}>
                  <Button danger type="link">Удалить</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        open={isOpen}
        title={editing ? "Редактировать категорию" : "Создать категорию"}
        onCancel={closeModal}
        onOk={handleSave}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(_, all) => console.log("✏️ [form] change:", all)}
        >
          <Form.Item name="name" label="Название" rules={[{ required: true, message: "Введите название" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="status" label="Статус" rules={[{ required: true, message: "Выберите статус" }]}>
            <Select
              options={STATUS_OPTIONS.map(s => ({ value: s, label: s }))}
              placeholder="Выберите статус"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
