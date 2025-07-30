import React, { useState, useRef } from "react";
import {
  FaBalanceScale,
  FaHeart,
  FaUser,
  FaShoppingCart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo.png";
import CategoriesDropdown from "../../../widgets/categoriesDropdown"; // проверь путь!
import "./headerMain.css";
import { useAppSelector } from "@store/hooks";
import { LoginForm } from "@features/auth/LoginForm ";
import { Modal } from "antd";
import { AuthTabs } from "..//..//../widgets/AuthTabs";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const user = useAppSelector(state => state.user.user);
const [isModalOpen, setIsModalOpen] = useState(false);

const handleUserClick = () => {
  if (user?.id) {
    navigate('/profile');
  } else {
    setIsModalOpen(true);
  }
};


  return (
    <header className="header">
      {/* Top Row: Navigation */}
      <div className="header-top">
        <div className="logo">
          <img src={Logo} alt="NORSEN Logo" />
        </div>
        <nav className="nav-links">
          <a href="#">Доставка та оплата</a>
          <a href="#">Про нас</a>
          <a href="#">Питання й відповіді</a>
        </nav>
        <div className="lang-login">
          <div className="contact">
            <p>+38 (063) 391-31-70</p>
          </div>
          <button className="manager-button">Зв'язатись з менеджером</button>
          <button className="lang-button">UA/UA</button>
          <button className="login-button">$UAN</button>
        </div>
      </div>

      {/* Bottom Row: Logo, Search, Icons */}
      <div className="header-bottom">
        <div className="header-center relative">
          <div
            className="relative inline-block"
        >
             <button
            className="category-button flex items-center gap-2 bg-yellow-700 text-white px-4 py-2 rounded-md"
            type="button"
            onClick={() => setShowCategories(v => !v)}
          >
            ☰ Категорії
          </button>
          <CategoriesDropdown
            isOpen={showCategories}
            onClose={() => setShowCategories(false)}
          />
        </div>
          <input
            type="text"
            placeholder="Пошук"
            className="search-input"
          />
        </div>

        <div className="header-right">
          <div className="icons flex gap-4 items-center">
            {/*<FaBalanceScale />*/}
           <FaHeart onClick={() => navigate('/Wishlist')} className="cursor-pointer" />
           <button
  onClick={handleUserClick}
  className="hover:text-[#5a6b3b] focus:outline-none"
  title="Особистий кабінет"
>
  <FaUser />
</button>

            <button
              onClick={() => navigate('/cart')}
              className="hover:text-[#5a6b3b] focus:outline-none"
              title="Кошик"
            >
              <FaShoppingCart />
            </button>

          <Modal
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  footer={null}
  destroyOnHidden
>
  <AuthTabs onSuccess={() => setIsModalOpen(false)}/>
</Modal>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
