import { FC, useState } from "react";
import Link from "next/link";
import scss from "./Header.module.scss";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Header: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Переключение состояния меню
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Закрыть меню при клике на любой пункт
  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className={scss.Header}>
      <div className={scss.container}>
        {/* Логотип */}
        <div className={scss.logo}>
          <Link href={"/"}>
            {" "}
            <img src="/logo.png" alt="logo" />
          </Link>
        </div>

        <div className={scss.block}>
          {/* Бургер */}
          <div
            className={`${scss.burger} ${menuOpen ? scss.open : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* Навигация */}
          <nav className={`${scss.nav} ${menuOpen ? scss.open : ""}`}>
            <ul>
              <li onClick={handleMenuItemClick}>
                <Link href="/">Главная</Link>
              </li>

              <li className={scss.language}>
                <Link href="/" onClick={handleMenuItemClick}>
                  Номера
                </Link>
                <span className={scss.arrow}></span>
                <div className={scss.dropdown}>
                  <h3 onClick={handleMenuItemClick}>
                    <Link href="/">Deluxe</Link>
                  </h3>
                  <h3 onClick={handleMenuItemClick}>
                    <Link href="/">Superior</Link>
                  </h3>
                  <h3 onClick={handleMenuItemClick}>
                    <Link href="/">Standard double</Link>
                  </h3>
                  <h3 onClick={handleMenuItemClick}>
                    <Link href="/">Standard single</Link>
                  </h3>
                </div>
              </li>

              <li onClick={handleMenuItemClick}>
                <Link href="/">Ресторан</Link>
              </li>
              <li onClick={handleMenuItemClick}>
                <Link href="/chto-ryadom">Что рядом</Link>
              </li>
              <li onClick={handleMenuItemClick}>
                <Link href="/contacts">Контакты</Link>
              </li>

              <li className={scss.language}>
                Русский
                <span className={scss.arrow}></span>
                <div className={scss.dropdown}>
                  <h3>Русский</h3>
                  <h3>English</h3>
                  <h3>Kyrgyz</h3>
                </div>
              </li>
            </ul>
          </nav>

          {/* Социалки */}
          <div className={scss.social}>
            <a href="https://www.facebook.com/vzmore.kg/">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/vzmore.kg/">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      {/* Задний полупрозрачный фон для мобильного меню, который закрывает меню при клике */}
      {menuOpen && (
        <div className={scss.backdrop} onClick={handleMenuItemClick}></div>
      )}
    </header>
  );
};

export default Header;
