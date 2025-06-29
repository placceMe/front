import React, { useState } from 'react';
import { FaHeart, FaBalanceScale, FaCartPlus } from 'react-icons/fa';
import './productCard.css';

interface ProductCardProps {
  title: string;
  image: string;
  price: number;
  articul: number;
  isTop?: boolean;
  isAvailable?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  image,
  price,
  articul,
  isTop = false,
  isAvailable = true,
}) => {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="product-card">
      {isTop && <div className="badge">Топ продажів</div>}

      <div className="card-icons">
        <button className="icon-btn"><FaBalanceScale /></button>
        <button className="icon-btn"><FaHeart /></button>
      </div>

      <img src={image} alt={title} className="product-image" />
      <h3 className="product-title">{title}</h3>
      <p className="product-price" style={{ fontWeight: 500 }}>{price} ₴</p>
      <p className="product-price">Артикул: {articul}</p>

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
