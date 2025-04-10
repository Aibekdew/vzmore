// src/redux/api/booking.ts

"use client";
import { api } from "./api";

export interface Booking {
  id: number;
  room: number;
  check_in: string;
  check_out: string;
  guests: number;
  created_at: string;
}

export interface CreateBookingPayload {
  room: number;
  check_in: string;
  check_out: string;
  guests: number;
}

export const bookingApi = api.injectEndpoints({
  endpoints: (build) => ({
    createBooking: build.mutation<Booking, CreateBookingPayload>({
      query: (payload) => ({
        url: "booking/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const { useCreateBookingMutation } = bookingApi;
