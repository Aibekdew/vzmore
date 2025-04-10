// src/redux/api/baseQueryWithReauth.ts

"use client";

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface RefreshResponse {
  access: string;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/", // теперь все запросы идут к /api/
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const refreshResult = await rawBaseQuery(
          {
            url: "token/refresh/",
            method: "POST",
            body: { refresh: refreshToken },
          },
          api,
          extraOptions
        );
        if (refreshResult.data && (refreshResult.data as RefreshResponse).access) {
          const newAccess = (refreshResult.data as RefreshResponse).access;
          localStorage.setItem("accessToken", newAccess);
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          window.dispatchEvent(new CustomEvent("sessionExpired"));
        }
      } else {
        window.dispatchEvent(new CustomEvent("sessionExpired"));
      }
    }
    return result;
  };

export default baseQueryWithReauth;
