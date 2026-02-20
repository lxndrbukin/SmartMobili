import { type JSX } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { Outlet } from "react-router-dom";
import LanguageSync from "./LanguageSync";

export default function App(): JSX.Element {
  return (
    <div className="main_container">
      <LanguageSync />
      <Header />
      <div className="content_container">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
