import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import header_en from "./locales/en/header.json";
import header_ru from "./locales/ru/header.json";
import header_ro from "./locales/ro/header.json";
import footer_ru from "./locales/ru/footer.json";
import footer_en from "./locales/en/footer.json";
import footer_ro from "./locales/ro/footer.json";
import categories_ru from "./locales/ru/categories.json";
import categories_en from "./locales/en/categories.json";
import categories_ro from "./locales/ro/categories.json";
import carousel_ru from "./locales/ru/carousel.json";
import carousel_en from "./locales/en/carousel.json";
import carousel_ro from "./locales/ro/carousel.json";
import itemPage_en from "./locales/en/itemPage.json";
import itemPage_ru from "./locales/ru/itemPage.json";
import itemPage_ro from "./locales/ro/itemPage.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      header: header_en,
      footer: footer_en,
      categories: categories_en,
      carousel: carousel_en,
      itemPage: itemPage_en,
    },
    ru: {
      header: header_ru,
      footer: footer_ru,
      categories: categories_ru,
      carousel: carousel_ru,
      itemPage: itemPage_ru,
    },
    ro: {
      header: header_ro,
      footer: footer_ro,
      categories: categories_ro,
      carousel: carousel_ro,
      itemPage: itemPage_ro,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
