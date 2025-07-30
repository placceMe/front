/*import React, { useState } from 'react';
import { FaHeart, FaBalanceScale, FaCartPlus } from 'react-icons/fa';
import './productCard.css';
import { useNavigate } from 'react-router-dom'

interface ProductCardProps {
  id:string,
  title: string;
  image: string;
  price: number;
 // articul: number;
 // isTop?: boolean;
  isAvailable?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
   id, 
  title,
  image,
  price,
 // articul,
 // isTop = false,
  isAvailable = true,
}) => {
  const [quantity, setQuantity] = useState(1);
   const navigate = useNavigate();
  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="product-card">
      

      <div className="card-icons">
        <button className="icon-btn"><FaBalanceScale /></button>
        <button className="icon-btn"><FaHeart /></button>
      </div>

      <img src={image} alt={title} className="product-image"   onClick={() => navigate(`/product/${id}`)}/>
      <h3 className="product-title"  onClick={() => navigate(`/product/${id}`)}>{title}</h3>
      <p className="product-price" style={{ fontWeight: 500 }}>{price} ₴</p>
      <p className="product-price">Артикул:2437</p>

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
*/
import React, { useState } from 'react';
import { FaHeart, FaCartPlus } from 'react-icons/fa';
import './productCard.css';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  title: string;
  mainImageUrl: string;
  price: number;
  isAvailable?: boolean;
}
const FILES_BASE_URL = 'http://localhost:5001/api/files/file/';

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
  const article = id.replace(/\D/g, '');


  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  console.log("ProductCard image:", mainImageUrl);

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
      <h3
        className="product-title"
        onClick={() => navigate(`/product/${id}`)}
      >
        {title.split(' ').slice(0, 3).join(' ')}
      </h3>
      <p className="product-price" style={{ fontWeight: 500 }}>{price} ₴</p>
      <p className="product-price">Артикул: {article}</p>

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
