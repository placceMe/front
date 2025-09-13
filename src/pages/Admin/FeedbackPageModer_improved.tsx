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
    Card,
    Statistic,
    Row,
    Col,
    Switch,
    Dropdown,
    Badge,
    Rate,
    Avatar,
    Progress,
    Typography,
    Alert,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
    ReloadOutlined,
    SearchOutlined,
    EyeOutlined,
    CheckOutlined,
    CloseOutlined,
    DownloadOutlined,
    MoreOutlined,
    UserOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    CheckCircleOutlined,
    FilterOutlined,
    StarOutlined,
    DashboardOutlined,
    SyncOutlined
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

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
    user: { id: string; name: string; surname: string; };
    status: string; // FeedbackStatus.New|Approved|Rejected (або ін.)
};

type StatusKey = "New" | "Approved" | "Rejected" | string;

const API_FEEDBACK = __BASE_URL__ + "/api/products/feedback";

/* ===================== Мапінг статусів ===================== */
const STATUS_META: Record<string, { color: string; label: string; }> = {
    New: { color: "gold", label: "Новий" },
    Approved: { color: "green", label: "Схвалений" },
    Rejected: { color: "red", label: "Відхилений" },
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

    // Нові стани для покращень
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [showFilters, setShowFilters] = useState(true);

    /* -------- Завантаження всіх відгуків -------- */
    const fetchAll = async () => {
        setLoading(true);
        try {
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

    useEffect(() => {
        fetchAll();
    }, []);

    // Автооновлення
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (autoRefresh) {
            interval = setInterval(() => {
                fetchAll();
            }, 30000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh]);

    const resetFilters = () => {
        setQ("");
        setStatus(["New"]);
        setProductId(undefined);
        setUserId(undefined);
        setCreatedRange(null);
        setMinAvg(undefined);
        setMaxAvg(undefined);
        setPage(1);
        setSelectedRows([]);
    };

    // Статистика
    const statistics = useMemo(() => {
        const total = all.length;
        const newCount = all.filter(f => f.status === "New").length;
        const approvedCount = all.filter(f => f.status === "Approved").length;
        const rejectedCount = all.filter(f => f.status === "Rejected").length;
        const avgRating = all.length > 0 ? all.reduce((sum, f) => sum + (f.ratingAverage ?? 0), 0) / all.length : 0;

        return { total, newCount, approvedCount, rejectedCount, avgRating };
    }, [all]);

    // Масові дії
    const bulkStatusUpdate = async (ids: string[], newStatus: StatusKey) => {
        try {
            const promises = ids.map(id =>
                fetch(`${API_FEEDBACK}/${id}/status`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                })
            );

            await Promise.all(promises);

            setAll(prev => prev.map(f =>
                ids.includes(f.id) ? { ...f, status: newStatus } : f
            ));

            message.success(`Оновлено ${ids.length} відгуків`);
            setSelectedRows([]);
        } catch {
            message.error("Помилка масового оновлення статусів");
        }
    };

    const bulkDelete = async (ids: string[]) => {
        try {
            const promises = ids.map(id =>
                fetch(`${API_FEEDBACK}/${id}`, { method: "DELETE" })
            );

            await Promise.all(promises);

            setAll(prev => prev.filter(f => !ids.includes(f.id)));
            message.success(`Видалено ${ids.length} відгуків`);
            setSelectedRows([]);
        } catch {
            message.error("Помилка масового видалення");
        }
    };

    // Експорт даних
    const exportData = () => {
        const dataToExport = filtered.map(f => ({
            id: f.id,
            createdAt: fmtDate(f.createdAt),
            user: `${f.user?.name ?? ""} ${f.user?.surname ?? ""}`.trim() || f.userId,
            product: f.productName ?? f.productId,
            status: STATUS_META[f.status]?.label || f.status,
            ratingService: f.ratingService,
            ratingSpeed: f.ratingSpeed,
            ratingDescription: f.ratingDescription,
            ratingAvailable: f.ratingAvailable,
            ratingAverage: f.ratingAverage?.toFixed(1),
            content: f.content
        }));

        const csv = [
            Object.keys(dataToExport[0] || {}).join(','),
            ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `feedback_${dayjs().format('YYYY-MM-DD')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

            // Оновлюємо поточний відгук у модальному вікні, якщо він відкритий
            if (current && current.id === id) {
                setCurrent(prev => prev ? { ...prev, status: s } : null);
            }
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

    /* -------- Колонки таблиці -------- */
    const columns: ColumnsType<FeedbackDto> = [
        {
            title: "Створено",
            dataIndex: "createdAt",
            width: 160,
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
            render: (v: string) => (
                <div>
                    <div className="font-medium">{fmtDate(v)}</div>
                    <Badge
                        color={dayjs().diff(dayjs(v), 'hours') < 24 ? 'green' : 'default'}
                        text={
                            <span className="text-xs">
                                {dayjs().diff(dayjs(v), 'hours') < 1 ? 'Щойно' : dayjs(v).fromNow()}
                            </span>
                        }
                    />
                </div>
            ),
        },
        {
            title: "Користувач",
            dataIndex: "user",
            render: (_, f) => (
                <div className="flex items-center gap-2">
                    <Avatar size="small" icon={<UserOutlined />} />
                    <div>
                        <div className="font-medium text-sm">
                            {`${f.user?.name ?? ""} ${f.user?.surname ?? ""}`.trim() || f.userId}
                        </div>
                        <div className="text-xs text-gray-500">ID: {f.userId.slice(0, 8)}</div>
                    </div>
                </div>
            ),
            width: 200,
            sorter: (a, b) => {
                const la = `${a.user?.name ?? ""} ${a.user?.surname ?? ""}`.trim();
                const lb = `${b.user?.name ?? ""} ${b.user?.surname ?? ""}`.trim();
                return la.localeCompare(lb);
            },
        },
        {
            title: "Товар",
            dataIndex: "productName",
            render: (_, f) => (
                <div>
                    <div className="font-medium text-sm max-w-[200px] truncate">
                        {f.productName ?? f.productId}
                    </div>
                    <div className="text-xs text-gray-500">ID: {f.productId.slice(0, 8)}</div>
                </div>
            ),
            width: 220,
            sorter: (a, b) => (a.productName ?? a.productId).localeCompare(b.productName ?? b.productId),
        },
        {
            title: "Рейтинг",
            dataIndex: "ratingAverage",
            width: 140,
            sorter: (a, b) => (a.ratingAverage ?? 0) - (b.ratingAverage ?? 0),
            render: (v: number, record) => (
                <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600 mb-1">
                        {(v ?? 0).toFixed(1)}
                    </div>
                    <Rate disabled allowHalf value={v ?? 0} className="text-xs mb-1" />
                    <div className="text-xs text-gray-500 grid grid-cols-2 gap-1">
                        <span>С: {record.ratingService}</span>
                        <span>Ш: {record.ratingSpeed}</span>
                        <span>О: {record.ratingDescription}</span>
                        <span>Н: {record.ratingAvailable}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Статус",
            dataIndex: "status",
            width: 120,
            render: (s: string) => {
                const meta = STATUS_META[s] || { color: "default", label: s };
                const icon = s === "New" ? <ClockCircleOutlined /> :
                    s === "Approved" ? <CheckCircleOutlined /> :
                        <ExclamationCircleOutlined />;

                return (
                    <Badge
                        count={s === "New" ? "НОВИЙ" : ""}
                        size="small"
                    >
                        <Tag color={meta.color} icon={icon} className="text-xs">
                            {meta.label}
                        </Tag>
                    </Badge>
                );
            },
            filters: statusOptions.map(o => ({ text: o.label, value: o.value })),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Контент",
            dataIndex: "content",
            ellipsis: { showTitle: false },
            render: (text: string) => (
                <div className="max-w-xs">
                    <div className="truncate text-sm">{text || "—"}</div>
                    {text && text.length > 50 && (
                        <div className="text-xs text-gray-400 mt-1">
                            {text.length} символів
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Дії",
            fixed: "right",
            width: 280,
            render: (_, r) => (
                <Space size="small" wrap>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => openViewModal(r)}
                        type="link"
                        size="small"
                    >
                        Деталі
                    </Button>
                    <Button
                        icon={<CheckOutlined />}
                        type="primary"
                        size="small"
                        onClick={() => quickStatus(r.id, "Approved")}
                        disabled={r.status === "Approved"}
                        className="bg-green-500 hover:bg-green-600 border-green-500"
                    >
                        Схвалити
                    </Button>
                    <Button
                        icon={<CloseOutlined />}
                        danger
                        size="small"
                        onClick={() => quickStatus(r.id, "Rejected")}
                        disabled={r.status === "Rejected"}
                    >
                        Відхилити
                    </Button>
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: 'delete',
                                    label: 'Видалити',
                                    icon: <CloseOutlined />,
                                    danger: true,
                                    onClick: () => {
                                        Modal.confirm({
                                            title: 'Видалити відгук?',
                                            content: 'Цю дію неможливо скасувати',
                                            onOk: () => removeFeedback(r.id),
                                        });
                                    }
                                }
                            ]
                        }}
                    >
                        <Button icon={<MoreOutlined />} size="small" />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedRows,
        onChange: (keys: React.Key[]) => setSelectedRows(keys as string[]),
        onSelectAll: (selected: boolean, selectedRows: FeedbackDto[], changeRows: FeedbackDto[]) => {
            if (selected) {
                setSelectedRows(prev => [...prev, ...changeRows.map(r => r.id)]);
            } else {
                setSelectedRows(prev => prev.filter(id => !changeRows.some(r => r.id === id)));
            }
        },
    };

    return (
        <div className="min-h-screen" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
            <div className="container mx-auto px-6 py-8">
                {/* Заголовок з градієнтом */}
                <div className="mb-8 text-center">
                    <Title level={2} className="text-white mb-2">
                        <DashboardOutlined className="mr-3" />
                        Модерація відгуків
                    </Title>
                    <Text className="text-blue-100">
                        Керування та модерування відгуків користувачів
                    </Text>
                </div>

                {/* Статистика */}
                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} sm={12} md={6}>
                        <Card className="text-center backdrop-blur-md bg-white/10 border-white/20">
                            <Statistic
                                title={<span className="text-white">Всього відгуків</span>}
                                value={statistics.total}
                                prefix={<StarOutlined />}
                                valueStyle={{ color: '#fff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="text-center backdrop-blur-md bg-white/10 border-white/20">
                            <Statistic
                                title={<span className="text-white">Нових</span>}
                                value={statistics.newCount}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="text-center backdrop-blur-md bg-white/10 border-white/20">
                            <Statistic
                                title={<span className="text-white">Схвалених</span>}
                                value={statistics.approvedCount}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="text-center backdrop-blur-md bg-white/10 border-white/20">
                            <Statistic
                                title={<span className="text-white">Середній рейтинг</span>}
                                value={statistics.avgRating}
                                precision={1}
                                prefix={<StarOutlined />}
                                valueStyle={{ color: '#fff' }}
                            />
                            <Progress
                                percent={(statistics.avgRating / 5) * 100}
                                showInfo={false}
                                strokeColor="#faad14"
                                className="mt-2"
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Основна панель */}
                <Card className="backdrop-blur-md bg-white/95 border-white/50 shadow-2xl">
                    {/* Панель управління */}
                    <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
                        <Space wrap>
                            <Button
                                icon={<FilterOutlined />}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                {showFilters ? 'Сховати фільтри' : 'Показати фільтри'}
                            </Button>

                            {selectedRows.length > 0 && (
                                <>
                                    <Button
                                        type="primary"
                                        icon={<CheckOutlined />}
                                        onClick={() => bulkStatusUpdate(selectedRows, "Approved")}
                                    >
                                        Схвалити ({selectedRows.length})
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseOutlined />}
                                        onClick={() => bulkStatusUpdate(selectedRows, "Rejected")}
                                    >
                                        Відхилити ({selectedRows.length})
                                    </Button>
                                    <Popconfirm
                                        title={`Видалити ${selectedRows.length} відгуків?`}
                                        onConfirm={() => bulkDelete(selectedRows)}
                                    >
                                        <Button danger icon={<CloseOutlined />}>
                                            Видалити ({selectedRows.length})
                                        </Button>
                                    </Popconfirm>
                                </>
                            )}
                        </Space>

                        <Space wrap>
                            <div className="flex items-center gap-2">
                                <Text>Автооновлення:</Text>
                                <Switch
                                    checked={autoRefresh}
                                    onChange={setAutoRefresh}
                                    checkedChildren={<SyncOutlined spin={autoRefresh} />}
                                    unCheckedChildren={<SyncOutlined />}
                                />
                            </div>
                            <Button icon={<DownloadOutlined />} onClick={exportData}>
                                Експорт CSV
                            </Button>
                            <Button icon={<ReloadOutlined />} onClick={fetchAll} loading={loading}>
                                Оновити
                            </Button>
                        </Space>
                    </div>

                    {/* Фільтри */}
                    {showFilters && (
                        <Card className="mb-4 bg-gray-50" size="small">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} md={8}>
                                    <Input
                                        allowClear
                                        prefix={<SearchOutlined />}
                                        placeholder="Пошук (контент, товар, користувач)"
                                        value={q}
                                        onChange={(e) => { setQ(e.target.value); setPage(1); }}
                                    />
                                </Col>

                                <Col xs={24} sm={12} md={8}>
                                    <Select
                                        allowClear
                                        mode="multiple"
                                        placeholder="Статуси"
                                        style={{ width: '100%' }}
                                        value={status}
                                        onChange={(v) => { setStatus(v); setPage(1); }}
                                        options={statusOptions}
                                    />
                                </Col>

                                <Col xs={24} sm={12} md={8}>
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Фільтр по товару"
                                        style={{ width: '100%' }}
                                        value={productId}
                                        onChange={(v) => { setProductId(v); setPage(1); }}
                                        options={productOptions}
                                        filterOption={(input, option) =>
                                            (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                </Col>

                                <Col xs={24} sm={12} md={8}>
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Фільтр по користувачу"
                                        style={{ width: '100%' }}
                                        value={userId}
                                        onChange={(v) => { setUserId(v); setPage(1); }}
                                        options={userOptions}
                                        filterOption={(input, option) =>
                                            (option?.label as string).toLowerCase().includes(input.toLowerCase())
                                        }
                                    />
                                </Col>

                                <Col xs={24} sm={12} md={8}>
                                    <RangePicker
                                        style={{ width: '100%' }}
                                        value={createdRange ?? null}
                                        onChange={(v) => { setCreatedRange(v as any); setPage(1); }}
                                        placeholder={["Створено з", "Створено по"]}
                                    />
                                </Col>

                                <Col xs={12} sm={6} md={4}>
                                    <InputNumber
                                        placeholder="Мін. рейтинг"
                                        min={0}
                                        max={5}
                                        step={0.1}
                                        style={{ width: '100%' }}
                                        value={minAvg}
                                        onChange={(v) => { setMinAvg(v ?? undefined); setPage(1); }}
                                    />
                                </Col>

                                <Col xs={12} sm={6} md={4}>
                                    <InputNumber
                                        placeholder="Макс. рейтинг"
                                        min={0}
                                        max={5}
                                        step={0.1}
                                        style={{ width: '100%' }}
                                        value={maxAvg}
                                        onChange={(v) => { setMaxAvg(v ?? undefined); setPage(1); }}
                                    />
                                </Col>
                            </Row>

                            <div className="mt-3 text-right">
                                <Button onClick={resetFilters} size="small">
                                    Скинути фільтри
                                </Button>
                            </div>
                        </Card>
                    )}

                    {/* Результати фільтрування */}
                    {filtered.length !== all.length && (
                        <Alert
                            message={`Показано ${filtered.length} з ${all.length} відгуків`}
                            type="info"
                            className="mb-4"
                            showIcon
                        />
                    )}

                    {/* Таблиця */}
                    <Table<FeedbackDto>
                        rowKey="id"
                        dataSource={paged}
                        loading={loading}
                        columns={columns}
                        rowSelection={rowSelection}
                        scroll={{ x: 1200 }}
                        size="middle"
                        pagination={{
                            current: page,
                            pageSize,
                            total: filtered.length,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `${range[0]}-${range[1]} з ${total} записів`,
                            onChange: (p, s) => { setPage(p); if (s) setPageSize(s); },
                        }}
                        className="overflow-hidden rounded-lg"
                    />
                </Card>

                {/* Покращене модальне вікно деталей */}
                <Modal
                    open={openView}
                    onCancel={closeViewModal}
                    footer={null}
                    title={
                        <div className="flex items-center gap-3">
                            <Avatar icon={<UserOutlined />} />
                            <div>
                                <div className="font-semibold">
                                    {current ? `Відгук ${current.id.slice(0, 8)}...` : "Відгук"}
                                </div>
                                <div className="text-sm text-gray-500 font-normal">
                                    {current && `${current.user?.name ?? ""} ${current.user?.surname ?? ""}`.trim()}
                                </div>
                            </div>
                        </div>
                    }
                    width={900}
                    className="top-8"
                >
                    {current && (
                        <div className="space-y-6">
                            {/* Основна інформація */}
                            <Card size="small" className="bg-gray-50">
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <Statistic
                                            title="Дата створення"
                                            value={fmtDate(current.createdAt)}
                                            prefix={<ClockCircleOutlined />}
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <Statistic
                                            title="Середній рейтинг"
                                            value={current.ratingAverage?.toFixed(1) ?? 0}
                                            prefix={<StarOutlined />}
                                            suffix="/ 5"
                                        />
                                    </Col>
                                    <Col span={8}>
                                        <div className="text-center">
                                            <div className="text-gray-500 text-sm mb-1">Статус</div>
                                            <div>
                                                {(() => {
                                                    const meta = STATUS_META[current.status] || { color: "default", label: current.status };
                                                    const icon = current.status === "New" ? <ClockCircleOutlined /> :
                                                        current.status === "Approved" ? <CheckCircleOutlined /> :
                                                            <ExclamationCircleOutlined />;
                                                    return (
                                                        <Tag color={meta.color} icon={icon} className="text-base px-3 py-1">
                                                            {meta.label}
                                                        </Tag>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            {/* Деталі рейтингу */}
                            <Card title="Деталі рейтингу" size="small">
                                <Row gutter={16}>
                                    <Col span={6}>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">{current.ratingService}</div>
                                            <div className="text-gray-500 text-sm">Сервіс</div>
                                            <Rate disabled value={current.ratingService} className="text-sm" />
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">{current.ratingSpeed}</div>
                                            <div className="text-gray-500 text-sm">Швидкість</div>
                                            <Rate disabled value={current.ratingSpeed} className="text-sm" />
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">{current.ratingDescription}</div>
                                            <div className="text-gray-500 text-sm">Опис</div>
                                            <Rate disabled value={current.ratingDescription} className="text-sm" />
                                        </div>
                                    </Col>
                                    <Col span={6}>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">{current.ratingAvailable}</div>
                                            <div className="text-gray-500 text-sm">Наявність</div>
                                            <Rate disabled value={current.ratingAvailable} className="text-sm" />
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            {/* Інформація про товар і користувача */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Card title="Користувач" size="small">
                                        <div className="flex items-center gap-3">
                                            <Avatar size={48} icon={<UserOutlined />} />
                                            <div>
                                                <div className="font-semibold">
                                                    {`${current.user?.name ?? ""} ${current.user?.surname ?? ""}`.trim() || current.userId}
                                                </div>
                                                <div className="text-gray-500 text-sm">ID: {current.userId}</div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card title="Товар" size="small">
                                        <div className="space-y-2">
                                            <div className="font-semibold">
                                                {current.productName ?? current.productId}
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                ID: {current.productId}
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Контент відгуку */}
                            <Card title="Текст відгуку" size="small">
                                <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                                    <div className="whitespace-pre-wrap text-gray-800">
                                        {current.content || "Користувач не залишив текстового коментаря"}
                                    </div>
                                    {current.content && (
                                        <div className="text-xs text-gray-400 mt-2 text-right">
                                            {current.content.length} символів
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Дії */}
                            <Card size="small">
                                <Space size="middle" className="w-full justify-center">
                                    <Button
                                        icon={<CheckOutlined />}
                                        type="primary"
                                        size="large"
                                        onClick={() => quickStatus(current.id, "Approved")}
                                        disabled={current.status === "Approved"}
                                        className="bg-green-500 hover:bg-green-600 border-green-500"
                                    >
                                        Схвалити відгук
                                    </Button>
                                    <Button
                                        icon={<CloseOutlined />}
                                        danger
                                        size="large"
                                        onClick={() => quickStatus(current.id, "Rejected")}
                                        disabled={current.status === "Rejected"}
                                    >
                                        Відхилити відгук
                                    </Button>
                                    <Popconfirm
                                        title="Видалити відгук?"
                                        description="Цю дію неможливо скасувати"
                                        onConfirm={() => {
                                            removeFeedback(current.id);
                                            closeViewModal();
                                        }}
                                    >
                                        <Button danger type="link" size="large">
                                            Видалити відгук
                                        </Button>
                                    </Popconfirm>
                                </Space>
                            </Card>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default FeedbackModerationPage;
