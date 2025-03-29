import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import router from './router.js';
import App from './App.vue';
import 'vuetify/styles';

createApp(App).use(createVuetify({})).use(router).use(createPinia()).mount('#app');
