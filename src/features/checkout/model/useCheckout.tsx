
import { useAppDispatch } from '@store/hooks';
import { setCart } from '@features/cart/model/cartSlice';
import { resetForm } from './checkoutSlice';
import { useNavigate } from 'react-router-dom';
import type { OrderPayload } from '@shared/types/order';

import type { OrderResponse } from '@shared/types/api';
import { API_PORTS, useRequest } from '@shared/request/useRequest';


export async function createOrder(orderPayload: OrderPayload): Promise<OrderResponse> {
  const res = await fetch('http://localhost:5004/api/orders/', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderPayload)
  });
  if (!res.ok) throw new Error("Ошибка при создании заказа");
   const text = await res.text(); // 👈 получи текст ошибки от бэка
    console.error("Order creation failed:", text);
  return await res.json();
}


export function useCheckout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { request, error } = useRequest(API_PORTS.ORDERS);

  const handleCheckoutSubmit = async (order: OrderPayload) => {
    const response = await request<OrderResponse>('/api/orders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    if (response) {

      navigate(`/order-success/${response.id}`);

      setTimeout(() => {
      dispatch(setCart([]));
      dispatch(resetForm());
      localStorage.removeItem('cart');
       }, 300);
    } else {
      alert("Помилка при створенні замовлення: " + error);
    }
  };

  return { handleCheckoutSubmit };
}
