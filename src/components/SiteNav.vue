<script setup>
import { profile } from '@/config/profile';
import { navLinks } from './navLinks';
import { ref } from 'vue';

// Inner pages (About/Projects/Contact) ka fixed top nav.
// Home ka apna hero-wala nav alag hai (cinematic animation ke liye).
const open = ref(false);
</script>

<template>
    <header class="nav" :class="{ open }">
        <router-link to="/" class="brand">{{ profile.name }}</router-link>
        <button class="burger" aria-label="Menu" @click="open = !open"><i></i><i></i></button>
        <nav class="links">
            <router-link v-for="link in navLinks" :key="link.to" :to="link.to" @click="open = false">{{ link.label }}</router-link>
        </nav>
    </header>
</template>

<style scoped>
.nav {
    position: fixed;
    inset: 0 0 auto 0;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2.2vh 3.2vw;
    background: rgba(0, 0, 0, 0.72);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--line);
}

.brand {
    font: 700 clamp(12px, 0.9vw, 15px) / 1 var(--display);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #f5f5f5;
}

.links {
    display: flex;
    gap: clamp(16px, 2vw, 30px);
}

.links a {
    position: relative;
    font: 500 clamp(10px, 0.7vw, 12px) / 1 var(--ui);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #b8b8b8;
    transition: color 0.2s;
}

.links a::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -5px;
    height: 1px;
    background: #fff;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.links a:hover,
.links a.router-link-active {
    color: #fff;
}

.links a.router-link-active::after,
.links a:hover::after {
    transform: scaleX(1);
}

.burger {
    display: none;
    background: none;
    border: 0;
    padding: 12px;
    margin: -12px;
    cursor: pointer;
    flex-direction: column;
    gap: 5px;
}

.burger i {
    display: block;
    width: 20px;
    height: 1.5px;
    background: #ddd;
}

@media (max-width: 760px) {
    .burger {
        display: flex;
    }
    .links {
        position: absolute;
        top: 100%;
        right: 16px;
        flex-direction: column;
        gap: 18px;
        padding: 18px 24px;
        background: rgba(10, 10, 10, 0.96);
        border: 1px solid var(--line);
        border-radius: 14px;
        opacity: 0;
        transform: translateY(-6px);
        pointer-events: none;
        transition: opacity 0.25s, transform 0.25s;
    }
    .nav.open .links {
        opacity: 1;
        transform: none;
        pointer-events: auto;
    }
    .links a {
        font-size: 13px;
    }
}
</style>
