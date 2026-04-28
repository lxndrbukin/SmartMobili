import { type JSX, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  type CategoryProps,
  getCategories,
  deleteCategory,
} from '../../../store';

export default function PanelCategories(): JSX.Element {
  const { t } = useTranslation('admin');
  const HEADERS = [
    'ID',
    t('panel.table.name'),
    'Slug',
    t('panel.table.items'),
    t('panel.table.actions'),
  ];

  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.catalog);
  const { lang } = useParams();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(getCategories(lang));
  }, [lang]);

  const handleDelete = (categoryId: number, categoryName: string) => {
    const del = confirm(t('alerts.category.confirmDelete', { name: categoryName }));
    if (del) {
      dispatch(deleteCategory(categoryId));
      alert(t('alerts.category.deleted', { name: categoryName }));
    } else return;
  };

  const renderHeaders = (headers: Array<string>) => {
    return headers.map((header) => {
      return <th>{header}</th>;
    });
  };

  const renderRows = (categories: Array<CategoryProps>) => {
    return categories.map(({ id, name, slug, item_count }) => {
      return (
        <tr>
          <td>{id}</td>
          <td>{name}</td>
          <td>{slug}</td>
          <td>{item_count}</td>
          <td className='actions'>
            <i
              onClick={() => setSearchParams({ editCategory: String(id) })}
              className='fa-regular fa-pen-to-square'
            ></i>
            <i
              onClick={() => handleDelete(id, name)}
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
        <h2>{t('panel.tabs.categories')}</h2>
        <button
          onClick={() => setSearchParams({ createCategory: '1' })}
          className='button'
        >
          {t('category.headerCreate')}
        </button>
      </div>
      <table className='admin-panel-table'>
        <thead>
          <tr>{renderHeaders(HEADERS)}</tr>
        </thead>
        <tbody>{renderRows(categories)}</tbody>
      </table>
    </div>
  );
}
