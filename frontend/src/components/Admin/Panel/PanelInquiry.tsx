import { type JSX, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState, type AppDispatch, getInquiry } from '../../../store';

export default function PanelInquiry(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation('contactForm');

  const { currentInquiry } = useSelector(
    (state: RootState) => state.admin.inquiries,
  );

  const inquiryId = Number(searchParams.get('inquiry'));

  useEffect(() => {
    dispatch(getInquiry(inquiryId));
  }, [inquiryId]);

  const handleClose = () => {
    setSearchParams({});
  };

  return (
    <div className='modal-backdrop' onClick={handleClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <div className='inquiry'>
          <button
            className='modal-close-btn'
            type='button'
            onClick={handleClose}
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
          <h3>
            {t('header')} №{currentInquiry?.id}
          </h3>
          <div className='data-field'>
            <label>{t('name')}</label>
            <p>{currentInquiry?.name}</p>
          </div>
          <div className='data-field'>
            <label>{t('subject')}</label>
            <p>{currentInquiry?.subject}</p>
          </div>
          <div className='data-field'>
            <label>{t('description')}</label>
            <p>{currentInquiry?.description || '-'}</p>
          </div>
          <div className='data-field'>
            <label>{t('phone')}</label>
            <p>{currentInquiry?.phone}</p>
          </div>
          <div className='data-field'>
            <label>{t('communication')}</label>
            <div className='communication'>
              <label>Telegram</label>
              <input checked={currentInquiry?.telegram} type='checkbox' />
            </div>
            <div className='communication'>
              <label>Viber</label>
              <input checked={currentInquiry?.viber} type='checkbox' />
            </div>
            <div className='communication'>
              <label>WhatsApp</label>
              <input checked={currentInquiry?.whatsapp} type='checkbox' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
