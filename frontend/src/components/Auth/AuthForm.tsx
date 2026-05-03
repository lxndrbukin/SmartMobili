import { type JSX, type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  register,
  login,
  getMe,
} from '../../store';

export default function AuthForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('auth');
  const [formErrors, setFormErrors] = useState<{
    username: string | null;
    password: string | null;
  }>({ username: null, password: null });

  const [searchParams, setSearchParams] = useSearchParams();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const isLogin = searchParams.get('login') === 'true';

  const handleClose = () => {
    setSearchParams({});
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const data = { username, password };
    e.preventDefault();
    if (username.length && password.length) {
      if (isLogin) {
        await dispatch(login(data)).unwrap();
      } else {
        await dispatch(register(data)).unwrap();
      }
      await dispatch(getMe());
      setSearchParams({});
    }
  };

  const paragraphText = isLogin ? t('form.noAccMsg') : t('form.existingAccMsg');

  const errorMessage = error ? <p className='error'>{error}</p> : null;

  const renderLink = () => {
    return (
      <a
        href=''
        onClick={(e) => {
          e.preventDefault();
          if (isLogin) {
            setSearchParams({ signup: 'true' });
          } else {
            setSearchParams({ login: 'true' });
          }
          setFormErrors({ username: null, password: null });
        }}
      >
        {isLogin ? t('form.signup') : t('form.login')}
      </a>
    );
  };

  const handleOnBlur = (name: string, value: string) => {
    if (!value.length) {
      setFormErrors({
        ...formErrors,
        [name]: t('form.enterMsg', { label: t(`form.${name}`).toLowerCase() }),
      });
    } else {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const handleOnClick = (name: string) => {
    setFormErrors({ ...formErrors, [name]: null });
  };

  return (
    <div className='modal-backdrop' onClick={handleClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <form className='auth-form' onSubmit={handleSubmit}>
          <button
            className='modal-close-btn'
            type='button'
            onClick={handleClose}
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
          <h3>{isLogin ? t('form.loginHeader') : t('form.signupHeader')}</h3>
          <div className='form-field'>
            <label>{t('form.username')}</label>
            <input
              onBlur={(e) => handleOnBlur(e.target.name, e.target.value)}
              onFocus={(e) => handleOnClick(e.target.name)}
              type='text'
              name='username'
              className={formErrors['username'] ? 'input-error' : ''}
            />
            {formErrors['username'] && (
              <p className='error'>{formErrors['username']}</p>
            )}
          </div>
          <div className='form-field'>
            <label>{t('form.password')}</label>
            <input
              className={formErrors['password'] ? 'input-error' : ''}
              onBlur={(e) => handleOnBlur(e.target.name, e.target.value)}
              onFocus={(e) => handleOnClick(e.target.name)}
              type='password'
              name='password'
            />
            {formErrors['password'] && (
              <p className='error'>{formErrors['password']}</p>
            )}
          </div>
          <button disabled={isLoading} type='submit'>
            {isLogin ? t('form.login') : t('form.signup')}
          </button>
          <p className='signup-redirect'>
            {paragraphText} {renderLink()}
          </p>
          {errorMessage}
        </form>
      </div>
    </div>
  );
}
