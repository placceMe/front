import UserIcon from '../../../assets/icons/user.svg?react';
import HeartIcon from '../../../assets/icons/heart.svg?react';
import OrderIcon from '../../../assets/icons/order.svg?react';
import StarIcon from '../../../assets/icons/star_green.svg?react';
import EyeIcon from '../../../assets/icons/eye.svg?react';
import DeliveryIcon from '../../../assets/icons/delivery.svg?react';
import FeedbackIcon from '../../../assets/icons/feedback.svg?react';
import RegistrationForm from '../../../widgets/RegistarationForm';



export const TABS_WARRIOR = [
  { key: 'info', label: 'Контактна інформація', icon: <UserIcon className="w-3 h-3"/> },
  { key: 'orders', label: 'Історія замовлень', icon: <OrderIcon className="w-4 h-4"/> },
  { key: 'favourite', label: 'Список бажань', icon: <HeartIcon className="w-5 h-5"/> },
  { key: 'viewed', label: 'Переглянуті товари', icon: <EyeIcon className="w-5 h-5"/> },

];

export const WARRIOR_TAB_CONTENT: Record<string, React.ReactNode> = {
  //info: <RegistrationForm user={user}/>,
  orders: <div>Історія замовлень</div>,
  favourite: <>Обрані товари</>,
   viewed: 'Переглянуті товари',
  
  // ...
};
