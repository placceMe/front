import React, { useEffect } from "react";
import { Form, Input, Button, Row, Col, Popconfirm } from "antd";
import { useAppDispatch } from "@store/hooks";
import { setUser } from "../entities/user/model/userSlice";
import {
  UserOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import type { User } from "@shared/types/api";
import { useRequest } from "@shared/request/useRequest";
import { useAuth } from "@shared/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { logout, loading } = useAuth();

  const { request } = useRequest();


  /*
  useEffect(() => {
    if (user) {
      console.log("📥 Данные пользователя с сервера:", user);
      const formattedPhone = user.phone
        ? user.phone
            .replace(/\D/g, "") // удаляем всё, кроме цифр
            .replace(/^38?(\d{3})(\d{3})(\d{2})(\d{2})$/, "+38($1) $2 $3 $4")
        : "";

      form.setFieldsValue({
        name: user.name || "",
        surname: user.surname || "",
        // middleName: user.middleName || "",
        email: user.email || "",
        phone: formattedPhone || "",
        // birthDate: user.birthDate ? dayjs(user.birthDate) : undefined,
      });
    }
    navigate("/profile#info");
  }, [user, form]);

  const onFinish = async (values: any) => {
    const payload: any = {
    ...user,          
    ...values,        
     birthDate: values.birthDate ? values.birthDate.toISOString() : null,
   
  };
    const updatedUser = await request<User>(`/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
        ...values,
        id: user.id, // гарантируем совпадение
        birthDate: values.birthDate ? values.birthDate.toISOString() : null,
      }),
    });

    console.log("📤 PUT body:", {
      ...user,
      ...values,
      Id: user.id,
      birthDate: values.birthDate ? values.birthDate.toISOString() : null,
    });

    if (updatedUser) {
      dispatch(setUser(updatedUser));
      window.alert("Дані оновлено!");
    } else {
      window.alert("Помилка оновлення!");
    }
  };
  if (!user) return null;
*/
  useEffect(() => {
    if (user) {
      const formattedPhone = user.phone
        ? user.phone.replace(/\D/g, "").replace(/^38?(\d{3})(\d{3})(\d{2})(\d{2})$/, "+38($1) $2 $3 $4")
        : "";

      form.setFieldsValue({
        name: user.name || "",
        surname: user.surname || "",
        email: user.email || "",
        phone: formattedPhone || "",
        // Если хочешь проставлять дату в форме:
        // birthDate: user.birthDate ? dayjs(user.birthDate) : undefined,
      });
    }
    // ❌ убери автопереход отсюда
    // navigate("/profile#info");
  }, [user, form]);

  const onFinish = async (values: any) => {
    const payload: any = {
      name: values.name,
      surname: values.surname,
      email: values.email,
      phone: values.phone
        ? "+38" + values.phone.replace(/\D/g, "").replace(/^38/, "")
        : null,

    };

    // Если меняем пароль — добавляем поля, иначе не шлём вовсе
    if (values.oldPassword && values.newPassword && values.confirmPassword) {
      payload.oldPassword = values.oldPassword;
      payload.newPassword = values.newPassword;
      payload.confirmPassword = values.confirmPassword;
    }

    const updatedUser = await request<User>(`/api/users/${user.id}`, {
      method: "PUT",
      body: payload,
    });

    if (updatedUser) {
      dispatch(setUser(updatedUser));
      window.alert("Дані оновлено!");
      // ✅ если нужен переход — делай тут:
      navigate("/profile#info");
    } else {
      window.alert("Помилка оновлення!");
    }
  };

  async function signOut() {
    await logout();
    // await apiLogout();
    // dispatch(logout());
    navigate("/");
  }

  return (
    <div>
      {/**   <BlurBlock backgroundImage={BgBuyer}>*/}

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Контактна інформація
      </h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={loading}
      >
        <Row gutter={19} className="mb-2">
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={5} // xs=мобилка, sm=планшет, md=средний экран, lg=большой
          >
            <Form.Item
              label={
                <span>
                  Ім'я
                  <span className="text-red-500 ml-1 align-middle"></span>
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

          <Col xs={24} sm={12} md={8} lg={5}>
            <Form.Item
              label={
                <span>
                  Прізвище{" "}
                  <span className="text-red-500 ml-1 align-middle"></span>
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

          <Col xs={24} sm={12} md={8} lg={5}>
            {/* Ваш закомментированный код */}
          </Col>
        </Row>

        <Row gutter={120} align="top">
          <Col xs={24} md={10}>
            {/**       
            <Form.Item
              label={<span>Дата народження</span>}
              name="birthDate"
              className="mb-2"
            >
              <DatePicker
                placeholder="02.03.1994"
                format="DD.MM.YYYY"
                className="w-full h-10 rounded-xl"
                suffixIcon={
                  <CalendarOutlined
                    style={{ color: "#52c41a", fontSize: 16 }}
                  />
                }
                style={BLUR_STYLE}
              />
            </Form.Item>*/}
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
            {/**   <Form.Item
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
            </Form.Item>*/}
          </Col>
          {/** 
          <Col xs={24} md={10}>
            <Form.Item
              label={<span>Старий пароль</span>}
              name="oldPassword"
              className="mb-2"
            >
              <Input.Password
                placeholder="***********"
                className="h-10 rounded-xl font-semibold"
                iconRender={(visible) =>
                  visible ? <LockOutlined /> : <LockOutlined />
                }
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
                iconRender={(visible) =>
                  visible ? <LockOutlined /> : <LockOutlined />
                }
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
                iconRender={(visible) =>
                  visible ? <LockOutlined /> : <LockOutlined />
                }
                style={BLUR_STYLE}
              />
            </Form.Item>
          </Col>
*/}

        </Row>

        <div className="flex justify-between items-center my-8 gap-4">
          <Button
            type="primary"
            htmlType="submit"
            className="bg-green-700 hover:bg-green-800 border-green-700 h-10 px-8 rounded-xl"
            style={{
              fontFamily: "Montserrat, Arial, sans-serif",
              fontWeight: 600,
              fontSize: 15,
            }}
          >
            Зберегти
          </Button>
          <div className="flex gap-4">
            <Popconfirm
              title="Ви впевнені, що хочете вийти з акаунта?"
              okText="Так, вийти"
              cancelText="Скасувати"
              okButtonProps={{ danger: true }}
              onConfirm={() => signOut()}
            >
              <Button
                type="default"
                htmlType="button"
                className="h-10 px-7 font-bold rounded-xl shadow-none transition-all"
                style={{
                  ...BLUR_STYLE,
                  color: "#2E3116",
                  fontFamily: "Montserrat, Arial, sans-serif",
                  fontWeight: 700,
                  fontSize: 15,
                  border: "1px solid #3E4826",
                }}
              >
                Вихід
              </Button>
            </Popconfirm>
            {/** 
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
          </Button>*/}
          </div>
        </div>
      </Form>

      {/**   </BlurBlock>  */}
    </div>
  );
};

export default RegistrationForm;
