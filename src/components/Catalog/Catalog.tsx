import { type JSX, useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import pageTitle from '../../utils/pageTitle';
import { title } from './assets/title';
import useLocalePath from '../../hooks/useLocalePath';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  type AppDispatch,
  type RootState,
  type ItemProps,
  type CategoryProps,
  getItems,
  getCategories,
} from '../../store';
import CatalogItem from './CatalogItem';
import CatalogItemSkeleton from './CatalogItemSkeleton';
import TelegramBanner from '../Banners/TelegramBanner';

export default function Catalog(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const to = useLocalePath();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { categories } = useSelector((state: RootState) => state.catalog);
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [itemsByCategory, setItemsByCategory] = useState<
    Record<number, ItemProps[]>
  >({});

  const isAdmin = user && user.user_role === 'admin';

  const [, setSearchParams] = useSearchParams();
  pageTitle(title[lang as 'en' | 'ro' | 'ru']);
  const { t } = useTranslation('admin');

  useEffect(() => {
    dispatch(getCategories(lang));
  }, [dispatch, lang]);

  useEffect(() => {
    if (categories.length > 0) {
      categories.forEach(async (category) => {
        const result = await dispatch(
          getItems({
            lang: lang || 'ro',
            categoryId: category.id,
            limit: 5,
          }),
        );

        if (result.payload) {
          setItemsByCategory((prev) => ({
            ...prev,
            [category.id]: result.payload as ItemProps[],
          }));
        }
      });
    }
  }, [dispatch, categories, lang]);

  const handleCreateCategory = () => {
    setSearchParams({ createCategory: '1' });
  };
  const handleCreateItem = () => {
    setSearchParams({ createItem: '1' });
  };

  const renderSkeleton = () => {
    return Array(3)
      .fill('')
      .map((_, index) => {
        return <CatalogItemSkeleton key={index} />;
      });
  };

  const renderAdmin = () => {
    return (
      <div className='catalog-admin'>
        <button onClick={() => handleCreateCategory()}>
          {t('category.headerCreate')}
        </button>
        <button onClick={() => handleCreateItem()}>
          {t('item.headerCreate')}
        </button>
      </div>
    );
  };

  const renderCategories = (categories: Array<CategoryProps>) => {
    return categories.map((category) => {
      const categoryItems = itemsByCategory[category.id] || [];
      return (
        <div key={category.id} className='catalog-section'>
          <h1 onClick={() => navigate(to(`/catalog/${category.slug}`))}>
            {category.name.toUpperCase()}
            <i className='fa-solid fa-angle-right'></i>
          </h1>
          <div className='catalog-section-items'>
            {categoryItems.length > 0
              ? categoryItems.map((item) => (
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
    });
  };

  return (
    <div className='catalog'>
      <TelegramBanner />
      {token && isAdmin ? renderAdmin() : null}
      {renderCategories(categories)}
    </div>
  );
}
