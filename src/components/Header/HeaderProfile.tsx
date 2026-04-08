import { type JSX, useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { type AppDispatch, logout } from '../../store';

export default function HeaderProfile(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const iconRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return (): void =>
      document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleOutsideClick = (e: MouseEvent): void => {
    if (
      iconRef &&
      !iconRef.current?.contains(e.target as Element) &&
      !dropdownRef.current?.contains(e.target as Element)
    ) {
      setIsVisible(false);
    }
  };

  const headerUserProfile = (): JSX.Element => {
    return (
      <div ref={dropdownRef} className='header_user-profile_wrapper'>
        <div className='header_user-profile'>
          <div className='header_user-profile-info'>
            <i className='fas fa-user-circle'></i>
            <span>User</span>
          </div>
          <div className='header_user-profile_links'>
            <a className='header_user-profile_link' href='#'>
              Profile
            </a>
            <a
              className='header_user-profile_link'
              onClick={(e) => {
                e.preventDefault();
                dispatch(logout());
              }}
              href=''
            >
              Sign out
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
        title='Profile'
      >
        <i className='far fa-user'></i>
      </div>
      {isVisible && headerUserProfile()}
    </div>
  );
}
