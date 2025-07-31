
import React, { useState } from 'react';
import { FaHeart, FaCartPlus } from 'react-icons/fa';
import './productCard.css';
import { NavLink, useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  title: string;
  mainImageUrl: string;
  price: number;
  isAvailable?: boolean;
}
const FILES_BASE_URL = `${__BASE_URL__}/api/files/`;

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  mainImageUrl,
  price,
  isAvailable = true,
}) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  /*const imageUrl = image ? FILES_BASE_URL + image : '/placeholder.png';*/
  const imageUrl =
    !mainImageUrl
      ? '/placeholder.png'
      : mainImageUrl.startsWith('http')
        ? mainImageUrl
        : FILES_BASE_URL + mainImageUrl;

  // Артикул = первые 1/4 id (по символам, округляем вверх)


  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  console.log("ProductCard image:", id);

  return (
    <div className="product-card">
      <div className="card-icons">
        {  /*  <button className="icon-btn"><FaBalanceScale /></button>  <FaBalanceScale />*/}
        <button className="icon-btn"><FaHeart /></button>
      </div>

      <img
        src={imageUrl}
        alt={title}
        className="product-image"
        onClick={() => navigate(`/product/${id}`)}
      />
      <NavLink to={`/product/${id}`} replace={true} >
        <h3 className="product-title" onClick={() => navigate(`/product/${id}`)}>
          {title}
        </h3>
      </NavLink>
      <p className="product-price" style={{ fontWeight: 500 }}>{price} ₴</p>
      <p className="product-price">Артикул: {id}</p>

      <div className="product-actions">
        <div className="quantity-control">
          <button className="square-btn" onClick={decrease}>−</button>
          <span className="quantity-value">{quantity}</span>
          <button className="square-btn" onClick={increase}>+</button>
        </div>
        <button className="buy-btn" disabled={!isAvailable}>
          <FaCartPlus style={{ marginRight: 6 }} />
          {isAvailable ? 'В кошик' : 'Немає'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
