import { type JSX, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const { currentLang } = useSelector((state: RootState) => state.system);

  useEffect(() => {
    const fetchData = async () => {
      // setIsLoading(true);
      await dispatch(getCategories(currentLang)).unwrap();
      // setIsLoading(false);
    };
    fetchData();
  }, [currentLang]);

  const baseImgURL =
    'https://raw.githubusercontent.com/lxndrbukin/shkafmaster-new/refs/heads/main/public/imgs';

  const header = t('header');

  const renderSkeleton = () => {
    return Array(3)
      .fill('')
      .map((_, index) => {
        return <CategorySkeleton key={index} />;
      });
  };

  const renderCategories = (categories: Array<CategoryProps>) => {
    return categories.map((category) => {
      return (
        <Link
          key={category.id}
          to={to(`/catalog/${category.slug}`)}
          className={`category ${category.slug}`}
        >
          <img
            src={`${baseImgURL}/menu_${category.slug.replace('s', '')}.png`}
            className='category-bg'
          />
          <span className='category-header'>{category.name.toUpperCase()}</span>
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
