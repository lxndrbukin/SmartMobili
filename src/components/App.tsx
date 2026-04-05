import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import pageTitle from '../utils/pageTitle';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { Outlet } from 'react-router-dom';
import LanguageSync from './LanguageSync';

export default function App(): JSX.Element {
  const { t } = useTranslation('general');

  pageTitle(t('title'));

  return (
    <div className='main_container'>
      <LanguageSync />
      <Header />
      <div className='content_container'>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
