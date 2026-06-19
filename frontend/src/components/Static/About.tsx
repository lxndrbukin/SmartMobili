import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useParams } from 'react-router-dom';
import SeoHead from '../SeoHead';

type ValueProps = {
  icon: string;
  title: string;
  text: string;
};

const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://smartmobili.md';

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'SmartMobili',
  '@id': `${SITE_URL}/#organization`,
  url: SITE_URL,
};

export default function About(): JSX.Element {
  const { t } = useTranslation('about');
  const { lang = 'ro' } = useParams<{ lang: string }>();
  const [, setSearchParams] = useSearchParams();

  const values = t('values', { returnObjects: true }) as Array<ValueProps>;

  return (
    <div className='static-page'>
      <SeoHead
        title={t('hero.title')}
        description={t('hero.subtitle')}
        lang={lang}
        jsonLd={orgJsonLd}
      />
      <div className='static-page-hero'>
        <h1 className='static-page-hero-title'>{t('hero.title')}</h1>
        <p className='static-page-hero-subtitle'>{t('hero.subtitle')}</p>
      </div>

      <div className='static-page-section'>
        <div className='static-page-inner'>
          <div className='static-page-story'>
            <h2 className='static-page-section-title'>{t('story.title')}</h2>
            <p className='static-page-story-text'>{t('story.text')}</p>
          </div>
        </div>
      </div>

      <div className='static-page-section static-page-section--alt'>
        <div className='static-page-inner'>
          <div className='static-page-grid'>
            {values.map((value) => (
              <div key={value.title} className='static-page-card'>
                <i className={value.icon}></i>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='static-page-cta'>
        <p>{t('cta.text')}</p>
        <button
          className='button'
          onClick={() => setSearchParams({ createInquiry: 'true' })}
        >
          {t('cta.button')}
        </button>
      </div>
    </div>
  );
}
