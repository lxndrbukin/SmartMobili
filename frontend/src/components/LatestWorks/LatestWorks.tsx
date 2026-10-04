import { type JSX, useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import useLocalePath from '../../hooks/useLocalePath';
import SeoHead from '../SeoHead';
import {
  type AppDispatch,
  type RootState,
  getLatestWorks,
  clearLatestWorks,
} from '../../store';
import LatestWorksGrid from './LatestWorksGrid';

const PAGE_SIZE = 12;
const HERO_IMAGE = '/banners/catalog-hero.jpg';
const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) ??
  'https://smartmobili-md.com';

export default function LatestWorks(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const to = useLocalePath();
  const { t } = useTranslation('latestWorks');
  const { lang = 'ro' } = useParams<{ lang: string }>();
  const { latestWorks } = useSelector((state: RootState) => state.latestWorks);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadPage = useCallback(
    async (skip: number) => {
      setIsLoading(true);
      try {
        const result = await dispatch(
          getLatestWorks({ lang, skip, limit: PAGE_SIZE }),
        ).unwrap();
        setHasMore(result.length === PAGE_SIZE);
      } catch (error) {
        console.error('Error fetching latest works:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, lang],
  );

  useEffect(() => {
    dispatch(clearLatestWorks());
    loadPage(0);
  }, [dispatch, loadPage]);

  return (
    <div className='catalog-page'>
      <SeoHead
        title={t('header')}
        description={t('seo.description')}
        lang={lang}
        ogImage={`${SITE_URL}${HERO_IMAGE}`}
      />
      <div
        className='catalog-section-hero'
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      >
        <div className='catalog-section-hero-content'>
          <div className='catalog-breadcrumbs'>
            <Link to={to('/')}>{t('breadcrumbs.home')}</Link> /{' '}
            <span>{t('header')}</span>
          </div>
          <h1 className='catalog-section-hero-title'>{t('header')}</h1>
        </div>
      </div>
      <div className='catalog latest-works-page'>
        {!isLoading && latestWorks.length === 0 ? (
          <div className='catalog-no-items'>{t('noItems')}</div>
        ) : (
          <LatestWorksGrid
            works={latestWorks}
            isLoading={isLoading}
            skeletonCount={6}
          />
        )}
        {hasMore && latestWorks.length > 0 && (
          <div className='catalog-load-more-container'>
            <button
              className='catalog-load-more-button'
              disabled={isLoading}
              onClick={() => loadPage(latestWorks.length)}
            >
              {t('loadMore')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
