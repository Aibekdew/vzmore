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
  childrenAges: string[]; // массив строк (возрасты детей)
}

// Список языков (пример)
const LANGUAGES = [
  { code: "ruRU", short: "RU", label: "Русский", flag: "/flags/russia.png" },
  { code: "enUS", short: "EN", label: "English US", flag: "/flags/en_us.png" },
  { code: "deDE", short: "DE", label: "Deutsch", flag: "/flags/de.png" },
];

// Список вариантов возраста (первый элемент "" => "+ Добавить детей")
const CHILD_AGE_OPTIONS = [
  "",
  "Ребёнок до 1 года",
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

  // Даты заезда/выезда (храним в стейте)
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Состояние модалок (даты и язык)
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Язык (по умолчанию — русский)
  const defaultLang = LANGUAGES.find((l) => l.code === "ruRU") || LANGUAGES[0];
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLang);

  // Список номеров (по умолчанию 1 номер, 2 взрослых, 1 пустая строка для детей)
  const [rooms, setRooms] = useState<IRoom[]>([
    { adults: 2, childrenAges: [""] },
  ]);

  // Пример: показать «результаты поиска»
  const [showSearchResult, setShowSearchResult] = useState(false);

  // ======= Работа с датами (DatePicker) =======
  const openDateModal = () => setIsDateModalOpen(true);
  const closeDateModal = () => setIsDateModalOpen(false);

  const handleRangeChange = (
    dates: [Date | null, Date | null] | Date | null
  ) => {
    // При выборе диапазона из DatePicker
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
      const realChildren = room.childrenAges.filter((age) => age !== "").length;
      // Если сумма (взрослые + дети) <= 5, то ок
      if (value + realChildren <= 5) {
        room.adults = value;
      } else {
        // Иначе обрезаем детей
        const allowed = 5 - value;
        const onlyReal = room.childrenAges.filter((age) => age !== "");
        const cut = onlyReal.slice(0, allowed);
        room.childrenAges = [...cut];
        if (cut.length === 0) {
          room.childrenAges.push("");
        }
        room.adults = value;
      }
      newRooms[roomIndex] = room;
      return newRooms;
    });
  };

  // Выбор возраста ребёнка
  const handleChildAgeChange = (
    newAge: string,
    roomIndex: number,
    childIndex: number
  ) => {
    setRooms((prev) => {
      const newRooms = [...prev];
      const room = newRooms[roomIndex];
      const oldValue = room.childrenAges[childIndex];
      room.childrenAges[childIndex] = newAge;
      const realChildren = room.childrenAges.filter((age) => age !== "").length;
      if (room.adults + realChildren > 5) {
        // откатываем
        room.childrenAges[childIndex] = oldValue;
      } else {
        // Если выбрали реальный возраст (не ""), а это последний селект — добавляем новый
        if (newAge !== "" && childIndex === room.childrenAges.length - 1) {
          if (room.adults + realChildren < 5) {
            room.childrenAges.push("");
          }
        }
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

  // ======= Модальное окно (Date) =======
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
          {/* DatePicker с выбором диапазона (selectsRange) */}
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

  // ======= Модалка выбора языка =======
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
      {/* Шапка: заголовок + язык/валюта */}
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

      {/* Подзаголовок */}
      <p className={scss.topSubtitle}>
        Выберите даты заезда, выезда и количество гостей
      </p>

      {/* === Два верхних инпута (Дата заезда / Дата выезда) === */}
      <div className={scss.dateRow}>
        {/* Дата заезда */}
        <div className={scss.formGroup}>
          <label>Дата заезда</label>
          <div className={scss.inputWrapper} onClick={openDateModal}>
            <FaCalendarAlt className={scss.icon} />
            <span>{formatDate(startDate) || "Выбрать дату"}</span>
          </div>
        </div>

        {/* Дата выезда */}
        <div className={scss.formGroup}>
          <label>Дата выезда</label>
          <div className={scss.inputWrapper} onClick={openDateModal}>
            <FaCalendarAlt className={scss.icon} />
            <span>{formatDate(endDate) || "Выбрать дату"}</span>
          </div>
        </div>
      </div>

      {/* Размещение */}
      <div className={scss.roomSection}>
        <h2 className={scss.roomsTitle}>Размещение в номере</h2>
        <p className={scss.roomsSubtitle}>Взрослые от 13 лет и старше</p>

        {rooms.map((room, roomIndex) => (
          <div key={roomIndex} className={scss.roomBlock}>
            {/* Если несколько номеров, отрисуем заголовок и кнопку удаления */}
            {rooms.length > 1 && (
              <div className={scss.roomHeader}>
                <span className={scss.roomName}>Номер {roomIndex + 1}</span>
                <button
                  className={scss.removeRoomBtn}
                  onClick={() => handleRemoveRoom(roomIndex)}
                >
                  Удалить номер
                </button>
              </div>
            )}

            {/* Взрослые */}
            <div className={scss.roomRow}>
              <div className={scss.formGroup}>
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

              {/* Дети (бирки) */}
              <div className={scss.childrenTags}>
                {room.childrenAges
                  .map((childAge, childIndex) => ({
                    age: childAge,
                    childIndex,
                  }))
                  .filter((c) => c.age !== "") // показываем только выбранных детей
                  .map(({ age, childIndex }) => (
                    <div key={childIndex} className={scss.childTag}>
                      <span>{age}</span>
                      <button
                        onClick={() => handleRemoveChild(roomIndex, childIndex)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>

              {/* Пустые селекты (для добавления новых детей) */}
              {room.childrenAges
                .map((childAge, childIndex) => ({
                  age: childAge,
                  childIndex,
                }))
                .filter((c) => c.age === "")
                .map(({ childIndex }) => (
                  <select
                    key={childIndex}
                    className={scss.addChildSelect}
                    value={""}
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
                        {opt === "" ? "Добавить детей" : opt}
                      </option>
                    ))}
                  </select>
                ))}
            </div>
          </div>
        ))}

        <button className={scss.addRoomBtn} onClick={handleAddRoom}>
          Нужен ещё 1 номер +
        </button>
      </div>

      {/* Кнопка "Найти" */}
      <div className={scss.searchBtnWrapper}>
        <button className={scss.searchBtn} onClick={handleSearch}>
          Найти
        </button>
      </div>

      {/* Пример результатов поиска */}
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

      {/* Модалки (Даты / Язык) */}
      {isDateModalOpen && <DateModal />}
      {isLanguageModalOpen && <LanguageModal />}
    </section>
  );
};

export default Register;
