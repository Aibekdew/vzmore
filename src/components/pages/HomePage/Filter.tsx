// === src/components/pages/HomePage/Filter.tsx ===
"use client";
import React, { FC, useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import scss from "./Filter.module.scss";
import { FaCalendarAlt, FaUserFriends, FaTag } from "react-icons/fa";
import GuestsModal from "./GuestsModal";
import CalendarModalRates from "./CalendarModalRates";
import PromoModal from "./PromoModal";
import { differenceInCalendarDays, parse, format } from "date-fns";

interface IRoom {
  checkIn: string | null; // "DD.MM.YYYY"
  checkOut: string | null;
  adults: number;
  children: number;
  childrenAges: number[];
  promoCode?: string;
}

const createNewRoom = (): IRoom => ({
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
  childrenAges: [],
  promoCode: "",
});

/**  Преобразуем формат DD.MM.YYYY → YYYY-MM-DD для query‑строки  */
const toISO = (date: string) => {
  const [dd, mm, yyyy] = date.split(".");
  return `${yyyy}-${mm}-${dd}`;
};

/**  Кол-во ночей между двумя датами в формате DD.MM.YYYY  */
const nightsBetween = (start: string, end: string) =>
  differenceInCalendarDays(parse(end, "dd.MM.yyyy", new Date()), parse(start, "dd.MM.yyyy", new Date()));

const Filter: FC = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<IRoom[]>([createNewRoom()]);
  const [openCheckInModal, setOpenCheckInModal] = useState(false);
  const [openCheckOutModal, setOpenCheckOutModal] = useState(false);
  const [openPromoModal, setOpenPromoModal] = useState(false);
  const [openGuestsModal, setOpenGuestsModal] = useState(false);

  /* ---------- localStorage sync ---------- */
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bookingRooms", JSON.stringify(rooms));
    }
  }, [rooms]);

  /* ---------- callbacks ---------- */
  const handleCheckInSelect = (idx: number, start: string, end: string) =>
    setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, checkIn: start, checkOut: end } : r)));

  const handleCheckOutSelect = (idx: number, end: string) =>
    setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, checkOut: end } : r)));

  const handlePromoChange = (idx: number, promoCode: string) =>
    setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, promoCode } : r)));

  const handleRoomGuestsChange = (
    idx: number,
    data: { adults: number; children: number; childrenAges: number[] }
  ) => setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, ...data } : r)));

  /* ---------- основной экшн "Найти номер" ---------- */
  const handleFindRoom = () => {
    const main = rooms[0];
    if (!main.checkIn || !main.checkOut) {
      alert("Сначала выберите даты заезда и выезда");
      return;
    }
    // Сохраним комнаты ещё раз на всякий 🔒
    localStorage.setItem("bookingRooms", JSON.stringify(rooms));
    const storedPrice = localStorage.getItem("selectedPrice") ?? "0";

    const query = new URLSearchParams({
      check_in: toISO(main.checkIn),
      check_out: toISO(main.checkOut),
      guests: String(rooms.reduce((a, r) => a + r.adults + r.children, 0)),
      promo: main.promoCode ?? "",
      nights: String(nightsBetween(main.checkIn, main.checkOut)),
      amount: storedPrice,              // ← добавили

    });
    router.push(`/rooms?${query.toString()}`);
  };

  const mainRoom = rooms[0];

  const handleRemoveRoom = (idx: number) =>
    setRooms(prev => {
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy.length ? copy : [createNewRoom()];
    });
  
  useEffect(() => {
    const stored = typeof window !== "undefined"
      ? localStorage.getItem("bookingRooms")
      : null;
    if (stored) {
      try {
        const arr = JSON.parse(stored) as IRoom[];
        if (arr.length) setRooms(arr);
      } catch (_) {/* ignore */}
    }
  }, []);
  
  return (
    <section className={scss.Filter}>
      <div className={scss.wrapper}>
        <h2>БРОНИРОВАНИЕ НОМЕРОВ</h2>
        <p>Гарантированная лучшая цена</p>

        <div className={scss.roomItem}>
          <div className={scss.inputsRow}>
            {/* Инпут Заезд */}
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

            {/* Инпут Выезд */}
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

        <button className={scss.searchBtn} onClick={handleFindRoom}>
          Найти номер
        </button>
      </div>

      {openGuestsModal && (
        <GuestsModal
          rooms={rooms}
          onClose={() => setOpenGuestsModal(false)}
          onAddRoom={() => setRooms(prev => [...prev, createNewRoom()])}   // FIX
          onRemoveRoom={handleRemoveRoom}
          onUpdateRoom={handleRoomGuestsChange}
        />
      )}

      {openCheckInModal && (
        <CalendarModalRates
          onClose={() => setOpenCheckInModal(false)}
          defaultStart={mainRoom.checkIn ?? null}
          defaultEnd={mainRoom.checkOut ?? null}
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
          defaultStart={mainRoom.checkIn}
          defaultEnd={mainRoom.checkOut ?? null}
          onSelectRange={(start, end) => {
            // В режиме lockStart игнорируем новое start – обновляем только дату выезда
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
