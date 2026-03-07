import { type JSX } from "react";
import useLocalePath from "../../hooks/useLocalePath";

type CatalogItemProps = {
  id: number;
  title: string;
  image: string;
};

export default function CatalogItem({
  id,
  title,
  image,
}: CatalogItemProps): JSX.Element {
  const to = useLocalePath();

  return (
    <div onClick={() => to("/")} className="catalog-item">
      <img src={image} alt={title} />
      <h3>{title}</h3>
    </div>
  );
}
