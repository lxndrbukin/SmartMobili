import { type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { type ImageProps } from '../../store';

type CatalogItemProps = {
  id: number;
  title: string;
  categoryName: string;
  images: Array<ImageProps>;
  url: string;
  price?: number;
};

export default function CatalogItem({
  id,
  title,
  categoryName,
  images,
  url,
  price,
}: CatalogItemProps): JSX.Element {
  const navigate = useNavigate();

  const handleImageSelection = (images: Array<ImageProps>) => {
    if (!images || images.length === 0) return undefined;
    const imageData = images.find((image) => image.order === 0) || images[0];
    return imageData?.image_url;
  };

  const imageUrl = handleImageSelection(images);

  return (
    <div onClick={() => navigate(url)} className='catalog-item'>
      <div className='catalog-item-image-wrapper'>
        {imageUrl ? (
          <img src={imageUrl} alt={`${title} ${id}`} />
        ) : (
          <div className='catalog-item-no-image'>
            <i className='fas fa-image'></i>
          </div>
        )}
        <div className='catalog-item-overlay'>
          <i className='fas fa-eye'></i>
        </div>
      </div>
      <div className='catalog-item-info'>
        <span>{categoryName}</span>
        <h3>{title}</h3>
        {price ? <p>{price} MDL</p> : null}
      </div>
    </div>
  );
}
