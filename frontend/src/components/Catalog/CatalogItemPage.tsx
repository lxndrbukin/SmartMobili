import { type JSX, useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import SeoHead from '../SeoHead';
import { useDispatch, useSelector } from 'react-redux';
import {
  type RootState,
  type AppDispatch,
  type ImageProps,
  getItem,
} from '../../store';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import CatalogItemPageSkeleton from './CatalogItemPageSkeleton';

export default function CatalogItemPage(): JSX.Element {
  const { t } = useTranslation('catalog');
  const to = useLocalePath();
  const { itemId, lang } = useParams<{ itemId: string; lang: string }>();
  const [, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const { currentItem, itemNotFound } = useSelector((state: RootState) => state.catalog);
  const [prevItemId, setPrevItemId] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');

  const handleImageSelection = (images: Array<ImageProps>) => {
    const imageData = images.find((image) => image.order === 0);
    return imageData?.image_url;
  };

  if (currentItem && currentItem.id !== prevItemId) {
    setPrevItemId(currentItem.id);
    setCurrentImage(handleImageSelection(currentItem.images) ?? '');
  }

  useEffect(() => {
    if (itemId) {
      dispatch(getItem({ itemId: parseInt(itemId), lang }));
    }
  }, [itemId, lang, dispatch]);


  if (itemNotFound) {
    return (
      <div className='catalog-item-page'>
        <div className='catalog-not-found'>
          <i className='fas fa-search'></i>
          <p>{t('itemPage.notFound')}</p>
          <Link to={to('/catalog')} className='button'>
            {t('breadcrumbs.catalog')}
          </Link>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return <CatalogItemPageSkeleton />;
  }

  const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://smartmobili.md';
  const firstImage = currentItem.images.find((img) => img.order === 0)?.image_url;

  const productJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: currentItem.title,
    description: currentItem.description?.slice(0, 300) || currentItem.title,
    brand: { '@type': 'Brand', name: 'SmartMobili' },
  };
  if (firstImage) productJsonLd.image = firstImage;
  if (currentItem.price) {
    productJsonLd.offers = {
      '@type': 'Offer',
      priceCurrency: 'MDL',
      price: currentItem.price,
      availability: 'https://schema.org/InStock',
    };
  }

  const itemJsonLd = [
    productJsonLd,
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('breadcrumbs.home'), item: `${SITE_URL}/${lang}` },
        { '@type': 'ListItem', position: 2, name: t('breadcrumbs.catalog'), item: `${SITE_URL}/${lang}/catalog` },
        { '@type': 'ListItem', position: 3, name: currentItem.category.name, item: `${SITE_URL}/${lang}/catalog/${currentItem.category.slug}` },
        { '@type': 'ListItem', position: 4, name: currentItem.title, item: `${SITE_URL}/${lang}/catalog/${currentItem.category.slug}/${itemId}` },
      ],
    },
  ];

  return (
    <div className='catalog-item-page'>
      <SeoHead
        title={currentItem.title}
        description={t('seo.itemDescription', { title: currentItem.title })}
        lang={lang || 'ro'}
        ogImage={firstImage}
        jsonLd={itemJsonLd}
      />
      <div className='catalog-breadcrumbs'>
        <Link to={to('/')}>{t('breadcrumbs.home')}</Link> /{' '}
        <Link to={to('/catalog')}>{t('breadcrumbs.catalog')}</Link> /{' '}
        <Link to={to(`/catalog/${currentItem.category.slug}`)}>
          {currentItem.category.name}
        </Link>{' '}
        / <span>{currentItem.title}</span>
      </div>
      <div className='catalog-item-page-container'>
        <div className='catalog-item-page-gallery'>
          {currentItem.images.length > 0 ? (
            <img
              src={currentImage}
              alt={currentItem.title}
              className='catalog-item-page-main-image'
            />
          ) : (
            <div className='catalog-item-page-no-image'>
              <i className='fas fa-image'></i>
            </div>
          )}

          {currentItem.images.length > 1 && (
            <div className='catalog-item-page-thumbnails'>
              {currentItem.images.map((image) => (
                <img
                  key={image.id}
                  src={image.image_url}
                  alt={`${currentItem.title} - ${image.order}`}
                  className='catalog-item-page-thumbnail'
                  onClick={() => setCurrentImage(image.image_url)}
                />
              ))}
            </div>
          )}
        </div>

        <div className='catalog-item-page-info'>
          <Link
            className='catalog-item-page-category'
            to={to(`/catalog/${currentItem.category.slug}`)}
          >
            {currentItem.category.name}
          </Link>
          <h1 className='catalog-item-page-title'>{currentItem.title}</h1>
          <div className='catalog-item-page-price'>
            {currentItem.price
              ? `${currentItem.price.toFixed(2)} MDL`
              : t('itemPage.noPrice')}
          </div>

          <div className='catalog-item-page-description'>
            <h3>{t('itemPage.description')}</h3>
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
              {currentItem.description}
            </ReactMarkdown>
          </div>

          <div className='catalog-item-page-actions'>
            <button
              className='button'
              onClick={() =>
                setSearchParams({
                  createInquiry: 'true',
                  itemId: String(itemId),
                })
              }
            >
              {t('itemPage.call')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
