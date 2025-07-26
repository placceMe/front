import React from "react";
import { Form, Input, Button, Card } from "antd";
import { useAppDispatch } from "@store/hooks";
import { setUser } from "../../entities/user/model/userSlice";
import { UserOutlined, LockOutlined, IdcardOutlined } from "@ant-design/icons";

const BLUR_STYLE = {
  background: "rgba(229,229,216,0.7)",
  backdropFilter: "blur(14px)",
  border: "1px solid #3E4826",
};

export const RegisterForm = () => {
  const dispatch = useAppDispatch();

  const onFinish = async (values: any) => {
    const resp = await fetch("http://localhost:5002/api/Users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        roles: ["Buyer"], // Или ["Saler"], если регаешь продавца
        state: "Active",
        createdAt: new Date().toISOString(),
      }),
    });
    if (resp.ok) {
      const user = await resp.json();
      dispatch(setUser(user));
      window.alert("Успешно зарегистрирован!");
    } else {
      window.alert("Ошибка регистрации!");
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
