<template>
    <v-app :theme="theme">
        <v-app-bar :color="$vuetify.display.lg ? 'background' : 'primary'" flat app>
            <v-app-bar-title>LeagueForecaster</v-app-bar-title>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-btn icon v-bind="props">
                        <v-icon :icon="[mdiDotsVertical]"></v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item v-if="isLoggedIn" @click.stop="logout">
                        <v-list-item-title class="pl-3 text-right">Logout</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-else @click.stop="login">
                        <v-list-item-title class="pl-3 text-right">Login</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <v-switch
                            v-model="isDark"
                            :label="isDark ? 'Light' : 'Dark'"
                            class="pl-3"
                            hide-details
                            @click.stop="toggleTheme"
                        ></v-switch>
                    </v-list-item>
                </v-list>
            </v-menu>
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
import { mdiDotsVertical } from '@mdi/js';
const vuetifyTheme = useTheme();

const isDark = ref(vuetifyTheme.global.name.value === 'dark');
const theme = computed(() => (isDark.value ? 'dark' : 'light'));

const toggleTheme = () => {
    isDark.value = !isDark.value;
    vuetifyTheme.global.name.value = theme.value;
};

const isLoggedIn = ref(false);

const login = () => {
    // Placeholder for login logic
    isLoggedIn.value = true;
};

const logout = () => {
    // Placeholder for logout logic
    isLoggedIn.value = false;
};
</script>

<style scoped lang="less"></style>
