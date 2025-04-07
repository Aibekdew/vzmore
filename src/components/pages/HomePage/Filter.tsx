"use client";
import { FC, useState } from "react";
import scss from "./Filter.module.scss";
import { FaCalendarAlt, FaUserFriends, FaTag } from "react-icons/fa";
import GuestsModal from "./GuestsModal";

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

const Filter: FC = () => {
  const [rooms, setRooms] = useState<IRoom[]>([createNewRoom()]);

  // Управление модалками
  const [openCheckInIndex, setOpenCheckInIndex] = useState<number | null>(null);
  const [openCheckOutIndex, setOpenCheckOutIndex] = useState<number | null>(
    null
  );
  const [openPromoIndex, setOpenPromoIndex] = useState<number | null>(null);
  const [openGuestsModal, setOpenGuestsModal] = useState(false);

  // ====== Работа с датами ======
  const handleCheckInSelect = (roomIndex: number, newCheckIn: string) => {
    setRooms((prev) =>
      prev.map((r, i) => {
        if (i !== roomIndex) return r;
        let newCheckOut = r.checkOut;
        if (newCheckOut) {
          const inNum = parseInt(newCheckIn.slice(0, 2));
          const outNum = parseInt(newCheckOut.slice(0, 2));
          if (inNum > outNum) {
            newCheckOut = null;
          }
        }
        return { ...r, checkIn: newCheckIn, checkOut: newCheckOut };
      })
    );
  };

  const handleCheckOutSelect = (roomIndex: number, newCheckOut: string) => {
    setRooms((prev) =>
      prev.map((r, i) =>
        i === roomIndex ? { ...r, checkOut: newCheckOut } : r
      )
    );
  };

  // ====== Промокод ======
  const handlePromoChange = (roomIndex: number, promoCode: string) => {
    setRooms((prev) =>
      prev.map((r, i) => (i === roomIndex ? { ...r, promoCode } : r))
    );
  };

  // ====== Управление комнатами ======
  const handleAddRoom = () => {
    setRooms((prev) => [...prev, createNewRoom()]);
  };

  const handleRemoveRoom = (index: number) => {
    setRooms((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      // чтобы массив никогда не был пустым
      return copy.length === 0 ? [createNewRoom()] : copy;
    });
  };

  // Обновление гостей (взрослые, дети, возраст детей)
  const handleRoomGuestsChange = (
    roomIndex: number,
    newData: { adults: number; children: number; childrenAges: number[] }
  ) => {
    setRooms((prev) =>
      prev.map((r, i) => (i === roomIndex ? { ...r, ...newData } : r))
    );
  };

  // «Найти номер»
  const handleFindRoom = () => {
    console.log("Все данные:", rooms);
    alert("Данные о номерах смотрите в консоли!");
  };

  // Берём ТОЛЬКО первый номер, чтобы отрисовать в фильтре
  const mainRoom = rooms[0];

  return (
    <section className={scss.Filter}>
      <div className={scss.wrapper}>
        <h2>БРОНИРОВАНИЕ НОМЕРОВ</h2>
        <p>Гарантированная лучшая цена</p>

        {/* Блок только для ПЕРВОГО номера */}
        <div className={scss.roomItem}>
          <div className={scss.inputsRow}>
            {/* Заезд */}
            <div
              className={scss.inputBlock}
              onClick={() => setOpenCheckInIndex(0)} // индекс 0
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
                setOpenCheckOutIndex(0); // индекс 0
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
                {rooms.reduce((acc, r) => acc + r.adults, 0)} взросл.,{" "}
                {rooms.reduce((acc, r) => acc + r.children, 0)} дет.
              </div>
            </div>

            {/* Промокод */}
            <div
              className={scss.inputBlock}
              onClick={() => setOpenPromoIndex(0)}
            >
              <FaTag className={scss.icon} />
              <div className={scss.label}>Промокод</div>
              <div className={scss.value}>
                {mainRoom?.promoCode
                  ? mainRoom.promoCode
                  : "У меня есть промокод"}
              </div>
            </div>
          </div>
        </div>

        <button className={scss.searchBtn} onClick={handleFindRoom}>
          Найти номер
        </button>
      </div>

      {/* Модалка «Гости» */}
      {openGuestsModal && (
        <GuestsModal
          rooms={rooms}
          onClose={() => setOpenGuestsModal(false)}
          onAddRoom={handleAddRoom}
          onRemoveRoom={handleRemoveRoom}
          onUpdateRoom={handleRoomGuestsChange}
        />
      )}

      {/* Модалка «Заезд» */}
      {openCheckInIndex === 0 && (
        <CalendarModal
          onClose={() => setOpenCheckInIndex(null)}
          allowedRange={{ start: 1, end: 31 }}
          defaultSelected={mainRoom?.checkIn || null}
          onSelectDate={(dayStr) => {
            handleCheckInSelect(0, dayStr);
            setOpenCheckInIndex(null);
          }}
        />
      )}

      {/* Модалка «Выезд» */}
      {openCheckOutIndex === 0 && (
        <CalendarModal
          onClose={() => setOpenCheckOutIndex(null)}
          allowedRange={{
            start: mainRoom?.checkIn
              ? parseInt(mainRoom.checkIn.slice(0, 2))
              : 1,
            end: 31,
          }}
          defaultSelected={mainRoom?.checkOut || null}
          onSelectDate={(dayStr) => {
            handleCheckOutSelect(0, dayStr);
            setOpenCheckOutIndex(null);
          }}
        />
      )}

      {/* Модалка «Промокод» */}
      {openPromoIndex === 0 && (
        <PromoModal
          onClose={() => setOpenPromoIndex(null)}
          defaultPromo={mainRoom?.promoCode || ""}
          onSave={(code) => {
            handlePromoChange(0, code);
            setOpenPromoIndex(null);
          }}
        />
      )}
    </section>
  );
};

