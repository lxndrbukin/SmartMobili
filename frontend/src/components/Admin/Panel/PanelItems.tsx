import { type JSX, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  type ItemProps,
  getItems,
  deleteItem,
  clearItems,
} from '../../../store';

export default function PanelItems(): JSX.Element {
  const adminTranslation = useTranslation('admin');
  const catalogTranslation = useTranslation('catalog');

  const HEADERS = [
    'ID',
    adminTranslation.t('panel.table.name'),
    adminTranslation.t('panel.table.category'),
    `${adminTranslation.t('panel.table.price')} (MDL)`,
    adminTranslation.t('panel.table.actions'),
  ];

  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.catalog);
  const { lang } = useParams();
  const [, setSearchParams] = useSearchParams();
  const [skip, setSkip] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const pageSize = 10;

  const lastFetchedRef = useRef<{
    lang: string | undefined;
    skip: number;
  }>({
    lang: undefined,
    skip: -1,
  });

  useEffect(() => {
    dispatch(clearItems());
  }, [dispatch, lang]);

  useEffect(() => {
    const isQueryChanged = lastFetchedRef.current.lang !== lang;
    const targetSkip = isQueryChanged ? 0 : skip;
    if (
      lastFetchedRef.current.lang === lang &&
      lastFetchedRef.current.skip === targetSkip
    ) {
      return;
    }
    if (isQueryChanged) {
      setSkip(0);
    }

    const fetchData = async () => {
      lastFetchedRef.current = {
        lang,
        skip: targetSkip,
      };

      setLoading(true);
      try {
        await dispatch(getItems({ lang: lang!, skip: targetSkip, desc: true }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, lang, skip]);

  const handleDelete = (itemId: number, itemName: string) => {
    const del = confirm(
      adminTranslation.t('alerts.item.confirmDelete', { name: itemName }),
    );
    if (del) {
      dispatch(deleteItem(itemId));
      alert(adminTranslation.t('alerts.item.deleted', { name: itemName }));
    } else return;
  };

  const renderHeaders = (headers: Array<string>) => {
    return headers.map((header, idx) => {
      return <th key={idx}>{header}</th>;
    });
  };

  const renderRows = (items: Array<ItemProps>) => {
    return items.map(({ id, title, category, price }) => {
      return (
        <tr key={id}>
          <td className='cell-id'>#{id}</td>
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
        <h2>{adminTranslation.t('panel.tabs.items')}</h2>
        <button
          onClick={() => setSearchParams({ createItem: '1' })}
          className='button'
        >
          {adminTranslation.t('item.headerCreate')}
        </button>
      </div>
      <p className='admin-panel-scroll-hint'>
        <i className='fa-solid fa-arrow-right-arrow-left'></i>{' '}
        {adminTranslation.t('panel.scrollHint')}
      </p>
      <div className='admin-panel-table-wrapper'>
        <table className='admin-panel-table'>
          <thead>
            <tr>{renderHeaders(HEADERS)}</tr>
          </thead>
          <tbody>{renderRows(items)}</tbody>
        </table>
      </div>
      {items.length >= skip + pageSize && (
        <div className='admin-load-more-container'>
          <button
            className='admin-load-more-button'
            disabled={loading}
            onClick={() => setSkip((prev) => prev + pageSize)}
          >
            {loading ? (
              <>
                <i className='fa-solid fa-spinner fa-spin'></i>{' '}
                {adminTranslation.t('panel.loading', {
                  defaultValue: 'Loading...',
                })}
              </>
            ) : (
              catalogTranslation.t('generic.loadMore')
            )}
          </button>
        </div>
      )}
    </div>
  );
}
