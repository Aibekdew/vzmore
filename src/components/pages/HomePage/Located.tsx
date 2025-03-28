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
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6305.246641058835!2d77.2242258!3d42.6442787!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3884585af7f9f8e3%3A0x5631b2ff9854e139!2z0KHQsNC90LDRgtC-0YDQuNC5ICLQmtGL0YDQs9GL0LfRgdC60L7QtSDQktC30LzQvtGA0YzQtSI!5e1!3m2!1sru!2skg!4v1742964112778!5m2!1sru!2skg"
            width="800"
            height="600"
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
