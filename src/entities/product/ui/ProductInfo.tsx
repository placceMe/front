/*
export const ProductInfo = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Тактичний шолом EmberCore Shield M1</h2>
      <div className="text-yellow-500">⭐⭐⭐⭐☆ (36 відгуків)</div>
      <div>Код: <span className="text-gray-500">259905</span></div>
      <div className="text-sm text-gray-600">Виробник: Global Ballistics</div>
      <div className="text-xl line-through text-gray-400">10 800 ₴</div>
      <div className="text-2xl font-bold text-red-600">9 720 ₴</div>
      <div className="flex gap-2">
        <button className="bg-green-600 text-white px-4 py-2">Купити</button>
        <button className="border px-4 py-2">В кредит</button>
      </div>
    </div>
  );
};

*/
// entities/Product/ui/ProductInfoBlock.tsx


////////////////////////////////////////////////////////////
/*
import type { Product } from '@shared/types/api';
import { TagBlock } from './TagBlock';
import { ProductPriceBlock } from './ProductPriceBlock';
import { PaymentIcons } from '@shared/ui/PaymentIcons';
import { AddToCartButton } from '@features/addToCart/ui/AddToCartButton';
import { BuyOnCreditButton } from '@features/buyOnCredit/ui/BuyOnCreditButton';
import { ProductSellerBlock } from '../../../widgets/ProductSellerBlock/ProductSellerBlock';
import StarOrangeIcon from '@assets/icons/star_yellow.svg?react';

import { 
  Card, 
  Typography, 
  Rate, 
  Space, 
  Descriptions, 
  Flex,
  theme 
} from 'antd';
import { GlassCard } from '@shared/ui/GlassCard/GlassCard';

const { Title, Text } = Typography;

interface Props {
  product: Product;
}

export const ProductInfo = ({ product }: Props) => {
  const { token } = theme.useToken();

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
    
      
        <GlassCard>
        <Title 
          level={2} 
          className="font-montserrat font-semibold text-h1 text-color_gradient"
          style={{ marginBottom: token.marginXS }}
        >
          {product.title}
        </Title>
        
        <Space direction="vertical" size="small">
          <Flex align="center" gap="small">
            <Rate
              disabled
              defaultValue={4.8}
              count={5}
              character={<StarOrangeIcon width={22} height={22} />}
              style={{ fontSize: 22 }}
              allowHalf
            />
            <Text className="font-montserrat font-normal text-[15px] text-color05">
              (3 відгуки)
            </Text>
          </Flex>
          
          <Descriptions 
            column={1} 
            size="small"
            items={[
              {
                label: <Text strong className="font-montserrat text-color05">Код товару:</Text>,
                children: <Text className="font-montserrat text-color05">258905</Text>
              },
              {
                label: <Text strong className="font-montserrat text-color05">Виробник:</Text>,
                children: <Text className="font-montserrat text-color05">Global Balistics</Text>
              }
            ]}
          />
        </Space>

</GlassCard>
   
      <ProductSellerBlock />

    
      <Card
        style={{
          background: 'rgba(229, 229, 216, 0.4)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(229, 229, 216, 0.6)'
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <TagBlock inStock={true} isTop={true} discount={10} />
          
          <ProductPriceBlock price={product.price} oldPrice={10800} />
          
          <Flex gap="middle">
            <AddToCartButton product={product} />
            <BuyOnCreditButton />
          </Flex>
           <div className="hidden sm:block">
          <PaymentIcons />
          </div>
        </Space>
      </Card>
    </Space>
  );
};

*/
//////////////////////////////////////////
/*
import { useState } from 'react';
import { 
  Card, 
  Typography, 
  Rate, 
  Space, 
  Descriptions, 
  Flex,
  Button,
  InputNumber,
  theme 
} from 'antd';
import { 
  MinusOutlined, 
  PlusOutlined, 
  HeartOutlined, 
  HeartFilled,
  SwapOutlined 
} from '@ant-design/icons';
import { GlassCard } from '@shared/ui/GlassCard/GlassCard';
import { TagBlock } from './TagBlock';
import { ProductPriceBlock } from './ProductPriceBlock';
import { PaymentIcons } from '@shared/ui/PaymentIcons';
import { AddToCartButton } from '@features/addToCart/ui/AddToCartButton';
import { BuyOnCreditButton } from '@features/buyOnCredit/ui/BuyOnCreditButton';
import { ProductSellerBlock } from '../../../widgets/ProductSellerBlock/ProductSellerBlock';
import StarOrangeIcon from '@assets/icons/star_yellow.svg?react';
import type { Product } from '@shared/types/api';

const { Title, Text } = Typography;

interface Props {
  product: Product;
}

export const ProductInfo = ({ product }: Props) => {
  const { token } = theme.useToken();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  const handleQuantityChange = (value: number | null) => {
    if (value && value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
  };

  const toggleCompare = () => {
    setIsCompared(prev => !prev);
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
     
      <GlassCard>
        <Flex justify="space-between" align="flex-start" className="mb-4">
          <Title 
            level={2} 
            className="font-montserrat font-semibold text-h1 text-color_gradient flex-1"
            style={{ marginBottom: 0 }}
          >
            {product.title}
          </Title>
          
         
          <div className="hidden sm:flex gap-2 ml-4">
            <Button
              type="text"
              icon={<SwapOutlined />}
              onClick={toggleCompare}
              className={`text-gray-600 hover:text-blue-600 ${isCompared ? 'text-blue-600' : ''}`}
              size="large"
            />
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
              defaultValue={4.8}
              count={5}
              character={<StarOrangeIcon width={22} height={22} />}
              style={{ fontSize: 22 }}
              allowHalf
            />
            <Text className="font-montserrat font-normal text-[15px] text-color05">
              (3 відгуки)
            </Text>
          </Flex>
          
          <Descriptions 
            column={1} 
            size="small"
            items={[
              {
                label: <Text strong className="font-montserrat text-color05">Код товару:</Text>,
                children: <Text className="font-montserrat text-color05">258905</Text>
              },
              {
                label: <Text strong className="font-montserrat text-color05">Виробник:</Text>,
                children: <Text className="font-montserrat text-color05">Global Balistics</Text>
              }
            ]}
          />
        </Space>
      </GlassCard>

      
      <ProductSellerBlock />

     
      <Card
        style={{
          background: 'rgba(229, 229, 216, 0.4)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(229, 229, 216, 0.6)'
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <TagBlock inStock={true} isTop={true} discount={10} />
          
          <ProductPriceBlock price={product.price} oldPrice={10800} />
          
         
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

          <Flex gap="middle" className="w-full">
            <AddToCartButton product={product} quantity={quantity} className="flex-1" />
            <BuyOnCreditButton className="flex-1" />
          </Flex>

          <div className="flex sm:hidden justify-center gap-4 pt-2">
            <Button
              type="text"
              icon={<SwapOutlined />}
              onClick={toggleCompare}
              className={`text-gray-600 hover:text-blue-600 ${isCompared ? 'text-blue-600' : ''}`}
              size="large"
            >
              Порівняти
            </Button>
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
*/
/////////////////////////////
import { useState } from 'react';
import {
  Card, Typography, Rate, Space, Descriptions, Flex, Button, InputNumber
} from 'antd';
import {
  MinusOutlined, PlusOutlined, HeartOutlined, HeartFilled, SwapOutlined
} from '@ant-design/icons';
import { GlassCard } from '@shared/ui/GlassCard/GlassCard';
import { TagBlock } from './TagBlock';
import { ProductPriceBlock } from './ProductPriceBlock';
import { PaymentIcons } from '@shared/ui/PaymentIcons';
import { AddToCartButton } from '@features/addToCart/ui/AddToCartButton';
import { BuyOnCreditButton } from '@features/buyOnCredit/ui/BuyOnCreditButton';
import { ProductSellerBlock } from '../../../widgets/ProductSellerBlock/ProductSellerBlock';
import StarOrangeIcon from '@assets/icons/star_yellow.svg?react';
import type { Product } from '@shared/types/api';
import { useUserProductIds } from '@shared/hooks/useUserProductIds';
import { useAppSelector } from '@store/hooks';

