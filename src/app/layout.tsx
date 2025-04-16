// src/app/layout.tsx
import "./globals.scss";
import ReduxProvider from "@/providers/ReduxProvider";
import { ReactNode } from "react";

export const metadata = {
  title: "My App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Оборачиваем всё в ReduxProvider, чтобы RTK Query работал */}
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
