<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { projects, wall, site } from '../data/site'
import { gsap, ScrollTrigger, reduceMotion, activeSection, visibleLoop } from '../lib/scroll'
import { createParticles } from '../lib/particles'
import backImg from '../assets/back.webp'

const root = ref(null)
const tilt = ref(null)
const canvas = ref(null)
const angles = [40, 20, 0, -20, -40]
const tiles = wall.flatMap((row, r) => row.map((t, c) => ({ ...t, r, c, a: angles[c], key: `${r}-${c}`, proj: projects[t.p || t.of] })))
let ctx, stopLoop, onMove, onResize

onMounted(() => {
  const ps = createParticles(canvas.value, { mode: 'dust', count: 45, colors: ['#FFD79A'] })
  if (!reduceMotion) stopLoop = visibleLoop(root.value, (dt) => ps.tick(dt))
  onResize = () => ps.resize()
  window.addEventListener('resize', onResize)

  ctx = gsap.context(() => {
    const q = gsap.utils.selector(root.value)
    ScrollTrigger.create({ trigger: root.value, start: 'top center', end: 'bottom center', onToggle: (s) => s.isActive && (activeSection.value = 3) })
    if (reduceMotion) return
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.value, start: 'top 60%' } })
    tl.from(q('.glow-core'), { autoAlpha: 0, duration: 0.4 }, 0)
      .from(q('.tile'), { autoAlpha: 0, scale: 0.25, z: -500, duration: 1.2, ease: 'power3.out', stagger: { from: 'center', amount: 0.65 } }, 0.15)
      .from(q('.portal'), { autoAlpha: 0, scale: 0.4, duration: 0.9, ease: 'power3.out' }, 0.5)
      .from(q('.stand'), { autoAlpha: 0, y: 18, duration: 0.8 }, 0.5)
      .from(q('.top > *'), { autoAlpha: 0, y: 12, duration: 0.6, stagger: 0.1 }, 0.2)
    if (window.matchMedia('(hover: hover)').matches) {
      onMove = (e) => {
        const r = root.value.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width - 0.5
        const y = (e.clientY - r.top) / r.height - 0.5
        gsap.to(tilt.value, { rotationY: x * 8, rotationX: -y * 4, duration: 1.2, ease: 'power2.out' })
      }
      root.value.addEventListener('pointermove', onMove)
    }
  }, root.value)
})
onUnmounted(() => {
  stopLoop && stopLoop(); window.removeEventListener('resize', onResize)
  onMove && root.value && root.value.removeEventListener('pointermove', onMove)
  ctx && ctx.revert()
})
</script>

