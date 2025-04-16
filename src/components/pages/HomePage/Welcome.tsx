"use client";
import { FC } from "react";
import scss from "./Welcome.module.scss";

const Welcome: FC = () => {
  // Scroll to the Filter component using its id "filter"
  const scrollToFilter = () => {
    const filterElement = document.getElementById("filter");
    if (filterElement) {
      filterElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={scss.Welcome}>
      <video
        className={scss.bgVideo}
        src="./file.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      {/* Затемняющий слой поверх видео */}
      <div className={scss.overlay}></div>

      <div className={scss.container}>
        <h1>Санаторий Кыргызское Взморье</h1>
        <p>Ресторан | Wi-Fi | Парковка</p>
        {/* Replace Link with a button that triggers the scroll */}
        <button onClick={scrollToFilter}>Бронировать сейчас</button>
      </div>
    </section>
  );
};

export default Welcome;
