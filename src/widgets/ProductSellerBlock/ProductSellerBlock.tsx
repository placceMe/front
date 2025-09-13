import { ContactSellerButton } from "@features/chat/ui/ContactSellerButton";
import { useRequest } from "@shared/request/useRequest";
import { GlassCard } from "@shared/ui/GlassCard/GlassCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  sellerId: string; // 👈 теперь сразу userId
  productId:string;
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

export const ProductSellerBlock = ({ sellerId, productId}: Props) => {
  const navigate = useNavigate();
  const [sellerInfo, setSellerInfo] = useState<SalerInfoDto | null>(null);

  const { request } = useRequest();

  useEffect(() => {
    if (!sellerId) return;
    request<SalerInfoDto | null>(`/api/salerinfo/${sellerId}`)
      .then(setSellerInfo)
      .catch(console.error);
  }, [sellerId]);

  const handleClick = () => {
    navigate(`/seller/${sellerId}#about`); // переход на страницу продавца по userId
  };

  return (
<GlassCard>
      {/* Кликабельным делаем только заголовок/имя */}
          <div className="flex items-center justify-between gap-3">
      <button
        type="button"
        onClick={handleClick}
        className="cursor-pointer hover:underline hover:text-[#3E4826] font-montserrat font-semibold text-base transition-colors"
      >
        Продавець: <span className="ml-1">{sellerInfo?.companyName || "—"}</span>
      </button>

      {/* Кнопка чата — отдельно, без родительского onClick */}
      <div
        onClick={(e) => e.stopPropagation()} // на всякий случай гасим всплытие
        className="mt-3"
      >
        <ContactSellerButton
          sellerId={sellerId}
          productId={productId}
         className="!bg-transparent !shadow-none !px-0 !py-0 !h-auto !text-[#2b3924] !underline hover:opacity-80 text-sm sm:text-base"
        >
          Діалог з продавцем
        </ContactSellerButton>
      </div></div>
    </GlassCard>
  );
};
