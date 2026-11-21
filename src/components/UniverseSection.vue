<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { skills } from '../data/site'
import { gsap, ScrollTrigger, reduceMotion, activeSection, visibleLoop } from '../lib/scroll'
import { createParticles } from '../lib/particles'
import backImg from '../assets/back.webp'

const root = ref(null)
const canvas = ref(null)
const mobile = ref(false)

// [left %, top %, tier]  tier: 0 near, 1 mid, 2 far
const desktopPos = [
  [9, 34, 0], [90, 32, 0], [15, 70, 0], [85, 68, 0],
  [25, 30, 1], [75, 28, 1], [29, 55, 1], [71, 53, 1], [39, 42, 1], [61, 40, 1],
  [21, 84, 2], [79, 85, 2], [36, 74, 2], [64, 75, 2]
]
const mobilePos = [
  [30, 26, 1], [70, 26, 1],
  [14, 38, 0], [86, 38, 0], [14, 50, 1], [86, 50, 1], [14, 62, 0], [86, 62, 0],
  [14, 74, 1], [86, 74, 1], [14, 86, 2], [86, 86, 2], [34, 92, 2], [66, 92, 2]
]
const tiers = [
  { s: 1.08, blur: 0, op: 1, cls: 'near' },
  { s: 0.84, blur: 0, op: 0.95, cls: 'mid' },
  { s: 0.62, blur: 1.6, op: 0.72, cls: 'far' }
]
const badges = computed(() => skills.map((sk, i) => {
  const pos = (mobile.value ? mobilePos : desktopPos)[i % 14]
  const t = tiers[pos[2]]
  const ry = ((pos[0] - 50) / 50) * -22
  return { ...sk, left: pos[0], top: pos[1], t, ry, delay: (i * 0.37) % 3 }
}))

const ribbons = [
  { d: 'M -120 640 C 260 380, 620 860, 900 560 S 1420 240, 1740 470', layer: 'back', dur: 7 },
  { d: 'M -80 300 C 360 110, 700 420, 1000 250 S 1480 150, 1720 110', layer: 'back', dur: 9 },
  { d: 'M -120 880 C 380 760, 720 940, 1010 800 S 1420 720, 1740 790', layer: 'front', dur: 8 }
]

let ctx, stopLoop, ps, burstTimer = 0, onResize

