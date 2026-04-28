import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import { type BannerProps } from './types';

export default function CarouselBanner({
  img,
  primaryText,
  secondaryText,
  url,
}: BannerProps): JSX.Element {
  const { t } = useTranslation('carousel');
  const to = useLocalePath();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  return (
    <div
      className='top-banner_wrapper'
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      <div className='top-banner'>
        <div className='top-banner_left'>
          <span className='top-banner_primary-text'>{primaryText}</span>
          <span className='top-banner_secondary-text'>{secondaryText}</span>
          <div className='button-container'>
            <button
              onClick={() => setSearchParams({ createInquiry: 'true' })}
              className='button'
            >
              {t('bannerLinks.order')}
            </button>
            <button
              onClick={() => navigate(to(url))}
              className='button button-transparent'
            >
              {t('bannerLinks.catalog')}
              <i className='fas fa-arrow-right'></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
