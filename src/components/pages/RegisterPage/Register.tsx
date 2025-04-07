"use client";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import scss from "./Register.module.scss";
import { FaCalendarAlt } from "react-icons/fa";

// Тип для одного номера
interface IRoom {
  adults: number; // количество взрослых
  childrenAges: string[]; // массив строк, где каждая строка — выбранный возраст ребёнка
}

// Список языков (пример)
const LANGUAGES = [
  { code: "ruRU", short: "RU", label: "Русский", flag: "/flags/russia.png" },
  { code: "enUS", short: "EN", label: "English US", flag: "/flags/en_us.png" },
  { code: "deDE", short: "DE", label: "Deutsch", flag: "/flags/de.png" },
];

// Список вариантов возраста (первый элемент "" будет отображаться как "+ Добавить детей")
const CHILD_AGE_OPTIONS = [
  "",
  "Ребёнок 1 год",
  "Ребёнок 2 года",
  "Ребёнок 3 года",
  "Ребёнок 4 года",
  "Ребёнок 5 лет",
  "Ребёнок 6 лет",
  "Ребёнок 7 лет",
  "Ребёнок 8 лет",
  "Ребёнок 9 лет",
  "Ребёнок 10 лет",
  "Ребёнок 11 лет",
];

const Register: React.FC = () => {
  // Текущая дата (для "сегодня")
  const today = new Date();

  // Даты заезда/выезда
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Модалки (даты / язык)
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Язык
  const defaultLang = LANGUAGES.find((l) => l.code === "ruRU") || LANGUAGES[0];
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLang);

  // Список номеров (по умолчанию 1 номер, в котором 2 взрослых, 1 пустая строка для детей)
  const [rooms, setRooms] = useState<IRoom[]>([
    { adults: 2, childrenAges: [""] }, // хотя бы одна пустая строка, чтобы отобразился селект "+ Добавить детей"
  ]);

  // Пример: показать «результаты поиска»
  const [showSearchResult, setShowSearchResult] = useState(false);

  // ======= Работа с датами =======
  const openDateModal = () => setIsDateModalOpen(true);
  const closeDateModal = () => setIsDateModalOpen(false);

  const handleRangeChange = (
    dates: [Date | null, Date | null] | Date | null
  ) => {
    if (Array.isArray(dates)) {
      const [start, end] = dates;
      if (start) setStartDate(start);
      if (end) setEndDate(end);
    }
  };

  const handleConfirmDates = () => {
    closeDateModal();
  };

  // ======= Модалка языка =======
  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);

  const handleSelectLanguage = (lang: (typeof LANGUAGES)[0]) => {
    setSelectedLanguage(lang);
    closeLanguageModal();
  };

  // ======= Логика номеров =======
  // Добавить новый номер
  const handleAddRoom = () => {
    setRooms((prev) => [...prev, { adults: 2, childrenAges: [""] }]);
  };

  // Удалить номер
  const handleRemoveRoom = (roomIndex: number) => {
    setRooms((prev) => prev.filter((_, i) => i !== roomIndex));
  };

  // Изменить количество взрослых
  const handleChangeAdults = (value: number, roomIndex: number) => {
    setRooms((prev) => {
      const newRooms = [...prev];
      const room = newRooms[roomIndex];
      // считаем, сколько уже детей
      const realChildren = room.childrenAges.filter((age) => age !== "").length;
      // Если новая сумма не превышает 5, просто ставим
      if (value + realChildren <= 5) {
        room.adults = value;
      } else {
        // иначе обрежем детей
        const allowed = 5 - value;
        const onlyReal = room.childrenAges.filter((age) => age !== "");
        const cut = onlyReal.slice(0, allowed);
        room.childrenAges = [...cut]; // оставляем только нужное кол-во
        // Если все дети обрезаны, оставляем одну пустую строку
        if (cut.length === 0) {
          room.childrenAges.push("");
        }
        room.adults = value;
      }
      newRooms[roomIndex] = room;
      return newRooms;
    });
  };

  // Когда пользователь изменил (или выбрал) возраст в селекте для ребёнка
  const handleChildAgeChange = (
    newAge: string,
    roomIndex: number,
    childIndex: number
  ) => {
    setRooms((prev) => {
      const newRooms = [...prev];
      const room = newRooms[roomIndex];
      const oldValue = room.childrenAges[childIndex];

      // Присваиваем новое значение
      room.childrenAges[childIndex] = newAge;

      // Считаем реальных детей
      const realChildren = room.childrenAges.filter((age) => age !== "").length;
      // Проверяем лимит
      if (room.adults + realChildren > 5) {
        // откатываем
        room.childrenAges[childIndex] = oldValue;
      } else {
        // Если выбрали реальный возраст (не ""), а это последняя строка => добавляем ещё одну пустую
        if (newAge !== "") {
          if (childIndex === room.childrenAges.length - 1) {
            // проверим, не достигли ли 5
            if (room.adults + realChildren < 5) {
              room.childrenAges.push("");
            }
          }
        }
        // Если выбрали "", и это не последний, ничего не делаем
      }
      newRooms[roomIndex] = room;
      return newRooms;
    });
  };

  // Удалить конкретного ребёнка
  const handleRemoveChild = (roomIndex: number, childIndex: number) => {
    setRooms((prev) => {
      const newRooms = [...prev];
      const room = newRooms[roomIndex];
      room.childrenAges.splice(childIndex, 1);
      // Если теперь нет детей вообще, добавим одну пустую строку
      const realChildren = room.childrenAges.filter((age) => age !== "").length;
      if (realChildren === 0) {
        room.childrenAges = [""];
      }
      newRooms[roomIndex] = room;
      return newRooms;
    });
  };

  // ======= Кнопка "Найти" =======
  const handleSearch = () => {
    setShowSearchResult(true);
  };

  // Формат даты
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ======= Модалки (Date / Language) =======
  const DateModal = () =>
    ReactDOM.createPortal(
      <div className={scss.modalOverlay}>
        <div className={scss.modalContent}>
          <div className={scss.modalHeader}>
            <h3>Выберите даты заезда и выезда</h3>
            <button className={scss.closeBtn} onClick={closeDateModal}>
              ✕
            </button>
          </div>
          <DatePicker
            inline
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={handleRangeChange}
            monthsShown={2}
          />
          <div className={scss.modalActions}>
            <button onClick={handleConfirmDates}>Применить</button>
            <button onClick={closeDateModal}>Отмена</button>
          </div>
        </div>
      </div>,
      document.body
    );

  const LanguageModal = () =>
    ReactDOM.createPortal(
      <div className={scss.modalOverlay}>
        <div className={scss.modalContent} style={{ maxWidth: "400px" }}>
          <div className={scss.modalHeader}>
            <h3>Выберите язык</h3>
            <button className={scss.closeBtn} onClick={closeLanguageModal}>
              ✕
            </button>
          </div>
          <div className={scss.langListWrapper}>
            {LANGUAGES.map((lang) => (
              <div
                key={lang.code}
                className={scss.langItem}
                onClick={() => handleSelectLanguage(lang)}
              >
                <img src={lang.flag} alt={lang.label} width={24} />
                <span>{lang.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <section className={scss.BookingPage}>
      {/* Шапка (заголовок + язык/валюта) */}
      <div className={scss.headerRow}>
        <h1 className={scss.pageTitle}>Бронирование</h1>
        <div className={scss.langCurrencyBox}>
          <div className={scss.selectedLang} onClick={openLanguageModal}>
            <img
              src={selectedLanguage.flag}
              alt={selectedLanguage.label}
              width={32}
              height={20}
            />
            <span className={scss.selectedLangCode}>
              {selectedLanguage.short}
            </span>
          </div>
          <div className={scss.selectedCurrency}>KGS</div>
        </div>
      </div>

      {/* Разделитель */}
      <div className={scss.separator} />

      {/* Подзаголовок */}
      <p className={scss.topSubtitle}>
        Выберите даты заезда, выезда и количество гостей
      </p>

      {/* Два инпута: Дата заезда / Дата выезда */}
      <div className={scss.dateRow}>
        <div className={scss.formGroup}>
          <label>Дата заезда</label>
          <div className={scss.inputWrapper} onClick={openDateModal}>
            <FaCalendarAlt className={scss.icon} />
            <span>{formatDate(startDate) || "Выбрать дату"}</span>
          </div>
        </div>
        <div className={scss.formGroup}>
          <label>Дата выезда</label>
          <div className={scss.inputWrapper} onClick={openDateModal}>
            <FaCalendarAlt className={scss.icon} />
            <span>{formatDate(endDate) || "Выбрать дату"}</span>
          </div>
        </div>
      </div>

      <h2 className={scss.roomsTitle}>Размещение в номерах</h2>
      <p className={scss.roomsSubtitle}>Взрослые от 13 лет и старше</p>

      {/* Список номеров */}
      <div className={scss.roomsContainer}>
        {rooms.map((room, roomIndex) => (
          <div key={roomIndex} className={scss.roomBlock}>
            <div className={scss.roomHeader}>
              <span className={scss.roomName}>Номер {roomIndex + 1}</span>
              {rooms.length > 1 && (
                <button
                  className={scss.removeRoomBtn}
                  onClick={() => handleRemoveRoom(roomIndex)}
                >
                  Удалить номер
                </button>
              )}
            </div>

            {/* Выбор взрослых + динамические селекты для детей */}
            <div className={scss.roomRow}>
              {/* Взрослые */}
              <div className={scss.formGroup}>
                <label>Взрослые</label>
                <select
                  className={scss.adultSelect}
                  value={room.adults}
                  onChange={(e) =>
                    handleChangeAdults(Number(e.target.value), roomIndex)
                  }
                >
                  <option value={1}>1 взрослый</option>
                  <option value={2}>2 взрослых</option>
                  <option value={3}>3 взрослых</option>
                  <option value={4}>4 взрослых</option>
                  <option value={5}>5 взрослых</option>
                </select>
              </div>
            </div>

            {/* Список детей (каждая строка — селект) */}
            {room.childrenAges.map((childAge, childIndex) => (
              <div className={scss.roomRow} key={childIndex}>
                <div className={scss.formGroup}>
                  <label style={{ visibility: "hidden" }}>Дети</label>
                  <select
                    className={scss.addChildSelect}
                    value={childAge}
                    onChange={(e) =>
                      handleChildAgeChange(
                        e.target.value,
                        roomIndex,
                        childIndex
                      )
                    }
                  >
                    {CHILD_AGE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === "" ? "+ Добавить детей" : opt}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Кнопка "×", если возраст выбран (childAge !== "") */}
                {childAge !== "" && (
                  <button
                    className={scss.childRemoveBtn}
                    onClick={() => handleRemoveChild(roomIndex, childIndex)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={scss.addRoomLine}>
        <button onClick={handleAddRoom}>Нужен ещё 1 номер +</button>
      </div>

      <div className={scss.searchBtnWrapper}>
        <button className={scss.searchBtn} onClick={handleSearch}>
          Найти
        </button>
      </div>

      {/* Пример результата поиска */}
      {showSearchResult && (
        <div className={scss.searchResult}>
          <h2>Выберите номер</h2>
          <div className={scss.alertBox}>
            На {formatDate(startDate)} – {formatDate(endDate)} номер «Superior»
            недоступен
          </div>
          <p>Вы можете выбрать другой номер или изменить даты проживания.</p>
        </div>
      )}

      {/* Модалки (даты / язык) */}
      {isDateModalOpen && <DateModal />}
      {isLanguageModalOpen && <LanguageModal />}
    </section>
  );
};

export default Register;
