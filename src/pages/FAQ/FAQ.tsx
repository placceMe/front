
import React, { useState, type ReactNode } from "react";

type FaqItem = {
  key: string;
  question: string;
  answer: ReactNode;
};

const BORDER = "#8D8C5F";
const HEADER_BG = "#E5E5D8";
const CONTENT_BG = "#FFFFFF";

const data: FaqItem[] = [
  { key: "q1", question: "Скільки часу займає доставка?", answer: (
    <p>Зазвичай 1–3 робочих дні по Україні. Точні терміни залежать від віддаленості населеного пункту та завантаженості перевізника.</p>
  )},
  { key: "q2", question: "Чи можна відстежувати посилку?", answer: (
    <p>Так. Після відправлення надішлемо ТТН Нової пошти — відстеження доступне у застосунку або на сайті перевізника.</p>
  )},
  { key: "q3", question: "Які служби доставки доступні?", answer: (
    <div>
      <p>Ми здійснюємо доставку по Україні через службу Нова Пошта. Ви можете обрати найбільш зручний для себе спосіб:</p>
      <ul style={{ marginTop: 12, marginBottom: 12, paddingLeft: 0, listStyle: "none", lineHeight: 1.7 }}>
        <li>– самовивіз із відділення Нової Пошти,</li>
        <li>– отримання замовлення у поштоматі Нової Пошти,</li>
        <li>– кур’єрська доставка Новою Поштою прямо до дверей.</li>
      </ul>
      <p>Вартість доставки розраховується згідно з тарифами перевізника.</p>
    </div>
  )},
  { key: "q4", question: "Яка мінімальна сума доставки?", answer: (
    <p>Мінімальної суми немає — відправляємо замовлення будь-якої вартості (оплата доставки за тарифами перевізника).</p>
  )},
  { key: "q5", question: "Як можна повернути або обміняти товар?", answer: (
    <p>Повернення/обмін протягом 14 днів за Законом України «Про захист прав споживачів», якщо товар не був у використанні та збережено товарний вигляд.</p>
  )},
  { key: "q6", question: "Скільки днів діє гарантія?", answer: (
    <p>Гарантія залежить від категорії товару та виробника (зазвичай 30–365 днів). Деталі — у картці товару або запитайте підтримку.</p>
  )},
  { key: "q7", question: "Які способи оплати доступні?", answer: (
    <p>Онлайн-оплата карткою, Apple/Google Pay, переказ на рахунок. Післяплата — за тарифами перевізника.</p>
  )},
  // дубль як на скріні
  { key: "q8", question: "Яка мінімальна сума доставки?", answer: (
    <p>Обмежень немає — можемо відправити будь-яке замовлення.</p>
  )},
  { key: "q9", question: "Чи можна оплатити при отриманні?", answer: (
    <p>Так, доступна післяплата у Новій Пошті. Комісію за накладений платіж встановлює перевізник.</p>
  )},
  { key: "q10", question: "Чи є знижки або програми лояльності для постійних клієнтів?", answer: (
    <p>Так, діють промокоди та програма лояльності. Слідкуйте за оновленнями на сайті та у соцмережах.</p>
  )},
];

const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="18" height="18" viewBox="0 0 20 20" aria-hidden
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform .2s ease",
      flexShrink: 0,
    }}
  >
    <path d="M5 7l5 6 5-6" fill="none" stroke="#222" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Row: React.FC<{
  item: FaqItem; open: boolean; onToggle: () => void;
}> = ({ item, open, onToggle }) => (
  <div style={{ marginBottom: 12 }}>
    {/* Header */}
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      style={{
        width: "100%",
        background: HEADER_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: open ? "8px 8px 0 0" : "8px",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: 600,
        fontSize: 16,
        lineHeight: 1.2,
      }}
    >
      <span style={{ paddingRight: 12, textAlign: "left" }}>{item.question}</span>
      <Chevron open={open} />
    </button>

    {/* Content */}
    {open && (
      <div
        style={{
          background: CONTENT_BG,
          border: `1px solid ${BORDER}`,
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          padding: "16px 18px",
          color: "#333",
        }}
      >
        {item.answer}
      </div>
    )}
  </div>
);

export const FAQ: React.FC = () => {
  const [openKey, setOpenKey] = useState<string | null>("q3"); // як на скріні — розкрите «Які служби доставки доступні?»

  return (
    <section style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px 48px" }}>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 600,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Питання й відповіді
      </h1>

      {data.map((item) => (
        <Row
          key={item.key}
          item={item}
          open={openKey === item.key}
          onToggle={() => setOpenKey((k) => (k === item.key ? null : item.key))}
        />
      ))}
    </section>
  );
};

export default FAQ;
