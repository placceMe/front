
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { updateQuantity, removeItem } from '@features/cart/model/cartSlice';
import { CartItemCard } from '@features/cart/ui/CartItemCard';
import { Button, List } from 'antd';
import { useNavigate } from 'react-router-dom';
import { goToCheckout } from "../../features/lib/navigation";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.cart.items);
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeItem(productId));
  };


  const totalWeight = items.reduce(
  (acc, item) => acc + ((item.product.weight || 0) * item.quantity),
  0
);

const totalWeightKg = (totalWeight / 1000).toFixed(2); 


  const totalPrice = items.reduce(
    (acc, item) => acc + (item.product.price * item.quantity),
    0
  );

  const handleCheckout = () => {
    goToCheckout(navigate);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Кошик</h1>

      <List
        dataSource={items}
        locale={{ emptyText: 'Корзина пуста' }}
        renderItem={item => (
          <CartItemCard
            key={item.product.id}
            item={item}
            onChangeQuantity={handleQuantityChange}
            onRemove={handleRemove}
          />
        )}
      />

      {items.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded shadow">
          <div className="flex justify-between font-semibold text-lg">
            <span>Загальна вага:</span>
            <span>{totalWeightKg} кг</span>
          </div>
          <div className="flex justify-between font-bold text-xl mt-2">
            <span>Разом:</span>
            <span>{totalPrice} грн</span>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              type="primary"
              size="large"
              onClick={handleCheckout}
              className="bg-yellow-400 hover:bg-yellow-500 px-6 w-full sm:w-auto"
            >
              Оформити замовлення
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
