<script setup>
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import { timeline } from '../data/site'
import { gsap, ScrollTrigger, reduceMotion, activeSection } from '../lib/scroll'
import backImg from '../assets/back.webp'

const root = ref(null)
const arc = ref(null)
const clipRect = ref(null)
const flare = ref(null)
const pts = reactive(timeline.map(() => ({ x: 0, y: 0 })))
const hot = ref(-1)
const VB = { w: 1600, h: 900 }
const D = 'M 260 300 C 590 360, 800 428, 1010 444 S 1300 454, 1420 460'
const F = timeline.map((_, i) => 0.05 + i * (0.9 / (timeline.length - 1)))
let ctx, len = 1

function measure() {
  const p = arc.value
  if (!p) return
  len = p.getTotalLength()
  F.forEach((f, i) => {
    const pt = p.getPointAtLength(len * f)
    pts[i].x = (pt.x / VB.w) * 100
    pts[i].y = (pt.y / VB.h) * 100
  })
}
function placeFlare(t) {
  const pt = arc.value.getPointAtLength(len * t)
  flare.value.style.left = (pt.x / VB.w) * 100 + '%'
  flare.value.style.top = (pt.y / VB.h) * 100 + '%'
  let near = -1
  F.forEach((f, i) => { if (Math.abs(f - t) < 0.06) near = i })
  hot.value = near
}