onMounted(() => {
  mobile.value = window.innerWidth < 768
  ps = createParticles(canvas.value, { mode: 'embers', count: mobile.value ? 60 : 140 })
  const burstAtSubject = () => {
    const { w, h } = ps.size()
    ps.burst(mobile.value ? 40 : 90, w / 2, h * 0.62)
  }
  if (!reduceMotion) {
    stopLoop = visibleLoop(root.value, (dt) => {
      burstTimer += dt
      if (burstTimer > 6500) { burstTimer = 0; burstAtSubject() }
      ps.tick(dt)
    })
  }
  onResize = () => { mobile.value = window.innerWidth < 768; ps.resize() }
  window.addEventListener('resize', onResize)

  ctx = gsap.context(() => {
    const q = gsap.utils.selector(root.value)
    ScrollTrigger.create({ trigger: root.value, start: 'top center', end: 'bottom center', onToggle: (s) => s.isActive && (activeSection.value = 1) })
    if (reduceMotion) return
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top 70%', onEnter: () => { burstTimer = 5000 } } })
    tl.from(q('.subject'), { autoAlpha: 0, y: 40, duration: 1.2, ease: 'power3.out' })
      .from(q('.head > *'), { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, 0.1)
      .from(q('.ribbons'), { autoAlpha: 0, duration: 1.6 }, 0)
      .from(q('.badge'), { autoAlpha: 0, scale: 0.6, duration: 0.9, stagger: { each: 0.05, from: 'center' }, ease: 'back.out(1.6)' }, 0.25)
    const par = { near: -28, mid: -16, far: -8 }
    Object.entries(par).forEach(([k, v]) => {
      gsap.to(q(`.badge.${k}`), { yPercent: v * 4, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true } })
    })
    gsap.to(q('.backdrop'), { yPercent: -8, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top bottom', end: 'bottom top', scrub: true } })
  }, root.value)
})
onUnmounted(() => { stopLoop && stopLoop(); window.removeEventListener('resize', onResize); ctx && ctx.revert() })
</script>

<template>
  <section id="skills" ref="root" class="uni" aria-labelledby="uni-title">
    <div class="backdrop" aria-hidden="true">
      <div class="nebula"></div>
      <div class="stars"></div>
    </div>
    <svg class="ribbons back" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id="u-b1" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="16" /></filter>
        <filter id="u-b2" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <g v-for="(r, i) in ribbons.filter(r => r.layer === 'back')" :key="i" class="ribbon" :style="{ '--dur': r.dur + 's', '--off': i * 0.4 }">
        <path :d="r.d" class="base" pathLength="2000" />
        <path :d="r.d" class="aura" pathLength="2000" filter="url(#u-b1)" />
        <path :d="r.d" class="glow" pathLength="2000" filter="url(#u-b2)" />
        <path :d="r.d" class="core" pathLength="2000" />
      </g>
    </svg>
    <div class="horizon" aria-hidden="true"></div>
    <figure class="subject">
      <img :src="backImg" alt="Swaraj seen from behind, facing his tech universe" width="475" height="1423" loading="lazy">
    </figure>
    <svg class="ribbons front" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g v-for="(r, i) in ribbons.filter(r => r.layer === 'front')" :key="i" class="ribbon" :style="{ '--dur': r.dur + 's', '--off': 0.7 }">
        <path :d="r.d" class="base" pathLength="2000" />
        <path :d="r.d" class="aura" pathLength="2000" filter="url(#u-b1)" />
        <path :d="r.d" class="glow" pathLength="2000" filter="url(#u-b2)" />
        <path :d="r.d" class="core" pathLength="2000" />
      </g>
    </svg>
    <canvas ref="canvas" class="embers" aria-hidden="true"></canvas>

    <header class="head">
      <h2 id="uni-title" class="sec-title">My tech<br>universe</h2>
      <p>The stack I build with, from database to pixels.</p>
    </header>

    <ul class="badges" aria-label="Skills">
      <li v-for="b in badges" :key="b.name" class="badge" :class="b.t.cls"
          :style="{ left: b.left + '%', top: b.top + '%', '--s': b.t.s, '--ry': b.ry + 'deg', '--blur': b.t.blur + 'px', '--op': b.t.op, '--d': b.delay + 's', '--brand': b.icon ? '#' + b.icon.hex : '#FF9900' }">
        <div class="float">
          <div class="cube">
            <svg v-if="b.icon" viewBox="0 0 24 24" aria-hidden="true"><path :d="b.icon.path" /></svg>
            <b v-else>{{ b.text }}</b>
          </div>
          <span class="label">{{ b.name }}</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.uni { height: 125vh; min-height: 760px; background: #050507; }
.backdrop { position: absolute; inset: -8% 0; }
.nebula { position: absolute; inset: 0; background:
  radial-gradient(ellipse 45% 30% at 50% 74%, rgba(184, 67, 9, 0.75), rgba(36, 11, 3, 0.55) 55%, transparent 80%),
  radial-gradient(ellipse 80% 45% at 50% 80%, rgba(120, 40, 6, 0.35), transparent 75%),
  radial-gradient(ellipse 60% 40% at 30% 20%, rgba(60, 20, 8, 0.25), transparent 70%); }
.stars { position: absolute; inset: 0; opacity: 0.5; background-image:
  radial-gradient(1px 1px at 12% 18%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 72% 12%, #ffd9a8 50%, transparent 51%),
  radial-gradient(1px 1px at 33% 38%, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 88% 44%, #ffe2b8 50%, transparent 51%),
  radial-gradient(1px 1px at 55% 22%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 8% 58%, #fff 50%, transparent 51%),
  radial-gradient(1px 1px at 64% 8%, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 22% 6%, #ffd9a8 50%, transparent 51%); }
.horizon { position: absolute; left: 50%; bottom: 3%; width: 70vw; height: 22vh; translate: -50% 0; z-index: 15;
  background: radial-gradient(closest-side, rgba(255, 140, 40, 0.35), transparent); filter: blur(10px); }
.ribbons { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; mix-blend-mode: screen; }
.ribbons.back { z-index: 10; }
.ribbons.front { z-index: 25; }
.ribbon path { fill: none; stroke-linecap: round; }
.ribbon .base { stroke: #FF7A18; stroke-width: 1.4; opacity: 0.28; }
.ribbon .aura { stroke: #C43200; stroke-width: 34; opacity: 0.5; }
.ribbon .glow { stroke: #FF7A18; stroke-width: 9; opacity: 0.8; }
.ribbon .core { stroke: #FFF3C4; stroke-width: 2.2; }
.ribbon .aura, .ribbon .glow, .ribbon .core {
  stroke-dasharray: 620 1380; animation: flow var(--dur) linear infinite; animation-delay: calc(var(--dur) * var(--off) * -1);
}
@keyframes flow { from { stroke-dashoffset: 2000; } to { stroke-dashoffset: 0; } }
.subject { position: absolute; left: 50%; bottom: 6%; height: 50vh; translate: -50% 0; z-index: 20; }
.subject img { height: 100%; width: auto; filter: brightness(0.82) drop-shadow(0 0 26px rgba(255, 130, 40, 0.35)); }
.embers { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 26; pointer-events: none; }
.head { position: absolute; top: 10%; left: 50%; translate: -50% 0; z-index: 30; text-align: center; width: min(90vw, 760px); }
.head p { margin-top: 14px; font-size: 15px; color: #CFC7BC; }
.badges { list-style: none; position: absolute; inset: 0; z-index: 40; perspective: 900px; }
.badge { position: absolute; translate: -50% -50%; opacity: var(--op); filter: blur(var(--blur)); }
.float { display: grid; justify-items: center; gap: 10px; animation: bob 5s ease-in-out infinite; animation-delay: calc(var(--d) * -1); }
@keyframes bob { 50% { transform: translateY(-10px); } }
.cube {
  width: calc(clamp(58px, 5.6vw, 92px) * var(--s)); aspect-ratio: 1; border-radius: 22%;
  display: grid; place-items: center; position: relative;
  background: linear-gradient(145deg, #2c241f 0%, #14100d 55%, #0a0807 100%);
  border: 1px solid rgba(255, 210, 160, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 225, 190, 0.18), inset 0 -14px 24px rgba(0, 0, 0, 0.65),
              6px 8px 0 -2px #0b0908, 0 18px 34px rgba(0, 0, 0, 0.75), 0 0 34px rgba(255, 122, 24, 0.14);
  transform: rotateY(var(--ry)) rotateX(10deg);
  transition: transform 0.35s cubic-bezier(.2, .8, .2, 1), box-shadow 0.35s;
}
.cube::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(160deg, rgba(255, 240, 220, 0.14), transparent 40%); pointer-events: none; }
.cube svg { width: 46%; height: 46%; fill: #F1E7D8; transition: fill 0.3s; filter: drop-shadow(0 0 8px rgba(255, 160, 80, 0.35)); }
.cube b { font: 700 calc(16px * var(--s)) / 1 var(--sans); color: #F1E7D8; letter-spacing: 0.04em; }
.label { font: 500 calc(clamp(11px, 1vw, 15px) * max(var(--s), 0.85)) / 1 var(--sans); color: #fff; opacity: 0.92; letter-spacing: 0.02em; white-space: nowrap; text-shadow: 0 2px 10px #000; }
.far .label, .mid .label { color: #CFC7BC; }
.badge:hover .cube { transform: rotateY(0) rotateX(0) translateY(-6px) scale(1.06); box-shadow: inset 0 1px 0 rgba(255, 225, 190, 0.25), 0 22px 40px rgba(0, 0, 0, 0.8), 0 0 44px color-mix(in srgb, var(--brand) 45%, transparent); }
.badge:hover .cube svg { fill: var(--brand); }
@media (max-width: 767px) {
  .uni { height: 120vh; min-height: 720px; }
  .head { top: 7%; }
  .subject { height: 44vh; bottom: 5%; }
  .cube { width: calc(50px * var(--s)); }
  .label { font-size: 11px; }
}
</style>
