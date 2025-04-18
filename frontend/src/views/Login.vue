<template>
    <div class="container">
        <v-card class="pa-4 pb-20" elevation="2" width="350" :loading="loading">
            <v-card-subtitle v-if="hasFailedLogin" opacity="100" class="pl-0 pb-2 text-error">
                {{ errorText }}
            </v-card-subtitle>
            <v-text-field
                v-model="identifier"
                density="compact"
                label="Email or Phone"
                variant="outlined"
                @keydown.enter="login"
            ></v-text-field>
            <v-text-field
                v-model="password"
                type="password"
                density="compact"
                label="Password"
                variant="outlined"
                @keydown.enter="login"
            ></v-text-field>

            <v-btn color="blue" size="large" variant="tonal" block @click="login"> Log In </v-btn>

            <v-card-text class="text-center">
                <router-link to="/signup" class="text-accent text-decoration-none"
                    >Sign up now</router-link
                >
            </v-card-text>
            <v-card-text class="text-center py-0">
                <router-link to="/forgot" class="text-grey text-decoration-none"
                    >Forgot password</router-link
                >
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';
import { ref } from 'vue';
import router from '@/router';
import { useRoute } from 'vue-router';
import { emailValidator, passwordValidator, phoneValidator } from '@/utilities/regex';

const route = useRoute();

const identifier = ref('');
const password = ref('');
const loading = ref(false);

const hasFailedLogin = ref(false);
const defaultError = 'An error occurred. Please try again.';
const errorText = ref(defaultError);

const userStore = useUserStore();
const { authenticateUser } = userStore;

async function login() {
    hasFailedLogin.value = false;
    errorText.value = '';
    loading.value = true;
    const isEmail = emailValidator.test(identifier.value);
    const isPhone = phoneValidator.test(identifier.value);
    if (!((isEmail || isPhone) && passwordValidator.test(password.value))) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        errorText.value = 'Invalid login credentials. Please try again.';
        hasFailedLogin.value = true;
    } else {
        const { status, text } = await authenticateUser(identifier.value, password.value);
        if (status) {
            router.replace(route.redirectedFrom?.path ?? '/content');
            clearInputs();
        } else {
            errorText.value = text;
            hasFailedLogin.value = true;
        }
    }
    loading.value = false;
}

function clearInputs() {
    identifier.value = '';
    password.value = '';
    hasFailedLogin.value = false;
    errorText.value = '';
}
</script>

<style scoped lang="less">
.container {
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
.incorrect-creds-text {
    color: red;
}
</style>
