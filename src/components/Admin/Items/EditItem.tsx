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
  type ItemProps,
  getCategories,
  updateItem,
  addImage,
} from "../../../store";
import axios from "axios";

export default function EditItem(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation("admin");
  const { lang, itemId } = useParams<{ lang: string; itemId: string }>();
  const { categories } = useSelector((state: RootState) => state.catalog);
  const [itemRU, setItemRU] = useState<ItemProps | null>(null);
  const [itemRO, setItemRO] = useState<ItemProps | null>(null);
  const [selectedImages, setSelectedImages] = useState<Array<File>>([]);

  useEffect(() => {
    if (itemId) {
      axios
        .get(`http://localhost:8000/api/v1/items/${itemId}?lang=ro`)
        .then((res) => setItemRO(res.data));

      axios
        .get(`http://localhost:8000/api/v1/items/${itemId}?lang=ru`)
        .then((res) => setItemRU(res.data));
    }
  }, [itemId]);

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
    await dispatch(
      updateItem({
        id: parseInt(itemId!),
        ...data,
      }),
    ).unwrap();

    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        await dispatch(
          addImage({
            itemId: parseInt(itemId!),
            image: imageFormData,
          }),
        );
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
      <h3>{t("editItem.header")}</h3>
      <div className="catalog-item-create-section">
        <h4>Română</h4>
        <div className="form-field">
          <label>{t("createItem.title")}</label>
          <input defaultValue={itemRO?.title} name="titleRO" />
        </div>
        <div className="form-field">
          <label>{t("createItem.description")}</label>
          <textarea defaultValue={itemRO?.description} name="descriptionRO" />
        </div>
      </div>
      <div className="catalog-item-create-section">
        <h4>Русский</h4>
        <div className="form-field">
          <label>{t("createItem.title")}</label>
          <input defaultValue={itemRU?.title} name="titleRU" />
        </div>
        <div className="form-field">
          <label>{t("createItem.description")}</label>
          <textarea defaultValue={itemRU?.description} name="descriptionRU" />
        </div>
      </div>
      <div className="form-field">
        <label>{t("createItem.price")}</label>
        <input
          defaultValue={itemRO?.price}
          type="number"
          name="price"
          className="price"
        />
      </div>
      <div className="form-field">
        <label>{t("createItem.category")}</label>
        <select
          defaultValue={itemRO?.category_id}
          className="category-select"
          name="categoryId"
        >
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
      <button type="submit">{t("editItem.submit")}</button>
    </form>
  );
}
