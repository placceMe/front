/*import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { EyeOutlined, EyeInvisibleOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "@shared/hooks/useAuth";

// Пример для обертывания с эффектом блюра
const BLUR_STYLE = {
  background: "rgba(229,229,216,0.7)",
  backdropFilter: "blur(14px)",
  border: "1px solid #3E4826",
};

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = () => {

  const { fetchUser, login, loading } = useAuth();

  useEffect(() => {
    fetchUser();
  }, []);


  const onFinish = async (values: any) => {
    try {
      await login(values);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

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
*/

import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { EyeOutlined, EyeInvisibleOutlined,  } from "@ant-design/icons";
import { useAuth } from "@shared/hooks/useAuth";


  const INPUT_STYLE = {
  background: "rgba(231, 231, 220, 1)", // светло-зелёный с прозрачностью
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(62, 72, 38, 1)", // зелёный бордер с прозрачностью
  borderRadius: "8px",
};


interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { fetchUser, login, loading } = useAuth();

  useEffect(() => {
    fetchUser();
  }, []);

  const onFinish = async (values: any) => {
    try {
      const ok = await login(values);
    if (ok) onSuccess?.();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Form 
      layout="vertical" 
      onFinish={onFinish}
      className="space-y-4"
    >
      {/* Email */}
      <Form.Item
        name="email"
        label="E-mail/Логін"
        rules={[
          { required: true, message: "Введіть email" },
          { type: "email", message: "Невірний формат email" },
        ]}
        className="mb-4"
      >
        <Input
          size="middle"
          placeholder="E-mail *"
          style={INPUT_STYLE}
          className="h-9"
        />
      </Form.Item>

      {/* Пароль */}
      <Form.Item
        name="password"
        label="Пароль"
        rules={[{ required: true, message: "Введіть пароль" }]}
        className="mb-4"
      >
        <Input.Password
          size="middle"
          placeholder="Пароль"
          iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
          style={INPUT_STYLE}
          className="h-9"
        />
      </Form.Item>

      {/* Забыли пароль */}
      <div className="text-right mb-4">

        {/** 
        <button 
          type="button"
          className="text-sm text-red-500 hover:underline bg-none border-none p-0 cursor-pointer"
        >
          Забули пароль?
        </button>*/}
      </div>

      {/* Кнопки */}
      <div className="flex gap-3">
        <Button
          type="primary"
          htmlType="submit"
          size="middle"
          loading={loading}
          className="flex-1 h-9 bg-[#425024] hover:bg-[#354020] border-none text-white font-medium"
          style={{ borderRadius: '6px' }}
        >
          Увійти
        </Button>
         {/**
   <Button
  size="middle"
  className="flex items-center justify-center gap-2"
  style={{
    background: "rgba(231, 231, 220, 1)",
    border: "1px solid rgba(62, 72, 38, 1)",
    borderRadius: "6px",
    transition: "all 0.2s ease-in-out",
    color: "#3E4826",
    width: "100%", // по умолчанию — на всю ширину (мобильный вид)
    maxWidth: "250px", // на больших экранах ограничиваем
  }}
  onMouseEnter={(e) => {
    const target = e.currentTarget as HTMLElement;
    target.style.background = "rgba(62, 72, 38, 1)";
    target.style.color = "white";
  }}
  onMouseLeave={(e) => {
    const target = e.currentTarget as HTMLElement;
    target.style.background = "rgba(231, 231, 220, 1)";
    target.style.color = "#3E4826";
  }}
>
 
  <span className="hidden sm:inline">Вхід за допомогою</span>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 533.5 544.3"
    fill="currentColor"
  >
    <path d="M533.5 278.4c0-18.6-1.5-37.1-4.6-55.3H272.1v104.8h146.9c-6.3 34-25.2 63-53.6 82.1v68.2h86.5c50.6-46.6 81.6-115.2 81.6-199.8z" />
    <path d="M272.1 544.3c72.5 0 133.4-23.9 177.8-64.9l-86.5-68.2c-24 16.2-54.6 25.8-91.3 25.8-70.1 0-129.5-47.3-150.8-110.8H32.4v69.5c44.5 88.1 135.4 148.6 239.7 148.6z" />
    <path d="M121.3 326.2c-11.3-33.5-11.3-69.9 0-103.4V153.3H32.4c-38.8 77.7-38.8 169.6 0 247.3l88.9-74.4z" />
    <path d="M272.1 107.7c39.4-.6 77.2 13.8 106 40.6l79.1-79.1C408.1 24.3 344.6 0 272.1 0 167.8 0 76.9 60.5 32.4 148.6l88.9 74.4c21.3-63.5 80.7-110.8 150.8-110.8z" />
  </svg>
</Button> */}


      </div>
    </Form>
  );
};