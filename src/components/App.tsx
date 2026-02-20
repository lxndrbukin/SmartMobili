import { type JSX } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

export default function App(): JSX.Element {
  return (
    <div className="main_container">
      <Header />
      <div className="content_container">Content</div>
      <Footer />
    </div>
  );
}
