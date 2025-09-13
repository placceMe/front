// src/pages/admin/UsersPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  message,
  Tag,
  Select,
  Space,
  DatePicker,
  Checkbox,
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
  Typography,
  Divider,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserAddOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string | null;
  roles: string[];
  state: string;
  createdAt: string; // ISO
  avatarUrl?: string | null;
};

const API_URL = __BASE_URL__ + "/api/users";

// Дозволені значення (як у бекенді)
const ROLE_OPTIONS = ["Admin", "User", "Saler", "Moderator"] as const;
const STATE_OPTIONS = ["Active", "Inactive", "Blocked", "Deleted"] as const;

const roleColor = (r: string) =>
  r === "Admin" ? "red" : r === "Moderator" ? "geekblue" : r === "Saler" ? "green" : "blue";
const stateColor = (s: string) =>
  s === "Active" ? "green" : s === "Inactive" ? "default" : s === "Blocked" ? "orange" : "volcano";

// простий генератор паролів
const generatePassword = (len = 12) => {
  const lowers = "abcdefghijklmnopqrstuvwxyz";
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  const syms = "!@#$%^&*()_+-=[]{},.<>?";
  const all = lowers + uppers + nums + syms;
  const pick = (cs: string) => cs[Math.floor(Math.random() * cs.length)];
  let pwd = pick(lowers) + pick(uppers) + pick(nums) + pick(syms);
  for (let i = pwd.length; i < len; i++) pwd += pick(all);
  return pwd.split("").sort(() => Math.random() - 0.5).join("");
};

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // ======= Клієнтські фільтри / пагінація =======
  const [q, setQ] = useState(""); // пошук по імені/прізвищу/email/телефону
  const [rolesFilter, setRolesFilter] = useState<string[]>([]);
  const [stateFilter, setStateFilter] = useState<string | undefined>(undefined);
  const [createdRange, setCreatedRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [emailDomain, setEmailDomain] = useState<string | undefined>(undefined);
  const [hasPhone, setHasPhone] = useState<boolean | undefined>(undefined);
  const [hasAvatar, setHasAvatar] = useState<boolean | undefined>(undefined);
  const [onlyAdmins, setOnlyAdmins] = useState(false);
  const [onlyModerators, setOnlyModerators] = useState(false);
  const [minNameLen, setMinNameLen] = useState<number | undefined>(undefined);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ======= Завантаження =======
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = (await res.json()) as User[];
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      message.error("Помилка завантаження користувачів");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchUsers(); }, []);

  const resetFilters = () => {
    setQ("");
    setRolesFilter([]);
    setStateFilter(undefined);
    setCreatedRange(null);
    setEmailDomain(undefined);
    setHasPhone(undefined);
    setHasAvatar(undefined);
    setOnlyAdmins(false);
    setOnlyModerators(false);
    setMinNameLen(undefined);
    setPage(1);
  };

  // ======= Застосування фільтрів (усе на фронті) =======
  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const [from, to] = createdRange ?? [null, null];

    return users.filter(u => {
      // швидкі фільтри
      if (onlyAdmins && !u.roles.includes("Admin")) return false;
      if (onlyModerators && !u.roles.includes("Moderator")) return false;

      // ролі
      if (rolesFilter.length && !rolesFilter.every(r => u.roles.includes(r))) return false;

      // статус
      if (stateFilter && u.state !== stateFilter) return false;

      // телефон
      if (typeof hasPhone === "boolean") {
        const ok = !!(u.phone && u.phone.trim());
        if (hasPhone !== ok) return false;
      }

      // аватар
      if (typeof hasAvatar === "boolean") {
        const ok = !!(u.avatarUrl && u.avatarUrl.trim());
        if (hasAvatar !== ok) return false;
      }

      // довжина імені
      if (typeof minNameLen === "number") {
        const len = (u.name ?? "").trim().length;
        if (len < minNameLen) return false;
      }

      // дата створення
      const created = dayjs(u.createdAt);
      if (from && created.isBefore(from, "day")) return false;
      if (to && created.isAfter(to, "day")) return false;

      // пошук
      if (ql) {
        const hay = `${u.name} ${u.surname} ${u.email} ${u.phone ?? ""}`.toLowerCase();
        if (!hay.includes(ql)) return false;
      }

      return true;
    });
  }, [
    users, q, rolesFilter, stateFilter, createdRange, emailDomain,
    hasPhone, hasAvatar, onlyAdmins, onlyModerators, minNameLen
  ]);

  // пагінація на фронті
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // ======= CRUD =======
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        message.success("Користувача видалено");
        setUsers(prev => prev.filter(u => u.id !== id));
      } else {
        message.error("Не вдалося видалити");
      }
    } catch {
      message.error("Помилка сервера");
    }
  };

  const openModal = (user?: User) => {
    setEditingUser(user || null);
    form.setFieldsValue(
      user || {
        name: "",
        surname: "",
        email: "",
        phone: "",
        roles: ["User"],
        state: "Active",
        password: "",
        confirmPassword: "",
      }
    );
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); form.resetFields(); setEditingUser(null); };

  const sanitizeRoles = (roles: string[]) =>
    Array.from(new Set(roles)).filter((r) => (ROLE_OPTIONS as readonly string[]).includes(r));
  const sanitizeState = (state: string) =>
    (STATE_OPTIONS as readonly string[]).includes(state) ? state : "Active";

  const handleSave = async () => {
    try {
      const raw = await form.validateFields();
      const payload: any = {
        name: raw.name,
        surname: raw.surname,
        email: raw.email,
        phone: raw.phone || null,
        roles: sanitizeRoles(raw.roles || []),
        state: sanitizeState(raw.state),
      };
      if (!editingUser) payload.password = raw.password;

      if (editingUser) {
        const res = await fetch(`${API_URL}/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editingUser, ...payload }),
        });
        if (!res.ok) throw new Error();
        message.success("Користувача оновлено");
      } else {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        message.success("Користувача створено");
      }
      closeModal();
      fetchUsers();
    } catch (err: any) {
      if (!err?.errorFields) message.error("Помилка при збереженні");
    }
  };

  // Statistics calculations
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.state === "Active").length;
    const adminUsers = users.filter(u => u.roles.includes("Admin")).length;
    const blockedUsers = users.filter(u => u.state === "Blocked").length;

    return { totalUsers, activeUsers, adminUsers, blockedUsers };
  }, [users]);

  // ======= Колонки =======
  const columns: ColumnsType<User> = [
    {
      title: "Користувач",
      dataIndex: "name",
      render: (name: string, record: User) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar
            size={40}
            src={record.avatarUrl}
            icon={<UserOutlined />}
            style={{ backgroundColor: record.avatarUrl ? undefined : "#1890ff" }}
          />
          <div>
            <div style={{ fontWeight: 500, color: "#262626", fontSize: 14 }}>
              {name} {record.surname}
            </div>
            <div style={{ fontSize: 12, color: "#8c8c8c", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
              <MailOutlined style={{ fontSize: 10 }} />
              {record.email}
            </div>
            {record.phone && (
              <div style={{ fontSize: 12, color: "#8c8c8c", display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                <PhoneOutlined style={{ fontSize: 10 }} />
                {record.phone}
              </div>
            )}
          </div>
        </div>
      ),
      width: 280,
      sorter: (a, b) => `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`),
    },
    {
      title: "Ролі",
      dataIndex: "roles",
      render: (roles: string[]) => (
        <Space size={[0, 4]} wrap>
          {roles?.map((role) => (
            <Tag key={role} color={roleColor(role)} style={{ borderRadius: 12 }}>
              {role}
            </Tag>
          ))}
        </Space>
      ),
      sorter: (a, b) => (a.roles.join(",")).localeCompare(b.roles.join(",")),
      width: 150,
    },
    {
      title: "Статус",
      dataIndex: "state",
      render: (state: string) => (
        <Tag
          color={stateColor(state)}
          style={{
            borderRadius: 16,
            paddingInline: 12,
            fontWeight: 500,
            border: 'none',
          }}
        >
          {state}
        </Tag>
      ),
      sorter: (a, b) => a.state.localeCompare(b.state),
      width: 120,
    },
    {
      title: "Створено",
      dataIndex: "createdAt",
      render: (v: string) => (
        <Tooltip title={dayjs(v).format("DD.MM.YYYY HH:mm:ss")}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <CalendarOutlined style={{ color: "#8c8c8c", fontSize: 12 }} />
            <Text style={{ fontSize: 13, color: "#595959" }}>
              {dayjs(v).format("DD.MM.YYYY")}
            </Text>
          </div>
        </Tooltip>
      ),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      width: 130,
    },
    {
      title: "Дії",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Редагувати">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openModal(record)}
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
          <Popconfirm
            title="Видалити користувача?"
            description="Ця дія незворотна. Ви впевнені?"
            onConfirm={() => handleDelete(record.id)}
            okText="Так"
            cancelText="Ні"
          >
            <Tooltip title="Видалити">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
      fixed: "right",
      width: 80,
    },
  ];

  return (
    <div style={{ padding: "0 24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ paddingTop: 24, paddingBottom: 16 }}>
        <Title level={2} style={{ margin: 0, color: "#262626" }}>
          <TeamOutlined style={{ marginRight: 12 }} />
          Управління користувачами
        </Title>
        <Text type="secondary" style={{ fontSize: 14 }}>
          Керуйте користувачами системи, їх ролями та статусами
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Всього користувачів"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Активні"
              value={stats.activeUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Адміністратори"
              value={stats.adminUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Заблоковані"
              value={stats.blockedUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card style={{ borderRadius: 8 }}>
        {/* Action Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 12
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
              size="middle"
            >
              Додати користувача
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchUsers()}
              size="middle"
            >
              Оновити
            </Button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Знайдено: {filtered.length} з {users.length}
            </Text>
          </div>
        </div>

        {/* Filters */}
        <Card
          size="small"
          style={{ marginBottom: 16, backgroundColor: "#fafafa" }}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FilterOutlined />
              <Text style={{ fontWeight: 500 }}>Фільтри</Text>
            </div>
          }
          extra={
            <Button
              size="small"
              icon={<ClearOutlined />}
              onClick={resetFilters}
              type="text"
            >
              Очистити
            </Button>
          }
        >
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input
                allowClear
                placeholder="Пошук за ім'ям, email, телефоном"
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                mode="multiple"
                allowClear
                placeholder="Фільтр по ролях"
                value={rolesFilter}
                onChange={(v) => { setRolesFilter(v); setPage(1); }}
                options={(ROLE_OPTIONS as readonly string[]).map(r => ({ label: r, value: r }))}
                style={{ width: "100%" }}
                maxTagCount={2}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                allowClear
                placeholder="Фільтр по статусу"
                value={stateFilter}
                onChange={(v) => { setStateFilter(v); setPage(1); }}
                options={(STATE_OPTIONS as readonly string[]).map(s => ({ label: s, value: s }))}
                style={{ width: "100%" }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <RangePicker
                value={createdRange}
                onChange={(val) => { setCreatedRange(val as any); setPage(1); }}
                placeholder={["Дата з", "Дата по"]}
                style={{ width: "100%" }}
                size="middle"
              />
            </Col>
          </Row>

          <Divider style={{ margin: "12px 0" }} />

          <Row gutter={[12, 8]}>
            <Col>
              <Checkbox
                checked={typeof hasPhone === "boolean" ? hasPhone : false}
                indeterminate={typeof hasPhone !== "boolean"}
                onChange={(e) => {
                  setHasPhone(e.target.indeterminate ? undefined : e.target.checked);
                  setPage(1);
                }}
              >
                З телефоном
              </Checkbox>
            </Col>
            <Col>
              <Checkbox
                checked={onlyAdmins}
                onChange={(e) => { setOnlyAdmins(e.target.checked); setPage(1); }}
              >
                Тільки адміни
              </Checkbox>
            </Col>
            <Col>
              <Checkbox
                checked={onlyModerators}
                onChange={(e) => { setOnlyModerators(e.target.checked); setPage(1); }}
              >
                Тільки модератори
              </Checkbox>
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Table<User>
          rowKey="id"
          dataSource={paged}
          loading={loading}
          columns={columns}
          pagination={{
            current: page,
            pageSize,
            total: filtered.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} з ${total} записів`,
            onChange: (p, s) => { setPage(p); setPageSize(s || 10); },
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 1000 }}
          size="middle"
          style={{
            backgroundColor: "#fff",
          }}
          rowClassName={(_, index) =>
            index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
          }
        />
      </Card>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <UserAddOutlined />
            {editingUser ? "Редагувати користувача" : "Створити нового користувача"}
          </div>
        }
        onCancel={closeModal}
        onOk={handleSave}
        width={600}
        maskClosable={false}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Ім'я"
                rules={[{ required: true, message: "Введіть ім'я" }]}
              >
                <Input placeholder="Введіть ім'я" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="surname"
                label="Прізвище"
                rules={[{ required: true, message: "Введіть прізвище" }]}
              >
                <Input placeholder="Введіть прізвище" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Введіть email" },
              { type: "email", message: "Некоректний email" }
            ]}
          >
            <Input placeholder="Введіть email адресу" prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item name="phone" label="Телефон">
            <Input placeholder="Введіть номер телефону" prefix={<PhoneOutlined />} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="roles"
                label="Ролі"
                rules={[{ required: true, message: "Оберіть хоча б одну роль" }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Оберіть ролі користувача"
                  options={(ROLE_OPTIONS as readonly string[]).map((r) => ({
                    label: r,
                    value: r
                  }))}
                  filterOption={(input, option) =>
                    (option?.label as string).toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="state" label="Статус" rules={[{ required: true }]}>
                <Select
                  placeholder="Оберіть статус"
                  options={(STATE_OPTIONS as readonly string[]).map((s) => ({
                    label: s,
                    value: s
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Password fields only for new users */}
          {!editingUser && (
            <>
              <Form.Item
                name="password"
                label="Пароль"
                rules={[
                  { required: true, message: "Введіть пароль" },
                  { min: 8, message: "Мінімум 8 символів" },
                  { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, message: "Потрібні: малі, великі літери та цифри" },
                ]}
              >
                <Input.Password
                  placeholder="Придумайте пароль"
                  addonAfter={
                    <Space size={4}>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => {
                          const p = generatePassword(12);
                          form.setFieldsValue({ password: p, confirmPassword: p });
                          message.success("Пароль згенеровано та заповнено");
                        }}
                      >
                        Генерувати
                      </Button>
                      <Button
                        size="small"
                        type="link"
                        onClick={async () => {
                          const p = form.getFieldValue("password");
                          if (!p) return;
                          try {
                            await navigator.clipboard.writeText(p);
                            message.success("Скопійовано в буфер обміну");
                          }
                          catch { message.error("Не вдалося скопіювати"); }
                        }}
                      >
                        Копіювати
                      </Button>
                    </Space>
                  }
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Підтвердіть пароль"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Повторіть пароль" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) return Promise.resolve();
                      return Promise.reject(new Error("Паролі не збігаються"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Повторіть пароль" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>

      {/* Custom styles */}
      <style>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default UsersPage;
