import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@vueuse/head';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';

import i18n from '@/locales/i18n';

import tooltip from '@/directives/v-tooltip';

createApp(App)
    .use(createPinia())
    .use(createHead())
    .use(i18n)
    .use(router)
    .directive('tooltip', tooltip())
    .mount('#app');
