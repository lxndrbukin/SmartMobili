import {
  type JSX,
  type FormEvent,
  type ChangeEvent,
  useEffect,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  type RootState,
  type AppDispatch,
  createServiceCategory,
  updateServiceCategory,
  addServiceCategoryImage,
  deleteServiceCategoryImage,
  getServiceCategories,
} from '../../../store';
import axios from 'axios';
import { API_URL } from '../../../api';

export default function ServiceCategoryForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('admin');
  const { categories } = useSelector((state: RootState) => state.services);
  const [categoryRO, setCategoryRO] = useState('');
  const [categoryRU, setCategoryRU] = useState('');
  const [slug, setSlug] = useState('');
  const [order, setOrder] = useState(1);
  const [parentId, setParentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Array<File>>([]);
  const [existingImages, setExistingImages] = useState<
    Array<{ id: number; image_url: string }>
  >([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const isCreating = searchParams.get('createServiceCategory') === '1';
  const categoryId = searchParams.get('editServiceCategory');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!isCreating && categoryId) {
      const reduxCat = categories.find((cat) => cat.id === Number(categoryId));
      if (reduxCat && reduxCat.images) {
        setExistingImages(reduxCat.images);
      }

      axios
        .get(`${API_URL}/api/v1/service_categories/${categoryId}?lang=ro`)
        .then((res) => {
          setCategoryRO(res.data.name || '');
          setSlug(res.data.slug || '');
          setOrder(res.data.order ?? 1);
          setParentId(res.data.parent_id ? String(res.data.parent_id) : '');
          if (res.data.images && res.data.images.length > 0) {
            setExistingImages(res.data.images);
          }
        });

      axios
        .get(`${API_URL}/api/v1/service_categories/${categoryId}?lang=ru`)
        .then((res) => setCategoryRU(res.data.name || ''));
    }
  }, [categoryId, isCreating, categories]);

  const handleClose = () => {
    setSearchParams({});
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const images = Array.from(e.target.files || []);
    setSelectedImages(images);
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      setIsLoading(true);
      await dispatch(
        deleteServiceCategoryImage({ categoryId: Number(categoryId), imageId }),
      ).unwrap();
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
      dispatch(getServiceCategories({ lang: 'ro', limit: undefined }));
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nameRO = formData.get('nameRO') as string;
    const nameRU = formData.get('nameRU') as string;
    const slugVal = formData.get('slug') as string;
    const parentIdVal = formData.get('parentId') as string;
    const imageFiles = formData.getAll('images') as File[];
    const orderVal = formData.get('order');

    const data = {
      slug: slugVal,
      parent_id: parentIdVal ? parseInt(parentIdVal) : null,
      translations: [
        {
          language: 'ro',
          name: nameRO,
        },
        {
          language: 'ru',
          name: nameRU,
        },
      ],
      order: Number(orderVal),
    };

    setIsLoading(true);
    if (isCreating) {
      const result = await dispatch(createServiceCategory(data)).unwrap();
      const createdCategoryId = result.id;
      for (const imageFile of imageFiles) {
        if (imageFile && imageFile.size > 0) {
          const imageFormData = new FormData();
          imageFormData.append('image', imageFile);
          await dispatch(
            addServiceCategoryImage({
              categoryId: createdCategoryId,
              image: imageFormData,
            }),
          );
        }
      }
    } else {
      await dispatch(
        updateServiceCategory({
          id: parseInt(categoryId!),
          ...data,
        }),
      ).unwrap();

      for (const imageFile of imageFiles) {
        if (imageFile && imageFile.size > 0) {
          const imageFormData = new FormData();
          imageFormData.append('image', imageFile);
          await dispatch(
            addServiceCategoryImage({
              categoryId: parseInt(categoryId!),
              image: imageFormData,
            }),
          );
        }
      }
      setIsLoading(false);
    }
    setIsLoading(false);
    handleClose();
  };

  return (
    <div className='modal-backdrop' onClick={handleClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className='catalog-category-form'>
          <button
            className='modal-close-btn'
            type='button'
            onClick={handleClose}
          >
            <i className='fa-solid fa-xmark'></i>
          </button>
          <h3>
            {isCreating
              ? t('serviceCategory.headerCreate', {
                  defaultValue: t('category.headerCreate'),
                })
              : t('serviceCategory.headerEdit', {
                  defaultValue: t('category.headerEdit'),
                })}
          </h3>
          <div className='form-field'>
            <label>
              {t('serviceCategory.title', { defaultValue: t('category.title') })}{' '}
              (RO)
            </label>
            <input
              value={categoryRO}
              onChange={(e) => setCategoryRO(e.target.value)}
              name='nameRO'
              required
            />
          </div>
          <div className='form-field'>
            <label>
              {t('serviceCategory.title', { defaultValue: t('category.title') })}{' '}
              (RU)
            </label>
            <input
              value={categoryRU}
              onChange={(e) => setCategoryRU(e.target.value)}
              name='nameRU'
              required
            />
          </div>
          <div className='form-field'>
            <label>
              {t('serviceCategory.url', { defaultValue: t('category.url') })}
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              name='slug'
              required
            />
          </div>
          <div className='form-field'>
            <label>
              {t('serviceCategory.order', { defaultValue: t('category.order') })}
            </label>
            <input
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              name='order'
              type='number'
            />
          </div>
          <div className='form-field'>
            <label>
              {t('serviceCategory.parentCategory', {
                defaultValue: t('category.parentCategory'),
              })}
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              name='parentId'
            >
              <option value=''>
                {t('serviceCategory.noneParent', {
                  defaultValue: t('category.noneParent'),
                })}
              </option>
              {categories
                .filter(
                  (cat) =>
                    !cat.parent_id && (!categoryId || cat.id !== Number(categoryId)),
                )
                .map((cat) => (
                  <option value={cat.id} key={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>
          <div className='form-field'>
            <label>
              {t('serviceCategory.images', { defaultValue: t('category.images') })}
            </label>
            <input
              onChange={handleImageChange}
              type='file'
              name='images'
              accept='image/*'
              multiple
            />
            {selectedImages.length > 0 && (
              <div className='selected-files'>
                {selectedImages.map((img, index) => (
                  <span key={index}>{img.name}</span>
                ))}
              </div>
            )}
          </div>
          {!isCreating && (
            <div className='form-field'>
              <label>
                {t('serviceCategory.existingImages', {
                  defaultValue: t('category.existingImages'),
                })}
              </label>
              {existingImages.length > 0 ? (
                <div className='form-existing-images'>
                  {existingImages.map((img) => (
                    <div key={img.id} className='form-existing-image-card'>
                      <img src={img.image_url} alt='Category image' />
                      <button
                        type='button'
                        onClick={() => handleDeleteImage(img.id)}
                        className='form-existing-image-delete-btn'
                      >
                        <i className='fa-solid fa-trash'></i>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    margin: '4px 0 0',
                  }}
                >
                  {t('serviceCategory.noImages', {
                    defaultValue: t('category.noImages'),
                  })}
                </p>
              )}
            </div>
          )}
          <button disabled={isLoading} type='submit'>
            {isCreating
              ? t('serviceCategory.submitCreate', {
                  defaultValue: t('category.submitCreate'),
                })
              : t('serviceCategory.submitEdit', {
                  defaultValue: t('category.submitEdit'),
                })}
          </button>
        </form>
      </div>
    </div>
  );
}
