import { type JSX, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  type ItemProps,
  getItems,
  deleteItem,
} from '../../../store';

export default function PanelItems(): JSX.Element {
  const { t } = useTranslation('admin');
  const HEADERS = [
    'ID',
    t('panel.table.name'),
    t('panel.table.category'),
    `${t('panel.table.price')} (MDL)`,
    t('panel.table.actions'),
  ];

  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.catalog);
  const { lang } = useParams();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(getItems({ lang: lang! }));
  }, [lang]);

  const handleDelete = (itemId: number, itemName: string) => {
    const del = confirm(t('alerts.item.confirmDelete', { name: itemName }));
    if (del) {
      dispatch(deleteItem(itemId));
      alert(t('alerts.item.deleted', { name: itemName }));
    } else return;
  };

  const renderHeaders = (headers: Array<string>) => {
    return headers.map((header) => {
      return <th>{header}</th>;
    });
  };

  const renderRows = (items: Array<ItemProps>) => {
    return items.map(({ id, title, category, price }) => {
      return (
        <tr>
          <td>{id}</td>
          <td>{title}</td>
          <td>{category.name}</td>
          <td>{price}</td>
          <td className='actions'>
            <i
              onClick={() => setSearchParams({ editItem: String(id) })}
              className='fa-regular fa-pen-to-square'
            ></i>
            <i
              onClick={() => handleDelete(id, title)}
              className='fa-solid fa-trash-can'
            ></i>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className='admin-panel-table-container'>
      <div className='admin-panel-table-container-header'>
        <h2>{t('panel.tabs.items')}</h2>
        <button
          onClick={() => setSearchParams({ createItem: '1' })}
          className='button'
        >
          {t('item.headerCreate')}
        </button>
      </div>
      <table className='admin-panel-table'>
        <thead>
          <tr>{renderHeaders(HEADERS)}</tr>
        </thead>
        <tbody>{renderRows(items)}</tbody>
      </table>
    </div>
  );
}
