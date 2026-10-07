export type WeekViewsEntry = {
  timestamp: string;
  visitors: number;
  pageviews: number;
};

export type CountryEntry = {
  country: string;
  visitors: number;
  pageviews: number;
};

export type PageEntry = {
  requestPath: string;
  visitors: number;
  pageviews: number;
};
