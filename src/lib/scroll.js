import { ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isMobile = () => window.innerWidth < 768

// true once the preloader has finished (hero intro waits for this)
export const ready = ref(false)
export const activeSection = ref(0)

let lenis = null

export function initSmoothScroll() {
  if (reduceMotion) return null
  lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function scrollToEl(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.6 })
  else el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
}

export function lockScroll(lock) {
  if (lenis) lock ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

// Run an IntersectionObserver-gated rAF loop (pauses when off screen)
export function visibleLoop(el, tick) {
  let raf = 0, on = false, last = performance.now()
  const loop = (now) => {
    const dt = Math.min(50, now - last); last = now
    tick(dt, now)
    raf = requestAnimationFrame(loop)
  }
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !on) { on = true; last = performance.now(); raf = requestAnimationFrame(loop) }
    else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf) }
  }, { rootMargin: '200px' })
  io.observe(el)
  return () => { io.disconnect(); cancelAnimationFrame(raf) }
}

export { gsap, ScrollTrigger }
