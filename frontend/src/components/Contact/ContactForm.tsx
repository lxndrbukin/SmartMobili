import { type JSX, type FormEvent, useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, submitInquiry, getItem, type RootState } from '../../store';
import SeoHead from '../SeoHead';
import useLocalePath from '../../hooks/useLocalePath';
import defaultImg from '../../assets/imgs/icons8-wardrobe-50.png';

export default function ContactForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const to = useLocalePath();
  const { lang = 'ro' } = useParams<{ lang: string }>();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('item');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { t } = useTranslation('contactForm');
  const { currentItem } = useSelector((state: RootState) => state.catalog);

  useEffect(() => {
    if (itemId) {
      dispatch(getItem({ itemId: parseInt(itemId), lang }));
    }
  }, [itemId, lang, dispatch]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const telegram = formData.get('telegram') === 'on';
    const viber = formData.get('viber') === 'on';
    const whatsapp = formData.get('whatsapp') === 'on';

    const data = {
      name,
      subject,
      description,
      phone,
      email,
      item_id: itemId ? parseInt(itemId) : null,
      telegram,
      viber,
      whatsapp,
    };

    try {
      setIsLoading(true);
      await dispatch(submitInquiry(data)).unwrap();
      setIsLoading(false);
      setIsSuccess(true);
    } catch (err: unknown) {
      setIsLoading(false);
      const apiError = err as { detail?: string };
      setErrorMsg(apiError?.detail || t('errorMessage', { defaultValue: 'Something went wrong. Please try again.' }));
    }
  };

  const subjectValue = currentItem
    ? t('subjectPrefill', { name: currentItem.title, defaultValue: `Inquiry regarding ${currentItem.title}` })
    : '';

  const descValue = currentItem
    ? t('descPrefill', { name: currentItem.title, defaultValue: `Hello! I am interested in "${currentItem.title}" and would like to get more information, pricing, and measurements consultation.` })
    : '';

  if (isSuccess) {
    return (
      <div className='contact-form-success'>
        <div className='success-icon-wrapper'>
          <div className='success-checkmark'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" style={{ width: '100%', height: '100%' }}>
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
        </div>
        <h3>{t('successHeader', { defaultValue: 'Thank you!' })}</h3>
        <p>{t('successMessage', { defaultValue: 'We have received your request and will contact you as soon as possible.' })}</p>
        <Link className='success-back-btn' to={to('/')}>
          {t('backToHome', { defaultValue: 'Back to Home' })}
        </Link>
      </div>
    );
  }

  return (
    <>
      <SeoHead
        title={t('header')}
        description={t('seo.description')}
        lang={lang}
        noIndex
      />
      <form onSubmit={handleSubmit} className='contact-form'>
        <h3>{t('header')}</h3>

        {currentItem && (
          <div className="inquiry-item-preview">
            <img src={(currentItem.images && currentItem.images[0]?.image_url) || defaultImg} alt={currentItem.title} />
            <div className="inquiry-item-details">
              <span className="inquiry-item-label">{t('inquiryRegarding', { defaultValue: 'Inquiry regarding:' })}</span>
              <h4 className="inquiry-item-title">{currentItem.title}</h4>
              {currentItem.category?.name && <span className="inquiry-item-category">{currentItem.category.name}</span>}
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="contact-form-error-banner">
            <i className="fas fa-exclamation-circle"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        <div className='input-field'>
          <label htmlFor='name'>
            {t('name')}
            <span className="required-star">*</span>
          </label>
          <input
            id='name'
            placeholder={t('namePlaceholder')}
            type='text'
            name='name'
            required
          />
        </div>

        <div className='input-field'>
          <label htmlFor='subject'>{t('subject')}</label>
          <input
            id='subject'
            key={`subject-${currentItem?.id || 'empty'}`}
            placeholder={t('subjectPlaceholder')}
            type='text'
            name='subject'
            defaultValue={subjectValue}
          />
        </div>

        <div className='input-field'>
          <label htmlFor='description'>{t('desc')}</label>
          <textarea
            id='description'
            key={`desc-${currentItem?.id || 'empty'}`}
            placeholder={t('descPlaceholder')}
            name='description'
            defaultValue={descValue}
          />
        </div>

        <div className='input-field'>
          <label htmlFor='phone'>
            {t('phoneNumber')}
            <span className="required-star">*</span>
          </label>
          <input
            id='phone'
            type='tel'
            name='phone'
            placeholder="e.g. +373 69 923 028"
            required
          />
        </div>

        <div className='input-field'>
          <label htmlFor='email'>{t('email')}</label>
          <input
            id='email'
            type='email'
            name='email'
            placeholder="e.g. client@example.com"
          />
        </div>

        <div className='input-field'>
          <label>{t('communication')}</label>
          <div className='communication-channels'>
            <div className='communication'>
              <label htmlFor='telegram'>Telegram</label>
              <input type='checkbox' name='telegram' id='telegram' />
            </div>
            <div className='communication'>
              <label htmlFor='viber'>Viber</label>
              <input type='checkbox' name='viber' id='viber' />
            </div>
            <div className='communication'>
              <label htmlFor='whatsapp'>WhatsApp</label>
              <input type='checkbox' name='whatsapp' id='whatsapp' />
            </div>
          </div>
        </div>

        <button disabled={isLoading} type='submit'>
          {isLoading ? '...' : t('submit')}
        </button>
      </form>
    </>
  );
}
