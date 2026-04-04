export type Language = "en" | "ro" | "ru";

export type SystemState = {
  currentLang: Language;
};

export type CategoryProps = {
  id: number;
  slug: string;
  name: string;
  language: string;
};

export type CatalogState = {
  items: Array<ItemProps>;
  currentItem: ItemProps | null;
  categories: Array<CategoryProps>;
};

export type ItemProps = {
  id: number;
  price: number;
  category_id: number;
  created_at: string;
  title: string;
  description: string;
  language: Language;
  images: Array<ImageProps>;
};

export type ImageProps = {
  id: number;
  item_id: number;
  image_url: string;
  order: number;
};

export type UserProps = {
  id: number;
  username: string;
  created_at: string;
};

export type AuthProps = {
  token: string | null;
  user: UserProps | null;
  isLoading: boolean;
  error: string | null;
};