import { type JSX, type FormEvent, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { type AppDispatch, submitInquiry } from '../../store';

export default function ContactForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('item');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { t } = useTranslation('contactForm');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    setIsLoading(true);
    await dispatch(submitInquiry(data)).unwrap();
    setIsLoading(false);
    alert("Thank you! We'll contact you soon.");
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className='contact-form'>
      <h3>{t('header')}</h3>
      <div className='input-field'>
        <label>{t('name')}</label>
        <input placeholder={t('namePlaceholder')} type='text' name='name' />
      </div>
      <div className='input-field'>
        <label>{t('subject')}</label>
        <input
          placeholder={t('subjectPlaceholder')}
          type='text'
          name='subject'
        />
      </div>
      <div className='input-field'>
        <label>{t('desc')}</label>
        <textarea placeholder={t('descPlaceholder')} name='description' />
      </div>
      <div className='input-field'>
        <label>{t('phoneNumber')}</label>
        <input type='text' name='phone' />
      </div>
      <div className='input-field'>
        <label>{t('email')}</label>
        <input type='email' name='email' />
      </div>
      <div className='input-field'>
        <label>{t('communication')}</label>
        <div className='communication'>
          <label htmlFor='telegram'>Telegram</label>
          <input type='checkbox' name='telegram' />
        </div>
        <div className='communication'>
          <label htmlFor='viber'>Viber</label>
          <input type='checkbox' name='viber' />
        </div>
        <div className='communication'>
          <label htmlFor='whatsapp'>WhatsApp</label>
          <input type='checkbox' name='whatsapp' />
        </div>
      </div>
      <button disabled={isLoading} type='submit'>
        {t('submit')}
      </button>
    </form>
  );
}
