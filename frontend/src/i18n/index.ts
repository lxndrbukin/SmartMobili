import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import admin_en from "./locales/en/admin.json";
import admin_ro from "./locales/ro/admin.json";
import admin_ru from "./locales/ru/admin.json";
import auth_en from "./locales/en/auth.json";
import auth_ro from "./locales/ro/auth.json";
import auth_ru from "./locales/ru/auth.json";
import general_en from "./locales/en/general.json";
import general_ro from "./locales/ro/general.json";
import general_ru from "./locales/ru/general.json";
import header_en from "./locales/en/header.json";
import header_ru from "./locales/ru/header.json";
import header_ro from "./locales/ro/header.json";
import footer_ru from "./locales/ru/footer.json";
import footer_en from "./locales/en/footer.json";
import footer_ro from "./locales/ro/footer.json";
import catalog_en from "./locales/en/catalog.json";
import catalog_ro from "./locales/ro/catalog.json";
import catalog_ru from "./locales/ru/catalog.json";
import categories_ru from "./locales/ru/categories.json";
import categories_en from "./locales/en/categories.json";
import categories_ro from "./locales/ro/categories.json";
import carousel_ru from "./locales/ru/carousel.json";
import carousel_en from "./locales/en/carousel.json";
import carousel_ro from "./locales/ro/carousel.json";
import banners_en from "./locales/en/banners.json";
import banners_ro from "./locales/ro/banners.json";
import banners_ru from "./locales/ru/banners.json";
import itemPage_en from "./locales/en/itemPage.json";
import itemPage_ru from "./locales/ru/itemPage.json";
import itemPage_ro from "./locales/ro/itemPage.json";
import orderSteps_en from "./locales/en/orderSteps.json";
import orderSteps_ro from "./locales/ro/orderSteps.json";
import orderSteps_ru from "./locales/ru/orderSteps.json";
import contactForm_en from "./locales/en/contactForm.json";
import contactForm_ro from "./locales/ro/contactForm.json";
import contactForm_ru from "./locales/ru/contactForm.json";
import about_en from "./locales/en/about.json";
import about_ro from "./locales/ro/about.json";
import about_ru from "./locales/ru/about.json";
import services_en from "./locales/en/services.json";
import services_ro from "./locales/ro/services.json";
import services_ru from "./locales/ru/services.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      admin: admin_en,
      auth: auth_en,
      general: general_en,
      header: header_en,
      footer: footer_en,
      catalog: catalog_en,
      categories: categories_en,
      carousel: carousel_en,
      banners: banners_en,
      itemPage: itemPage_en,
      orderSteps: orderSteps_en,
      contactForm: contactForm_en,
      about: about_en,
      services: services_en
    },
    ru: {
      admin: admin_ru,
      auth: auth_ru,
      general: general_ru,
      header: header_ru,
      footer: footer_ru,
      catalog: catalog_ru,
      categories: categories_ru,
      carousel: carousel_ru,
      banners: banners_ru,
      itemPage: itemPage_ru,
      orderSteps: orderSteps_ru,
      contactForm: contactForm_ru,
      about: about_ru,
      services: services_ru
    },
    ro: {
      admin: admin_ro,
      auth: auth_ro,
      general: general_ro,
      header: header_ro,
      footer: footer_ro,
      catalog: catalog_ro,
      categories: categories_ro,
      carousel: carousel_ro,
      banners: banners_ro,
      itemPage: itemPage_ro,
      orderSteps: orderSteps_ro,
      contactForm: contactForm_ro,
      about: about_ro,
      services: services_ro
    },
  },
  lng: localStorage.getItem("language") || "ro",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
