import { FC } from "react";
import scss from "./Footer.module.scss";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={scss.Footer}>
      <div className={scss.container}>
        <div className={scss.content}>
          <p className={scss.offer}>Коммерческое предложение</p>
          <p className={scss.copy}>© {currentYear} KHotel</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
