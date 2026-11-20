// =============================================================================
// Tera saara data yahin. Portfolio ke kisi bhi hisse ka text badalna ho to
// bas yahan badal, dobara deploy kar. Code chhedne ki zaroorat nahi.
// =============================================================================

export const profile = {
    // Hero ka bada shabd (particle portrait ke peeche). Chhota rakh (6-8 letters best).
    wordmark: 'SWARAJ',

    // Nav/brand aur page title mein dikhne wala naam
    name: 'Swaraj Jumde',

    // Hero ke neeche role line. Aakhri shabd apne aap grey ho jaata hai.
    role: 'Full-stack Developer',

    // Hero ke peeche particle portrait ke liye photo.
    // Apni photo "public/" folder mein daal (jaise public/me.jpg) aur yahan '/me.jpg' likh.
    // Khaali chhoda to ek auto-generated silhouette dikhega (chalega, par asli photo behtar).
    photo: '',

    // Chhoti tagline (About page ke upar)
    tagline: 'I build things for the web — from APIs to pixels.',

    // About page ke paragraphs (array — har item ek paragraph)
    about: [
        "Main ek full-stack developer hoon jo ideas ko live, kaam karne wali cheezon mein badalta hai. Backend se frontend tak, aur deploy karke internet pe chadhane tak — poora safar khud karta hoon.",
        "Laravel aur Vue mera main stack hai. Databases, REST APIs, authentication, aur Vue 3 ke saaf UI banana — ye roz ka kaam hai. Cloud pe (AWS EC2) apne haath se server set karke, nginx, HTTPS aur domain ke saath apne projects live karta hoon.",
        "Aajkal cybersecurity aur pentesting seekh raha hoon — apne hi systems ko attacker ki nazar se dekhna, taaki unhe behtar bana sakoon. Naye tools aur concepts seekhte rehna hi mera kaam ka tareeka hai."
    ],

    // Skills (About page). Apne hisaab se badal.
    skills: [
        { group: 'Backend', items: ['Laravel', 'PHP', 'REST APIs', 'MySQL', 'Sanctum auth'] },
        { group: 'Frontend', items: ['Vue 3', 'JavaScript', 'Vite', 'HTML/CSS', 'PrimeVue'] },
        { group: 'Cloud & DevOps', items: ['AWS EC2', 'nginx', 'Linux', 'Git', 'CI/CD basics'] },
        { group: 'Security', items: ['nmap', 'Burp Suite', 'Metasploit', 'Linux hardening'] }
    ],

    // Projects (Projects page). Pehla wala "featured" bada dikhega.
    // Samay sach-much ka project hai. Baaki tere GitHub repos hain — inki
    // description apne shabdon mein bhar/badal de (abhi stubs hain).
    projects: [
        {
            name: 'Samay',
            tagline: 'Service booking platform',
            description:
                'Ek full booking app: customer login karke service book karta hai, aur admin (service owner) sab dashboard se sambhalta hai. Laravel 13 REST API (Sanctum token auth, slot logic jo double-booking rokta hai), Vue 3 + PrimeVue panel, aur Three.js wala 3D landing page. Apne AWS EC2 server pe nginx + HTTPS ke saath khud deploy kiya.',
            stack: ['Laravel 13', 'Vue 3', 'Three.js', 'MySQL', 'AWS'],
            featured: true,
            // Live/repo link ho to daal, warna khaali chhod (button nahi dikhega)
            live: '',
            repo: 'https://github.com/swarajjumde/samay'
        },
        {
            name: 'vynx-ui',
            tagline: 'UI component work',
            description: 'ADD DESCRIPTION — is repo ke baare mein 1-2 line apne shabdon mein likh.',
            stack: ['Vue', 'CSS'],
            live: '',
            repo: 'https://github.com/swarajjumde/vynx-ui'
        },
        {
            name: 'kentdb',
            tagline: 'Data / backend project',
            description: 'ADD DESCRIPTION — is repo ke baare mein 1-2 line apne shabdon mein likh.',
            stack: [],
            live: '',
            repo: 'https://github.com/swarajjumde/kentdb'
        }
    ],

    // Contact + social links. Jo nahi chahiye use khaali chhod de (dikhega nahi).
    // Email jaan-boojh ke khaali hai — public karna ho to apna email yahan daal.
    links: {
        email: '',
        github: 'https://github.com/swarajjumde',
        linkedin: '',
        twitter: ''
    }
};
