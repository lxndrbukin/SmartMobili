import { type JSX, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import useLocalePath from "../../hooks/useLocalePath";
import {
  type AppDispatch,
  type RootState,
  type ItemProps,
  type CategoryProps,
  getItems,
  getCategories,
} from "../../store";
import CatalogItem from "./CatalogItem";

export default function Catalog(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const to = useLocalePath();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const { categories } = useSelector((state: RootState) => state.catalog);
  const [itemsByCategory, setItemsByCategory] = useState<
    Record<number, ItemProps[]>
  >({});

  useEffect(() => {
    dispatch(getCategories(lang));
  }, [dispatch, lang]);

  useEffect(() => {
    if (categories.length > 0) {
      categories.forEach(async (category) => {
        const result = await dispatch(
          getItems({
            lang: lang || "ro",
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

  const renderCategories = (categories: Array<CategoryProps>) => {
    return categories.map((category) => {
      const categoryItems = itemsByCategory[category.id] || [];

      return (
        <div key={category.id} className="catalog-section">
          <h1 onClick={() => navigate(to(`/catalog/${category.slug}`))}>
            {category.name}
          </h1>
          <div className="catalog-section-items">
            {categoryItems.length > 0 ? (
              categoryItems.map((item) => (
                <CatalogItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  image={item.images.length ? item.images[0].image_url : ""}
                  url={to(`/catalog/${category.slug}/${item.id}`)}
                />
              ))
            ) : (
              <div className="catalog-empty">No items in this category</div>
            )}
          </div>
        </div>
      );
    });
  };

  return <div className="catalog">{renderCategories(categories)}</div>;
}
