import { type JSX, useEffect, useState } from 'react';
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

export default function Categories(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('categories');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const to = useLocalePath();

  const { categories } = useSelector((state: RootState) => state.catalog);
  const { currentLang } = useSelector((state: RootState) => state.system);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(getCategories(currentLang)).unwrap();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const baseImgURL =
    'https://raw.githubusercontent.com/lxndrbukin/shkafmaster-new/refs/heads/main/public/imgs';

  const header = t('header');

  const renderCategories = (categories: Array<CategoryProps>) => {
    return categories.map((category) => {
      return (
        <Link
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
        <div className='categories-list'>{renderCategories(categories)}</div>
      </div>
    </div>
  );
}
