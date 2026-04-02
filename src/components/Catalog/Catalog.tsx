import { type JSX, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import {
  type AppDispatch,
  type RootState,
  type ItemProps,
  type CategoryProps,
  getItems,
  getCategories,
} from '../../store';
import CatalogItem from './CatalogItem';
import CategoryForm from '../Admin/Categories/CategoryForm';
import ItemForm from '../Admin/Items/ItemForm';

export default function Catalog(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const to = useLocalePath();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { categories } = useSelector((state: RootState) => state.catalog);
  const [itemsByCategory, setItemsByCategory] = useState<
    Record<number, ItemProps[]>
  >({});

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('editCategory');
  const itemId = searchParams.get('editItem');

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
  }, [categories, dispatch, lang]);

  const handleCreateCategory = () => {
    setSearchParams({ createCategory: '1' });
  };
  const handleCreateItem = () => {
    setSearchParams({ createItem: '1' });
  };

  const renderCategories = (categories: Array<CategoryProps>) => {
    return categories.map((category) => {
      const categoryItems = itemsByCategory[category.id] || [];

      return (
        <div key={category.id} className='catalog-section'>
          <h1 onClick={() => navigate(to(`/catalog/${category.slug}`))}>
            {category.name} <i className='fa-solid fa-angle-right'></i>
          </h1>
          <div className='catalog-section-items'>
            {categoryItems.length > 0 ? (
              categoryItems.map((item) => (
                <CatalogItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  image={item.images.length ? item.images[0].image_url : ''}
                  url={to(`/catalog/${category.slug}/${item.id}`)}
                />
              ))
            ) : (
              <div className='catalog-empty'>No items in this category</div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className='catalog'>
      <div>
        <button onClick={() => handleCreateCategory()}>Create Category</button>
        <button onClick={() => handleCreateItem()}>Create Item</button>
      </div>
      {renderCategories(categories)}
      {(categoryId || searchParams.get('createCategory')) && <CategoryForm />}
      {(itemId || searchParams.get('createItem')) && <ItemForm />}
    </div>
  );
}
