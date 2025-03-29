<template>
    <v-img
        class="mx-auto mt-6 mb-16"
        max-width="228"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
    ></v-img>
    <div class="container d-flex justify-center pb-8">
        <v-card class="pa-4 pb-20" elevation="2" width="350" :loading="loading">
            <v-card-text v-if="serverError" class="pa-1 pb-5 invalid">{{
                serverError
            }}</v-card-text>
            <TransitionGroup name="move">
                <v-text-field
                    v-model="phone"
                    density="compact"
                    label="Phone Number"
                    variant="outlined"
                    prefix="🇺🇸 +1"
                    key="0"
                    :disabled="waitingToVerify || phoneNumberIsVerified"
                    :class="phone !== '' && !phoneIsValid && 'invalid'"
                    :color="phone !== '' && phoneIsValid ? 'green' : undefined"
                    @keydown.enter="(_: any) => phoneIsValid && sendTextCode()"
                ></v-text-field>
            </TransitionGroup>
            <TransitionGroup name="move">
                <v-text-field
                    v-if="waitingToVerify"
                    :disabled="waitingToVerify && verifyButtonText === 'Verify'"
                    v-model="textCode"
                    density="compact"
                    label="Text Code"
                    variant="outlined"
                    key="1"
                    inputmode="numeric"
                    autocomplete="one-time-code"
                    pattern="\d{6}"
                    :class="textCode !== '' && !textCodeIsValid && 'invalid'"
                    :color="textCode !== '' && textCodeIsValid ? 'green' : undefined"
                ></v-text-field>
            </TransitionGroup>
            <TransitionGroup name="move">
                <span v-if="phoneNumberIsVerified">
                    <v-text-field
                        v-model="email"
                        density="compact"
                        label="Email Address"
                        variant="outlined"
                        :class="email !== '' && !emailIsValid && 'invalid'"
                        :color="email !== '' && emailIsValid ? 'green' : undefined"
                        @keydown.enter="(_: any) => allSignupFieldsValid && submit()"
                    ></v-text-field>
                    <v-text-field
                        v-model="password"
                        type="password"
                        density="compact"
                        label="Password"
                        variant="outlined"
                        :class="password !== '' && !passwordIsValid && 'invalid'"
                        :color="password !== '' && passwordIsValid ? 'green' : undefined"
                        @keydown.enter="(_: any) => allSignupFieldsValid && submit()"
                    ></v-text-field>
                    <v-text-field
                        v-model="passwordVerify"
                        type="password"
                        density="compact"
                        label="Verify Password"
                        variant="outlined"
                        :class="passwordVerify !== '' && !passwordVerifyIsValid && 'invalid'"
                        :color="
                            passwordVerify !== '' && passwordVerifyIsValid ? 'green' : undefined
                        "
                        @keydown.enter="(_: any) => allSignupFieldsValid && submit()"
                    ></v-text-field>
                    <v-btn
                        color="blue"
                        size="large"
                        variant="tonal"
                        :disabled="!allSignupFieldsValid"
                        block
                        @click="submit"
                        >Sign Up</v-btn
                    >
                </span>
            </TransitionGroup>
            <v-btn
                v-if="!waitingToVerify && signupSession === ''"
                color="blue"
                size="large"
                variant="tonal"
                :disabled="!phoneIsValid"
                block
                @click="sendTextCode"
                >Send Text Code</v-btn
            >
            <v-btn
                v-if="waitingToVerify && verifyButtonText !== 'Verify'"
                color="blue"
                size="large"
                variant="tonal"
                block
                @click="verifyTextCode"
                ><span v-if="verifyButtonText">{{ verifyButtonText }}</span></v-btn
            >
            <v-btn
                v-else-if="waitingToVerify && verifyButtonText === 'Verify'"
                color="blue"
                size="large"
                variant="tonal"
                block
                @click="retry"
                ><span>Restart Verification</span></v-btn
            >
            <div
                v-for="(tip, idx) in tips"
                :key="idx"
                :class="tip.input === '' ? 'default' : tip.validator ? 'valid' : 'invalid'"
            >
                <v-card-text class="d-flex">
                    <span :class="!tip.input ? 'mr-5' : 'mr-4'">
                        {{ !tip.input ? '&ndash;' : tip.validator ? '✓' : '✗' }}
                    </span>
                    <span>{{ tip.text }}</span>
                </v-card-text>
            </div>
            <v-card-text class="text-center">
                <router-link to="/login" class="text-blue text-decoration-none" @click="resetFields"
                    >Back to login</router-link
                >
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import {
    emailValidator,
    passwordValidator,
    phoneValidator,
    textCodeValidator,
} from '@/utilities/regex';
import { computed, ref, watch } from 'vue';
import { serverHost } from './constants';
import { useRoute } from 'vue-router';
import router from '@/router';

const route = useRoute();

const email = ref('');
const password = ref('');
const passwordVerify = ref('');

