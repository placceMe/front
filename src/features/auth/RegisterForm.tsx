/*import React from "react";
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
*/
import React from "react";
import { Form, Input, Button } from "antd";
import {
  EyeInvisibleOutlined,
  EyeOutlined
} from "@ant-design/icons";
import { useAuth } from "@shared/hooks/useAuth";
import RegisterGearImg from "@assets/pages/equip.svg?react";




interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
}) => {
  const { register, loading } = useAuth();

  const onFinish = async (values: any) => {
    try {
      await register(values);
      onSuccess?.();
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  const INPUT_STYLE = {
  background: "rgba(231, 231, 220, 1)", // светло-зелёный с прозрачностью
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(62, 72, 38, 1)", // зелёный бордер с прозрачностью
  borderRadius: "6px",
};

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start w-full">
      {/* Левая часть - форма */}
      <div className="flex-1 min-w-full md:min-w-96">
        <h2 className="text-2xl font-bold mb-4 text-[#425024]">
          Реєстрація нового користувача
        </h2>
        <Form
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
          className="space-y-1"
        >
          <Form.Item
            name="name"
            label="Ім'я"
            rules={[{ required: true, message: "Введіть ім'я" }]}
        //    className="mb-1"
          >
            <Input
              size="middle"
              placeholder="Ваше ім'я *"
              style={INPUT_STYLE}
              className="h-9"
            />
          </Form.Item>

          <Form.Item
            name="surname"
            label="Прізвище"
            rules={[{ required: true, message: "Введіть прізвище" }]}
          //  className="mb-2"
          >
            <Input
              size="middle"
              placeholder="Ваше прізвище *"
              style={INPUT_STYLE}
              className="h-9"
            />
          </Form.Item>
{/**
          <Form.Item
            name="birthDate"
            label="Дата народження"
            rules={[{ required: true, message: "Введіть дату народження" }]}
            className="mb-4"
          >
            <DatePicker
              size="large"
              placeholder="Дата народження"
              style={{ ...INPUT_STYLE, width: "100%" }}
              className="h-12"
              format="DD.MM.YYYY"
            />
          </Form.Item> */}

          <Form.Item
            name="phone"
            label="Номер телефону"
            rules={[
              { required: true, message: "Введіть номер телефону" },
              { pattern: /^\+?\d{10,15}$/, message: "Невірний формат телефону" },
            ]}
          //  className="mb-4"
          >
            <Input
              size="middle"
              placeholder="Телефон *"
              style={INPUT_STYLE}
              className="h-9"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail/Логін"
            rules={[
              { required: true, message: "Введіть email" },
              { type: "email", message: "Невірний формат email" },
            ]}
            //className="mb-4"
          >
            <Input
              size="middle"
              placeholder="E-mail *"
              style={INPUT_STYLE}
              className="h-9"
            />
          </Form.Item>

          {/**<Form.Item name="subscribe" valuePropName="checked" className="mb-4">
              <Checkbox className="text-sm text-gray-700">
             
              Отримувати повідомлення про новинки та акції
            </Checkbox>
          </Form.Item>*/}

          <Form.Item
            name="password"
            label="Новий пароль"
            rules={[
              { required: true, message: "Введіть пароль" },
              { min: 6, message: "Пароль повинен містити мінімум 6 символів" },
            ]}
           // className="mb-4"
          >
            <Input.Password
              size="middle"
              placeholder="Пароль"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              style={INPUT_STYLE}
              className="h-9"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Підтвердження пароля"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Підтвердіть пароль" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Паролі не співпадають!")
                  );
                },
              }),
            ]}
           // className="mb-6"
          >
            <Input.Password
              size="middle"
              placeholder="Введіть пароль повторно"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
              style={INPUT_STYLE}
              className="h-9"
            />
          </Form.Item>

          <div className="flex flex-col md:flex-row gap-3">
           <Button
    type="primary"
    htmlType="submit"
    size="middle"
    loading={loading}
    className="w-full md:flex-1 h-12 bg-[#425024] hover:bg-[#354020] border-none text-white font-medium mt-2 mb-2"
    style={{ borderRadius: "6px" }}
  >
    Створити акаунт
  </Button>
      <Button
        size="middle"
        className="flex items-center justify-center gap-2 mt-2 mb-2"
        style={{
          background: "rgba(231, 231, 220, 1)",
          border: "1px solid rgba(62, 72, 38, 1)",
          borderRadius: "6px",
          transition: "all 0.2s ease-in-out",
          color: "#3E4826",
          width: "100%", // по умолчанию — на всю ширину (мобильный вид)
         // maxWidth: "250px", // на больших экранах ограничиваем
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
        <span className="hidden sm:inline ">Вхід за допомогою</span>
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
      </Button>



          </div>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Вже маєте акаунт?{" "}
              <button
                type="button"
                className="text-[#425024] hover:underline bg-none border-none p-0 cursor-pointer"
                onClick={onSwitchToLogin}
              >
                Увійти
              </button>
            </span>
          </div>
        </Form>
      </div>

      {/* Правая часть — картинка */}
      <div className="hidden md:block w-full md:w-[420px]">
        <RegisterGearImg width={390}/>
      </div>
    </div>
  );
};
