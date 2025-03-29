<template>
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
</template>

<script setup lang="ts">
import LoadingSpinner from './components/LoadingSpinner.vue';
</script>

<style scoped lang="less"></style>
