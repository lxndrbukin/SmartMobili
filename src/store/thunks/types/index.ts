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

export type ItemUpdate = {
  id: number;
  price: number | undefined;
  category_id: number | undefined;
  translations: Array<ItemTranslationProps> | undefined;
};

export type ItemImageUpdate = {
  itemId: number;
  image: FormData;
};

export type ItemRequest = {
  itemId: number;
  lang: string | undefined;
};

export type ItemsRequest = {
  lang: string | undefined;
  categoryId?: number;
  limit?: number;
};

export type CategoryTranslationProps = {
  language: string;
  name: string;
};

export type CategoryCreate = {
  slug: string;
  translations: Array<CategoryTranslationProps>;
};

export type CategoryRequest = {
  id: number;
  lang?: string;
};

export type InquiryCreate = {
  name: string;
  subject: string;
  description: string | undefined;
  phone: string;
  email: string | undefined;
  item_id: number | undefined;
  telegram: boolean;
  viber: boolean;
  whatsapp: boolean;
};

export type InquiryUpdate = {
  id: number;
  name: string | undefined;
  subject: string | undefined;
  description: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  item_id: number | undefined;
  telegram: boolean | undefined;
  viber: boolean | undefined;
  whatsapp: boolean | undefined;
};
