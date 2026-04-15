import {
  type JSX,
  type FormEvent,
  type ChangeEvent,
  useEffect,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  type AppDispatch,
  createCategory,
  updateCategory,
  addCategoryImage,
} from '../../../store';
import axios from 'axios';
import { API_URL } from '../../../api';

export default function CategoryForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('admin');
  const [categoryRO, setCategoryRO] = useState('');
  const [categoryRU, setCategoryRU] = useState('');
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Array<File>>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const isCreating = searchParams.get('createCategory') === '1';
  const categoryId = searchParams.get('editCategory');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!isCreating) {
      axios
        .get(`${API_URL}/api/v1/categories/${categoryId}?lang=ro`)
        .then((res) => {
          setCategoryRO(res.data.name);
          setSlug(res.data.slug);
        });

      axios
        .get(`${API_URL}/api/v1/categories/${categoryId}?lang=ru`)
        .then((res) => setCategoryRU(res.data.name));
    }
  }, [categoryId]);

  const handleClose = () => {
    setSearchParams({});
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const images = Array.from(e.target.files || []);
    setSelectedImages(images);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nameRO = formData.get('nameRO') as string;
    const nameRU = formData.get('nameRU') as string;
    const slug = formData.get('slug') as string;
    const imageFiles = formData.getAll('images') as File[];
    const data = {
      slug,
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
    };
    setIsLoading(true);
    if (isCreating) {
      const result = await dispatch(createCategory(data)).unwrap();
      const categoryId = result.id;
      for (const imageFile of imageFiles) {
        if (imageFile && imageFile.size > 0) {
          const imageFormData = new FormData();
          imageFormData.append('image', imageFile);
          await dispatch(
            addCategoryImage({ categoryId, image: imageFormData }),
          );
        }
      }
    } else {
      await dispatch(
        updateCategory({
          id: parseInt(categoryId!),
          ...data,
        }),
      ).unwrap();

      for (const imageFile of imageFiles) {
        if (imageFile && imageFile.size > 0) {
          const imageFormData = new FormData();
          imageFormData.append('image', imageFile);
          await dispatch(
            addCategoryImage({
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
            {isCreating ? t('category.headerCreate') : t('category.headerEdit')}
          </h3>
          <div className='form-field'>
            <label>{t('category.title')} (RO)</label>
            <input
              value={categoryRO}
              onChange={(e) => setCategoryRO(e.target.value)}
              name='nameRO'
            />
          </div>
          <div className='form-field'>
            <label>{t('category.title')} (RU)</label>
            <input
              value={categoryRU}
              onChange={(e) => setCategoryRU(e.target.value)}
              name='nameRU'
            />
          </div>
          <div className='form-field'>
            <label>{t('category.url')} (e.g. tables, kitchens)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              name='slug'
            />
          </div>
          <div className='form-field'>
            <label>Image</label>
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
          <button disabled={isLoading} type='submit'>
            {isCreating ? t('category.submitCreate') : t('category.submitEdit')}
          </button>
        </form>
      </div>
    </div>
  );
}
