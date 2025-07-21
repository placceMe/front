import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography, Table, Descriptions, Spin } from "antd";
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  // остальные поля, если сервер возвращает
}

interface OrderDetails {
  id: string;
  created_at: string;
  items: OrderItem[];
  delivery_address: string;
  total_amount: number;
}

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5004/api/orders/${orderId}`)
      .then(res => res.json())
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [orderId]);

  if (!order) return <Spin size="large" className="mt-10" />;

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      <Typography.Title className='py-12' level={2}>
        Дякуємо! Ваше замовлення було отримано!
      </Typography.Title>
      <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
        <Descriptions.Item label="Номер замовлення">{order.id}</Descriptions.Item>
        <Descriptions.Item label="Дата">{new Date(order.created_at).toLocaleDateString('uk-UA')}</Descriptions.Item>
      </Descriptions>
      <Typography.Title className='py-8' level={4}>
        Оплата у відділенні Нової пошти після отримання доставки.
      </Typography.Title>
      <Table
        dataSource={order.items}
        pagination={false}
        rowKey="id"
        columns={[
          { title: "ID Товару", dataIndex: "product_id", key: "product_id" },
          { title: "Кількість", dataIndex: "quantity", key: "quantity" },
          // остальные колонки если нужно
        ]}
        style={{ marginBottom: 24 }}
      />
      <div style={{ textAlign: 'center', padding: 25 }}>
        <button
          onClick={() => navigate('/profile')}
          className="
            bg-[#454E30]
            hover:bg-[#5a6b3b]
            text-white
            font-semibold
            rounded-xl
            px-8
            py-3
            text-lg
            shadow
            transition
            border-none
            w-full sm:w-auto
          "
        >
          В кабінет
        </button>
      </div>
    </div>
  );
};
