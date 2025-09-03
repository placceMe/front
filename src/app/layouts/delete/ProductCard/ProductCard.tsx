import React, { useState, useEffect } from "react";
import { FaCartPlus, FaBalanceScale, FaBalanceScaleRight } from "react-icons/fa";
import "./productCard.css";
import { NavLink, useNavigate } from "react-router-dom";
import type { Product } from "@shared/types/api";
import { useUserProductIds } from "@shared/hooks/useUserProductIds";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addToCart } from "@features/cart/model/cartSlice";
import { Button } from "antd";
import FavFilledIcon from "../../../../assets/icons/fav_filled.svg?react";
import FavOutlinedIcon from "../../../../assets/icons/fav_outlined.svg?react";
import { CheckCircleFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "@store/store";
import { formatPrice } from "@shared/lib/formatPrice";

interface ProductCardProps {
  product: Product;
  isAvailable?: boolean;
}

const FILES_BASE_URL = `${__BASE_URL__}/api/files/`;
const COMPARE_KEY = "comparison";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const isInCart = cartItems.some((item) => item.product.id === product.id);

  const { id, title, mainImageUrl, price } = product;
  const navigate = useNavigate();

  const imageUrl = !mainImageUrl
    ? "/placeholder.png"
    : mainImageUrl.startsWith("http")
    ? mainImageUrl
    : FILES_BASE_URL + mainImageUrl;

  const userId = useAppSelector((state) => state.user.user?.id) || "guest";
  const [wishlist, setWishlist] = useUserProductIds(userId, "userWishlist");

  const isFavorite = wishlist.includes(String(product.id));
  const toggleFavorite = () => {
    if (isFavorite) {
      setWishlist(wishlist.filter((pid) => pid !== product.id));
    } else {
      setWishlist([product.id, ...wishlist]);
    }
  };

  // ⚖️ Сравнение
  const [isCompared, setIsCompared] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem(COMPARE_KEY);
    const comparison: Product[] = stored ? JSON.parse(stored) : [];
    setIsCompared(comparison.some((p) => p.id === product.id));
  }, [product.id]);

  const toggleCompare = () => {
    const stored = localStorage.getItem(COMPARE_KEY);
    const comparison: Product[] = stored ? JSON.parse(stored) : [];
    const newComparison = isCompared
      ? comparison.filter((p) => p.id !== product.id)
      : [product, ...comparison];

    localStorage.setItem(COMPARE_KEY, JSON.stringify(newComparison));
    setIsCompared(!isCompared);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
  };

  // форматирование цены
  const { current, rates } = useSelector((state: RootState) => state.currency);
  const formatted = formatPrice(price, current, rates);

  return (
    <div className="product-card">
      <div className="card-icons">
        <Button
          type="text"
          icon={
            isFavorite ? (
              <FavFilledIcon width={26} height={24} />
            ) : (
              <FavOutlinedIcon width={26} height={24} />
            )
          }
          onClick={toggleFavorite}
          className={`text-gray-600 hover:text-red-500 ${isFavorite ? "text-red-500" : ""}`}
          size="large"
        />

        <Button
          type="text"
          icon={isCompared ? <FaBalanceScaleRight size={22} /> : <FaBalanceScale size={22} />}
          onClick={toggleCompare}
          className={isCompared ? "bg-green-100 text-green-700 rounded-full shadow-md" : "text-gray-600 hover:text-green-600"}
          size="large"
        />
      </div>

      <img
        src={imageUrl}
        alt={title}
        className="product-image"
        onClick={() => navigate(`/product/${id}`)}
      />

      <div className="card-body">
        <NavLink to={`/product/${id}`} replace>
          <h3 className="product-title">
            {title.length > 60 ? title.slice(0, 30) + "…" : title}
          </h3>
        </NavLink>

        <p className="sku">Артикул: {id?.match(/\d/g)?.join("") || "—"}</p>
        <p className="product-price product-price--desktop">{formatted}</p>


        {/* Мобильный ряд: цена + корзина справа */}
        <div className="price-row">
          <p className="product-price">{formatted}</p>
          <Button
            onClick={handleAddToCart}
            disabled={isInCart}
            icon={
              isInCart ? (
                <CheckCircleFilled style={{ fontSize: 16 }} />
              ) : (
                <FaCartPlus style={{ fontSize: 16 }} />
              )
            }
            className="buy-btn"
            aria-label="Додати в кошик"
          >
            <span className="btn-text">{isInCart ? "У кошику" : "В кошик"}</span>
          </Button>
        </div>

        {/* Десктопный блок без +/- */}
        <div className="product-actions">
          <Button
            onClick={handleAddToCart}
            disabled={isInCart}
            icon={
              isInCart ? (
                <CheckCircleFilled style={{ fontSize: 16 }} />
              ) : (
                <FaCartPlus style={{ fontSize: 16 }} />
              )
            }
            className={
              isInCart
                ? "rounded-md border border-solid flex items-center buy-btn"
                : "buy-btn"
            }
            style={{
              height: 34,
              fontSize: 14,
              fontWeight: 600,
              minWidth: 100,
              ...(isInCart
                ? {
                    backgroundColor: "#F8FAEC",
                    borderColor: "#3E4826",
                    color: "#3E4826",
                  }
                : {}),
            }}
          >
            <span className="btn-text">{isInCart ? "У кошику" : "В кошик"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
