import OrderIcon from '../../assets/icons/order.svg?react';
import UserIcon from '../../assets/icons/user.svg?react';
import { Tabs, type TabsProps } from 'antd';
import { Chat } from '@features/chat/ui/Chat';
import OrdersTab from '@widgets/OrdersTab';
import { useAppSelector } from '@store/hooks';
import SellerProfilePage from '@pages/SellerProfilePage';
import { AddProductCard } from '../../widgets/AddProductCard';
import { useRequest } from '@shared/request/useRequest';
import { useEffect, useState } from 'react';
import type { SalerInfoDto } from '@shared/types/api';

export const SalerCabinet = () => {
    const { user, activeRole } = useAppSelector(state => state.user);
    const userId = user?.id;

    const { request } = useRequest();

    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState<SalerInfoDto | null>(null);

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
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 11H19L20 21H4L5 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>,
            children: user?.id ? <AddProductCard sellerId={user.id} /> : null
        },
        {
            key: 'orders',
            label: 'Замовлення',
            icon: <OrderIcon className="w-4 h-4" />,
            children: <OrdersTab />
        },
        {
            key: 'chat',
            label: 'Чат',
            children: <Chat activeRole={activeRole} roomId={info?.id} currentUserId={info?.id} />,
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H6L4 22V6C4 4.89543 4.89543 4 6 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        },
    ];

    return (
        <div>
            <Tabs items={t} destroyOnHidden />
        </div>
    );
};