const phone = ref('');
const signupSession = ref('');
const serverError = ref('');
const waitingToVerify = ref(false);
const textCode = ref('');
const phoneNumberIsVerified = ref(false);

watch(phone, (val) => {
    if (val.length > 12) {
        phone.value = phone.value.slice(0, 12);
    }
});

const loading = ref(false);

const emailIsValid = computed(() => {
    return emailValidator.test(email.value);
});

const passwordIsValid = computed(() => {
    return passwordValidator.test(password.value);
});

const passwordVerifyIsValid = computed(() => {
    return passwordVerify.value === password.value;
});

const phoneIsValid = computed(() => {
    return phoneValidator.test(phone.value);
});

const textCodeIsValid = computed(() => {
    return textCodeValidator.test(textCode.value);
});

watch(textCodeIsValid, (val) => {
    if (val) {
        verifyTextCode();
    }
});

const tips = computed(() => {
    const entries = [
        {
            input: phone.value,
            validator: phoneIsValid.value,
            text: 'Valid phone number. Only US numbers are supported at the moment. You will need to verify your phone number in the next screen.',
        },
        {
            input: email.value,
            validator: emailIsValid.value,
            text: 'Valid email address.',
        },
        {
            input: password.value,
            validator: passwordIsValid.value,
            text: 'Passwords must be 8-64 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one symbol.',
        },
        {
            input: passwordVerify.value,
            validator: passwordVerifyIsValid.value,
            text: 'Passwords match.',
        },
    ];
    return phoneNumberIsVerified.value ? entries.slice(1) : [entries[0]];
});

const allSignupFieldsValid = computed(() => {
    return emailIsValid.value && passwordIsValid.value && passwordVerifyIsValid.value;
});

async function sendTextCode() {
    loading.value = true;
    waitingToVerify.value = false;
    phoneNumberIsVerified.value = false;
    const res = await fetch(`${serverHost}/start-signup`, {
        method: 'POST',
        body: JSON.stringify({
            phone: phone.value,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (res.status === 200) {
        startCountdown();
        serverError.value = '';
        signupSession.value = await res.text();
        waitingToVerify.value = true;
    } else {
        serverError.value = await res.text();
    }
    loading.value = false;
}

const timeLeft = ref(600);
const timeLeftString = computed(() => {
    if (timeLeft.value <= 0) {
        return '';
    }
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
});
function startCountdown() {
    timeLeft.value = 600; // 10 minutes in seconds

    const intervalId = setInterval(() => {
        timeLeft.value--;
        if (timeLeft.value <= 0) {
            clearInterval(intervalId);
        }
    }, 1000); // Update every second
}

const verifyButtonText = computed(() => {
    if (!timeLeftString.value || !timeLeft) {
        return 'Verify';
    }
    return `Verify (${timeLeftString.value})`;
});

async function verifyTextCode() {
    waitingToVerify.value = true;
    loading.value = true;
    const res = await fetch(`${serverHost}/verify-phone`, {
        method: 'POST',
        body: JSON.stringify({
            signupSession: signupSession.value,
            textCode: textCode.value,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (res.status === 200) {
        serverError.value = '';
        phoneNumberIsVerified.value = true;
        waitingToVerify.value = false;
    } else {
        serverError.value = await res.text();
        phoneNumberIsVerified.value = false;
    }
    loading.value = false;
}

async function submit() {
    loading.value = true;
    const res = await fetch(`${serverHost}/finish-signup`, {
        method: 'POST',
        body: JSON.stringify({
            email: email.value,
            password: password.value,
            signupSession: signupSession.value,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (res.status === 200) {
        serverError.value = '';
        router.replace(route.redirectedFrom?.path ?? '/content');
    } else {
        serverError.value = await res.text();
    }
    loading.value = false;
}

async function retry() {
    loading.value = true;
    waitingToVerify.value = false;
    phoneNumberIsVerified.value = false;
    const res = await fetch(`${serverHost}/start-signup`, {
        method: 'POST',
        body: JSON.stringify({
            phone: phone.value,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (res.status === 200) {
        startCountdown();
        serverError.value = '';
        signupSession.value = await res.text();
        waitingToVerify.value = true;
    } else {
        serverError.value = await res.text();
        resetFields();
    }
    loading.value = false;
}

function resetFields() {
    email.value = '';
    password.value = '';
    passwordVerify.value = '';
    phone.value = '';
    signupSession.value = '';
    serverError.value = '';
    waitingToVerify.value = false;
    textCode.value = '';
    phoneNumberIsVerified.value = false;
}
</script>

<style scoped lang="less">
.default {
    color: rgba(0, 0, 0, 0.75);
}

.invalid {
    color: rgba(255, 0, 0, 0.75);
}

.valid {
    color: rgba(0, 128, 0, 0.75);
}

.blur {
    filter: blur(5px);
}
.container {
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
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
