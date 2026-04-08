import { type JSX, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  register,
  login,
  getMe,
  setError,
  clearError,
} from '../../store';

export default function AuthForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

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
    if (!username.length && !password.length) {
      dispatch(setError('Please enter username and password'));
      return;
    }
    if (!username.length && password.length) {
      dispatch(setError('Please enter username'));
      return;
    }
    if (!password.length && username.length) {
      dispatch(setError('Please enter password'));
      return;
    }
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

  const paragraphText = isLogin
    ? "Don't have an account?"
    : 'Already have an account?';

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
          dispatch(clearError());
        }}
      >
        {isLogin ? 'Sign Up' : 'Log In'}
      </a>
    );
  };

  return (
    <div className='modal-backdrop' onClick={handleClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <form className='auth-form' onSubmit={handleSubmit}>
          <h3>{isLogin ? 'Login' : 'Sign Up'}</h3>
          <div className='form-field'>
            <label>Username</label>
            <input type='text' name='username' />
          </div>
          <div className='form-field'>
            <label>Password</label>
            <input type='password' name='password' />
          </div>
          <button disabled={isLoading} type='submit'>
            {isLogin ? 'Log In' : 'Sign Up'}
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
