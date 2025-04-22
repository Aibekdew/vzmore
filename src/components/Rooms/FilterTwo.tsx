"use client";
import React, { FC, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import scss from "./FilterTwo.module.scss";
import { FaCalendarAlt, FaUserFriends, FaTag } from "react-icons/fa";
import CalendarModalRates from "../pages/HomePage/CalendarModalRates";
import PromoModal from "../pages/HomePage/PromoModal";
import GuestsModal from "../pages/HomePage/GuestsModal";
import { differenceInCalendarDays, parse } from "date-fns";
import { useSearchRoomsQuery } from "@/redux/api/room";
import { toISO } from "@/utils/date";

interface IRoom {
  checkIn: string | null;
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

/** YYYY-MM-DD → DD.MM.YYYY */
const fromISO = (iso: string) => {
  const [yyyy, mm, dd] = iso.split("-");
  return `${dd}.${mm}.${yyyy}`;
};

const FilterTwo: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [rooms, setRooms] = useState<IRoom[]>([createNewRoom()]);
  const { data: foundRooms = [], isFetching } = useSearchRoomsQuery(
    rooms[0].checkIn && rooms[0].checkOut
      ? {
          check_in: toISO(rooms[0].checkIn!), // util из Filter.tsx
          check_out: toISO(rooms[0].checkOut!),
          guests: rooms.reduce((a, r) => a + r.adults + r.children, 0),
        }
      : {},
    { skip: !rooms[0].checkIn || !rooms[0].checkOut }
  );

  /* ---------- helpers ---------- */
  const nights =
  rooms[0].checkIn && rooms[0].checkOut
    ? differenceInCalendarDays(
        parse(rooms[0].checkOut!, "dd.MM.yyyy", new Date()),
        parse(rooms[0].checkIn!, "dd.MM.yyyy", new Date())
      )
    : null;        

  const bestPrice = useMemo(() => {
    if (!foundRooms.length) return null;
    const nums = foundRooms
      .map((r) => Number(r.total_price ?? 0))
      .filter(Boolean);
    return nums.length ? Math.min(...nums) : null;
  }, [foundRooms]);

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("bookingRooms")
        : null;
    let initial: IRoom[] | null = null;
    if (stored) {
      try {
        initial = JSON.parse(stored);
      } catch (_) {
        /* noop */
      }
    }

    const checkInISO = searchParams.get("check_in");
    const checkOutISO = searchParams.get("check_out");
    const promo = searchParams.get("promo") ?? initial?.[0]?.promoCode ?? "";

    if (checkInISO && checkOutISO) {
      const base = initial?.[0] ?? createNewRoom();
      base.checkIn = fromISO(checkInISO);
      base.checkOut = fromISO(checkOutISO);
      base.promoCode = promo;
      setRooms([base]);
    } else if (initial) {
      setRooms(initial);
    }
  }, [searchParams]);

  const [openCheckInModal, setOpenCheckInModal] = useState(false);
  const [openCheckOutModal, setOpenCheckOutModal] = useState(false);
  const [openGuestsModal, setOpenGuestsModal] = useState(false);
  const [openPromoModal, setOpenPromoModal] = useState(false);

  const handleAddRoom = () => setRooms((prev) => [...prev, createNewRoom()]);

  const handleRemoveRoom = (index: number) =>
    setRooms((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy.length ? copy : [createNewRoom()];
    });

  const handleRoomGuestsChange = (
    idx: number,
    data: { adults: number; children: number; childrenAges: number[] }
  ) =>
    setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, ...data } : r)));

  const handleCheckInSelect = (idx: number, start: string, end: string) =>
    setRooms((prev) =>
      prev.map((r, i) =>
        i === idx ? { ...r, checkIn: start, checkOut: end } : r
      )
    );

  const handleCheckOutSelect = (idx: number, end: string) =>
    setRooms((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, checkOut: end } : r))
    );

  const handlePromoChange = (idx: number, promo: string) =>
    setRooms((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, promoCode: promo } : r))
    );
  const mainRoom = rooms[0];
  const amount = searchParams.get("amount");

  return (
    <section className={scss.Filter}>
      <div className={scss.headingRow}>
        <h2>Выберите номер</h2>
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
            <div className={scss.bestPriceValue}>
  {amount ? Number(amount).toLocaleString() : "—"}&nbsp;KGS
</div>
          </div>
        </div>
      </div>

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
          onSave={(promo) => {
            handlePromoChange(0, promo);
            setOpenPromoModal(false);
          }}
        />
      )}
    </section>
  );
};

export default FilterTwo;

