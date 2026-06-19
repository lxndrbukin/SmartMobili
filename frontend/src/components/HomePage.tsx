import { type JSX } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Carousel from './Carousel/Carousel';
import Categories from './Catalog/Categories';
import LatestItems from './Catalog/LatestItems';
import OrderSteps from './Static/OrderSteps';
import Brands from './Static/Brands';
import SeoHead from './SeoHead';

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://smartmobili.md';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'SmartMobili',
  '@id': `${SITE_URL}/#organization`,
  url: SITE_URL,
  description:
    'Custom furniture manufacturer based in Moldova. We design and build bespoke cabinet and built-in furniture tailored to your exact specifications.',
};

export default function HomePage(): JSX.Element {
  const { lang = 'ro' } = useParams<{ lang: string }>();
  const { t } = useTranslation('general');

  return (
    <>
      <SeoHead
        title={t('title')}
        description={t('seo.description')}
        lang={lang}
        jsonLd={orgJsonLd}
      />
      <Carousel />
      <Categories />
      <LatestItems />
      <OrderSteps />
      <Brands />
    </>
  );
}
