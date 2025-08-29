// src/pages/admin/OrdersPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Table, Button, Popconfirm, Modal, Form, Input, InputNumber, message, Space, Tag, Select, DatePicker, Divider,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReloadOutlined, SearchOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

type OrderStatus = "Pending" | "Confirmed" | "Rejected" | "Shipped" | "Delivered" | "Cancelled";

type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: { id: string; name?: string; title?: string; price?: number };
};

type Order = {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus | string;
  notes?: string | null;
  deliveryAddress?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

const API_ORDERS = "http://localhost:8080/api/orders";

// кольори бейджів для статусів
const STATUS_COLORS: Record<OrderStatus, { color: string; label: string }> = {
  Pending:   { color: "gold",  label: "Очікує" },
  Confirmed: { color: "green", label: "Підтверджено" },
  Rejected:  { color: "red",   label: "Відхилено" },
  Shipped:   { color: "blue",  label: "Відправлено" },
  Delivered: { color: "cyan",  label: "Доставлено" },
  Cancelled: { color: "volcano", label: "Скасовано" },
};

const statusOptions: { value: OrderStatus; label: string }[] = (Object.keys(STATUS_COLORS) as OrderStatus[])
  .map((s) => ({ value: s, label: STATUS_COLORS[s].label }));

const formatMoney = (v: number) => `${(v ?? 0).toLocaleString("uk-UA")} ₴`;

const OrdersPage: React.FC = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Фільтри (все локально)
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus[] | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [createdRange, setCreatedRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [minTotal, setMinTotal] = useState<number | undefined>(undefined);
  const [maxTotal, setMaxTotal] = useState<number | undefined>(undefined);

  const [openView, setOpenView] = useState(false);
  const [current, setCurrent] = useState<Order | null>(null);
  const [form] = Form.useForm<{ status: OrderStatus; notes?: string; deliveryAddress?: string }>();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ORDERS);
      if (!res.ok) throw new Error();
      const list: Order[] = await res.json();
      setAllOrders(Array.isArray(list) ? list : []);
    } catch {
      message.error("Не вдалося завантажити замовлення");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const resetFilters = () => {
    setSearch("");
    setStatus(undefined);
    setUserId(undefined);
    setCreatedRange(null);
    setMinTotal(undefined);
    setMaxTotal(undefined);
    setPage(1);
  };

  const filtered: Order[] = useMemo(() => {
    const s = search.trim().toLowerCase();
    const [from, to] = createdRange ?? [null, null];

    return allOrders.filter((o) => {
      if (status && status.length && !status.includes(o.status as OrderStatus)) return false;
      if (userId && o.userId !== userId) return false;
      if (from && dayjs(o.createdAt).isBefore(from, "day")) return false;
      if (to && dayjs(o.createdAt).isAfter(to, "day")) return false;
      if (typeof minTotal === "number" && o.totalAmount < minTotal) return false;
      if (typeof maxTotal === "number" && o.totalAmount > maxTotal) return false;
      if (s) {
        const hay = `${o.id} ${o.userId} ${o.notes ?? ""} ${o.deliveryAddress ?? ""}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }, [allOrders, status, userId, createdRange, minTotal, maxTotal, search]);

  const columns: ColumnsType<Order> = [
    { title: "ID замовлення", dataIndex: "id", width: 250, ellipsis: true },
    {
      title: "Користувач",
      dataIndex: "userId",
      width: 230,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: "Сума",
      dataIndex: "totalAmount",
      width: 120,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (v: number) => <b>{formatMoney(v)}</b>,
    },
    {
      title: "Статус",
      dataIndex: "status",
      width: 150,
      filters: statusOptions.map(o => ({ text: o.label, value: o.value })),
      onFilter: (value, record) => record.status === value,
      render: (st: string) => {
        const s = (st as OrderStatus) in STATUS_COLORS ? (st as OrderStatus) : "Pending";
        const meta = STATUS_COLORS[s as OrderStatus];
        return <Tag color={meta.color}>{meta.label}</Tag>;
      },
    },
    {
      title: "Створено",
      dataIndex: "createdAt",
      width: 170,
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (v: string) => dayjs(v).format("DD.MM.YYYY HH:mm"),
    },
    {
      title: "Дії",
      fixed: "right",
      width: 210,
      render: (_, r) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openViewModal(r)}>
            Деталі
          </Button>
          <Button
            icon={<CheckOutlined />}
            type="default"
            onClick={() => quickStatus(r.id, "Confirmed")}
            disabled={r.status === "Confirmed"}
          >
            Підтвердити
          </Button>
          <Button
            icon={<CloseOutlined />}
            danger
            type="default"
            onClick={() => quickStatus(r.id, "Rejected")}
            disabled={r.status === "Rejected"}
          >
            Відхилити
          </Button>
          <Popconfirm title="Видалити замовлення?" onConfirm={() => removeOrder(r.id)}>
            <Button danger type="link">Видалити</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const openViewModal = (o: Order) => {
    setCurrent(o);
    form.setFieldsValue({
      status: (Object.keys(STATUS_COLORS) as OrderStatus[]).includes(o.status as OrderStatus)
        ? (o.status as OrderStatus)
        : "Pending",
      notes: o.notes ?? "",
      deliveryAddress: o.deliveryAddress ?? "",
    });
    setOpenView(true);
  };

  const closeViewModal = () => {
    setOpenView(false);
    setCurrent(null);
    form.resetFields();
  };

  const quickStatus = async (id: string, s: OrderStatus) => {
    try {
      const res = await fetch(`${API_ORDERS}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: s }),
      });
      if (!res.ok) throw new Error();
      message.success("Статус оновлено");
      setAllOrders(prev => prev.map(o => (o.id === id ? { ...o, status: s, updatedAt: new Date().toISOString() } : o)));
    } catch {
      message.error("Помилка при оновленні статусу");
    }
  };

  const saveFromModal = async () => {
    if (!current) return;
    try {
      const values = await form.validateFields();
      const res1 = await fetch(`${API_ORDERS}/${current.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: values.status }),
      });
      if (!res1.ok) throw new Error();

      const res2 = await fetch(`${API_ORDERS}/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: values.notes ?? null,
          deliveryAddress: values.deliveryAddress ?? null,
        }),
      });
      if (!res2.ok) throw new Error();

      setAllOrders(prev =>
        prev.map(o =>
          o.id === current.id
            ? {
                ...o,
                status: values.status,
                notes: values.notes ?? null,
                deliveryAddress: values.deliveryAddress ?? null,
                updatedAt: new Date().toISOString(),
              }
            : o
        )
      );

      message.success("Замовлення оновлено");
      closeViewModal();
    } catch {
      message.error("Не вдалося зберегти зміни");
    }
  };

  const removeOrder = async (id: string) => {
    try {
      const res = await fetch(`${API_ORDERS}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setAllOrders(prev => prev.filter(o => o.id !== id));
      message.success("Замовлення видалено");
    } catch {
      message.error("Помилка при видаленні");
    }
  };

  const userOptions = useMemo(() => {
    const ids = Array.from(new Set(allOrders.map(o => o.userId)));
    return ids.map(id => ({ value: id, label: id }));
  }, [allOrders]);

  return (
    <div>
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Пошук (ID замовлення, користувач, адреса, нотатки)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 360 }}
        />

        <Select
          allowClear
          mode="multiple"
          placeholder="Статуси"
          style={{ minWidth: 220 }}
          value={status}
          onChange={setStatus}
          options={statusOptions}
        />

        <Select
          allowClear
          showSearch
          placeholder="Фільтр по користувачу"
          style={{ minWidth: 220 }}
          value={userId}
          onChange={setUserId}
          options={userOptions}
          filterOption={(input, option) =>
            (option?.label as string).toLowerCase().includes(input.toLowerCase())
          }
        />

        <RangePicker
          value={createdRange ?? null}
          onChange={(v) => setCreatedRange(v as any)}
          placeholder={["Створено з", "Створено по"]}
          allowClear
        />

        <InputNumber
          placeholder="Мін. сума"
          min={0}
          value={minTotal}
          onChange={(v) => setMinTotal(v ?? undefined)}
        />
        <InputNumber
          placeholder="Макс. сума"
          min={0}
          value={maxTotal}
          onChange={(v) => setMaxTotal(v ?? undefined)}
        />

        <Button icon={<ReloadOutlined />} onClick={() => { fetchOrders(); }}>
          Оновити
        </Button>
        <Button onClick={resetFilters}>Скинути фільтри</Button>
      </Space>

      <Table<Order>
        rowKey="id"
        loading={loading}
        dataSource={filtered}
        columns={columns}
        scroll={{ x: 1100 }}
        pagination={{
          current: page,
          pageSize,
          total: filtered.length,
          showSizeChanger: true,
          onChange: (p, s) => { setPage(p); setPageSize(s); },
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ paddingLeft: 16 }}>
              <b>Адреса доставки:</b> {record.deliveryAddress ?? "—"} <br />
              <b>Нотатки:</b> {record.notes ?? "—"}
              <Divider />
              <b>Позиції:</b>
              <Table<OrderItem>
                rowKey="id"
                size="small"
                pagination={false}
                dataSource={record.items}
                columns={[
                  { title: "Товар", dataIndex: ["product", "title"], render: (_, it) => it.product?.title ?? it.product?.name ?? it.productId },
                  { title: "Кількість", dataIndex: "quantity", width: 100 },
                  { title: "Ціна", dataIndex: "price", width: 120, render: (v) => formatMoney(v) },
                  { title: "Сума", width: 140, render: (_, it) => <b>{formatMoney(it.quantity * it.price)}</b> },
                ]}
              />
            </div>
          ),
        }}
      />

      <Modal
        open={openView}
        title={current ? `Замовлення ${current.id}` : "Замовлення"}
        onCancel={closeViewModal}
        onOk={saveFromModal}
        okText="Зберегти"
        width={720}
      >
        {current && (
          <>
            <Space direction="vertical" size="small" style={{ marginBottom: 12 }}>
              <div>
                <b>Користувач:</b> <Tag>{current.userId}</Tag>
              </div>
              <div>
                <b>Створено:</b> {dayjs(current.createdAt).format("DD.MM.YYYY HH:mm")}
              </div>
              <div>
                <b>Сума:</b> {formatMoney(current.totalAmount)}
              </div>
            </Space>

            <Form form={form} layout="vertical">
              <Form.Item name="status" label="Статус" rules={[{ required: true }]}>
                <Select options={statusOptions} />
              </Form.Item>
              <Form.Item name="deliveryAddress" label="Адреса доставки">
                <Input placeholder="Адреса доставки" />
              </Form.Item>
              <Form.Item name="notes" label="Нотатки">
                <Input.TextArea rows={3} placeholder="Внутрішні нотатки" />
              </Form.Item>
            </Form>

            <Divider />
            <b>Позиції замовлення:</b>
            <Table<OrderItem>
              rowKey="id"
              size="small"
              pagination={false}
              dataSource={current.items}
              columns={[
                { title: "Товар", dataIndex: ["product", "title"], render: (_, it) => it.product?.title ?? it.product?.name ?? it.productId },
                { title: "Кількість", dataIndex: "quantity", width: 100 },
                { title: "Ціна", dataIndex: "price", width: 120, render: (v) => formatMoney(v) },
                { title: "Сума", width: 140, render: (_, it) => <b>{formatMoney(it.quantity * it.price)}</b> },
              ]}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default OrdersPage;
