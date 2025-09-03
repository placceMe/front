import React, { useEffect, useMemo, useState } from "react";
import { Table, Button, Space, Tag, Input, message } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type Product = {
  id: string;
  title: string;
  description?: string;
  price: number;
  color?: string;
  weight?: number;
  mainImageUrl?: string;
  categoryId: string;
  sellerId?: string;
  quantity: number;
  state?: string;
};

type Category = { id: string; name?: string; title?: string; };

const API_PRODUCTS = __BASE_URL__ + "/api/products";
const API_CATEGORIES = __BASE_URL__ + "/api/category";

/* ---------- Колір тега категорії (детермінований) ---------- */
const hashCode = (str: string) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
  return Math.abs(h);
};
const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))] as const;
};
const textColorForBg = (r: number, g: number, b: number) =>
  (r * 299 + g * 587 + b * 114) / 1000 >= 140 ? "#000" : "#fff";
const colorForCategory = (key: string) => {
  const h = hashCode(key) % 360, s = 65, l = 45;
  const [r, g, b] = hslToRgb(h, s, l);
  return { bg: `hsl(${h} ${s}% ${l}%)`, text: textColorForBg(r, g, b) };
};
/* ------------------------------------------------------------- */

const statusTag = (s?: string) => {
  switch (s) {
    case "Active": return <Tag color="green">Активний</Tag>;
    case "Blocked": return <Tag color="red">Заблокований</Tag>;
    case "Archived": return <Tag color="blue">В архіві</Tag>;
    case "Moderation": return <Tag color="gold">Модерація</Tag>;
    case "Deleted": return <Tag>Видалений</Tag>;
    default: return <Tag>{s || "—"}</Tag>;
  }
};

const ProductsModerationPage: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [query, setQuery] = useState("");

  const getCatLabel = (id?: string) => {
    const c = categories.find(x => x.id === id);
    return c ? (c.title ?? c.name ?? "(без назви)") : id || "—";
  };

  const fetchCategories = async () => {
    setCatLoading(true);
    try {
      const r = await fetch(API_CATEGORIES);
      const list: Category[] = await r.json();
      setCategories(list || []);
    } catch (e) {
      message.error("Не вдалося завантажити категорії");
    } finally {
      setCatLoading(false);
    }
  };

  const fetchModeration = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API_PRODUCTS}/state/Moderation`);
      const items: Product[] = await r.json();
      setData(items || []);
    } catch (e) {
      message.error("Не вдалося завантажити модерацію");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); fetchModeration(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }, [data, query]);

  return (
    <div>
      <Space style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Пошук за назвою/описом"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 320 }}
        />
        <Button icon={<ReloadOutlined />} onClick={fetchModeration} loading={loading || catLoading}>
          Оновити
        </Button>
      </Space>

      <Table<Product>
        rowKey="id"
        dataSource={filtered}
        loading={loading}
        pagination={{ showSizeChanger: true, pageSize: 10 }}
        onRow={(record) => ({
          onDoubleClick: () => {
            navigate(`/admin/productsmoder/${record.id}`);
          },
        })}
        columns={[
          { title: "Назва", dataIndex: "title" },
          { title: "Ціна", dataIndex: "price", render: (v: number) => `${v} ₴` },
          { title: "Кількість", dataIndex: "quantity" },
          {
            title: "Категорія",
            dataIndex: "categoryId",
            render: (id: string) => {
              const lab = getCatLabel(id);
              const { bg, text } = colorForCategory(`${id}|${lab}`);
              return <Tag style={{ backgroundColor: bg, color: text, border: "none" }}>{lab}</Tag>;
            },
          },
          { title: "Статус", dataIndex: "state", render: (s?: string) => statusTag(s) },
          {
            title: "Перегляд",
            render: (_, r) => (
              <Button type="link" onClick={() => navigate(`/admin/productsmoder/${r.id}`)}>
                Переглянути
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
};

export default ProductsModerationPage;
