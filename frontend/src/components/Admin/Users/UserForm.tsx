import { type FormEvent, type JSX, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { type AppDispatch, getUser, updateUser } from '../../../store';

export default function UserForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const userId = Number(searchParams.get('editUser'));

  useEffect(() => {
    const fetchData = async () => {
      const res = await dispatch(getUser(userId)).unwrap();
      setUsername(res.username);
      setUserRole(res.user_role);
    };
    fetchData();
  }, []);

  const handleClose = () => {
    setSearchParams({});
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const uname = formData.get('username') as string;
    const role = formData.get('role') as string;

    const data = {
      id: userId,
      username: uname,
      user_role: role,
    };
    setIsLoading(true);
    await dispatch(updateUser(data));
    setIsLoading(false);
  };

  return (
    <div className='modal-backdrop' onClick={handleClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className='user-form'>
          <button
            className='modal-close-btn'
            type='button'
            onClick={handleClose}
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
          <h3>User Form</h3>
          <div className='form-field'>
            <label>Username</label>
            <input
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
              type='text'
              name='username'
            />
          </div>
          <div className='form-field'>
            <label>New Password</label>
            <input type='password' name='password' />
          </div>
          <div className='form-field'>
            <label>Role</label>
            <select
              name='role'
              onChange={(e) => setUserRole(e.target.value)}
              defaultValue={userRole || 'User'}
            >
              <option value={'admin'}>Admin</option>
              <option value={'moderator'}>Moderator</option>
              <option value={'user'}>User</option>
            </select>
          </div>
          <button className='button' disabled={isLoading} type='submit'>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
