import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import { updateQuantity, removeItem } from "@features/cart/model/cartSlice";
import { CartItemCard } from "@features/cart/ui/CartItemCard";
import { Button, List } from "antd";
import { useNavigate } from "react-router-dom";
import { goToCheckout } from "../../features/lib/navigation";
import emptyCartImg from "../../assets/pages/cart.png";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@shared/lib/formatPrice";
import type { RootState } from "@store/store";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const navigate = useNavigate();

  // Локальный баннер-предупреждение (Tailwind)
  const [warning, setWarning] = useState<string | null>(null);
  const warnTimerRef = useRef<number | null>(null);

  const showWarning = (msg: string) => {
    // консоль — всегда
    console.warn("[WARN] " + msg);
    // сброс предыдущего таймера
    if (warnTimerRef.current) {
      window.clearTimeout(warnTimerRef.current);
      warnTimerRef.current = null;
    }
    setWarning(msg);
    warnTimerRef.current = window.setTimeout(() => {
      setWarning(null);
      warnTimerRef.current = null;
    }, 3000);
  };

  // ⚠️ Ограничиваем количество по остаткам
  const handleQuantityChange = (productId: string, nextQty: number) => {
    const item = items.find((i) => i.product.id === productId);
    if (!item) return;

    const title = item.product.title;
    const stock =
      typeof item.product.quantity === "number" ? item.product.quantity : Infinity;
    const isFiniteStock = Number.isFinite(stock);
    const currentInCart = item.quantity;
    const clamped = Math.max(1, Math.min(nextQty, stock as number));

    // Подробные логи
    console.groupCollapsed(`🧮 [Cart] Quantity change — ${title}`);
    console.table({
      title,
      requested: nextQty,
      currentInCart,
      stock: isFiniteStock ? stock : "∞",
      applied: clamped,
    });
    console.groupEnd();

    if (clamped !== nextQty) {
      const warnMsg = isFiniteStock
        ? `Товар «${title}» скінчився.`
        : `Кількість для «${title}» не може бути меншою за 1.`;
      showWarning(warnMsg);
    }

    dispatch(updateQuantity({ productId, quantity: clamped }));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeItem(productId));
  };

  // Общий вес и цена
  const totalWeight = items.reduce(
    (acc, item) => acc + (item.product.weight || 0) * item.quantity,
    0
  );
  const totalWeightKg = (totalWeight / 1000).toFixed(2);

  const totalPrice = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const { current, rates } = useAppSelector((state: RootState) => state.currency);
  const formattedTotalPrice = formatPrice(totalPrice, current, rates);

  const handleCheckout = () => {
    goToCheckout(navigate);
  };

  // 💾 Сохраняем корзину компактно
  useEffect(() => {
    const compactCart = items.map((item) => ({
      id: item.product.id,
      quantity: item.quantity,
    }));
    localStorage.setItem("cart", JSON.stringify(compactCart));
  }, [items]);

  // 🛡️ Нормализация при монтировании: если уже > остатка — подрежем и предупреждём
  const normalizedOnceRef = useRef(false);
  useEffect(() => {
    if (normalizedOnceRef.current) return;

    const adjusted: Array<{
      id: string;
      title: string;
      stock: number | "∞";
      prevQty: number;
      newQty: number;
    }> = [];

    items.forEach((it) => {
      const stock =
        typeof it.product.quantity === "number" ? it.product.quantity : Infinity;
      const isFiniteStock = Number.isFinite(stock);
      const newQty = Math.max(1, Math.min(it.quantity, stock as number));
      if (newQty !== it.quantity) {
        dispatch(updateQuantity({ productId: it.product.id, quantity: newQty }));
        adjusted.push({
          id: it.product.id,
          title: it.product.title,
          stock: isFiniteStock ? (stock as number) : "∞",
          prevQty: it.quantity,
          newQty,
        });
      }
    });

    if (adjusted.length) {
      showWarning("Кількість деяких товарів була обмежена згідно з наявними залишками.");
      console.groupCollapsed("⚠️ [Cart] Normalized items over stock");
      console.table(adjusted);
      console.groupEnd();
    }

    normalizedOnceRef.current = true;
  }, [items, dispatch]);

  return (
    <div className="container mx-auto py-8">
      {/* Встроенный предупреждающий баннер (Tailwind) */}
      {warning && (
        <div className="fixed z-50 top-20 right-4">
          <div className="flex items-start gap-3 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 text-yellow-800 shadow-lg px-4 py-3 w-80 transition-opacity duration-300">
            <svg
              className="w-5 h-5 mt-0.5 text-yellow-600 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.59c.75 1.335-.213 2.986-1.742 2.986H3.48c-1.53 0-2.492-1.651-1.742-2.986L8.257 3.1zM11 14a1 1 0 10-2 0 1 1 0 002 0zm-.293-6.707a1 1 0 00-1.414 0L8 8.586V11a1 1 0 102 0V9.414l.293-.293a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm font-medium leading-5">{warning}</div>
            <button
              className="ml-auto text-yellow-700 hover:text-yellow-900 transition-colors"
              onClick={() => setWarning(null)}
              aria-label="Закрити"
            >
              ×
            </button>
          </div>
        </div>
      )}

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
            Ваш тактичний кошик зараз порожній. Поповніть арсенал — броня,
            шолом, амуніція чекають на Вас!
          </p>

          <Button
            type="primary"
            size="large"
            className="bg-[#3E4826] hover:bg-[#2f361f] border-0 h-11 px-6 font-semibold"
            onClick={() => navigate("/")}
          >
            Перейти на головну
          </Button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto py-8">
          <h1 className="text-2xl font-bold mb-6">Кошик</h1>

          <List
            dataSource={items}
            renderItem={(item) => (
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
              <span>{formattedTotalPrice}</span>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                type="primary"
                size="large"
                onClick={handleCheckout}
                className="bg-yellow-400 hover:bg-yellow-500 border-0 px-6 h-11 w-full sm:w-auto font-semibold"
              >
                Оформити замовлення
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
