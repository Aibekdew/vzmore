"use client";
import React, { useState } from "react";
import Slider from "react-slick"; // Импорт react-slick
import { Room } from "@/redux/api/room";
import RoomModal from "./RoomModal";
import { getImageUrl } from "@/utils/getImageUrl";
import { AiOutlineWifi } from "react-icons/ai";
import { FaSnowflake, FaMoneyBillWave } from "react-icons/fa";
import { MdSafetyDivider } from "react-icons/md";
import { PiHairDryerFill } from "react-icons/pi";

interface RoomCardProps {
  room: Room;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export default function RoomCard({
  room,
  checkIn,
  checkOut,
  guests,
}: RoomCardProps) {
  const [openModal, setOpenModal] = useState(false);

  // Настройки для слайдера с автопрокрутом
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Включаем автопрокрутку
    autoplaySpeed: 3000, // Интервал переключения слайдов (в мс)
  };

  // Функция для сокращённого описания
  const getShortDescription = (desc: string) => {
    if (!desc) return "";
    const words = desc.split(" ");
    return words.length <= 15 ? desc : words.slice(0, 15).join(" ") + "...";
  };

  // Если фото есть, берём их, иначе показываем заглушку
  const photos = room.photos && room.photos.length > 0 ? room.photos : null;

  return (
    <>
      {" "}
      <div className="flex flex-col border rounded-lg shadow-md bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Слайдер фотографий */}
        <div className="relative w-full h-56">
          <Slider {...sliderSettings}>
            {photos ? (
              photos.map((photo) => {
                const imageUrl = getImageUrl(photo.image);
                return (
                  <div key={photo.id}>
                    <img
                      src={imageUrl}
                      alt={room.title}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                );
              })
            ) : (
              <div>
                <img
                  src="/noimg.png"
                  alt="No images"
                  className="w-full h-56 object-cover"
                />
              </div>
            )}
          </Slider>
          {room.available_count > 0 && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-sm px-3 py-1 rounded shadow-md">
              Осталось {room.available_count} номеров
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h2 className="text-xl font-semibold mb-2">{room.title}</h2>
          <div className="flex flex-wrap gap-2 text-sm text-gray-700 mb-2">
            <span>До {room.capacity} мест</span>
            <span>{room.square_meters} м²</span>
            <span>{room.rooms_count} комн.</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-gray-700 mb-4 text-sm">
            {room.has_wifi && (
              <div className="flex items-center gap-1">
                <AiOutlineWifi /> <span>Wi-Fi</span>
              </div>
            )}
            {room.has_conditioner && (
              <div className="flex items-center gap-1">
                <FaSnowflake /> <span>Кондиционер</span>
              </div>
            )}
            {room.has_safe && (
              <div className="flex items-center gap-1">
                <MdSafetyDivider /> <span>Сейф</span>
              </div>
            )}
            {room.has_hairdryer && (
              <div className="flex items-center gap-1">
                <PiHairDryerFill /> <span>Фен</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
            <FaMoneyBillWave className="text-green-500" />
            <span>{room.price_per_night} KGS / день</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {room.description
              ? getShortDescription(room.description)
              : "Нет описания"}
          </p>
          <div className="mt-auto text-right">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors duration-300"
            >
              Подробнее
            </button>
          </div>
        </div>

        {/* Модальное окно */}
        {openModal && (
          <RoomModal
            room={room}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            onClose={() => setOpenModal(false)}
          />
        )}
      </div>
    </>
  );
}
