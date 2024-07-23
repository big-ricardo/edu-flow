import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ptBr from "./locales/pt-br.json";
import en from "./locales/en.json";

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: window.localStorage.getItem("locale") ?? "pt-BR",
    defaultNS: "translation",
    fallbackLng: "pt-BR",
    resources: {
      "pt-BR": {
        translation: ptBr,
      },
      "en-US": {
        translation: en,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });
