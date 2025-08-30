import { useRequest } from "@shared/request/useRequest";
import { GlassCard } from "@shared/ui/GlassCard/GlassCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  userId: string; // 👈 теперь сразу userId
}

interface SalerInfoDto {
  id: string;
  companyName: string;
  description: string;
  schedule: string;
  contacts: { type: string; value: string }[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const ProductSellerBlock = ({ userId }: Props) => {
  const navigate = useNavigate();
  const [sellerInfo, setSellerInfo] = useState<SalerInfoDto | null>(null);

  const { request } = useRequest();

  useEffect(() => {
    if (!userId) return;
    request<SalerInfoDto | null>(`/api/salerinfo/by-user/${userId}`)
      .then(setSellerInfo)
      .catch(console.error);
  }, [userId]);

  const handleClick = () => {
    navigate(`/seller/${userId}#about`); // переход на страницу продавца по userId
  };

  return (
    <GlassCard>
      <div
        onClick={handleClick}
        className="cursor-pointer hover:underline hover:text-[#3E4826] font-montserrat font-semibold text-base transition-colors"
      >
        Продавець:{" "}
        <span className="ml-1">{sellerInfo?.companyName || "—"}</span>
      </div>
    </GlassCard>
  );
};
