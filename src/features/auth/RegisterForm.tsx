import React from "react";
import { Form, Input, Button } from "antd";
import { useAppDispatch } from "@store/hooks";
import { setUser } from "../../entities/user/model/userSlice";
import { UserOutlined, LockOutlined, IdcardOutlined } from "@ant-design/icons";
import { API_PORTS, useRequest } from "@shared/request/useRequest";
import { useNavigate } from "react-router-dom";

const BLUR_STYLE = {
  background: "rgba(229,229,216,0.7)",
  backdropFilter: "blur(14px)",
  border: "1px solid #3E4826",
};

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const { request } = useRequest();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const resp = await request("/api/Auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        roles: ["User"], // или "Saler"
        state: "Active",
        createdAt: new Date().toISOString(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resp?.success && resp?.user?.id) {
      dispatch(setUser(resp.user));
      onSuccess?.();
      navigate("/profile#info");
    } else {
      window.alert("Помилка під час реєстрації");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[300px] mt-10">
      <Form layout="vertical" onFinish={onFinish}>
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
