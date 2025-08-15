import { Collapse, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const items = [
  {
    key: '1',
    label: 'Як оформити замовлення?',
    children: (
      <Paragraph>
        Виберіть товар, додайте його до кошика та перейдіть до оформлення. Заповніть необхідні
        дані та підтвердіть замовлення.
      </Paragraph>
    ),
  },
  {
    key: '2',
    label: 'Де знаходяться точки видачі?',
    children: (
      <Paragraph>
        Ми доставляємо через Нову Пошту, Укрпошту та Meest Express. Ви можете обрати найближче
        відділення або поштомат при оформленні замовлення.
      </Paragraph>
    ),
  },
  {
    key: '3',
    label: 'Коли я отримаю своє замовлення?',
    children: (
      <Paragraph>
        Якщо товар є в наявності — доставка протягом 1–3 робочих днів. Якщо товару немає на
        складі — до 7 днів. Статус відстежується за номером ТТН.
      </Paragraph>
    ),
  },
  {
    key: '4',
    label: 'Як повернути товар?',
    children: (
      <Paragraph>
        Ви маєте 14 днів для повернення товару, який не був у використанні. Для цього
        зв’яжіться з нашим менеджером і дотримуйтесь інструкцій.
      </Paragraph>
    ),
  },
  {
    key: '5',
    label: 'Які умови повернення?',
    children: (
      <Paragraph>
        Товар має бути новим, з усіма бірками, у непошкодженій упаковці. Ми не приймаємо назад
        товари, які мають сліди використання.
      </Paragraph>
    ),
  },
  {
    key: '6',
    label: 'Чому замовлення привіз кур’єр Нової Пошти?',
    children: (
      <Paragraph>
        Ми використовуємо лише офіційних логістичних партнерів: Нова Пошта, Укрпошта та Meest.
        Це гарантує швидку доставку та надійність.
      </Paragraph>
    ),
  },
];

export const FAQ = () => {
  return (
    <section className="mt-16 mb-24 px-4 md:px-44 text-[#212910] font-[Montserrat]">
      <div className="text-center mb-10">
        <Title level={3} className="text-[#212910] font-bold text-[28px] flex justify-center items-center gap-2">
           Питання та відповіді
        </Title>
      </div>

      <Collapse
        items={items}
        accordion
        className="bg-white rounded-lg shadow-md text-base [&>div>.ant-collapse-item]:mb-4"
      />
    </section>
  );
};