onMounted(() => {
  measure()
  ctx = gsap.context(() => {
    const q = gsap.utils.selector(root.value)
    ScrollTrigger.create({ trigger: root.value, start: 'top center', end: 'bottom center', onToggle: (s) => s.isActive && (activeSection.value = 2) })
    if (reduceMotion) { clipRect.value.setAttribute('width', VB.w); return }
    gsap.set(clipRect.value, { attr: { width: 0 } })
    const proxy = { t: 0 }
    const flareLoop = gsap.to(proxy, { t: 1, duration: 4.5, ease: 'sine.inOut', repeat: -1, repeatDelay: 1.5, paused: true,
      onUpdate: () => placeFlare(proxy.t), onRepeat: () => { hot.value = -1 } })
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top 65%' }, onComplete: () => flareLoop.play() })
    tl.to(clipRect.value, { attr: { width: VB.w }, duration: 1.1, ease: 'power2.inOut' }, 0)
      .from(q('.orbit'), { autoAlpha: 0, scale: 0.85, duration: 0.9, ease: 'power2.out' }, 0.3)
      .from(q('.year'), { autoAlpha: 0, y: 14, duration: 0.6, stagger: 0.12, ease: 'power3.out' }, 0.6)
      .from(q('.card'), { autoAlpha: 0, y: 24, scale: 0.92, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, 0.7)
      .from(q('.head'), { autoAlpha: 0, x: -16, duration: 0.8 }, 1.1)
      .from(q('.stand'), { autoAlpha: 0, y: 18, duration: 1 }, 1.1)
      .from(q('.flare'), { autoAlpha: 0, duration: 0.4 }, 1.6)
  }, root.value)
  window.addEventListener('resize', measure)
})
onUnmounted(() => { window.removeEventListener('resize', measure); ctx && ctx.revert() })
</script>

<template>
  <section id="journey" ref="root" class="jr" aria-labelledby="jr-title">
    <div class="bloom" aria-hidden="true"></div>

    <svg class="orbit" viewBox="0 0 400 400" aria-hidden="true">
      <g class="spin">
        <circle cx="200" cy="200" r="60" />
        <circle cx="200" cy="200" r="105" class="dash" />
        <circle cx="200" cy="200" r="150" />
        <circle cx="200" cy="200" r="195" class="dash" />
        <line v-for="a in 12" :key="a" x1="200" y1="200" :x2="200 + 195 * Math.cos(a * Math.PI / 6)" :y2="200 + 195 * Math.sin(a * Math.PI / 6)" />
      </g>
    </svg>

    <svg class="arcs" :viewBox="`0 0 ${VB.w} ${VB.h}`" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <clipPath id="j-clip"><rect ref="clipRect" x="0" y="0" :width="VB.w" :height="VB.h" /></clipPath>
        <filter id="j-glow" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>
      <g clip-path="url(#j-clip)">
        <path :d="D" class="arc-glow" filter="url(#j-glow)" vector-effect="non-scaling-stroke" />
        <path ref="arc" :d="D" class="arc-core" vector-effect="non-scaling-stroke" />
        <path :d="D" class="arc-ticks" vector-effect="non-scaling-stroke" />
      </g>
    </svg>

    <div ref="flare" class="flare" aria-hidden="true"></div>

    <header class="head">
      <h2 id="jr-title" class="sec-title">A journey<br>through<br>time</h2>
    </header>

    <ol class="steps">
      <li v-for="(s, i) in timeline" :key="s.year" class="step" :class="{ hot: hot === i }" :style="{ '--x': pts[i].x + '%', '--y': pts[i].y + '%' }">
        <span class="year">{{ s.year }}</span>
        <span class="node" aria-hidden="true"></span>
        <article class="card">
          <div class="thumb">
            <img v-if="s.image" :src="s.image" :alt="s.title" loading="lazy">
            <svg v-else viewBox="0 0 24 24" aria-hidden="true"><path :d="s.icon.path" /></svg>
          </div>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </article>
      </li>
    </ol>

    <div class="stand" aria-hidden="true">
      <div class="floor-rings"><i></i><i></i><i></i><i></i></div>
      <img :src="backImg" alt="" width="475" height="1423" loading="lazy">
    </div>
  </section>
</template>

<style scoped>
.jr { height: 105vh; min-height: 720px; background: #060608; }
.bloom { position: absolute; inset: 0; background:
  radial-gradient(ellipse 40% 35% at 50% 92%, rgba(232, 146, 42, 0.38), transparent 70%),
  radial-gradient(ellipse 50% 40% at 72% 18%, rgba(232, 146, 42, 0.10), transparent 70%); }
.orbit { position: absolute; left: 72%; top: 18%; width: 68vh; height: 68vh; translate: -50% -50%; opacity: 0.55; }
.orbit circle, .orbit line { fill: none; stroke: rgba(246, 210, 139, 0.35); stroke-width: 0.8; }
.orbit .dash { stroke-dasharray: 2 6; }
.orbit line { stroke: rgba(246, 210, 139, 0.12); }
.spin { transform-origin: 200px 200px; animation: spin 80s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.arcs { position: absolute; inset: 0; width: 100%; height: 100%; }
.arcs path { fill: none; }
.arc-glow { stroke: #FFB347; stroke-width: 6; opacity: 0.55; }
.arc-core { stroke: #FFD479; stroke-width: 1.5; }
.arc-ticks { stroke: #FFD479; stroke-width: 9; stroke-dasharray: 1.2 9; opacity: 0.5; }
.flare {
  position: absolute; width: 90px; height: 90px; translate: -50% -50%; left: 15%; top: 33%; z-index: 30; pointer-events: none;
  background: radial-gradient(closest-side, #fff 0%, #FFE2A0 18%, rgba(255, 183, 50, 0.55) 40%, transparent 100%);
  mix-blend-mode: screen;
}
.flare::before, .flare::after { content: ''; position: absolute; left: 50%; top: 50%; translate: -50% -50%; background: linear-gradient(90deg, transparent, #FFF3C4, transparent); width: 160px; height: 1.5px; }
.flare::after { rotate: 90deg; width: 70px; }
.head { position: absolute; left: 5vw; top: 13vh; z-index: 20; }
.head .sec-title { font-size: clamp(20px, 2.3vw, 34px); line-height: 1.25; letter-spacing: 0.18em; color: #F0E6D2; }
.steps { list-style: none; position: absolute; inset: 0; z-index: 20; }
.step { position: absolute; left: var(--x); top: var(--y); }
.year {
  position: absolute; left: 0; bottom: 14px; translate: -50% 0;
  font: 600 clamp(16px, 1.5vw, 24px)/1 var(--serif); letter-spacing: 0.08em; color: #F6D28B;
  text-shadow: 0 0 18px rgba(255, 180, 60, 0.45); transition: color 0.3s, text-shadow 0.3s;
}
.node { position: absolute; left: 0; top: 0; width: 7px; height: 7px; translate: -50% -50%; border-radius: 50%; background: #FFD479; box-shadow: 0 0 10px #FFB347; }
.card {
  position: absolute; left: 0; top: 18px; translate: -50% 0; width: clamp(130px, 10.8vw, 180px);
  padding: 7px 7px 10px; border-radius: 6px;
  background: rgba(14, 12, 10, 0.75); border: 1px solid rgba(246, 210, 139, 0.28);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7);
  transition: border-color 0.35s, box-shadow 0.35s, translate 0.35s;
}
.thumb { aspect-ratio: 16 / 10; border-radius: 4px; overflow: hidden; display: grid; place-items: center;
  background: radial-gradient(ellipse at 30% 30%, #4a3520, #1a120b 60%, #0D0B09); }
.thumb svg { width: 38%; height: 60%; fill: #E8B86D; opacity: 0.6; filter: drop-shadow(0 0 10px rgba(232, 184, 109, 0.4)); }
.thumb img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(65%) sepia(25%) contrast(1.1); }
.card h3 { margin-top: 8px; font: 600 12px/1.3 var(--sans); color: #F1E7D8; }
.card p { margin-top: 3px; font: 400 11px/1.35 var(--sans); color: #D4CCC0; opacity: 0.82; }
.step.hot .card { border-color: rgba(255, 196, 100, 0.85); box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7), 0 0 28px rgba(255, 160, 50, 0.35); translate: -50% -4px; }
.step.hot .year { color: #FFF3C4; text-shadow: 0 0 24px rgba(255, 200, 90, 0.9); }
.stand { position: absolute; left: 50%; bottom: 3%; translate: -50% 0; height: 27vh; z-index: 15; display: flex; justify-content: center; align-items: flex-end; }
.stand img { height: 100%; width: auto; position: relative; z-index: 2; filter: brightness(0.55) drop-shadow(0 0 20px rgba(255, 150, 50, 0.45)); }
.floor-rings { position: absolute; bottom: -2vh; left: 50%; translate: -50% 0; width: 540px; height: 540px; transform: perspective(800px) rotateX(74deg); transform-origin: 50% 100%; display: grid; place-items: center; z-index: 1; }
.floor-rings i { grid-area: 1 / 1; border-radius: 50%; border: 1.5px solid #FF8C24; filter: drop-shadow(0 0 10px rgba(255, 120, 24, 0.75)); animation: pulse 3.5s ease-in-out infinite; }
.floor-rings i:nth-child(1) { width: 180px; height: 180px; }
.floor-rings i:nth-child(2) { width: 290px; height: 290px; border-color: #E04F16; animation-delay: -0.8s; }
.floor-rings i:nth-child(3) { width: 410px; height: 410px; animation-delay: -1.6s; }
.floor-rings i:nth-child(4) { width: 540px; height: 540px; border-color: #E04F16; border-style: dashed; animation-delay: -2.4s; }
@keyframes pulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 0.9; } }

@media (max-width: 767px) {
  .jr { height: auto; min-height: 0; padding: 96px 20px 42vh; }
  .orbit, .arcs, .flare { display: none; }
  .head { position: static; margin-bottom: 36px; }
  .steps { position: relative; inset: auto; padding-left: 26px; display: grid; gap: 22px; }
  .steps::before { content: ''; position: absolute; left: 6px; top: 6px; bottom: 6px; width: 1.5px; background: linear-gradient(#FFD479, rgba(255, 212, 121, 0.15)); box-shadow: 0 0 8px rgba(255, 180, 70, 0.6); }
  .step { position: relative; left: auto; top: auto; display: grid; grid-template-columns: 56px 1fr; gap: 12px; align-items: start; }
  .year { position: static; translate: none; font-size: 17px; padding-top: 6px; }
  .node { left: -20px; top: 12px; translate: -50% -50%; }
  .card { position: static; translate: none; width: auto; display: grid; grid-template-columns: 96px 1fr; column-gap: 12px; align-items: center; }
  .thumb { grid-row: span 2; }
  .card h3 { margin-top: 0; font-size: 14px; }
  .step.hot .card { translate: 0 -2px; }
  .card p { font-size: 13px; }
  .stand { height: 30vh; }
  .floor-rings { width: 340px; height: 340px; }
  .floor-rings i:nth-child(1) { width: 110px; height: 110px; }
  .floor-rings i:nth-child(2) { width: 180px; height: 180px; }
  .floor-rings i:nth-child(3) { width: 260px; height: 260px; }
  .floor-rings i:nth-child(4) { width: 340px; height: 340px; }
}
</style>
