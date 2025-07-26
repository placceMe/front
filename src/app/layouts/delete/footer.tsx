import React from 'react';
import './footer.css';
import { FaInstagram, FaYoutube, FaTelegram } from 'react-icons/fa';
import logo from './logo_light.png'; // путь к светлому логотипу

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-logo-block">
          <img src={logo} alt="NORSEN" className="footer-logo" />
          <p>Інтернет-маркетплейс військового спорядження</p>
          <div className="footer-socials">
            <FaInstagram />
            <FaYoutube />
            <FaTelegram />
          </div>
        </div>

        <div className="footer-columns">
          <div>
            <h4>Каталог</h4>
            <ul>
              <li>Розпродаж</li>
              <li>Кемпінг та виживання</li>
              <li>Аксесуари</li>
              <li>Сумки і рюкзаки</li>
              <li>Бронежилети</li>
              <li>Тактичні окуляри</li>
              <li>Тактичне взуття</li>
              <li>Тактичний одяг</li>
            </ul>
          </div>

          <div>
            <h4>Компанія</h4>
            <ul>
              <li>Про нас</li>
              <li>Доставка та оплата</li>
              <li>Питання та відповіді</li>
            </ul>
          </div>

          <div>
            <h4>Контакти</h4>
            <p>+38 (063) 99-31-70</p>
            <p>norsen@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="footer-line" />

      <div className="footer-bottom">
        <div className="footer-copy">
          <p>NORSEN © {new Date().getFullYear()}</p>
          <p>© 2025 ТОВ “НОРСЕН” код ЄДРПОУ 45623479</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