const { Title, Text } = Typography;

interface Props {
  product: Product;
}

export const ProductInfo = ({ product }: Props) => {

  const [quantity, setQuantity] = useState(1);
  //const [isFavorite, setIsFavorite] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  const handleQuantityChange = (value: number | null) => {
    if (value && value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => { if (quantity > 1) setQuantity(prev => prev - 1); };
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
  const toggleCompare = () => setIsCompared(prev => !prev);

  // oldPrice: если не указан, считаем price * 2
  const displayOldPrice = product.price * 2;

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      {/* Product Header Card */}
      <GlassCard>
        <Flex justify="space-between" align="flex-start" className="mb-4">
          <Title
            level={2}
            className="font-montserrat font-semibold text-h1 text-color_gradient flex-1"
            style={{ marginBottom: 0 }}
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
              defaultValue={4.8}
              count={5}
              character={<StarOrangeIcon width={22} height={22} />}
              style={{ fontSize: 22 }}
              allowHalf
            />
            <Text className="font-montserrat font-normal text-[15px] text-color05">
              ({3} відгуки)
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
                children: <Text className="font-montserrat text-color05">{'Global Ballistics'}</Text>
              }
            ]}
          />
        </Space>
      </GlassCard>
      {/* Product Seller Block */}
      <ProductSellerBlock />

      {/* Purchase Options Card */}
      <Card
        style={{
          background: 'rgba(229, 229, 216, 0.4)',
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(229, 229, 216, 0.6)'
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <TagBlock
            inStock={true}
            isTop={true}
            discount={10}
          />
          <ProductPriceBlock
            price={product.price}
            oldPrice={displayOldPrice}
          />
          {/* Quantity selector */}
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
          {/* Purchase buttons */}
          <Flex gap="middle" className="w-full">
            <AddToCartButton product={product} quantity={quantity} className="flex-1" />
            <BuyOnCreditButton className="flex-1" />
          </Flex>
          {/* Mobile action buttons */}
          <div className="flex sm:hidden justify-center gap-4 pt-2">
            <Button
              type="text"
              icon={<SwapOutlined />}
              onClick={toggleCompare}
              className={`text-gray-600 hover:text-blue-600 ${isCompared ? 'text-blue-600' : ''}`}
              size="large"
            >
              Порівняти
            </Button>
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

