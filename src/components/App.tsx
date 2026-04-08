import { type JSX, useEffect } from 'react';
import { useSearchParams, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState, getMe } from '../store';
import pageTitle from '../utils/pageTitle';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import LanguageSync from './LanguageSync';
import AuthForm from './Auth/AuthForm';
import ItemForm from './Admin/Items/ItemForm';
import CategoryForm from './Admin/Categories/CategoryForm';

export default function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();

  const { user } = useSelector((state: RootState) => state.auth);

  const isLogin = searchParams.get('login') === 'true';
  const isSignup = searchParams.get('signup') === 'true';
  const isAdmin = user && user.user_role === 'admin';
  const itemId = searchParams.get('editItem');
  const categoryId = searchParams.get('editCategory');

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
      {(categoryId || searchParams.get('createCategory')) && isAdmin && (
        <CategoryForm />
      )}
      {(itemId || searchParams.get('createItem')) && isAdmin && <ItemForm />}
      <Footer />
    </div>
  );
}
