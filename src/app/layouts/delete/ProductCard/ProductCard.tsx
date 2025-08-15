
import React, { useState } from 'react';
import { FaCartPlus } from 'react-icons/fa';
import './productCard.css';
import { NavLink, useNavigate } from 'react-router-dom';
import type { Product } from '@shared/types/api';
import { useUserProductIds } from '@shared/hooks/useUserProductIds';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { addToCart, updateQuantity } from '@features/cart/model/cartSlice';
import { Button } from 'antd';
import FavFilledIcon from '../../../../assets/icons/fav_filled.svg?react';
import FavOutlinedIcon from '../../../../assets/icons/fav_outlined.svg?react';


import { CheckCircleFilled,} from '@ant-design/icons';

interface ProductCardProps {
  product: Product;
  isAvailable?: boolean;
}
const FILES_BASE_URL = `${__BASE_URL__}/api/files/`;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);
  const existing = cartItems.find(i => i.product.id === product.id);
  const [quantity, setQuantity] = useState(existing?.quantity || 1);

  const isInCart = cartItems.some(item => item.product.id === product.id);


  const increase = () => {
    setQuantity(prev => {
      const newQty = prev + 1;
      dispatch(updateQuantity({ productId: product.id, quantity: newQty }));
      return newQty;
    });
  };

  const decrease = () => {
    setQuantity(prev => {
      const newQty = prev > 1 ? prev - 1 : 1;
      dispatch(updateQuantity({ productId: product.id, quantity: newQty }));
      return newQty;
    });
  };


  const { id, title, mainImageUrl, price } = product;
  const navigate = useNavigate();

  /*const imageUrl = image ? FILES_BASE_URL + image : '/placeholder.png';*/
  const imageUrl =
    !mainImageUrl
      ? '/placeholder.png'
      : mainImageUrl.startsWith('http')
        ? mainImageUrl
        : FILES_BASE_URL + mainImageUrl;

  // Артикул = первые 1/4 id (по символам, округляем вверх)


  // const increase = () => setQuantity((q) => q + 1);
  //const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const userId = useAppSelector(state => state.user.user?.id) || "guest";
  const [wishlist, setWishlist] = useUserProductIds(userId, "userWishlist");

  const isFavorite = wishlist.includes(String(product.id));


  const toggleFavorite = () => {
    if (isFavorite) {
      setWishlist(wishlist.filter(pid => pid !== product.id));
    } else {
      setWishlist([product.id, ...wishlist]);
    }
  };


  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };



 // console.log("ProductCard image:", id);

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
          className={`text-gray-600 hover:text-red-500 ${isFavorite ? 'text-red-500' : ''}`}
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
      {title.length > 60 ? title.slice(0, 30) + '…' : title}
    </h3>
  </NavLink>

  <p className="sku">Артикул: {id?.match(/\d/g)?.join('') || '—'}</p>

  {/* Мобильный ряд: цена + корзина справа */}
  <div className="price-row">
    <p className="product-price">{price} ₴</p>
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
      <span className="btn-text">{isInCart ? 'У кошику' : 'В кошик'}</span>
    </Button>
  </div>

  {/* Десктопный блок как был (на мобилке скроем CSS-ом) */}
  <div className="product-actions">
    <div className="quantity-control">
      <button className="square-btn" onClick={decrease}>−</button>
      <span className="quantity-value">{quantity}</span>
      <button className="square-btn" onClick={increase}>+</button>
    </div>
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
      className={isInCart ? 'rounded-md border border-solid flex items-center buy-btn' : 'buy-btn'}
      style={{
        height: 34,
        fontSize: 14,
        fontWeight: 600,
        minWidth: 100,
        ...(isInCart ? { backgroundColor:'#F8FAEC', borderColor:'#3E4826', color:'#3E4826' } : {})
      }}
    >
      <span className="btn-text">{isInCart ? 'У кошику' : 'В кошик'}</span>
    </Button>
  </div>
</div>
</div>
  );
};

export default ProductCard;
