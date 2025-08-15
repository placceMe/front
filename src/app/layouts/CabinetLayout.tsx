import React from "react";
import { useAppSelector } from "@store/hooks";
import { TabNavFrame } from "@shared/ui/TabNavFrame/TabNavFrame";
import { RoleSwitcher } from "@features/role/ui/RoleSwitcher";
import warriorBg from "../../assets/bg/bg_buyer.png";
import supplierBg from "../../assets/bg/bg_seller.png";
import { ViewedProducts } from "@pages/ViewedProducts";
import { Wishlist } from "@pages/Wishlist";
import { BlurBlock } from "@shared/ui/BlurBlock";
import { TABS_SUPPLIER } from "../../widgets/SupplierTabs/ui/SupplierTabs";
import { TABS_WARRIOR } from "../../widgets/WariorTabs/ui/WariorTabs";

import RegistrationForm from "../../widgets/RegistarationForm";
import OrdersTab from "../../widgets/OrdersTab";
import { BecomeSellerButton } from "@features/role/ui/BecomeSellerButton";
import { AddProductCard } from "../../widgets/AddProductCard";

const HERO_IMAGES = {
  User: warriorBg,
  Saler: supplierBg,
};

export const CabinetLayout = () => {
  const user = useAppSelector(state => state.user.user);
  const role = (useAppSelector(state => state.user.activeRole) as "User" | "Saler") || "User";
  const TABS = role === "Saler" ? TABS_SUPPLIER : TABS_WARRIOR;


  const TAB_CONTENT: Record<string, React.ReactNode> = role === "Saler"
    ? {
        home: user && <RegistrationForm user={user} />,
        products: user?.id && <AddProductCard sellerId={user.id} />,
        orders: <OrdersTab />,
      }
    : {
        info: user && <RegistrationForm user={user} />,
        orders: <OrdersTab />,
        favourite: <Wishlist />,
        viewed: <ViewedProducts />,
      };


  const [tab, setTab] = React.useState(() => {
    const hash = window.location.hash.replace("#", "");
    return TABS.find(t => t.key === hash) ? hash : TABS[0].key;
  });


  React.useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setTab(TABS.find(t => t.key === hash) ? hash : TABS[0].key);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [TABS]);

 
  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!TABS.find(t => t.key === hash)) {
      setTab(TABS[0].key);
      window.location.hash = `#${TABS[0].key}`;
    }
 
  }, [role, TABS]);


  const handleChangeTab = (key: string) => {
    setTab(key);
    window.location.hash = `#${key}`;
  };

  const isMain = tab === TABS[0].key;

  return (
    <BlurBlock
      backgroundImage={isMain ? HERO_IMAGES[role] : undefined}
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
        {/* Табы: передаём класс для мобильного свайпа */}
        <TabNavFrame
          tabs={TABS}
          value={tab}
          onChange={handleChangeTab}
          className="cabinet-tabs"
        />

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
        {TAB_CONTENT[tab]}
      </div>
    </BlurBlock>
  );
};
