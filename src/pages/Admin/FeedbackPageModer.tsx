import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  message,
  Select,
  DatePicker,
  InputNumber,
  Modal,
  Descriptions,
  Divider,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { ReloadOutlined, SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

/* ===================== Типи (під DTO) ===================== */
type FeedbackDto = {
  id: string;
  content: string;
  ratingService: number;
  ratingSpeed: number;
  ratingDescription: number;
  ratingAvailable: number;
  ratingAverage: number;
  productId: string;
  productName?: string | null;
  userId: string;
  createdAt: string; // ISO
  user: { id: string; name: string; surname: string };
  status: string; // FeedbackStatus.New|Approved|Rejected (або ін.)
};

type StatusKey = "New" | "Approved" | "Rejected" | string;

const API_FEEDBACK = "http://localhost:8080/api/products/feedback";

/* ===================== Мапінг статусів ===================== */
const STATUS_META: Record<string, { color: string; label: string }> = {
  New: { color: "gold", label: "Новий" },
  Approved: { color: "green", label: "Схвалений" },
  Rejected: { color: "red", label: "Відхилений" },
};

const statusTag = (s?: string) => {
  const key = s || "New";
  const meta = STATUS_META[key] || { color: "default", label: key };
  return <Tag color={meta.color}>{meta.label}</Tag>;
};

const statusOptions = Object.keys(STATUS_META).map(k => ({ value: k, label: STATUS_META[k].label }));

/* ===================== Утиліти ===================== */
const fmtDate = (iso: string) => dayjs(iso).format("DD.MM.YYYY HH:mm");

/* ===================== Компонент ===================== */
const FeedbackModerationPage: React.FC = () => {
  const [all, setAll] = useState<FeedbackDto[]>([]);
  const [loading, setLoading] = useState(false);

  // Клієнтська пагінація
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Фільтри
  const [q, setQ] = useState(""); // контент / продукт / користувач
  const [status, setStatus] = useState<string[] | undefined>(["New"]); // за замовчанням показуємо нові
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [createdRange, setCreatedRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [minAvg, setMinAvg] = useState<number | undefined>(undefined);
  const [maxAvg, setMaxAvg] = useState<number | undefined>(undefined);

  // Перегляд/зміна
  const [openView, setOpenView] = useState(false);
  const [current, setCurrent] = useState<FeedbackDto | null>(null);

  /* -------- Завантаження всіх відгуків (фронт-фільтри) -------- */
  const fetchAll = async () => {
    setLoading(true);
    try {
      // якщо даних дуже багато — можна викликати кілька разів із offset/limit
      const r = await fetch(`${API_FEEDBACK}?offset=0&limit=1000`);
      if (!r.ok) throw new Error();
      const list: FeedbackDto[] = await r.json();
      setAll(Array.isArray(list) ? list : []);
    } catch {
      message.error("Не вдалося завантажити відгуки");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchAll(); }, []);

  const resetFilters = () => {
    setQ("");
    setStatus(["New"]);
    setProductId(undefined);
    setUserId(undefined);
    setCreatedRange(null);
    setMinAvg(undefined);
    setMaxAvg(undefined);
    setPage(1);
  };

  /* -------- Унікальні селекти -------- */
  const productOptions = useMemo(() => {
    const map = new Map<string, string>();
    all.forEach(f => {
      if (!map.has(f.productId)) map.set(f.productId, f.productName ?? f.productId);
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [all]);

  const userOptions = useMemo(() => {
    const map = new Map<string, string>();
    all.forEach(f => {
      const label = `${f.user?.name ?? ""} ${f.user?.surname ?? ""}`.trim() || f.userId;
      if (!map.has(f.userId)) map.set(f.userId, label);
    });
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
  }, [all]);

  /* -------- Застосування фільтрів (локально) -------- */
  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const [from, to] = createdRange ?? [null, null];

    return all.filter(f => {
      if (status && status.length && !status.includes(f.status)) return false;
      if (productId && f.productId !== productId) return false;
      if (userId && f.userId !== userId) return false;

      if (typeof minAvg === "number" && (f.ratingAverage ?? 0) < minAvg) return false;
      if (typeof maxAvg === "number" && (f.ratingAverage ?? 0) > maxAvg) return false;

      if (from && dayjs(f.createdAt).isBefore(from, "day")) return false;
      if (to && dayjs(f.createdAt).isAfter(to, "day")) return false;

      if (ql) {
        const hay = `${f.content} ${f.productName ?? ""} ${f.user?.name ?? ""} ${f.user?.surname ?? ""}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }
      return true;
    });
  }, [all, status, productId, userId, minAvg, maxAvg, createdRange, q]);

  /* -------- Пейджинг (локально) -------- */
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  /* -------- Дії -------- */
  const quickStatus = async (id: string, s: StatusKey) => {
    try {
      const r = await fetch(`${API_FEEDBACK}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: s }),
      });
      if (!r.ok) throw new Error();
      message.success("Статус змінено");
      setAll(prev => prev.map(f => (f.id === id ? { ...f, status: s } : f)));
    } catch {
      message.error("Помилка зміни статусу");
    }
  };

  const removeFeedback = async (id: string) => {
    try {
      const r = await fetch(`${API_FEEDBACK}/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      setAll(prev => prev.filter(f => f.id !== id));
      message.success("Відгук видалено");
    } catch {
      message.error("Помилка видалення");
    }
  };

  const openViewModal = (f: FeedbackDto) => {
    setCurrent(f);
    setOpenView(true);
  };
  const closeViewModal = () => {
    setOpenView(false);
    setCurrent(null);
  };

  /* -------- Колонки -------- */
  const columns: ColumnsType<FeedbackDto> = [
    {
      title: "Створено",
      dataIndex: "createdAt",
      width: 180,
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (v: string) => fmtDate(v),
    },
    {
      title: "Користувач",
      dataIndex: "user",
      render: (_, f) => <Tag>{`${f.user?.name ?? ""} ${f.user?.surname ?? ""}`.trim() || f.userId}</Tag>,
      width: 220,
      sorter: (a, b) => {
        const la = `${a.user?.name ?? ""} ${a.user?.surname ?? ""}`.trim();
        const lb = `${b.user?.name ?? ""} ${b.user?.surname ?? ""}`.trim();
        return la.localeCompare(lb);
      },
    },
    {
      title: "Товар",
      dataIndex: "productName",
      render: (_, f) => <Tag>{f.productName ?? f.productId}</Tag>,
      width: 260,
      sorter: (a, b) => (a.productName ?? a.productId).localeCompare(b.productName ?? b.productId),
    },
    {
      title: "Середня",
      dataIndex: "ratingAverage",
      width: 110,
      sorter: (a, b) => (a.ratingAverage ?? 0) - (b.ratingAverage ?? 0),
      render: (v: number) => <b>{(v ?? 0).toFixed(1)}</b>,
    },
    {
      title: "Статус",
      dataIndex: "status",
      width: 140,
      render: (s: string) => statusTag(s),
      filters: statusOptions.map(o => ({ text: o.label, value: o.value })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Контент",
      dataIndex: "content",
      ellipsis: true,
    },
    {
      title: "Дії",
      fixed: "right",
      width: 240,
      render: (_, r) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openViewModal(r)}>
            Деталі
          </Button>
          <Button
            icon={<CheckOutlined />}
            type="default"
            onClick={() => quickStatus(r.id, "Approved")}
            disabled={r.status === "Approved"}
          >
            Схвалити
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
          <Popconfirm title="Видалити відгук?" onConfirm={() => removeFeedback(r.id)}>
            <Button danger type="link">Видалити</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Фільтри */}
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Пошук (контент, товар, користувач)"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          style={{ width: 340 }}
        />

        <Select
          allowClear
          mode="multiple"
          placeholder="Статуси"
          style={{ minWidth: 220 }}
          value={status}
          onChange={(v) => { setStatus(v); setPage(1); }}
          options={statusOptions}
        />

        <Select
          allowClear
          showSearch
          placeholder="Фільтр по товару"
          style={{ minWidth: 260 }}
          value={productId}
          onChange={(v) => { setProductId(v); setPage(1); }}
          options={productOptions}
          filterOption={(input, option) =>
            (option?.label as string).toLowerCase().includes(input.toLowerCase())
          }
        />

        <Select
          allowClear
          showSearch
          placeholder="Фільтр по користувачу"
          style={{ minWidth: 240 }}
          value={userId}
          onChange={(v) => { setUserId(v); setPage(1); }}
          options={userOptions}
          filterOption={(input, option) =>
            (option?.label as string).toLowerCase().includes(input.toLowerCase())
          }
        />

        <RangePicker
          value={createdRange ?? null}
          onChange={(v) => { setCreatedRange(v as any); setPage(1); }}
          placeholder={["Створено з", "Створено по"]}
        />

        <InputNumber
          placeholder="Мін. середня"
          min={0}
          max={5}
          value={minAvg}
          onChange={(v) => { setMinAvg(v ?? undefined); setPage(1); }}
        />
        <InputNumber
          placeholder="Макс. середня"
          min={0}
          max={5}
          value={maxAvg}
          onChange={(v) => { setMaxAvg(v ?? undefined); setPage(1); }}
        />

        <Button icon={<ReloadOutlined />} onClick={fetchAll}>
          Оновити
        </Button>
        <Button onClick={resetFilters}>Скинути фільтри</Button>
      </Space>

      {/* Таблиця */}
      <Table<FeedbackDto>
        rowKey="id"
        dataSource={paged}
        loading={loading}
        columns={columns}
        scroll={{ x: 1200 }}
        pagination={{
          current: page,
          pageSize,
          total: filtered.length,
          showSizeChanger: true,
          onChange: (p, s) => { setPage(p); setPageSize(s); },
        }}
      />

      {/* Модальне вікно деталей */}
      <Modal
        open={openView}
        onCancel={closeViewModal}
        onOk={closeViewModal}
        okText="Закрити"
        title={current ? `Відгук ${current.id}` : "Відгук"}
        width={800}
      >
        {current && (
          <>
            <Space direction="vertical" size="small" style={{ marginBottom: 12 }}>
              <div><b>Створено:</b> {fmtDate(current.createdAt)} {statusTag(current.status)}</div>
              <div><b>Користувач:</b> <Tag>{`${current.user?.name ?? ""} ${current.user?.surname ?? ""}`.trim() || current.userId}</Tag></div>
              <div><b>Товар:</b> <Tag>{current.productName ?? current.productId}</Tag></div>
            </Space>

            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Сервіс">{current.ratingService}</Descriptions.Item>
              <Descriptions.Item label="Швидкість">{current.ratingSpeed}</Descriptions.Item>
              <Descriptions.Item label="Опис відповідає">{current.ratingDescription}</Descriptions.Item>
              <Descriptions.Item label="Наявність">{current.ratingAvailable}</Descriptions.Item>
              <Descriptions.Item label="Середня" span={2}>
                <b>{(current.ratingAverage ?? 0).toFixed(1)}</b>
              </Descriptions.Item>
              <Descriptions.Item label="Статус" span={2}>
                {statusTag(current.status)}
              </Descriptions.Item>
            </Descriptions>

            <Divider />
            <b>Контент відгуку:</b>
            <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>{current.content || "—"}</div>

            <Divider />
            <Space>
              <Button
                icon={<CheckOutlined />}
                type="default"
                onClick={() => quickStatus(current.id, "Approved")}
                disabled={current.status === "Approved"}
              >
                Схвалити
              </Button>
              <Button
                icon={<CloseOutlined />}
                danger
                type="default"
                onClick={() => quickStatus(current.id, "Rejected")}
                disabled={current.status === "Rejected"}
              >
                Відхилити
              </Button>
              <Popconfirm title="Видалити відгук?" onConfirm={() => { removeFeedback(current.id); closeViewModal(); }}>
                <Button danger type="link">Видалити</Button>
              </Popconfirm>
            </Space>
          </>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackModerationPage;
