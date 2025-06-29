import React from "react";
import "./protocols.css";

const protocols = [
  {
    title: "Перевірка матеріалів:",
    text: "на міцність, зносостійкість, водонепроникність",
  },
  {
    title: "Тестування у польових умовах:",
    text: "під час навчань та бойових чергувань",
  },
  {
    title: "Сертифікація від виробників:",
    text: "підтвердження відповідності стандартам",
  },
  {
    title: "Технологічне вдосконалення:",
    text: "оновлення протоколів випробувань з урахуванням нових технологій",
  },
];

const Protocols: React.FC = () => {
  return (
    <section className="protocols-section">
      <h2 className="protocols-title">Протоколи випробувань</h2>
      <p className="protocols-description">
        Усі товари на NORSEN проходять перевірку за стандартами якості та надійності. Ми співпрацюємо з незалежними експертами та підрозділами,
        щоб кожен елемент екіпіровки відповідав бойовим вимогам. Наші протоколи тестування включають:
      </p>
      <div className="protocols-grid">
        {protocols.map((item, index) => (
          <div className="protocol-card" key={index}>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Protocols;
