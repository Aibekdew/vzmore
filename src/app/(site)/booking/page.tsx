// src/app/(site)/booking/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaPlus, FaMinus } from "react-icons/fa";

interface RoomData {
  adults: number;
  children: number;
}

export default function BookingPage() {
  const router = useRouter();

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [rooms, setRooms] = useState<RoomData[]>([{ adults: 2, children: 0 }]);

  const handleAddRoom = () => setRooms((prev) => [...prev, { adults: 2, children: 0 }]);
  const handleRemoveRoom = (index: number) =>
    setRooms((prev) => prev.filter((_, i) => i !== index));
  const handleChangeRoom = (index: number, field: "adults" | "children", value: number) => {
    setRooms((prev) => {
      const newRooms = [...prev];
      newRooms[index][field] = value;
      return newRooms;
    });
  };

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert("Выберите даты заезда и выезда");
      return;
    }
    let totalGuests = 0;
    rooms.forEach((r) => { totalGuests += r.adults + r.children; });
    const checkInStr = checkIn.toISOString().split("T")[0];
    const checkOutStr = checkOut.toISOString().split("T")[0];
    router.push(`/rooms?check_in=${checkInStr}&check_out=${checkOutStr}&guests=${totalGuests}`);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
        <h1 className="text-4xl font-bold text-center mb-8">Бронирование</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Дата заезда</label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
              placeholderText="Выберите дату заезда"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-1">Дата выезда</label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              minDate={checkIn || new Date()}
              dateFormat="yyyy-MM-dd"
              placeholderText="Выберите дату выезда"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
          </div>
        </div>
        <div className="space-y-4">
          {rooms.map((room, idx) => (
            <div key={idx} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">Номер {idx + 1}</span>
                {rooms.length > 1 && (
                  <button onClick={() => handleRemoveRoom(idx)} className="text-red-500 hover:underline flex items-center gap-1">
                    <FaMinus /> Удалить
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="block font-medium">Взрослые (13+)</label>
                  <input
                    type="number"
                    min={1}
                    value={room.adults}
                    onChange={(e) => handleChangeRoom(idx, "adults", Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-medium">Дети (0-12)</label>
                  <input
                    type="number"
                    min={0}
                    value={room.children}
                    onChange={(e) => handleChangeRoom(idx, "children", Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button onClick={handleAddRoom} className="text-blue-600 hover:underline flex items-center gap-1">
            <FaPlus /> Добавить ещё один номер
          </button>
        </div>
        <div className="text-center mt-8">
          <button onClick={handleSearch} className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition-all font-medium shadow-lg">
            Найти номера
          </button>
        </div>
      </div>
    </div>
  );
}
