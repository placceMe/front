import { useAppSelector } from "@store/hooks";
import { RoleSwitcher } from "@features/role/ui/RoleSwitcher";
import warriorBg from "../../assets/bg/bg_buyer.png";
import supplierBg from "../../assets/bg/bg_seller.png";

import { BlurBlock } from "@shared/ui/BlurBlock";

import { BecomeSellerButton } from "@features/role/ui/BecomeSellerButton";
import { UserCabinet } from "@features/cabinet/UserCabinet";
import { SalerCabinet } from "@features/cabinet/SalerCabinet";


const HERO_IMAGES = {
  User: warriorBg,
  Saler: supplierBg,
};

export const CabinetLayout = () => {
  const user = useAppSelector(state => state.user.user);
  const activeRole = (useAppSelector(state => state.user.activeRole) as "User" | "Saler") || "User";
  const isMain = true;


  return (
    <BlurBlock
      backgroundImage={isMain ? HERO_IMAGES[activeRole] : undefined}
      paper={!isMain}
    >
      <style>{`
        .cabinet-head{
          display:flex; align-items:center; justify-content:space-between;
          gap:12px; margin-bottom:16px; flex-wrap:wrap;
        }

        /* Табы: на мобилках свайп, без видимого скроллбара */
        .cabinet-tabs{ gap:8px; }
        @media (max-width:768px){
          .cabinet-head{
            /* 2 строки: сверху табы, снизу управление */
            display:grid;
            grid-template-columns: 1fr auto;
            grid-template-areas:
              "tabs tabs"
              "role btn";
            row-gap:10px;
          }
          .cabinet-tabs{
            grid-area: tabs;
            overflow-x:auto;
            -webkit-overflow-scrolling:touch;
            white-space:nowrap;
            padding-bottom:6px;
            scrollbar-width:none;
          }
          .cabinet-tabs::-webkit-scrollbar{ display:none; }
          .cabinet-tabs > *{ flex-shrink:0; }
          .cabinet-role{ grid-area: role; }
          .cabinet-become{ grid-area: btn; }
        }

        /* Антураж под тему */
        .role-select .ant-select-selector{
          height:36px !important;
          border-radius:10px !important;
          background:#F4F4E7 !important;
          border:1px solid #3E472C !important;
          box-shadow:none !important;
        }
        .role-select .ant-select-selection-item{
          line-height:34px !important; /* 36 - бордеры */
          font-weight:600;
          color:#3E472C;
        }
        .role-select .ant-select-arrow{ color:#3E472C; }

        /* Кнопка продавца — аккуратно встаёт и на мобилке */
        .cabinet-become > button{
          height:36px;
          border-radius:10px;
          white-space:nowrap;
        }
        @media (max-width:768px){
          .cabinet-become{ justify-self:end; }
        }
      `}</style>
      <div className="cabinet-head">
        {/* Переключатель роли + кнопка продавца */}
        <div className="flex items-center gap-2">
          <div className="cabinet-role">
            <RoleSwitcher />
          </div>
          {!user?.roles.includes("Saler") && (
            <div className="cabinet-become">
              <BecomeSellerButton />
            </div>
          )}
        </div>
      </div>

      <div>
        {activeRole === "User" && <UserCabinet />}
        {activeRole === "Saler" && <SalerCabinet />}
      </div>

    </BlurBlock>
  );
};
