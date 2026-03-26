import { type JSX, type FormEvent } from "react";
import { useDispatch } from "react-redux";
import { type AppDispatch, createCategory } from "../../store";

export default function CreateCategory(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nameRO = formData.get("nameRO") as string;
    const nameRU = formData.get("nameRU") as string;
    const slug = formData.get("slug") as string;

    const data = {
      slug,
      translations: [
        {
          language: "ro",
          name: nameRO,
        },
        {
          language: "ru",
          name: nameRU,
        },
      ],
    };
    dispatch(createCategory(data));
  };

  return (
    <form onSubmit={handleSubmit} className="catalog-category-create">
      <h3>New Category</h3>
      <div className="form-field">
        <label>Titlu</label>
        <input name="nameRO" />
      </div>
      <div className="form-field">
        <label>Название</label>
        <input name="nameRU" />
      </div>
      <div className="form-field">
        <label>URL (/tables)</label>
        <input name="slug" />
      </div>
      <button type="submit">Create</button>
    </form>
  );
}
