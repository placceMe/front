import { useUserProductIds } from "@shared/hooks/useUserProductIds";
import { useProductsByIds } from "@shared/hooks/useProductsByIds";
import ProductCard from "../app/layouts/delete/ProductCard/ProductCard";
import { useAppSelector } from "@store/hooks";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import wishlistEmptyImg from '../assets/pages/favourite.png';



export const Wishlist = () => {
  const userId = useAppSelector(state => state.user.user?.id) || "guest";
  const [wishlist] = useUserProductIds(userId, "userWishlist");
  const { products } = useProductsByIds(wishlist);
  const navigate = useNavigate();

  if (!wishlist.length) {
    return (

      <div className="text-center text-[#1f2614] px-4 mt-[50px]">
        <img
          src={wishlistEmptyImg}
          alt="Обране порожнє"
          className="mx-auto mb-6 max-w-[200px]"
        />
        <h2 className="text-[36px] font-semibold font-montserrat mb-[15px]">
          Обране
        </h2>
        <p className="text-[15px] font-semibold font-montserrat mb-[20px]  mx-auto">
          Зберігайте спорядження, яке Вас зацікавило і повертайтесь до нього, коли будете готові до дії.
        </p>
        <Button
          type="primary"
          className="bg-[#3E4826] hover:bg-[#2f361f] text-white font-semibold mb-[40px]"
          onClick={() => navigate("/")}
        >
          Продовжити
        </Button>
      </div>

    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-2 md:px-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-6">
        <div>

          <h2 className="text-3xl font-semibold mb-1 text-[#3E4826]">
            Список бажань
          </h2>
          <div className="text-[#000000]-500 text-sm font-medium">
            (кількість товарів: <span className="font-semibold">{products.length}</span>)
          </div>
        </div>
        {/* Место для кнопки "Очистити список", если нужно */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-40">
        {products.map(prod => (
          <div
            key={prod.id}

            style={{ minHeight: 320 }}
          >
            <ProductCard {...prod} />
          </div>
        ))}
      </div>
    </div>
  );
};
