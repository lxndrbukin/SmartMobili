import { type JSX } from "react";
import { useNavigate } from "react-router-dom";

type CatalogItemProps = {
  id: number;
  title: string;
  image: string;
  url: string;
};

export default function CatalogItem({
  id,
  title,
  image,
  url,
}: CatalogItemProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(url)} className="catalog-item">
      {image ? (
        <img src={image} alt={title} />
      ) : (
        <div className="catalog-item-no-image">
          <i className="fas fa-image"></i>
        </div>
      )}
      <h3>{title}</h3>
    </div>
  );
}
