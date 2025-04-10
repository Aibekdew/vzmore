// src/utils/getImageUrl.ts

export const BASE_URL = "http://localhost:8000"; // или process.env.NEXT_PUBLIC_API_URL ?

export function getImageUrl(path: string | null | undefined): string {
  if (!path) {
    // Если вдруг пустой путь
    return "/noimg.png"; // Вернём fallback
  }
  // Если путь уже содержит "http", считаем, что это полный URL
  // (Например, если бэкенд отдает "https://example.com/media/...")
  if (path.startsWith("http")) {
    return path;
  }
  // Иначе склеиваем с BASE_URL
  return BASE_URL + path;
}
    