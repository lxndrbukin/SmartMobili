import { type JSX, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import { useDispatch, useSelector } from 'react-redux';
import {
  type RootState,
  type AppDispatch,
  type ItemProps,
  getItems,
} from '../../store';
import CatalogItemSkeleton from './CatalogItemSkeleton';

export default function PopularItems(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const to = useLocalePath();
  const { t } = useTranslation('catalog');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { items } = useSelector((state: RootState) => state.catalog);
  const { currentLang } = useSelector((state: RootState) => state.system);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(getItems({ limit: 4, lang: currentLang })).unwrap();
      setIsLoading(false);
    };
    fetchData();
  }, [currentLang]);

  const renderItems = (items: Array<ItemProps>) => {
    return items.map(({ images, title, id, price, category }) => {
      return (
        <div
          onClick={() => navigate(to(`/catalog/${category.slug}/${id}`))}
          className='catalog-item'
        >
          {images[0] ? (
            <img src={images[0].image_url} alt={`${title} ${id}`} />
          ) : (
            <div className='catalog-item-no-image'>
              <i className='fas fa-image'></i>
            </div>
          )}
          <div className='catalog-item-info'>
            <span>{category.name}</span>
            <h3>{title}</h3>
            {price ? <p>{price} MDL</p> : null}
          </div>
        </div>
      );
    });
  };

  const renderSkeleton = () => {
    return Array(3)
      .fill('')
      .map((_, index) => {
        return <CatalogItemSkeleton key={index} />;
      });
  };

  return (
    <div className='popular-items-wrapper'>
      <div className='popular-items-header'>
        <h3>{t('popular.header')}</h3>
        <Link to={to('/catalog')}>{t('generic.allItems')} →</Link>
      </div>
      <div className='popular-items'>
        {items.length ? renderItems(items) : renderSkeleton()}
      </div>
    </div>
  );
}
