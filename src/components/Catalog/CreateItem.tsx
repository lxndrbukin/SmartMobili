import "./assets/styles.css";
import { type JSX, type SubmitEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  type RootState,
  type AppDispatch,
  type CategoryProps,
  getCategories,
  createItem,
} from "../../store";

export default function CreateItem(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const { categories } = useSelector((state: RootState) => state.catalog);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const titleRO = formData.get("titleRO") as string;
    const descriptionRO = formData.get("descriptionRO") as string;
    const titleRU = formData.get("titleRU") as string;
    const descriptionRU = formData.get("descriptionRU") as string;
    const price = formData.get("price") as string;
    const categoryId = formData.get("categoryId") as string;
    const data = {
      translations: [
        {
          language: "ro",
          title: titleRO,
          description: descriptionRO,
        },
        {
          language: "ru",
          title: titleRU,
          description: descriptionRU,
        },
      ],
      price: parseFloat(price),
      category_id: Number(categoryId),
    };
    dispatch(createItem(data));
  };

  const renderCategories = (categories: Array<CategoryProps>) => {
    if (!categories) return null;
    return categories.map((category) => {
      return (
        <option value={category.id} key={category.id}>
          {category.name}
        </option>
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className="catalog-item-create">
      <div className="catalog-item-create-section">
        <div className="form-field">
          <label>Title</label>
          <input name="titleRO" />
        </div>
        <div className="form-field">
          <label>Description</label>
          <input name="descriptionRO" />
        </div>
      </div>
      <div className="catalog-item-create-section">
        <div className="form-field">
          <label>Title</label>
          <input name="titleRU" />
        </div>
        <div className="form-field">
          <label>Description</label>
          <input name="descriptionRU" />
        </div>
      </div>
      <div className="form-field">
        <label>Price</label>
        <input type="number" name="price" />
      </div>
      <div className="form-field">
        <label>Category</label>
        <select name="categoryId">{renderCategories(categories)}</select>
      </div>
      <button type="submit">Create</button>
    </form>
  );
}
