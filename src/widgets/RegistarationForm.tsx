
import React, { useEffect } from "react";
import { Form, Input, Button, DatePicker, Row, Col } from "antd";
import { useAppDispatch } from "@store/hooks";
import { logout, setUser } from "../entities/user/model/userSlice";
import { UserOutlined, LockOutlined, IdcardOutlined, PhoneOutlined, CalendarOutlined } from "@ant-design/icons";
import type { User } from "@shared/types/api";
import { API_PORTS, useRequest } from "@shared/request/useRequest";

const BLUR_STYLE = {
  background: "rgba(229,229,216,0.7)",
  backdropFilter: "blur(14px)",
  border: "1px solid #3E4826",
};

interface RegistrationFormProps {
  user: User;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ user }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const { request, error, loading } = useRequest();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || "",
        surname: user.surname || "",
        // middleName: user.middleName || "",
        email: user.email || "",
        phone: user.phone || "",
        // birthDate: user.birthDate ? dayjs(user.birthDate) : undefined,
      });
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    const resp = await fetch(`http://localhost:5002/api/Users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...user,
        ...values,
        birthDate: values.birthDate ? values.birthDate.toISOString() : null,
      }),
    });
    if (resp.ok) {
      const updatedUser = await resp.json();
      dispatch(setUser(updatedUser));
      window.alert("Дані оновлено!");
    } else {
      window.alert("Помилка оновлення!");
    }
  };

  if (!user) return null;



  async function signOut() {
    await request("/api/auth/logout", { method: "POST" });
    dispatch(logout());
  }

  return (<div>
    {/**   <BlurBlock backgroundImage={BgBuyer}>*/}

    <h2 className="text-2xl font-bold text-gray-800 mb-6">
      Контактна інформація
    </h2>
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={19} className="mb-2">
        <Col span={5}>
          <Form.Item
            label={
              <span>
                Ім'я
                <span className="text-red-500 ml-1 align-middle">*</span>
              </span>
            }
            name="name"
            rules={[{ required: true, message: "Введіть ім'я" }]}
          >
            <Input
              placeholder="Артем"
              className="h-10 rounded-xl font-semibold"
              style={BLUR_STYLE}
              prefix={<IdcardOutlined />}
            />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item
            label={
              <span>
                Прізвище <span className="text-red-500 ml-1 align-middle">*</span>
              </span>
            }
            name="surname"
            rules={[{ required: true, message: "Введіть прізвище" }]}
          >
            <Input
              placeholder="Павленко"
              className="h-10 rounded-xl font-semibold"
              style={BLUR_STYLE}
              prefix={<IdcardOutlined />}
            />
          </Form.Item>
        </Col>
        <Col span={5}>
          {/**

             
              <Form.Item
                label={
                  <span>
                    По-батькові <span className="text-red-500 ml-1 align-middle">*</span>
                  </span>
                }
                name="middleName"
              >
                <Input
                  placeholder="Олександрович"
                  className="h-10 rounded-xl font-semibold"
                  style={BLUR_STYLE}
                  prefix={<IdcardOutlined />}
                />
              </Form.Item> 
              */ }
        </Col>
      </Row>

      <Row gutter={120} align="top">
        <Col xs={24} md={10}>
          <Form.Item
            label={<span>Дата народження</span>}
            name="birthDate"
            className="mb-2"
          >
            <DatePicker
              placeholder="02.03.1994"
              format="DD.MM.YYYY"
              className="w-full h-10 rounded-xl"
              suffixIcon={<CalendarOutlined style={{ color: "#52c41a", fontSize: 16 }} />}
              style={BLUR_STYLE}
            />
          </Form.Item>
          <Form.Item
            label={<span>E-mail/Логін</span>}
            name="email"
            rules={[
              { type: "email", message: "Невірний формат email" },
              { required: true, message: "Введіть email" },
            ]}
          >
            <Input
              placeholder="artem@gmail.com"
              className="h-10 rounded-xl font-semibold"
              style={BLUR_STYLE}
              prefix={<UserOutlined />}
            />
          </Form.Item>
          <Form.Item
            label={<span>Номер телефону</span>}
            name="phone"
            rules={[
              {
                pattern: /^\+38\s?\(\d{3}\)\s?\d{3}\s?\d{2}\s?\d{2}$/,
                message: "Введіть коректний номер телефону",
              },
            ]}
          >
            <Input
              placeholder="+38(050) 430 63 26"
              className="h-10 rounded-xl font-semibold"
              style={BLUR_STYLE}
              prefix={<PhoneOutlined />}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={10}>
          <Form.Item
            label={<span>Старий пароль</span>}
            name="oldPassword"
            className="mb-2"
          >
            <Input.Password
              placeholder="***********"
              className="h-10 rounded-xl font-semibold"
              iconRender={visible => visible ? <LockOutlined /> : <LockOutlined />}
              style={BLUR_STYLE}
            />
          </Form.Item>
          <Form.Item
            label={<span>Новий пароль</span>}
            name="newPassword"
            className="mb-2"
          >
            <Input.Password
              placeholder="Введіть новий пароль"
              className="h-10 rounded-xl font-semibold"
              iconRender={visible => visible ? <LockOutlined /> : <LockOutlined />}
              style={BLUR_STYLE}
            />
          </Form.Item>
          <Form.Item
            label={<span>Підтвердження пароля</span>}
            name="confirmPassword"
            className="mb-2"
          >
            <Input.Password
              placeholder="Введіть новий пароль повторно"
              className="h-10 rounded-xl font-semibold"
              iconRender={visible => visible ? <LockOutlined /> : <LockOutlined />}
              style={BLUR_STYLE}
            />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex justify-between items-center my-8 gap-4">
        <Button
          type="primary"
          htmlType="submit"
          className="bg-green-700 hover:bg-green-800 border-green-700 h-10 px-8 rounded-xl"
          style={{
            fontFamily: 'Montserrat, Arial, sans-serif',
            fontWeight: 600,
            fontSize: 15,
          }}>
          Зберегти
        </Button>
        <div className="flex gap-4">
          <Button
            type="default"
            className="h-10 px-7 font-bold rounded-xl shadow-none transition-all"
            style={{
              ...BLUR_STYLE,
              color: '#2E3116',
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontWeight: 700,
              fontSize: 15,
              border: '1px solid #3E4826',
            }}
            onClick={() => {
              signOut();
            }}
          >
            Вихід
          </Button>
          <Button
            type="default"
            className="h-10 px-7 font-bold rounded-xl shadow-none transition-all"
            style={{
              ...BLUR_STYLE,
              color: '#BD1645',
              fontFamily: 'Montserrat, Arial, sans-serif',
              fontWeight: 700,
              fontSize: 15,
              border: '1px solid #3E4826',
            }}
          >
            Видалити мій акаунт
          </Button>
        </div>
      </div>
    </Form>

    {/**   </BlurBlock>  */}
  </div>
  );
};

export default RegistrationForm;