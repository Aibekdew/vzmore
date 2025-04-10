// src/redux/api/room.ts

"use client";
import { api } from "./api";

export interface RoomPhoto {
  id: number;
  image: string;
}

export interface Room {
  id: number;
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
}

export const roomApi = api.injectEndpoints({
  endpoints: (build) => ({
    searchRooms: build.query<Room[], { check_in?: string; check_out?: string; guests?: number }>({
      query: (params) => ({
        url: "rooms/search/", // обязательно с завершающим слэшем
        params,
      }),
      providesTags: ["Rooms"],
    }),
    getRooms: build.query<Room[], void>({
      query: () => "rooms/",
      providesTags: ["Rooms"],
    }),
  }),
});

export const { useSearchRoomsQuery, useGetRoomsQuery } = roomApi;
