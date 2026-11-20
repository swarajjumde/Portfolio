# Portfolio — Swaraj Jumde

Personal portfolio website. Cinematic monochrome design, particle-portrait hero jo khud ko assemble karta hai.

| Hissa | Kis se |
|---|---|
| Framework | Vue 3 + Vite |
| Routing | Vue Router (Home, About, Projects, Contact) |
| Hero | Canvas particle-portrait engine (`src/composables/portraitIntro.js`) |
| Fonts | Montserrat + Inter (self-hosted, koi CDN nahi) |
| Hosting | nginx static site, AWS EC2 pe |

Static site hai — koi backend/database nahi. Build karke `dist/` serve hoti hai.

---

## Apna content badalna (sabse zaroori)

Sab kuch ek file mein: **`src/config/profile.js`**

- `wordmark` — hero ka bada shabd (abhi "SWARAJ")
- `name`, `role`, `tagline` — naam, role line, tagline
- `photo` — hero ka portrait (neeche dekho)
- `about` — About page ke paragraphs
- `skills` — skill cards
- `projects` — project cards (pehla "featured" bada dikhta hai)
- `links` — email, GitHub, LinkedIn, Twitter (khaali = nahi dikhega)

Badal ke `bash deploy/deploy.sh` chala, bas.

### Apni photo lagana

Hero ke peeche abhi ek auto-generated silhouette hai (chalega, par asli photo behtar dikhegi).

1. Apni photo `public/` folder mein daal — jaise `public/me.jpg`
2. `src/config/profile.js` mein `photo: '/me.jpg'` kar
3. Deploy kar

**Best result:** head-and-shoulders photo, plain background (ya transparent PNG). Code apne aap background hata ke silhouette banata hai.

### Projects bharna

`profile.js` mein Samay ka card sahi bhara hai. `vynx-ui` aur `kentdb` pe abhi "ADD DESCRIPTION" likha hai — unki 1-2 line apne shabdon mein likh de.

---

## Server pe live karna (AWS EC2)

Ye Samay se **alag site** hai, par **usi server** pe saath chal sakti hai.

**1. Server mein login**
```bash
ssh -i tumhari-key.pem ubuntu@SERVER-KA-IP
```

**2. Code lao**
```bash
sudo mkdir -p /var/www && sudo chown ubuntu:ubuntu /var/www
git clone https://github.com/swarajjumde/portfolio.git /var/www/portfolio
cd /var/www/portfolio
```

**3. Naya DuckDNS subdomain bana**

duckdns.org pe ek naya subdomain bana (jaise `swarajjumde`), uska IP apne server ka IP daal. Ye Samay wale subdomain se alag hoga. Phir `deploy/nginx.conf` mein `server_name` already `swarajjumde.duckdns.org` hai — alag naam rakha ho to usme badal de.

**4. Server taiyaar karo (ek baar)**
```bash
sudo bash deploy/setup-server.sh
```
Samay wale server pe nginx/node pehle se hain, wo skip ho jayenge; bas portfolio ki nginx site add hogi.

**5. Deploy**
```bash
bash deploy/deploy.sh
```

**6. Kholo:** `http://swarajjumde.duckdns.org`

### Update kaise

GitHub pe code push karne ke baad server pe:
```bash
cd /var/www/portfolio && bash deploy/deploy.sh
```

### HTTPS (lock) lagana

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d swarajjumde.duckdns.org
```

### Aage swarajjumde.dev pe jaana

`.dev` HTTPS ke bina chalta hi nahi (browser force karta hai) aur free nahi — GitHub Student Pack (Name.com) se free mil sakta hai. Domain mil jaye to:
1. Domain ka A record apne server-IP pe point kar
2. `deploy/nginx.conf` ke `server_name` mein `swarajjumde.dev` daal (ya dono: `swarajjumde.dev swarajjumde.duckdns.org`)
3. `sudo cp deploy/nginx.conf /etc/nginx/sites-available/portfolio && sudo nginx -t && sudo systemctl reload nginx`
4. `sudo certbot --nginx -d swarajjumde.dev`

---

## Apne PC pe chalana

Chahiye: Node 20+

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ banata hai
npm run preview    # build ko locally dekho
```

---

## Structure

```
src/
  config/profile.js        # TERA SAARA DATA yahan
  composables/
    portraitIntro.js       # hero ka canvas particle engine
  components/
    SiteNav.vue            # inner pages ka top nav
    SiteFooter.vue
    navLinks.js            # nav links ek jagah
  views/
    Home.vue               # hero intro
    About.vue
    Projects.vue
    Contact.vue
    NotFound.vue
  router/index.js
  assets/base.css          # design tokens + shared styles
deploy/
  nginx.conf
  setup-server.sh
  deploy.sh
```
