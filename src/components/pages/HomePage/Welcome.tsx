import { FC } from "react";
import scss from "./Welcome.module.scss";

const Welcome: FC = () => {
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
        <h1>"Кыргыз деңизи" санаториясы</h1>
        <p>Ресторан | Wi-Fi | Парковка</p>
        <button>Бронировать сейчас</button>
      </div>
    </section>
  );
};

export default Welcome;
