/*import { Layout, Menu } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { MdHeight } from "react-icons/md";
import { NavLink, Outlet } from "react-router-dom";

const contentStyle: React.CSSProperties = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#0958d9',
};

const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
};


const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100vw',
    minHeight: "100vh"
};

const Admin: React.FC = () => {
    return (
        <Layout style={layoutStyle}>
            <Sider width="240px" style={siderStyle}>
                <Menu
                    style={{ height: '100%', borderRight: 0 }}

                    items={[
                        { key: 'categogories', label: <NavLink to="/admin/categories">Категории</NavLink>, icon: <MdHeight /> },
                        { key: 'characteristics', label: <NavLink to="/admin/characteristics">Характеристики</NavLink>, icon: <MdHeight /> },

                    ]}

                />
            </Sider>
            <Content style={contentStyle}>
                <Outlet />
            </Content>

        </Layout>

    );
};

export default Admin;
*/



// pages/Admin/ui/Admin.tsx
import React, { useMemo, useState } from "react";
import {
  Layout,
  Menu,
  ConfigProvider,
  Button,
  Input,
  Dropdown,
  Avatar,
  Breadcrumb,
} from "antd";
import {
  MdDashboard,
  MdCategory,
  MdTune,
  MdLogout,
  MdSettings,
  MdMenu,
} from "react-icons/md";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Sider, Footer } = Layout;

const GREEN = {
  primary: "#3A5A40",
  primaryHover: "#2F4B35",
  bg: "#F1F4F0",
  cardBg: "#FFFFFF",
  border: "#DCE3D8",
};

const HEADER_HEIGHT = 64; // фиксированная высота хедера
const FOOTER_HEIGHT = 48; // фиксированная высота футера

const Admin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // активный пункт меню
  const selectedKey = useMemo(() => {
    if (location.pathname.startsWith("/admin/characteristics"))
      return "characteristics";
    if (location.pathname.startsWith("/admin/categories"))
      return "categories";
    return "dashboard";
  }, [location.pathname]);

  const menuItems = [
    {
      key: "dashboard",
      icon: <MdDashboard size={18} />,
      label: <NavLink to="/admin/categories">Панель</NavLink>,
    },
    {
      key: "categories",
      icon: <MdCategory size={18} />,
      label: <NavLink to="/admin/categories">Категорії</NavLink>,
    },
    {
      key: "characteristics",
      icon: <MdTune size={18} />,
      label: <NavLink to="/admin/characteristics">Характеристики</NavLink>,
    },
    {
  key: "products",
  icon: <MdCategory size={18} />,
  label: <NavLink to="/admin/products">Товари</NavLink>,
},
{
  key: "users",
  icon: <MdDashboard size={18} />,
  label: <NavLink to="/admin/users">Користувачі</NavLink>,
},
{
  key: "feedback",
  icon: <MdTune size={18} />,
  label: <NavLink to="/admin/feedback">Відгуки</NavLink>,
},
  ];

  const userMenu = {
    items: [
      { key: "settings", icon: <MdSettings size={16} />, label: "Настройки" },
      { type: "divider" as const },
      {
        key: "logout",
        icon: <MdLogout size={16} />,
        label: "Выйти",
        danger: true,
      },
    ],
    onClick: ({ key }: { key: string }) => {
      if (key === "logout") navigate("/");
    },
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: GREEN.primary,
          colorPrimaryHover: GREEN.primaryHover,
          colorBgLayout: GREEN.bg,
          colorBorder: GREEN.border,
          borderRadius: 12,
        },
        components: {
          Layout: {
            headerBg: GREEN.cardBg,
            headerPadding: "0 16px",
            siderBg: "#223127",
            bodyBg: GREEN.bg,
          },
          Menu: {
            darkItemColor: "rgba(255,255,255,.85)",
            darkItemBg: "#223127",
            darkItemSelectedBg: "#1C2A22",
            darkItemHoverBg: "#27382D",
            itemBorderRadius: 10,
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          theme="dark"
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={240}
          style={{
            position: "sticky",
            left: 0,
            top: 0,
            height: "100vh",
          }}
        >
          {/* Лого / заголовок */}
          <div
            style={{
              height: HEADER_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              padding: collapsed ? 0 : "0 16px",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: 0.4,
            }}
          >
            {!collapsed ? "Admin Console" : "AC"}
          </div>

          {/* Меню */}
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ borderRight: 0, padding: "8px 8px 16px" }}
          />
        </Sider>

        <Layout>
          {/* Хедер */}
          <Header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: 12,
              height: HEADER_HEIGHT,
              lineHeight: `${HEADER_HEIGHT}px`,
              boxSizing: "border-box",
              background: "#fff",
              borderBottom: `1px solid ${GREEN.border}`,
            }}
          >
            <Button
              type="text"
              icon={<MdMenu size={18} />}
              onClick={() => setCollapsed((c) => !c)}
            />
            <Breadcrumb
              items={[
                { title: <NavLink to="/admin/categories">Admin</NavLink> },
                {
                  title:
                    selectedKey.charAt(0).toUpperCase() +
                    selectedKey.slice(1),
                },
              ]}
            />
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <Input.Search
                placeholder="Поиск по админке…"
                allowClear
                onSearch={(v) => console.log("search:", v)}
                style={{ width: 320 }}
              />
              <Dropdown menu={userMenu} trigger={["click"]}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <Avatar size={32}>H</Avatar>
                </div>
              </Dropdown>
            </div>
          </Header>

          {/* Контент */}
          <Content style={{ padding: 16, background: GREEN.bg }}>
            <div
              style={{
                background: GREEN.cardBg,
                border: `1px solid ${GREEN.border}`,
                borderRadius: 12,
                padding: 16,
                minHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`,
              }}
            >
              <Outlet />
            </div>
          </Content>

          {/* Футер */}
          <Footer
            style={{
              height: FOOTER_HEIGHT,
              lineHeight: `${FOOTER_HEIGHT}px`,
              textAlign: "center",
              background: GREEN.bg,
              color: "#7A857B",
            }}
          >
            © {new Date().getFullYear()} Admin Console
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Admin;
