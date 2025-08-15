import { CheckCircleOutlined, InfoCircleOutlined, CreditCardOutlined, BankOutlined, ShoppingOutlined, FileTextOutlined } from "@ant-design/icons";
import NovaPoshtaIcon from '../../assets/icons/nova_poshta.svg?react';
import UkrPoshtaIcon from '../../assets/icons/ukr_poshta.svg?react';


export const DeliveryInfoPage = () => {
    return (
        <section className="px-4 md:px-44 py-6 text-[#212910] font-['Montserrat, sans-serif']">
            <h2 className="text-3xl font-bold mb-6">Доставка та оплата</h2>

            {/* Доставка */}
            <div className="bg-[#f6f8f3] rounded-xl p-6 md:p-10 mb-12">
                <h3 className="text-2xl font-semibold mb-6">Доставка по Україні</h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white border-l-4 border-[#f9c642] p-4 shadow-sm rounded-md flex items-center gap-3">
                        <InfoCircleOutlined className="text-[#f9c642] text-xl" />
                        <span>Мінімальна сума замовлення – <strong>200 грн</strong></span>
                    </div>
                    <div className="bg-white border-l-4 border-green-600 p-4 shadow-sm rounded-md flex items-center gap-3">
                        <CheckCircleOutlined className="text-green-600 text-xl" />
                        <span>Замовлення понад <strong>20 000 грн</strong> надсилаються тільки за умови повної оплати</span>
                    </div>
                </div>

                {/* Перевізники */}
                <div className="grid md:grid-cols-2 gap-10">
                    {/* Нова Пошта */}
                    <div>
                        <div className="flex items-center  ">
                            <NovaPoshtaIcon className="w-48 h-28" />

                        </div>
                        <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
                            <li><strong>Безкоштовно</strong> при замовленні від <strong>2000 грн</strong></li>

                            <li><strong>Накладений платіж:</strong> 2% + 20 грн від суми</li>
                        </ul>
                    </div>

                    {/* Укрпошта */}
                    <div>
                        <div className="flex items-center 4">
                            <UkrPoshtaIcon className="w-48 h-28" />

                        </div>
                        <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
                            <li><strong>Безкоштовно</strong> при замовленні від <strong>2000 грн</strong></li>

                            <li><strong>Накладений платіж:</strong> 2% + 20 грн від суми</li>
                        </ul>
                    </div>
                </div>
                  <h3 className="text-2xl font-semibold mb-6 mt-12">Оплата</h3>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Для фізичних осіб */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Для фізичних осіб:</h4>
                        <ul className="space-y-4 text-sm md:text-base">
                            <li className="flex items-start gap-2">
                                <ShoppingOutlined className="text-xl mt-1" />
                                Оплата післяплатою при отриманні у відділенні перевізника
                            </li>
                            <li className="flex items-start gap-2">
                                <CreditCardOutlined className="text-xl mt-1" />
                                Оплата банківською карткою Visa / MasterCard
                            </li>
                            <li className="flex items-start gap-2">
                                <BankOutlined className="text-xl mt-1" />
                                Оплата готівкою при отриманні товару
                            </li>
                            <li className="flex items-start gap-2">
                                <FileTextOutlined className="text-xl mt-1" />
                                Оплата на розрахунковий рахунок ПриватБанку
                            </li>
                        </ul>
                    </div>

                    {/* Для юридичних осіб */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Для юридичних осіб:</h4>
                        <p className="mb-4">
                            Оплата за безготівковим розрахунком здійснюється згідно рахунку-фактури. Менеджер надасть всі документи після оформлення замовлення.
                        </p>
                        <div className="bg-white rounded-md p-4 shadow-sm border-l-4 border-red-500 text-sm space-y-2">
                            <p className="text-red-600">
                                <strong>Увага!</strong> Товар надсилається лише після 100% передоплати.
                            </p>
                            <p>
                                У випадку відсутності товару на складі в Україні термін доставки може бути збільшено — менеджер повідомить про це додатково.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

          
        </section>
    );
};
