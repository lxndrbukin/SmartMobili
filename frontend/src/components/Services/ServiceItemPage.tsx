import { type JSX, useEffect, useState, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import SeoHead from '../SeoHead';
import { useDispatch, useSelector } from 'react-redux';
import {
  type RootState,
  type AppDispatch,
  type ServiceImageProps,
  getService,
} from '../../store';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import ServiceItemPageSkeleton from './ServiceItemPageSkeleton';
import ImageViewer from 'react-simple-image-viewer';
import { optimizeCloudinaryImage } from '../../assets/utils';

export default function ServiceItemPage(): JSX.Element {
  const { t } = useTranslation('services');
  const to = useLocalePath();
  const { serviceId, itemId, lang } = useParams<{
    serviceId?: string;
    itemId?: string;
    lang: string;
  }>();
  const activeId = serviceId || itemId;
  const [, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const { currentService, serviceNotFound } = useSelector(
    (state: RootState) => state.services,
  );
  const [prevServiceId, setPrevServiceId] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [currentImgIdx, setCurrentImgIdx] = useState<number>(0);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const images: Array<string> = [];

  const handleImageSelection = (imgs: Array<ServiceImageProps>) => {
    if (!imgs || imgs.length === 0) return undefined;
    const imageData =
      imgs.find((image) => image.order === 0) || imgs[0];

    return imageData?.image_url;
  };

  if (currentService && currentService.id !== prevServiceId) {
    setPrevServiceId(currentService.id);
    setCurrentImage(handleImageSelection(currentService.images) ?? '');
  }

  useEffect(() => {
    if (activeId) {
      dispatch(getService({ serviceId: parseInt(activeId), lang }));
    }
  }, [activeId, lang, dispatch]);

  const openImageViewer = useCallback((index: number) => {
    setCurrentImgIdx(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  if (serviceNotFound) {
    return (
      <div className='catalog-item-page'>
        <div className='catalog-not-found'>
          <i className='fas fa-search'></i>
          <p>{t('itemPage.notFound')}</p>
          <Link to={to('/services')} className='button'>
            {t('breadcrumbs.services')}
          </Link>
        </div>
      </div>
    );
  }

  if (!currentService) {
    return <ServiceItemPageSkeleton />;
  }

  const SITE_URL =
    (import.meta.env.VITE_SITE_URL as string | undefined) ??
    'https://smartmobili.md';
  const firstImage =
    currentService.images.find((img) => img.order === 0)?.image_url ||
    currentService.images[0]?.image_url;

  const serviceJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: currentService.title,
    description: currentService.description?.slice(0, 300) || currentService.title,
    provider: { '@type': 'LocalBusiness', name: 'SmartMobili' },
  };
  if (firstImage) serviceJsonLd.image = firstImage;
  if (currentService.price) {
    serviceJsonLd.offers = {
      '@type': 'Offer',
      priceCurrency: currentService.currency || 'MDL',
      price: currentService.price,
    };
  }

  const serviceCategoryUrl = currentService.category.parent_slug
    ? `${SITE_URL}/${lang}/services/${currentService.category.parent_slug}/${currentService.category.slug}`
    : `${SITE_URL}/${lang}/services/${currentService.category.slug}`;

  const serviceUrl = currentService.category.parent_slug
    ? `${SITE_URL}/${lang}/services/${currentService.category.parent_slug}/${currentService.category.slug}/service/${activeId}`
    : `${SITE_URL}/${lang}/services/${currentService.category.slug}/service/${activeId}`;

  const breadcrumbElements = [
    {
      '@type': 'ListItem',
      position: 1,
      name: t('breadcrumbs.home'),
      item: `${SITE_URL}/${lang}`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: t('breadcrumbs.services'),
      item: `${SITE_URL}/${lang}/services`,
    },
  ];

  if (currentService.category.parent_name && currentService.category.parent_slug) {
    breadcrumbElements.push({
      '@type': 'ListItem',
      position: 3,
      name: currentService.category.parent_name,
      item: `${SITE_URL}/${lang}/services/${currentService.category.parent_slug}`,
    });
    breadcrumbElements.push({
      '@type': 'ListItem',
      position: 4,
      name: currentService.category.name,
      item: serviceCategoryUrl,
    });
    breadcrumbElements.push({
      '@type': 'ListItem',
      position: 5,
      name: currentService.title,
      item: serviceUrl,
    });
  } else {
    breadcrumbElements.push({
      '@type': 'ListItem',
      position: 3,
      name: currentService.category.name,
      item: serviceCategoryUrl,
    });
    breadcrumbElements.push({
      '@type': 'ListItem',
      position: 4,
      name: currentService.title,
      item: serviceUrl,
    });
  }

  const fullJsonLd = [
    serviceJsonLd,
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbElements,
    },
  ];

  const categoryLinkTo = to(
    currentService.category.parent_slug
      ? `/services/${currentService.category.parent_slug}/${currentService.category.slug}`
      : `/services/${currentService.category.slug}`,
  );

  return (
    <>
      <div className='catalog-item-page'>
        <SeoHead
          title={currentService.title}
          description={t('seo.itemDescription', { title: currentService.title })}
          lang={lang || 'ro'}
          ogImage={firstImage}
          jsonLd={fullJsonLd}
        />
        <div className='catalog-breadcrumbs'>
          <Link to={to('/')}>{t('breadcrumbs.home')}</Link> /{' '}
          <Link to={to('/services')}>{t('breadcrumbs.services')}</Link> /{' '}
          {currentService.category.parent_name && (
            <>
              <Link to={to(`/services/${currentService.category.parent_slug}`)}>
                {currentService.category.parent_name}
              </Link>
              {' / '}
            </>
          )}
          <Link to={categoryLinkTo}>{currentService.category.name}</Link> /{' '}
          <span>{currentService.title}</span>
        </div>
        <div className='catalog-item-page-container'>
          <div className='catalog-item-page-gallery'>
            {currentImage ? (
              <img
                src={optimizeCloudinaryImage(currentImage)}
                alt={currentService.title}
                className='catalog-item-page-main-image'
                onClick={() => openImageViewer(currentImgIdx)}
              />
            ) : (
              <div className='catalog-item-page-no-image'>
                <i className='fas fa-image'></i>
              </div>
            )}
            {currentService.images.length > 1 && (
              <div className='catalog-item-page-thumbnails'>
                {currentService.images.map((image, idx) => {
                  images.push(image.image_url);
                  return (
                    <img
                      key={image.id}
                      src={optimizeCloudinaryImage(image.image_url, 'icon')}
                      alt={`${currentService.title} - ${image.order}`}
                      className='catalog-item-page-thumbnail'
                      onClick={() => {
                        setCurrentImage(image.image_url);
                        setCurrentImgIdx(idx);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <div className='catalog-item-page-info'>
            <Link className='catalog-item-page-category' to={categoryLinkTo}>
              {currentService.category.name}
            </Link>
            <h1 className='catalog-item-page-title'>{currentService.title}</h1>
            {currentService.price ? (
              <div className='catalog-item-page-price'>
                <span className='catalog-item-page-price-value'>
                  {currentService.price}
                </span>{' '}
                <span className='catalog-item-page-price-currency'>
                  {currentService.currency || 'MDL'}
                </span>
              </div>
            ) : null}

            <div className='catalog-item-page-description'>
              {currentService.description && (
                <>
                  <h3>{t('itemPage.description')}</h3>
                  <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                    {currentService.description}
                  </ReactMarkdown>
                </>
              )}
            </div>
            <div className='catalog-item-page-actions'>
              <button
                className='button'
                onClick={() =>
                  setSearchParams({
                    createInquiry: 'true',
                    itemId: String(activeId),
                  })
                }
              >
                {t('itemPage.call')}
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