<template>
  <section id="projects" ref="root" class="pj" aria-labelledby="pj-title">
    <div class="ambience" aria-hidden="true"></div>
    <div class="glow-core" aria-hidden="true"></div>
    <div class="top">
      <h2 id="pj-title" class="sec-label">Projects</h2>
      <p class="intro">Things I have built and shipped. Every one is open on GitHub.</p>
    </div>
    <p class="index" aria-hidden="true">01 / Featured work · {{ Object.keys(projects).length }} repos</p>

    <div class="stage">
      <div ref="tilt" class="tilt">
        <ul class="cyl">
          <li v-for="t in tiles" :key="t.key" class="slot" :class="'r' + t.r" :style="{ '--a': t.a + 'deg' }">
            <article v-if="t.p" class="tile main" :class="{ edge: Math.abs(t.a) === 40 }">
              <div class="art" :class="t.proj.art" aria-hidden="true">
                <svg v-if="t.proj.art === 'clock'" viewBox="0 0 200 110">
                  <circle cx="58" cy="55" r="38" class="face" />
                  <line v-for="h in 12" :key="h" :x1="58 + 32 * Math.cos(h * Math.PI / 6)" :y1="55 + 32 * Math.sin(h * Math.PI / 6)" :x2="58 + 36 * Math.cos(h * Math.PI / 6)" :y2="55 + 36 * Math.sin(h * Math.PI / 6)" class="tick" />
                  <line x1="58" y1="55" x2="58" y2="30" class="hand" /><line x1="58" y1="55" x2="76" y2="62" class="hand gold" />
                  <g v-for="(s, i) in ['10:00', '11:30', '13:00']" :key="s"><rect :x="112" :y="22 + i * 24" width="74" height="17" rx="8.5" :class="i === 1 ? 'slot-on' : 'slot-off'" /><text :x="149" :y="34 + i * 24" text-anchor="middle">{{ s }}</text></g>
                </svg>
                <svg v-else-if="t.proj.art === 'grid'" viewBox="0 0 200 110">
                  <rect v-for="(b, i) in [[14,16,52,18],[72,16,40,18],[118,16,68,18],[14,42,30,30],[50,42,62,30],[118,42,30,30],[154,42,32,30],[14,80,84,16],[104,80,40,16],[150,80,36,16]]" :key="i" :x="b[0]" :y="b[1]" :width="b[2]" :height="b[3]" rx="5" :class="i === 4 ? 'chip-on' : 'chip'" />
                  <circle cx="66" cy="57" r="6" class="knob" />
                </svg>
                <svg v-else-if="t.proj.art === 'book'" viewBox="0 0 200 110">
                  <rect x="14" y="12" width="172" height="20" rx="10" class="search" /><circle cx="28" cy="22" r="5" class="lens" /><line x1="32" y1="26" x2="36" y2="30" class="lens" />
                  <rect v-for="i in 5" :key="i" x="14" :y="38 + i * 12" :width="[150, 120, 160, 96, 136][i - 1]" height="5" rx="2.5" class="row" :class="{ hit: i === 2 }" />
                </svg>
                <div v-else class="mini"><span>{{ site.firstName }}</span></div>
              </div>
              <div class="body">
                <h3>{{ t.proj.title }}</h3>
                <p class="tag">{{ t.proj.tag }}</p>
                <p class="desc">{{ t.proj.desc }}</p>
                <ul class="chips"><li v-for="s in t.proj.stack.slice(0, 4)" :key="s">{{ s }}</li></ul>
                <a :href="t.proj.url" target="_blank" rel="noopener" class="go">View on GitHub <span aria-hidden="true">↗</span></a>
              </div>
            </article>
            <a v-else class="tile fact" :class="{ edge: Math.abs(t.a) === 40 }" :href="t.proj.url" target="_blank" rel="noopener">
              <strong>{{ t.fact }}</strong>
              <span class="lbl">{{ t.label }}</span>
              <span class="of">{{ t.proj.title }} <span aria-hidden="true">↗</span></span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="floor" aria-hidden="true"></div>
    <div class="portal" aria-hidden="true">
      <i></i><i></i><i></i>
      <div class="nodes"><b v-for="n in 10" :key="n" :style="{ '--n': n }"></b></div>
    </div>
    <div class="stand" aria-hidden="true">
      <img :src="backImg" alt="" width="475" height="1423" loading="lazy">
      <img :src="backImg" alt="" class="reflect" width="475" height="1423" loading="lazy">
    </div>
    <canvas ref="canvas" class="dust" aria-hidden="true"></canvas>
  </section>
</template>

