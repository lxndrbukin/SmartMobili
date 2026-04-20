import { type JSX, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  type UserProps,
  getUsers,
} from '../../../store';

export default function PanelUsers(): JSX.Element {
  const { t } = useTranslation('admin');
  const HEADERS = [
    'ID',
    t('panel.table.username'),
    t('panel.table.role'),
    t('panel.table.signedup'),
    t('panel.table.actions'),
  ];

  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.admin.users);
  const { lang } = useParams();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(getUsers());
  }, [lang]);

  const renderHeaders = (headers: Array<string>) => {
    return headers.map((header) => {
      return <th>{header}</th>;
    });
  };

  const renderRows = (users: Array<UserProps>) => {
    return users.map(({ id, username, user_role, signup_at }) => {
      return (
        <tr>
          <td>{id}</td>
          <td>{username}</td>
          <td style={{ textTransform: 'capitalize' }}>{user_role}</td>
          <td>{new Date(signup_at).toLocaleDateString()}</td>
          <td className='actions'>
            <i
              onClick={() => setSearchParams({})}
              className='fa-regular fa-pen-to-square'
            ></i>
            <i className='fa-solid fa-trash-can'></i>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className='admin-panel-table-container'>
      <div className='admin-panel-table-container-header'>
        <h2>{t('panel.tabs.items')}</h2>
        <button onClick={() => setSearchParams({})} className='button'>
          {t('item.headerCreate')}
        </button>
      </div>
      <table className='admin-panel-table'>
        <thead>
          <tr>{renderHeaders(HEADERS)}</tr>
        </thead>
        <tbody>{renderRows(data || [])}</tbody>
      </table>
    </div>
  );
}
