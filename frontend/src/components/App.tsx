import { type JSX, useEffect } from 'react';
import { useSearchParams, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { type AppDispatch, getMe } from '../store';
import pageTitle from '../utils/pageTitle';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import LanguageSync from './LanguageSync';
import ScrollToTop from './ScrollToTop';
import AuthForm from './Auth/AuthForm';
import ItemForm from './Admin/Items/ItemForm';
import CategoryForm from './Admin/Categories/CategoryForm';
import InquiryForm from './Admin/Inquiry/InquiryForm';
import PanelInquiry from './Admin/Panel/PanelInquiry';
import UserForm from './Admin/Users/UserForm';

export default function App(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();

  const isLogin = searchParams.get('login') === 'true';
  const isSignup = searchParams.get('signup') === 'true';
  const itemId = searchParams.get('editItem');
  const categoryId = searchParams.get('editCategory');
  const inquiryId = searchParams.get('editInquiry');
  const userId = searchParams.get('editUser');

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
      <ScrollToTop />
      <Header />
      <div className='content_container'>
        <Outlet />
      </div>
      {(isLogin || isSignup) && <AuthForm />}
      {(categoryId || searchParams.get('createCategory')) && <CategoryForm />}
      {(itemId || searchParams.get('createItem')) && <ItemForm />}
      {(itemId || searchParams.get('createItem')) && <ItemForm />}
      {(inquiryId || searchParams.get('createInquiry')) && <InquiryForm />}
      {searchParams.get('inquiry') && <PanelInquiry />}
      {userId && <UserForm />}
      <Footer />
    </div>
  );
}
