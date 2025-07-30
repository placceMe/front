import type { Product } from "@shared/types/api";
import InfoIcon from '../../assets/icons/info.svg?react';

interface Props {
  product: Product;
}

export const ProductDescriptionBlock = ({ product }: Props) => (
  <div>
    <h2 className="text-[1.8rem] font-bold flex items-center mb-2 text-[#0E120A] gap-1">
      <InfoIcon /> Опис
    </h2>
    <p className="text-[#363b22] mb-3 leading-relaxed text-[1.1rem]">
      {product.description}
    </p>
  </div>
);
