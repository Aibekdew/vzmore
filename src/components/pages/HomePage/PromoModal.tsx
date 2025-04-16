"use client";
import { FC, useState } from "react";
import scss from "./Filter.module.scss"; // Используем стили из Filter.module.scss (скорректируйте путь при необходимости)

interface IPromoModalProps {
  onClose: () => void;
  defaultPromo: string;
  onSave: (promo: string) => void;
}

const PromoModal: FC<IPromoModalProps> = ({
  onClose,
  defaultPromo,
  onSave,
}) => {
  // Список названий отелей для выбора
  const hotelTypes = [
    "Deluxe",
    "Superior",
    "Standard double",
    "Standard single",
  ];
  const [selectedHotel, setSelectedHotel] = useState(defaultPromo);

  const handleApply = () => {
    onSave(selectedHotel);
  };

  return (
    <div className={scss.modalBackdrop} onClick={onClose}>
      <div className={scss.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>Выберите отель</h3>
        <select
          value={selectedHotel}
          onChange={(e) => setSelectedHotel(e.target.value)}
          className={scss.promoInput}
        >
          <option value="">-- Выберите --</option>
          {hotelTypes.map((hotel) => (
            <option key={hotel} value={hotel}>
              {hotel}
            </option>
          ))}
        </select>
        <div className={scss.buttonsRow}>
          <button onClick={handleApply}>Применить</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default PromoModal;
