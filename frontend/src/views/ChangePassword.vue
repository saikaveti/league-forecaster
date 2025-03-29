<template>
    <v-img
        class="mx-auto my-6"
        max-width="228"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
    ></v-img>
    <div class="container">
        <v-card class="pa-4 pb-20" elevation="2" width="350" :loading="loading">
            <v-card-text v-if="error" class="pa-1 pb-5 invalid">{{ error }}</v-card-text>
            <TransitionGroup name="move">
                <div
                    v-if="successfullyChangedPassword"
                    class="pl-0 pb-2 mb-4 text-center confirmation-text"
                >
                    Your password has been successfully changed. You may now log in with your new
                    password.
                </div>
            </TransitionGroup>
            <v-text-field
                v-model="password"
                type="password"
                density="compact"
                label="Password"
                variant="outlined"
                :class="password !== '' && !passwordIsValid && 'invalid'"
                :color="password !== '' && passwordIsValid ? 'green' : undefined"
            ></v-text-field>
            <v-text-field
                v-model="passwordVerify"
                type="password"
                density="compact"
                label="Verify Password"
                variant="outlined"
                :class="passwordVerify !== '' && !passwordVerifyIsValid && 'invalid'"
                :color="passwordVerify !== '' && passwordVerifyIsValid ? 'green' : undefined"
            ></v-text-field>
            <v-btn
                color="blue"
                size="large"
                variant="tonal"
                block
                @click="changePassword"
                :disabled="
                    !(passwordIsValid && passwordVerifyIsValid) && !successfullyChangedPassword
                "
            >
                Change Password
            </v-btn>
            <v-card-text v-if="successfullyChangedPassword" class="text-center">
                <router-link to="/login" class="text-blue text-decoration-none" @click="clearInputs"
                    >Back to login</router-link
                >
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { emailValidator, passwordValidator, uuidValidator } from '@/utilities/regex';
import { serverHost } from './constants';
import { useRoute } from 'vue-router';

const route = useRoute();

const email = route.query?.email as string;
const rps = route.query?.rps as string;
const password = ref('');
const passwordVerify = ref('');
const error = ref('');

const passwordIsValid = computed(() => {
    return passwordValidator.test(password.value);
});

const passwordVerifyIsValid = computed(() => {
    return passwordVerify.value === password.value;
});

const successfullyChangedPassword = ref(false);
const loading = ref(false);

async function changePassword() {
    error.value = '';
    loading.value = true;
    if (
        passwordIsValid.value &&
        passwordVerifyIsValid.value &&
        emailValidator.test(email) &&
        uuidValidator.test(rps)
    ) {
        const res = await fetch(`${serverHost}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password.value,
                resetSession: rps,
            }),
        });
        if (res.ok) {
            successfullyChangedPassword.value = true;
        } else {
            error.value = await res.text();
        }
    } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        error.value =
            'We are unable to complete your request at this time. Please try again later.';
    }
    loading.value = false;
}

function clearInputs() {
    password.value = '';
    passwordVerify.value = '';
    successfullyChangedPassword.value = false;
    loading.value = false;
    error.value = '';
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
.confirmation-text {
    color: rgb(46, 46, 46);
}
.default {
    color: rgba(0, 0, 0, 0.75);
}

.invalid {
    color: rgba(255, 0, 0, 0.75);
}

.move-move,
.move-enter-active,
.move-leave-active {
    transition: all 0.5s ease;
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.move-leave-active {
    position: absolute;
}

.move-enter-from,
.move-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>
