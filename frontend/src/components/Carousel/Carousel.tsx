import { type JSX, useEffect } from 'react';
import AcroolCarousel, {
  type TAcroolSlideItemDataList,
  AcroolSlideCard,
} from '@acrool/react-carousel';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState, getBanners } from '../../store';
import { type BannerProps } from './types';
import CarouselBanner from './CarouselBanner';

export default function Carousel(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t, i18n } = useTranslation('carousel');
  const { banners, bannersLoaded } = useSelector((state: RootState) => state.catalog);

  useEffect(() => {
    dispatch(getBanners(i18n.language));
  }, [dispatch, i18n.language]);

  const displayBanners: Array<BannerProps> =
    bannersLoaded && banners.length > 0
      ? banners.map((banner) => ({
          img: banner.images && banner.images.length > 0 ? banner.images[0].image_url : '',
          primaryText: banner.header,
          secondaryText: banner.body || '',
          url: banner.url,
        }))
      : (t('banners', { returnObjects: true }) as Array<BannerProps>);

  const acroolSlideItemData: TAcroolSlideItemDataList = displayBanners.map(
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
      key={`${i18n.language}-${banners.length}`}
      data={acroolSlideItemData}
      height='550px'
      isEnableNavButton
      isEnableLoop
      isEnableAutoPlay
    />
  );
}
