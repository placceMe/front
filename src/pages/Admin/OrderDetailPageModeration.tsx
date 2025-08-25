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

const statusTag = (s?: string) => {
  switch (s) {
    case "Active": return <Tag color="green">Active</Tag>;
    case "Blocked": return <Tag color="red">Blocked</Tag>;
    case "Archived": return <Tag color="blue">Archived</Tag>;
    case "Moderation": return <Tag color="gold">Moderation</Tag>;
    case "Deleted": return <Tag>Deleted</Tag>;
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
    console.log("📥 [fetchProduct] GET /api/products/{id}", id);
    try {
      const r = await fetch(`${API_PRODUCTS}/${id}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data: ProductDetails = await r.json();
      console.log("✅ [fetchProduct] success", data);
      setItem(data);
    } catch (e) {
      console.error("❌ [fetchProduct] error", e);
      message.error("Не удалось загрузить товар");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItem(); }, [id]);

  const changeState = async (state: string) => {
    if (!id) return;
    console.log("📝 [changeState] ->", { id, state });
    try {
      const r = await fetch(`${API_PRODUCTS}/${id}/state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state }),
      });
      if (r.ok) {
        message.success(`Статус изменён: ${state}`);
        console.log("✅ [changeState] success", { id, state });
        fetchItem();
      } else {
        console.warn("⚠️ [changeState] status", r.status);
        message.error("Не удалось изменить статус");
      }
    } catch (e) {
      console.error("❌ [changeState] error", e);
      message.error("Ошибка сервера");
    }
  };

  const deleteProduct = async () => {
    if (!id) return;
    console.log("🗑 [deleteProduct] try", id);
    try {
      const r = await fetch(`${API_PRODUCTS}/${id}`, { method: "DELETE" });
      if (r.ok) {
        message.success("Товар удалён");
        console.log("✅ [deleteProduct] success", id);
        navigate("/admin/ordersmoder");
      } else {
        console.warn("⚠️ [deleteProduct] status", r.status);
        message.error("Не удалось удалить");
      }
    } catch (e) {
      console.error("❌ [deleteProduct] error", e);
      message.error("Ошибка сервера");
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
      {/* Верхняя панель навигации */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/ordersmoder")}>
          Назад к списку
        </Button>
        <Button icon={<ReloadOutlined />} onClick={fetchItem} loading={loading}>
          Обновить
        </Button>
      </div>

      {/* Ряд 1: Заголовок + статус */}
      <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          {item?.title || "Товар"}
        </Typography.Title>
        {statusTag(item?.state)}
      </div>

      {/* Ряд 2: Кнопки действий */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Button
          type="primary"
          icon={<CheckCircleTwoTone twoToneColor="#ffffff" />}
          onClick={() => changeState("Active")}
        >
          Одобрить
        </Button>
        <Button
          danger
          icon={<StopTwoTone twoToneColor="#ff4d4f" />}
          onClick={() => changeState("Blocked")}
        >
          Блок
        </Button>
        <Button icon={<InboxOutlined />} onClick={() => changeState("Archived")}>
          Архив
        </Button>
        <Button danger icon={<DeleteOutlined />} onClick={deleteProduct}>
          Удалить
        </Button>
      </div>

      <Divider />

      {/* Фото */}
      <Card title="Фотографии" style={{ marginBottom: 16 }}>
        {images.length ? (
          <Image.PreviewGroup>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {images.map((src, i) => (
                <Image key={i} width={160} src={src} alt={`img-${i}`} />
              ))}
            </div>
          </Image.PreviewGroup>
        ) : (
          <Typography.Text type="secondary">Нет изображений</Typography.Text>
        )}
      </Card>

      {/* Основные поля */}
      <Card title="Информация" style={{ marginBottom: 16 }} loading={loading}>
        <Descriptions column={2} bordered size="middle">
          <Descriptions.Item label="ID">{item?.id}</Descriptions.Item>
          <Descriptions.Item label="Статус">{statusTag(item?.state)}</Descriptions.Item>
          <Descriptions.Item label="Цена">{item?.price} ₴</Descriptions.Item>
          <Descriptions.Item label="Кол-во">{item?.quantity}</Descriptions.Item>
          <Descriptions.Item label="Цвет">{item?.color || "—"}</Descriptions.Item>
          <Descriptions.Item label="Вес">{item?.weight ?? "—"}</Descriptions.Item>
          <Descriptions.Item label="Категория">
            {item?.category?.title ?? item?.category?.name ?? item?.categoryId ?? "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Продавец (SellerId)">{item?.sellerId || "—"}</Descriptions.Item>
          <Descriptions.Item label="Главное изображение URL" span={2}>
            {item?.mainImageUrl || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Доп. изображения" span={2}>
            {item?.additionalImageUrls?.length ? item!.additionalImageUrls!.join(", ") : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Описание" span={2}>
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
          <Typography.Text type="secondary">Нет характеристик</Typography.Text>
        )}
      </Card>
    </div>
  );
};

export default OrdersModerationDetailsPage;
