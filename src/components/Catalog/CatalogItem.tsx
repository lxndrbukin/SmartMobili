import { type JSX } from 'react';
import { useNavigate } from 'react-router-dom';

type CatalogItemProps = {
  id: number;
  title: string;
  categoryName: string;
  image: string;
  url: string;
  price?: number;
};

export default function CatalogItem({
  id,
  title,
  categoryName,
  image,
  url,
  price,
}: CatalogItemProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(url)} className='catalog-item'>
      {image ? (
        <img src={image} alt={`${title} ${id}`} />
      ) : (
        <div className='catalog-item-no-image'>
          <i className='fas fa-image'></i>
        </div>
      )}
      <div className='catalog-item-info'>
        <span>{categoryName}</span>
        <h3>{title}</h3>
        {price ? <p>{price} MDL</p> : null}
      </div>
    </div>
  );
}
