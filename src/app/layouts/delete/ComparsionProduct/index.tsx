import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Tabs, Button, Popconfirm, Badge, message } from "antd";
import type { TabsProps } from "antd";
import { DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "./compare-exact.css";

// --- типы
type Category = { id: string; name: string; status?: string };
type Characteristic = { name: string; value: string };
type Product = {
  id: string;
  title: string;
  price?: number;
  mainImageUrl?: string;
  additionalImageUrls?: string[];
  color?: string | number;
  weight?: number | string;
  quantity?: number;
  description?: string;
  characteristics?: Characteristic[];
  categoryId?: string;
  category?: Category;
  [k: string]: any;
};

// --- константы / helpers
const COMPARE_KEY = "comparison";
const FILES_BASE_URL = `${__BASE_URL__}/api/files/`;

const readComparison = (): Product[] => {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const writeComparison = (list: Product[]) =>
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list));

const imgUrl = (src?: string) =>
  !src ? "/placeholder.png" : src.startsWith("http") ? src : FILES_BASE_URL + src;

const groupByCategory = (products: Product[]) => {
  const groups: Record<string, Product[]> = {};
  products.forEach((p) => {
    const label = p?.category?.name || "Без категорії";
    if (!groups[label]) groups[label] = [];
    groups[label].push(p);
  });
  return groups;
};

// строки таблицы
const buildRows = (products: Product[]) => {
  const base = [
    { key: "price", title: "Ціна", get: (p: Product) => (p.price != null ? `${p.price} ₴` : "—") },
    { key: "sku", title: "Артикул", get: (p: Product) => p.id?.match(/\d/g)?.join("") || "—" },
    { key: "color", title: "Колір", get: (p: Product) => (p.color != null ? String(p.color) : "—") },
    { key: "weight", title: "Вага", get: (p: Product) => (p.weight != null ? String(p.weight) : "—") },
    { key: "quantity", title: "Кількість", get: (p: Product) => (p.quantity != null ? String(p.quantity) : "—") },
    { key: "description", title: "Опис", get: (p: Product) => (p.description || "—") },
  ];

  const names = new Set<string>();
  products.forEach((p) =>
    p.characteristics?.forEach((c) => c?.name && names.add(c.name))
  );
  const chars = Array.from(names).map((name) => ({
    key: `char:${name}`,
    title: name,
    get: (p: Product) =>
      p.characteristics?.find((c) => c.name === name)?.value || "—",
  }));

  return [...base, ...chars];
};

const ComparePageExactTabs: React.FC = () => {
  const [items, setItems] = useState<Product[]>(() => readComparison());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === COMPARE_KEY) setItems(readComparison());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const groups = useMemo(() => groupByCategory(items), [items]);
  const labels = Object.keys(groups);

  const removeOne = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.id !== id);
      writeComparison(next);
      message.success("Товар видалено з порівняння");
      return next;
    });
  }, []);

  if (items.length === 0) {
    return (
      <div className="cmp-page">
        <div className="cmp-header">
          <h1 className="cmp-title">Порівняння товарів</h1>
        </div>
        <div className="cmp-empty">
          <div className="cmp-empty__icon">⚖️</div>
          <h2>Ви не обрали жодного товару для порівняння</h2>
          <p>Додайте декілька товарів, що допоможе Вам зробити точний і зважений вибір.</p>
          <Button className="btn-continue">Продовжити</Button>
        </div>
      </div>
    );
  }

  const tabs: TabsProps["items"] = labels.map((label) => {
    const prods = groups[label];
    const rows = buildRows(prods);

    // фиксированные px-ширины для предсказуемого горизонтального скролла
    const LEFT_COL = 240;      // px
    const PROD_COL = 280;      // px

    return {
      key: label,
      label: (
        <Badge count={prods.length} offset={[8, -2]}>
          <span>{label}</span>
        </Badge>
      ),
      children: (
        <div className="cmp-card">
          {/* контейнер для горизонтального скролла */}
          <div className="cmp-scroll" role="region" aria-label={`Порівняння: ${label}`}>
            <div
              className="cmp-grid"
              style={{
                gridTemplateColumns: `${LEFT_COL}px repeat(${prods.length}, ${PROD_COL}px)`,
              }}
            >
              {/* Назва товару */}
              <div className="cmp-head">Назва товару</div>
              {prods.map((p) => (
                <div key={p.id} className="cmp-cell cmp-cell--name">
                  <a className="cmp-link" href={`/product/${p.id}`}>
                    {p.title}
                  </a>
                </div>
              ))}

              {/* Зображення товару */}
              <div className="cmp-head">Зображення товару</div>
              {prods.map((p) => (
                <div key={p.id + ":img"} className="cmp-cell">
                  <div className="cmp-image">
                    <img src={imgUrl(p.mainImageUrl)} alt={p.title} />
                  </div>
                </div>
              ))}

              {/* Данные по строкам */}
              {rows.map((row) => (
                <React.Fragment key={row.key}>
                  <div className="cmp-rowtitle">{row.title}</div>
                  {prods.map((p) => (
                    <div key={p.id + row.key} className="cmp-cell">
                      {row.get(p)}
                    </div>
                  ))}
                </React.Fragment>
              ))}

              {/* Дії */}
              <div className="cmp-rowtitle">Дії</div>
              {prods.map((p) => (
                <div key={p.id + ":actions"} className="cmp-cell">
                  <div className="cmp-actions">
                    <Button className="btn-buy" icon={<ShoppingCartOutlined />}>
                      Купити
                    </Button>
                    <Popconfirm
                      title="Видалити товар з порівняння?"
                      onConfirm={() => removeOne(p.id)}
                      okText="Так"
                      cancelText="Ні"
                    >
                      <Button danger className="btn-delete" icon={<DeleteOutlined />}>
                        Видалити
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="cmp-page">
      <div className="cmp-header">
        <h1 className="cmp-title">Порівняння товарів</h1>
      </div>
      <Tabs items={tabs} />
    </div>
  );
};

export default ComparePageExactTabs;
