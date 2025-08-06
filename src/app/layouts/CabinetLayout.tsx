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
      <div className="flex items-center justify-between mb-6">
        <TabNavFrame tabs={TABS} value={tab} onChange={handleChangeTab} />
        <RoleSwitcher />
        {!user?.roles.includes("Saler") && <BecomeSellerButton />}
      </div>
      <div>
        {TAB_CONTENT[tab]}
      </div>
    </BlurBlock>
  );
};
