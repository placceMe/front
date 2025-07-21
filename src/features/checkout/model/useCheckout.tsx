// features/checkout/model/useCheckout.ts

/*import { useAppDispatch } from '@store/hooks';
import { setCart } from '@features/cart/model/cartSlice';
import { resetForm } from './checkoutSlice';
import { useNavigate } from 'react-router-dom';
import type { OrderPayload } from '@shared/types/order';



export function useCheckout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
const handleCheckoutSubmit = async (order: OrderPayload) => {
  const orderId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.floor(Math.random() * 1e10).toString();

     const itemsWithFileUrl = order.items.map((item: any) => ({
      ...item,
      fileUrl: item.mainImageUrl
        ? `http://localhost:5001/api/files/${item.mainImageUrl}`
        : '/no-photo.jpg',
    }));

 
  const orderWithId = {
    ...order,
    id: orderId,
    createdAt: new Date().toISOString(),
     items: itemsWithFileUrl,
    total: order.items.reduce(
      (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
      0
    ),
  };

  const all = JSON.parse(localStorage.getItem("orders") || "[]");
  all.push(orderWithId);
  localStorage.setItem("orders", JSON.stringify(all));

  dispatch(setCart([]));
  dispatch(resetForm());
  localStorage.removeItem('cart');
  navigate(`/order-success/${orderId}`);
};


  return { handleCheckoutSubmit };
}

*/
// features/checkout/model/useCheckout.ts
import { useAppDispatch } from '@store/hooks';
import { setCart } from '@features/cart/model/cartSlice';
import { resetForm } from './checkoutSlice';
import { useNavigate } from 'react-router-dom';
import type { OrderPayload } from '@shared/types/order';

import type { OrderResponse } from '@shared/types/api';


export async function createOrder(orderPayload: OrderPayload): Promise<OrderResponse> {
  const res = await fetch('http://localhost:5004/api/orders/', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderPayload)
  });
  if (!res.ok) throw new Error("Ошибка при создании заказа");
  return await res.json();
}


export function useCheckout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCheckoutSubmit = async (order: OrderPayload) => {
    try {
      const newOrder: OrderResponse = await createOrder(order);
      dispatch(setCart([]));
      dispatch(resetForm());
      localStorage.removeItem('cart');
      navigate(`/order-success/${newOrder.id}`);
    } catch (e) {
      alert("Ошибка при создании заказа");
    }
  };

  return { handleCheckoutSubmit };
}
