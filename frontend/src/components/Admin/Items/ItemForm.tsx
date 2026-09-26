import {
  type JSX,
  type SubmitEvent,
  type ChangeEvent,
  useEffect,
  useState,
} from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  type RootState,
  type AppDispatch,
  type CategoryProps,
  getCategories,
  createItem,
  updateItem,
  addItemImage,
  deleteItemImage,
} from '../../../store';
import axios from 'axios';
import { API_URL } from '../../../api';

export default function ItemForm(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation('admin');
  const { lang } = useParams<{ lang: string; itemId: string }>();
  const { categories } = useSelector((state: RootState) => state.catalog);

  const [searchParams, setSearchParams] = useSearchParams();
  const isCreating = searchParams.get('createItem') === '1';
  const itemId = searchParams.get('editItem');

  const [itemTitleRU, setItemTitleRU] = useState('');
  const [itemTitleRO, setItemTitleRO] = useState('');
  const [itemDescRU, setItemDescRU] = useState('');
  const [itemDescRO, setItemDescRO] = useState('');
  const [itemPrice, setItemPrice] = useState<string>('');
  const [itemCurrency, setItemCurrency] = useState<string>('');
  const [itemCategoryId, setItemCategoryId] = useState(0);
  const [selectedImages, setSelectedImages] = useState<Array<File>>([]);
  const [inGallery, setInGallery] = useState(false);
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
    if (itemId) {
      axios.get(`${API_URL}/api/v1/items/${itemId}?lang=ro`).then((res) => {
        setItemTitleRO(res.data.title);
        setItemDescRO(res.data.description);
        setItemCategoryId(res.data.category.id);
        setItemPrice(res.data.price);
        setItemCurrency(res.data.currency);
        setExistingImages(res.data.images || []);
        setInGallery(res.data.in_gallery);
      });
      axios.get(`${API_URL}/api/v1/items/${itemId}?lang=ru`).then((res) => {
        setItemTitleRU(res.data.title);
        setItemDescRU(res.data.description);
      });
    }
  }, [itemId]);

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      setIsLoading(true);
      await dispatch(
        deleteItemImage({ itemId: Number(itemId), imageId }),
      ).unwrap();
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(getCategories(lang));
  }, [lang]);

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
    const titleRO = formData.get('titleRO') as string;
    const descriptionRO = formData.get('descriptionRO') as string;
    const titleRU = formData.get('titleRU') as string;
    const descriptionRU = formData.get('descriptionRU') as string;
    const price = formData.get('price') as string;
    const currency = formData.get('currency') as string;
    const categoryId = formData.get('categoryId') as string;
    const imageFiles = formData.getAll('images') as File[];
    const inGallery = formData.get('inGallery') === 'on';
    const data = {
      translations: [
        {
          language: 'ro',
          title: titleRO,
          description: descriptionRO,
        },
        {
          language: 'ru',
          title: titleRU,
          description: descriptionRU,
        },
      ],
      price: parseFloat(price),
      currency,
      category_id: Number(categoryId),
      in_gallery: inGallery,
    };
    setIsLoading(true);
    if (isCreating) {
      const result = await dispatch(createItem(data)).unwrap();
      const itemId = result.id;
      for (const imageFile of imageFiles) {
        if (imageFile && imageFile.size > 0) {
          const imageFormData = new FormData();
          imageFormData.append('image', imageFile);
          await dispatch(addItemImage({ itemId, image: imageFormData }));
        }
      }
    } else {
      await dispatch(
        updateItem({
          id: parseInt(itemId!),
          ...data,
        }),
      ).unwrap();

      for (const imageFile of imageFiles) {
        if (imageFile && imageFile.size > 0) {
          const imageFormData = new FormData();
          imageFormData.append('image', imageFile);
          await dispatch(
            addItemImage({
              itemId: parseInt(itemId!),
              image: imageFormData,
            }),
          );
        }
      }
      setIsLoading(false);
    }
    handleClose();
  };

  const renderCategories = (categories: Array<CategoryProps>) => {
    if (!categories) return null;
    return categories.map((category) => {
      return (
        <option value={category.id} key={category.id}>
          {category.name}
        </option>
      );
    });
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
          <h3>{isCreating ? t('item.headerCreate') : t('item.headerEdit')}</h3>
          <div className='catalog-item-form-section'>
            <h4>Română</h4>
            <div className='form-field'>
              <label>{t('item.title')}</label>
              <input
                value={itemTitleRO || ''}
                onChange={(e) => setItemTitleRO(e.target.value)}
                name='titleRO'
              />
            </div>
            <div className='form-field'>
              <label>{t('item.description')}</label>
              <textarea
                value={itemDescRO || ''}
                onChange={(e) => setItemDescRO(e.target.value)}
                name='descriptionRO'
              />
            </div>
          </div>
          <div className='catalog-item-form-section'>
            <h4>Русский</h4>
            <div className='form-field'>
              <label>{t('item.title')}</label>
              <input
                value={itemTitleRU}
                onChange={(e) => setItemTitleRU(e.target.value)}
                name='titleRU'
              />
            </div>
            <div className='form-field'>
              <label>{t('item.description')}</label>
              <textarea
                value={itemDescRU || ''}
                onChange={(e) => setItemDescRU(e.target.value)}
                name='descriptionRU'
              />
            </div>
          </div>
          <div className='form-field price-currency'>
            <div>
              <label>{t('item.price')}</label>
              <input
                value={itemPrice || ''}
                onChange={(e) => setItemPrice(e.target.value)}
                type='number'
                name='price'
                className='price'
              />
            </div>
            <div>
              <label>{t('item.currency')}</label>
              <select
                value={itemCurrency}
                onChange={(e) => setItemCurrency(e.target.value)}
                name='currency'
                className='currency'
              >
                <option></option>
                <option>MDL</option>
                <option>€</option>
              </select>
            </div>
          </div>
          <div className='form-field'>
            <label>{t('item.category')}</label>
            <select
              value={itemCategoryId}
              onChange={(e) => setItemCategoryId(Number(e.target.value))}
              className='category-select'
              name='categoryId'
            >
              {renderCategories(categories)}
            </select>
          </div>
          <div className='form-field'>
            <label>{t('item.inGallery')}</label>
            <input
              type='checkbox'
              checked={inGallery}
              onChange={(e) => setInGallery(e.target.checked)}
              name='inGallery'
            />
          </div>
          <div className='form-field'>
            <label>{t('item.images')}</label>
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
              <label>{t('item.existingImages')}</label>
              {existingImages.length > 0 ? (
                <div className='form-existing-images'>
                  {existingImages.map((img) => (
                    <div key={img.id} className='form-existing-image-card'>
                      <img src={img.image_url} alt='Item image' />
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
                  {t('item.noImages')}
                </p>
              )}
            </div>
          )}
          <button disabled={isLoading} type='submit'>
            {isCreating ? t('item.submitCreate') : t('item.submitEdit')}
          </button>
        </form>
      </div>
    </div>
  );
}
