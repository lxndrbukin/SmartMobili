import { type JSX, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  type AppDispatch,
  type RootState,
  type ItemProps,
  getItems,
} from "../../store";
import CatalogItem from "./CatalogItem";

export default function Catalog(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { items } = useSelector((state: RootState) => state.catalog);

  useEffect(() => {
    dispatch(getItems());
  }, []);

  const renderItems = (items: Array<ItemProps>) => {
    return items.map((item) => {
      return (
        <CatalogItem
          key={item.id}
          id={item.id}
          title={item.title}
          image={item.images[0].image_url}
        />
      );
    });
  };

  return <div className="catalog">{renderItems(items)}</div>;
}
