<script setup>
import SiteNav from '@/components/SiteNav.vue';
import SiteFooter from '@/components/SiteFooter.vue';
import { profile } from '@/config/profile';
import { computed } from 'vue';

const L = profile.links;
const channels = computed(() => [
    { label: 'Email', value: L.email, href: L.email ? `mailto:${L.email}` : '' },
    { label: 'GitHub', value: L.github ? '@' + L.github.split('/').pop() : '', href: L.github },
    { label: 'LinkedIn', value: L.linkedin ? 'Profile' : '', href: L.linkedin },
    { label: 'Twitter / X', value: L.twitter ? 'Profile' : '', href: L.twitter }
].filter((c) => c.href));
</script>

<template>
    <SiteNav />
    <main class="page contact">
        <div class="page-head">
            <p class="kicker">Contact</p>
            <h1 class="display-title metal">Let's talk</h1>
            <p class="lead">Got a project, an idea, or just want to say hello? Reach out — I’ll reply quickly.</p>
        </div>

        <div class="channels">
            <a v-for="c in channels" :key="c.label" :href="c.href" :target="c.href.startsWith('http') ? '_blank' : null" rel="noopener" class="channel">
                <span class="c-label">{{ c.label }}</span>
                <span class="c-value">{{ c.value }}</span>
                <span class="c-arrow">→</span>
            </a>
        </div>

        <p v-if="!channels.length" class="empty">
            No contact links set yet. Add your email or GitHub in <code>src/config/profile.js</code>.
        </p>
    </main>
    <SiteFooter />
</template>

<style scoped>
.contact {
    display: flex;
    flex-direction: column;
    min-height: 100svh;
}

.channels {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--line);
    max-width: 42rem;
}

.channel {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.6rem 0.5rem;
    border-bottom: 1px solid var(--line);
    transition: padding 0.2s, background 0.2s;
}

.channel:hover {
    padding-left: 1.25rem;
    background: rgba(255, 255, 255, 0.02);
}

.c-label {
    font-family: var(--display);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 1.1rem;
    min-width: 9rem;
}

.c-value {
    color: var(--muted);
    flex: 1;
}

.c-arrow {
    color: var(--muted);
    transition: transform 0.2s, color 0.2s;
}

.channel:hover .c-arrow {
    transform: translateX(5px);
    color: #fff;
}

.empty {
    color: var(--muted);
}

.empty code {
    font-family: var(--ui);
    color: #ddd;
    background: rgba(255, 255, 255, 0.07);
    padding: 0.1rem 0.4rem;
    border-radius: 6px;
    font-size: 0.85em;
}
</style>
