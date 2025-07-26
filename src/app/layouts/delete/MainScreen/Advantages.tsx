import React from "react";
import { FaTruck, FaCheckCircle, FaExchangeAlt, FaCertificate } from "react-icons/fa";
import "./advantages.css";

const advantages = [
  { icon: <FaTruck />, label: "ШВИДКА ДОСТАВКА" },
  { icon: <FaCheckCircle />, label: "ПЕРЕВІРЕНА ЯКІСТЬ" },
  { icon: <FaExchangeAlt />, label: "ОБМІН 14 ДНІВ" },
  { icon: <FaCertificate />, label: "СЕРТИФІКОВАНО" },
];

const Advantages: React.FC = () => {
  return (
    <section className="advantages-section">
      <h2 className="advantages-title">Переваги</h2>
      <div className="advantages-grid">
        {advantages.map((item, index) => (
          <div key={index} className="advantage-card">
            <div className="advantage-icon">{item.icon}</div>
            <p className="advantage-label">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Advantages;
