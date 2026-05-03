import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

type ServiceProps = {
  icon: string;
  title: string;
  text: string;
};

export default function Services(): JSX.Element {
  const { t } = useTranslation('services');
  const [, setSearchParams] = useSearchParams();

  const items = t('items', { returnObjects: true }) as Array<ServiceProps>;

  return (
    <div className='static-page'>
      <div className='static-page-hero'>
        <h1 className='static-page-hero-title'>{t('hero.title')}</h1>
        <p className='static-page-hero-subtitle'>{t('hero.subtitle')}</p>
      </div>

      <div className='static-page-section'>
        <div className='static-page-inner'>
          <div className='static-page-grid static-page-grid--services'>
            {items.map((item) => (
              <div key={item.title} className='static-page-card static-page-card--service'>
                <i className={item.icon}></i>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
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
