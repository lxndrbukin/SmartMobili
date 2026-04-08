import { type JSX, useEffect } from 'react';
import { useSearchParams, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { type AppDispatch, getMe } from '../store';
import pageTitle from '../utils/pageTitle';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import LanguageSync from './LanguageSync';
import AuthForm from './Auth/AuthForm';

export default function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();

  const isLogin = searchParams.get('login') === 'true';
  const isSignup = searchParams.get('signup') === 'true';

  const { t } = useTranslation('general');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getMe());
    }
  }, []);

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
