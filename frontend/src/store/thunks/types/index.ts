export type ItemTranslationProps = {
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

export type CategoryImageUpdate = {
  categoryId: number;
  image: FormData;
};

export type ItemRequest = {
  itemId: number;
  lang: string | undefined;
};

export type ItemsRequest = {
  lang: string | null;
  categoryId?: number;
  categorySlug?: string;
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

export type CategoryUpdate = {
  id: number;
  slug: string | undefined;
  translations: Array<CategoryTranslationProps> | undefined;
};

export type CategoryRequest = {
  id: number;
  lang?: string;
};

export type InquiryCreate = {
  name: string;
  subject: string;
  description: string | null;
  phone: string;
  email: string | null;
  item_id: number | null;
  telegram: boolean;
  viber: boolean;
  whatsapp: boolean;
};

export type InquiryUpdate = {
  id: number;
  name: string | null;
  subject: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  item_id: number | null;
  telegram: boolean | null;
  viber: boolean | null;
  whatsapp: boolean | null;
};

export type UserUpdate = {
  id: number;
  username: string | null;
  user_role: string | null;
};