"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Импорт стилей react-datepicker
import scss from "./Register.module.scss";

const Register: React.FC = () => {
  // Стейты для дат и гостей
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState<number>(2);

  // Обработчик для календаря с selectsRange
  const handleRangeChange = (
    dates: [Date | null, Date | null] | Date | null
  ) => {
    if (Array.isArray(dates)) {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
    } else {
      setStartDate(dates);
    }
  };

  return (
    <section className={scss.BookingPage}>
      {/* Шапка с заголовком */}
      <div className={scss.header}>
        <h1 className={scss.mainTitle}>Бронирование</h1>
        <div className={scss.topControls}>
          {/* Выбор дат */}
          <div className={scss.dateInputs}>
            <div className={scss.inputGroup}>
              <label>Заезд — Выезд</label>
              <div className={scss.pickerRow}>
                {/* Дата заезда */}
                <DatePicker
                  selected={startDate ?? undefined}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate ?? undefined}
                  endDate={endDate ?? undefined}
                  dateFormat="dd MMM"
                  placeholderText="Заезд"
                />
                <span className={scss.dash}>-</span>
                {/* Дата выезда */}
                <DatePicker
                  selected={endDate ?? undefined}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate ?? undefined}
                  endDate={endDate ?? undefined}
                  minDate={startDate ?? undefined}
                  dateFormat="dd MMM"
                  placeholderText="Выезд"
                />
              </div>
            </div>

            {/* Гости */}
            <div className={scss.inputGroup}>
              <label>Гости</label>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Выбор языка и валюты */}
          <div className={scss.languageCurrency}>
            <select aria-label="Выбор языка" defaultValue="ru">
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
            <select aria-label="Выбор валюты" defaultValue="RUB">
              <option value="RUB">RUB</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <button className={scss.loginBtn}>Войти</button>
          </div>
        </div>
      </div>

      {/* Блок "Выберите номер" */}
      <div className={scss.container}>
        <h2 className={scss.title}>Выберите номер</h2>

        {/* Под-блок "Бронируйте выгоднее" */}
        <div className={scss.benefitsRow}>
          <button>Бронируйте выгоднее</button>
          <button>Бесплатное проживание для детей до 7</button>
          <button>Скидка на завтрак</button>
          <div className={scss.bestPrice}>
            Наша лучшая цена <span>5833,74₽</span>
          </div>
        </div>

        {/* Карточка номера */}
        <div className={scss.roomCard}>
          <div className={scss.leftPart}>
            <span className={scss.badge}>Остался 1 номер</span>
            <img src="/room.jpg" alt="Комната" />
          </div>
          <div className={scss.rightPart}>
            <h3>Superior</h3>
            <p className={scss.price}>6&nbsp;806,03&nbsp;₽</p>
            <button className={scss.showOtherBtn}>
              Показать другие доступные номера
            </button>
          </div>
        </div>

        {/* Встроенный календарь */}
        <div className={scss.calendarSection}>
          <DatePicker
            inline
            selectsRange
            startDate={startDate ?? undefined}
            endDate={endDate ?? undefined}
            onChange={handleRangeChange}
          />
        </div>

        {/* Кнопка "Забронировать" */}
        <div className={scss.bookBtnWrapper}>
          <button className={scss.bookBtn}>Забронировать</button>
        </div>
      </div>
    </section>
  );
};

export default Register;
