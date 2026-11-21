<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { site } from '../data/site'
import { gsap, ScrollTrigger, reduceMotion, activeSection, scrollToEl } from '../lib/scroll'
import portraitImg from '../assets/portrait.webp'
import finaleImg from '../assets/finale.webp'

const root = ref(null)
const nameWrap = ref(null)
const nameEl = ref(null)
const disp = ref(null)
const stageB = ref(null)
// SVG displacement on HTML text is unreliable in Safari: use blur + stretch only there
const isSafari = typeof navigator !== 'undefined' && /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent)
let ctx

function fit() {
  const el = nameEl.value, wrap = nameWrap.value
  if (!el || !wrap) return
  wrap.style.fontSize = '100px'
  const w = el.scrollWidth || 1
  wrap.style.fontSize = Math.min((window.innerWidth * 0.94 / w) * 100, (window.innerHeight * 0.62) / 0.82) + 'px'
}

onMounted(() => {
  fit()
  window.addEventListener('resize', fit)
  ctx = gsap.context(() => {
    const q = gsap.utils.selector(root.value)
    if (reduceMotion) {
      gsap.set(stageB.value, { clipPath: 'polygon(0 0, 125% 0, 100% 100%, 0 100%)' })
      ScrollTrigger.create({ trigger: root.value, start: 'top center', end: 'bottom center', onToggle: (s) => s.isActive && (activeSection.value = 4) })
      return
    }
    gsap.set(stageB.value, { clipPath: 'polygon(0% 0%, 0% 0%, -25% 100%, -25% 100%)' })
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root.value, start: 'top top', end: '+=240%', pin: true, scrub: 1, anticipatePin: 1,
        onToggle: (s) => s.isActive && (activeSection.value = 4)
      }
    })
    // 0–35: molten name coalesces
    tl.fromTo(q('.smear'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 18, stagger: 1.5 }, 0)
      .to(q('.smear'), { autoAlpha: 0.15, duration: 12 }, 22)
      .fromTo(q('.bloom'), { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 0.95, scale: 1.05, duration: 20 }, 6)
      .to(q('.bloom'), { autoAlpha: 0.35, scale: 1, duration: 14 }, 26)
      .fromTo(nameWrap.value, { autoAlpha: 0.2, scaleY: 1.45, filter: 'blur(18px)' }, { autoAlpha: 1, scaleY: 1, filter: 'blur(0px)', duration: 33, ease: 'power2.out' }, 2)
    if (!isSafari && disp.value) tl.fromTo(disp.value, { attr: { scale: 140 } }, { attr: { scale: 0 }, duration: 33, ease: 'power2.out' }, 2)
    // 35–65: portrait rises out of the smoke
    tl.fromTo(q('.portrait'), { autoAlpha: 0, y: 30, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 28, ease: 'power2.out' }, 36)
      .fromTo(q('.wisp'), { autoAlpha: 0 }, { autoAlpha: 0.45, duration: 20 }, 40)
    // 65–82: diagonal wipe to the walk-out
    tl.to(stageB.value, { clipPath: 'polygon(0% 0%, 125% 0%, 100% 100%, 0% 100%)', duration: 17, ease: 'power3.inOut' }, 65)
    // 82–100: push-in + CTA
      .fromTo(q('.finale-img'), { scale: 1 }, { scale: 1.045, duration: 18 }, 82)
      .fromTo(q('.cta > *'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 8, stagger: 2, ease: 'power2.out' }, 78)
      .fromTo(q('.foot'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 6 }, 92)
  }, root.value)
})
onUnmounted(() => { window.removeEventListener('resize', fit); ctx && ctx.revert() })
</script>

