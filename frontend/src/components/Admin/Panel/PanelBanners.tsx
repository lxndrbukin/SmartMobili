import { type JSX, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  type BannerProps,
  getBanners,
  deleteBanner,
} from '../../../store';

export default function PanelBanners(): JSX.Element {
  const { t } = useTranslation('admin');
  const HEADERS = [
    'ID',
    t('panel.table.image'),
    t('panel.table.header'),
    t('panel.table.url'),
    t('panel.table.actions'),
  ];

  const dispatch = useDispatch<AppDispatch>();
  const { banners } = useSelector((state: RootState) => state.catalog);
  const { lang } = useParams();
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(getBanners(lang));
  }, [dispatch, lang]);

  const handleDelete = (bannerId: number, bannerHeader: string) => {
    const del = confirm(t('alerts.banner.confirmDelete', { name: bannerHeader }));
    if (del) {
      dispatch(deleteBanner(bannerId));
    }
  };

  const renderHeaders = (headers: Array<string>) => {
    return headers.map((header, idx) => {
      return <th key={idx}>{header}</th>;
    });
  };

  const renderRows = (bannersList: Array<BannerProps>) => {
    return bannersList.map((banner) => {
      const { id, url, header, images } = banner;
      const thumbnail = images && images.length > 0 ? images[0].image_url : null;

      return (
        <tr key={id}>
          <td className='cell-id'>#{id}</td>
          <td>
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={header}
                style={{ width: '80px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
              />
            ) : (
              <span className='no-image'>{t('banners.noImages')}</span>
            )}
          </td>
          <td>{header}</td>
          <td>{url}</td>
          <td className='actions'>
            <i
              onClick={() => setSearchParams({ editBanner: String(id) })}
              className='fa-regular fa-pen-to-square'
            ></i>
            <i
              onClick={() => handleDelete(id, header)}
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
        <h2>{t('panel.tabs.banners')}</h2>
        <button
          onClick={() => setSearchParams({ createBanner: '1' })}
          className='button'
        >
          {t('banners.headerCreate')}
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
          <tbody>{renderRows(banners)}</tbody>
        </table>
      </div>
    </div>
  );
}
