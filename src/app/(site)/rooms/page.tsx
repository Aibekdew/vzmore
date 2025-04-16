"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useSearchRoomsQuery } from "@/redux/api/room";
import RoomCard from "@/components/Rooms/RoomCard";
import FilterTwo from "@/components/Rooms/FilterTwo";

export default function RoomsPage() {
  const searchParams = useSearchParams();
  const check_in = searchParams.get("check_in") || "";
  const check_out = searchParams.get("check_out") || "";
  const guestsStr = searchParams.get("guests") || "1";
  const guests = Number(guestsStr);

  const {
    data: rooms,
    isLoading,
    isError,
  } = useSearchRoomsQuery({
    check_in,
    check_out,
    guests,
  });
  console.log("rooms", rooms);
  console.log("check_in", check_in);
  console.log("check_out", check_out);

  return (
    <div className="max-w w-1-screen-xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
        {isLoading && <p className="text-center mt-8">Загрузка...</p>}
        {isError && <p className="text-center mt-8 text-red-500">Ошибка!</p>}

        {rooms && rooms.length === 0 && (
          <p className="text-center mt-8">Нет доступных номеров</p>
        )}
        <FilterTwo />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
          {rooms &&
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                checkIn={check_in}
                checkOut={check_out}
                guests={guests}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
