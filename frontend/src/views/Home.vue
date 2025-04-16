<template>
    <v-app :theme="theme">
        <div class="d-flex justify-end pa-2">
            <v-btn icon @click="toggleTheme">
                <v-icon>{{ isDark ? 'mdi-moon-waning-crescent' : 'mdi-weather-sunny' }}</v-icon>
            </v-btn>
        </div>
        <v-main>
            <v-container>
                <v-row justify="center" class="mb-6">
                    <v-col :cols="12" :sm="10">
                        <v-card elevation="10" rounded="xl">
                            <v-sheet color="primary" height="200">
                                <v-row align="center" justify="center" class="fill-height">
                                    <v-col class="text-center">
                                        <h1 class="text-h4 font-weight-bold text-white">
                                            LeagueForecaster
                                        </h1>
                                    </v-col>
                                </v-row>
                            </v-sheet>

                            <v-card-text class="text-center">
                                Get recommended rosters for your fantasy sports teams. Dominate your
                                league!
                                <v-hover v-slot="{ isHovering }">
                                    <span
                                        :style="{
                                            color: isHovering ? 'primary' : 'inherit',
                                            transition: 'color 0.3s',
                                        }"
                                    >
                                        Optimized Rosters.
                                    </span>
                                </v-hover>
                                Winning Results.
                            </v-card-text>
                            <v-card-actions class="justify-center">
                                <v-btn
                                    color="primary"
                                    to="/content"
                                    rounded="pill"
                                    @mouseover="elevate = true"
                                    @mouseleave="elevate = false"
                                    :elevation="elevate ? 8 : 4"
                                    aria-label="Get Started"
                                >
                                    Get Started
                                </v-btn>
                            </v-card-actions>
                            <v-card-text class="text-center">
                                <v-progress-linear
                                    :active="loading"
                                    :indeterminate="loading"
                                    color="primary"
                                    height="5"
                                ></v-progress-linear>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row justify="center" class="mt-4 mb-6">
                    <v-col :cols="12" :sm="10">
                        <v-card elevation="10" rounded="xl">
                            <v-card-text class="text-center pa-4">
                                <h2 class="text-subtitle-1 font-weight-bold mb-2">Key Features</h2>
                                <p class="mx-4">
                                    Get personalized roster recommendations based on your league's
                                    specific scoring rules. Our advanced algorithms analyze player
                                    statistics, matchup data, and even weather conditions to provide
                                    you with the best possible lineup each week.
                                </p>
                                <ul class="text-left mx-4">
                                    <li>Weekly projections for all players</li>
                                    <li>Customizable scoring settings</li>
                                    <li>Injury updates and alerts</li>
                                </ul>
                            </v-card-text>
                            <v-img
                                src="https://images.squarespace-cdn.com/content/v1/607f89e638219e13eee71b1e/1684821560422-SD5V37BAG28BURTLIXUQ/michael-sum-LEpfefQf4rU-unsplash.jpg"
                                aspect-ratio="2"
                                cover
                                class="align-center"
                                alt="Key Features Image"
                            ></v-img>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row justify="center" class="mb-6">
                    <v-col :cols="12" :sm="10">
                        <v-card elevation="10" rounded="xl">
                            <v-card-text class="text-center pa-4">
                                <h2 class="text-subtitle-1 font-weight-bold mb-2">
                                    Advanced Analytics
                                </h2>
                                <p class="mx-4">
                                    Leverage cutting-edge data analysis to gain a competitive edge
                                    in your fantasy league. We provide in-depth statistics, player
                                    comparisons, and trade recommendations to help you make informed
                                    decisions.
                                </p>
                                <ul class="text-left mx-4">
                                    <li>Player performance trends</li>
                                    <li>Trade value calculator</li>
                                    <li>Waiver wire suggestions</li>
                                </ul>
                                <p class="mx-4">
                                    Our platform is constantly updated with the latest information,
                                    ensuring that you always have access to the most accurate and
                                    reliable data.
                                </p>
                            </v-card-text>
                            <v-img
                                src="https://static0.carbuzzimages.com/wordpress/wp-content/uploads/gallery-images/original/1147000/100/1147124.jpg"
                                aspect-ratio="2"
                                cover
                                class="align-center"
                                alt="Advanced Analytics Image"
                            ></v-img>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row justify="center" class="mb-6">
                    <v-col :cols="12" :sm="10">
                        <v-card elevation="10" rounded="xl">
                            <v-card-text class="text-center pa-4">
                                <h2 class="text-subtitle-1 font-weight-bold mb-2">
                                    Customizable Rosters
                                </h2>
                                <p class="mx-4">
                                    Tailor your team to your league settings and dominate the
                                    competition. Our platform allows you to create multiple roster
                                    configurations, experiment with different strategies, and
                                    optimize your lineup for maximum points.
                                </p>
                                <ul class="text-left mx-4">
                                    <li>Set it and forget it lineup optimization</li>
                                    <li>Explore endless possibilities</li>
                                    <li>Manage multiple leagues</li>
                                </ul>
                                <p class="mx-4">
                                    Whether you're a seasoned fantasy veteran or a beginner, our
                                    customizable rosters will help you achieve your goals.
                                </p>
                            </v-card-text>
                            <v-img
                                src="https://www.schultzscheese.com/wp-content/uploads/2015/06/swiss.jpg"
                                aspect-ratio="2"
                                cover
                                class="align-center"
                                alt="Customizable Rosters Image"
                            ></v-img>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <v-footer color="primary" padless>
            <v-container>
                <v-row justify="center" class="mt-2">
                    <v-col cols="12" class="text-center text-white">
                        &copy; {{ new Date().getFullYear() }} LeagueForecaster. All rights reserved.
                    </v-col>
                </v-row>
            </v-container>
        </v-footer>
    </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTheme } from 'vuetify';

const elevate = ref(false);
const loading = ref(false);
const vuetifyTheme = useTheme();

const isDark = ref(false);

const theme = computed(() => (isDark.value ? 'dark' : 'light'));

const toggleTheme = () => {
    isDark.value = !isDark.value;
    vuetifyTheme.global.name.value = theme.value;
};
</script>

<style scoped></style>
