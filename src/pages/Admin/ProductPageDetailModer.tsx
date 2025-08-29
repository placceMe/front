// src/pages/admin/OrdersModerationDetailsPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Typography, Descriptions, Image, Button, Tag, message, Divider, Card } from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleTwoTone,
  StopTwoTone,
  InboxOutlined,
  DeleteOutlined,
  ReloadOutlined
} from "@ant-design/icons";

type ProductDetails = {
  id: string;
  title: string;
  description?: string;
  price: number;
  color?: string;
  weight?: number;
  mainImageUrl?: string;
  additionalImageUrls?: string[];
  categoryId: string;
  category?: { id: string; name?: string; title?: string } | null;
  sellerId?: string;
  quantity: number;
  state?: string;
  characteristics?: Array<{
    characteristicDictId: string;
    value: string;
    characteristicDict?: { name?: string; code?: string; type?: string };
  }>;
};

const API_PRODUCTS = "http://localhost:8080/api/products";

// Теги статусу
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

const OrdersModerationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<ProductDetails | null>(null);

  const fetchItem = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const r = await fetch(`${API_PRODUCTS}/${id}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data: ProductDetails = await r.json();
      setItem(data);
    } catch (e) {
      message.error("Не вдалося завантажити товар");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItem(); }, [id]);

  const changeState = async (state: string) => {
    if (!id) return;
    try {
      const r = await fetch(`${API_PRODUCTS}/${id}/state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });
      if (r.ok) {
        message.success(`Статус змінено: ${state}`);
        fetchItem();
      } else {
        message.error("Не вдалося змінити статус");
      }
    } catch {
      message.error("Помилка сервера");
    }
  };

  const deleteProduct = async () => {
    if (!id) return;
    try {
      const r = await fetch(`${API_PRODUCTS}/${id}`, { method: "DELETE" });
      if (r.ok) {
        message.success("Товар видалено");
        navigate("/admin/ordersmoder");
      } else {
        message.error("Не вдалося видалити");
      }
    } catch {
      message.error("Помилка сервера");
    }
  };

  const images = useMemo(() => {
    const list: string[] = [];
    if (item?.mainImageUrl) list.push(item.mainImageUrl);
    if (Array.isArray(item?.additionalImageUrls)) {
      for (const u of item!.additionalImageUrls!) if (u) list.push(u);
    }
    return list;
  }, [item]);

  return (
    <div>
      {/* Верхня панель навігації */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/productsmoder")}>
          Назад до списку
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchItem} loading={loading}>
          Оновити
        </Button>
      </div>

      {/* Ряд 1: Заголовок + статус */}
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {item?.title || "Товар"}
        </Typography.Title>
        {statusTag(item?.state)}
      </div>

      {/* Ряд 2: Кнопки дій */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button
          type="primary"
          icon={<CheckCircleTwoTone twoToneColor="#ffffff" />}
          onClick={() => changeState("Active")}
        >
          Схвалити
        </Button>
        <Button
          danger
          icon={<StopTwoTone twoToneColor="#ff4d4f" />}
          onClick={() => changeState("Blocked")}
        >
          Заблокувати
        </Button>
        <Button icon={<InboxOutlined />} onClick={() => changeState("Archived")}>
          Архівувати
        </Button>
        <Button danger icon={<DeleteOutlined />} onClick={deleteProduct}>
          Видалити
        </Button>
      </div>

      <Divider />

      {/* Фото */}
      <Card title="Фотографії" style={{ marginBottom: 16 }}>
        {images.length ? (
          <Image.PreviewGroup>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {images.map((src, i) => (
                <Image key={i} width={160} src={src} alt={`img-${i}`} />
              ))}
            </div>
          </Image.PreviewGroup>
        ) : (
          <Typography.Text type="secondary">Немає зображень</Typography.Text>
        )}
      </Card>

      {/* Основні поля */}
      <Card title="Інформація" style={{ marginBottom: 16 }} loading={loading}>
        <Descriptions column={2} bordered size="middle">
          <Descriptions.Item label="ID">{item?.id}</Descriptions.Item>
          <Descriptions.Item label="Статус">{statusTag(item?.state)}</Descriptions.Item>
          <Descriptions.Item label="Ціна">{item?.price} ₴</Descriptions.Item>
          <Descriptions.Item label="Кількість">{item?.quantity}</Descriptions.Item>
          <Descriptions.Item label="Колір">{item?.color || "—"}</Descriptions.Item>
          <Descriptions.Item label="Вага">{item?.weight ?? "—"}</Descriptions.Item>
          <Descriptions.Item label="Категорія">
            {item?.category?.title ?? item?.category?.name ?? item?.categoryId ?? "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Продавець (SellerId)">{item?.sellerId || "—"}</Descriptions.Item>
          <Descriptions.Item label="Головне зображення URL" span={2}>
            {item?.mainImageUrl || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Дод. зображення" span={2}>
            {item?.additionalImageUrls?.length ? item!.additionalImageUrls!.join(", ") : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Опис" span={2}>
            {item?.description || "—"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Характеристики */}
      <Card title="Характеристики" style={{ marginBottom: 16 }}>
        {item?.characteristics && item.characteristics.length > 0 ? (
          <Descriptions column={1} bordered size="small">
            {item.characteristics.map((c, idx) => {
              const label =
                c.characteristicDict?.name ??
                c.characteristicDict?.code ??
                c.characteristicDictId ??
                `#${idx + 1}`;
              return (
                <Descriptions.Item key={idx} label={label}>
                  {String(c.value ?? "—")}
                </Descriptions.Item>
              );
            })}
          </Descriptions>
        ) : (
          <Typography.Text type="secondary">Немає характеристик</Typography.Text>
        )}
      </Card>
    </div>
  );
};

export default OrdersModerationDetailsPage;
