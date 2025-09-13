import { useAppDispatch } from '@store/hooks';
import { setCart } from '@features/cart/model/cartSlice';
import { resetForm } from './checkoutSlice';
import { useNavigate } from 'react-router-dom';
import type { OrderPayload } from '@shared/types/order';
import type { OrderResponse } from '@shared/types/api';
import { useRequest } from '@shared/request/useRequest';

export function useCheckout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { request, error } = useRequest();

  const handleCheckoutSubmit = async (order: OrderPayload) => {
    const response = await request<OrderResponse>('/api/orders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    if (response) {
      alert("Замовлення успішно створено! На вашу пошту прийде підтвердження замовлення")
      navigate(`/profile#u-orders`);
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
