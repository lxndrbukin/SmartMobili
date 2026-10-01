import { type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { type ServiceImageProps } from '../../store';
import { optimizeCloudinaryImage } from '../../assets/utils';

type ServiceItemProps = {
  id: number;
  title: string;
  categoryName: string;
  images: Array<ServiceImageProps>;
  url: string;
  price?: number | null;
  currency?: string;
};

export default function ServiceItem({
  id,
  title,
  categoryName,
  images,
  url,
  price,
  currency = 'MDL',
}: ServiceItemProps): JSX.Element {
  const navigate = useNavigate();

  const handleImageSelection = (images: Array<ServiceImageProps>) => {
    if (!images || images.length === 0) return undefined;
    const imageData = images.find((image) => image.order === 0) || images[0];
    return imageData?.image_url;
  };

  const imageUrl = handleImageSelection(images);

  return (
    <div onClick={() => navigate(url)} className='catalog-item'>
      <div className='catalog-item-image-wrapper'>
        {imageUrl ? (
          <img
            src={optimizeCloudinaryImage(imageUrl, 'thumbnail')}
            alt={`${title} ${id}`}
          />
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
        <span className='catalog-item-category'>{categoryName}</span>
        <h3>{title}</h3>
        {price ? (
          <p className='catalog-item-price'>
            <span className='catalog-item-price-value'>{price}</span>{' '}
            <span className='catalog-item-price-currency'>{currency}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
