<template>
    <v-app :theme="theme">
        <v-app-bar flat color="primary" app>
            <template v-slot:append>
                <v-btn icon @click="toggleTheme">
                    <v-icon :icon="[isDark ? mdiMoonWaningCrescent : mdiWeatherSunny]"></v-icon>
                </v-btn>
            </template>
        </v-app-bar>
        <v-main>
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
        </v-main>
        <v-footer color="background" padless app>
            <v-container>
                <v-row justify="center" class="mt-2">
                    <v-col cols="12" class="text-center">
                        &copy; {{ new Date().getFullYear() }} LeagueForecaster. All rights reserved.
                    </v-col>
                </v-row>
            </v-container>
        </v-footer>
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
