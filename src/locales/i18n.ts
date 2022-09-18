import { createI18n } from 'vue-i18n';

import RU from './files/ru.json';
import EN from './files/en.json';

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        ru: RU,
        en: EN,
    },
});

export default i18n;
