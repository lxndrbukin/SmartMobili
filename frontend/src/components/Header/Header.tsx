import { type JSX, useState } from 'react';
import type { NavLink } from './types';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';
import useLocalePath from '../../hooks/useLocalePath';
import { useTranslation } from 'react-i18next';
import SelectLang from './SelectLang';
import HeaderProfile from './HeaderProfile';
import HeaderSearch from './HeaderSearch';
import logo from '../../assets/imgs/icons8-wardrobe-50.png';

export default function Header(): JSX.Element {
  const { t } = useTranslation('header');
  const to = useLocalePath();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const navLinks = t('nav', { returnObjects: true }) as Array<NavLink>;
  const isAdmin = token && user && user.user_role === 'admin';
  const [showNav, setShowNav] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const [, setSearchParams] = useSearchParams();

  const renderNavLinks = (links: Array<NavLink>): Array<JSX.Element | null> => {
    return links.map((link: NavLink) => {
      if (link.name === 'order') {
        return (
          <li
            onClick={() => setSearchParams({ createInquiry: 'true' })}
            key={link.label}
          >
            <span>{link.label}</span>
          </li>
        );
      }
      if (link.name === 'admin' && !isAdmin) {
        return null;
      }

      return (
        <li key={link.label}>
          <Link to={to(link.href)}>{link.label}</Link>
        </li>
      );
    });
  };

  const renderAuth = () => {
    return (
      <button
        className='header_user-link'
        id='header_profile-icon'
        onClick={() => setSearchParams({ login: 'true' })}
      >
        <i className='fa-solid fa-right-to-bracket'></i>
      </button>
    );
  };

  const renderMobileNavLinks = (
    links: Array<NavLink>,
  ): Array<JSX.Element | null> => {
    return links.map((link: NavLink) => {
      if (link.href === '/admin' && !isAdmin) {
        return null;
      }
      return (
        <Link key={link.label} to={to(link.href)}>
          {link.label}
        </Link>
      );
    });
  };

  return (
    <div className='header-wrapper'>
      <header className='header'>
        <Link className='logo' to={to('/')}>
          <div className='logo-badge'>
            <img src={logo} alt='SmartMobili' />
          </div>
          <div className='logo-text'>
            <span className='logo-name'>
              <span className='logo-name-bold'>Smart</span>
              <span className='logo-name-light'>Mobili</span>
            </span>
            <span className='logo-tagline'>{t('logo')}</span>
          </div>
        </Link>
        <div className='header-links'>
          <ul>{renderNavLinks(navLinks)}</ul>
        </div>
        <HeaderSearch />
        <div className='header_user-links'>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className='mobile-toggle'
            id='search-toggle'
          >
            <i className='fa-solid fa-magnifying-glass'></i>
          </button>
          {token ? <HeaderProfile /> : renderAuth()}
          <SelectLang />
          <button
            onClick={() => setShowNav(!showNav)}
            className='mobile-toggle'
            id='nav-toggle'
          >
            {showNav ? (
              <i className='fa-solid fa-xmark'></i>
            ) : (
              <i className='fa-solid fa-bars'></i>
            )}
          </button>
        </div>
      </header>

      {showSearch && (
        <div id='mobile-search' className='mobile-search'>
          <HeaderSearch />
        </div>
      )}

      {showNav && (
        <div className='mobile-nav'>
          <nav>{renderMobileNavLinks(navLinks)}</nav>
        </div>
      )}
    </div>
  );
}
