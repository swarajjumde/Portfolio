<script setup>
import SiteNav from '@/components/SiteNav.vue';
</script>

<template>
    <SiteNav />
    <main class="page nf">
        <h1 class="display-title metal">404</h1>
        <p>This page doesn’t exist.</p>
        <router-link to="/" class="btn btn-solid">Back home</router-link>
    </main>
</template>

<style scoped>
.nf {
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 1.5rem;
}
.nf p {
    color: var(--muted);
}
</style>
