import { type JSX, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import SeoHead from '../SeoHead';
import {
  type AppDispatch,
  type RootState,
  type ItemProps,
  getItems,
  getCategories,
} from '../../store';
import CatalogItem from './CatalogItem';
import CatalogItemSkeleton from './CatalogItemSkeleton';

export default function CatalogSection(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const to = useLocalePath();
  const { catSlug, lang } = useParams<{ catSlug: string; lang: string }>();
  const { categories, categoriesLoaded } = useSelector((state: RootState) => state.catalog);
  const [items, setItems] = useState<ItemProps[]>([]);
  const [itemsLoaded, setItemsLoaded] = useState<boolean>(false);
  const [prevKey, setPrevKey] = useState<string>('');
  const { t } = useTranslation('catalog');

  const currentKey = `${catSlug || ''}-${lang || ''}`;
  if (currentKey !== prevKey) {
    setPrevKey(currentKey);
    setItemsLoaded(false);
    setItems([]);
  }

  useEffect(() => {
    dispatch(getCategories(lang));
  }, [dispatch, lang]);

  useEffect(() => {
    if (categories.length > 0 && catSlug) {
      const category = categories.find((cat) => cat.slug === catSlug);

      if (category) {
        dispatch(
          getItems({
            lang: lang || 'ro',
            categorySlug: catSlug,
          }),
        ).then((result) => {
          setItems(Array.isArray(result.payload) ? result.payload : []);
          setItemsLoaded(true);
        });
      }
    }
  }, [categories, catSlug, lang, dispatch]);


  const renderSkeleton = () => {
    return Array(6)
      .fill('')
      .map((_, index) => {
        return <CatalogItemSkeleton key={index} />;
      });
  };

  const category = categories.find((cat) => cat.slug === catSlug);

  if (categoriesLoaded && !category) {
    return (
      <div className='catalog-section-page'>
        <div className='catalog-section-hero catalog-section-hero--no-image'>
          <div className='catalog-section-hero-content'>
            <div className='catalog-breadcrumbs'>
              <Link to={to('/')}>{t('breadcrumbs.home')}</Link> /{' '}
              <Link to={to('/catalog')}>{t('breadcrumbs.catalog')}</Link>
            </div>
          </div>
        </div>
        <div className='catalog-section-content'>
          <div className='catalog-not-found'>
            <i className='fas fa-search'></i>
            <p>{t('generic.categoryNotFound')}</p>
            <Link to={to('/catalog')} className='button'>
              {t('breadcrumbs.catalog')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!categoriesLoaded || !category) {
    return (
      <div className='catalog-section-page'>
        <div className='catalog-section-hero catalog-section-hero--no-image'>
          <div className='catalog-section-hero-content'>
            <div className='catalog-section-hero-skeleton'></div>
          </div>
        </div>
        <div className='catalog-section-content'>
          <div className='catalog-section-items'>{renderSkeleton()}</div>
        </div>
      </div>
    );
  }

  const heroImage = category.images?.length ? category.images[0].image_url : null;

  const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://smartmobili.md';
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('breadcrumbs.home'), item: `${SITE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: t('breadcrumbs.catalog'), item: `${SITE_URL}/${lang}/catalog` },
      { '@type': 'ListItem', position: 3, name: category.name, item: `${SITE_URL}/${lang}/catalog/${catSlug}` },
    ],
  };

  return (
    <div className='catalog-section-page'>
      <SeoHead
        title={category.name}
        description={t('seo.categoryDescription', { category: category.name, count: category.item_count })}
        lang={lang || 'ro'}
        ogImage={heroImage ?? undefined}
        jsonLd={breadcrumbJsonLd}
      />
      <div
        className={`catalog-section-hero${!heroImage ? ' catalog-section-hero--no-image' : ''}`}
        style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
      >
        <div className='catalog-section-hero-content'>
          <div className='catalog-breadcrumbs'>
            <Link to={to('/')}>{t('breadcrumbs.home')}</Link> /{' '}
            <Link to={to('/catalog')}>{t('breadcrumbs.catalog')}</Link> /{' '}
            <span>{category.name}</span>
          </div>
          <h1 className='catalog-section-hero-title'>{category.name}</h1>
          <span className='catalog-section-hero-meta'>
            {t('items', { count: category.item_count })}
          </span>
        </div>
      </div>

      <div className='catalog-section-content'>
        {!itemsLoaded ? (
          <div className='catalog-section-items'>{renderSkeleton()}</div>
        ) : items.length > 0 ? (
          <div className='catalog-section-items'>
            {items.map((item) => (
              <CatalogItem
                key={item.id}
                id={item.id}
                categoryName={item.category.name}
                title={item.title}
                images={item.images}
                price={item.price}
                url={to(`/catalog/${category.slug}/${item.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className='catalog-empty'>{t('generic.noItems')}</div>
        )}
      </div>
    </div>
  );
}
