import type { JSX } from 'react';
import type { NavLink } from './types';
import { Link } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import SelectLang from './SelectLang';
// import HeaderProfile from "./HeaderProfile";
import { useTranslation } from 'react-i18next';

export default function Header(): JSX.Element {
  const { t } = useTranslation('header');
  const to = useLocalePath();

  const navLinks = t('nav', { returnObjects: true }) as Array<NavLink>;

  const renderNavLinks = (links: Array<NavLink>): Array<JSX.Element> => {
    return links.map((link: NavLink) => {
      return (
        <li key={link.label}>
          <Link to={to(link.href)}>{link.label}</Link>
        </li>
      );
    });
  };

  return (
    <div className='header-wrapper'>
      <header className='header'>
        <Link className='logo' to={to('/')}>
          <div className='logo_primary'>
            <span className='logo_primary-left'>SMART</span>
            <span className='logo_primary-right'>MOBILI</span>
          </div>
        </Link>
        <div className='header-links'>
          <ul>{renderNavLinks(navLinks)}</ul>
        </div>
        <div className='header_user-links'>
          {/* <HeaderProfile /> */}
          <SelectLang />
        </div>
      </header>
    </div>
  );
}
