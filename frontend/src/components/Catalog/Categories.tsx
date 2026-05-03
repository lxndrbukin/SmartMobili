import { type JSX, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  type RootState,
  type AppDispatch,
  type CategoryProps,
  getCategories,
} from '../../store';
import CategorySkeleton from './CategorySkeleton';

export default function Categories(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('categories');
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const to = useLocalePath();

  const { categories } = useSelector((state: RootState) => state.catalog);
  const { lang } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      // setIsLoading(true);
      await dispatch(getCategories(lang)).unwrap();
      // setIsLoading(false);
    };
    fetchData();
  }, [lang]);

  const header = t('header');

  const renderSkeleton = () => {
    return Array(3)
      .fill('')
      .map((_, index) => {
        return <CategorySkeleton key={index} />;
      });
  };

  const renderCategories = (categories: Array<CategoryProps>) => {
    return categories.map(({ id, slug, images, name }) => {
      return (
        <Link
          key={id}
          to={to(`/catalog/${slug}`)}
          className={`category ${slug}`}
        >
          {images.length ? (
            <img className='category-bg' alt={name} src={images[0].image_url} />
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
    <div className='categories-wrapper'>
      <div className='categories'>
        <h3 className='categories-header'>{header}</h3>
        <div className='categories-list'>
          {categories.length ? renderCategories(categories) : renderSkeleton()}
        </div>
      </div>
    </div>
  );
}
