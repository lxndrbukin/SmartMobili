import { type JSX, useEffect } from 'react';
import { useSearchParams, Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { type AppDispatch, getMe } from '../store';
import { Analytics } from '@vercel/analytics/react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import LanguageSync from './LanguageSync';
import ScrollToTop from './ScrollToTop';
import AuthForm from './Auth/AuthForm';
import ItemForm from './Admin/Items/ItemForm';
import CategoryForm from './Admin/Categories/CategoryForm';
import ServiceForm from './Admin/Services/ServiceForm';
import ServiceCategoryForm from './Admin/ServiceCategories/ServiceCategoryForm';
import BannerForm from './Admin/Banners/BannerForm';
// import LatestWorkForm from './Admin/LatestWorks/LatestWorkForm';
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
  const serviceId = searchParams.get('editService');
  const serviceCategoryId = searchParams.get('editServiceCategory');
  // const latestWorkId = searchParams.get('editLatestWork');
  const inquiryId = searchParams.get('editInquiry');
  const userId = searchParams.get('editUser');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getMe());
    }
  }, []);

  return (
    <div className='main_container'>
      <Analytics />
      <LanguageSync />
      <ScrollToTop />
      <Header />
      <div className='content_container'>
        <Outlet />
      </div>
      {(isLogin || isSignup) && <AuthForm />}
      {(categoryId || searchParams.get('createCategory')) && <CategoryForm />}
      {(itemId || searchParams.get('createItem')) && <ItemForm />}
      {(serviceCategoryId || searchParams.get('createServiceCategory')) && (
        <ServiceCategoryForm />
      )}
      {(serviceId || searchParams.get('createService')) && <ServiceForm />}
      {(searchParams.get('createBanner') || searchParams.get('editBanner')) && (
        <BannerForm />
      )}
      {/* {(latestWorkId || searchParams.get('createLatestWork')) && (
        <LatestWorkForm />
      )} */}
      {(inquiryId || searchParams.get('createInquiry')) && <InquiryForm />}
      {searchParams.get('inquiry') && <PanelInquiry />}
      {userId && <UserForm />}
      <Footer />
    </div>
  );
}
