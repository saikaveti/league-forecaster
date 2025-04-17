import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('./views/Login.vue'),
    },
    {
        path: '/signup',
        name: 'Signup',
        component: () => import('./views/Signup.vue'),
    },
    {
        path: '/content',
        name: 'Content',
        component: () => import('./views/Content.vue'),
    },
    {
        path: '/forgot',
        name: 'ForgotPassword',
        component: () => import('./views/ForgotPassword.vue'),
    },
    {
        path: '/change-password',
        name: 'ChangePassword',
        component: () => import('./views/ChangePassword.vue'),
    },
    {
        path: '/themes',
        name: 'Themes',
        component: () => import('./views/Themes.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    if (
        // if user presses sign up from login, preserve where they got redirected to login from so that they can be rerouted appropriately if possible
        (from.name === 'Login' && to.name === 'Signup') ||
        (to.name === 'Login' && from.name === 'Signup')
    ) {
        to.redirectedFrom = from.redirectedFrom;
    } else if (
        // if user presses login from change password, clear redirectedFrom so that they dont get redirected back to ChangePassword
        from.name === 'ChangePassword' &&
        to.name === 'Login'
    ) {
        to.redirectedFrom = undefined;
    } else {
        to.redirectedFrom = from;
    }
    next();
});

export default router;
