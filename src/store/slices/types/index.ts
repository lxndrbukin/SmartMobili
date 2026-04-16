export type Language = "en" | "ro" | "ru";

export type SystemState = {
  currentLang: Language;
};

export type CategoryProps = {
  id: number;
  slug: string;
  name: string;
  item_count: number;
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
  category: {
    id: number;
    slug: string;
    name: string;
  };
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
  user_role: string;
  signup_at: string;
};

export type AuthState = {
  token: string | null;
  user: UserProps | null;
  isLoading: boolean;
  error: string | null;
};

export type AuthResponse = {
  access_token: string;
  token_type: string;
};

export type AdminState = {
  users: Array<UserProps> | null;
  orders: Array<{ id: number; title: string; }> | null;
};