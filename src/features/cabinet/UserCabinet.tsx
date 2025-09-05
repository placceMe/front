import UserIcon from '../../assets/icons/user.svg?react';
import HeartIcon from '../../assets/icons/heart.svg?react';
import OrderIcon from '../../assets/icons/order.svg?react';
import EyeIcon from '../../assets/icons/eye.svg?react';
import { Tabs, type TabsProps } from 'antd';
import { Chat } from '@features/chat/ui/Chat';
import { ViewedProducts } from '@pages/ViewedProducts';
import { Wishlist } from '@pages/Wishlist';
import OrdersTab from '@widgets/OrdersTab';
import RegistrationForm from '@widgets/RegistarationForm';
import { useAppSelector } from '@store/hooks';


export const UserCabinet = () => {

    const { user, activeRole } = useAppSelector(state => state.user);

    const t: TabsProps["items"] = [
        { key: 'info', label: 'Контактна інформація', icon: <UserIcon className="w-3 h-3" />, children: <RegistrationForm user={user!} /> },
        { key: 'orders', label: 'Історія замовлень', icon: <OrderIcon className="w-4 h-4" />, children: <OrdersTab /> },
        { key: 'favourite', label: 'Список бажань', icon: <HeartIcon className="w-5 h-5" />, children: <Wishlist /> },
        { key: 'viewed', label: 'Переглянуті товари', icon: <EyeIcon className="w-4 h-4" />, children: <ViewedProducts /> },
        { key: 'chat', label: 'Чат', children: <Chat roomId={user?.id!} activeRole={activeRole!} currentUserId={user?.id!} />, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H6L4 22V6C4 4.89543 4.89543 4 6 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    ];

    return (
        <div>
            <Tabs items={t} destroyOnHidden />

        </div>
    );
};