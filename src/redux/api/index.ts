import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  createApi,
} from "@reduxjs/toolkit/query/react";

// Настройка базового запроса
const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
  prepareHeaders: (headers) => {
    const storedTokens = localStorage.getItem("tokens");

    if (storedTokens) {
      try {
        const tokens = JSON.parse(storedTokens);
        if (tokens && tokens.accessToken) {
          headers.set("Authorization", `Bearer ${tokens.accessToken}`);
        }
      } catch (error) {
        console.error("Ошибка парсинга токенов из localStorage", error);
      }
    }
    return headers;
  },
});

// Расширенный базовый запрос с явной типизацией параметров
const baseQueryExtended: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args: string | FetchArgs, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryExtended,
  refetchOnFocus: false,
  refetchOnReconnect: false,
  tagTypes: ["auth"],
  endpoints: () => ({}),
});
