// ─────────────────────────────────────────────────────────────
//  All site content lives here. Edit this file to update the site.
// ─────────────────────────────────────────────────────────────
import {
  siLaravel, siPhp, siMysql, siVuedotjs, siPrimevue, siTypescript, siJavascript,
  siThreedotjs, siPython, siSqlite, siNginx, siGit, siVitest, siHtml5, siGithub
} from 'simple-icons'

export const site = {
  firstName: 'Swaraj',
  fullName: 'Swaraj Jumde',
  role: 'Software Developer',
  roleMeta: 'Full stack · Laravel & Vue',
  location: 'Nagpur, India',
  github: 'https://github.com/swarajjumde',
  githubHandle: 'swarajjumde',
  year: 2026
}

// Skills shown in "My Tech Universe". `icon` comes from simple-icons; `text` is used when there is no icon.
export const skills = [
  { name: 'Laravel', icon: siLaravel },
  { name: 'Vue.js', icon: siVuedotjs },
  { name: 'PHP', icon: siPhp },
  { name: 'MySQL', icon: siMysql },
  { name: 'TypeScript', icon: siTypescript },
  { name: 'JavaScript', icon: siJavascript },
  { name: 'PrimeVue', icon: siPrimevue },
  { name: 'Three.js', icon: siThreedotjs },
  { name: 'Python', icon: siPython },
  { name: 'SQLite', icon: siSqlite },
  { name: 'Nginx', icon: siNginx },
  { name: 'AWS EC2', text: 'AWS' },
  { name: 'Git', icon: siGit },
  { name: 'Vitest', icon: siVitest }
]

// Journey through time. 2021–2025 are SAMPLE lines: replace them with your real story.
// Optional: add `image: '/path.jpg'` to any entry to show a real photo instead of the icon art.
export const timeline = [
  { year: 2021, title: 'The first line', text: 'HTML, CSS and a lot of curiosity.', icon: siHtml5 },
  { year: 2022, title: 'PHP & MySQL', text: 'First CRUD apps and real databases.', icon: siPhp },
  { year: 2023, title: 'Laravel', text: 'Clean backends, auth and REST APIs.', icon: siLaravel },
  { year: 2024, title: 'Vue 3', text: 'Fast, reactive frontends on top.', icon: siVuedotjs },
  { year: 2025, title: 'End to end', text: 'Shipping full apps, from DB to server.', icon: siNginx },
  { year: 2026, title: 'Building in public', text: 'Samay, Vynx UI and kentdb on GitHub.', icon: siGithub }
]

const repo = (name) => `${site.github}/${name}`

// Projects (from github.com/swarajjumde)
export const projects = {
  samay: {
    title: 'Samay',
    tag: 'Service booking platform',
    desc: 'Customers pick a service and a free slot; the owner runs bookings, services and earnings from one dashboard. One slot, one customer, no past bookings.',
    stack: ['Laravel 13', 'Sanctum', 'MySQL', 'Vue 3', 'PrimeVue', 'Three.js'],
    url: repo('Samay'),
    art: 'clock'
  },
  vynx: {
    title: 'Vynx UI',
    tag: 'UI framework for Vue Lynx',
    desc: 'A PrimeVue-style component library for mobile apps on the Lynx runtime, with a three-layer design-token theme system.',
    stack: ['TypeScript', 'Vue', 'Lynx', 'Vitest'],
    url: repo('vynx-ui'),
    art: 'grid'
  },
  kentdb: {
    title: 'kentdb',
    tag: 'Offline medical repertory',
    desc: "Parses Kent's Repertory (1897, public domain) into a searchable SQLite database with full-text search and data-quality checks.",
    stack: ['Python', 'SQLite FTS5', 'HTML'],
    url: repo('kentdb'),
    art: 'book'
  },
  portfolio: {
    title: 'This portfolio',
    tag: 'Cinematic scroll site',
    desc: 'The site you are on: Vue 3, GSAP ScrollTrigger and Lenis, with every scene drawn in code.',
    stack: ['Vue 3', 'GSAP', 'Lenis', 'Canvas'],
    url: repo('Portfolio'),
    art: 'mini'
  }
}

// The curved project wall: 2 rows × 5 columns. `p` = main project card, `fact` = small stat tile.
export const wall = [
  [
    { fact: '3D', label: 'Three.js landing page', of: 'samay' },
    { p: 'vynx' },
    { p: 'samay' },
    { p: 'kentdb' },
    { fact: '43', label: 'ready UI components', of: 'vynx' }
  ],
  [
    { fact: '329', label: 'source pages parsed into SQLite', of: 'kentdb' },
    { fact: '152', label: 'DOM-free component tests', of: 'vynx' },
    { p: 'portfolio' },
    { fact: 'EC2', label: 'nginx + PHP-FPM on AWS', of: 'samay' },
    { fact: '1:1', label: 'one slot, one customer', of: 'samay' }
  ]
]
