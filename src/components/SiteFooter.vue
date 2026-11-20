<script setup>
import { profile } from '@/config/profile';
const year = new Date().getFullYear();
</script>

<template>
    <footer class="foot">
        <span>© {{ year }} {{ profile.name }}</span>
        <a v-if="profile.links.github" :href="profile.links.github" target="_blank" rel="noopener">GitHub</a>
    </footer>
</template>

<style scoped>
.foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem clamp(1.25rem, 5vw, 3rem);
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-size: 0.85rem;
}

.foot a:hover {
    color: #fff;
}
</style>
