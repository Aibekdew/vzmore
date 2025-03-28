"use client";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import scss from "./Register.module.scss";

// Тип для номера (взрослые + массив возрастов детей)
interface IRoom {
  adults: number;
  childrenAges: string[]; // например: ["Ребёнок 1 год", "Ребёнок 2 года"]
}

// Список языков (пример)
const LANGUAGES = [
  { code: "ruRU", short: "RU", label: "Русский", flag: "/flags/russia.png" },
  { code: "enUS", short: "EN", label: "English US", flag: "/flags/en_us.png" },
  { code: "deDE", short: "DE", label: "Deutsch", flag: "/flags/de.png" },
];

// Пример возрастов детей
const CHILD_AGE_OPTIONS = [
  "Ребёнок до 1 года",
  "Ребёнок 1 год",
  "Ребёнок 2 года",
  "Ребёнок 3 года",
  "Ребёнок 4 года",
  "Ребёнок 5 лет",
];

const Register: React.FC = () => {
  // Текущая дата (для "сегодня")
  const today = new Date();

  // Даты заезда/выезда
  const [startDate, setStartDate] = useState<Date>(today);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Модалки (даты и язык)
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Язык по умолчанию
  const defaultLang = LANGUAGES.find((l) => l.code === "ruRU") || LANGUAGES[0];
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLang);

  // Список номеров (по умолчанию 1 номер: 2 взрослых, 0 детей)
  const [rooms, setRooms] = useState<IRoom[]>([
    { adults: 2, childrenAges: [] },
  ]);

  // Пример: показать «результаты поиска»
  const [showSearchResult, setShowSearchResult] = useState(false);

  // ==================== Логика дат ====================
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

  // ==================== Модалка языка ====================
  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);

  const handleSelectLanguage = (lang: (typeof LANGUAGES)[0]) => {
    setSelectedLanguage(lang);
    closeLanguageModal();
  };

  // ==================== Логика номеров ====================
  // Добавить номер
  const handleAddRoom = () => {
    setRooms((prev) => [...prev, { adults: 2, childrenAges: [] }]);
  };

  // Удалить номер
  const handleRemoveRoom = (roomIndex: number) => {
    setRooms((prev) => prev.filter((_, i) => i !== roomIndex));
  };

  // Изменить кол-во взрослых
  const handleChangeAdults = (value: number, roomIndex: number) => {
    setRooms((prev) => {
      const newRooms = [...prev];
      const currentRoom = newRooms[roomIndex];
      // Проверяем, чтобы не больше 5 человек в номере
      const total = value + currentRoom.childrenAges.length;
      if (total > 5) {
        // «Обрезаем» детей, если перебор
        const allowedChildren = 5 - value;
        currentRoom.childrenAges = currentRoom.childrenAges.slice(
          0,
          allowedChildren
        );
      }
      currentRoom.adults = value;
      newRooms[roomIndex] = currentRoom;
      return newRooms;
    });
  };

  // Добавить ещё одного ребёнка
  const handleAddChild = (roomIndex: number) => {
    setRooms((prev) => {
      const newRooms = [...prev];
      const currentRoom = newRooms[roomIndex];
      // Сначала проверяем лимит (макс 5 человек в номере)
      if (currentRoom.adults + currentRoom.childrenAges.length < 5) {
        // Добавим ребёнка с дефолтным возрастом
        currentRoom.childrenAges.push("Ребёнок 1 год");
      }
      newRooms[roomIndex] = currentRoom;
      return newRooms;
    });
  };

  // Изменить возраст конкретного ребёнка
  const handleChangeChildAge = (
    newAge: string,
    roomIndex: number,
    childIndex: number
  ) => {
    setRooms((prev) => {
      const newRooms = [...prev];
      newRooms[roomIndex].childrenAges[childIndex] = newAge;
      return newRooms;
    });
  };

  // Удалить конкретного ребёнка
  const handleRemoveChild = (childIndex: number, roomIndex: number) => {
    setRooms((prev) => {
      const newRooms = [...prev];
      newRooms[roomIndex].childrenAges.splice(childIndex, 1);
      return newRooms;
    });
  };

  // ==================== Поиск (кнопка "Найти") ====================
  const handleSearch = () => {
    setShowSearchResult(true);
  };

  // ==================== Формат даты (чтобы показывать красиво) ====================
  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ==================== Модалки (рендер через порталы) ====================
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

  // ==================== Рендер ====================
  return (
    <section className={scss.BookingPage}>
      {/* Хлебные крошки */}
      <div className={scss.breadcrumbs}>
        <a href="/" className={scss.breadLink}>
          Главная
        </a>
        <span className={scss.separator}>›</span>
        <span>Бронирование</span>
      </div>

      {/* Шапка */}
      <div className={scss.topHeader}>
        <h1 className={scss.mainTitle}>Бронирование</h1>
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

      <p className={scss.subtitle}>
        Выберите даты заезда, выезда и количество гостей
      </p>

      {/* Поля выбора дат */}
      <div className={scss.formRow}>
        <div className={scss.formGroup}>
          <label>Дата заезда</label>
          <input
            type="text"
            readOnly
            onClick={openDateModal}
            value={formatDate(startDate)}
            placeholder="Выбрать дату"
          />
        </div>
        <div className={scss.formGroup}>
          <label>Дата выезда</label>
          <input
            type="text"
            readOnly
            onClick={openDateModal}
            value={formatDate(endDate)}
            placeholder="Выбрать дату"
          />
        </div>
      </div>

      {/* Заголовок секции */}
      <h2 className={scss.roomsTitle}>Размещение в номере</h2>
      <p className={scss.roomsSubtitle}>Взрослые от 13 лет и старше</p>

      {/* Блок номеров */}
      <div className={scss.roomBlock}>
        {rooms.map((room, idx) => {
          // Считаем, сколько всего (взрослые + дети)
          const totalPeople = room.adults + room.childrenAges.length;
          return (
            <div key={idx} className={scss.roomInputs}>
              {/* "Номер X" */}
              <div className={scss.roomNumberLabel}>Номер {idx + 1}</div>

              {/* Взрослые */}
              <div className={scss.formGroup}>
                <label>Взрослые</label>
                <select
                  className={scss.adultSelect}
                  value={room.adults}
                  onChange={(e) =>
                    handleChangeAdults(Number(e.target.value), idx)
                  }
                >
                  <option value={1}>1 взрослый</option>
                  <option value={2}>2 взрослых</option>
                  <option value={3}>3 взрослых</option>
                  <option value={4}>4 взрослых</option>
                  <option value={5}>5 взрослых</option>
                </select>
              </div>

              {/* Дети */}
              <div className={scss.formGroup}>
                <label>Дети</label>
                {/* Для каждого ребёнка — свой <select> + "×" */}
                {room.childrenAges.map((childAge, childIndex) => (
                  <div key={childIndex} className={scss.childRow}>
                    <select
                      className={scss.childSelect}
                      value={childAge}
                      onChange={(e) =>
                        handleChangeChildAge(e.target.value, idx, childIndex)
                      }
                    >
                      {CHILD_AGE_OPTIONS.map((age) => (
                        <option key={age} value={age}>
                          {age}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className={scss.childRemoveBtn}
                      onClick={() => handleRemoveChild(childIndex, idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Кнопка "Добавить детей" (только если ещё можно) */}
                {totalPeople < 5 && (
                  <button
                    type="button"
                    className={scss.addChildBtn}
                    onClick={() => handleAddChild(idx)}
                  >
                    Добавить детей
                  </button>
                )}
              </div>

              {/* Удалить номер (если номеров > 1) */}
              {rooms.length > 1 && (
                <button
                  type="button"
                  className={scss.removeRoomBtn}
                  onClick={() => handleRemoveRoom(idx)}
                >
                  Удалить номер
                </button>
              )}
            </div>
          );
        })}

        {/* Добавить номер */}
        <button
          type="button"
          className={scss.addRoomBtn}
          onClick={handleAddRoom}
        >
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

      {/* Модалки (даты / язык) */}
      {isDateModalOpen && <DateModal />}
      {isLanguageModalOpen && <LanguageModal />}
    </section>
  );
};

export default Register;
