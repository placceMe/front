import React, { useState, useEffect } from 'react';
import type { OrderResponse, OrderItemResponse } from '@shared/types/api';
import { useRequest } from '@shared/request/useRequest';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';
import { formatPrice } from '@shared/lib/formatPrice';
import { message } from 'antd';
import { FaChevronLeft, FaChevronRight, FaCheck, FaTimes } from 'react-icons/fa';

const API_ORDERS = __BASE_URL__ + "/api/orders";
const ORDERS_PER_PAGE = 5;

export const OrderStatus = {
  Pending: "Pending",
  Confirmed: "Confirmed",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Cancelled: "Cancelled",
  Rejected: "Rejected"
} as const;

type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

const ORDER_STATUS_MAP: Record<OrderStatusType, { label: string; color: string }> = {
  Pending: { label: "Нове", color: "text-yellow-600" },
  Confirmed: { label: "Підтверджено", color: "text-green-600" },
  Shipped: { label: "Відправлено", color: "text-blue-600" },
  Delivered: { label: "Доставлено", color: "text-gray-600" },
  Cancelled: { label: "Скасовано", color: "text-pink-600" },
  Rejected: { label: "Відхилено", color: "text-red-600" }
};

interface Props {
  sellerId: string;
}

export const SellerOrders: React.FC<Props> = ({ sellerId }) => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { request } = useRequest();
  const { current, rates } = useSelector((state: RootState) => state.currency);

  useEffect(() => {
    if (!sellerId) return;

    request<OrderResponse[]>(`/api/orders/by-seller/${sellerId}`)
      .then((data) => {
        if (data) setOrders(data.reverse());
        else setOrders([]);
      })
      .catch(() => setOrders([]));
  }, [sellerId]);

  const confirmOrder = async (id: string) => {
    console.log("confirm")
    try {
       console.log("confirm try")
      const res = await request(`/api/orders/${id}/confirm`, {
        method: "PUT",
      });
      
      message.success("Замовлення підтверджено");
      setOrders(prev => prev.map(o => (String(o.id) === id ? res : o)));
    } catch {
      message.error("Помилка при підтвердженні замовлення");
    }
  };

  const rejectOrder = async (id: string) => {
    try {
      const res = await request(`api/orders/${id}/reject`, {
        method: "PUT",
      });
     
      message.success("Замовлення відхилено");
      setOrders(prev => prev.map(o => (String(o.id) === id ? res : o)));
    } catch {
      message.error("Помилка при відхиленні замовлення");
    }
  };

  const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const visibleOrders = orders.slice(startIndex, startIndex + ORDERS_PER_PAGE);

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4 text-[#3E4826]">Замовлення покупців</h2>
      {visibleOrders.map(order => (
        <div key={order.id} className="border p-4 rounded bg-white mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p>Замовлення #{String(order.id).replace(/\D/g, '')}</p>
              <p className={ORDER_STATUS_MAP[order.status as OrderStatusType]?.color ?? 'text-gray-400'}>
                {ORDER_STATUS_MAP[order.status as OrderStatusType]?.label ?? `Статус: ${order.status}`}
              </p>
            </div>
            <p>{formatPrice(order.totalAmount, current, rates)}</p>
          </div>

          <div>
            {(order.items || []).map((item: OrderItemResponse, i) => (
              <div key={i} className="flex justify-between">
                <p>{item.productName} × {item.quantity}</p>
              </div>
            ))}
          </div>

          {order.status === OrderStatus.Pending && (
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => confirmOrder(String(order.id))}
                className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <FaCheck size={12} /> Підтвердити
              </button>
              <button
                onClick={() => rejectOrder(String(order.id))}
                className="bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <FaTimes size={12} /> Скасувати
              </button>
            </div>
          )}
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            <FaChevronLeft />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i + 1} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};
