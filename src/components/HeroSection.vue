<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { site } from '../data/site'
import { gsap, ScrollTrigger, ready, reduceMotion, activeSection, scrollToEl } from '../lib/scroll'
import heroImg from '../assets/hero.webp'

const root = ref(null)
const nameEl = ref(null)
const wrapEl = ref(null)
let ctx

function fitName() {
  const el = nameEl.value, wrap = wrapEl.value
  if (!el || !wrap) return
  const vw = window.innerWidth, vh = window.innerHeight
  wrap.style.fontSize = '100px'
  const w = el.scrollWidth || 1
  const byW = (vw * 0.92 / w) * 100
  const byH = (vh * 0.5) / 0.85
  wrap.style.fontSize = Math.min(byW, byH) + 'px'
}

function intro() {
  const q = gsap.utils.selector(root.value)
  if (reduceMotion) { gsap.set(q('.fade'), { autoAlpha: 1, clipPath: 'inset(0 0% 0 0%)' }); return }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo(q('.subject'), { autoAlpha: 0, scale: 0.94, filter: 'brightness(0.15)' }, { autoAlpha: 1, scale: 1, filter: 'brightness(1)', duration: 1.4 }, 0)
    .fromTo(q('.floor'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 0.3)
    .fromTo(nameEl.value, { clipPath: 'inset(0 48% 0 48%)', autoAlpha: 1 }, { clipPath: 'inset(0 0% 0 0%)', duration: 1.2 }, 1.3)
    .fromTo(q('.flare'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 0.9, scale: 1.05, duration: 0.6, ease: 'power2.out' }, 1.6)
    .to(q('.flare'), { autoAlpha: 0.18, scale: 1, duration: 1.0, ease: 'power2.inOut' }, 2.2)
    .fromTo(q('.name-glow'), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.8)
    .to(q('.name-glow'), { opacity: 0.25, duration: 0.9 }, 2.3)
    .fromTo(q('.eyebrow-row'), { autoAlpha: 0, letterSpacing: '0.6em' }, { autoAlpha: 1, letterSpacing: '0.35em', duration: 0.8 }, 2.2)
    .fromTo(q('.pill, .scroll-cue'), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1 }, 3.1)
  // idle "breathing"
  gsap.to(q('.subject img'), { scale: 1.008, duration: 3.6, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 100%' })
}

onMounted(() => {
  fitName()
  window.addEventListener('resize', fitName)
  ctx = gsap.context(() => {
    const q = gsap.utils.selector(root.value)
    gsap.set(q('.fade'), { autoAlpha: 0 })
    ScrollTrigger.create({ trigger: root.value, start: 'top center', end: 'bottom center', onToggle: (s) => s.isActive && (activeSection.value = 0) })
    if (!reduceMotion) {
      gsap.to(q('.name-wrap'), { yPercent: -15, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to(q('.subject'), { yPercent: 6, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom top', scrub: true } })
    }
  }, root.value)
  if (ready.value) intro()
})
watch(ready, (v) => v && ctx && ctx.add(intro))
onUnmounted(() => { window.removeEventListener('resize', fitName); ctx && ctx.revert() })
</script>

<template>
  <section id="hero" ref="root" class="hero" aria-label="Intro">
    <div class="haze" aria-hidden="true"></div>
    <div class="flare fade" aria-hidden="true"></div>
    <p class="eyebrow eyebrow-row fade"><span class="rule"></span>Welcome to my world<span class="rule"></span></p>
    <div ref="wrapEl" class="name-wrap">
      <h1 ref="nameEl" class="name fade" :aria-label="site.fullName">{{ site.firstName }}</h1>
      <span class="name-glow fade" aria-hidden="true">{{ site.firstName }}</span>
    </div>
    <div class="floor fade" aria-hidden="true"></div>
    <figure class="subject fade">
      <img :src="heroImg" :alt="`${site.fullName}, standing`" width="421" height="1420" fetchpriority="high">
    </figure>
    <div class="vignette" aria-hidden="true"></div>
    <div class="pill fade">
      <strong>{{ site.role }}</strong>
      <span>{{ site.roleMeta }} · {{ site.location }}</span>
    </div>
    <button class="scroll-cue fade" @click="scrollToEl('#skills')"><span>Scroll</span><i></i></button>
  </section>
</template>

<style scoped>
.hero { height: 100vh; min-height: 560px; background: #070709; }
.haze { position: absolute; inset: 0; background:
  radial-gradient(ellipse 55% 45% at 50% 55%, rgba(180, 24, 8, 0.22), transparent 70%),
  radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255, 110, 20, 0.10), transparent 70%); }
.flare {
  position: absolute; left: 50%; top: 52%; width: 60vw; height: 60vh; translate: -50% -50%;
  background: radial-gradient(closest-side, #FFD058, #FF3B00 45%, transparent 100%);
  mix-blend-mode: screen; filter: blur(48px); z-index: 1;
}
.eyebrow-row {
  position: absolute; top: 12.5%; left: 50%; translate: -50% 0; z-index: 35;
  display: flex; align-items: center; gap: 16px; white-space: nowrap;
}
.rule { width: 34px; height: 1px; background: rgba(232, 226, 214, 0.6); }
.name-wrap { position: absolute; left: 0; right: 0; top: 52%; translate: 0 -50%; z-index: 10; display: grid; place-items: center; }
.name, .name-glow {
  grid-area: 1 / 1; font-size: 1em; font-family: var(--display); font-weight: 400; line-height: 0.85;
  text-transform: uppercase; letter-spacing: -0.02em; white-space: nowrap;
}
.name {
  background: linear-gradient(180deg, #FF4A1C 0%, #E6240A 55%, #9E1406 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 0 40px rgba(230, 36, 10, 0.35));
}
.name-glow {
  color: transparent; pointer-events: none;
  background: radial-gradient(ellipse 30% 60% at 50% 50%, #FFD166, rgba(255, 209, 102, 0) 70%);
  -webkit-background-clip: text; background-clip: text; mix-blend-mode: screen;
}
.floor {
  position: absolute; left: 50%; bottom: 2vh; width: min(520px, 70vw); height: 70px; translate: -50% 0; z-index: 25;
  background: radial-gradient(closest-side, rgba(255, 120, 30, 0.35), transparent); filter: blur(8px);
}
.subject {
  position: absolute; left: 50%; bottom: -1vh; height: 86vh; translate: -50% 0; z-index: 30;
}
.subject img {
  height: 100%; width: auto;
  filter: drop-shadow(0 0 22px rgba(255, 110, 30, 0.28)) drop-shadow(0 30px 40px rgba(0, 0, 0, 0.6));
}
.vignette { position: absolute; inset: auto 0 0 0; height: 28vh; z-index: 40; background: linear-gradient(to top, #060608, transparent); pointer-events: none; }
.pill {
  position: absolute; left: 4vw; bottom: 12vh; z-index: 50;
  display: grid; gap: 8px; max-width: 46vw;
}
.pill strong {
  justify-self: start; background: #F4F4F6; color: #08080A;
  font: 700 11px/1 var(--sans); letter-spacing: 0.15em; text-transform: uppercase;
  padding: 9px 14px; border-radius: 999px;
}
.pill span { font: 400 12px/1.4 var(--mono); color: #B9B3A8; letter-spacing: 0.04em; }
.scroll-cue {
  position: absolute; right: 4vw; bottom: 12vh; z-index: 50; display: grid; justify-items: center; gap: 10px; min-height: 44px; min-width: 44px;
  font: 400 10px/1 var(--mono); letter-spacing: 0.3em; text-transform: uppercase; color: #CFC7BC;
}
.scroll-cue i { width: 1px; height: 46px; background: linear-gradient(var(--gold), transparent); animation: cue 2s ease-in-out infinite; transform-origin: top; }
@keyframes cue { 0% { transform: scaleY(0); } 50% { transform: scaleY(1); } 100% { transform: scaleY(1); opacity: 0; } }
@media (max-width: 767px) {
  .subject { height: 72vh; }
  .eyebrow-row { top: 11%; gap: 10px; }
  .rule { width: 18px; }
  .pill { bottom: 6vh; left: 16px; max-width: 70vw; }
  .scroll-cue { bottom: 6vh; right: 16px; }
}
</style>
