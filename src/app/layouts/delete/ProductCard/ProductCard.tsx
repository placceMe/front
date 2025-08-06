
import React, { useState } from 'react';
import { FaCartPlus } from 'react-icons/fa';
import './productCard.css';
import { NavLink, useNavigate } from 'react-router-dom';
import type { Product } from '@shared/types/api';
import { useUserProductIds } from '@shared/hooks/useUserProductIds';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { addToCart, updateQuantity } from '@features/cart/model/cartSlice';
import { Button } from 'antd';

import { CheckCircleFilled, HeartOutlined } from '@ant-design/icons';
import { RxHeartFilled } from 'react-icons/rx';
import { FONTS } from '@shared/constants/fonts';
import { COLORS } from '@shared/constants/colors';
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
  }
  

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };



  console.log("ProductCard image:", id);

  return (
    <div className="product-card">
     <div className="card-icons">
  <Button
    type="text"
    icon={isFavorite ? <RxHeartFilled /> : <HeartOutlined  />}
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
      <NavLink to={`/product/${id}`} replace={true} >
       <h3 className="product-title">
  {title.length > 60 ? title.slice(0, 30) + '…' : title}
</h3>
      </NavLink>
      <p className="product-price" style={{ fontWeight: 500 }}>{price} ₴</p>
      <p className="product-price">Артикул: {id?.match(/\d/g)?.join('') || '—'}</p>
       

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
      <CheckCircleFilled style={{ color: '#3E4826', fontSize: 16 }} />
    ) : (
      <FaCartPlus style={{ marginRight: 6, fontSize: 16 }} />
    )
  }
  className={isInCart ? 'rounded-md border border-solid flex items-center' : 'buy-btn'}
  style={{
    height: 34,
    fontSize: 14,
    fontWeight: 600,
    fontFamily: FONTS.family.montserratBold,
    minWidth: 100,
    ...(isInCart
      ? {
          backgroundColor: '#F8FAEC',
          borderColor: '#3E4826',
          color: COLORS.color04,
        }
      : {}),
  }}
>
  {isInCart ? 'У кошику' : 'В кошик'}
</Button>




        {/*<button className="buy-btn" disabled={!isAvailable} onClick={handleAddToCart}>
          <FaCartPlus style={{ marginRight: 6 }} />
          {isAvailable ? 'В кошик' : 'Немає'}
        </button>*/}
      </div>
    </div>
  );
};

export default ProductCard;
