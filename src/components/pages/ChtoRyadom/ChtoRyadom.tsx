"use client";
import { FC } from "react";
import scss from "./ChtoRyadom.module.scss";

const ChtoRyadom: FC = () => {
  return (
    <section className={scss.ChtoRyadom}>
      <div className={scss.content}>
        <h2 className={scss.title}>Что рядом с K Hotel</h2>
        <p className={scss.subtitle}>
          В шаговой доступности от K Hotel находятся все необходимые для
          инфраструктуры места:
        </p>
        <ul className={scss.list}>
          <li>Посольство Соединённых Штатов Америки</li>
          <li>Посольство Италии</li>
          <li>Представительство правительства Кыргызской Республики</li>
          <li>Manas University (Community)</li>
          <li>ТЦ «Ала-Арча»</li>
          <li>Средняя медицинская школа «Doctor Saba»</li>
          <li>Ипмарк Park</li>
          <li>Международная клиника «Эльдорадо»</li>
          <li>и многое другое</li>
        </ul>
        <p className={scss.mapInfo}>
          Более детально можно посмотреть на карте:
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

export default ChtoRyadom;
