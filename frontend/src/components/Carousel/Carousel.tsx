import { type JSX } from 'react';
import AcroolCarousel, {
  type TAcroolSlideItemDataList,
  AcroolSlideCard,
} from '@acrool/react-carousel';
import { useTranslation } from 'react-i18next';
import { type BannerProps } from './types';
import CarouselBanner from './CarouselBanner';

export default function Carousel(): JSX.Element {
  const { t, i18n } = useTranslation('carousel');

  const banners = t('banners', { returnObjects: true }) as Array<BannerProps>;

  const acroolSlideItemData: TAcroolSlideItemDataList = banners.map(
    (banner, idx) => {
      return (
        <AcroolSlideCard key={idx}>
          <CarouselBanner {...banner} />
        </AcroolSlideCard>
      );
    },
  );
  return (
    <AcroolCarousel
      key={i18n.language}
      data={acroolSlideItemData}
      height='550px'
      isEnableNavButton
      isEnableLoop
      isEnableAutoPlay
    />
  );
}
