import { createApp } from "vue";
import { createPinia } from 'pinia';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import VueVirtualScroller from 'vue-virtual-scroller'
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

createApp(App).use(createPinia()).use(router).use(VueVirtualScroller as any).mount("#app");