<style scoped>
.pj { --tw: 15.5vw; --th: 12.6vw; --R: 48vw; height: 115vh; min-height: 760px; background: #050608; }
.ambience { position: absolute; inset: 0; background:
  linear-gradient(to bottom, rgba(32, 46, 68, 0.22), transparent 45%),
  radial-gradient(ellipse 60% 30% at 50% 92%, rgba(255, 126, 28, 0.22), transparent 70%); }
.glow-core { position: absolute; left: 50%; top: 40%; width: 40vw; height: 40vh; translate: -50% -50%; background: radial-gradient(closest-side, rgba(255, 150, 50, 0.16), transparent); filter: blur(20px); }
.top { position: absolute; left: 5vw; top: 11vh; z-index: 20; display: grid; gap: 12px; }
.intro { font-size: 14px; color: #B9B3A8; max-width: 32ch; }
.index { position: absolute; left: 5vw; bottom: 8vh; z-index: 20; font: 400 10px/1.6 var(--mono); letter-spacing: 0.12em; text-transform: uppercase; color: #8C8A84; writing-mode: vertical-rl; rotate: 180deg; }
.stage { position: absolute; left: 0; right: 0; top: 41%; height: 0; perspective: 1150px; z-index: 10; }
.tilt { position: absolute; inset: 0; transform-style: preserve-3d; }
.cyl { list-style: none; position: absolute; left: 50%; top: 0; transform-style: preserve-3d; transform: translateZ(calc(var(--R) - 190px)); }
.slot { position: absolute; left: 0; top: 0; width: var(--tw); height: var(--th); transform-style: preserve-3d;
  transform: translate(-50%, -50%) translateY(calc(var(--th) * -0.56)) rotateY(var(--a)) translateZ(calc(var(--R) * -1)); }
.slot.r1 { transform: translate(-50%, -50%) translateY(calc(var(--th) * 0.56)) rotateY(var(--a)) translateZ(calc(var(--R) * -1)); }
.tile {
  position: absolute; inset: 0; display: flex; flex-direction: column; overflow: hidden; text-decoration: none;
  border-radius: 6px; border: 1px solid rgba(255, 198, 128, 0.22);
  background: linear-gradient(160deg, #15110e, #0b0a09 60%);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.85);
  transition: translate 0.4s cubic-bezier(.2, .8, .2, 1), border-color 0.3s, box-shadow 0.3s;
}
.tile.edge { filter: brightness(0.82); }
.tile:hover, .tile:focus-within { translate: 0 0 35px; border-color: #FFB347; box-shadow: 0 24px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 160, 60, 0.25); filter: none; }
.art { flex: 0 0 46%; transition: flex-basis 0.4s cubic-bezier(.2, .8, .2, 1); position: relative; background: radial-gradient(ellipse at 30% 20%, #3a2616, #120d0a 70%); border-bottom: 1px solid rgba(255, 198, 128, 0.14); overflow: hidden; }
.art svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.art .face { fill: rgba(255, 180, 90, 0.06); stroke: #F6D28B; stroke-width: 1.2; }
.art .tick { stroke: #F6D28B; stroke-width: 1.2; }
.art .hand { stroke: #F4EFE6; stroke-width: 2; stroke-linecap: round; }
.art .hand.gold { stroke: #FF7A18; }
.art .slot-off { fill: none; stroke: rgba(246, 210, 139, 0.45); }
.art .slot-on { fill: #FF7A18; }
.art text { font: 600 9px var(--mono); fill: #F4EFE6; }
.art .chip { fill: rgba(246, 210, 139, 0.08); stroke: rgba(246, 210, 139, 0.4); }
.art .chip-on { fill: rgba(255, 122, 24, 0.85); }
.art .knob { fill: #fff; }
.art .search { fill: rgba(246, 210, 139, 0.08); stroke: rgba(246, 210, 139, 0.45); }
.art .lens { fill: none; stroke: #F6D28B; stroke-width: 1.5; }
.art .row { fill: rgba(246, 210, 139, 0.25); }
.art .row.hit { fill: #FF7A18; }
.mini { position: absolute; inset: 0; display: grid; place-items: center; background: radial-gradient(ellipse at 50% 60%, rgba(180, 24, 8, 0.45), #0a0607 70%); }
.mini span { font: 400 clamp(22px, 2.6vw, 40px)/1 var(--display); text-transform: uppercase; background: linear-gradient(#FF4A1C, #9E1406); -webkit-background-clip: text; background-clip: text; color: transparent; }
.body { flex: 1; padding: 9px 11px 10px; display: flex; flex-direction: column; gap: 3px; }
.body h3 { font: 400 clamp(15px, 1.3vw, 21px)/1 var(--display); letter-spacing: 0.03em; color: #F4EFE6; text-transform: uppercase; }
.tag { font: 500 clamp(9px, 0.72vw, 11px)/1.3 var(--sans); color: #F6D28B; }
.desc { display: none; }
.chips { list-style: none; display: flex; flex-wrap: wrap; gap: 4px; margin-top: auto; }
.chips li { font: 400 clamp(8px, 0.6vw, 10px)/1 var(--mono); color: #CFC7BC; border: 1px solid rgba(246, 210, 139, 0.22); border-radius: 999px; padding: 3px 6px; }
.go { position: absolute; inset: 0; font-size: 0; color: transparent; }
.go:focus-visible { outline-offset: -3px; }
.fact { justify-content: center; align-items: flex-start; padding: 0 1.3vw; gap: 6px; background: linear-gradient(160deg, #1a120c, #0b0a09 70%); }
.fact strong { font: 400 clamp(32px, 3.6vw, 60px)/0.9 var(--display); background: linear-gradient(180deg, #FFF0C2, #FF7B29 60%, #C4220B); -webkit-background-clip: text; background-clip: text; color: transparent; }
.fact .lbl { font: 500 clamp(10px, 0.85vw, 13px)/1.3 var(--sans); color: #E8E2D6; }
.fact .of { font: 400 clamp(8px, 0.65vw, 10px)/1 var(--mono); letter-spacing: 0.12em; text-transform: uppercase; color: #8C8A84; }
.floor { position: absolute; left: 0; right: 0; bottom: 0; height: 30%; z-index: 4; background: linear-gradient(to bottom, transparent, rgba(255, 126, 28, 0.06) 40%, rgba(10, 8, 8, 0.9)); }
.portal { position: absolute; left: 50%; bottom: 3%; width: 460px; height: 460px; translate: -50% 0; transform: perspective(900px) rotateX(76deg); transform-origin: 50% 100%; z-index: 5; display: grid; place-items: center; }
.portal i { grid-area: 1 / 1; border-radius: 50%; border: 1.5px solid #FF9B30; box-shadow: 0 0 14px rgba(255, 140, 40, 0.7), inset 0 0 14px rgba(255, 140, 40, 0.4); }
.portal i:nth-child(1) { width: 220px; height: 220px; }
.portal i:nth-child(2) { width: 340px; height: 340px; opacity: 0.8; }
.portal i:nth-child(3) { width: 460px; height: 460px; opacity: 0.6; }
.nodes { grid-area: 1 / 1; width: 340px; height: 340px; position: relative; animation: orbit 28s linear infinite; }
.nodes b { position: absolute; left: 50%; top: 50%; width: 5px; height: 5px; margin: -2.5px; border-radius: 50%; background: #FFF5D6; box-shadow: 0 0 8px #FFB347;
  transform: rotate(calc(var(--n) * 36deg)) translateX(170px); }
@keyframes orbit { to { transform: rotate(360deg); } }
.stand { position: absolute; left: 50%; bottom: 6%; height: 26vh; translate: -50% 0; z-index: 12; }
.stand img { height: 100%; width: auto; filter: brightness(0.5) drop-shadow(0 0 18px rgba(255, 150, 50, 0.4)); }
.stand .reflect { position: absolute; top: 100%; left: 0; transform: scaleY(-0.55); transform-origin: top; filter: blur(6px) brightness(0.6); opacity: 0.25; }
.dust { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 14; pointer-events: none; }

@media (hover: hover) and (min-width: 768px) {
  .tile.main:hover .art, .tile.main:focus-within .art { flex-basis: 0%; }
  .tile.main:hover .desc, .tile.main:focus-within .desc { display: block; font-size: clamp(10px, 0.78vw, 12px); line-height: 1.4; color: #CFC7BC; margin-top: 4px; }
}
@media (hover: none), (max-width: 767px) {
  .tile.main .desc { display: block; font-size: 12px; line-height: 1.45; color: #CFC7BC; margin-top: 4px; }
}
@media (max-width: 767px) {
  .pj { height: auto; min-height: 0; padding: 96px 0 40vh; }
  .top { position: relative; left: auto; top: auto; padding: 0 20px; }
  .index { display: none; }
  .stage { position: relative; top: auto; height: auto; perspective: none; margin-top: 28px; }
  .tilt, .cyl { position: static; transform: none !important; }
  .cyl { display: flex; gap: 14px; overflow-x: auto; scroll-snap-type: x mandatory; padding: 8px 20px 18px; scrollbar-width: none; }
  .cyl::-webkit-scrollbar { display: none; }
  .slot, .slot.r1 { position: relative; transform: none; flex: 0 0 78vw; height: auto; min-height: 300px; scroll-snap-align: center; }
  .tile { position: relative; inset: auto; min-height: 300px; filter: none !important; }
  .fact { min-height: 300px; padding: 24px; }
  .fact strong { font-size: 72px; }
  .fact .lbl { font-size: 16px; }
  .fact .of { font-size: 11px; }
  .art { flex-basis: 140px; }
  .body { padding: 14px 16px 16px; gap: 4px; }
  .body h3 { font-size: 24px; }
  .tag { font-size: 13px; }
  .chips li { font-size: 10px; padding: 4px 8px; }
  .portal { width: 320px; height: 320px; bottom: 2%; }
  .portal i:nth-child(1) { width: 150px; height: 150px; }
  .portal i:nth-child(2) { width: 235px; height: 235px; }
  .portal i:nth-child(3) { width: 320px; height: 320px; }
  .nodes { width: 235px; height: 235px; }
  .nodes b { transform: rotate(calc(var(--n) * 36deg)) translateX(117px); }
  .stand { height: 28vh; bottom: 5%; }
}
</style>
