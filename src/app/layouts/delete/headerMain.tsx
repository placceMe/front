import React, { useState } from "react";
import { FaHeart, FaUser, FaBalanceScale } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo.png";
import CategoriesDropdown from "../../../widgets/categoriesDropdown"; // проверь путь!
import "./headerMain.css";
import { useAppSelector } from "@store/hooks";
import { Modal } from "antd";
import { AuthTabs } from "..//..//../widgets/AuthTabs";
import { CartIcon } from "@features/cart/ui/CartIcon";
import { SearchBox } from "@features/searchProducts/ui/SearchBox";
import { CurrencySwitcher } from "@features/currencySwitcher/ui/CurrencySwitcher";


const Header: React.FC = () => {
  const navigate = useNavigate();
  const [showDesktopCategories, setShowDesktopCategories] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  //  const [searchTerm, setSearchTerm] = useState('');
  const user = useAppSelector((state) => state.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserClick = () => {
    if (user?.id) {
      navigate("/profile");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-top">
          <NavLink to="/" className="logo">
            <img src={Logo} alt="Logo" className="logo-image" />
          </NavLink>
          <nav className="nav-links">
            <NavLink to="/delivery" className="nav-link">Доставка та оплата</NavLink>
            <NavLink to="/aboutus" className="nav-link"> Про нас</NavLink>
            <NavLink to="/faq" className="nav-link">Питання й відповіді</NavLink>
          {/**   <NavLink to="/pay-test" className="nav-link"> PaymentTset</NavLink>
            */}
          </nav>
          <div className="lang-login">
            <div className="contact">
              <p>+38 (063) 391-31-70</p>
            </div>
            <button className="manager-button">Зв'язатись з менеджером</button>
            {/** <button className="lang-button">UA/UA</button>*/}
         
<div className="login-button">
  <CurrencySwitcher />
</div>

          </div>
        </div>

        <div className="header-bottom">
          {/* Логотип для мобильной версии */}
          <NavLink to="/" className="logo mobile-logo">
            <img src={Logo} alt="Logo" className="logo-image" />
          </NavLink>

          <div className="header-center relative">
            <div className="relative inline-block">
              <button
                className="category-button flex items-center gap-2 bg-yellow-700 text-white px-4 py-2 rounded-md"
                type="button"
                onClick={() => setShowDesktopCategories((v) => !v)}
              >
                ☰ Категорії
              </button>
              <CategoriesDropdown
                isOpen={showDesktopCategories}
                onClose={() => setShowDesktopCategories(false)}
              />
            </div>
            <SearchBox className="search-input" debounceMs={300} minLen={2} />
          </div>

          <div className="header-right">
            {/* Кнопка категорий только для мобильных */}
            <div className="relative inline-block mobile-categories">
              <button
                className="category-button flex items-center gap-2"
                type="button"
                onClick={() => setShowMobileCategories((v) => !v)}
              >
                ☰
              </button>
              <CategoriesDropdown
                isOpen={showMobileCategories}
                onClose={() => setShowMobileCategories(false)}
              />
            </div>

            {/* Иконки для десктопа */}
            <div className="icons flex gap-4 items-center">
              <FaBalanceScale
                onClick={() => navigate("/comparison")}
                className="cursor-pointer"
              />
              <FaHeart
                onClick={() => navigate("/Wishlist")}
                className="cursor-pointer"
              />
              <button
                onClick={handleUserClick}
                className="hover:text-[#5a6b3b] focus:outline-none"
                title="Особистий кабінет"
              >
                <FaUser />
              </button>

              <button
                onClick={() => navigate("/cart")}
                className="hover:text-[#5a6b3b] focus:outline-none"
                title="Кошик"
              >
                <CartIcon />
              </button>
            </div>
          </div>
        </div>

        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          destroyOnHidden
          centered
          width="auto"
          styles={{
            mask: {
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            },
            wrapper: {
              backgroundColor: "transparent",
            },
            content: {
              backgroundColor: "transparent",
              boxShadow: "none",
              padding: 0,
            },
          }}
        >
          <AuthTabs onSuccess={() => setIsModalOpen(false)} />
        </Modal>
      </header>

      {/* Sticky Bottom Bar для мобильных */}
      <div className="sticky-bottom-bar">
        {/** <div className="sticky-bottom-item" onClick={() => navigate('/compare')}>
          <FaBalanceScale />
          <span>Порівняти</span>
        </div>
         */}
        <div
          className="sticky-bottom-item"
          onClick={() => navigate("/Wishlist")}
        >
          <FaHeart />
          <span>Збережене</span>
        </div>

        <div className="sticky-bottom-item" onClick={handleUserClick}>
          <FaUser />
          <span>Профіль</span>
        </div>

        <div className="sticky-bottom-item" onClick={() => navigate("/cart")}>
          <CartIcon />
          <span>Кошик</span>
        </div>
      </div>
    </>
  );
};

export default Header;
