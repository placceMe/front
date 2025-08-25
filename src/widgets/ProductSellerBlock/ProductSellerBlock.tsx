import { useRequest } from "@shared/request/useRequest";
import { GlassCard } from "@shared/ui/GlassCard/GlassCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface Props {
  sellerId: string;
}

export const ProductSellerBlock = ({ sellerId }: Props) => {
  const navigate = useNavigate();
  const [seller, setSeller] = useState<any>(null); // тип лучше уточни

  const { request } = useRequest();

  useEffect(() => {
    if (!sellerId) return;
    request(`/api/users/${sellerId}`) // или `/api/salerinfo/by-user/${sellerId}` — зависит от структуры
      .then(setSeller)
      .catch(console.error);
  }, [sellerId]);

  const handleClick = () => {
    navigate(`/seller/${sellerId}`);
  };

  return (
    <GlassCard>
       <div
    onClick={handleClick}
    className="cursor-pointer hover:underline hover:text-[#3E4826] font-montserrat font-semibold text-base transition-colors"
  >
    Продавець: <span className="ml-1">{seller?.name || "—"}</span>
  </div>

      {/*   <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
          <span className="font-montserrat font-semibold text-base">
            {(seller?.rating ?? '')}/5

          </span>
          <StarIcon />
        </div>
       
        <span className="font-montserrat font-normal text-base text-[color05]">
          ({seller?.reviewsCount ?? 36} оцінок)
        </span>
       
      </div> */}
    </GlassCard>
  );
};
