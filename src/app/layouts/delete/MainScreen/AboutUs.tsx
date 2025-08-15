import React from 'react';
import '../MainScreen/aboutUs.css';
import { FaPlusCircle, FaChevronDown } from 'react-icons/fa';
import AboutImage from "../../../../assets/mainscreen/AboutAs.png";

const AboutUs: React.FC = () => {
  return (
    <section className="about-us">
      <h2 className="about-title">Про нас</h2>

      <div className="about-grid">
        <div className="about-text">
          <ul className="about-list">
            <li>
              <FaPlusCircle className="icon" />
              <span>
                NORSEN — це український мілітарі маркетплейс, створений для тих, хто захищає, підтримує та готується. Ми об'єднуємо найкращих виробників, перевірених постачальників та сучасне спорядження на одній платформі.
              </span>
            </li>
            <li>
              <FaPlusCircle className="icon" />
              <span>
                NORSEN — це не просто магазин. Це місце, де кожен боєць, волонтер чи ентузіаст знайде потрібне спорядження швидко та надійно.
              </span>
            </li>
            <li>
              <FaPlusCircle className="icon" />
              <span>
                Наше завдання — забезпечити передову спорядженням, яке не підведе. Ми ретельно обираємо товари та співпрацюємо лише з тими, хто довів свою якість на практиці.
              </span>
            </li>
            <li>
              <FaPlusCircle className="icon" />
              <span>
                NORSEN працює з офіційними брендами та виробниками з України та світу, аби кожне замовлення було корисним у справі оборони та безпеки.
              </span>
            </li>
            <li>
              <FaPlusCircle className="icon" />
              <span>
                Ми віримо: спорядження — це не просто речі. Це засоби виживання, захисту та перемоги. Тому ми завжди поруч, аби ви мали все необхідне.
              </span>
            </li>
          </ul>

          <button className="about-button">Дізнатись більше</button>
          <button className="about-dropdown-btn">
            Детальніше <FaChevronDown size={12} />
          </button>
        </div>

        <div className="about-image">
          <img src={AboutImage} alt="Надійність" />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
