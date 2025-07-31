import React from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined, IdcardOutlined } from "@ant-design/icons";
import { useAuth } from "@shared/hooks/useAuth";

const BLUR_STYLE = {
  background: "rgba(229,229,216,0.7)",
  backdropFilter: "blur(14px)",
  border: "1px solid #3E4826",
};

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = () => {
  const { register, loading } = useAuth();

  const onFinish = async (values: any) => {
    await register(values);
  };

  return (
    <div className="flex justify-center items-center min-h-[300px] mt-10">
      <Form layout="vertical" onFinish={onFinish} disabled={loading}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Введіть email" },
            { type: "email", message: "Невірний формат email" },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Ваша пошта"
            style={BLUR_STYLE}
            className="rounded-xl"
          />
        </Form.Item>
        <Form.Item
          name="password"
          label="Пароль"
          rules={[{ required: true, message: "Введіть пароль" }]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Придумайте пароль"
            className="rounded-xl"
            style={BLUR_STYLE}
          />
        </Form.Item>
        <Form.Item
          name="name"
          label="Ім’я"
          rules={[{ required: true, message: "Введіть ім’я" }]}
        >
          <Input
            size="large"
            prefix={<IdcardOutlined />}
            placeholder="Ваше ім’я"
            className="rounded-xl"
            style={BLUR_STYLE}
          />
        </Form.Item>
        <Form.Item
          name="surname"
          label="Прізвище"
          rules={[{ required: true, message: "Введіть прізвище" }]}
        >
          <Input
            size="large"
            prefix={<IdcardOutlined />}
            placeholder="Ваше прізвище"
            className="rounded-xl"
            style={BLUR_STYLE}
          />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Телефон"
          rules={[
            { required: true, message: "Введіть номер телефону" },
            { pattern: /^\+?\d{10,15}$/, message: "Невірний формат телефону" },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Ваш номер телефону"
            className="rounded-xl"
            style={BLUR_STYLE}
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          className="bg-green-700 hover:bg-green-800 rounded-xl mt-2"
        >
          Зареєструватися
        </Button>
      </Form>
    </div>
  );
};
