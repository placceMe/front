import React from 'react';
import './footer.css';
import { FaInstagram, FaYoutube, FaTelegram } from 'react-icons/fa';
import logo from './logo_light.png'; // путь к светлому логотипу
import { useAppSelector } from '@store/hooks';
import { NavLink } from 'react-router-dom';


const Footer: React.FC = () => {

  const categories = useAppSelector(state => state.categories.active);

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
              {Array.isArray(categories) && categories.map(cat => (
    <li key={cat.id}>
      <NavLink to={`/category/${cat.id}`} className="nav-link">
        {cat.name}
      </NavLink>
    </li>
  ))}
            </ul>
          </div>

          <div>
            <h4>Компанія</h4>
            <ul>
              <li>
                <NavLink to="/aboutus" className="nav-link"> Про нас</NavLink>
              </li>
              <li><NavLink to="/delivery" className="nav-link">Доставка та оплата</NavLink></li>
              <li><NavLink to="/faq" className="nav-link">Питання й відповіді</NavLink></li>
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

        </div>
      </div>
    </footer>
  );
};

export default Footer;
