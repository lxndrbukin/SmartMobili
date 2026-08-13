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
  const { catSlug, subSlug, lang } = useParams<{ catSlug: string; subSlug?: string; lang: string }>();
  const { categories, categoriesLoaded } = useSelector((state: RootState) => state.catalog);
  const [items, setItems] = useState<ItemProps[]>([]);
  const [itemsLoaded, setItemsLoaded] = useState<boolean>(false);
  const [prevKey, setPrevKey] = useState<string>('');
  const { t } = useTranslation('catalog');

  const currentKey = `${catSlug || ''}-${subSlug || ''}-${lang || ''}`;
  if (currentKey !== prevKey) {
    setPrevKey(currentKey);
    setItemsLoaded(false);
    setItems([]);
  }

  useEffect(() => {
    dispatch(getCategories(lang));
  }, [dispatch, lang]);

  // Find the active category (if subSlug exists, find subcategory, else find parent category)
  const activeCategory = subSlug
    ? categories.find((cat) => cat.slug === subSlug)
    : categories.find((cat) => cat.slug === catSlug);

  // Find parent category if we are in a subcategory
  const parentCategory = activeCategory?.parent_slug
    ? categories.find((cat) => cat.slug === activeCategory.parent_slug)
    : (subSlug ? categories.find((cat) => cat.slug === catSlug) : undefined);

  // Get sibling subcategories for navigation (if we're in parent, they are the children. if we are in child, they are sibling children of the parent)
  const subcategories = categories.filter((cat) => {
    const parentIdToMatch = parentCategory ? parentCategory.id : activeCategory?.id;
    return cat.parent_id === parentIdToMatch;
  });

  useEffect(() => {
    if (categories.length > 0 && activeCategory) {
      dispatch(
        getItems({
          lang: lang || 'ro',
          categorySlug: activeCategory.slug,
        }),
      ).then((result) => {
        setItems(Array.isArray(result.payload) ? result.payload : []);
        setItemsLoaded(true);
      });
    } else if (categoriesLoaded && !activeCategory) {
      setItemsLoaded(true);
    }
  }, [categories, activeCategory, categoriesLoaded, lang, dispatch]);

  const renderSkeleton = () => {
    return Array(6)
      .fill('')
      .map((_, index) => {
        return <CatalogItemSkeleton key={index} />;
      });
  };

  const renderSubcategoryTabs = () => {
    if (subcategories.length === 0) return null;

    const parentSlug = parentCategory ? parentCategory.slug : activeCategory?.slug;

    return (
      <div className='catalog-subcategories-nav'>
        <Link
          to={to(`/catalog/${parentSlug}`)}
          className={`subcategory-tab ${!subSlug ? 'active' : ''}`}
        >
          {t('generic.allItems')}
        </Link>
        {subcategories.map((sub) => {
          const isActive = subSlug === sub.slug;
          return (
            <Link
              key={sub.id}
              to={to(`/catalog/${parentSlug}/${sub.slug}`)}
              className={`subcategory-tab ${isActive ? 'active' : ''}`}
            >
              {sub.name}
              {sub.item_count > 0 && <span className='subcategory-count'>{sub.item_count}</span>}
            </Link>
          );
        })}
      </div>
    );
  };

  if (categoriesLoaded && !activeCategory) {
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

  if (!categoriesLoaded || !activeCategory) {
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

  const heroImage = activeCategory.images?.length ? activeCategory.images[0].image_url : null;

  const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://smartmobili.md';
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t('breadcrumbs.home'), item: `${SITE_URL}/${lang}` },
      { '@type': 'ListItem', position: 2, name: t('breadcrumbs.catalog'), item: `${SITE_URL}/${lang}/catalog` },
      ...(parentCategory
        ? [
            { '@type': 'ListItem', position: 3, name: parentCategory.name, item: `${SITE_URL}/${lang}/catalog/${parentCategory.slug}` },
            { '@type': 'ListItem', position: 4, name: activeCategory.name, item: `${SITE_URL}/${lang}/catalog/${parentCategory.slug}/${activeCategory.slug}` }
          ]
        : [{ '@type': 'ListItem', position: 3, name: activeCategory.name, item: `${SITE_URL}/${lang}/catalog/${activeCategory.slug}` }])
    ],
  };

  return (
    <div className='catalog-section-page'>
      <SeoHead
        title={activeCategory.name}
        description={t('seo.categoryDescription', { category: activeCategory.name, count: activeCategory.item_count })}
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
            {parentCategory && (
              <>
                <Link to={to(`/catalog/${parentCategory.slug}`)}>
                  {parentCategory.name}
                </Link>
                {' / '}
              </>
            )}
            <Link to={to(parentCategory ? `/catalog/${parentCategory.slug}/${activeCategory.slug}` : `/catalog/${activeCategory.slug}`)}>
              {activeCategory.name}
            </Link>
          </div>
          <h1 className='catalog-section-hero-title'>{activeCategory.name}</h1>
          <span className='catalog-section-hero-meta'>
            {t('items', { count: activeCategory.item_count })}
          </span>
        </div>
      </div>

      <div className='catalog-section-content'>
        {renderSubcategoryTabs()}
        {!itemsLoaded ? (
          <div className='catalog-section-items'>{renderSkeleton()}</div>
        ) : items.length > 0 ? (
          <div className='catalog-section-items'>
            {items.map((item) => {
              const itemUrl = item.category.parent_slug
                ? `/catalog/${item.category.parent_slug}/${item.category.slug}/item/${item.id}`
                : `/catalog/${item.category.slug}/item/${item.id}`;
              return (
                <CatalogItem
                  key={item.id}
                  id={item.id}
                  categoryName={item.category.name}
                  title={item.title}
                  images={item.images}
                  price={item.price}
                  url={to(itemUrl)}
                />
              );
            })}
          </div>
        ) : (
          <div className='catalog-empty'>{t('generic.noItems')}</div>
        )}
      </div>
    </div>
  );
}
