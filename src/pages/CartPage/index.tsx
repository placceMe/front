import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { updateQuantity, removeItem } from '@features/cart/model/cartSlice';
import { CartItemCard } from '@features/cart/ui/CartItemCard';
import { Button, List } from 'antd';
import { useNavigate } from 'react-router-dom';
import { goToCheckout } from "../../features/lib/navigation";
import  emptyCartImg  from '../../assets/pages/cart.png'
import { useEffect } from 'react';

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


useEffect(() => {
  const compactCart = items.map(item => ({
    id: item.product.id,
    quantity: item.quantity
  }));
  localStorage.setItem("cart", JSON.stringify(compactCart));
}, [items]);


  return (
    <div className=" mx-auto py-8">
      {items.length === 0 ? (
        <div className="text-center py-10 px-4 text-[#1f2614]">
          <img
            src={emptyCartImg}
            alt="Порожній кошик"
            className="mx-auto mb-6 max-w-[180px]"
          />
         <h2 className="text-[36px] font-semibold font-montserrat mb-[15px]">
  У бій без спорядження — не варіант!
</h2>
<p className="text-base font-semibold font-montserrat mb-[15px]">
  Ваш тактичний кошик зараз порожній. Поповніть арсенал — броня, шолом, амуніція чекають на Вас!
</p>

          <Button
            type="primary"
            size="large"
            className="bg-[#3E4826] hover:bg-[#2f361f]"
            onClick={() => navigate("/")}
          >
            Перейти на головну
          </Button>
        </div>
      ) : (
        <>
         <div className="max-w-3xl mx-auto py-8">
          <h1 className="text-2xl font-bold mb-6">Кошик</h1>
          <List
            dataSource={items}
            renderItem={item => (
              <CartItemCard
                key={item.product.id}
                item={item}
                onChangeQuantity={handleQuantityChange}
                onRemove={handleRemove}
              />
            )}
          />

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
           </div>
        </>
      )}
    </div>
    
  );
};

export default CartPage;
