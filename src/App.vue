<script setup>
import { onMounted, ref } from 'vue'
import { initSmoothScroll, lockScroll, ready, ScrollTrigger } from './lib/scroll'
import { site } from './data/site'
import heroImg from './assets/hero.webp'
import NavBar from './components/NavBar.vue'
import FilmGrain from './components/FilmGrain.vue'
import HeroSection from './components/HeroSection.vue'
import UniverseSection from './components/UniverseSection.vue'
import JourneySection from './components/JourneySection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import OutroSection from './components/OutroSection.vue'

const loading = ref(true)
const progress = ref(0)

function preload(src) {
  return new Promise((res) => { const i = new Image(); i.onload = i.onerror = () => res(); i.src = src })
}

onMounted(async () => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  initSmoothScroll()
  lockScroll(true)
  const tick = setInterval(() => { progress.value = Math.min(90, progress.value + 7) }, 90)
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve()
  await Promise.race([Promise.all([preload(heroImg), fonts]), new Promise((r) => setTimeout(r, 3000))])
  clearInterval(tick)
  progress.value = 100
  setTimeout(() => {
    loading.value = false
    lockScroll(false)
    ready.value = true
    ScrollTrigger.refresh()
  }, 350)
})
</script>

<template>
  <Transition name="fade">
    <div v-if="loading" class="preloader" role="status" aria-label="Loading">
      <span class="pre-name">{{ site.fullName }}</span>
      <span class="pre-bar"><i :style="{ width: progress + '%' }"></i></span>
    </div>
  </Transition>
  <NavBar />
  <FilmGrain />
  <main>
    <HeroSection />
    <UniverseSection />
    <JourneySection />
    <ProjectsSection />
    <OutroSection />
  </main>
</template>

<style scoped>
.preloader {
  position: fixed; inset: 0; z-index: 200; background: var(--bg);
  display: grid; place-content: center; justify-items: center; gap: 18px;
}
.pre-name { font: 400 clamp(22px, 3vw, 34px)/1 var(--display); letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink); }
.pre-bar { width: 160px; height: 1px; background: rgba(255, 255, 255, 0.12); overflow: hidden; }
.pre-bar i { display: block; height: 100%; background: linear-gradient(90deg, var(--crimson), var(--gold)); transition: width 0.2s; }
.fade-leave-active { transition: opacity 0.6s ease; }
.fade-leave-to { opacity: 0; }
</style>
