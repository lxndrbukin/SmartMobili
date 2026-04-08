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
  addImage,
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
  const [itemCategoryId, setItemCategoryId] = useState(0);
  const [selectedImages, setSelectedImages] = useState<Array<File>>([]);

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
        setItemCategoryId(res.data.category_id);
        setItemPrice(res.data.price);
      });

      axios.get(`${API_URL}/api/v1/items/${itemId}?lang=ru`).then((res) => {
        setItemTitleRU(res.data.title);
        setItemDescRU(res.data.description);
      });
    }
  }, [itemId]);

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
    const categoryId = formData.get('categoryId') as string;
    const imageFiles = formData.getAll('images') as File[];
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
      category_id: Number(categoryId),
    };
    if (isCreating) {
      const result = await dispatch(createItem(data)).unwrap();
      const itemId = result.id;
      for (const imageFile of imageFiles) {
        if (imageFile && imageFile.size > 0) {
          const imageFormData = new FormData();
          imageFormData.append('image', imageFile);
          await dispatch(addImage({ itemId, image: imageFormData }));
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
            addImage({
              itemId: parseInt(itemId!),
              image: imageFormData,
            }),
          );
        }
      }
      // await dispatch(getItem({ itemId: Number(itemId), lang }));
    }
    handleClose();
  };

  const renderCategories = (categories: Array<CategoryProps>) => {
    if (!categories) return null; // replace with array of loading skeleton components
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
                value={itemTitleRO}
                onChange={(e) => setItemTitleRO(e.target.value)}
                name='titleRO'
              />
            </div>
            <div className='form-field'>
              <label>{t('item.description')}</label>
              <textarea
                value={itemDescRO}
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
                value={itemDescRU}
                onChange={(e) => setItemDescRU(e.target.value)}
                name='descriptionRU'
              />
            </div>
          </div>
          <div className='form-field'>
            <label>{t('item.price')}</label>
            <input
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              type='number'
              name='price'
              className='price'
            />
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
          <button type='submit'>
            {isCreating ? t('item.submitCreate') : t('item.submitEdit')}
          </button>
        </form>
      </div>
    </div>
  );
}
