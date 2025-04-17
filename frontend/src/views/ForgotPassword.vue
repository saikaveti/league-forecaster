<template>
    <div class="container">
        <v-card class="pa-4 pb-20" elevation="2" width="350" :loading="loading">
            <TransitionGroup name="move">
                <div v-if="showConfirmationText" class="pl-0 pb-2 mb-4 text-center">
                    {{ confirmationText }}
                </div>
            </TransitionGroup>
            <v-text-field
                v-model="identifier"
                density="compact"
                label="Email or Phone"
                variant="outlined"
                @keydown.enter="
                    (_: any) => identifierIsValid && !showConfirmationText && resetPassword()
                "
            ></v-text-field>
            <v-btn
                color="blue"
                size="large"
                variant="tonal"
                block
                @click="resetPassword"
                :disabled="!identifierIsValid || showConfirmationText"
            >
                Reset Password
            </v-btn>
            <v-card-text class="text-center">
                <router-link to="/login" class="text-blue text-decoration-none" @click="clearInputs"
                    >Back to login</router-link
                >
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { emailValidator, phoneValidator } from '@/utilities/regex';
import { serverHost } from './constants';

const identifier = ref('');

const confirmationText =
    'Thank you. If an account exists, the password reset link will be sent to the email address for the associated account. Please make sure to check your junk folder.';
const showConfirmationText = ref(false);
const loading = ref(false);

const identifierIsValid = computed(() => {
    return emailValidator.test(identifier.value) || phoneValidator.test(identifier.value);
});

async function resetPassword() {
    loading.value = true;
    if (identifierIsValid.value) {
        await fetch(`${serverHost}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ identifier: identifier.value }),
        });
    } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    loading.value = false;
    showConfirmationText.value = true;
}

function clearInputs() {
    identifier.value = '';
    showConfirmationText.value = false;
    loading.value = false;
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
