import { type JSX } from 'react';
import { type LatestWorkProps } from '../../store';
import LatestWorkTile from './LatestWorkTile';
import LatestWorkTileSkeleton from './LatestWorkTileSkeleton';

type LatestWorksGridProps = {
  works: Array<LatestWorkProps>;
  isLoading: boolean;
  skeletonCount: number;
};

export default function LatestWorksGrid({
  works,
  isLoading,
  skeletonCount,
}: LatestWorksGridProps): JSX.Element {
  return (
    <div className='latest-works-grid'>
      {works.map((work) => (
        <LatestWorkTile key={work.id} work={work} />
      ))}
      {isLoading &&
        Array(skeletonCount)
          .fill('')
          .map((_, idx) => <LatestWorkTileSkeleton key={`skeleton-${idx}`} />)}
    </div>
  );
}
