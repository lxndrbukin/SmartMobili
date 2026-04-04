import { type JSX, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
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
  const { categories } = useSelector((state: RootState) => state.catalog);
  const [items, setItems] = useState<ItemProps[]>([]);

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
            categoryId: category.id,
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

  if (!category) {
    return (
      <div className='catalog-section-page'>
        <h1 className='catalog-section-h1-skeleton'></h1>
        <div className='catalog-section-items'>{renderSkeleton()}</div>
      </div>
    );
  }

  return (
    <div className='catalog-section-page'>
      <h1>{category.name.toUpperCase()}</h1>
      <div className='catalog-section-items'>
        {items.length > 0
          ? items.map((item) => (
              <CatalogItem
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.images.length ? item.images[0].image_url : ''}
                url={to(`/catalog/${category.slug}/${item.id}`)}
              />
            ))
          : renderSkeleton()}
      </div>
    </div>
  );
}
