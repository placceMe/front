// src/layouts/AdminLayout.tsx
import React, { useMemo, useState } from "react";
import { Layout, Menu, Tabs } from "antd";
import type { MenuProps } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  AppstoreOutlined,
  TagsOutlined,
  PartitionOutlined,
  AuditOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

type SectionKey = "administrator" | "moderator";

// ВСЕ текущие пункты — во вкладке Администратор
const ADMINISTRATOR_ITEMS: Required<MenuProps>["items"] = [
  { key: "users", label: "Пользователи", icon: <UserOutlined /> },
  { key: "orders", label: "Заказы", icon: <AppstoreOutlined /> },
  { key: "categories", label: "Категории", icon: <PartitionOutlined /> },
  { key: "characteristics", label: "Характеристики", icon: <TagsOutlined /> },
];

// Вкладка модератора — не функциональная (disabled placeholder)
const MODERATOR_ITEMS: Required<MenuProps>["items"] = [
{ key: "ordersmoder", label: "Товары на модерации", icon: <AuditOutlined /> },
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

  // текущий пункт из URL (/admin/<key>)
  const selectedKey = pathname.split("/")[2] || "categories";

  // активная вкладка определяется по роуту, но менять сам роут при переключении вкладок не будем
  const [section, setSection] = useState<SectionKey>(sectionByRouteKey(selectedKey));

  const items = useMemo(() => ALL_SECTIONS[section], [section]);

  // Подсветку пункта даём только если он есть в текущей вкладке (чтобы не было «не того» хайлайта)
  const keysInSection = (items || []).map(i => i!.key as string);
  const selectedKeys = keysInSection.includes(selectedKey) ? [selectedKey] : [];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={260} collapsible>
        <div style={{ color: "white", padding: 16, fontWeight: "bold" }}>Admin Panel</div>

        {/* Две вкладки всегда показываются. Отключаем троеточие (moreIcon) на всякий. */}
        <Tabs
          activeKey={section}
          onChange={(k) => setSection(k as SectionKey)}
          items={[
            { key: "administrator", label: "Админ" },
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
          Панель администратора — {section === "administrator" ? "Админ" : "Модер"}
        </Header>
        <Content style={{ margin: 16, padding: 24, background: "#fff" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
