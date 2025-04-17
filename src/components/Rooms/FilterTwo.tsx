"use client";
import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import scss from "./FilterTwo.module.scss";
import { FaCalendarAlt, FaUserFriends, FaTag } from "react-icons/fa";
import CalendarModalRates from "../pages/HomePage/CalendarModalRates";
import PromoModal from "../pages/HomePage/PromoModal";
import GuestsModal from "../pages/HomePage/GuestsModal";

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

const FilterTwo: FC = () => {
  const router = useRouter();
  const [rooms, setRooms] = useState<IRoom[]>([createNewRoom()]);

  const [openCheckInModal, setOpenCheckInModal] = useState(false);
  const [openCheckOutModal, setOpenCheckOutModal] = useState(false);
  const [openPromoModal, setOpenPromoModal] = useState(false);
  const [openGuestsModal, setOpenGuestsModal] = useState(false);

  // При монтировании читаем из localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("bookingRooms");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setRooms(parsed);
          }
        } catch (error) {
          console.warn("Ошибка чтения localStorage:", error);
        }
      }
    }
  }, []);

  // При изменении rooms сохраняем их в localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("bookingRooms", JSON.stringify(rooms));
    }
  }, [rooms]);

  // Обработчики
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

  const handlePromoChange = (roomIndex: number, promoCode: string) => {
    setRooms((prev) =>
      prev.map((r, i) => (i === roomIndex ? { ...r, promoCode } : r))
    );
  };

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

  const handleRoomGuestsChange = (
    roomIndex: number,
    newData: { adults: number; children: number; childrenAges: number[] }
  ) => {
    setRooms((prev) =>
      prev.map((r, i) => (i === roomIndex ? { ...r, ...newData } : r))
    );
  };

  // Кнопка "Продолжить бронирование"
  const handleContinue = () => {
    alert("Данные сохранены. Продолжим бронирование!");
    // Например, можно перейти на другую страницу:
    // router.push("/payment");
  };

  const mainRoom = rooms[0];

  return (
    <section className={scss.Filter}>
      <div className={scss.headingRow}>
        <h2>Выберите номер</h2>
        <button className={scss.continueBooking} onClick={handleContinue}>
          Продолжить бронирование
        </button>
      </div>

      <div className={scss.wrapper}>
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
                {mainRoom.checkIn || "Выберите дату"}
              </div>
            </div>

            {/* Выезд */}
            <div
              className={scss.inputBlock}
              onClick={() => {
                if (!mainRoom.checkIn) {
                  alert("Сначала выберите дату заезда!");
                  return;
                }
                setOpenCheckOutModal(true);
              }}
            >
              <FaCalendarAlt className={scss.icon} />
              <div className={scss.label}>Выезд</div>
              <div className={scss.value}>
                {mainRoom.checkOut || "Выберите дату"}
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
                {mainRoom.promoCode || "Выберите отель"}
              </div>
            </div>
          </div>
        </div>

        <div className={scss.offerBanner}>
          <div className={scss.offerBannerLeft}>
            <h3>БРОНИРУЙТЕ ВЫГОДНЕЕ!</h3>
          </div>
          <div className={scss.offerBannerCenter}>
            <div className={scss.benefitItem}>
              <span className={scss.benefitIcon}>✓</span>
              <span>Бронируйте выгоднее</span>
            </div>
            <div className={scss.benefitItem}>
              <span className={scss.benefitIcon}>✓</span>
              <span>Бесплатное проживание для детей до 7</span>
            </div>
            <div className={scss.benefitItem}>
              <span className={scss.benefitIcon}>✓</span>
              <span>Шведский стол на завтрак</span>
            </div>
          </div>
          <div className={scss.offerBannerRight}>
            <div className={scss.bestPriceLabel}>Наша лучшая цена</div>
            <div className={scss.bestPriceValue}>6&nbsp;300 KGS</div>
          </div>
        </div>
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
          defaultStart={mainRoom.checkIn}
          defaultEnd={mainRoom.checkOut}
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
          defaultEnd={mainRoom.checkOut}
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
          defaultPromo={mainRoom.promoCode || ""}
          onSave={(promo: string) => {
            handlePromoChange(0, promo);
            setOpenPromoModal(false);
          }}
        />
      )}
    </section>
  );
};

export default FilterTwo;
