// src/admin/pages/AdminProducts.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Table, Input, Tag, Space, Button, Select, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";


import { MdCheck, MdClose, MdPending, MdSearch } from "react-icons/md";
import { useAdminApi, type Product, type ProductState } from "../api/api";

const stateColors: Record<string, string> = {
  Active: "green",
  Moderation: "gold",
  Draft: "default",
  Rejected: "red",
};

const stateOptions: ProductState[] = ["Moderation", "Active", "Rejected", "Draft"];

const PAGE_SIZE = 20;

const AdminProducts: React.FC = () => {
  const api = useAdminApi();
  const [data, setData] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<string | undefined>(undefined);

  const [moderateId, setModerateId] = useState<string | null>(null);
  const [nextState, setNextState] = useState<ProductState>("Active");
  const [comment, setComment] = useState("");
const fetch = async () => {
  setLoading(true);
  try {
    const res = await api.getProducts({ page, pageSize: PAGE_SIZE, search, state: stateFilter });
    if (!res) return; 
    setData(res.products ?? []);
    setTotal(res.pagination?.totalItems ?? 0);
  } catch (e) {
    console.error(e);
    message.error("Не удалось загрузить товары");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => { fetch(); }, [page, stateFilter]); // search — по кнопке

  const columns: ColumnsType<Product> = useMemo(() => [
    { title: "Название", dataIndex: "title", key: "title", ellipsis: true },
    { title: "Цена", dataIndex: "price", key: "price", width: 110, render: (v) => `${v} ₴` },
    {
      title: "Категория",
      dataIndex: ["category", "name"],
      key: "category",
      width: 160,
      render: (_, r) => r.category?.name ?? "-",
    },
    {
      title: "Статус",
      dataIndex: "state",
      key: "state",
      width: 140,
      render: (s: string) => <Tag color={stateColors[s] ?? "default"}>{s}</Tag>,
      filters: stateOptions.map(s => ({ text: s, value: s })),
      onFilter: (value, record) => (record.state === value),
    },
    {
      title: "Продавец",
      dataIndex: "sellerId",
      key: "sellerId",
      width: 220,
      render: (v: string) => v?.slice(0, 6) + "…" + v?.slice(-4),
    },
    {
      title: "Действия",
      key: "actions",
      width: 260,
      render: (_, r) => (
        <Space wrap>
          <Button icon={<MdPending />} onClick={() => openModeration(r.id, "Moderation")}>На модерации</Button>
          <Button type="primary" icon={<MdCheck />} onClick={() => openModeration(r.id, "Active")}>Одобрить</Button>
          <Button danger icon={<MdClose />} onClick={() => openModeration(r.id, "Rejected")}>Отклонить</Button>
        </Space>
      )
    }
  ], []);

  const openModeration = (id: string, s: ProductState) => {
    setModerateId(id);
    setNextState(s);
    setComment("");
  };

  const applyModeration = async () => {
    if (!moderateId) return;
    try {
      await api.updateProductState(moderateId, nextState, comment || undefined);
      message.success("Статус обновлён");
      setModerateId(null);
      fetch();
    } catch (e) {
      console.error(e);
      message.error("Ошибка обновления статуса");
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <Input
          allowClear
          placeholder="Поиск по названию/описанию"
          prefix={<MdSearch />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={() => { setPage(1); fetch(); }}
          style={{ maxWidth: 420 }}
        />
        <Select
          allowClear
          placeholder="Фильтр по статусу"
          style={{ width: 220 }}
          options={stateOptions.map(s => ({ label: s, value: s }))}
          value={stateFilter}
          onChange={(v) => { setStateFilter(v); setPage(1); }}
        />
        <Button onClick={() => { setPage(1); fetch(); }}>Искать</Button>
      </div>

      <Table<Product>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{
          total,
          current: page,
          pageSize: PAGE_SIZE,
          onChange: setPage,
          showSizeChanger: false,
        }}
      />

      <Modal
        open={!!moderateId}
        onCancel={() => setModerateId(null)}
        onOk={applyModeration}
        okText="Сохранить"
        title={`Изменить статус на: ${nextState}`}
      >
        <div className="flex flex-col gap-2">
          <label>Комментарий модерации (необязательно, для "Отправить на доработку" — желательно):</label>
          <Input.TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Например: добавьте реальные фото, укажите вес и цвет."
          />
        </div>
      </Modal>
    </div>
  );
};

export default AdminProducts;
