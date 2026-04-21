export type Language = "en" | "ro" | "ru";

export type SystemState = {
  currentLang: Language;
};

export type Pagination = {
  skip: number;
  limit: number;
};

export type CategoryProps = {
  id: number;
  slug: string;
  name: string;
  item_count: number;
  language: string;
  images: Array<ImageProps>;
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

export type InquiryProps = {
  id: number;
  name: string;
  subject: string;
  description: string | null;
  item_id: number | null;
  phone: string;
  email: string | null;
  created_at: Date;
  telegram: boolean;
  viber: boolean;
  whatsapp: boolean;
};

export type AuthState = {
  token: string | null;
  user: UserProps | null;
  isLoading: boolean;
  error: string | null;
};

export type PaginatedUsersResponse = {
  data: Array<UserProps>;
  pagination: Pagination | null;
};

export type PaginatedInquiriesResponse = {
  data: Array<InquiryProps>;
  pagination: Pagination | null;
};


export type AuthResponse = {
  access_token: string;
  token_type: string;
};

export type AdminState = {
  users: {
    data: Array<UserProps>;
    pagination: Pagination | null;
    currentUser: UserProps | null;
  };
  inquiries: {
    data: Array<InquiryProps>;
    pagination: Pagination | null;
    currentInquiry: InquiryProps | null;
  };
};

