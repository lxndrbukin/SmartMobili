import { type JSX } from 'react';
import { Link } from 'react-router-dom';
import useLocalePath from '../../hooks/useLocalePath';
import { useTranslation } from 'react-i18next';

export default function Categories(): JSX.Element {
  const { t } = useTranslation('categories');

  const to = useLocalePath();

  const categories = t('sections', { returnObjects: true }) as Array<{
    label: string;
    href: string;
    tag: string;
    img: string;
  }>;

  const baseImgURL =
    'https://raw.githubusercontent.com/lxndrbukin/shkafmaster-new/refs/heads/main/public/imgs';

  const header = t('header');

  const renderCategories = (
    categories: Array<{
      label: string;
      href: string;
      tag: string;
      img: string;
    }>,
  ) => {
    return categories.map((category) => {
      return (
        <Link
          to={to(category.href)}
          className={`category ${category.tag.toLowerCase()}`}
        >
          <img
            src={`${baseImgURL}/menu_${category.tag.replace('s', '')}.png`}
            className='category-bg'
          />
          <span className='category-header'>
            {category.label.toUpperCase()}
          </span>
        </Link>
      );
    });
  };

  return (
    <div className='categories-wrapper'>
      <div className='categories'>
        <h3 className='categories-header'>{header}</h3>
        <div className='categories-list'>{renderCategories(categories)}</div>
      </div>
    </div>
  );
}
