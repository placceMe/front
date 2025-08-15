import type { Product } from '@shared/types/api';
import { ProductGallery } from '../ProductGallery/ProductGallery';
import { ProductInfo } from '../../entities/product/ui/ProductInfo';
import { ProductDeliveryBlock } from '../../widgets/ProductDeliveryBlock/ProductDeliveryBlock';
import { ProductGuaranteeBlock } from '../../widgets/ProductGuaranteeBlock/ProductGuaranteeBlock';

interface Props {
  product: Product;
}

export const ProductMainBlock = ({ product }: Props) => {
  console.log("ProductMainBlock props product:", product);

 const images = [
    product.mainImageUrl,
    ...(product.additionalImageUrls?.map(att => att.url || att.filePath || '') ?? [])
  ].filter(Boolean); 


  return (
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
      <div className="md:w-[44%] w-full flex flex-col justify-between">
     {/**  <ProductGallery images={product.mainImageUrl ? [product.mainImageUrl] : []} /> */} 

 <ProductGallery images={images} />




      </div>
      <div className="md:w-[56%] w-full flex flex-col gap-4">
        <ProductInfo product={product} />

        <ProductDeliveryBlock />

        <ProductGuaranteeBlock />
      </div>
    </div>
  );
}

//get - additionalImageUrls