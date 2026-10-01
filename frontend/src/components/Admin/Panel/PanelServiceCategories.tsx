import { type JSX, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  type ServiceCategoryProps,
  getServiceCategories,
  deleteServiceCategory,
} from '../../../store';

export default function PanelServiceCategories(): JSX.Element {
  const { t } = useTranslation('admin');
  const HEADERS = [
    'ID',
    t('panel.table.name'),
    t('panel.table.order'),
    'Slug',
    t('panel.table.services', { defaultValue: t('panel.table.items') }),
    t('panel.table.actions'),
  ];

  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.services);
  const { lang } = useParams();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(getServiceCategories({ lang, limit: undefined }));
  }, [lang, dispatch]);

  const handleDelete = (categoryId: number, categoryName: string) => {
    const del = confirm(
      t('alerts.serviceCategory.confirmDelete', {
        name: categoryName,
        defaultValue: t('alerts.category.confirmDelete', { name: categoryName }),
      }),
    );
    if (del) {
      dispatch(deleteServiceCategory(categoryId));
      alert(
        t('alerts.serviceCategory.deleted', {
          name: categoryName,
          defaultValue: t('alerts.category.deleted', { name: categoryName }),
        }),
      );
    } else return;
  };

  const renderHeaders = (headers: Array<string>) => {
    return headers.map((header, idx) => {
      return <th key={idx}>{header}</th>;
    });
  };

  const renderRows = (categoriesList: Array<ServiceCategoryProps>) => {
    const parents = categoriesList.filter((cat) => !cat.parent_id);
    const sorted: ServiceCategoryProps[] = [];

    parents.forEach((parent) => {
      sorted.push(parent);
      const children = categoriesList.filter((cat) => cat.parent_id === parent.id);
      sorted.push(...children);
    });

    return sorted.map((category) => {
      const { id, name, slug, parent_id, order } = category;
      const baseCount = category.item_count ?? category.service_count ?? 0;
      let displayItemCount = baseCount;

      if (!parent_id) {
        const children = categoriesList.filter((cat) => cat.parent_id === id);
        const childrenCount = children.reduce(
          (sum, cat) => sum + (cat.item_count ?? cat.service_count ?? 0),
          0,
        );
        displayItemCount = baseCount + childrenCount;
      }

      return (
        <tr key={id} className={parent_id ? 'subcategory-row' : ''}>
          <td className='cell-id'>{parent_id ? '' : `#${id}`}</td>
          <td>
            {parent_id && <span className='subcategory-indent'>↳ </span>}
            {name}
          </td>
          <td>{order}</td>
          <td>{slug}</td>
          <td>{displayItemCount}</td>
          <td className='actions'>
            <i
              onClick={() => setSearchParams({ editServiceCategory: String(id) })}
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
        <h2>{t('panel.tabs.serviceCategories', { defaultValue: t('panel.tabs.categories') })}</h2>
        <button
          onClick={() => setSearchParams({ createServiceCategory: '1' })}
          className='button'
        >
          {t('serviceCategory.headerCreate', {
            defaultValue: t('category.headerCreate'),
          })}
        </button>
      </div>
      <p className='admin-panel-scroll-hint'>
        <i className='fa-solid fa-arrow-right-arrow-left'></i>{' '}
        {t('panel.scrollHint')}
      </p>
      <div className='admin-panel-table-wrapper'>
        <table className='admin-panel-table'>
          <thead>
            <tr>{renderHeaders(HEADERS)}</tr>
          </thead>
          <tbody>{renderRows(categories)}</tbody>
        </table>
      </div>
    </div>
  );
}
