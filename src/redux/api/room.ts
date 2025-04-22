// src/redux/api/room.ts

"use client";
import { api } from "./api";

export interface RoomPhoto {
  id: number;
  image: string;
}

export interface Room {
  id: number;
  category_name: string;
  title: string;
  description: string;
  capacity: number;
  square_meters: number;
  rooms_count: number;
  available_count: number;
  price_per_night: string;
  has_wifi: boolean;
  has_conditioner: boolean;
  has_safe: boolean;
  has_hairdryer: boolean;
  photos: RoomPhoto[];
  total_price?: string;          // ← новое

}
export interface CalendarDay {
  date:  string;   // "2025-04-01"
  price: string | null;
}
export const roomApi = api.injectEndpoints({
  
  endpoints: (build) => ({
    searchRooms: build.query<Room[],{ check_in?: string; check_out?: string; guests?: number }>({
    query: (params) => ({ url: "rooms/search/", params }),
      providesTags: ["Rooms"],
    }),
    getRooms: build.query<Room[], void>({
      query: () => "rooms/",
      providesTags: ["Rooms"],
    }),
    calendar: build.query<CalendarDay[],{ year: number; month: number; guests?: number }>({
      query: (params) => ({ url: "calendar/", params }),
    }),
  }),
  
});

export const { useCalendarQuery, useSearchRoomsQuery, useGetRoomsQuery, ...rest} = roomApi;
