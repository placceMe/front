
import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Popconfirm, Rate, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useAdminApi, type FeedbackItem } from "@features/admin/Products/api/api";


const PAGE_SIZE = 20;

const AdminFeedback: React.FC = () => {
  const api = useAdminApi();
  const [data, setData] = useState<FeedbackItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [productId, setProductId] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
  setLoading(true);
  try {
    const res = await api.getFeedback({
      page,
      pageSize: PAGE_SIZE,
      productId: productId || undefined,
      userId: userId || undefined,
    });

    setData(res?.items ?? []);
    setTotal(res?.total ?? 0);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => { fetch(); }, [page]); // фильтры — по кнопке

  const columns: ColumnsType<FeedbackItem> = [
    { title: "Товар", dataIndex: "productName", key: "productName", render: (v, r) => v ?? r.productId?.slice(0,6)+"…", ellipsis: true },
    { title: "Пользователь", dataIndex: "userId", key: "userId", width: 220, render: (v) => v?.slice(0,6)+"…"+v?.slice(-4) },
    { title: "Оценка (avg)", dataIndex: "ratingAverage", key: "ratingAverage", width: 140, render: (v) => <Tag color="blue">{v?.toFixed?.(2) ?? v}</Tag> },
    { title: "Контент", dataIndex: "content", key: "content", ellipsis: true },
    {
      title: "Детали",
      key: "ratings",
      width: 260,
      render: (_, r) => (
        <Space wrap>
          <span>Сервис: <Rate disabled value={r.ratingService} /></span>
          <span>Скорость: <Rate disabled value={r.ratingSpeed} /></span>
        </Space>
      )
    },
    {
      title: "Действия",
      key: "actions",
      width: 120,
      render: (_, r) => (
        <Popconfirm title="Удалить отзыв?" onConfirm={async () => { await api.deleteFeedback(r.id); fetch(); }}>
          <Button danger>Удалить</Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <Input
          placeholder="Фильтр по productId"
          allowClear
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <Input
          placeholder="Фильтр по userId"
          allowClear
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <Button onClick={() => { setPage(1); fetch(); }}>Применить</Button>
      </div>

      <Table<FeedbackItem>
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
    </div>
  );
};

export default AdminFeedback;
