<template>
    <v-app :theme="theme">
        <div class="d-flex justify-end pa-2">
            <v-btn icon @click="toggleTheme">
                <v-icon :icon="[isDark ? mdiMoonWaningCrescent : mdiWeatherSunny]"></v-icon>
            </v-btn>
        </div>
        <RouterView v-slot="{ Component }">
            <template v-if="Component">
                <KeepAlive>
                    <Suspense timeout="0">
                        <template #default>
                            <component :is="Component"></component>
                        </template>
                        <template #fallback>
                            <LoadingSpinner />
                        </template>
                    </Suspense>
                </KeepAlive>
            </template>
        </RouterView>
    </v-app>
</template>

<script setup lang="ts">
import LoadingSpinner from './components/LoadingSpinner.vue';
import { ref, computed } from 'vue';
import { useTheme } from 'vuetify';
import { mdiWeatherSunny, mdiMoonWaningCrescent } from '@mdi/js';

const vuetifyTheme = useTheme();

const isDark = ref(vuetifyTheme.global.name.value === 'dark');

const theme = computed(() => (isDark.value ? 'dark' : 'light'));

const toggleTheme = () => {
    isDark.value = !isDark.value;
    vuetifyTheme.global.name.value = theme.value;
};
</script>

<style scoped lang="less"></style>