<template>
  <section id="contact" ref="root" class="outro" aria-labelledby="cta-title">
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <filter id="heat" x="-10%" y="-20%" width="120%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.015 0.08" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap ref="disp" in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>

    <div class="stageA" aria-hidden="true">
      <div class="smoke"><i class="b1"></i><i class="b2"></i><i class="b3"></i><i class="b4"></i><i class="b5"></i></div>
      <div class="smears"><i v-for="n in 7" :key="n" class="smear" :style="{ '--i': n }"></i></div>
      <div class="bloom"></div>
      <div ref="nameWrap" class="name-wrap">
        <span ref="nameEl" class="name" :class="{ heat: !isSafari }">{{ site.firstName }}</span>
      </div>
      <img :src="portraitImg" alt="" class="portrait" width="1114" height="1395" loading="lazy">
      <div class="wisp"></div>
    </div>

    <div ref="stageB" class="stageB">
      <img :src="finaleImg" :alt="`${site.fullName} walking out of orange smoke`" class="finale-img" width="1671" height="941" loading="lazy">
      <div class="shade" aria-hidden="true"></div>
      <div class="cta">
        <p class="eyebrow">What's next</p>
        <h2 id="cta-title">Let's build<br>something.</h2>
        <p class="lead">Open to freelance projects and full-time roles. Based in {{ site.location.split(',')[0] }}, working with teams anywhere.</p>
        <div class="actions">
          <a class="btn primary" :href="site.github" target="_blank" rel="noopener">GitHub · @{{ site.githubHandle }} <span aria-hidden="true">↗</span></a>
          <button class="btn ghost" @click="scrollToEl('#projects')">See projects</button>
        </div>
      </div>
      <footer class="foot">
        <span>© {{ site.year }} {{ site.fullName }} · {{ site.location }}</span>
        <span>Built with Vue, GSAP &amp; Lenis</span>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.outro { height: 100vh; min-height: 600px; background: #0A0303; }
.stageA, .stageB { position: absolute; inset: 0; overflow: hidden; }
.smoke i { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.8; animation: drift 22s ease-in-out infinite alternate; }
.b1 { width: 70vw; height: 60vh; left: -10vw; top: 10vh; background: radial-gradient(closest-side, rgba(196, 37, 8, 0.55), transparent); }
.b2 { width: 60vw; height: 70vh; right: -12vw; top: -10vh; background: radial-gradient(closest-side, rgba(94, 11, 2, 0.8), transparent); animation-duration: 28s !important; }
.b3 { width: 50vw; height: 50vh; left: 25vw; bottom: -15vh; background: radial-gradient(closest-side, rgba(255, 107, 26, 0.35), transparent); animation-duration: 18s !important; }
.b4 { width: 40vw; height: 45vh; left: 5vw; bottom: -10vh; background: radial-gradient(closest-side, rgba(140, 20, 4, 0.6), transparent); animation-duration: 25s !important; }
.b5 { width: 35vw; height: 40vh; right: 8vw; bottom: 5vh; background: radial-gradient(closest-side, rgba(196, 37, 8, 0.45), transparent); animation-duration: 31s !important; }
@keyframes drift { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(6vw, -4vh) scale(1.15); } }
.smears { position: absolute; inset: 0; display: flex; justify-content: center; gap: 4vw; }
.smear { width: 6vw; height: 120%; margin-top: -10%; background: linear-gradient(to bottom, transparent, rgba(255, 122, 24, 0.55) 40%, rgba(255, 210, 120, 0.6) 55%, transparent); filter: blur(14px); transform: skewX(calc((var(--i) - 4) * 3deg)); }
.bloom { position: absolute; left: 50%; top: 48%; width: 75vw; height: 65vh; translate: -50% -50%; background: radial-gradient(closest-side, #FFE270 0%, #FF5500 40%, transparent 75%); mix-blend-mode: screen; }
.name-wrap { position: absolute; left: 0; right: 0; top: 47%; translate: 0 -50%; display: grid; place-items: center; transform-origin: 50% 50%; }
.name {
  font-size: 1em; font-family: var(--display); line-height: 0.82; letter-spacing: -0.025em; text-transform: uppercase; white-space: nowrap;
  background: linear-gradient(180deg, #FFF0C2 0%, #FF7B29 48%, #C4220B 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.name.heat { filter: url(#heat); }
.portrait {
  position: absolute; left: 56%; bottom: 0; height: 88vh; width: auto; translate: -50% 0;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 16%), linear-gradient(to top, transparent 0%, #000 12%);
  mask-image: linear-gradient(to right, transparent 0%, #000 16%), linear-gradient(to top, transparent 0%, #000 12%);
  -webkit-mask-composite: source-in; mask-composite: intersect;
  filter: drop-shadow(0 0 30px rgba(255, 90, 20, 0.25));
}
.wisp { position: absolute; left: 30%; right: 20%; bottom: -5vh; height: 30vh; background: radial-gradient(ellipse at 50% 100%, rgba(255, 120, 60, 0.5), transparent 70%); filter: blur(30px); mix-blend-mode: screen; }
.stageB { z-index: 5; background: #0b0604; }
.finale-img { width: 100%; height: 100%; object-fit: cover; object-position: 70% 30%; transform-origin: 70% 100%; filter: contrast(1.06) saturate(1.08); }
.shade { position: absolute; inset: 0; background:
  linear-gradient(90deg, rgba(8, 5, 4, 0.92) 0%, rgba(8, 5, 4, 0.7) 32%, transparent 60%),
  radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0, 0, 0, 0.32)); }
.cta { position: absolute; left: 6vw; top: 50%; translate: 0 -50%; max-width: min(560px, 46vw); display: grid; gap: 18px; }
.cta h2 {
  font: 400 clamp(44px, 6.2vw, 100px)/0.9 var(--display); text-transform: uppercase; letter-spacing: 0.01em;
  background: linear-gradient(180deg, #FFF0C2, #FF9A3C 70%, #E85A12); -webkit-background-clip: text; background-clip: text; color: transparent;
}
.lead { font-size: 17px; line-height: 1.55; color: #E1D8CB; max-width: 42ch; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 6px; }
.btn { display: inline-flex; align-items: center; gap: 8px; min-height: 48px; padding: 0 22px; border-radius: 999px; font: 600 14px/1 var(--sans); letter-spacing: 0.02em; text-decoration: none; transition: transform 0.25s, background 0.25s, box-shadow 0.25s; }
.btn.primary { background: linear-gradient(135deg, #FFB347, #FF6B1A); color: #120804; box-shadow: 0 10px 30px rgba(255, 107, 26, 0.35); }
.btn.primary:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(255, 107, 26, 0.5); }
.btn.ghost { border: 1px solid rgba(255, 220, 180, 0.35); color: #F4EFE6; }
.btn.ghost:hover { background: rgba(255, 220, 180, 0.08); }
.foot { position: absolute; left: 6vw; right: 6vw; bottom: 4vh; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; font: 400 11px/1.4 var(--mono); letter-spacing: 0.08em; color: #A79E92; }
@media (max-width: 767px) {
  .portrait { height: 64vh; left: 52%; }
  .name-wrap { top: 38%; }
  .finale-img { object-position: 76% 30%; }
  .shade { background: linear-gradient(to top, rgba(8, 5, 4, 0.96) 0%, rgba(8, 5, 4, 0.85) 42%, rgba(8, 5, 4, 0.15) 70%, transparent); }
  .cta { left: 20px; right: 20px; top: auto; bottom: 12vh; translate: none; max-width: none; gap: 14px; }
  .cta h2 { font-size: 52px; }
  .lead { font-size: 15px; }
  .foot { left: 20px; right: 20px; bottom: 3vh; font-size: 10px; }
}
</style>
