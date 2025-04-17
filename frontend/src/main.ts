import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import router from './router.js';
import App from './App.vue';
import 'vuetify/styles';

createApp(App)
    .use(
        createVuetify({
            icons: {
                defaultSet: 'mdi',
                aliases,
                sets: {
                    mdi,
                },
            },
        })
    )
    .use(router)
    .use(createPinia())
    .mount('#app');
