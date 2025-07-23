
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
    dispatch(addToCart({ product, quantity })); 
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
