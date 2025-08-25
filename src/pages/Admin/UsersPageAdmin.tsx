// src/pages/admin/UsersPage.tsx
import React, { useEffect, useState } from "react";
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
  Tooltip,
} from "antd";

type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string | null;
  roles: string[];
  state: string;
  createdAt: string;
  avatarUrl?: string | null;
};

const API_URL = "http://localhost:8080/api/users";

// Разрешённые значения (синхронны с backend-моделями)
const ROLE_OPTIONS = ["Admin", "User", "Saler", "Moderator"] as const;
const STATE_OPTIONS = ["Active", "Inactive", "Blocked", "Deleted"] as const;

const roleColor = (r: string) =>
  r === "Admin" ? "red" : r === "Moderator" ? "geekblue" : r === "Saler" ? "green" : "blue";
const stateColor = (s: string) =>
  s === "Active" ? "green" : s === "Inactive" ? "default" : s === "Blocked" ? "orange" : "volcano";

// простой генератор паролей
const generatePassword = (len = 12) => {
  const lowers = "abcdefghijklmnopqrstuvwxyz";
  const uppers = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  const syms = "!@#$%^&*()_+-=[]{},.<>?";
  const all = lowers + uppers + nums + syms;

  const pick = (charset: string) => charset[Math.floor(Math.random() * charset.length)];
  // гарантируем наличие категорий
  let pwd = pick(lowers) + pick(uppers) + pick(nums) + pick(syms);
  for (let i = pwd.length; i < len; i++) pwd += pick(all);
  // перемешаем
  return pwd.split("").sort(() => Math.random() - 0.5).join("");
};

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // загрузка пользователей
  const fetchUsers = async () => {
    setLoading(true);
    console.log("📥 [fetchUsers] start");
    try {
      const res = await fetch(API_URL);
      const data = (await res.json()) as User[];
      console.log("✅ [fetchUsers] success:", data);
      setUsers(data);
    } catch (err) {
      console.error("❌ [fetchUsers] error:", err);
      message.error("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // удаление
  const handleDelete = async (id: string) => {
    console.log("🗑 [deleteUser] try delete:", id);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        console.log("✅ [deleteUser] success:", id);
        message.success("Пользователь удалён");
        fetchUsers();
      } else {
        console.warn("⚠️ [deleteUser] failed:", res.status);
        message.error("Не удалось удалить");
      }
    } catch (err) {
      console.error("❌ [deleteUser] error:", err);
      message.error("Ошибка сервера");
    }
  };

  // открыть модалку
  const openModal = (user?: User) => {
    setEditingUser(user || null);
    form.setFieldsValue(
      user || {
        name: "",
        surname: "",
        email: "",
        phone: "",
        roles: ["User"], // дефолт
        state: "Active",
        password: "",
        confirmPassword: "",
      }
    );
    setIsModalOpen(true);
    console.log("📂 [modal] open", user ? { mode: "edit", user } : { mode: "create" });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingUser(null);
    console.log("📂 [modal] close");
  };

  // только разрешённые роли/статусы
  const sanitizeRoles = (roles: string[]) =>
    Array.from(new Set(roles)).filter((r) => ROLE_OPTIONS.includes(r as any));
  const sanitizeState = (state: string) =>
    STATE_OPTIONS.includes(state as any) ? state : "Active";

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("Пароль скопирован в буфер обмена");
    } catch {
      message.error("Не удалось скопировать пароль");
    }
  };

  // сохранить (POST или PUT)
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

      // только при создании
      if (!editingUser) {
        payload.password = raw.password;
      }

      console.log("💾 [saveUser] payload:", { ...payload, password: payload.password ? "***" : undefined });

      if (editingUser) {
        // обновление
        const res = await fetch(`${API_URL}/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...editingUser, ...payload }),
        });
        if (res.ok) {
          console.log("✅ [updateUser] success:", editingUser.id);
          message.success("Пользователь обновлён");
        } else {
          console.warn("⚠️ [updateUser] failed:", res.status);
          message.error("Ошибка при обновлении");
        }
      } else {
        // создание (+ пароль)
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          console.log("✅ [createUser] success");
          message.success("Пользователь создан");
        } else {
          console.warn("⚠️ [createUser] failed:", res.status);
          message.error("Ошибка при создании");
        }
      }

      closeModal();
      fetchUsers();
    } catch (err: any) {
      if (err?.errorFields) {
        console.warn("⚠️ [formValidation] failed:", err.errorFields);
      } else {
        console.error("❌ [saveUser] error:", err);
        message.error("Ошибка при сохранении");
      }
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Пользователи</h2>

      <Button type="primary" onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Создать пользователя
      </Button>

      <Table<User>
        rowKey="id"
        dataSource={users}
        loading={loading}
        columns={[
          { title: "Имя", dataIndex: "name" },
          { title: "Фамилия", dataIndex: "surname" },
          { title: "Email", dataIndex: "email" },
          { title: "Телефон", dataIndex: "phone" },
          {
            title: "Роли",
            dataIndex: "roles",
            render: (roles: string[]) =>
              roles?.map((role) => (
                <Tag color={roleColor(role)} key={role}>
                  {role}
                </Tag>
              )),
          },
          {
            title: "Статус",
            dataIndex: "state",
            render: (state: string) => <Tag color={stateColor(state)}>{state}</Tag>,
          },
          {
            title: "Действия",
            render: (_, record) => (
              <>
                <Button type="link" onClick={() => openModal(record)}>
                  Редактировать
                </Button>
                <Popconfirm
                  title="Удалить пользователя?"
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button danger type="link">
                    Удалить
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />

      <Modal
        open={isModalOpen}
        title={editingUser ? "Редактировать пользователя" : "Создать пользователя"}
        onCancel={closeModal}
        onOk={handleSave}
      >
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(_, all) => console.log("✏️ [form] change:", all)}
        >
          <Form.Item name="name" label="Имя" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="surname" label="Фамилия" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Телефон">
            <Input />
          </Form.Item>

          <Form.Item
            name="roles"
            label="Роли"
            rules={[{ required: true, message: "Выберите хотя бы одну роль" }]}
          >
            <Select
              mode="multiple"
              placeholder="Выберите роли"
              options={ROLE_OPTIONS.map((r) => ({ label: r, value: r }))}
              filterOption={(input, option) =>
                (option?.label as string).toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="state"
            label="Статус"
            rules={[{ required: true, message: "Выберите статус" }]}
          >
            <Select
              placeholder="Выберите статус"
              options={STATE_OPTIONS.map((s) => ({ label: s, value: s }))}
            />
          </Form.Item>

          {/* Пароль только при создании */}
          {!editingUser && (
            <>
              <Form.Item
                name="password"
                label="Пароль"
                rules={[
                  { required: true, message: "Введите пароль" },
                  { min: 8, message: "Минимум 8 символов" },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message: "Должны быть строчные, прописные буквы и цифры",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Придумайте пароль"
                  addonAfter={
                    <Space size={4}>
                      <Tooltip title="Сгенерировать">
                        <Button
                          size="small"
                          type="link"
                          onClick={() => {
                            const p = generatePassword(12);
                            form.setFieldsValue({ password: p, confirmPassword: p });
                            message.success("Пароль сгенерирован");
                          }}
                        >
                          Сгенерировать
                        </Button>
                      </Tooltip>
                      <Tooltip title="Копировать">
                        <Button
                          size="small"
                          type="link"
                          onClick={() => {
                            const p = form.getFieldValue("password");
                            if (p) copyToClipboard(p);
                          }}
                        >
                          Копировать
                        </Button>
                      </Tooltip>
                    </Space>
                  }
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Повторите пароль"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Повторите пароль" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Пароли не совпадают"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Повторите пароль" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
