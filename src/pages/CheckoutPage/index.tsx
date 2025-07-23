
import { CheckoutForm } from '@features/checkout/ui/CheckoutForm';
import { useCheckout } from '../../features/checkout/model/useCheckout';
import { CheckoutCartList } from '@features/checkout/ui/CheckoutCartList';

const CheckoutPage = () => {
  const { handleCheckoutSubmit } = useCheckout();

  return (
    <div className="flex justify-center min-h-screen py-8 bg-[#fafaf7]">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl bg-white rounded-2xl shadow-xl px-4 py-6 md:px-10 md:py-10">
        <div className="w-full md:w-1/3 md:pr-8">
          <CheckoutForm onSubmit={handleCheckoutSubmit} />
        </div>
        <div className="w-full md:w-2/3 mt-8 md:mt-0">
          <div className="bg-[#fafaf7] rounded-xl shadow-md p-4 min-w-[320px] max-w-[500px] w-full mx-auto">
            <CheckoutCartList />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;