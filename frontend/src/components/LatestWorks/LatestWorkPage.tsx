import { type JSX, useEffect, useState, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import SeoHead from '../SeoHead';
import { useDispatch, useSelector } from 'react-redux';
import {
  type RootState,
  type AppDispatch,
  type LatestWorkImageProps,
  getLatestWork,
} from '../../store';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import CatalogItemPageSkeleton from '../Catalog/CatalogItemPageSkeleton';
import ImageViewer from 'react-simple-image-viewer';
import { optimizeCloudinaryImage } from '../../assets/utils';

export default function LatestWorkPage(): JSX.Element {
  const { t } = useTranslation('latestWorks');
  const to = useLocalePath();
  const { workId, lang = 'ro' } = useParams<{
    workId: string;
    lang: string;
  }>();
  const [, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const { currentLatestWork, latestWorkNotFound } = useSelector(
    (state: RootState) => state.latestWorks,
  );
  const [prevWorkId, setPrevWorkId] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [currentImgIdx, setCurrentImgIdx] = useState<number>(0);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

  const handleImageSelection = (imgs: Array<LatestWorkImageProps>) => {
    if (!imgs || imgs.length === 0) return undefined;
    const imageData = imgs.find((image) => image.order === 0) || imgs[0];
    return imageData?.image_url;
  };

  if (currentLatestWork && currentLatestWork.id !== prevWorkId) {
    setPrevWorkId(currentLatestWork.id);
    setCurrentImage(handleImageSelection(currentLatestWork.images) ?? '');
    setCurrentImgIdx(0);
  }

  useEffect(() => {
    if (workId) {
      dispatch(getLatestWork({ latestWorkId: parseInt(workId), lang }));
    }
  }, [workId, lang, dispatch]);

  const openImageViewer = useCallback((index: number) => {
    setCurrentImgIdx(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  if (latestWorkNotFound) {
    return (
      <div className='catalog-item-page'>
        <div className='catalog-not-found'>
          <i className='fas fa-search'></i>
          <p>{t('notFound')}</p>
          <Link to={to('/latest-works')} className='button'>
            {t('header')}
          </Link>
        </div>
      </div>
    );
  }

  if (!currentLatestWork) {
    return <CatalogItemPageSkeleton />;
  }

  const SITE_URL =
    (import.meta.env.VITE_SITE_URL as string | undefined) ??
    'https://smartmobili.md';
  const images = currentLatestWork.images.map((image) => image.image_url);
  const firstImage = handleImageSelection(currentLatestWork.images);
  const workUrl = `${SITE_URL}/${lang}/latest-works/${workId}`;
  const date = new Date(currentLatestWork.created_at).toLocaleDateString(
    lang,
    { year: 'numeric', month: 'long', day: 'numeric' },
  );

  const workJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: currentLatestWork.title,
    description:
      currentLatestWork.description?.slice(0, 300) || currentLatestWork.title,
    dateCreated: currentLatestWork.created_at,
    creator: { '@type': 'LocalBusiness', name: 'SmartMobili' },
    url: workUrl,
  };
  if (firstImage) workJsonLd.image = firstImage;

  const fullJsonLd = [
    workJsonLd,
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('breadcrumbs.home'),
          item: `${SITE_URL}/${lang}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('header'),
          item: `${SITE_URL}/${lang}/latest-works`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: currentLatestWork.title,
          item: workUrl,
        },
      ],
    },
  ];

  return (
    <>
      <div className='catalog-item-page'>
        <SeoHead
          title={currentLatestWork.title}
          description={t('seo.itemDescription', {
            title: currentLatestWork.title,
          })}
          lang={lang}
          ogImage={firstImage}
          jsonLd={fullJsonLd}
        />
        <div className='catalog-breadcrumbs'>
          <Link to={to('/')}>{t('breadcrumbs.home')}</Link> /{' '}
          <Link to={to('/latest-works')}>{t('header')}</Link> /{' '}
          <span>{currentLatestWork.title}</span>
        </div>
        <div className='catalog-item-page-container'>
          <div className='catalog-item-page-gallery'>
            {currentImage ? (
              <img
                src={optimizeCloudinaryImage(currentImage)}
                alt={currentLatestWork.title}
                className='catalog-item-page-main-image'
                onClick={() => openImageViewer(currentImgIdx)}
              />
            ) : (
              <div className='catalog-item-page-no-image'>
                <i className='fas fa-image'></i>
              </div>
            )}
            {currentLatestWork.images.length > 1 && (
              <div className='catalog-item-page-thumbnails'>
                {currentLatestWork.images.map((image, idx) => (
                  <img
                    key={image.id}
                    src={optimizeCloudinaryImage(image.image_url, 'icon')}
                    alt={`${currentLatestWork.title} - ${image.order}`}
                    className='catalog-item-page-thumbnail'
                    onClick={() => {
                      setCurrentImage(image.image_url);
                      setCurrentImgIdx(idx);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className='catalog-item-page-info'>
            <time
              className='catalog-item-page-category'
              dateTime={currentLatestWork.created_at}
            >
              {date}
            </time>
            <h1 className='catalog-item-page-title'>
              {currentLatestWork.title}
            </h1>

            <div className='catalog-item-page-description'>
              {currentLatestWork.description && (
                <>
                  <h3>{t('description')}</h3>
                  <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                    {currentLatestWork.description}
                  </ReactMarkdown>
                </>
              )}
            </div>
            <div className='catalog-item-page-actions'>
              <button
                className='button'
                onClick={() => setSearchParams({ createInquiry: 'true' })}
              >
                {t('call')}
              </button>
            </div>
          </div>
        </div>
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={images.length ? images : [currentImage]}
          currentIndex={currentImgIdx}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
          backgroundStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        />
      )}
    </>
  );
}
