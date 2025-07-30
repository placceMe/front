// shared/ui/PaymentIcons.tsx
import master from '../../assets/productCard/payment/mastercard.png';
import privat from '../../assets/productCard/payment/privatbank.png';
import visa from '../../assets/productCard/payment/visa.png';

export const PaymentIcons = () => (
  <div className="flex gap-5 items-end mt-2 mb-2">
    <img src={master} alt="MasterCard" className="h-7" />
    <img src={visa} alt="Visa" className="h-5" />
    <div className="flex items-end gap-1">
      <img src={privat} alt="PrivatBank" className="h-6" />
      <span className="font-bold text-base text-gray-600">PrivatBank</span>
    </div>
    <span className="font-bold text-base text-gray-600">monobank</span>
  </div>
);
