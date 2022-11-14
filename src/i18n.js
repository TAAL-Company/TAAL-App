import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

const Languages = ['he-IL', 'ar']
i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'he-IL',
        debug: true,
        whitelist: Languages,
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },
        load: 'currentOnly'

    });


export default i18n;