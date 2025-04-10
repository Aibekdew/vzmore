// src/redux/api/api.ts

"use client";
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithReauth from "./baseQueryWithReauth";

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Rooms", "Booking"],
  endpoints: () => ({}),
});

export default api;
