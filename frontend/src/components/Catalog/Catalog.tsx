import { type JSX, useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import SeoHead from '../SeoHead';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  type ItemProps,
  type CategoryProps,
  getItems,
  getCategories,
  clearItems
} from '../../store';
import CatalogItem from './CatalogItem';
import CatalogItemSkeleton from './CatalogItemSkeleton';

export default function Catalog(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const to = useLocalePath();
  const { t } = useTranslation('catalog');
  const { lang } = useParams<{ lang: string }>();
  const { categories, items } = useSelector(
    (state: RootState) => state.catalog,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const pageSize = 10;
  const [skip, setSkip] = useState<number>(0);

  const lastFetchedRef = useRef<{
    categorySlug: string | null;
    searchQuery: string | null;
    lang: string | undefined;
    skip: number;
  }>({
    categorySlug: undefined as any,
    searchQuery: undefined as any,
    lang: undefined,
    skip: -1,
  });

  useEffect(() => {
    dispatch(getCategories(lang));
    return () => {
      dispatch(clearItems());
    };
  }, [dispatch, lang]);

  useEffect(() => {
    const isQueryChanged =
      lastFetchedRef.current.categorySlug !== categorySlug ||
      lastFetchedRef.current.searchQuery !== searchQuery ||
      lastFetchedRef.current.lang !== lang;

    const targetSkip = isQueryChanged ? 0 : skip;

    if (
      lastFetchedRef.current.categorySlug === categorySlug &&
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
        categorySlug,
        searchQuery,
        lang,
        skip: targetSkip,
      };

      try {
        if (!searchQuery) {
          if (categorySlug) {
            await dispatch(
              getItems({
                lang: lang || 'ro',
                categorySlug: String(categorySlug),
                skip: targetSkip,
                limit: 10,
                desc: true,
              }),
            ).unwrap();
          } else {
            await dispatch(
              getItems({
                lang: lang || 'ro',
                skip: targetSkip,
                limit: 10,
                desc: true,
              }),
            ).unwrap();
          }
        } else {
          await dispatch(
            getItems({
              lang: lang || 'ro',
              searchQuery,
              skip: targetSkip,
              limit: 10,
            }),
          ).unwrap();
        }
      } catch (error) {
        console.error('Error fetching catalog items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, categorySlug, lang, searchQuery, skip]);

  const renderSkeleton = () => {
    if (isLoading) {
      return (
        <div className='catalog-section-items'>
          {Array(3)
            .fill('')
            .map((_, index) => {
              return <CatalogItemSkeleton key={index} />;
            })}
        </div>
      );
    }
    return <div className='catalog-no-items'>{t('generic.noItems')}</div>;
  };

  const renderItems = (items: Array<ItemProps>) => {
    return (
      <div className='catalog-section-items'>
        {items.map((item) => {
          const item_url = item.category.parent_slug ? `/catalog/${item.category.parent_slug}/${item.category.slug}/item/${item.id}` : `/catalog/${item.category.slug}/item/${item.id}`;
          return (
            <CatalogItem
              key={item.id}
              id={item.id}
              categoryName={item.category.name}
              title={item.title}
              price={item.price}
              images={item.images}
              url={to(item_url)}
            />
          );
        })}
      </div>
    );
  };

  const parentCategories = categories.filter((cat) => cat.parent_id === null);

  const getParentCategoryItemCount = (parentCat: CategoryProps) => {
    const subcategories = categories.filter((cat) => cat.parent_id === parentCat.id);
    const subcategoriesCount = subcategories.reduce((sum, cat) => sum + cat.item_count, 0);
    return parentCat.item_count + subcategoriesCount;
  };

  const totalParentItemsCount = parentCategories.reduce(
    (sum, cat) => sum + getParentCategoryItemCount(cat),
    0
  );

  const renderCategories = (categoriesList: Array<CategoryProps>) => {
    const parentCats = categoriesList.filter((cat) => cat.parent_id === null);
    return parentCats.map((category) => {
      const displayCount = getParentCategoryItemCount(category);
      return (
        <button
          key={category.id}
          className={
            categorySlug && String(categorySlug) === category.slug
              ? 'active'
              : ''
          }
          onClick={() => {
            setSearchParams({ category: String(category.slug) });
          }}
        >
          {category.name}
          {displayCount > 0 && <span className='category-count'>{displayCount}</span>}
        </button>
      );
    });
  };

  const renderSubcategoriesFilter = (categoriesList: Array<CategoryProps>, activeParentSlug: string) => {
    const parentCategory = categoriesList.find((cat) => cat.slug === activeParentSlug);
    if (!parentCategory) return null;
    const subcats = categoriesList.filter((cat) => cat.parent_id === parentCategory.id);
    if (subcats.length === 0) return null;

    return (
      <div className='catalog-subcategories-filter'>
        {subcats.map((sub) => (
          <button
            key={sub.id}
            onClick={() => navigate(to(`/catalog/${activeParentSlug}/${sub.slug}`))}
            className='subcategory-filter-pill'
          >
            {sub.name}
            {sub.item_count > 0 && <span className='category-count'>{sub.item_count}</span>}
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ))}
      </div>
    );
  };

  const hero = (
    <div className='catalog-section-hero catalog-section-hero--no-image'>
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
              {items.length >= skip + pageSize && (
                <div className='catalog-load-more-container'>
                  <button
                    className='catalog-load-more-button'
                    disabled={isLoading}
                    onClick={() => setSkip((prev) => prev + pageSize)}
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

  const activeCat = categorySlug ? categories.find(cat => cat.slug === categorySlug) : null;
  const activeTotalCount = activeCat ? getParentCategoryItemCount(activeCat) : totalParentItemsCount;

  return (
    <div className='catalog-page'>
      {seoHead}
      {hero}
      <div className='catalog'>
        <div className='catalog-categories'>
          <button
            className={!categorySlug ? 'active' : ''}
            onClick={() => {
              setSearchParams({});
            }}
          >
            {t('generic.allItems')}
            {totalParentItemsCount > 0 && <span className='category-count'>{totalParentItemsCount}</span>}
          </button>
          {renderCategories(categories)}
        </div>
        {categorySlug && renderSubcategoriesFilter(categories, categorySlug)}
        {items.length ? (
          <>
            {renderItems(items)}
            {items.length < activeTotalCount && (
              <div className='catalog-load-more-container'>
                <button
                  className='catalog-load-more-button'
                  disabled={isLoading}
                  onClick={() => setSkip((prev) => prev + pageSize)}
                >
                  {t('generic.loadMore')}
                </button>
              </div>
            )}
          </>
        ) : (
          renderSkeleton()
        )}
      </div>
    </div>
  );
}
