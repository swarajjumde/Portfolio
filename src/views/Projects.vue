<script setup>
import SiteNav from '@/components/SiteNav.vue';
import SiteFooter from '@/components/SiteFooter.vue';
import { profile } from '@/config/profile';
import { onMounted } from 'vue';

onMounted(() => {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
});
</script>

<template>
    <SiteNav />
    <main class="page">
        <div class="page-head reveal in">
            <p class="kicker">Projects</p>
            <h1 class="display-title metal">Selected work</h1>
            <p class="lead">Things I’ve built and shipped — each one designed, built and deployed end to end.</p>
        </div>

        <div class="grid">
            <article v-for="(p, i) in profile.projects" :key="p.name" class="card reveal" :class="{ featured: p.featured }" :style="{ transitionDelay: i * 80 + 'ms' }">
                <div class="card-top">
                    <h2>{{ p.name }}</h2>
                    <span v-if="p.tagline" class="card-tagline">{{ p.tagline }}</span>
                </div>
                <p class="card-desc">{{ p.description }}</p>
                <div v-if="p.stack && p.stack.length" class="stack">
                    <span v-for="s in p.stack" :key="s" class="tag">{{ s }}</span>
                </div>
                <div class="card-links">
                    <a v-if="p.live" :href="p.live" target="_blank" rel="noopener" class="btn btn-solid">Live</a>
                    <a v-if="p.repo" :href="p.repo" target="_blank" rel="noopener" class="btn">Code</a>
                </div>
            </article>
        </div>
    </main>
    <SiteFooter />
</template>

<style scoped>
.grid {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
}

.card {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--line);
    border-radius: 18px;
    padding: 1.75rem;
    background: var(--card);
    transition: border-color 0.2s, transform 0.2s, opacity 0.6s ease, translate 0.6s ease;
}

.card:hover {
    border-color: var(--line-strong);
    transform: translateY(-3px);
}

.card.featured {
    grid-column: 1 / -1;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
}

.card.featured h2 {
    font-size: clamp(1.8rem, 4vw, 2.6rem);
}

.card-top {
    display: flex;
    align-items: baseline;
    gap: 0.9rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
}

.card h2 {
    font-family: var(--display);
    font-weight: 900;
    font-size: 1.6rem;
    text-transform: uppercase;
    letter-spacing: -0.02em;
}

.card-tagline {
    color: var(--muted);
    font-size: 0.9rem;
}

.card-desc {
    color: #cccccc;
    flex: 1;
    margin-bottom: 1.25rem;
    max-width: 46rem;
}

.stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.card-links {
    display: flex;
    gap: 0.6rem;
}
</style>
