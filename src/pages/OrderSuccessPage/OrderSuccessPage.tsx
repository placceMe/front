import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography, Table, Descriptions, Spin } from "antd";
import { useRequest } from "@shared/request/useRequest";

interface ProductInfo {
  id: string;
  name?: string;
  title: string;
  price: number;
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price?: number;
  product?: ProductInfo;
}

interface OrderDetails {
  id: string;
  createdAt: string;
  items: OrderItem[];
  deliveryAddress: string;
  totalAmount?: number;
  notes?: string;
}



export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const navigate = useNavigate();
 const { request } = useRequest();

useEffect(() => {
  if (!orderId) return;
  request<OrderDetails>(`/api/orders/${orderId}`)
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
        <Descriptions.Item label="Номер замовлення">   {order.id.replace(/\D/g, "")}</Descriptions.Item>
        <Descriptions.Item label="Дата">
          {new Date(order.createdAt).toLocaleDateString('uk-UA')}
        </Descriptions.Item>
        <Descriptions.Item label="Адреса доставки" span={2}>
          {order.deliveryAddress}
        </Descriptions.Item>
        {order.notes && (
          <Descriptions.Item label="Коментар" span={2}>
            {order.notes}
          </Descriptions.Item>
        )}
      </Descriptions>
   
      <Table
        dataSource={order.items}
        pagination={false}
        rowKey="id"
        columns={[
         
          {
            title: "Назва",
            dataIndex: "product",
            key: "product",
            render: (product?: ProductInfo) => product?.title ?? "-"
          },
          {
            title: "Кількість",
            dataIndex: "quantity",
            key: "quantity"
          },
          {
            title: "Ціна за одиницю",
            dataIndex: "product",
            key: "price",
            render: (product?: ProductInfo) => product?.price ? `${product.price} грн` : "-"
          },
          {
            title: "Сума",
            key: "total",
            render: (_: any, item: OrderItem) => {
              const price = item.product?.price ?? item.price ?? 0;
              return `${price * item.quantity} грн`;
            }
          }
        ]}
        style={{ marginBottom: 24 }}
      />
      <div className="flex justify-end text-xl font-semibold mb-4">
        {order.totalAmount && <>Разом: {order.totalAmount} грн.</>}
      </div>
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