export default Filter;

/* ==============================
     CalendarModal
============================== */
interface ICalendarModalProps {
  onClose: () => void;
  onSelectDate: (dateStr: string) => void;
  defaultSelected: string | null;
  allowedRange: { start: number; end: number };
}

const CalendarModal: FC<ICalendarModalProps> = ({
  onClose,
  onSelectDate,
  defaultSelected,
  allowedRange,
}) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleSelectDay = (day: number) => {
    if (day < allowedRange.start || day > allowedRange.end) return;
    const dateStr = String(day).padStart(2, "0") + ".03.2025";
    onSelectDate(dateStr);
  };

  return (
    <div className={scss.modalBackdrop} onClick={onClose}>
      <div className={scss.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Выберите дату (март 2025)</h3>
        <div className={scss.calendarGrid}>
          {days.map((day) => {
            const dayStr = String(day).padStart(2, "0") + ".03.2025";
            const isSelected = dayStr === defaultSelected;
            const isDisabled =
              day < allowedRange.start || day > allowedRange.end;

            return (
              <div
                key={day}
                className={[
                  scss.day,
                  isSelected ? scss.selected : "",
                  isDisabled ? scss.disabled : "",
                ].join(" ")}
                onClick={() => !isDisabled && handleSelectDay(day)}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className={scss.buttonsRow}>
          <button onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};

/* ==============================
     PromoModal
============================== */
interface IPromoModalProps {
  onClose: () => void;
  defaultPromo: string;
  onSave: (code: string) => void;
}

const PromoModal: FC<IPromoModalProps> = ({
  onClose,
  defaultPromo,
  onSave,
}) => {
  const [promo, setPromo] = useState(defaultPromo);

  const handleApply = () => {
    onSave(promo.trim());
  };

  return (
    <div className={scss.modalBackdrop} onClick={onClose}>
      <div className={scss.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Промокод</h3>
        <input
          type="text"
          placeholder="PROMO2025"
          value={promo}
          onChange={(e) => setPromo(e.target.value)}
          className={scss.promoInput}
        />
        <div className={scss.buttonsRow}>
          <button onClick={handleApply}>Применить</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
};
