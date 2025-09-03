// CartIcon.tsx
import { useAppSelector } from "@store/hooks";
import { FaShoppingCart } from "react-icons/fa";

export const CartIcon = () => {
  const cart = useAppSelector((state) => state.cart.items);
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="relative">
      <FaShoppingCart />
      {totalCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
          {totalCount}
        </span>
      )}
    </div>
  );
};
