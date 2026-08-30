import {
  type JSX,
  type SubmitEvent,
  type ChangeEvent,
  useEffect,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  type AppDispatch,
  createBanner,
  updateBanner,
  addBannerImage,
  deleteBannerImage,
} from '../../../store';
import axios from 'axios';
import { API_URL } from '../../../api';

export default function BannerForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('admin');

  const [searchParams, setSearchParams] = useSearchParams();
  const isCreating = searchParams.get('createBanner') === '1';
  const bannerId = searchParams.get('editBanner');

  const [bannerUrl, setBannerUrl] = useState('');
  const [headerRO, setHeaderRO] = useState('');
  const [bodyRO, setBodyRO] = useState('');
  const [headerRU, setHeaderRU] = useState('');
  const [bodyRU, setBodyRU] = useState('');
  const [selectedImages, setSelectedImages] = useState<Array<File>>([]);
  const [existingImages, setExistingImages] = useState<
    Array<{ id: number; image_url: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (bannerId) {
      axios.get(`${API_URL}/api/v1/banners/${bannerId}?lang=ro`).then((res) => {
        setBannerUrl(res.data.url);
        setHeaderRO(res.data.header);
        setBodyRO(res.data.body || '');
        setExistingImages(res.data.images || []);
      });
      axios.get(`${API_URL}/api/v1/banners/${bannerId}?lang=ru`).then((res) => {
        setHeaderRU(res.data.header);
        setBodyRU(res.data.body || '');
      });
    }
  }, [bannerId]);

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      setIsLoading(true);
      await dispatch(
        deleteBannerImage({ bannerId: Number(bannerId), imageId }),
      ).unwrap();
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const images = Array.from(e.target.files || []);
    setSelectedImages(images);
  };

  const handleClose = () => {
    setSearchParams({});
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    const headerRO = formData.get('headerRO') as string;
    const bodyRO = formData.get('bodyRO') as string;
    const headerRU = formData.get('headerRU') as string;
    const bodyRU = formData.get('bodyRU') as string;
    const imageFiles = formData.getAll('images') as File[];

    const data = {
      url,
      translations: [
        {
          language: 'ro',
          header: headerRO,
          body: bodyRO || null,
        },
        {
          language: 'ru',
          header: headerRU || headerRO,
          body: bodyRU || bodyRO || null,
        },
      ],
    };

    setIsLoading(true);
    try {
      if (isCreating) {
        const result = await dispatch(createBanner(data)).unwrap();
        const createdBannerId = result.id;
        for (const imageFile of imageFiles) {
          if (imageFile && imageFile.size > 0) {
            const imageFormData = new FormData();
            imageFormData.append('image', imageFile);
            await dispatch(
              addBannerImage({
                bannerId: createdBannerId,
                image: imageFormData,
              }),
            );
          }
        }
      } else {
        await dispatch(
          updateBanner({
            id: parseInt(bannerId!),
            url,
            translations: data.translations,
          }),
        ).unwrap();

        for (const imageFile of imageFiles) {
          if (imageFile && imageFile.size > 0) {
            const imageFormData = new FormData();
            imageFormData.append('image', imageFile);
            await dispatch(
              addBannerImage({
                bannerId: parseInt(bannerId!),
                image: imageFormData,
              }),
            );
          }
        }
      }
      setIsLoading(false);
      handleClose();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className='modal-backdrop' onClick={handleClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className='catalog-item-form'>
          <button
            className='modal-close-btn'
            type='button'
            onClick={handleClose}
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
          <h3>{isCreating ? t('banners.headerCreate') : t('banners.headerEdit')}</h3>
          
          <div className='catalog-item-form-section'>
            <h4>Română</h4>
            <div className='form-field'>
              <label>{t('banners.header')} *</label>
              <input
                type='text'
                name='headerRO'
                required
                value={headerRO}
                onChange={(e) => setHeaderRO(e.target.value)}
              />
            </div>
            <div className='form-field'>
              <label>{t('banners.body')}</label>
              <textarea
                name='bodyRO'
                value={bodyRO}
                onChange={(e) => setBodyRO(e.target.value)}
              />
            </div>
          </div>

          <div className='catalog-item-form-section'>
            <h4>Русский</h4>
            <div className='form-field'>
              <label>{t('banners.header')}</label>
              <input
                type='text'
                name='headerRU'
                value={headerRU}
                onChange={(e) => setHeaderRU(e.target.value)}
              />
            </div>
            <div className='form-field'>
              <label>{t('banners.body')}</label>
              <textarea
                name='bodyRU'
                value={bodyRU}
                onChange={(e) => setBodyRU(e.target.value)}
              />
            </div>
          </div>

          <div className='form-field'>
            <label>{t('banners.url')}</label>
            <input
              type='text'
              name='url'
              required
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder={t('banners.urlPlaceholder')}
            />
          </div>

          <div className='form-field'>
            <label>{t('banners.image')}</label>
            <input
              type='file'
              name='images'
              accept='image/*'
              onChange={handleImageChange}
            />
            {selectedImages.length > 0 && (
              <div className='selected-files'>
                {selectedImages.map((file, idx) => (
                  <span key={idx}>{file.name}</span>
                ))}
              </div>
            )}
          </div>

          {existingImages.length > 0 && (
            <div className='form-field'>
              <label>{t('banners.existingImages')}</label>
              <div className='form-existing-images'>
                {existingImages.map((image) => (
                  <div key={image.id} className='form-existing-image-card'>
                    <img src={image.image_url} alt='Banner' />
                    <button
                      type='button'
                      className='form-existing-image-delete-btn'
                      onClick={() => handleDeleteImage(image.id)}
                      disabled={isLoading}
                    >
                      <i className='fa-solid fa-trash'></i>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button disabled={isLoading} type='submit'>
            {isLoading ? (
              <>
                <i className='fa-solid fa-spinner fa-spin'></i>{' '}
                {t('generic.saving', { defaultValue: 'Saving...' })}
              </>
            ) : (
              isCreating ? t('banners.submitCreate') : t('banners.submitEdit')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
