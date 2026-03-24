import { type JSX, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type RootState, type AppDispatch, getItem } from "../../store";

export default function CatalogItemPage(): JSX.Element {
  const { itemId, lang } = useParams<{ itemId: string; lang: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentItem } = useSelector((state: RootState) => state.catalog);

  useEffect(() => {
    if (itemId) {
      dispatch(getItem({ itemId: parseInt(itemId), lang }));
    }
  }, [itemId, lang, dispatch]);

  if (!currentItem) {
    return <div className="catalog-item-page-loading">Loading...</div>;
  }

  return (
    <div className="catalog-item-page">
      <div className="catalog-item-page-container">
        <div className="catalog-item-page-gallery">
          {currentItem.images.length > 0 ? (
            <img
              src={currentItem.images[0].image_url}
              alt={currentItem.title}
              className="catalog-item-page-main-image"
            />
          ) : (
            <div className="catalog-item-page-no-image">No Image</div>
          )}

          {currentItem.images.length > 1 && (
            <div className="catalog-item-page-thumbnails">
              {currentItem.images.map((image) => (
                <img
                  key={image.id}
                  src={image.image_url}
                  alt={`${currentItem.title} - ${image.order}`}
                  className="catalog-item-page-thumbnail"
                />
              ))}
            </div>
          )}
        </div>

        <div className="catalog-item-page-info">
          <h1 className="catalog-item-page-title">{currentItem.title}</h1>

          <div className="catalog-item-page-price">
            {currentItem.price.toFixed(2)} RON
          </div>

          <div className="catalog-item-page-description">
            <h3>Description</h3>
            <p>{currentItem.description}</p>
          </div>

          <div className="catalog-item-page-actions">
            <button
              className="button"
              onClick={() => navigate(`/${lang}/contact?item=${itemId}`)}
            >
              Request Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
