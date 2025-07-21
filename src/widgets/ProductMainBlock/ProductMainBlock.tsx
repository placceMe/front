import { AddToCartButton } from '@features/addToCart/ui/AddToCartButton';
import type { Product } from '@shared/types/api';
import { Tag } from 'antd';
import { ProductGallery } from '../ProductGallery/ProductGallery';
import { ProductInfo } from '../../entities/product/ui/ProductInfo';
import { ProductDeliveryBlock } from '../../widgets/ProductDeliveryBlock/ProductDeliveryBlock';
import { ProductGuaranteeBlock } from '../../widgets/ProductGuaranteeBlock/ProductGuaranteeBlock';
import { BlurBlock } from '@shared/ui/BlurBlock';

interface Props {
  product: Product;
}

export const ProductMainBlock = ({ product }: Props) => {
  console.log("ProductMainBlock props product:", product);

  return (
    <div className='flex'>
      <div className="md:w-[44%] w-full flex flex-col justify-between">
        <ProductGallery images={product.mainImageUrl ? [product.mainImageUrl] : []} />

      </div>
      <div className="md:w-[56%] w-full flex flex-col gap-4">
        <ProductInfo product={product} />

        <ProductDeliveryBlock />

        <ProductGuaranteeBlock />
      </div>
   </div>
  );
}

  {/** 
  <div
    className="w-full bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('/src/assets/productCard/bg.png')",
      paddingTop: '40px',
      paddingBottom: '50px',
    }}
  >
    <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row gap-8 rounded-sm shadow-lg px-8 py-6"
      style={{
        background: 'rgba(229,229,216,0.5)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #E5E5D8',
      }}
    >
*/}