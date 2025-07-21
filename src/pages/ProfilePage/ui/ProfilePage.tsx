
/*
import { SupplierTabs } from '../../../widgets/SupplierTabs/ui/SupplierTabs';
import { useAppSelector } from '@store/hooks';
import { RoleSwitcher } from '@features/role/ui/RoleSwitcher';
import { WarriorTabs } from '../../../widgets/WariorTabs/ui/WariorTabs';
import type { JSX } from 'react';

const tabContentByRole: Record<string, JSX.Element> = {
  warrior: <WarriorTabs />,
  supplier: <SupplierTabs />,
};

export const ProfilePage = () => {
  const role = useAppSelector(state => state.user.user?.activeRole); 

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Особистий кабінет ({role === 'supplier' ? 'Спорядник' : 'Воїн'})
        </h2>
        <RoleSwitcher />
      </div>
       {tabContentByRole[role ?? ''] ?? <p>Роль не підтримується</p>}
    </div>
  );
};
*/

import React from 'react';
import { useAppSelector } from '@store/hooks';
import { RoleSwitcher } from '@features/role/ui/RoleSwitcher';
import { TabNavFrame } from '@shared/ui/TabNavFrame/TabNavFrame';
import { TABS_SUPPLIER,  } from '../../../widgets/SupplierTabs/ui/SupplierTabs';

import { TABS_WARRIOR } from '../../../widgets/WariorTabs/ui/WariorTabs';
import RegistrationForm from '../../../widgets/RegistarationForm';
import OrdersTab from '../../../widgets/OrdersTab';
import AddProductCard from '../../../widgets/AddProductCard';

import { ViewedProducts } from '@pages/ViewedProducts';
import  { Wishlist } from '@pages/Wishlist';

    
interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
}


export const ProfilePage = () => {
  const user = useAppSelector(state => state.user.user);

  if (!user) return null;

  const WARRIOR_TAB_CONTENT: Record<string, React.ReactNode> = {
  info: <RegistrationForm user={user} />,
  orders: <OrdersTab/>,
  favourite: <Wishlist/>,
  viewed: <ViewedProducts/>,
 
 
};


 const SUPPLIER_TAB_CONTENT: Record<string, React.ReactNode> = {
  home: <RegistrationForm user={user} />,
  products: <div><AddProductCard sellerId={user.id} /></div>,
  orders: <OrdersTab/>,





};

const role = useAppSelector(state => state.user.activeRole);

const isSupplier = role === "Saler";
  const TABS = isSupplier ? TABS_SUPPLIER : TABS_WARRIOR;
  const TAB_CONTENT = isSupplier ? SUPPLIER_TAB_CONTENT : WARRIOR_TAB_CONTENT;

  const [tab, setTab] = React.useState(() => {
    const hash = window.location.hash.replace('#', '');
    return TABS.find(t => t.key === hash) ? hash : TABS[0].key;
  });

  React.useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setTab(TABS.find(t => t.key === hash) ? hash : TABS[0].key);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [TABS]);

  const handleChangeTab = (key: string) => {
    setTab(key);
    window.location.hash = `#${key}`;
  };

  return (
    <div >
      <div
      style={{
       
      }} 
      className="flex items-center justify-between mb-6 px-40">
  <TabNavFrame tabs={TABS} value={tab} onChange={handleChangeTab} />
  <RoleSwitcher />
</div>

      <div>
        {TAB_CONTENT[tab]}
      </div>

    </div>

  );
};





 {/**
   <div
    className={`w-full bg-cover bg-center bg-no-repeat ${className}`}
    style={{
      backgroundImage: `url('${backgroundImage}')`,
      paddingTop: "40px",
      paddingBottom: "50px",
    }}
  >
   <div
      className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row gap-8 rounded-sm shadow-lg px-8 py-6"
      style={{
        background: "rgba(229,229,216,0.5)",
        backdropFilter: "blur(20px)",
        border: "1px solid #E5E5D8",
      }}
    > 
    </div>
    </div>*/}

