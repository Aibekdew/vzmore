"use client";
import React from "react";
import { Room } from "@/redux/api/room";
import { useCreateBookingMutation } from "@/redux/api/booking";
import { getImageUrl } from "@/utils/getImageUrl"; // <-- импорт
import { AiOutlineWifi } from "react-icons/ai";
import { FaSnowflake, FaBed, FaMoneyBillWave } from "react-icons/fa";
import { MdSafetyDivider } from "react-icons/md";
import { PiHairDryerFill } from "react-icons/pi";

interface RoomModalProps {
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
  onClose: () => void;
}

export default function RoomModal({
  room,
  checkIn,
  checkOut,
  guests,
  onClose,
}: RoomModalProps) {
  const [createBooking, { isLoading }] = useCreateBookingMutation();

  const handleBooking = async () => {
    try {
      const result = await createBooking({
        room: room.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
      }).unwrap();
      alert(`Бронь успешно создана! ID: ${result.id}`);
      onClose();
    } catch (error) {
      alert("Ошибка при создании брони");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded shadow-lg w-full max-w-3xl relative animate-slideInUp">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl leading-none"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="p-6 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-bold mb-4">{room.title}</h2>

          <div className="mb-4 flex gap-2 overflow-x-auto">
            {room.photos && room.photos.length > 0 ? (
              room.photos.map((photo) => {
                // Преобразуем photo.image в полный URL
                const imageUrl = getImageUrl(photo.image);
                return (
                  <img
                    key={photo.id}
                    src={imageUrl}
                    alt={room.title}
                    className="w-48 h-32 object-cover rounded shadow"
                  />
                );
              })
            ) : (
              // Если массив фото пустой
              <img
                src="/noimg.png"
                alt="no-image"
                className="w-48 h-32 object-cover rounded shadow"
              />
            )}
          </div>

          <div className="mb-2 text-sm text-gray-600">
            <p>Вместимость: до {room.capacity} человек</p>
            <p>Площадь: {room.square_meters} м²</p>
            <p>Количество комнат: {room.rooms_count}</p>
            <p className="mt-2 flex items-center gap-2 text-lg text-gray-800 font-semibold">
              <FaMoneyBillWave className="text-green-500" />
              Цена за день: {room.price_per_night} KGS
            </p>
          </div>
          <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-700">
            {room.has_wifi && (
              <div className="flex items-center gap-1">
                <AiOutlineWifi /> Wi-Fi
              </div>
            )}
            {room.has_conditioner && (
              <div className="flex items-center gap-1">
                <FaSnowflake /> Кондиционер
              </div>
            )}
            <div className="flex items-center gap-1">
              <FaBed /> Двуспальная кровать
            </div>
            {room.has_safe && (
              <div className="flex items-center gap-1">
                <MdSafetyDivider /> Сейф
              </div>
            )}
            {room.has_hairdryer && (
              <div className="flex items-center gap-1">
                <PiHairDryerFill /> Фен
              </div>
            )}
          </div>
          <p className="text-sm text-gray-700 mb-6">
            {room.description || "Нет описания"}
          </p>
          <div className="text-right">
            <button
              onClick={handleBooking}
              disabled={isLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {isLoading ? "Загрузка..." : "Забронировать"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
