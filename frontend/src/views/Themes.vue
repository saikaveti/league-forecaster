<template>
    <v-app>
        <v-main>
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <h1>Vuetify Theme Demo</h1>
                        <p>This is a demonstration of the light and dark themes in Vuetify.</p>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="6">
                        <v-card color="primary">
                            <v-card-title>Primary Color</v-card-title>
                            <v-card-text>This is the primary color.</v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="6">
                        <v-card color="secondary">
                            <v-card-title>Secondary Color</v-card-title>
                            <v-card-text>This is the secondary color.</v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="6">
                        <v-card color="accent">
                            <v-card-title>Accent Color</v-card-title>
                            <v-card-text>This is the accent color.</v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="6">
                        <v-card color="error">
                            <v-card-title>Error Color</v-card-title>
                            <v-card-text>This is the error color.</v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="6">
                        <v-card color="info">
                            <v-card-title>Info Color</v-card-title>
                            <v-card-text>This is the info color.</v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="6">
                        <v-card color="success">
                            <v-card-title>Success Color</v-card-title>
                            <v-card-text>This is the success color.</v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="6">
                        <v-card color="warning">
                            <v-card-title>Warning Color</v-card-title>
                            <v-card-text>This is the warning color.</v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="6">
                        <v-card>
                            <v-card-title>Surface Color</v-card-title>
                            <v-card-text>This is the surface color.</v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
// TODO: hide this from the main bundle and only show in dev
</script>
