import { type JSX } from 'react';

export default function CatalogItemPageSkeleton(): JSX.Element {
  return (
    <div className='catalog-item-page'>
      <div className='catalog-item-page-container'>
        <div className='catalog-item-page-gallery'>
          <div className='skeleton-main-image' />
          <div className='skeleton-thumbnails'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='skeleton-thumbnail' />
            ))}
          </div>
        </div>
        <div className='catalog-item-page-info'>
          <div className='skeleton-title' />
          <div className='skeleton-price' />

          <div className='skeleton-description'>
            <div className='skeleton-description-heading' />
            <div className='skeleton-description-line' />
            <div
              className='skeleton-description-line'
              style={{ width: '90%' }}
            />
            <div
              className='skeleton-description-line'
              style={{ width: '75%' }}
            />
            <div
              className='skeleton-description-line'
              style={{ width: '60%' }}
            />
          </div>
          <div className='skeleton-button' />
        </div>
      </div>
    </div>
  );
}
