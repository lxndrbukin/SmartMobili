import { type JSX, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch, getItem } from "../../store";
import { useTranslation } from "react-i18next";

export default function CatalogItemPage(): JSX.Element {
  const { t } = useTranslation("itemPage");
  const { itemId, lang } = useParams<{ itemId: string; lang: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentItem } = useSelector((state: RootState) => state.catalog);
  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    if (itemId) {
      dispatch(getItem({ itemId: parseInt(itemId), lang }));
    }
  }, [itemId, lang, dispatch]);

  useEffect(() => {
    if (currentItem && currentItem.images.length > 0) {
      setCurrentImage(currentItem.images[0].image_url);
    }
  }, [currentItem]);

  if (!currentItem) {
    return <div className="catalog-item-page-loading">Loading...</div>;
  }

  return (
    <div className="catalog-item-page">
      <div className="catalog-item-page-container">
        <div className="catalog-item-page-gallery">
          {currentItem.images.length > 0 ? (
            <img
              src={currentImage}
              alt={currentItem.title}
              className="catalog-item-page-main-image"
            />
          ) : (
            <div className="catalog-item-page-no-image">
              <i className="fas fa-image"></i>
            </div>
          )}

          {currentItem.images.length > 1 && (
            <div className="catalog-item-page-thumbnails">
              {currentItem.images.map((image) => (
                <img
                  key={image.id}
                  src={image.image_url}
                  alt={`${currentItem.title} - ${image.order}`}
                  className="catalog-item-page-thumbnail"
                  onClick={() => setCurrentImage(image.image_url)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="catalog-item-page-info">
          <h1 className="catalog-item-page-title">{currentItem.title}</h1>
          <div className="catalog-item-page-price">
            {currentItem.price
              ? `${currentItem.price.toFixed(2)} MDL`
              : t("noPrice")}
          </div>

          <div className="catalog-item-page-description">
            <h3>{t("description")}</h3>
            <p>{currentItem.description}</p>
          </div>

          <div className="catalog-item-page-actions">
            <button
              className="button"
              onClick={() => navigate(`/${lang}/contact?item=${itemId}`)}
            >
              {t("call")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
