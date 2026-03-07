type TranslationProps = {
  language: string;
  title: string;
  description: string;
};

export type ItemCreate = {
  price: number;
  category_id: number;
  translations: Array<TranslationProps>;
};
