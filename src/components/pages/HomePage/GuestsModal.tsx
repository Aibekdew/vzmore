"use client";
import { FC } from "react";
import scss from "./Filter.module.scss"; // Или отдельный .module.scss для GuestsModal
import { FaTrash } from "react-icons/fa";

interface IRoom {
  checkIn: string | null;
  checkOut: string | null;
  adults: number;
  children: number;
  childrenAges: number[];
  promoCode?: string;
}

interface IGuestsModalProps {
  rooms: IRoom[];
  onClose: () => void;
  onAddRoom: () => void;
  onRemoveRoom: (index: number) => void;
  onUpdateRoom: (
    index: number,
    data: { adults: number; children: number; childrenAges: number[] }
  ) => void;
}

const GuestsModal: FC<IGuestsModalProps> = ({
  rooms,
  onClose,
  onAddRoom,
  onRemoveRoom,
  onUpdateRoom,
}) => {
  const getAgeLabel = (age: number) => {
    if (age === 1) return "1 год";
    if (age >= 2 && age <= 4) return `${age} года`;
    return `${age} лет`;
  };

  return (
    <div className={scss.modalBackdrop} onClick={onClose}>
      <div className={scss.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Количество гостей</h3>

        {rooms.map((room, index) => {
          const incAdults = () => {
            if (room.adults < 4 && room.adults + room.children < 5) {
              onUpdateRoom(index, {
                adults: room.adults + 1,
                children: room.children,
                childrenAges: room.childrenAges,
              });
            }
          };
          const decAdults = () => {
            if (room.adults > 1) {
              onUpdateRoom(index, {
                adults: room.adults - 1,
                children: room.children,
                childrenAges: room.childrenAges,
              });
            }
          };
          const incChildren = () => {
            if (room.children < 4 && room.adults + room.children < 5) {
              onUpdateRoom(index, {
                adults: room.adults,
                children: room.children + 1,
                childrenAges: [...room.childrenAges, 1],
              });
            }
          };
          const decChildren = () => {
            if (room.children > 0) {
              const copy = [...room.childrenAges];
              copy.pop();
              onUpdateRoom(index, {
                adults: room.adults,
                children: room.children - 1,
                childrenAges: copy,
              });
            }
          };

          const handleAgeChange = (childIdx: number, newAge: number) => {
            const copy = [...room.childrenAges];
            copy[childIdx] = newAge;
            onUpdateRoom(index, {
              adults: room.adults,
              children: room.children,
              childrenAges: copy,
            });
          };

          return (
            <div key={index} className={scss.roomBlock}>
              <div className={scss.roomHeader}>
                <span>Номер {index + 1}</span>
                <button
                  className={scss.removeRoomBtn}
                  onClick={() => onRemoveRoom(index)}
                >
                  <FaTrash />
                </button>
              </div>

              <div className={scss.counterRow}>
                <span>Взрослые</span>
                <div className={scss.buttonsRow}>
                  <button className={scss.counterBtn} onClick={decAdults}>
                    -
                  </button>
                  <div className={scss.counterValue}>{room.adults}</div>
                  <button className={scss.counterBtn} onClick={incAdults}>
                    +
                  </button>
                </div>
              </div>

              <div className={scss.counterRow}>
                <span>Дети младше 13 лет</span>
                <div className={scss.buttonsRow}>
                  <button className={scss.counterBtn} onClick={decChildren}>
                    -
                  </button>
                  <div className={scss.counterValue}>{room.children}</div>
                  <button className={scss.counterBtn} onClick={incChildren}>
                    +
                  </button>
                </div>
              </div>

              {room.children > 0 && (
                <div className={scss.childrenAges}>
                  {room.childrenAges.map((age, i) => (
                    <div key={i} className={scss.ageItem}>
                      <label>Возраст ребёнка {i + 1}:</label>
                      <select
                        value={age}
                        onChange={(e) => handleAgeChange(i, +e.target.value)}
                      >
                        {Array.from({ length: 12 }, (_, k) => k + 1).map(
                          (a) => (
                            <option key={a} value={a}>
                              {getAgeLabel(a)}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <button className={scss.addRoomBtn} onClick={onAddRoom}>
          + Добавить ещё номер
        </button>

        <div className={scss.buttonsRow}>
          <button onClick={onClose}>Готово</button>
        </div>
      </div>
    </div>
  );
};

export default GuestsModal;
