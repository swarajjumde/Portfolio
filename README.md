# Swaraj Jumde · Portfolio

Cinematic scroll portfolio built with **Vue 3 + Vite + GSAP (ScrollTrigger) + Lenis**.

## Run
```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## Edit content
Everything (name, role, skills, journey, projects, GitHub link) lives in **`src/data/site.js`**.
- Journey 2021–2025 lines are samples: replace them with your real story.
- Add `image: '/photo.jpg'` to a journey entry (put the file in `public/`) to show a real photo with the sepia filter.
- Skill icons come from `simple-icons`; import another `si...` icon to add a skill.

## Structure
```
src/
  App.vue                 preloader, smooth scroll, sections
  lib/scroll.js           GSAP + ScrollTrigger + Lenis setup, helpers
  lib/particles.js        canvas embers / dust
  components/
    HeroSection.vue       name reveal + cutout + flare
    UniverseSection.vue   skills universe: light ribbons, embers, 3D badges
    JourneySection.vue    golden arc timeline + travelling flare
    ProjectsSection.vue   curved 3D project wall (swipe carousel on phones)
    OutroSection.vue      pinned molten name → diagonal wipe → contact
  assets/                 hero, back, portrait, finale images
```

## Deploy
`npm run build` and upload `dist/` to any static host (Cloudflare Pages, Netlify).
Paths are relative (`base: './'`), so it also works from a sub-folder.
