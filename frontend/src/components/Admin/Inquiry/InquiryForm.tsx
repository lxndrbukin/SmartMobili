import { type JSX, type FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  type AppDispatch,
  getInquiry,
  submitInquiry,
  updateInquiry,
} from '../../../store';

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

  const [formErrors, setFormErrors] = useState<{
    name: string | null;
    subject: string | null;
    phone: string | null;
  }>({ name: null, subject: null, phone: null });

  const isCreating = searchParams.get('createInquiry') === 'true';
  const inquiryId = Number(searchParams.get('editInquiry'));
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
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const subject = formData.get('subject') as string;
    const description = formData.get('description') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const telegram = formData.get('telegram') === 'on';
    const viber = formData.get('viber') === 'on';
    const whatsapp = formData.get('whatsapp') === 'on';
    const data = {
      id: inquiryId,
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
      await dispatch(submitInquiry(data));
    } else {
      await dispatch(updateInquiry(data));
    }
    setIsLoading(false);
    form.reset();
    handleClose();
    alert(t('submitMessage'));
  };

  const handleOnBlur = (name: string, value: string) => {
    if (!value.length) {
      setFormErrors({
        ...formErrors,
        [name]: t('errors.required'),
      });
    } else {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  const handleOnClick = (name: string) => {
    setFormErrors({ ...formErrors, [name]: null });
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
              onBlur={(e) => handleOnBlur(e.target.name, e.target.value)}
              onFocus={(e) => handleOnClick(e.target.name)}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
              type='text'
              name='name'
              className={formErrors['name'] ? 'input-error' : ''}
            />
            {formErrors['name'] && (
              <p className='error'>{formErrors['name']}</p>
            )}
          </div>
          <div className='input-field'>
            <label>{t('subject')}</label>
            <input
              value={subject}
              onBlur={(e) => handleOnBlur(e.target.name, e.target.value)}
              onFocus={(e) => handleOnClick(e.target.name)}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t('subjectPlaceholder')}
              type='text'
              name='subject'
              className={formErrors['subject'] ? 'input-error' : ''}
            />
            {formErrors['subject'] && (
              <p className='error'>{formErrors['subject']}</p>
            )}
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
              onBlur={(e) => handleOnBlur(e.target.name, e.target.value)}
              onFocus={(e) => handleOnClick(e.target.name)}
              onChange={(e) => setPhone(e.target.value)}
              type='text'
              name='phone'
              className={formErrors['phone'] ? 'input-error' : ''}
            />
            {formErrors['phone'] && (
              <p className='error'>{formErrors['phone']}</p>
            )}
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
                defaultChecked={telegram}
                onChange={(e) => setTelegram(e.target.checked)}
                type='checkbox'
                name='telegram'
              />
            </div>
            <div className='communication'>
              <label htmlFor='viber'>Viber</label>
              <input
                defaultChecked={viber}
                onChange={(e) => setViber(e.target.checked)}
                type='checkbox'
                name='viber'
              />
            </div>
            <div className='communication'>
              <label htmlFor='whatsapp'>WhatsApp</label>
              <input
                defaultChecked={whatsapp}
                onChange={(e) => setWhatsapp(e.target.checked)}
                type='checkbox'
                name='whatsapp'
              />
            </div>
          </div>
          <button disabled={isLoading} type='submit'>
            {isCreating ? t('submit') : t('edit')}
          </button>
        </form>
      </div>
    </div>
  );
}
