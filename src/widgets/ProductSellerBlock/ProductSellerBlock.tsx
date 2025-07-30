import { GlassCard } from "@shared/ui/GlassCard/GlassCard";
import { Typography } from 'antd';
import { useAppSelector } from "@store/hooks";
import StarIcon from '../../assets/icons/star_yellow.svg?react'
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

export const ProductSellerBlock = () => {
  const user = useAppSelector(state => state.user.user);
  const sellerRating = 4.6;
  const reviewsCount = 36;
  const navigate = useNavigate();

   const handleClick = () => {
    if (user) {
      navigate(`/seller/${user.id}`);
    }
  };

   return (
    <GlassCard>
      <span className="font-montserrat font-semibold text-base">
        Продавець:
        <button onClick={handleClick} className="text-[color-link] hover:underline ml-1">
          {user ? user.name : 'Гість'}
        </button>
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