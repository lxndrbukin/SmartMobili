import { type JSX } from "react";

export default function CreateCategory(): JSX.Element {
  return (
    <form className="catalog-category-create">
      <div className="catalog-category-create-section">
        <div className="form-field">
          <label>Name</label>
          <input name="name" />
        </div>
      </div>
      <div className="catalog-category-create-section">
        <div className="form-field">
          <label>Name</label>
          <input name="name" />
        </div>
      </div>
      <div>
        <label>Slug</label>
        <input name="slug" />
      </div>
      <button type="submit">Create</button>
    </form>
  );
}
