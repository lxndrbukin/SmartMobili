import { type JSX } from 'react';
import { Link } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import { useTranslation } from 'react-i18next';
import type { FooterTranslations, NavLink } from './types';
import logo from '../../assets/imgs/icons8-wardrobe-50.png';

export default function Footer(): JSX.Element {
  const { t } = useTranslation('footer');
  const to = useLocalePath();
  const sections = t('sections', { returnObjects: true }) as FooterTranslations;

  const renderSectionLinks = (links: Array<NavLink>) => {
    return links.map((link: NavLink) => {
      return (
        <li key={link.label}>
          <Link to={to(`/catalog${link.href}`)}>{link.label}</Link>
        </li>
      );
    });
  };

  const renderSections = (sections: FooterTranslations) => {
    return Object.values(sections).map((section) => {
      return (
        <div key={section.label} className='footer-col'>
          <h3 className='footer-col-header'>{section.label}</h3>
          <ul>{renderSectionLinks(section.links)}</ul>
        </div>
      );
    });
  };

  return (
    <div className='footer-wrapper'>
      <footer className='footer'>
        <div className='footer-col'>
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
          <div className='footer-socials'>
            <a target='_blank' href='https://www.instagram.com/sm_smartmobili/'>
              <i className='fab fa-instagram-square'></i>
            </a>
            <a target='_blank' href='https://t.me/SM_smartmobili'>
              <i className='fab fa-telegram-plane'></i>
            </a>
          </div>
        </div>
        {renderSections(sections)}
      </footer>
    </div>
  );
}
