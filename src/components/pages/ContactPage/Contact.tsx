"use client";
import { FC } from "react";
import scss from "./Contact.module.scss";

const Contact: FC = () => {
  return (
    <section className={scss.Contact}>
      <div className="container">
        <div className={scss.contactInner}>
          {/* Левая часть */}
          <div className={scss.left}>
            <h2 className={scss.title}>
              Контакты Санаторий Кыргызское Взморье
            </h2>
            <p className={scss.description}>
              Если у вас есть вопросы, мы всегда готовы Вам помочь. Напишите нам
              в WhatsApp или позвоните по указанному номеру телефона.
            </p>
          </div>

          {/* Правая часть (карточка) */}
          <div className={scss.right}>
            <p className={scss.address}>
              Южная Магистраль, проспект Асанбая Масалиева 23 <br />
              Кыргызстан, Бишкек, Ленинский район, 720008 <br />
              <a href="mailto:vzmore@gmail.com" className={scss.email}>
                vzmore@gmail.com
              </a>
            </p>

            <a href="tel:+996707650333" className={scss.phone}>
              +996 707 650 333
            </a>
          </div>
        </div>
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

export default Contact;
