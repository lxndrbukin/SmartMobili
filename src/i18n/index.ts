import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import header_en from "./locales/en/header.json";
import header_ru from "./locales/ru/header.json";
import header_ro from "./locales/ro/header.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      header: header_en,
    },
    ru: {
      header: header_ru,
    },
    ro: {
      header: header_ro,
    },
  },
  lng: "en",
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
