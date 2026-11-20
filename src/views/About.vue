<script setup>
import SiteNav from '@/components/SiteNav.vue';
import SiteFooter from '@/components/SiteFooter.vue';
import { profile } from '@/config/profile';
import { onMounted } from 'vue';

// Scroll pe fade-up
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
            <p class="kicker">About</p>
            <h1 class="display-title metal">{{ profile.name }}</h1>
            <p class="lead">{{ profile.tagline }}</p>
        </div>

        <section class="bio">
            <p v-for="(para, i) in profile.about" :key="i" class="reveal" :style="{ transitionDelay: i * 80 + 'ms' }">{{ para }}</p>
        </section>

        <section class="skills">
            <h2 class="kicker reveal">Skills</h2>
            <div class="skill-grid">
                <div v-for="(s, i) in profile.skills" :key="s.group" class="skill-card reveal" :style="{ transitionDelay: i * 70 + 'ms' }">
                    <h3>{{ s.group }}</h3>
                    <ul>
                        <li v-for="item in s.items" :key="item">{{ item }}</li>
                    </ul>
                </div>
            </div>
        </section>

        <section class="cta-row reveal">
            <router-link to="/projects" class="btn btn-solid">See my work</router-link>
            <router-link to="/contact" class="btn">Get in touch</router-link>
        </section>
    </main>
    <SiteFooter />
</template>

<style scoped>
.bio {
    max-width: 48rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: clamp(3rem, 8vw, 5rem);
}

.bio p {
    font-size: clamp(1.05rem, 2vw, 1.25rem);
    color: #d7d7d7;
}

.skills {
    margin-bottom: clamp(3rem, 8vw, 5rem);
}

.skills .kicker {
    display: block;
    margin-bottom: 1.5rem;
}

.skill-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
}

.skill-card {
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 1.5rem;
    background: var(--card);
}

.skill-card h3 {
    font-family: var(--display);
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 1rem;
}

.skill-card ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.skill-card li {
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    border: 1px solid var(--line);
    font-size: 0.82rem;
    color: #cfcfcf;
}

.cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}
</style>
