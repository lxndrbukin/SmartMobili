import { type JSX, type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { type AppDispatch, getInquiry, submitInquiry } from '../../../store';

export default function InquiryForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation('contactForm');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [telegram, setTelegram] = useState<boolean>(false);
  const [whatsapp, setWhatsapp] = useState<boolean>(false);
  const [viber, setViber] = useState<boolean>(false);

  const isCreating = searchParams.get('createInquiry') === '1';
  const inquiryId = searchParams.get('editInquiry');
  const itemId = searchParams.get('itemId');

  useEffect(() => {
    if (!isCreating) {
      const fetchData = async () => {
        const res = await dispatch(getInquiry(Number(inquiryId))).unwrap();
        setName(res.name);
        setSubject(res.subject);
        setDescription(res.description);
        setPhone(res.phone);
        setEmail(res.email);
        setTelegram(res.telegram);
        setWhatsapp(res.whatsapp);
        setViber(res.viber);
      };
      fetchData();
    }
  }, [inquiryId]);

  const handleClose = () => {
    setSearchParams({});
  };

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
    if (isCreating) {
      await dispatch(submitInquiry(data)).unwrap();
    } else {
    }
    setIsLoading(false);
    e.currentTarget.reset();
    handleClose();
    alert("Thank you! We'll contact you soon.");
  };

  return (
    <div className='modal-backdrop' onClick={handleClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className='contact-form'>
          <button
            className='modal-close-btn'
            type='button'
            onClick={handleClose}
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
          <h3>{t('header')}</h3>
          <div className='input-field'>
            <label>{t('name')}</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
              type='text'
              name='name'
            />
          </div>
          <div className='input-field'>
            <label>{t('subject')}</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t('subjectPlaceholder')}
              type='text'
              name='subject'
            />
          </div>
          <div className='input-field'>
            <label>{t('desc')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descPlaceholder')}
              name='description'
            />
          </div>
          <div className='input-field'>
            <label>{t('phoneNumber')}</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type='text'
              name='phone'
            />
          </div>
          <div className='input-field'>
            <label>{t('email')}</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='email'
              name='email'
            />
          </div>
          <div className='input-field'>
            <label>{t('communication')}</label>
            <div className='communication'>
              <label htmlFor='telegram'>Telegram</label>
              <input
                checked={telegram}
                onChange={(e) => setTelegram(e.target.checked)}
                type='checkbox'
                name='telegram'
              />
            </div>
            <div className='communication'>
              <label htmlFor='viber'>Viber</label>
              <input
                checked={viber}
                onChange={(e) => setViber(e.target.checked)}
                type='checkbox'
                name='viber'
              />
            </div>
            <div className='communication'>
              <label htmlFor='whatsapp'>WhatsApp</label>
              <input
                checked={whatsapp}
                onChange={(e) => setWhatsapp(e.target.checked)}
                type='checkbox'
                name='whatsapp'
              />
            </div>
          </div>
          <button disabled={isLoading} type='submit'>
            {t('submit')}
          </button>
        </form>
      </div>
    </div>
  );
}
