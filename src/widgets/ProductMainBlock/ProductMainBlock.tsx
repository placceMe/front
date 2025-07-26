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

