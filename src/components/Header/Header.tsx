import { type JSX } from "react";

export default function Header(): JSX.Element {
  return (
    <div className="header-wrapper">
      <header className="header">
        <a className="logo" href="/">
          <div className="logo_primary">
            <span className="logo_primary-left">SMART</span>
            <span className="logo_primary-right">MOBILI</span>
          </div>
        </a>
        <div className="header-links">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/catalog">Catalog</a>
            </li>
            <li>
              <a href="/contacts">Contacts</a>
            </li>
          </ul>
        </div>
        <div className="header_user-links"></div>
      </header>
    </div>
  );
}
