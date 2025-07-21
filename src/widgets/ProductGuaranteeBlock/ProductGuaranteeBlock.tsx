import { COLORS } from '@shared/constants/colors';
import Safety from '../../assets/icons/safety.svg?react';
import { FONTS } from '@shared/constants/fonts';
import { GlassCard } from '@shared/ui/GlassCard/GlassCard';

export const ProductGuaranteeBlock = () => (

  <GlassCard>
    <div className="flex items-center gap-1">
      <Safety/>
      <span className="font-montserrat font-semibold text-[18px] text-color05">
       Гарантія від виробника.
      </span>
      <span className="font-montserrat font-normal text-[15px] text-color05 ml-1">
        Обмін/повернення товару впродовж 14 днів
      </span>
    </div>
  </GlassCard>
);
