import { type JSX } from "react";

export default function Footer(): JSX.Element {
  return (
    <div className="footer-wrapper">
      <footer className="footer">
        <div className="footer-col">
          <a className="logo logo-dark" href="/">
            <div className="logo_primary">
              <span className="logo_primary-left">SMART</span>
              <span className="logo_primary-right">MOBILI</span>
            </div>
          </a>
          <div className="footer-socials">
            <i className="fab fa-instagram-square"></i>
            <i className="fab fa-telegram-plane"></i>
            <i className="fab fa-facebook-square"></i>
          </div>
        </div>
        <div className="footer-col">
          <h3 className="footer-col-header">Catalog</h3>
          <ul>
            <li>
              <a href="#">Kitchens</a>
            </li>
            <li>
              <a href="#">Living Rooms</a>
            </li>
            <li>
              <a href="#">Offices</a>
            </li>
            <li>
              <a href="#">Wardrobes</a>
            </li>
            <li>
              <a href="#">Tables</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-col-header">Info</h3>
          <ul>
            <li>
              <a href="#">About us</a>
            </li>
            <li>
              <a href="#">Services</a>
            </li>
            <li>
              <a href="#">Orders</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-col-header">Contacts</h3>
          <ul>
            <li>+373 69 923 028</li>
            <li>+373 79 684 094</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
