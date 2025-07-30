
import UserIcon from '../../../assets/icons/user.svg?react';
import OrderIcon from '../../../assets/icons/order.svg?react';
import HeartIcon from '../../../assets/icons/heart.svg?react';


export const TABS_SUPPLIER = [
  { key: 'home', label: 'Про продавця', icon: (active: boolean) => <UserIcon fill={active ? "#fff" : "#3E472C"} width={12} height={12} /> },
  { key: 'products', label: 'Товари', icon: (active: boolean) => <HeartIcon fill={active ? "#fff" : "#3E472C"} width={18} height={18} /> },
  { key: 'orders', label: 'Замовлення', icon: (active: boolean) => <OrderIcon fill={active ? "#fff" : "#3E472C"} width={18} height={18} /> },
];



