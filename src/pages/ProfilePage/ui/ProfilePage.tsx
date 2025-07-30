
import React from 'react';
import { useAppSelector } from '@store/hooks';
import { RoleSwitcher } from '@features/role/ui/RoleSwitcher';
import { TabNavFrame } from '@shared/ui/TabNavFrame/TabNavFrame';
import { TABS_SUPPLIER, } from '../../../widgets/SupplierTabs/ui/SupplierTabs';

import { TABS_WARRIOR } from '../../../widgets/WariorTabs/ui/WariorTabs';
import RegistrationForm from '../../../widgets/RegistarationForm';
import OrdersTab from '../../../widgets/OrdersTab';
import AddProductCard from '../../../widgets/AddProductCard';

import { ViewedProducts } from '@pages/ViewedProducts';
import { Wishlist } from '@pages/Wishlist';


export const ProfilePage = () => {
  const user = useAppSelector(state => state.user.user);

  if (!user) return null;

  const WARRIOR_TAB_CONTENT: Record<string, React.ReactNode> = {
    info: <RegistrationForm user={user} />,
    orders: <OrdersTab />,
    favourite: <Wishlist />,
    viewed: <ViewedProducts />,
  };


  const SUPPLIER_TAB_CONTENT: Record<string, React.ReactNode> = {
    home: <RegistrationForm user={user} />,
    products: <div><AddProductCard sellerId={user.id} /></div>,
    orders: <OrdersTab />,

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