import { useAppSelector } from "@store/hooks";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";


export const CartIcon = () => {
  const navigate = useNavigate();
  const cart = useAppSelector((state) => state.cart.items);
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button
      onClick={() => navigate("/cart")}
      className="relative hover:text-[#5a6b3b] focus:outline-none"
      title="Кошик"
    >
      <FaShoppingCart />
      {totalCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
          {totalCount}
        </span>
      )}
    </button>
  );
};
