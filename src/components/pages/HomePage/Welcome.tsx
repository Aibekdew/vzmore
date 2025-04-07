import { FC } from "react";
import scss from "./Welcome.module.scss";
import Link from "next/link";

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
        <h1>Санаторий Кыргызское Взморье</h1>
        <p>Ресторан | Wi-Fi | Парковка</p>
        <Link href={"/booking"}>
          <button>Бронировать сейчас</button>
        </Link>
      </div>
    </section>
  );
};

export default Welcome;
