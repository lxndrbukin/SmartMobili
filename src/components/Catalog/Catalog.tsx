import { type JSX, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import pageTitle from '../../utils/pageTitle';
import { title } from './assets/title';
import useLocalePath from '../../hooks/useLocalePath';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  type ItemProps,
  type CategoryProps,
  getItems,
  getCategories,
} from '../../store';
import CatalogItem from './CatalogItem';
import CatalogItemSkeleton from './CatalogItemSkeleton';

export default function Catalog(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const to = useLocalePath();
  const { t } = useTranslation('catalog');
  const { lang } = useParams<{ lang: string }>();
  const { categories, items } = useSelector(
    (state: RootState) => state.catalog,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();
  pageTitle(title[lang as 'en' | 'ro' | 'ru']);
  const categorySlug = searchParams.get('category');
  useEffect(() => {
    dispatch(getCategories(lang));
  }, [dispatch, lang]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (categorySlug) {
        await dispatch(
          getItems({
            lang: lang || 'ro',
            categorySlug: String(categorySlug),
            limit: 5,
          }),
        ).unwrap();
      } else {
        await dispatch(
          getItems({
            lang: lang || 'ro',
            limit: 5,
          }),
        ).unwrap();
      }
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, categorySlug, lang]);

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
          return (
            <CatalogItem
              key={item.id}
              id={item.id}
              categoryName={item.category.name}
              title={item.title}
              price={item.price}
              image={item.images.length ? item.images[0].image_url : ''}
              url={to(`/catalog/${item.category.slug}/${item.id}`)}
            />
          );
        })}
      </div>
    );
  };

  const renderCategories = (categories: Array<CategoryProps>) => {
    return categories.map((category) => {
      return (
        <button
          className={
            categorySlug && String(categorySlug) === category.slug
              ? 'active'
              : ''
          }
          onClick={() => setSearchParams({ category: String(category.slug) })}
        >
          {category.name}
        </button>
      );
    });
  };

  return (
    <div className='catalog'>
      <h1>{t('header')}</h1>

      <div className='catalog-categories'>
        <button
          className={!categorySlug ? 'active' : ''}
          onClick={() => setSearchParams({})}
        >
          {t('generic.allItems')}
        </button>
        {renderCategories(categories)}
      </div>
      {items.length ? renderItems(items) : renderSkeleton()}
    </div>
  );
}
