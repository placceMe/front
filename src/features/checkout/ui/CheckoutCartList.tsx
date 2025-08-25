import { List } from 'antd';
import { useAppSelector } from '../../../app/store/hooks';
import { CartItemCard } from '@features/cart/ui/CartItemCard';
import type { RootState } from '../../../app/store/store';
import type { CartItem } from '@shared/types/cart';
import { useSelector } from 'react-redux';
import { formatPrice } from '@shared/lib/formatPrice';

export const CheckoutCartList = () => {
const items = useAppSelector((state: RootState) => state.cart.items);
const { current, rates } = useSelector((state: RootState) => state.currency);


const totalUAH = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);


const formattedTotal = formatPrice(totalUAH, current, rates);
  return (
    <div className="bg-white shadow p-4 rounded">
      <List
        dataSource={items}
        renderItem={(item: CartItem) => (
          <CartItemCard
            item={item}
            onChangeQuantity={() => { }}
            onRemove={() => { }}
          />
        )}
      />
      <div className="flex justify-between font-semibold mt-4 border-t pt-2">
        <span>Разом</span>
        <span>{formattedTotal.toLocaleString()} </span>
      </div>
    </div>
  );
};
