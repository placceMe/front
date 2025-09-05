import UserIcon from '../../../assets/icons/user.svg?react';
import HeartIcon from '../../../assets/icons/heart.svg?react';
import OrderIcon from '../../../assets/icons/order.svg?react';
import EyeIcon from '../../../assets/icons/eye.svg?react';




export const TABS_WARRIOR = [
  { key: 'info', label: 'Контактна інформація', icon: <UserIcon className="w-3 h-3" /> },
  { key: 'orders', label: 'Історія замовлень', icon: <OrderIcon className="w-4 h-4" /> },
  { key: 'favourite', label: 'Список бажань', icon: <HeartIcon className="w-5 h-5" /> },
  { key: 'viewed', label: 'Переглянуті товари', icon: <EyeIcon className="w-4 h-4" /> },
  { key: 'chat', label: 'Чат', icon: (active: boolean) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H6L4 22V6C4 4.89543 4.89543 4 6 4Z" stroke={active ? "#fff" : "#3E472C"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },

];

export const WARRIOR_TAB_CONTENT: Record<string, React.ReactNode> = {
  orders: <div>Історія замовлень</div>,
  favourite: <>Обрані товари</>,
  viewed: 'Переглянуті товари',

};
