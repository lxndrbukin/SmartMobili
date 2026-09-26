import { type JSX, useEffect, useState, useRef } from 'react';
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import SeoHead from '../SeoHead';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  type ItemProps,
  getItems,
  clearItems,
} from '../../store';
import CatalogItem from './CatalogItem';
import CatalogItemSkeleton from './CatalogItemSkeleton';
import Categories from './Categories';

const PAGE_SIZE = 10;
const HERO_IMAGE = '/banners/catalog-hero.jpg';
const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) ??
  'https://smartmobili.md';

export default function Catalog(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const to = useLocalePath();
  const { t } = useTranslation('catalog');
  const { lang } = useParams<{ lang: string }>();
  const { items } = useSelector((state: RootState) => state.catalog);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [skip, setSkip] = useState<number>(0);

  const lastFetchedRef = useRef<{
    searchQuery: string | null;
    lang: string | undefined;
    skip: number;
  }>({
    searchQuery: undefined as any,
    lang: undefined,
    skip: -1,
  });

  useEffect(() => {
    return () => {
      dispatch(clearItems());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }

    const isQueryChanged =
      lastFetchedRef.current.searchQuery !== searchQuery ||
      lastFetchedRef.current.lang !== lang;

    const targetSkip = isQueryChanged ? 0 : skip;

    if (
      lastFetchedRef.current.searchQuery === searchQuery &&
      lastFetchedRef.current.lang === lang &&
      lastFetchedRef.current.skip === targetSkip
    ) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      if (isQueryChanged) {
        dispatch(clearItems());
        setSkip(0);
      }

      lastFetchedRef.current = {
        searchQuery,
        lang,
        skip: targetSkip,
      };

      try {
        await dispatch(
          getItems({
            lang: lang || 'ro',
            searchQuery,
            skip: targetSkip,
            limit: PAGE_SIZE,
          }),
        ).unwrap();
      } catch (error) {
        console.error('Error fetching catalog search items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, lang, searchQuery, skip]);

  const renderSkeleton = () => {
    if (isLoading) {
      return (
        <div className='catalog-section-items'>
          {Array(3)
            .fill('')
            .map((_, index) => (
              <CatalogItemSkeleton key={index} />
            ))}
        </div>
      );
    }
    return <div className='catalog-no-items'>{t('generic.noItems')}</div>;
  };

  const renderItems = (itemsList: Array<ItemProps>) => {
    return (
      <div className='catalog-section-items'>
        {itemsList.map((item) => {
          const itemUrl = item.category.parent_slug
            ? `/catalog/${item.category.parent_slug}/${item.category.slug}/item/${item.id}`
            : `/catalog/${item.category.slug}/item/${item.id}`;
          return (
            <CatalogItem
              key={item.id}
              id={item.id}
              categoryName={item.category.name}
              title={item.title}
              price={item.price}
              images={item.images}
              url={to(itemUrl)}
            />
          );
        })}
      </div>
    );
  };

  const hero = (
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
  );

  const seoHead = (
    <SeoHead
      title={t('header')}
      description={t('seo.description')}
      lang={lang || 'ro'}
      ogImage={`${SITE_URL}${HERO_IMAGE}`}
    />
  );

  if (searchQuery) {
    return (
      <div className='catalog-page'>
        {seoHead}
        {hero}
        <div className='catalog'>
          <p>
            {t('search.header')} <b>{searchQuery}</b>
          </p>
          {items.length ? (
            <>
              <p>{t('search.results', { num: items.length })}</p>
              {renderItems(items)}
              {items.length >= skip + PAGE_SIZE && (
                <div className='catalog-load-more-container'>
                  <button
                    className='catalog-load-more-button'
                    disabled={isLoading}
                    onClick={() => setSkip((prev) => prev + PAGE_SIZE)}
                  >
                    {t('generic.loadMore')}
                  </button>
                </div>
              )}
            </>
          ) : isLoading ? (
            renderSkeleton()
          ) : (
            <div className='catalog-no-results'>
              <div className='catalog-no-items'>{t('generic.noItems')}</div>
              <button
                className='catalog-no-items-button'
                onClick={() => navigate(to('/catalog'))}
              >
                Catalog
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='catalog-page'>
      {seoHead}
      {hero}
      <div className='catalog'>
        <Categories showHeader={false} />
      </div>
    </div>
  );
}
