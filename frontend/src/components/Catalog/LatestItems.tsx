import { type JSX, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import { useDispatch, useSelector } from 'react-redux';
import {
  type RootState,
  type AppDispatch,
  type ItemProps,
  getItems,
} from '../../store';
import CatalogItem from './CatalogItem';
import CatalogItemSkeleton from './CatalogItemSkeleton';

export default function LatestItems(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const to = useLocalePath();
  const { t } = useTranslation('catalog');
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const { items } = useSelector((state: RootState) => state.catalog);
  const { currentLang } = useSelector((state: RootState) => state.system);

  useEffect(() => {
    const fetchData = async () => {
      // setIsLoading(true);
      await dispatch(
        getItems({ limit: 4, lang: currentLang, desc: true }),
      ).unwrap();
      // setIsLoading(false);
    };
    fetchData();
  }, [currentLang]);

  const renderItems = (items: Array<ItemProps>) => {
    return items.map(({ images, title, id, price, category }) => {
      return (
        <CatalogItem
          key={id}
          id={id}
          url={to(`/catalog/${category.slug}/${id}`)}
          images={images}
          price={price}
          categoryName={category.name}
          title={title}
        />
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
    <div className='latest-items-wrapper'>
      <div className='latest-items-header'>
        <h3>{t('latest.header')}</h3>
        <Link to={to('/catalog')}>{t('generic.allItems')} →</Link>
      </div>
      <div className='latest-items'>
        {items.length ? renderItems(items) : renderSkeleton()}
      </div>
    </div>
  );
}
