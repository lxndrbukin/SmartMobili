import { type JSX, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  type LatestWorkProps,
  getLatestWorks,
  deleteLatestWork,
  clearLatestWorks,
} from '../../../store';

const PAGE_SIZE = 10;

export default function PanelLatestWorks(): JSX.Element {
  const { t } = useTranslation('admin');
  const HEADERS = [
    'ID',
    t('panel.table.image'),
    t('panel.table.name'),
    t('panel.table.status'),
    t('panel.table.date'),
    t('panel.table.actions'),
  ];

  const dispatch = useDispatch<AppDispatch>();
  const { latestWorks } = useSelector((state: RootState) => state.latestWorks);
  const { lang } = useParams();
  const [, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadPage = useCallback(
    async (skip: number) => {
      setLoading(true);
      try {
        const result = await dispatch(
          getLatestWorks({
            lang: lang ?? 'ro',
            skip,
            limit: PAGE_SIZE,
            includeInactive: true,
          }),
        ).unwrap();
        setHasMore(result.length === PAGE_SIZE);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, lang],
  );

  useEffect(() => {
    dispatch(clearLatestWorks());
    loadPage(0);
  }, [dispatch, loadPage]);

  const handleDelete = (latestWorkId: number, title: string) => {
    const del = confirm(t('alerts.latestWork.confirmDelete', { name: title }));
    if (del) {
      dispatch(deleteLatestWork(latestWorkId));
      alert(t('alerts.latestWork.deleted', { name: title }));
    }
  };

  const renderHeaders = (headers: Array<string>) => {
    return headers.map((header, idx) => {
      return <th key={idx}>{header}</th>;
    });
  };

  const renderRows = (works: Array<LatestWorkProps>) => {
    return works.map(({ id, title, images, is_active, created_at }) => {
      const thumbnail = images.length > 0 ? images[0].image_url : null;
      return (
        <tr key={id}>
          <td className='cell-id'>#{id}</td>
          <td>
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                style={{
                  width: '48px',
                  height: '48px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              />
            ) : (
              <span className='no-image'>{t('latestWork.noImages')}</span>
            )}
          </td>
          <td>{title}</td>
          <td>
            {is_active ? t('latestWork.active') : t('latestWork.hidden')}
          </td>
          <td>{new Date(created_at).toLocaleDateString()}</td>
          <td className='actions'>
            <i
              onClick={() => setSearchParams({ editLatestWork: String(id) })}
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
        <h2>{t('panel.tabs.latestWorks')}</h2>
        <button
          onClick={() => setSearchParams({ createLatestWork: '1' })}
          className='button'
        >
          {t('latestWork.headerCreate')}
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
          <tbody>{renderRows(latestWorks)}</tbody>
        </table>
      </div>
      {hasMore && latestWorks.length > 0 && (
        <div className='admin-load-more-container'>
          <button
            className='admin-load-more-button'
            disabled={loading}
            onClick={() => loadPage(latestWorks.length)}
          >
            {loading ? (
              <>
                <i className='fa-solid fa-spinner fa-spin'></i>{' '}
                {t('panel.loading', { defaultValue: 'Loading...' })}
              </>
            ) : (
              t('latestWork.loadMore')
            )}
          </button>
        </div>
      )}
    </div>
  );
}
