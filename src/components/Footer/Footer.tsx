import { type JSX } from "react";
import { useTranslation } from "react-i18next";
import type { FooterTranslations, NavLink } from "./types";

export default function Footer(): JSX.Element {
  const { t } = useTranslation("footer");

  const sections = t("sections", { returnObjects: true }) as FooterTranslations;

  const renderSectionLinks = (links: Array<NavLink>) => {
    return links.map((link: NavLink) => {
      return (
        <li>
          <a href={link.href}>{link.label}</a>
        </li>
      );
    });
  };

  const renderSections = () => {
    return Object.values(sections).map((section) => {
      return (
        <div className="footer-col">
          <h3 className="footer-col-header">{section.label}</h3>
          <ul>{renderSectionLinks(section.links)}</ul>
        </div>
      );
    });
  };

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
        {renderSections()}
      </footer>
    </div>
  );
}
