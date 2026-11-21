<template>
  <div class="grain" aria-hidden="true"></div>
</template>

<style scoped>
.grain {
  position: fixed; inset: -100px; z-index: 90; pointer-events: none;
  opacity: 0.05; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  animation: grain 0.33s steps(4) infinite;
}
@keyframes grain {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-40px, 25px); }
  50% { transform: translate(30px, -35px); }
  75% { transform: translate(-20px, -15px); }
  100% { transform: translate(0, 0); }
}
</style>
