<script setup>
import { profile } from '@/config/profile';
import { navLinks } from '@/components/navLinks';
import { createPortraitIntro } from '@/composables/portraitIntro';
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue';

const menuOpen = ref(false);

const stage = useTemplateRef('stage');
const orb = useTemplateRef('orb');
const kinetic = useTemplateRef('kinetic');
const title = useTemplateRef('title');
const hud = useTemplateRef('hud');
const role = useTemplateRef('role');
const cta = useTemplateRef('cta');
const navEl = useTemplateRef('navEl');
const canvas = useTemplateRef('canvas');

let intro = null;

onMounted(() => {
    // router-link ref component instance deta hai, DOM element uske .$el mein hota hai.
    const el = (r) => r?.$el ?? r;
    intro = createPortraitIntro(
        { stage: stage.value, orb: orb.value, kinetic: kinetic.value, title: title.value, hud: hud.value, role: role.value, cta: el(cta.value), nav: navEl.value, canvas: canvas.value },
        profile
    );
});

onBeforeUnmount(() => intro?.destroy());
</script>

<template>
    <div id="hero">
        <div id="spot"></div>
        <div id="stage" ref="stage">
            <div id="orb" ref="orb"></div>
            <div ref="kinetic" class="word" aria-hidden="true"></div>
            <div ref="title" class="word" role="heading" aria-level="1" :aria-label="profile.wordmark"></div>
        </div>
        <div id="grain"></div>
        <canvas ref="canvas" aria-hidden="true"></canvas>
        <div id="vig"></div>

        <div id="hud" ref="hud">
            <p id="role" ref="role"></p>
            <router-link id="cta" ref="cta" to="/contact"><span class="dot"></span>Contact</router-link>
        </div>

        <header id="nav" ref="navEl" :class="{ open: menuOpen }">
            <router-link id="brand" to="/">{{ profile.name }}</router-link>
            <button id="burger" aria-label="Menu" @click="menuOpen = !menuOpen"><i></i><i></i></button>
            <ul id="links">
                <li v-for="link in navLinks" :key="link.to">
                    <router-link :to="link.to" @click="menuOpen = false">{{ link.label }}</router-link>
                </li>
            </ul>
        </header>
    </div>
</template>

<style scoped>
#hero {
    position: fixed;
    inset: 0;
    overflow: hidden;
    background: #000;
}

#spot {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: radial-gradient(ellipse 52% 56% at 50% 46%, #181818 0%, #0a0a0a 45%, #000 82%);
}

#stage {
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;
}

#orb {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #f2f2f2;
    box-shadow: 0 0 24px 6px rgba(255, 255, 255, 0.35), 0 0 60px 15px rgba(255, 255, 255, 0.12);
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
}

.word {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
    font-family: var(--display);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.035em;
    line-height: 0.88;
    font-size: 100px;
}

:deep(.word span) {
    display: inline-block;
    background: var(--metal);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    opacity: 0;
    padding-bottom: 0.04em;
}

:deep(.word span.sp) {
    width: 0.28em;
}

#grain {
    position: absolute;
    inset: 0;
    z-index: 15;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

canvas {
    position: absolute;
    inset: 0;
    z-index: 20;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

#vig {
    position: absolute;
    inset: 0;
    z-index: 25;
    pointer-events: none;
    box-shadow: inset 0 0 12vw rgba(0, 0, 0, 0.85);
}

#hud {
    position: absolute;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

#role {
    font-size: clamp(13px, 1.15vw, 20px);
    letter-spacing: -0.01em;
    white-space: nowrap;
    opacity: 0;
}

:deep(#role b) {
    font-weight: 600;
    color: #fff;
}

:deep(#role i) {
    font-family: var(--display);
    font-weight: 400;
    font-style: italic;
    color: #7e7e7e;
}

#cta {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    height: 34px;
    padding: 0 18px 0 10px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.04);
    color: #ccc;
    font: 500 clamp(11px, 0.78vw, 13px) / 1 var(--ui);
    letter-spacing: 0.02em;
    opacity: 0;
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    transition: border-color 0.22s, background 0.22s, color 0.22s;
}

#cta .dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.35);
    display: grid;
    place-items: center;
    transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}

#cta .dot::after {
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #fff;
}

#cta:hover {
    border-color: rgba(255, 255, 255, 0.38);
    background: rgba(255, 255, 255, 0.09);
    color: #fff;
}

#cta:hover .dot {
    transform: translateX(3px);
}

#nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 3.5vh 3.2vw;
    opacity: 0;
}

#brand {
    font: 700 clamp(11px, 0.85vw, 15px) / 1 var(--display);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #f5f5f5;
}

#links {
    display: flex;
    gap: clamp(14px, 1.8vw, 28px);
    list-style: none;
}

#links a {
    position: relative;
    font: 500 clamp(9px, 0.65vw, 11.5px) / 1 var(--ui);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #b8b8b8;
    transition: color 0.2s;
}

#links a::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -5px;
    height: 1px;
    background: #fff;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

#links a:hover {
    color: #fff;
}

#links a:hover::after {
    transform: scaleX(1);
}

#burger {
    display: none;
    background: none;
    border: 0;
    padding: 12px;
    margin: -12px;
    cursor: pointer;
    flex-direction: column;
    gap: 5px;
}

#burger i {
    display: block;
    width: 20px;
    height: 1.5px;
    background: #ddd;
}

@media (max-width: 760px) {
    #nav {
        padding: max(20px, env(safe-area-inset-top)) 20px 20px;
    }
    #brand {
        font-size: 12px;
    }
    #burger {
        display: flex;
    }
    #links {
        position: absolute;
        top: 100%;
        right: 16px;
        flex-direction: column;
        gap: 18px;
        padding: 18px 24px;
        background: rgba(10, 10, 10, 0.94);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        opacity: 0;
        transform: translateY(-6px);
        pointer-events: none;
        transition: opacity 0.25s, transform 0.25s;
    }
    #nav.open #links {
        opacity: 1;
        transform: none;
        pointer-events: auto;
    }
    #links a {
        font-size: 12px;
    }
}
</style>
