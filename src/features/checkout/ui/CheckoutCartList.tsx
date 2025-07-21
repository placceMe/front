import { List, Typography } from 'antd';
import { useAppSelector } from '../../../app/store/hooks';
import { CartItemCard } from '@features/cart/ui/CartItemCard';
import type { RootState } from '../../../app/store/store';
import type { CartItem } from '@shared/types/cart';

export const CheckoutCartList = () => {
  const items = useAppSelector((state: RootState) => state.cart.items);

  const total = items.reduce((sum: number, i: CartItem) => {
    return sum + i.product.price * i.quantity;
  }, 0);

  return (
    <div className="bg-white shadow p-4 rounded">
      <List
        dataSource={items}
        renderItem={(item: CartItem) => (
          <CartItemCard
            item={item}
            onChangeQuantity={() => {}}
            onRemove={() => {}}
          />
        )}
      />
      <div className="flex justify-between font-semibold mt-4 border-t pt-2">
        <span>Разом</span>
        <span>{total.toLocaleString()} грн.</span>
      </div>
    </div>
  );
};
