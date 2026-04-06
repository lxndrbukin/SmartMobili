import { type JSX } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import pageTitle from '../utils/pageTitle';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { Outlet } from 'react-router-dom';
import LanguageSync from './LanguageSync';
import AuthForm from './Auth/AuthForm';

export default function App(): JSX.Element {
  const [searchParams] = useSearchParams();

  const isLogin = searchParams.get('login') === 'true';
  const isSignup = searchParams.get('signup') === 'true';

  const { t } = useTranslation('general');

  pageTitle(t('title'));

  return (
    <div className='main_container'>
      <LanguageSync />
      <Header />
      <div className='content_container'>
        <Outlet />
      </div>
      {(isLogin || isSignup) && <AuthForm />}
      <Footer />
    </div>
  );
}
