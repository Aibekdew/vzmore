"use client";
import { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import scss from "./Filter.module.scss";
import { FaCalendarAlt, FaUserFriends, FaTag } from "react-icons/fa";

import GuestsModal from "./GuestsModal";
import CalendarModalRates from "./CalendarModalRates";
import PromoModal from "./PromoModal";

interface IRoom {
  checkIn: string | null; // "DD.MM.YYYY"
  checkOut: string | null; // "DD.MM.YYYY"
  adults: number;
  children: number;
  childrenAges: number[];
  promoCode?: string; // Название отеля / промокод
}

// Комната по умолчанию (2 взрослых, 0 детей)
const createNewRoom = (): IRoom => ({
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
  childrenAges: [],
  promoCode: "",
});

const Filter: FC = () => {
  const router = useRouter();

  // Список комнат
  const [rooms, setRooms] = useState<IRoom[]>([createNewRoom()]);

  // Состояния модалок
  const [openCheckInModal, setOpenCheckInModal] = useState(false);
  const [openCheckOutModal, setOpenCheckOutModal] = useState(false);
  const [openPromoModal, setOpenPromoModal] = useState(false);
  const [openGuestsModal, setOpenGuestsModal] = useState(false);

  // 1) При первом рендере загружаем данные из localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("bookingRooms");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRooms(parsed);
        }
      } catch (error) {
        console.warn("Ошибка чтения из localStorage:", error);
      }
    }
  }, []);

  // 2) При каждом изменении `rooms` — сохраняем в localStorage
  useEffect(() => {
    localStorage.setItem("bookingRooms", JSON.stringify(rooms));
  }, [rooms]);

  // ==== Обработчики ====
  // Выбор даты заезда (start) и выезда (end)
  const handleCheckInSelect = (
    roomIndex: number,
    start: string,
    end: string
  ) => {
    setRooms((prev) =>
      prev.map((r, i) =>
        i === roomIndex ? { ...r, checkIn: start, checkOut: end } : r
      )
    );
  };

  const handleCheckOutSelect = (roomIndex: number, end: string) => {
    setRooms((prev) =>
      prev.map((r, i) => (i === roomIndex ? { ...r, checkOut: end } : r))
    );
  };

  // Промокод = название отеля
  const handlePromoChange = (roomIndex: number, promoCode: string) => {
    setRooms((prev) =>
      prev.map((r, i) => (i === roomIndex ? { ...r, promoCode } : r))
    );
  };

  // Добавить / удалить номер (комнату)
  const handleAddRoom = () => {
    setRooms((prev) => [...prev, createNewRoom()]);
  };

  const handleRemoveRoom = (index: number) => {
    setRooms((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy.length === 0 ? [createNewRoom()] : copy;
    });
  };

  // Изменение взрослых/детей
  const handleRoomGuestsChange = (
    roomIndex: number,
    newData: { adults: number; children: number; childrenAges: number[] }
  ) => {
    setRooms((prev) =>
      prev.map((r, i) => (i === roomIndex ? { ...r, ...newData } : r))
    );
  };

  // Допустим, для query нам нужно "YYYY-MM-DD"
  const convertDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [dd, mm, yyyy] = dateStr.split(".");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Нажатие «Найти номер»
  const handleFindRoom = () => {
    const mainRoom = rooms[0]; // первая комната
    if (!mainRoom.checkIn || !mainRoom.checkOut) {
      alert("Пожалуйста, выберите дату заезда и выезда!");
      return;
    }
    const totalGuests = rooms.reduce(
      (acc, r) => acc + r.adults + r.children,
      0
    );
    // Напр. делаем router.push на /rooms
    router.push(
      `/rooms?check_in=${convertDate(mainRoom.checkIn)}&check_out=${convertDate(
        mainRoom.checkOut
      )}&guests=${totalGuests}&promo=${mainRoom.promoCode}`
    );
  };

  // Удобно взять данные из rooms[0] как «основную комнату»
  const mainRoom = rooms[0];

  return (
    <section className={scss.Filter}>
      <div className={scss.wrapper}>
        {/* Заголовок, подпись */}
        <h2>БРОНИРОВАНИЕ НОМЕРОВ</h2>
        <p>Гарантированная лучшая цена</p>

        {/* Блок с полями (Заезд, Выезд, Гости, Отель) */}
        <div className={scss.roomItem}>
          <div className={scss.inputsRow}>
            {/* Заезд */}
            <div
              className={scss.inputBlock}
              onClick={() => setOpenCheckInModal(true)}
            >
              <FaCalendarAlt className={scss.icon} />
              <div className={scss.label}>Заезд</div>
              <div className={scss.value}>
                {mainRoom?.checkIn || "Выберите дату"}
              </div>
            </div>

            {/* Выезд */}
            <div
              className={scss.inputBlock}
              onClick={() => {
                if (!mainRoom?.checkIn) {
                  alert("Сначала выберите дату заезда!");
                  return;
                }
                setOpenCheckOutModal(true);
              }}
            >
              <FaCalendarAlt className={scss.icon} />
              <div className={scss.label}>Выезд</div>
              <div className={scss.value}>
                {mainRoom?.checkOut || "Выберите дату"}
              </div>
            </div>

            {/* Гости */}
            <div
              className={scss.inputBlock}
              onClick={() => setOpenGuestsModal(true)}
            >
              <FaUserFriends className={scss.icon} />
              <div className={scss.label}>Гости</div>
              <div className={scss.value}>
                {rooms.reduce((acc, r) => acc + r.adults, 0)} взросл.,
                {rooms.reduce((acc, r) => acc + r.children, 0)} дет.
              </div>
            </div>

            {/* Отель */}
            <div
              className={scss.inputBlock}
              onClick={() => setOpenPromoModal(true)}
            >
              <FaTag className={scss.icon} />
              <div className={scss.label}>Отель</div>
              <div className={scss.value}>
                {mainRoom?.promoCode || "Выберите отель"}
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка "Найти номер" */}
        <button className={scss.searchBtn} onClick={handleFindRoom}>
          Найти номер
        </button>
      </div>

      {/* Модальные окна */}
      {openGuestsModal && (
        <GuestsModal
          rooms={rooms}
          onClose={() => setOpenGuestsModal(false)}
          onAddRoom={handleAddRoom}
          onRemoveRoom={handleRemoveRoom}
          onUpdateRoom={handleRoomGuestsChange}
        />
      )}

      {openCheckInModal && (
        <CalendarModalRates
          onClose={() => setOpenCheckInModal(false)}
          defaultStart={mainRoom?.checkIn ?? null}
          defaultEnd={mainRoom?.checkOut ?? null}
          onSelectRange={(start, end) => {
            handleCheckInSelect(0, start, end);
            setOpenCheckInModal(false);
          }}
          lockStart={false}
        />
      )}

      {openCheckOutModal && (
        <CalendarModalRates
          onClose={() => setOpenCheckOutModal(false)}
          defaultStart={mainRoom?.checkIn}
          defaultEnd={mainRoom?.checkOut}
          onSelectRange={(_start, end) => {
            handleCheckOutSelect(0, end);
            setOpenCheckOutModal(false);
          }}
          lockStart={true}
        />
      )}

      {openPromoModal && (
        <PromoModal
          onClose={() => setOpenPromoModal(false)}
          defaultPromo={mainRoom?.promoCode || ""}
          onSave={(promo: string) => {
            handlePromoChange(0, promo);
            setOpenPromoModal(false);
          }}
        />
      )}
    </section>
  );
};

export default Filter;
