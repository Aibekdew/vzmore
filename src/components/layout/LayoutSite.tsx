"use client";
import { FC, ReactNode } from "react";
import scss from "./LayoutSite.module.scss";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

interface ILayoutSiteProps {
  children: ReactNode;
}
const LayoutSite: FC<ILayoutSiteProps> = ({ children }) => {
  return (
    <div className={scss.LayoutSite}>
      <Header />
      <div className={scss.children}>{children}</div>
      <Footer />
    </div>
  );
};

export default LayoutSite;
