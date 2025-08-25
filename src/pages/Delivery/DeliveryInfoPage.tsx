import React from 'react';
import DeliveryBlock from '../../assets/pages/delivery_block.png'
import Payment from '../../assets/pages/payment.png'
import UnionIcon from '../../assets/icons/union.svg?react'

const DeliveryInfoPage: React.FC = () => {
    return (

        <div className=" container section">
            <div className="max-w-6xl mx-auto space-y-20">
                <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8">
                    Доставка
                </h2>
                <section className="grid lg:grid-cols-2 gap-12 items-center">

                    <div className="lg:order-1">


                        <div className="space-y-4 text-gray-700 leading-relaxed">
                            <p>
                                Ми дбаємо про те, щоб Ваше замовлення прибуло швидко та зручно.
                            </p>
                            <p>
                                Доставка здійснюється по всій Україні протягом 1-3 робочих днів.
                            </p>
                            <p className="font-semibold">
                                Доступні наступні способи:
                            </p>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-start gap-3">
                                <UnionIcon width={40} />
                                <p className="text-gray-700">
                                    <span className="font-semibold">Самовивіз з відділення Нової Пошти</span> — заберіть замовлення у найближчому для Вас відділенні;
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <UnionIcon width={40} />
                                <p className="text-gray-700">
                                    <span className="font-semibold">Самовивіз з поштомата Нової Пошти</span> — отримайте посилку у зручний час у поштоматі, який працює 24/7;
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <UnionIcon width={40} />
                                <p className="text-gray-700">
                                    <span className="font-semibold">Кур'єрська доставка Нової Пошти</span> — замовлення буде доставлено прямо до Вашого дому чи офісу.
                                </p>
                            </div>
                        </div>

                        <p className="mt-6 text-gray-700">
                            Вартість доставки розраховується згідно з тарифами перевізника.
                        </p>
                    </div>

                    <div className="lg:order-2 flex justify-center">
                        <img src={DeliveryBlock} alt="DeliveryBlock" />
                    </div>
                </section>

                 <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8">
                    Оплата
                </h2>
                <section className="grid lg:grid-cols-2 gap-12 items-center">

                    <div className="flex justify-center">
                        <img src={Payment} alt="Payment" />

                    </div>
                    <div>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Для Вашої зручності ми пропонуємо кілька способів оплати:
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <UnionIcon width={40} />
                                <p className="text-gray-700">
                                    <span className="font-semibold">Готівкою при отриманні</span> — сплачуйте за замовлення під час його отримання у відділенні чи від кур'єра;
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <UnionIcon width={40} />
                                <p className="text-gray-700">
                                    <span className="font-semibold">Онлайн-оплата банківською карткою</span> — приймаємо Visa, Monobank, PrivatBank та Mastercard;
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <UnionIcon width={40} />
                                <p className="text-gray-700">
                                    <span className="font-semibold">Безготівковий розрахунок для юридичних осіб</span> — за потреби надаємо рахунок для оплати.
                                </p>
                            </div>
                        </div>

                        <p className="mt-6 text-gray-700">
                            Ми не вимагаємо передоплати. Ви завжди можете оплатити замовлення при отриманні.
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default DeliveryInfoPage;