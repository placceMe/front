import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card } from "antd";
import { useAppDispatch } from "@store/hooks";
import { setUser } from "../../entities/user/model/userSlice";
import type { User } from "@shared/types/api";
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { API_PORTS, useRequest } from "@shared/request/useRequest";

// Пример для обертывания с эффектом блюра
const BLUR_STYLE = {
  background: "rgba(229,229,216,0.7)",
  backdropFilter: "blur(14px)",
  border: "1px solid #3E4826",
};

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm:React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { request, error, loading: requestLoading } = useRequest(API_PORTS.USERS);
  const dispatch = useAppDispatch();

  const onFinish = async (values: { email: string; password: string; }) => {
    setLoading(true);
    try {
      const resp = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.success) {
        await fetchUser();
           onSuccess?.();
      }



    } finally {
      setLoading(false);
    }
  };


  async function fetchUser() {
    const user = await request("/api/auth/me");
    if (user) {
      dispatch(setUser(user));
    } else {
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);



  return (
    <div className="flex justify-center items-center min-h-[300px]">

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
            placeholder="Ваш пароль"
            iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            style={BLUR_STYLE}
            className="rounded-xl"
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          block
          className="bg-green-700 hover:bg-green-800 rounded-xl mt-2"
        >
          Увійти
        </Button>
      </Form>

    </div>
  );
};
