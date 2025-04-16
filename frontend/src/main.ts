import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import router from './router.js';
import App from './App.vue';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.min.css';

createApp(App).use(createVuetify({})).use(router).use(createPinia()).mount('#app');
