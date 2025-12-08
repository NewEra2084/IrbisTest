// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEn from '@/locales/en/translation.json';
import translationRu from '@/locales/ru/translation.json';
import translationFr from '@/locales/fr/translation.json';
import translationDe from '@/locales/de/translation.json';
import translationEs from '@/locales/es/translation.json';
import translationZh from '@/locales/zh/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: translationEn },
      ru: { translation: translationRu },
      fr: { translation: translationFr },
      de: { translation: translationDe },
      es: { translation: translationEs },
      zh: { translation: translationZh },
    },
  });

export default i18n;
