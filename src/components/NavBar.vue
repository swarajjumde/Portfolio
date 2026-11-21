<script setup>
import { onMounted, ref } from 'vue'
import { site } from '../data/site'
import { scrollToEl, activeSection, gsap, ready } from '../lib/scroll'
import { watch } from 'vue'

const links = [
  { id: '#hero', label: 'Home' },
  { id: '#skills', label: 'Skills' },
  { id: '#journey', label: 'Journey' },
  { id: '#projects', label: 'Projects' },
  { id: '#contact', label: 'Contact' }
]
const nav = ref(null)
const dots = ref(null)
onMounted(() => gsap.set([nav.value, dots.value], { autoAlpha: 0, y: -12 }))
watch(ready, (v) => { if (v) gsap.to([nav.value, dots.value], { autoAlpha: 1, y: 0, duration: 0.6, delay: 3.1, ease: 'power2.out' }) })
const go = (id) => scrollToEl(id)
</script>

<template>
  <header ref="nav" class="nav">
    <button class="brand" @click="go('#hero')">{{ site.fullName }}</button>
    <nav aria-label="Sections">
      <button v-for="(l, i) in links.slice(1)" :key="l.id" class="link" :class="{ on: activeSection === i + 1 }" @click="go(l.id)">{{ l.label }}</button>
      <a class="gh" :href="site.github" target="_blank" rel="noopener" aria-label="GitHub profile">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>
      </a>
    </nav>
  </header>
  <div ref="dots" class="dots" aria-hidden="true">
    <button v-for="(l, i) in links" :key="l.id" :class="{ on: activeSection === i }" :aria-label="l.label" tabindex="-1" @click="go(l.id)"><span>{{ l.label }}</span></button>
  </div>
</template>

<style scoped>
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 4vw;
  background: linear-gradient(to bottom, rgba(6, 6, 8, 0.75), transparent);
}
.brand { font: 400 16px/1 var(--display); letter-spacing: 0.14em; text-transform: uppercase; color: #F5F5F7; min-height: 44px; }
nav { display: flex; align-items: center; gap: clamp(14px, 2vw, 30px); }
.link {
  font: 500 11px/1 var(--sans); letter-spacing: 0.18em; text-transform: uppercase; color: #9A9AA0;
  min-height: 44px; transition: color 0.2s; position: relative;
}
.link::after { content: ''; position: absolute; left: 0; right: 0; bottom: 12px; height: 1px; background: var(--ember); transform: scaleX(0); transition: transform 0.3s; }
.link:hover, .link.on { color: #F5F5F7; }
.link.on::after { transform: scaleX(1); }
.gh { display: grid; place-items: center; width: 44px; height: 44px; }
.gh svg { width: 18px; height: 18px; fill: #E8E2D6; transition: fill 0.2s; }
.gh:hover svg { fill: var(--gold); }
.dots { position: fixed; right: 2vw; top: 50%; transform: translateY(-50%); z-index: 100; display: grid; gap: 14px; }
.dots button { width: 18px; height: 18px; display: grid; place-items: center; position: relative; }
.dots button::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: rgba(232, 226, 214, 0.35); transition: all 0.3s; }
.dots button.on::before { background: var(--ember); box-shadow: 0 0 10px var(--ember); transform: scale(1.4); }
.dots span { position: absolute; right: 24px; font: 400 10px/1 var(--mono); letter-spacing: 0.2em; text-transform: uppercase; color: #CFC7BC; opacity: 0; transition: opacity 0.2s; white-space: nowrap; }
.dots button:hover span { opacity: 1; }
@media (max-width: 767px) {
  .nav { padding: 0 16px; }
  .link { display: none; }
  .link:last-of-type { display: inline-block; }
  .dots { display: none; }
}
</style>
