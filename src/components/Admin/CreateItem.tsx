import {
  type JSX,
  type SubmitEvent,
  type ChangeEvent,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  type RootState,
  type AppDispatch,
  type CategoryProps,
  getCategories,
  createItem,
  addImage,
} from "../../store";

export default function CreateItem(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation("admin");
  const { lang } = useParams();
  const { categories } = useSelector((state: RootState) => state.catalog);
  const [selectedImages, setSelectedImages] = useState<Array<File>>([]);

  useEffect(() => {
    dispatch(getCategories(lang));
  }, [lang]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const images = Array.from(e.target.files || []);
    setSelectedImages(images);
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const titleRO = formData.get("titleRO") as string;
    const descriptionRO = formData.get("descriptionRO") as string;
    const titleRU = formData.get("titleRU") as string;
    const descriptionRU = formData.get("descriptionRU") as string;
    const price = formData.get("price") as string;
    const categoryId = formData.get("categoryId") as string;
    const imageFiles = formData.getAll("images") as File[];
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
    const result = await dispatch(createItem(data)).unwrap();
    const itemId = result.id;

    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        addImage({ itemId, image: imageFormData });
      }
    }
    navigate(`/${lang}/catalog`);
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
      <h3>{t("createItem.header")}</h3>
      <div className="catalog-item-create-section">
        <h4>Română</h4>
        <div className="form-field">
          <label>{t("createItem.title")}</label>
          <input name="titleRO" />
        </div>
        <div className="form-field">
          <label>{t("createItem.description")}</label>
          <textarea name="descriptionRO" />
        </div>
      </div>
      <div className="catalog-item-create-section">
        <h4>Русский</h4>
        <div className="form-field">
          <label>{t("createItem.title")}</label>
          <input name="titleRU" />
        </div>
        <div className="form-field">
          <label>{t("createItem.description")}</label>
          <textarea name="descriptionRU" />
        </div>
      </div>
      <div className="form-field">
        <label>{t("createItem.price")}</label>
        <input type="number" name="price" className="price" />
      </div>
      <div className="form-field">
        <label>{t("createItem.category")}</label>
        <select className="category-select" name="categoryId">
          {renderCategories(categories)}
        </select>
      </div>
      <div className="form-field">
        <label>{t("createItem.images")}</label>
        <input
          onChange={handleImageChange}
          type="file"
          name="images"
          accept="image/*"
          multiple
        />
        {selectedImages.length > 0 && (
          <div className="selected-files">
            {selectedImages.map((img, index) => (
              <span key={index}>{img.name}</span>
            ))}
          </div>
        )}
      </div>
      <button type="submit">{t("createItem.submit")}</button>
    </form>
  );
}
