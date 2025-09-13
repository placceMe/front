import OrderIcon from '../../assets/icons/order.svg?react';
import UserIcon from '../../assets/icons/user.svg?react';
import ProductIcon from '../../assets/icons/item.svg?react';
import MessageIcon from '../../assets/icons/message.svg?react';
import { Tabs, type TabsProps } from 'antd';
import { Chat } from '@features/chat/ui/Chat';
import OrdersTab from '@widgets/OrdersTab';
import { useAppSelector } from '@store/hooks';
import SellerProfilePage from '@pages/SellerProfilePage';
import { AddProductCard } from '../../widgets/AddProductCard';
import { useRequest } from '@shared/request/useRequest';
import { useEffect, useState } from 'react';
import type { SalerInfoDto } from '@shared/types/api';
import styles from "./CabinetTabs.module.css";
import { BlurBlock } from '@shared/ui/BlurBlock';
import supplierBg from "../../assets/bg/bg_seller.png";
import { SellerOrders } from '@features/order/ui/SellerOrders';


const HASH_PREFIX = "s-";
const DEF = "home";

const getTabFromHash = () => {
  const raw = window.location.hash.replace("#", "");
  return raw.startsWith(HASH_PREFIX) ? raw.slice(HASH_PREFIX.length) : DEF;
};

export const SalerCabinet = ({ onMainChange }: { onMainChange: (val: boolean) => void }) => {
    const { user, activeRole } = useAppSelector(state => state.user);
    const userId = user?.id;

    const { request } = useRequest();

    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState<SalerInfoDto | null>(null);
    const [activeKey, setActiveKey] = useState(getTabFromHash);

     useEffect(() => {
    if (!window.location.hash.startsWith(`#${HASH_PREFIX}`)) {
      window.location.hash = `#${HASH_PREFIX}${DEF}`;
    }
    const onHashChange = () => setActiveKey(getTabFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

    // useEffect: типизируй как  S A L E R I n f o D t o | null
    useEffect(() => { 
        if (!userId) return;
        let ignore = false;
        setLoading(true);

        request<SalerInfoDto | null>(`/api/salerinfo/by-user/${userId}`)
            .then((data) => {
                if (ignore) return;

                if (data) {
                    setInfo(data);

                } else {
                    setInfo(null);

                }
            })
            .catch(() => {
                if (ignore) return;
                setInfo(null);

            })
            .finally(() => { if (!ignore) setLoading(false); });

        return () => { ignore = true; };
    }, [userId]);
    const onChange = (key: string) => {
    setActiveKey(key);
    window.location.hash = `#${HASH_PREFIX}${key}`;
  };
    useEffect(() => {
    onMainChange?.(activeKey === "home");
  }, [activeKey, onMainChange]);


    const t: TabsProps["items"] = [
        {
            key: 'home',
            label: 'Профіль продавця',
            icon: <UserIcon className="w-3 h-3" />,
            children: <SellerProfilePage info={info} />
        },
        {
            key: 'products',
            label: 'Товари',
            icon: <ProductIcon className="w-4.5 h-4.5"/>,
            children: info?.id ? <AddProductCard sellerId={info?.id} /> : null
        },
        {
            key: 'orders',
            label: 'Замовлення',
            icon: <OrderIcon className="w-4 h-4" />,
            children: info?.id ? <SellerOrders sellerId={String(info.id)} /> : null

        },
        {
            key: 'chat',
            label: 'Чат',
            children: <Chat
      activeRole={activeRole} roomId={info?.id} 
      currentUserId={info?.id}                 // ← саме user.id
      initialChatId={new URLSearchParams(location.search).get('chatId') ?? undefined}
    />,
            icon: <MessageIcon  className="w-4 h-4" />
        },
    ];


    return (
    <div className={styles.root}>
      <Tabs items={t} activeKey={activeKey} onChange={onChange} destroyOnHidden />
    </div>
    );
};
