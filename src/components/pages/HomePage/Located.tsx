"use client";
import { FC } from "react";
import scss from "./Located.module.scss";

const Located: FC = () => {
  return (
    <section className={scss.Located}>
      <div className={scss.container}>
        <h2 className={scss.title}>Мы находимся</h2>

        <p className={scss.address}>
          Южная магистраль, проспект Абсамия Малдыбаева 29
          <br />
          Кыргызстан, Бишкек, Ленинский район, 720038
          <br />
          <a href="mailto:kishotel@gmail.com">kishotel@gmail.com</a>
          <br />
          +996 700 995 565 / +996 555 123 456
        </p>

        <div className={scss.mapWrapper}>
          {/* Замените src на ваш реальный Google Maps Embed URL */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2923.578925420541!2d74.60061367692485!3d42.82930257128627!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x389ec86a38a72fc3%3A0x63f7bd1367ae35d4!2sBishkek%20Hotel!5e0!3m2!1sru!2skg!4v1689900000000!5m2!1sru!2skg"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Located;
