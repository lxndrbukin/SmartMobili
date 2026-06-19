import { type JSX, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState, logout } from '../../store';

export default function HeaderProfile(): JSX.Element {
  const { t } = useTranslation('auth');
  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.auth);

  const iconRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);

  const handleOutsideClick = (e: MouseEvent): void => {
    if (
      iconRef &&
      !iconRef.current?.contains(e.target as Element) &&
      !dropdownRef.current?.contains(e.target as Element)
    ) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return (): void =>
      document.removeEventListener('click', handleOutsideClick);
  }, []);


  const headerUserProfile = (): JSX.Element => {
    return (
      <div ref={dropdownRef} className='header_user-profile_wrapper'>
        <div className='header_user-profile'>
          <div className='header_user-profile-info'>
            <i className='fas fa-user-circle'></i>
            <span>{user?.username}</span>
          </div>
          <div className='header_user-profile_links'>
            {/* <a className='header_user-profile_link' href='#'>
              Profile
            </a> */}
            <a
              className='header_user-profile_link'
              onClick={(e) => {
                e.preventDefault();
                dispatch(logout());
              }}
              href=''
            >
              {t('header.signout')}
            </a>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='header_user'>
      <div
        ref={iconRef}
        onClick={() => setIsVisible(!isVisible)}
        className='header_user-link'
        id='header_profile-icon'
        title={t('header.profile')}
      >
        <i className='far fa-user'></i>
      </div>
      {isVisible && headerUserProfile()}
    </div>
  );
}
