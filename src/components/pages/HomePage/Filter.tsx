import { FC } from "react";
import scss from "./Filter.module.scss";

const Filter: FC = () => {
  return (
    <section className={scss.Filter}>
      <div className="container">
        <div className={scss.inner}>
          {/* Левая часть: заголовок и подпись */}
          <div className={scss.titleBlock}>
            <h2>БРОНИРОВАНИЕ НОМЕРОВ</h2>
            <p>Гарантированная лучшая цена</p>
          </div>

          {/* Правая часть: даты, гости, промокод, кнопка */}
          <div className={scss.filterBlock}>
            {/* Заезд */}
            <div className={scss.item}>
              <div className={scss.label}>Заезд</div>
              <div className={scss.value}>24.03.2025</div>
            </div>
            {/* Выезд */}
            <div className={scss.item}>
              <div className={scss.label}>Выезд</div>
              <div className={scss.value}>25.03.2025</div>
            </div>
            {/* Гости */}
            <div className={scss.item}>
              <div className={scss.label}>Гости</div>
              <div className={scss.value}>2 взрослых, 1 ребёнок</div>
            </div>
            {/* Промокод */}
            <div className={scss.promo}>
              <label>
                <input type="checkbox" />У меня промокод
              </label>
            </div>
            {/* Кнопка */}
            <button className={scss.searchButton}>Найти номер</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Filter;
