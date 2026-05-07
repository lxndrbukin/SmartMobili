import { type JSX, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
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
  const { t } = useTranslation('catalog');

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
          if (result.payload) {
            setItems(result.payload);
          }
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
        <div className='catalog-not-found'>
          <i className='fas fa-search'></i>
          <p>{t('generic.categoryNotFound')}</p>
          <Link to={to('/catalog')} className='button'>
            {t('breadcrumbs.catalog')}
          </Link>
        </div>
      </div>
    );
  }

  if (!categoriesLoaded || !category) {
    return (
      <div className='catalog-section-page'>
        <h1 className='catalog-section-h1-skeleton'></h1>
        <div className='catalog-section-items'>{renderSkeleton()}</div>
      </div>
    );
  }

  return (
    <div className='catalog-section-page'>
      <div className='catalog-breadcrumbs'>
        <Link to={to('/')}>{t('breadcrumbs.home')}</Link> /{' '}
        <Link to={to('/catalog')}>{t('breadcrumbs.catalog')}</Link> /{' '}
        <span>{category.name}</span>
      </div>
      <h1>{category.name}</h1>
      <div className='catalog-section-items'>
        {items.length > 0
          ? items.map((item) => (
              <CatalogItem
                key={item.id}
                id={item.id}
                categoryName={item.category.name}
                title={item.title}
                images={item.images}
                price={item.price}
                url={to(`/catalog/${category.slug}/${item.id}`)}
              />
            ))
          : renderSkeleton()}
      </div>
    </div>
  );
}
