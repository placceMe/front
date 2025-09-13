
import { useState } from 'react';
import {
  Card, Typography, Rate, Space, Descriptions, Flex, Button, InputNumber
} from 'antd';
import {
  MinusOutlined, PlusOutlined, HeartOutlined, HeartFilled,
} from '@ant-design/icons';
import { GlassCard } from '@shared/ui/GlassCard/GlassCard';
import { ProductPriceBlock } from './ProductPriceBlock';
import { PaymentIcons } from '@shared/ui/PaymentIcons';
import { AddToCartButton } from '@features/addToCart/ui/AddToCartButton';

import { ProductSellerBlock } from '../../../widgets/ProductSellerBlock/ProductSellerBlock';
import StarOrangeIcon from '@assets/icons/star_yellow.svg?react';
import type { Product } from '@shared/types/api';
import { useUserProductIds } from '@shared/hooks/useUserProductIds';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { updateQuantity } from '@features/cart/model/cartSlice';
import { formatPrice } from '@shared/lib/formatPrice';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/store';
import { useProductFeedbackSummary } from '@shared/hooks/useProductFeedbackSummary';


const { Title, Text } = Typography;

interface Props {
  product: Product;
}

export const ProductInfo = ({ product }: Props) => {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector(state => state.cart.items);
  const existing = cartItems.find(i => i.product.id === product.id);
  const [quantity, setQuantity] = useState(existing?.quantity || 1);
  const { current, rates } = useSelector((state: RootState) => state.currency);
  const formatted = formatPrice(product.price, current, rates);
  const producer = (product as any).producer ?? (product as any).producer ?? '—';


  const handleQuantityChange = (value: number | null) => {
    if (value && value > 0) {
      setQuantity(value);
      dispatch(updateQuantity({ productId: product.id, quantity: value }));
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => {
      const newQty = prev + 1;
      dispatch(updateQuantity({ productId: product.id, quantity: newQty }));
      return newQty;
    });
  };

  const decrementQuantity = () => {
    setQuantity(prev => {
      const newQty = prev > 1 ? prev - 1 : 1;
      dispatch(updateQuantity({ productId: product.id, quantity: newQty }));
      return newQty;
    });
  };

  //const [isFavorite, setIsFavorite] = useState(false);
  //  const [isCompared, setIsCompared] = useState(false);
  const userId = useAppSelector(state => state.user.user?.id) || "guest";
  const [wishlist, setWishlist] = useUserProductIds(userId, "userWishlist"); // массив id-шек!

  /*
const toggleFavorite = (prod: any) => {
  const exists = wishlist.find((el: any) => el.id === prod.id);
  if (exists) setWishlist(wishlist.filter((el: any) => el.id !== prod.id));
  else setWishlist([prod, ...wishlist]);
};*/

  const isFavorite = wishlist.includes(product.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      setWishlist(wishlist.filter((id) => id !== product.id));
    } else {
      setWishlist([product.id, ...wishlist]);
    }
  };
  // const toggleCompare = () => setIsCompared(prev => !prev);

  // oldPrice: если не указан, считаем price * 2
  //const displayOldPrice = product.price * 2;
  const { summary, loading } = useProductFeedbackSummary(product.id);
  const averageRating = summary?.averageRating ?? 0;
  const totalFeedbacks = summary?.totalFeedbacks ?? 0;





  function pluralize(count: number, one: string, few: string, many: string): string {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }



  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* Product Header Card */}
      <GlassCard>
        <Flex justify="space-between" align="flex-start" className="mb-4">
          <Title
            level={2}
            className="font-montserrat font-semibold text-color_gradient flex-1 leading-tight"
            style={{ marginBottom: 0, fontSize: 'clamp(18px, 4vw, 32px)' }}
          >
            {product.title}
          </Title>
          <div className="hidden sm:flex gap-2 ml-4">
            {/**  <Button
              type="text"
              icon={<SwapOutlined />}
              onClick={toggleCompare}
              className={`text-gray-600 hover:text-blue-600 ${isCompared ? 'text-blue-600' : ''}`}
              size="large"
            />*/}

            <Button
              type="text"
              icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
              onClick={toggleFavorite}
              className={`text-gray-600 hover:text-red-500 ${isFavorite ? 'text-red-500' : ''}`}
              size="large"
            />

          </div>
        </Flex>
        <Space direction="vertical" size="small">
          <Flex align="center" gap="small">
            <Rate
              disabled
              count={5}
              character={<StarOrangeIcon width={22} height={22} />}
              style={{ fontSize: 22 }}
              allowHalf
              value={averageRating}
            />
            <Text className="font-montserrat font-normal text-[15px] text-color05">
              {loading ? 'Завантаження…' : `(${totalFeedbacks} ${pluralize(totalFeedbacks, 'відгук', 'відгуки', 'відгуків')})`}
            </Text>
          </Flex>

          <Descriptions
            column={1}
            size="small"
            items={[
              {
                label: <Text strong className="font-montserrat text-color05">Код товару</Text>,
                children: <Text className="font-montserrat text-color05">
                  {product.id?.match(/\d/g)?.join('') || '—'}

                </Text>
              },
              {
                label: <Text strong className="font-montserrat text-color05">Виробник</Text>,
                children: <Text className="font-montserrat text-color05">{producer}</Text>
              }
            ]}
          />
        </Space>
      </GlassCard>
      {/* Product Seller Block */}
      <ProductSellerBlock sellerId={product.sellerId} productId={product.id}/>

      {/* Purchase Options Card */}
      <Card
        style={{
          background: 'rgba(229, 229, 216, 0.4)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(229, 229, 216, 0.6)'
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/**  <TagBlock
            inStock={true}
            isTop={true}
            discount={10}
          />
          */}
          <ProductPriceBlock

            price={formatted}
            oldPrice={formatted}
          />
          {/* Quantity selector */}

          <Flex gap="middle" className="items-center w-full ">
            <div className="flex items-center gap-2">
              <Button
                type="primary"
                icon={<MinusOutlined />}
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                size="large"
                className="bg-green-700 hover:bg-green-600 border-green-700"
                style={{ minWidth: '40px' }}
              />
              <InputNumber
                value={quantity}
                onChange={handleQuantityChange}
                min={1}
                max={99}
                size="large"
                className="w-16 text-center"
                controls={false}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={incrementQuantity}
                size="large"
                className="bg-green-700 hover:bg-green-600 border-green-700"
                style={{ minWidth: '40px' }}
              />
            </div>
            <AddToCartButton product={product} quantity={quantity} className="flex-1" />
          </Flex>



          {/* Mobile action buttons */}
          <div className="flex sm:hidden justify-center gap-4 pt-2">
            {/**
            <Button
              type="text"
              icon={<SwapOutlined />}
              onClick={toggleCompare}
              className={`text-gray-600 hover:text-blue-600 ${isCompared ? 'text-blue-600' : ''}`}
              size="large"
            >
              Порівняти
            </Button> */}
            <Button
              type="text"
              icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
              onClick={toggleFavorite}
              className={`text-gray-600 hover:text-red-500 ${isFavorite ? 'text-red-500' : ''}`}
              size="large"
            >
              {isFavorite ? 'В бажаннях' : 'В бажання'}
            </Button>
          </div>
          <div className="hidden sm:block">
            <PaymentIcons />
          </div>
        </Space>
      </Card>
    </Space>
  );
};

