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
  createLatestWork,
  updateLatestWork,
  addLatestWorkImage,
  deleteLatestWorkImage,
} from '../../../store';
import axios from 'axios';
import { API_URL } from '../../../api';
export default function LatestWorkForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('admin');

  const [searchParams, setSearchParams] = useSearchParams();
  const isCreating = searchParams.get('createLatestWork') === '1';
  const latestWorkId = searchParams.get('editLatestWork');

  const [titleRO, setTitleRO] = useState('');
  const [descriptionRO, setDescriptionRO] = useState('');
  const [titleRU, setTitleRU] = useState('');
  const [descriptionRU, setDescriptionRU] = useState('');
  const [isActive, setIsActive] = useState(true);
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
    if (latestWorkId) {
      axios
        .get(`${API_URL}/api/v1/latest_works/${latestWorkId}?lang=ro`)
        .then((res) => {
          setTitleRO(res.data.title);
          setDescriptionRO(res.data.description || '');
          setIsActive(res.data.is_active);
          setExistingImages(res.data.images || []);
        });
      axios
        .get(`${API_URL}/api/v1/latest_works/${latestWorkId}?lang=ru`)
        .then((res) => {
          setTitleRU(res.data.title);
          setDescriptionRU(res.data.description || '');
        });
    }
  }, [latestWorkId]);

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm(t('latestWork.confirmDeleteImage'))) return;
    try {
      setIsLoading(true);
      await dispatch(
        deleteLatestWorkImage({
          latestWorkId: Number(latestWorkId),
          imageId,
        }),
      ).unwrap();
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedImages(Array.from(e.target.files || []));
  };

  const handleClose = () => {
    setSearchParams({});
  };

  const uploadImages = async (id: number, imageFiles: Array<File>) => {
    for (const imageFile of imageFiles) {
      if (imageFile && imageFile.size > 0) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        await dispatch(
          addLatestWorkImage({ latestWorkId: id, image: imageFormData }),
        ).unwrap();
      }
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const imageFiles = formData.getAll('images') as File[];

    const translations = [
      {
        language: 'ro',
        title: titleRO,
        description: descriptionRO || null,
      },
      {
        language: 'ru',
        title: titleRU || titleRO,
        description: descriptionRU || descriptionRO || null,
      },
    ];

    setIsLoading(true);
    try {
      if (isCreating) {
        const result = await dispatch(
          createLatestWork({ is_active: isActive, translations }),
        ).unwrap();
        await uploadImages(result.id, imageFiles);
        await dispatch(updateLatestWork({ id: result.id })).unwrap();
      } else {
        const id = parseInt(latestWorkId!);
        await uploadImages(id, imageFiles);
        await dispatch(
          updateLatestWork({ id, is_active: isActive, translations }),
        ).unwrap();
      }
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
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
          <h3>
            {isCreating
              ? t('latestWork.headerCreate')
              : t('latestWork.headerEdit')}
          </h3>

          <div className='catalog-item-form-section'>
            <h4>Română</h4>
            <div className='form-field'>
              <label>{t('latestWork.title')} *</label>
              <input
                type='text'
                name='titleRO'
                required
                value={titleRO}
                onChange={(e) => setTitleRO(e.target.value)}
              />
            </div>
            <div className='form-field'>
              <label>{t('latestWork.description')}</label>
              <textarea
                value={descriptionRO}
                onChange={(e) => setDescriptionRO(e.target.value)}
                name='descriptionRO'
              />
            </div>
          </div>

          <div className='catalog-item-form-section'>
            <h4>Русский</h4>
            <div className='form-field'>
              <label>{t('latestWork.title')}</label>
              <input
                type='text'
                name='titleRU'
                value={titleRU}
                onChange={(e) => setTitleRU(e.target.value)}
              />
            </div>
            <div className='form-field'>
              <label>{t('latestWork.description')}</label>
              <textarea
                value={descriptionRU}
                onChange={(e) => setDescriptionRU(e.target.value)}
                name='descriptionRU'
              />
            </div>
          </div>

          <div className='form-field'>
            <label>{t('latestWork.isActive')}</label>
            <input
              type='checkbox'
              name='isActive'
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </div>

          <div className='form-field'>
            <label>
              {t('latestWork.images')}
              {isCreating && ' *'}
            </label>
            <input
              type='file'
              name='images'
              accept='image/*'
              multiple
              required={isCreating}
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
              <label>{t('latestWork.existingImages')}</label>
              <div className='form-existing-images'>
                {existingImages.map((image) => (
                  <div key={image.id} className='form-existing-image-card'>
                    <img src={image.image_url} alt='' />
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
            ) : isCreating ? (
              t('latestWork.submitCreate')
            ) : (
              t('latestWork.submitEdit')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
