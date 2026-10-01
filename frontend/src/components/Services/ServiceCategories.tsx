import { type JSX, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  type RootState,
  type AppDispatch,
  type ServiceCategoryProps,
  getServiceCategories,
} from '../../store';
import ServiceCategorySkeleton from './ServiceCategorySkeleton';
import { optimizeCloudinaryImage } from '../../assets/utils';

export default function ServiceCategories({
  showHeader,
  limit,
}: {
  showHeader: boolean;
  limit?: number;
}): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('services');
  const to = useLocalePath();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { categories } = useSelector((state: RootState) => state.services);
  const { lang } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(getServiceCategories({ lang, limit })).unwrap();
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, lang, limit]);

  const header = t('header');

  const renderSkeleton = () => {
    return Array(3)
      .fill('')
      .map((_, index) => {
        return <ServiceCategorySkeleton key={index} />;
      });
  };

  const renderCategories = (categoriesList: Array<ServiceCategoryProps>) => {
    const parentCategories = categoriesList.filter(
      (cat) => cat.parent_id === null,
    );
    return parentCategories.map(({ id, slug, images, name }) => {
      return (
        <Link
          key={id}
          to={to(`/services/${slug}`)}
          className={`category ${slug}`}
        >
          {images && images.length ? (
            <img
              className='category-bg'
              alt={name}
              src={optimizeCloudinaryImage(images[0].image_url, 'thumbnail')}
            />
          ) : (
            <div className='catalog-item-no-image'>
              <i className='fas fa-image'></i>
            </div>
          )}

          <span className='category-header'>{name.toUpperCase()}</span>
        </Link>
      );
    });
  };

  return (
    <div
      className='categories-wrapper'
      style={{ padding: showHeader ? '48px 0 48px 0' : '0' }}
    >
      <div className='categories'>
        {showHeader && <h3 className='categories-header'>{header}</h3>}
        {!isLoading && !categories.length ? (
          <div className='catalog-empty'>{t('generic.noItems')}</div>
        ) : (
          <div className='categories-list'>
            {categories.length
              ? renderCategories(categories)
              : renderSkeleton()}
          </div>
        )}
      </div>
    </div>
  );
}
