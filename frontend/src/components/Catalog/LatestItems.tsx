import { type JSX, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  type AppDispatch,
  type ItemProps,
  getItems,
  clearItems,
} from '../../store';
import CatalogItem from './CatalogItem';
import CatalogItemSkeleton from './CatalogItemSkeleton';

export default function LatestItems(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const to = useLocalePath();
  const { t } = useTranslation('catalog');
  const [latestItems, setLatestItems] = useState<ItemProps[]>([]);
  const [itemsLoaded, setItemsLoaded] = useState<boolean>(false);
  const { lang } = useParams();

  useEffect(() => {
    dispatch(clearItems());
    setItemsLoaded(false);
    const fetchData = async () => {
      try {
        const result = await dispatch(
          getItems({ limit: 4, lang: lang ?? 'ro', desc: true }),
        ).unwrap();
        setLatestItems(Array.isArray(result) ? result : []);
      } catch (error) {
        console.error('Error fetching latest items:', error);
      } finally {
        setItemsLoaded(true);
      }
    };
    fetchData();
  }, [dispatch, lang]);

  const renderItems = (items: Array<ItemProps>) => {
    return items.map(({ images, title, id, price, category }) => {
      const item_url = category.parent_slug
        ? `/catalog/${category.parent_slug}/${category.slug}/item/${id}`
        : `/catalog/${category.slug}/item/${id}`;
      return (
        <CatalogItem
          key={id}
          id={id}
          url={to(item_url)}
          images={images}
          price={price}
          categoryName={category.name}
          title={title}
        />
      );
    });
  };

  const renderSkeleton = () => {
    return Array(4)
      .fill('')
      .map((_, index) => {
        return <CatalogItemSkeleton key={index} />;
      });
  };

  return (
    <div className='latest-items-wrapper'>
      <div className='latest-items-header'>
        <h3>{t('latest.header')}</h3>
        <Link to={to('/catalog')}>{t('generic.allItems')} →</Link>
      </div>
      <div className='latest-items'>
        {itemsLoaded ? (
          latestItems.length > 0 ? (
            renderItems(latestItems)
          ) : (
            <div className='catalog-empty'>{t('generic.noItems')}</div>
          )
        ) : (
          renderSkeleton()
        )}
      </div>
    </div>
  );
}
