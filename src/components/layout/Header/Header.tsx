import { FC, useState } from "react";
import scss from "./Header.module.scss";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Header: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={scss.Header}>
      <div className={scss.container}>
        {/* ЛОГОТИП */}
        <div className={scss.logo}>
          <img src="./logo.png" alt="logo" />
        </div>

        <div className={scss.block}>
          {/* БУРГЕР (мобильный) */}
          <div
            className={`${scss.burger} ${menuOpen ? scss.open : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          {/* НАВИГАЦИЯ (общая для десктопа и мобильного) */}
          <nav className={`${scss.nav} ${menuOpen ? scss.open : ""}`}>
            <ul>
              <li>Главная</li>
              <li className={scss.language}>
                Номера
                <span className={scss.arrow}></span>
                <div className={scss.dropdown}>
                  <h3>Deluxe</h3>
                  <h3>Superior</h3>
                  <h3>Standard double</h3>
                  <h3>Standard single</h3>
                </div>
              </li>
              <li>Ресторан</li>
              <li>Что рядом</li>
              <li>Контакты</li>
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

          {/* СОЦИАЛЬНЫЕ ИКОНКИ */}
          <div className={scss.social}>
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
