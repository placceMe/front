import { COLORS } from '@shared/constants/colors';
import { FONTS } from '@shared/constants/fonts';
import React from 'react';

interface ProductPriceBlockProps {
  price: number;
  oldPrice?: number;
}

export const ProductPriceBlock: React.FC<ProductPriceBlockProps> = ({
  price,
  oldPrice
}) => (
  <div className="flex flex-col items-start gap-1">
    {oldPrice && (
      <span
        className="line-through text-gray-400"
        style={{
          fontSize: FONTS.size.h6xs,
          fontFamily: FONTS.family.montserrat,
          fontWeight: FONTS.weight.semibold,
          color: COLORS.color05,
        }}
      >
        {oldPrice?.toLocaleString()} грн
      </span>
    )}
    <span
      className="text-3xl"
      style={{
        color: COLORS.color08,
        fontFamily: FONTS.family.montserrat,
        fontWeight: FONTS.weight.semibold,
        fontSize: FONTS.size.h3,
      }}
    >
      {price?.toLocaleString()} грн
    </span>
  </div>
);
