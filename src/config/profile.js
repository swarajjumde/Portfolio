// =============================================================================
// All your data lives here. To change anything on the site, edit this file
// and redeploy — no need to touch the components.
// =============================================================================

export const profile = {
    // Big word behind the particle portrait in the hero. Keep it short (6-8 letters).
    wordmark: 'SWARAJ',

    // Name shown in the nav / brand and the page title
    name: 'Swaraj Jumde',

    // Role line under the hero. The last word is automatically greyed out.
    role: 'Full-stack Developer',

    // Portrait used for the hero particle effect.
    // Put your photo in the "public/" folder and reference it here (e.g. '/me.jpg').
    // Leave empty to show an auto-generated silhouette instead.
    photo: '/me.jpg',

    // Short tagline (shown at the top of the About page)
    tagline: 'I build for the web — from the API to the pixels.',

    // About page paragraphs (one string per paragraph)
    about: [
        'I’m a full-stack developer who enjoys taking an idea all the way from an empty repository to a live URL. I’m comfortable across the whole stack — the backend, the frontend, and the deployment in between.',
        'Laravel and Vue are my main tools. I build REST APIs, authentication and clean Vue 3 interfaces, and I ship them myself on AWS — setting up the server, nginx, HTTPS and DNS by hand rather than relying on a one-click host.',
        'Lately I’ve been getting into security and pentesting — looking at my own systems the way an attacker would, so I can build them more carefully. I learn by shipping, and I keep picking up new tools as I go.'
    ],

    // Skills shown on the About page
    skills: [
        { group: 'Backend', items: ['Laravel', 'PHP', 'REST APIs', 'MySQL', 'Sanctum auth'] },
        { group: 'Frontend', items: ['Vue 3', 'JavaScript', 'Vite', 'HTML/CSS', 'PrimeVue'] },
        { group: 'Cloud & DevOps', items: ['AWS EC2', 'nginx', 'Linux', 'Git', 'CI/CD basics'] },
        { group: 'Security', items: ['nmap', 'Burp Suite', 'Metasploit', 'Linux hardening'] }
    ],

    // Projects shown on the Projects page. The first one is featured (shown larger).
    // Samay is filled in accurately. Replace the descriptions of the others with
    // your own words whenever you like.
    projects: [
        {
            name: 'Samay',
            tagline: 'Service booking platform',
            description:
                'A full booking platform. Customers sign up and book services, while the owner manages everything from an admin dashboard. Built with a Laravel 13 REST API (Sanctum token auth and slot logic that prevents double-booking), a Vue 3 + PrimeVue panel, and a Three.js landing page. Deployed end to end on my own AWS EC2 server with nginx and HTTPS.',
            stack: ['Laravel 13', 'Vue 3', 'Three.js', 'MySQL', 'AWS'],
            featured: true,
            // live demo link daalna ho to yahan URL likh; code link jaan-boojh ke hata diya hai
            live: '',
            repo: ''
        }
    ],

    // Contact + social links. Leave any blank and it simply won't show.
    // Email is left blank on purpose — add it here if you want it public.
    links: {
        email: '',
        github: 'https://github.com/swarajjumde',
        linkedin: '',
        twitter: ''
    }
};
