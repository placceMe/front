import { useEffect } from "react";
import { useUserProductIds } from "@shared/hooks/useUserProductIds";
import { useProductsByIds } from "@shared/hooks/useProductsByIds";
import ProductCard from "../app/layouts/delete/ProductCard/ProductCard";
import { useAppSelector } from "@store/hooks";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import wishlistEmptyImg from '../assets/pages/favourite.png';

const CSS = `
.wishlist-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  padding: 6px 4px;
}

.wishlist-grid > .product-card {
  width: 100%;
  max-width: 300px;
  justify-self: center;
}

@media (max-width: 1440px) { 
  .wishlist-grid { 
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  }
  .wishlist-grid > .product-card { max-width: 280px; }
}

@media (max-width: 1280px) { 
  .wishlist-grid { 
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
  }
  .wishlist-grid > .product-card { max-width: 260px; }
}

@media (max-width: 1024px) { 
  .wishlist-grid { 
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
  }
  .wishlist-grid > .product-card { max-width: 240px; }
}

@media (max-width: 768px) { 
  .wishlist-grid { 
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
  }
  .wishlist-grid > .product-card { max-width: 220px; }
}

@media (max-width: 600px) { 
  .wishlist-grid { 
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); 
  }
  .wishlist-grid > .product-card { max-width: 140px; }
}

.wishlist-section { 
  margin: 10px 0 5px; 
}

.wishlist-title { 
  font-size: 22px; 
  font-weight: 700; 
  color: #212910; 
  margin: 0 0 10px; 
}

@media (max-width: 768px) { 
  .wishlist-title { 
    font-size: 18px; 
  } 
}
`;

function useInjectOnce(id: string, css: string) {
  useEffect(() => {
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id; 
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  }, [id, css]);
}

export const Wishlist = () => {
  useInjectOnce("wishlist-css", CSS);
  
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
        <p className="text-[15px] font-semibold font-montserrat mb-[20px] mx-auto">
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
    <section className="container section">
      <h2 className="wishlist-title">Список бажань</h2>
      <div className="text-gray-600 text-sm mb-4">
        (кількість товарів: <span className="font-semibold">{products.length}</span>)
      </div>

      <div className="wishlist-grid">
        {Array.isArray(products) && products.map(prod => (
          <ProductCard 
            key={prod.id} 
            product={prod} 
            isAvailable={prod.quantity > 0}
          />
        ))}
      </div>
    </section>
  );
};