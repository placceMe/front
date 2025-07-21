import { GlassCard } from "@shared/ui/GlassCard/GlassCard";
import { Typography } from 'antd';
import { useAppSelector } from "@store/hooks";
import StarIcon from '../../assets/icons/star_yellow.svg?react'

const { Text } = Typography;

export const ProductSellerBlock = () => {
  const user = useAppSelector(state => state.user.user);
  const sellerRating = 4.6;
  const reviewsCount = 36;

   return (
    <GlassCard>
      <span className="font-montserrat font-semibold text-base">
        Продавець:
        <span className="font-montserrat font-semibold text-base">
          {user ? user.name : ' Гість'}
        </span>
      </span>
      
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="font-montserrat font-semibold text-base">
              {sellerRating}/5
            </span>
            <StarIcon />
          </div>
          <span className="font-montserrat font-normal text-base text-[color05]">
            ({reviewsCount} оцінок)
          </span>
        </div>
     
    </GlassCard>
  );
};