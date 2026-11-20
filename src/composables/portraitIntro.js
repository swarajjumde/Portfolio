// =============================================================================
// Particle-portrait intro engine (uploaded design se ported, Vue ke liye).
//
// createPortraitIntro(els, config) saara canvas setup karta hai aur ek controller
// deta hai: { replay(), destroy() }. Vue component onMounted pe banata hai aur
// onBeforeUnmount pe destroy() call karta hai (warna GPU/raf leak hoti hai).
//
// Logic original vanilla version jaisa hi hai — bas DOM elements bahar se aate hain
// aur customize panel hata diya hai (naam/photo ab config se aate hain).
// =============================================================================

export function createPortraitIntro(els, config) {
    'use strict';

    const { stage, orb, kinetic, title, hud, role: roleEl, cta, nav, canvas } = els;
    const ctx = canvas.getContext('2d');

    let W = 0, H = 0, DPR = 1, mobile = false, L = null;
    let source = null, P = null, t0 = performance.now(), last = 0, titleAnim = null;
    let raf = 0, destroyed = false;
    const mouse = { x: -1e4, y: -1e4, active: false };
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    // Colour buckets: 32 greys x 4 alphas, so fillStyle changes rarely
    const STYLES = [];
    for (let g = 0; g < 32; g++) for (let a = 0; a < 4; a++) {
        const v = Math.round((g / 31) * 255);
        STYLES.push(`rgba(${v},${v},${v},${(0.5 + (a / 3) * 0.5).toFixed(3)})`);
    }

    // ---------- Text ----------
    function letters(el, text) {
        el.textContent = '';
        for (const ch of text.toUpperCase()) {
            const s = document.createElement('span');
            if (ch === ' ') { s.className = 'sp'; s.textContent = ' '; } else s.textContent = ch;
            el.append(s);
        }
    }
    function setText() {
        letters(kinetic, config.name);
        letters(title, config.wordmark);
        roleEl.textContent = '';
        const parts = config.role.trim().split(/\s+/);
        const lastWord = parts.length > 1 ? parts.pop() : null;
        const b = document.createElement('b');
        b.textContent = parts.join(' ');
        roleEl.append(b);
        if (lastWord) {
            roleEl.append(' ');
            const i = document.createElement('i');
            i.textContent = lastWord;
            roleEl.append(i);
        }
    }
    function fitWord(el, targetW, maxPx) {
        el.style.fontSize = '100px';
        const w = el.scrollWidth || 1;
        el.style.fontSize = Math.min(maxPx, (100 * targetW) / w).toFixed(2) + 'px';
    }

    // ---------- Layout ----------
    function computeLayout() {
        W = window.innerWidth; H = window.innerHeight;
        DPR = Math.min(window.devicePixelRatio || 1, 2);
        mobile = W < 760 || W / H < 0.9;
        L = mobile
            ? { titleW: 0.9, titleY: 0.68, pTop: 0.13, pBottom: 0.8, pMaxW: 0.96, target: 9000 }
            : { titleW: 0.72, titleY: 0.73, pTop: 0.17, pBottom: 0.9, pMaxW: 0.42, target: 16000 };
        canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        fitWord(title, W * L.titleW, 260);
        fitWord(kinetic, W * L.titleW * 0.9, parseFloat(title.style.fontSize));
        const tw = title.offsetWidth, th = title.offsetHeight;
        let top = L.titleY * H + th * 0.5 + Math.max(14, H * 0.025);
        if (mobile) top = Math.max(top, L.pBottom * H + 14);
        hud.style.width = tw + 'px';
        hud.style.left = (W - tw) / 2 + 'px';
        hud.style.top = top + 'px';
    }

    // ---------- Procedural bust (fallback when no photo) ----------
    function makeBust() {
        const w = 480, h = 640, c = document.createElement('canvas');
        c.width = w; c.height = h;
        const g = c.getContext('2d');
        const ell = (x, y, rx, ry, fill) => { g.fillStyle = fill; g.beginPath(); g.ellipse(x * w, y * h, rx * w, ry * h, 0, 0, Math.PI * 2); g.fill(); };
        const lin = (x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0 * w, y0 * h, x1 * w, y1 * h); stops.forEach((s, i) => gr.addColorStop(i / (stops.length - 1), s)); return gr; };
        g.fillStyle = lin(0.4, 0, 0.6, 0, ['#a0a0a0', '#5e5e5e']);
        g.fillRect(w * 0.415, h * 0.46, w * 0.17, h * 0.22);
        ell(0.5, 0.53, 0.09, 0.03, 'rgba(40,40,40,.6)');
        const shoulders = () => {
            g.beginPath(); g.moveTo(0, h);
            g.bezierCurveTo(w * 0.02, h * 0.78, w * 0.12, h * 0.7, w * 0.36, h * 0.655);
            g.lineTo(w * 0.64, h * 0.655);
            g.bezierCurveTo(w * 0.88, h * 0.7, w * 0.98, h * 0.78, w, h);
            g.closePath();
        };
        shoulders(); g.fillStyle = lin(0, 0.62, 0, 1, ['#4a4a4a', '#1c1c1c']); g.fill();
        g.save(); shoulders(); g.clip();
        const hl = g.createRadialGradient(w * 0.2, h * 0.72, 0, w * 0.2, h * 0.72, w * 0.28);
        hl.addColorStop(0, 'rgba(150,150,150,.55)'); hl.addColorStop(1, 'rgba(150,150,150,0)');
        g.fillStyle = hl; g.fillRect(0, 0, w, h); g.restore();
        g.fillStyle = lin(0, 0.65, 0, 0.88, ['#ededed', '#9a9a9a']);
        g.beginPath(); g.moveTo(w * 0.4, h * 0.655); g.lineTo(w * 0.5, h * 0.87); g.lineTo(w * 0.6, h * 0.655); g.closePath(); g.fill();
        g.fillStyle = '#f6f6f6';
        g.beginPath(); g.moveTo(w * 0.4, h * 0.65); g.lineTo(w * 0.47, h * 0.72); g.lineTo(w * 0.43, h * 0.735); g.closePath(); g.fill();
        g.beginPath(); g.moveTo(w * 0.6, h * 0.65); g.lineTo(w * 0.53, h * 0.72); g.lineTo(w * 0.57, h * 0.735); g.closePath(); g.fill();
        g.strokeStyle = '#6a6a6a'; g.lineWidth = 3;
        g.beginPath(); g.moveTo(w * 0.38, h * 0.665); g.lineTo(w * 0.475, h * 0.97); g.moveTo(w * 0.62, h * 0.665); g.lineTo(w * 0.525, h * 0.97); g.stroke();
        ell(0.335, 0.37, 0.026, 0.05, '#8a8a8a'); ell(0.665, 0.37, 0.026, 0.05, '#5e5e5e');
        const hg = g.createRadialGradient(w * 0.44, h * 0.3, w * 0.02, w * 0.5, h * 0.36, w * 0.24);
        hg.addColorStop(0, '#f4f4f4'); hg.addColorStop(0.55, '#bdbdbd'); hg.addColorStop(1, '#5c5c5c');
        ell(0.5, 0.355, 0.165, 0.205, hg);
        ell(0.43, 0.322, 0.045, 0.008, '#2a2a2a'); ell(0.57, 0.322, 0.045, 0.008, '#2a2a2a');
        ell(0.43, 0.355, 0.03, 0.011, '#3a3a3a'); ell(0.57, 0.355, 0.03, 0.011, '#3a3a3a');
        ell(0.515, 0.41, 0.016, 0.035, 'rgba(70,70,70,.45)');
        ell(0.5, 0.465, 0.045, 0.009, '#4a4a4a');
        ell(0.5, 0.53, 0.11, 0.04, 'rgba(60,60,60,.25)');
        ell(0.5, 0.205, 0.182, 0.088, '#262626');
        ell(0.345, 0.29, 0.03, 0.065, '#262626'); ell(0.655, 0.29, 0.03, 0.065, '#262626');
        g.strokeStyle = '#4c4c4c'; g.lineWidth = 2;
        for (let k = 0; k < 7; k++) { g.beginPath(); g.moveTo(w * (0.38 + k * 0.035), h * 0.14); g.quadraticCurveTo(w * (0.42 + k * 0.035), h * 0.17, w * (0.4 + k * 0.04), h * 0.25); g.stroke(); }
        return c;
    }

    // ---------- Background removal ----------
    function backgroundMask(d, w, h) {
        const m = new Uint8Array(w * h), border = [];
        for (let x = 0; x < w; x++) border.push(x, w + x);
        for (let y = 2; y < h; y++) border.push(y * w, y * w + 1, y * w + w - 1, y * w + w - 2);
        let tr = 0, r = 0, g = 0, b = 0;
        for (const p of border) { const i = p * 4; if (d[i + 3] < 250) tr++; r += d[i]; g += d[i + 1]; b += d[i + 2]; }
        if (tr > border.length * 0.3) return m;
        const n = border.length; r /= n; g /= n; b /= n;
        let v = 0;
        for (const p of border) { const i = p * 4; v += (d[i] - r) ** 2 + (d[i + 1] - g) ** 2 + (d[i + 2] - b) ** 2; }
        v = Math.sqrt(v / n);
        if (v < 40) {
            const tol = Math.max(14, Math.min(48, v * 2.5 + 14));
            const T = tol * tol;
            const near = (p) => { const i = p * 4, dr = d[i] - r, dg = d[i + 1] - g, db = d[i + 2] - b; return dr * dr + dg * dg + db * db < T; };
            const stack = [];
            for (const p of border) if (!m[p] && near(p)) { m[p] = 1; stack.push(p); }
            while (stack.length) {
                const p = stack.pop(), x = p % w, y = (p / w) | 0;
                if (x > 0 && !m[p - 1] && near(p - 1)) { m[p - 1] = 1; stack.push(p - 1); }
                if (x < w - 1 && !m[p + 1] && near(p + 1)) { m[p + 1] = 1; stack.push(p + 1); }
                if (y > 0 && !m[p - w] && near(p - w)) { m[p - w] = 1; stack.push(p - w); }
                if (y < h - 1 && !m[p + w] && near(p + w)) { m[p + w] = 1; stack.push(p + w); }
            }
        } else {
            const cx = w / 2, cy = h * 0.55, rx = w * 0.5, ry = h * 0.6;
            for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
                const dx = (x - cx) / rx, dy = (y - cy) / ry;
                if (dx * dx + dy * dy > 1) m[y * w + x] = 1;
            }
        }
        return m;
    }

    // ---------- Particles ----------
    function buildParticles(keep) {
        if (!source) return;
        const sw = source.naturalWidth || source.width, sh = source.naturalHeight || source.height;
        const aspect = sw / sh;
        let bh = (L.pBottom - L.pTop) * H, bw = bh * aspect;
        if (bw > L.pMaxW * W) { bw = L.pMaxW * W; bh = bw / aspect; }
        const w = Math.max(10, Math.round(bw)), h = Math.max(10, Math.round(bh));
        const bx = (W - w) / 2, by = L.pBottom * H - h;
        const oc = document.createElement('canvas'); oc.width = w; oc.height = h;
        const o = oc.getContext('2d', { willReadFrequently: true });
        o.drawImage(source, 0, 0, w, h);
        let d;
        try { d = o.getImageData(0, 0, w, h).data; } catch (e) { source = makeBust(); return buildParticles(keep); }
        const bg = backgroundMask(d, w, h);
        const step = Math.max(2, Math.round(Math.sqrt((w * h * 0.5) / L.target)));
        const sizeMul = Math.max(1, step / 2.4);
        const list = [];
        for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) {
            const p = y * w + x; if (bg[p]) continue;
            const i = p * 4; if (d[i + 3] < 100) continue;
            let lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            lum = Math.max(0, Math.min(255, (lum - 128) * 1.25 + 128));
            const l = lum / 255;
            if (l <= 0.35 && Math.random() > 0.45 + l * 0.55) continue;
            list.push(x, y, l);
        }
        const n = list.length / 3, old = P;
        const S = {
            n, x: new Float32Array(n), y: new Float32Array(n), tx: new Float32Array(n), ty: new Float32Array(n),
            vx: new Float32Array(n), vy: new Float32Array(n), ease: new Float32Array(n), delay: new Float32Array(n),
            swirl: new Float32Array(n), size: new Float32Array(n), ph: new Float32Array(n), om: new Float32Array(n),
            key: new Uint16Array(n), order: null, shim: []
        };
        for (let k = 0; k < n; k++) {
            const x0 = list[k * 3], y0 = list[k * 3 + 1], l = list[k * 3 + 2];
            S.tx[k] = bx + x0 + (Math.random() - 0.5) * step * 0.8;
            S.ty[k] = by + y0 + (Math.random() - 0.5) * step * 0.8;
            let gray, alpha, size;
            if (l < 0.27) { gray = 13 + l * 110; alpha = 0.85; size = 1.8 + Math.random() * 0.6; }
            else { gray = 18 + l * 237; alpha = 0.55 + l * 0.45; size = 1.2 + l * 1.1; }
            S.size[k] = size * sizeMul;
            S.key[k] = Math.round((gray / 255) * 31) * 4 + Math.round(((alpha - 0.5) / 0.5) * 3);
            if (l > 0.7 && Math.random() < 0.05) S.shim.push(k);
            S.ease[k] = 0.035 + Math.random() * 0.05;
            S.delay[k] = Math.random() * 700;
            S.swirl[k] = (Math.random() - 0.5) * 0.7;
            S.ph[k] = Math.random() * 6.283;
            S.om[k] = 0.001 + Math.random() * 0.001;
            if (keep && old && k < old.n) { S.x[k] = old.x[k]; S.y[k] = old.y[k]; }
            else { S.x[k] = Math.random() * W; S.y[k] = Math.random() * H; }
            S.vx[k] = (Math.random() - 0.5) * 0.3; S.vy[k] = (Math.random() - 0.5) * 0.3;
        }
        S.order = Uint32Array.from({ length: n }, (_, i) => i).sort((a, b) => S.key[a] - S.key[b]);
        P = S;
    }

    function frame(now) {
        if (destroyed) return;
        raf = requestAnimationFrame(frame);
        const dt = Math.min(50, last ? now - last : 16.67); last = now;
        const f = dt / 16.667, t = now - t0;
        ctx.clearRect(0, 0, W, H);
        if (!P || t < 3000) return;
        const alpha = Math.min(1, (t - 3000) / 600), seekT = t - 4000;
        const { n, x, y, tx, ty, vx, vy, ease, delay, swirl, ph, om, size, key, order } = P;
        const damp = Math.pow(0.85, f), R = mobile ? 80 : 100, R2 = R * R;
        const mouseOn = mouse.active && t > 5000;
        for (let i = 0; i < n; i++) {
            if (seekT < delay[i]) { x[i] += vx[i] * f; y[i] += vy[i] * f; continue; }
            const a = t * om[i] + ph[i];
            const dx = tx[i] + Math.sin(a) * 0.6 - x[i], dy = ty[i] + Math.cos(a) * 0.6 - y[i];
            const k = 1 - Math.pow(1 - ease[i], f);
            x[i] += dx * k - dy * k * swirl[i] + vx[i] * f;
            y[i] += dy * k + dx * k * swirl[i] + vy[i] * f;
            vx[i] *= damp; vy[i] *= damp;
            if (mouseOn) {
                const mx = x[i] - mouse.x, my = y[i] - mouse.y, d2 = mx * mx + my * my;
                if (d2 < R2 && d2 > 0.01) { const d = Math.sqrt(d2), F = (1 - d / R) * 14 * 0.12 * f; vx[i] += (mx / d) * F; vy[i] += (my / d) * F; }
            }
        }
        ctx.globalAlpha = alpha;
        let cur = -1;
        for (let j = 0; j < n; j++) {
            const i = order[j], kk = key[i];
            if (kk !== cur) { cur = kk; ctx.fillStyle = STYLES[kk]; }
            const s = size[i];
            ctx.fillRect(x[i] - s * 0.5, y[i] - s * 0.5, s, s);
        }
        if (t > 5800) {
            ctx.fillStyle = '#fff';
            for (const i of P.shim) {
                const sA = Math.sin(t * 0.001 * 6.283 * (1.5 + om[i] * 1500) + ph[i]);
                if (sA <= 0) continue;
                ctx.globalAlpha = alpha * 0.15 * sA;
                const s = size[i]; ctx.fillRect(x[i] - s * 0.5, y[i] - s * 0.5, s, s);
            }
        }
        ctx.globalAlpha = 1;
    }

    // ---------- Timeline ----------
    function playIntro() {
        if (destroyed) return;
        stage.getAnimations?.().forEach((a) => a.cancel());
        [orb, kinetic, title, roleEl, cta, nav].forEach((el) => el.getAnimations?.().forEach((a) => a.cancel()));
        computeLayout();
        buildParticles(false);
        t0 = performance.now();
        const E1 = 'cubic-bezier(0.16,1,0.3,1)', E2 = 'cubic-bezier(0.22,1,0.36,1)', E3 = 'cubic-bezier(0.65,0,0.35,1)';
        const both = (delay, duration, easing = 'linear') => ({ delay, duration, easing, fill: 'both' });
        const fwd = (delay, duration, easing = 'linear') => ({ delay, duration, easing, fill: 'forwards' });
        const c = 'translate(-50%,-50%)';

        orb.animate([
            { transform: c + ' scale(0)', opacity: 0 },
            { transform: c + ' scale(1)', opacity: 1, offset: 0.3 },
            { transform: c + ' scale(1.15)', opacity: 1, offset: 0.65 },
            { transform: c + ' scale(.9)', opacity: 1 }
        ], both(0, 400, 'cubic-bezier(0.45,0,0.55,1)'));
        orb.animate([
            { left: '50%', top: '50%', transform: c + ' scale(.9)', opacity: 1 },
            { left: '53%', top: '63%', transform: c + ' scale(0)', opacity: 0 }
        ], fwd(400, 700, 'cubic-bezier(0.55,0,0.85,0.35)'));

        const ks = [...kinetic.children], cw = kinetic.offsetWidth;
        ks.forEach((s, i) => {
            const off = cw / 2 - (s.offsetLeft + s.offsetWidth / 2);
            const rx = (Math.random() - 0.5) * W * 0.5, ry = (Math.random() - 0.5) * H * 0.36;
            const r0 = -90 + Math.random() * 135, r1 = (Math.random() - 0.5) * 50;
            s.animate([
                { transform: `translate(${off}px,0) scale(.2) rotate(${r0}deg)`, opacity: 0, easing: E1 },
                { transform: `translate(${off * 0.2 + rx}px,${ry}px) scale(${1 + Math.random() * 0.3}) rotate(${r1}deg)`, opacity: 1, offset: 0.45, easing: E2 },
                { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 }
            ], both(400 + i * 40, 850));
            s.animate([
                { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' },
                { opacity: 0, transform: 'translateY(-18px)', filter: 'blur(6px)' }
            ], fwd(2100 + i * 20, 450, E3));
        });
        kinetic.animate([
            { transform: c + ' scale(1)' }, { transform: c + ' scale(1.03)', offset: 0.3 }, { transform: c + ' scale(1)' }
        ], fwd(1300, 500, E2));

        [...title.children].forEach((s, i) => s.animate([
            { opacity: 0, transform: 'translateY(18px)', filter: 'blur(6px)' },
            { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' }
        ], both(2150 + i * 25, 450, E3)));
        titleAnim = title.animate([{ top: '50%' }, { top: L.titleY * 100 + '%' }], both(3000, 850, E2));

        roleEl.animate([
            { opacity: 0, transform: 'translateY(12px)' },
            { opacity: 0.2, transform: 'translateY(12px)', offset: 0.28 },
            { opacity: 1, transform: 'translateY(0)' }
        ], both(2800, 700, 'ease-out'));
        cta.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], both(3000, 500, 'ease-out'));
        nav.animate([{ opacity: 0, transform: 'translateY(-10px)' }, { opacity: 1, transform: 'translateY(0)' }], both(900, 600, E1));
    }

    // ---------- Sources ----------
    function loadImage(src) {
        return new Promise((res, rej) => { const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => res(im); im.onerror = rej; im.src = src; });
    }
    async function initialSource() {
        if (config.photo) {
            try { return await Promise.race([loadImage(config.photo), sleep(2500).then(() => { throw new Error('timeout'); })]); } catch (e) { /* fall back */ }
        }
        return makeBust();
    }

    // ---------- Events ----------
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; };
    const onUp = (e) => { if (e.pointerType !== 'mouse') mouse.active = false; };
    const onLeave = () => { mouse.active = false; };
    const onBlur = () => { mouse.active = false; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onBlur);

    let rz;
    const onResize = () => {
        clearTimeout(rz);
        rz = setTimeout(() => {
            if (destroyed) return;
            computeLayout();
            if (titleAnim) titleAnim.effect.setKeyframes([{ top: '50%' }, { top: L.titleY * 100 + '%' }]);
            buildParticles(true);
        }, 200);
    };
    window.addEventListener('resize', onResize);

    // ---------- Boot ----------
    (async () => {
        setText();
        try {
            await Promise.race([
                Promise.all([
                    document.fonts.load('900 100px Montserrat'),
                    document.fonts.load('500 12px Inter'),
                    document.fonts.load('italic 400 14px Montserrat')
                ]),
                sleep(2000)
            ]);
        } catch (e) { /* fonts optional */ }
        if (destroyed) return;
        source = await initialSource();
        playIntro();
        raf = requestAnimationFrame(frame);
    })();

    return {
        replay: playIntro,
        destroy() {
            destroyed = true;
            cancelAnimationFrame(raf);
            clearTimeout(rz);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            document.removeEventListener('pointerleave', onLeave);
            window.removeEventListener('blur', onBlur);
            window.removeEventListener('resize', onResize);
        }
    };
}
