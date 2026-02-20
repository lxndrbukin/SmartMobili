import { type JSX } from "react";
import { type NavLink } from "./types";
import SelectLang from "./SelectLang";
// import HeaderProfile from "./HeaderProfile";
import { useTranslation } from "react-i18next";

export default function Header(): JSX.Element {
  const { t } = useTranslation("header");

  const navLinks = t("nav", { returnObjects: true }) as Array<NavLink>;

  const renderNavLinks = (links: Array<NavLink>): Array<JSX.Element> => {
    return links.map((link: NavLink) => {
      return (
        <li key={link.label}>
          <a href={link.href}>{link.label}</a>
        </li>
      );
    });
  };

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
          <ul>{renderNavLinks(navLinks)}</ul>
        </div>
        <div className="header_user-links">
          {/* <HeaderProfile /> */}
          <SelectLang lang="en" />
        </div>
      </header>
    </div>
  );
}
