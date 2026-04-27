import { type JSX, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import { useSelector, useDispatch } from 'react-redux';
import {
  type AppDispatch,
  type RootState,
  type ItemProps,
  getItems,
} from '../../store';
import CatalogItem from './CatalogItem';
import CatalogItemSkeleton from './CatalogItemSkeleton';

export default function CatalogSearch(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang } = useParams<{ lang: string }>();
  const to = useLocalePath();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation('catalog');

  const { items } = useSelector((state: RootState) => state.catalog);

  const searchQuery = searchParams.get('search') as string;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(getItems({ lang: lang || 'ro', searchQuery })).unwrap();
      setIsLoading(false);
    };
    fetchData();
  }, []);

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
              images={item.images}
              url={to(`/catalog/${item.category.slug}/${item.id}`)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className='catalog'>
      <h4>
        Results for: <b>{searchQuery}</b>
      </h4>
      <p>{items.length} results found</p>
      {items.length ? renderItems(items) : renderSkeleton()}
    </div>
  );
}
