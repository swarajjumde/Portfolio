// Small DPR-aware canvas particle engine for embers (Universe) and dust (Projects).
const spriteCache = {}
function sprite(color) {
  if (spriteCache[color]) return spriteCache[color]
  const c = document.createElement('canvas'); c.width = c.height = 64
  const g = c.getContext('2d')
  const r = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  r.addColorStop(0, color); r.addColorStop(0.25, color + 'cc'); r.addColorStop(1, color + '00')
  g.fillStyle = r; g.fillRect(0, 0, 64, 64)
  return (spriteCache[color] = c)
}

export function createParticles(canvas, { mode = 'embers', count = 120, colors = ['#FFF7D6', '#FFB347', '#FF6B1A'] } = {}) {
  const ctx = canvas.getContext('2d')
  let w = 0, h = 0
  const ps = []
  const rand = (a, b) => a + Math.random() * (b - a)

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = canvas.clientWidth; h = canvas.clientHeight
    canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  function reset(p, initial) {
    p.color = colors[(Math.random() * colors.length) | 0]
    if (mode === 'embers') {
      p.x = rand(0, w); p.y = initial ? rand(0, h) : rand(h * 0.55, h * 1.05)
      p.vx = rand(-0.15, 0.15); p.vy = rand(-1.8, -0.4)
      p.r = rand(1.5, 5); p.life = 0; p.max = rand(2200, 3600); p.burst = false
    } else {
      p.x = rand(0, w); p.y = rand(0, h)
      p.vx = rand(-0.2, 0.2); p.vy = rand(-0.2, 0.05)
      p.r = rand(1, 3); p.life = rand(0, 4000); p.max = rand(5000, 9000); p.burst = false
    }
  }

  function init() {
    resize(); ps.length = 0
    for (let i = 0; i < count; i++) { const p = {}; reset(p, true); p.life = rand(0, p.max); ps.push(p) }
  }

  function burst(n, x, y) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2), s = rand(0.8, 3.4)
      ps.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 0.8, r: rand(1.5, 6), life: 0, max: rand(1400, 2600),
        color: colors[(Math.random() * colors.length) | 0], burst: true })
    }
  }

  function tick(dt) {
    const k = dt / 16.67
    ctx.clearRect(0, 0, w, h)
    ctx.globalCompositeOperation = 'lighter'
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i]
      p.life += dt
      if (p.burst) { p.vx *= 0.985; p.vy = p.vy * 0.985 - 0.012 * k }
      p.x += (p.vx + (mode === 'embers' ? Math.sin((p.life + i * 50) / 500) * 0.15 : 0)) * k
      p.y += p.vy * k
      const t = p.life / p.max
      if (t >= 1 || p.y < -20) {
        if (p.burst) { ps.splice(i, 1); continue }
        reset(p, false); continue
      }
      const a = mode === 'embers' ? Math.sin(t * Math.PI) * 0.95 : (0.15 + 0.3 * Math.sin(t * Math.PI))
      ctx.globalAlpha = a
      const s = p.r * 6
      ctx.drawImage(sprite(p.color), p.x - s / 2, p.y - s / 2, s, s)
    }
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'source-over'
  }

  init()
  return { tick, burst, resize: init, size: () => ({ w, h }) }
}
