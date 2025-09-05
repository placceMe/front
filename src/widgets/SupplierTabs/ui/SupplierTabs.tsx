
import UserIcon from '../../../assets/icons/user.svg?react';
import OrderIcon from '../../../assets/icons/order.svg?react';
import HeartIcon from '../../../assets/icons/heart.svg?react';


export const TABS_SUPPLIER = [
  { key: 'home', label: 'Про продавця', icon: (active: boolean) => <UserIcon fill={active ? "#fff" : "#3E472C"} width={12} height={12} /> },
  { key: 'products', label: 'Товари', icon: (active: boolean) => <HeartIcon fill={active ? "#fff" : "#3E472C"} width={18} height={18} /> },
  { key: 'orders', label: 'Замовлення', icon: (active: boolean) => <OrderIcon fill={active ? "#fff" : "#3E472C"} width={18} height={18} /> },
  { key: 'chat', label: 'Чат', icon: (active: boolean) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H6L4 22V6C4 4.89543 4.89543 4 6 4Z" stroke={active ? "#fff" : "#3E472C"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
];



