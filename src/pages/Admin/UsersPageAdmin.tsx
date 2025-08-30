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
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

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

const { RangePicker } = DatePicker;

const UsersPage: React.FC = () => {
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

  // ======= Колонки =======
  const columns: ColumnsType<User> = [
    { title: "Ім’я", dataIndex: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Прізвище", dataIndex: "surname", sorter: (a, b) => a.surname.localeCompare(b.surname) },
    { title: "Email", dataIndex: "email" },
    { title: "Телефон", dataIndex: "phone" },
    {
      title: "Ролі",
      dataIndex: "roles",
      render: (roles: string[]) =>
        roles?.map((role) => (
          <Tag color={roleColor(role)} key={role}>
            {role}
          </Tag>
        )),
      sorter: (a, b) => (a.roles.join(",")).localeCompare(b.roles.join(",")),
    },
    {
      title: "Статус",
      dataIndex: "state",
      render: (state: string) => <Tag color={stateColor(state)}>{state}</Tag>,
      sorter: (a, b) => a.state.localeCompare(b.state),
    },
    {
      title: "Створено",
      dataIndex: "createdAt",
      render: (v: string) => dayjs(v).format("DD.MM.YYYY HH:mm"),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      width: 180,
    },
    {
      title: "Дії",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Редагувати
          </Button>
          <Popconfirm title="Видалити користувача?" onConfirm={() => handleDelete(record.id)}>
            <Button danger type="link">
              Видалити
            </Button>
          </Popconfirm>
        </>
      ),
      fixed: "right",
      width: 160,
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 12 }}>Користувачі</h2>

      {/* Панель фільтрів (усе на фронті) */}
      <Space style={{ marginBottom: 12, flexWrap: "wrap" }}>
        <Input
          allowClear
          placeholder="Пошук (ім’я, прізвище, email, телефон)"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          style={{ width: 320 }}
        />

        <Select
          mode="multiple"
          allowClear
          placeholder="Ролі"
          value={rolesFilter}
          onChange={(v) => { setRolesFilter(v); setPage(1); }}
          options={(ROLE_OPTIONS as readonly string[]).map(r => ({ label: r, value: r }))}
          style={{ minWidth: 220 }}
          showSearch
        />

        <Select
          allowClear
          placeholder="Статус"
          value={stateFilter}
          onChange={(v) => { setStateFilter(v); setPage(1); }}
          options={(STATE_OPTIONS as readonly string[]).map(s => ({ label: s, value: s }))}
          style={{ minWidth: 160 }}
        />

        <RangePicker
          value={createdRange ?? null}
          onChange={(val) => { setCreatedRange(val as any); setPage(1); }}
          placeholder={["Створено з", "Створено по"]}
        />

        <Checkbox
          checked={typeof hasPhone === "boolean" ? hasPhone : false}
          indeterminate={typeof hasPhone !== "boolean"}
          onChange={(e) => setHasPhone(e.target.indeterminate ? undefined : e.target.checked)}
        >
          Є телефон
        </Checkbox>

        <Checkbox checked={onlyAdmins} onChange={(e) => { setOnlyAdmins(e.target.checked); setPage(1); }}>
          Тільки Admin
        </Checkbox>
        <Checkbox checked={onlyModerators} onChange={(e) => { setOnlyModerators(e.target.checked); setPage(1); }}>
          Тільки Moderator
        </Checkbox>
        <Button onClick={resetFilters}>Скинути</Button>
        <Button onClick={() => fetchUsers()}>Оновити</Button>

      </Space>

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
          onChange: (p, s) => { setPage(p); setPageSize(s); },
        }}
        scroll={{ x: 1100 }}
      />

      {/* Модалка */}
      <Modal
        open={isModalOpen}
        title={editingUser ? "Редагувати користувача" : "Створити користувача"}
        onCancel={closeModal}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Ім’я" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="surname" label="Прізвище" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
          <Form.Item name="phone" label="Телефон"><Input /></Form.Item>

          <Form.Item
            name="roles"
            label="Ролі"
            rules={[{ required: true, message: "Оберіть хоча б одну роль" }]}
          >
            <Select
              mode="multiple"
              placeholder="Оберіть ролі"
              options={(ROLE_OPTIONS as readonly string[]).map((r) => ({ label: r, value: r }))}
              filterOption={(input, option) =>
                (option?.label as string).toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item name="state" label="Статус" rules={[{ required: true }]}>
            <Select
              placeholder="Оберіть статус"
              options={(STATE_OPTIONS as readonly string[]).map((s) => ({ label: s, value: s }))}
            />
          </Form.Item>

          {/* Пароль лише при створенні */}
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
                        Згенерувати
                      </Button>
                      <Button
                        size="small"
                        type="link"
                        onClick={async () => {
                          const p = form.getFieldValue("password");
                          if (!p) return;
                          try { await navigator.clipboard.writeText(p); message.success("Скопійовано"); }
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
                label="Повторіть пароль"
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
    </div>
  );
};

export default UsersPage;
