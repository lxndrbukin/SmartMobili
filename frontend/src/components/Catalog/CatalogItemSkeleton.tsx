import { type JSX } from 'react';

export default function CatalogItemSkeleton(): JSX.Element {
  return (
    <div className='catalog-item-skeleton'>
      <div className='skeleton-image' />
      <div className='skeleton-title'>
        <div className='skeleton-title-bar' />
      </div>
    </div>
  );
}
