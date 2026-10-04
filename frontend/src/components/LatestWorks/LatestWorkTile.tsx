import { type JSX } from 'react';
import { Link } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import { type LatestWorkProps } from '../../store';
import { optimizeCloudinaryImage } from '../../assets/utils';

type LatestWorkTileProps = {
  work: LatestWorkProps;
};

export default function LatestWorkTile({
  work,
}: LatestWorkTileProps): JSX.Element | null {
  const to = useLocalePath();
  const { id, title, images } = work;
  const cover = images.length > 0 ? images[0].image_url : null;

  if (!cover) {
    return null;
  }

  return (
    <Link
      to={to(`/latest-works/${id}`)}
      className='latest-work-tile'
      aria-label={title}
    >
      <img
        src={optimizeCloudinaryImage(cover, 'thumbnail')}
        srcSet={`${optimizeCloudinaryImage(cover, 'thumbnail')} 400w, ${optimizeCloudinaryImage(cover, 'medium')} 800w`}
        sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 400px'
        alt={title}
        loading='lazy'
      />
      {images.length > 1 && (
        <span className='latest-work-tile-multi'>
          <i className='fa-regular fa-clone'></i>
        </span>
      )}
      <span className='latest-work-tile-overlay'>
        <span className='latest-work-tile-title'>{title}</span>
        <span className='latest-work-tile-count'>
          <i className='fa-regular fa-images'></i> {images.length}
        </span>
      </span>
    </Link>
  );
}
