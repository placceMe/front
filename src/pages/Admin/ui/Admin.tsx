// src/layouts/AdminLayout.tsx
import React, { useMemo, useState } from "react";
import { Layout, Menu, Tabs } from "antd";
import type { MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  AuditOutlined,
  MessageOutlined
} from "@ant-design/icons"

const { Header, Sider, Content } = Layout;

type SectionKey = "administrator" | "moderator";

// УСІ поточні пункти — у вкладці Адміністратор
const ADMINISTRATOR_ITEMS: Required<MenuProps>["items"] = [
  { key: "users", label: "Користувачі", icon: <UserOutlined /> },             // 👤 логічно
  { key: "products", label: "Товари", icon: <ShoppingOutlined /> },           // 🛍️ товари
  { key: "categories", label: "Категорії", icon: <AppstoreOutlined /> },      // 🗂️ категорії
  { key: "characteristics", label: "Характеристики", icon: <TagsOutlined /> },// 🏷️ характеристики
  { key: "orders", label: "Замовлення", icon: <ShoppingCartOutlined /> },     // 🛒 замовлення
];

// Вкладка модератора — не функціональна (disabled placeholder)
const MODERATOR_ITEMS: Required<MenuProps>["items"] = [
  { key: "productsmoder",  label: "Товари на модерації",   icon: <AuditOutlined /> },
  { key: "feedbacksmoder", label: "Відгуки на модерації",  icon: <MessageOutlined /> },
];

const ALL_SECTIONS: Record<SectionKey, Required<MenuProps>["items"]> = {
  administrator: ADMINISTRATOR_ITEMS,
  moderator: MODERATOR_ITEMS,
};

const sectionByRouteKey = (routeKey: string): SectionKey => {
  if (ADMINISTRATOR_ITEMS.some(i => i?.key === routeKey)) return "administrator";
  if (MODERATOR_ITEMS.some(i => i?.key === routeKey)) return "moderator";
  return "administrator";
};

const AdminLayout: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // поточний пункт з URL (/admin/<key>)
  const selectedKey = pathname.split("/")[2] || "categories";

  // активна вкладка визначається за роутом, але міняти сам роут при перемиканні вкладок не будемо
  const [section, setSection] = useState<SectionKey>(sectionByRouteKey(selectedKey));

  const items = useMemo(() => ALL_SECTIONS[section], [section]);

  // Підсвітку пункту даємо лише якщо він є в поточній вкладці (щоб не було «не того» хайлайта)
  const keysInSection = (items || []).map(i => i!.key as string);
  const selectedKeys = keysInSection.includes(selectedKey) ? [selectedKey] : [];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={260} collapsible>
        <div style={{ color: "white", padding: 16, fontWeight: "bold" }}>Адмін Панель</div>

        {/* Дві вкладки завжди показуються. Вимикаємо трикрапку (moreIcon) на всяк випадок. */}
        <Tabs
          activeKey={section}
          onChange={(k) => setSection(k as SectionKey)}
          items={[
            { key: "administrator", label: "Адмін" },
            { key: "moderator", label: "Модер" },
          ]}
          moreIcon={null}
        />

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={(info) => navigate(`/admin/${info.key}`)}
          items={items}
          style={{ borderRight: 0 }}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", paddingLeft: 16 }}>
          Панель адміністратора — {section === "administrator" ? "Адмін" : "Модер"}
        </Header>
        <Content style={{ margin: 16, padding: 24, background: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
