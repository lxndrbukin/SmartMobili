import { type JSX, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { type AppDispatch, register, login } from '../../store';

export default function AuthForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const [searchParams, setSearchParams] = useSearchParams();

  const isLogin = searchParams.get('login') === 'true';

  const handleClose = () => {
    setSearchParams({});
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('passowrd') as string;
    const data = { username, password };
    if (isLogin) {
      dispatch(login(data));
    } else {
      dispatch(register(data));
    }
  };

  return (
    <div className='modal-backdrop' onClick={handleClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <form className='auth-form' onSubmit={handleSubmit}>
          <h3>{isLogin ? 'Login' : 'Sign Up'}</h3>
          <div className='form-input'>
            <label>Username</label>
            <input type='text' name='username' />
          </div>
          <div className='form-input'>
            <label>Password</label>
            <input type='password' name='password' />
          </div>
          <button type='submit'>{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
      </div>
    </div>
  );
}
