import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import header_en from "./locales/en/header.json";
import header_ru from "./locales/ru/header.json";
import header_ro from "./locales/ro/header.json";
import footer_ru from "./locales/ru/footer.json";
import footer_en from "./locales/en/footer.json";
import footer_ro from "./locales/ro/footer.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      header: header_en,
      footer: footer_en,
    },
    ru: {
      header: header_ru,
      footer: footer_ru,
    },
    ro: {
      header: header_ro,
      footer: footer_ro,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
