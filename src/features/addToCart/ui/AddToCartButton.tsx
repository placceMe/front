/*import { addToCart } from '@features/cart/model/cartSlice';
import type { Product } from '@shared/types/api';
import { useAppDispatch } from '@store/hooks';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Props {
  product: Product;
  className?: string;
  children?: React.ReactNode;
  quantity:number;
}

export const AddToCartButton = ({ product, className, children, quantity }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleAdd = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    navigate('/cart');
  };

  return (
    <Button
      type="primary"
      size="large"
      className={className}
      onClick={handleAdd}
    >
      {children || "Купити"}
    </Button>
  );
};

               */

import { addToCart } from '@features/cart/model/cartSlice';
import type { Product } from '@shared/types/api';
import { useAppDispatch } from '@store/hooks';
import { Button } from 'antd';

interface Props {
  product: Product;
  className?: string;
  children?: React.ReactNode;
  quantity: number;
}

export const AddToCartButton = ({ product, className, children, quantity }: Props) => {
  const dispatch = useAppDispatch();

  const handleAdd = () => {
    dispatch(addToCart({ product, quantity })); // передаем выбранное количество
    // не делаем navigate
  };

  return (
    <Button
      type="primary"
      size="large"
      className={className}
      onClick={handleAdd}
    >
      {children || "Купити"}
    </Button>
  );
};
