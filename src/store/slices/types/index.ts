export type Language = "en" | "ro" | "ru";

export type LanguageState = {
  current: Language;
};

export type CatalogState = {
  catalog: Array<ItemProps>;
  currentItem: ItemProps | null;
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
