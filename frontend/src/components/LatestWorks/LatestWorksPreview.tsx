import { type JSX, useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import useLocalePath from '../../hooks/useLocalePath';
import {
  type AppDispatch,
  type RootState,
  getLatestWorks,
  clearLatestWorks,
} from '../../store';
import LatestWorksGrid from './LatestWorksGrid';

const PREVIEW_SIZE = 6;

export default function LatestWorksPreview(): JSX.Element | null {
  const dispatch = useDispatch<AppDispatch>();
  const to = useLocalePath();
  const { t } = useTranslation('latestWorks');
  const { lang = 'ro' } = useParams();
  const { latestWorks } = useSelector((state: RootState) => state.latestWorks);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadPreview = useCallback(async () => {
    setIsLoading(true);
    try {
      await dispatch(getLatestWorks({ lang, limit: PREVIEW_SIZE })).unwrap();
    } catch (error) {
      console.error('Error fetching latest works:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, lang]);

  useEffect(() => {
    dispatch(clearLatestWorks());
    loadPreview();
  }, [dispatch, loadPreview]);

  if (!isLoading && latestWorks.length === 0) {
    return null;
  }

  return (
    <div className='latest-items-wrapper latest-works-preview'>
      <div className='latest-items-header'>
        <h3>{t('latest.header')}</h3>
        <Link to={to('/latest-works')}>
          {t('viewAll')} <span className='latest-works-arrow'>→</span>
        </Link>
      </div>
      <LatestWorksGrid
        works={latestWorks.slice(0, PREVIEW_SIZE)}
        isLoading={isLoading}
        skeletonCount={PREVIEW_SIZE}
      />
    </div>
  );
}
