<template>
    <LoadingSpinner v-if="!data" />
    <div v-else>
        <div>{{ data }}</div>
        <a @click="logout">Log Out</a>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { request } from '@/utilities/requests';
import { ref, watch } from 'vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import router from '@/router';
import { serverHost } from './constants';

const data = ref('');

async function renderView() {
    data.value = '';
    const content = await fetchContent();
    data.value = content;
}

await renderView();

async function fetchContent() {
    const res = await request('/a/content', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (res.status !== 200) {
        return '';
    }
    return await res.text();
}

const route = useRoute();

watch(
    () => route.path,
    async () => {
        if (route.path === '/content') {
            await renderView();
        }
    }
);

async function logout() {
    const res = await fetch(`${serverHost}/logout`, {
        method: 'GET',
        credentials: 'include',
    });
    if (res.status === 200) {
        router.replace('/');
    }
}
</script>

<style scoped lang="less"></style>
