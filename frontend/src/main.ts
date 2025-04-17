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
            theme: {
                defaultTheme: 'light',
                themes: {
                    light: {
                        dark: false,
                        colors: {
                            primary: '#1976D2',
                            secondary: '#424242',
                            accent: '#82B1FF',
                            error: '#FF5252',
                            info: '#2196F3',
                            success: '#4CAF50',
                            warning: '#FB8C00',
                            background: '#FFFFFF',
                            surface: '#FFFFFF',
                        },
                    },
                    dark: {
                        dark: true,
                        colors: {
                            primary: '#90CAF9',
                            secondary: '#BDBDBD',
                            accent: '#448AFF',
                            error: '#FFCDD2',
                            info: '#64B5F6',
                            success: '#81C784',
                            warning: '#FFB74D',
                            background: '#121212',
                            surface: '#1E1E1E',
                        },
                    },
                },
            },
        })
    )
    .use(router)
    .use(createPinia())
    .mount('#app');
