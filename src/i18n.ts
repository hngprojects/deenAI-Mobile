import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar/translation.json';
import en from './locales/en/translation.json';
import fr from './locales/fr/translation.json';
import ha from './locales/ha/translation.json';
import tr from './locales/tr/translation.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    lng: Localization.getLocales()[0].languageCode || "en",
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      tr: { translation: tr },
      ha: { translation: ha },
      ar: { translation: ar },
    },
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
