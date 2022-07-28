import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

import tooltip from '@/directives/v-tooltip'

createApp(App)
    .use(createPinia())
    .use(router)
    .directive('tooltip', tooltip())
    .mount("#app");
