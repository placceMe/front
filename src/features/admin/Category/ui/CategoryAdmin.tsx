/*import { useEffect, useState } from "react";
import { useCategoryAdminApi } from "../api/useCategoryAdminApi";
import { Button, Form, Input, Table } from "antd";

const CategoryAdmin: React.FC = () => {

    const [categories, setCategories] = useState<any[]>([]);
    const { fetchCategories, addCategory, loading } = useCategoryAdminApi();

    const loadCategories = async () => {
        const data = await fetchCategories();

        if (data) {
            setCategories(data as any[]);
        }
    };

    useEffect(() => {

        loadCategories();
    }, []);

    const handleAddCategory = async (category: any) => {

        await addCategory(category);
        loadCategories();
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Category Admin</h1>
            <Form style={{ width: 600 }} onFinish={handleAddCategory}>
                <Form.Item name="name" label="Name">
                    <Input />
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={loading}>
                    Add Category
                </Button>
            </Form>

            <Table
                style={{ width: 600 }}
                dataSource={categories}
                columns={[
                    { title: 'ID', dataIndex: 'id', key: 'id' },
                    { title: 'Name', dataIndex: 'name', key: 'name' },
                    { title: 'Description', dataIndex: 'status', key: 'status' },
                ]}
                rowKey="id"
                loading={loading}
                pagination={false}
            />
        </div>
    );
};

export default CategoryAdmin;
*/

import { useEffect, useMemo, useState } from "react";
import {
  Button, Card, Empty, Form, Input, Table, AutoComplete,
  Space, Tag, message, Typography, Tooltip, Select, Modal
} from "antd";
import { MdContentCopy, MdEdit } from "react-icons/md";
import { useCategoryAdminApi } from "../api/useCategoryAdminApi";
import type { Category, CategoryState } from "@shared/types/api";

const SUGGESTED = [
  "Бронежилети","Плитоноски","Тактичні шоломи та аксесуари",
  "Тактичне взуття","Тактичний одяг","Активні навушники та аксесуари",
  "Тактичне спорядження",
];

const normalize = (s: string) => s.trim().toLowerCase();
const short = (id: string) => id.length > 12 ? `${id.slice(0,6)}…${id.slice(-4)}` : id;

const STATUS_OPTIONS: Category["status"][] = ["Active", "Hidden", "Archived","Deleted"];
const statusColor: Record<CategoryState, string> = {
  Active: "green",
  Hidden: "blue",      // 👈 новый статус
  Archived: "gold",
  Deleted: "red",
};


const CategoryAdmin: React.FC = () => {
    
  const [categories, setCategories] = useState<Category[]>([]);
  const [value, setValue] = useState("");
  const [edit, setEdit] = useState<{ id: string; name: string } | null>(null);

  const { fetchCategories, addCategory, updateCategory, loading } = useCategoryAdminApi();

  const existNames = useMemo(() => new Set(categories.map(c => normalize(c.name))), [categories]);
  const options = useMemo(
    () => SUGGESTED.filter(x => normalize(x).includes(normalize(value))).map(x => ({ value: x })),
    [value]
  );

  const load = async () => {
  const data = await fetchCategories();
  setCategories(data);
};
  useEffect(() => { load(); }, []);

  const add = async (nameRaw: string) => {
    const name = nameRaw.trim();
    if (!name) return message.warning("Введіть назву категорії");
    if (existNames.has(normalize(name))) return message.info("Така категорія вже існує");
    try {
      await addCategory({ name });
      message.success("Категорію внесено до БД");
      setValue("");
      await load();
    } catch (e) {
      console.error(e);
      message.error("Помилка при створенні категорії");
    }
  };

  const onSubmit = async () => add(value);
  const quickAdd = async (name: string) => add(name);

  const onStatusChange = async (id: string, status: Category["status"]) => {
    try {
      await updateCategory(id, { status });
      setCategories(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      message.success("Статус оновлено");
    } catch (e) {
      console.error(e);
      message.error("Не вийшло оновити статус");
    }
  };

  const openEdit = (row: Category) => setEdit({ id: row.id, name: row.name });
  const saveEdit = async () => {
    if (!edit) return;
    const name = edit.name.trim();
    if (!name) return message.warning("Назва не може бути з пустим полем");
    try {
      await updateCategory(edit.id, { name });
      setCategories(prev => prev.map(c => c.id === edit.id ? { ...c, name } : c));
      message.success("Категорія оновлена");
      setEdit(null);
    } catch (e) {
      console.error(e);
      message.error("Не вийшло оновити категорію");
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 16 }}>
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>Категорії</Typography.Title>

          {/* Добавление */}
          <Form layout="inline" onFinish={onSubmit} style={{ gap: 8, flexWrap: "wrap" }}>
            <Form.Item style={{ flex: "1 1 420px", marginBottom: 0 }}>
              <AutoComplete value={value} options={options} onChange={setValue} style={{ width: "100%" }}>
                <Input size="large" placeholder="Введіть або оберіть категорію" onPressEnter={onSubmit} />
              </AutoComplete>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" size="large" htmlType="submit" loading={loading}>Додати</Button>
            </Form.Item>
          </Form>

          {/* Быстрые подсказки */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SUGGESTED.map((s) => {
              const exists = existNames.has(normalize(s));
              return (
                <Tag
                  key={s}
                  color={exists ? "default" : "green"}
                  style={{ cursor: exists ? "not-allowed" : "pointer", padding: "6px 10px", borderRadius: 8 }}
                  onClick={() => !exists && quickAdd(s)}
                >
                  {s}
                </Tag>
              );
            })}
          </div>

          {/* Таблица */}
          <Table<Category>
            size="middle"
            dataSource={categories}
            rowKey="id"
            loading={loading}
            pagination={false}
            locale={{ emptyText: <Empty description="Категорій немає" /> }}
            columns={[
              {
                title: "ID",
                dataIndex: "id",
                width: 260,
                render: (id: string) => (
                  <Space>
                    <Tooltip title={id}>
                      <Typography.Text code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
                        {short(id)}
                      </Typography.Text>
                    </Tooltip>
                    <Button
                      type="text"
                      icon={<MdContentCopy size={16} />}
                      onClick={() => navigator.clipboard.writeText(id).then(() => message.success("ID скопирован"))}
                    />
                  </Space>
                ),
              },
              { title: "Name", dataIndex: "name" },
              {
                title: "Status",
                dataIndex: "status",
                width: 220,
                render: (_: any, row) => (
                  <Space>
                    <Tag color={statusColor[row.status]} style={{ marginRight: 8 }}>{row.status}</Tag>
                    <Select
                      size="small"
                      value={row.status}
                      style={{ width: 120 }}
                      options={STATUS_OPTIONS.map(s => ({ value: s, label: s }))}
                      onChange={(val) => onStatusChange(row.id, val)}
                    />
                  </Space>
                ),
              },
              {
                title: "Actions",
                width: 120,
                render: (_: any, row) => (
                  <Button icon={<MdEdit />} onClick={() => openEdit(row)}>Редактировать</Button>
                ),
              },
            ]}
            style={{ marginTop: 8 }}
          />
        </Space>
      </Card>

      {/* Modal edit */}
      <Modal
        title="Редактировать категорию"
        open={!!edit}
        onOk={saveEdit}
        onCancel={() => setEdit(null)}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Input
          value={edit?.name ?? ""}
          onChange={(e) => setEdit((p) => (p ? { ...p, name: e.target.value } : p))}
          placeholder="Название категории"
        />
      </Modal>
    </div>
  );
};

export default CategoryAdmin;
