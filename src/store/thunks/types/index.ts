type ItemTranslationProps = {
  language: string;
  title: string;
  description: string;
};

export type ItemCreate = {
  price: number;
  category_id: number;
  translations: Array<ItemTranslationProps>;
};

export type CategoryTranslationProps = {
  language: string;
  name: string;
};

export type CategoryCreate = {
  slug: string;
  translations: Array<CategoryTranslationProps>;
};
