import { addToCart } from '@features/cart/model/cartSlice';
import type { Product } from '@shared/types/api';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { Button } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { FONTS, COLORS } from '@shared/constants/theme';

interface Props {
  product: Product;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  quantity: number;
}

export const AddToCartButton = ({
  product,
  className = "",
  style = {},
  children,
  quantity,
}: Props) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const isInCart = cartItems.some((item) => item.product.id === product.id);

  const handleClick = () => {
    if (!isInCart) {
      dispatch(addToCart({ product, quantity }));
    }
  };

  return (
   <Button
      size="large"
      onClick={handleClick}
      className={
        isInCart
          ? `!bg-[#F8FAEC] !rounded-md !px-8 border border-solid ${className}`
          : `text-white font-semibold border-[#3E4826] ${className}`
      }
 style={{
    maxWidth: 200,
    minWidth: 160,
    fontFamily: FONTS.family.montserratBold,
    fontWeight: FONTS.weight.bold,
    fontSize: FONTS.size.h6xs,
    ...style,
    ...(isInCart
      ? {
          color: COLORS.color04,
          borderColor: COLORS.color04,
        }
      : {
          backgroundColor: '#3E4826',
          borderColor: '#3E4826',
          color: COLORS.color01,
        }), }
      }
      icon={isInCart ? <CheckCircleFilled style={{ color: '#3E4826' }} /> : undefined}
    >
      {isInCart ? "Товар у кошику" : (children || "Купити")}
    </Button>
  );
};
