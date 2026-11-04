/* ── IMAGE LOAD: hide placeholder when real image loads ──────── */
document.querySelectorAll('.card__real-img').forEach(img => {
  const markLoaded = () => img.closest('.card__img').classList.add('has-image');
  if (img.complete && img.naturalWidth > 0) markLoaded();
  else img.addEventListener('load', markLoaded);
});

/* ── NAV SCROLL (throttled, passive) ────────────────────────── */
const nav = document.querySelector('.nav');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ── MOBILE NAV ──────────────────────────────────────────────── */
const burger = document.querySelector('.nav__burger');
const mobileNav = document.createElement('div');
mobileNav.className = 'nav__mobile';
mobileNav.innerHTML = `
  <button class="nav__mobile-close" aria-label="Close menu">✕</button>
  <a href="#about">About</a>
  <a href="#projects">Projects</a>
  <a href="#contact">Contact</a>
  <a href="images/Ashley_Buenafe_Resume.pdf" target="_blank" rel="noopener">Resume</a>
`;
document.body.appendChild(mobileNav);
burger.addEventListener('click', () => mobileNav.classList.add('open'));
mobileNav.querySelector('.nav__mobile-close').addEventListener('click', () => mobileNav.classList.remove('open'));
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

/* ── WORK FILTER ─────────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.cat !== filter);
    });
  });
});

/* ── SCROLL REVEAL (CSS class toggle — no inline style thrashing) */
document.querySelectorAll('.card, .project, .about__grid, .about__skills, .about__details, .section__heading, .subhead, .contact__sub, .contact__list, .contact__form-wrap').forEach(el => {
  el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // stop watching once revealed
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── CONTACT FORM ────────────────────────────────────────────── */
/* GitHub Pages is static, so it can't receive form posts on its own.
   Option A (recommended): make a free form at formspree.io, then paste its
   URL below, e.g. 'https://formspree.io/f/abcdwxyz'. Messages land in your inbox.
   Option B: leave it empty. The button then opens the visitor's email app
   with the message pre-filled, addressed to CONTACT_EMAIL. */
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'ashleyvbuenafe@gmail.com';

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const submitBtn   = document.getElementById('cf-submit');
  const successBox  = document.getElementById('form-success');
  const successText = document.getElementById('form-success-text');
  const errorMsg    = document.getElementById('form-error');

  const showSuccess = (text) => {
    successText.textContent = text;
    contactForm.hidden = true;
    successBox.hidden = false;
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.hidden = true;
    const data = Object.fromEntries(new FormData(contactForm));

    if (FORM_ENDPOINT) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Request failed');
        showSuccess("Thanks for reaching out! I'll get back to you within a day or two.");
      } catch (err) {
        errorMsg.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    } else {
      const subject = encodeURIComponent('Portfolio message from ' + data.name);
      const body = encodeURIComponent(data.message + '\n\n' + data.name + ' (' + data.email + ')');
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
      showSuccess('Your email app should open with the message ready to send.');
    }
  });
}


/* ── WORK CAROUSEL (phones) ─────────────────────────────────── */
const workTrack = document.querySelector('.work__grid');
const workPrev  = document.getElementById('work-prev');
const workNext  = document.getElementById('work-next');
const workCount = document.getElementById('work-count');
const phoneMQ   = window.matchMedia('(max-width: 600px)');

const slides = () => [...workTrack.querySelectorAll('.card:not(.hidden)')];

function currentSlide() {
  const mid = workTrack.scrollLeft + workTrack.clientWidth / 2;
  let best = 0, dist = Infinity;
  slides().forEach((c, i) => {
    const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
    if (d < dist) { dist = d; best = i; }
  });
  return best;
}

function updateCarousel() {
  const list = slides();
  if (!phoneMQ.matches || !list.length) return;
  const i = currentSlide();
  workCount.textContent = (i + 1) + ' / ' + list.length;
  workPrev.disabled = i === 0;
  workNext.disabled = i === list.length - 1;
}

function goToSlide(i) {
  const list = slides();
  const c = list[Math.max(0, Math.min(list.length - 1, i))];
  if (!c) return;
  workTrack.scrollTo({
    left: c.offsetLeft - (workTrack.clientWidth - c.offsetWidth) / 2,
    behavior: 'smooth'
  });
}

workPrev.addEventListener('click', () => goToSlide(currentSlide() - 1));
workNext.addEventListener('click', () => goToSlide(currentSlide() + 1));

let carouselTick = false;
workTrack.addEventListener('scroll', () => {
  if (!carouselTick) {
    requestAnimationFrame(() => { updateCarousel(); carouselTick = false; });
    carouselTick = true;
  }
}, { passive: true });

// filtering changes which slides exist, so jump back to the first one
filterBtns.forEach(b => b.addEventListener('click', () => {
  workTrack.scrollLeft = 0;
  requestAnimationFrame(updateCarousel);
}));

window.addEventListener('resize', updateCarousel);
updateCarousel();


/* ── SKY: pixel-ASCII stars on the landing + About, hover throb, shooting stars ── */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand   = (a, b) => a + Math.random() * (b - a);
  const lerp   = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  // [glyph, weight, sizes it may use]
  const GLYPHS = [
    ['✧', 6, [1, 2, 3]], ['✦', 2, [1, 2, 3]], ['⋆', 4, [1, 2]], ['*', 5, [1, 2, 3]],
    ['･', 5, [1]], ['ﾟ', 4, [1]], ['｡', 3, [1]], ['˚', 4, [1]],
    [':', 4, [1, 2]], ['+', 2, [1, 2]], ['.', 2, [1]], ['·', 2, [1]]
  ];
  const TOTAL = GLYPHS.reduce((s, g) => s + g[1], 0);
  function pickGlyph() {
    let r = Math.random() * TOTAL;
    for (const g of GLYPHS) { if ((r -= g[1]) <= 0) return g; }
    return GLYPHS[0];
  }

  function createSky(cfg) {
    const { sky, hover, items } = cfg;
    sky.classList.add('sky');
    let points = [], builtWidth = 0, lastSig = 0;

    // rectangles (relative to the sky) that content occupies, so stars stay calm over it
    function rects(sr) {
      const out = [];
      items.forEach(({ sel, mode }) => {
        document.querySelectorAll(sel).forEach((el) => {
          let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
          const add = (bb) => { l = Math.min(l, bb.left); t = Math.min(t, bb.top); r = Math.max(r, bb.right); b = Math.max(b, bb.bottom); };
          if (mode === 'btns') el.querySelectorAll('.btn').forEach((x) => add(x.getBoundingClientRect()));
          else if (mode === 'box') add(el.getBoundingClientRect());
          else { const rg = document.createRange(); rg.selectNodeContents(el); add(rg.getBoundingClientRect()); }
          if (l === Infinity) return;
          out.push({ l: l - sr.left - cfg.pad, r: r - sr.left + cfg.pad, t: t - sr.top - cfg.pad, b: b - sr.top + cfg.pad });
        });
      });
      return out;
    }
    const sig = (rs) => rs.reduce((s, r) => s + r.l + r.r + r.t + r.b, 0);

    function measure() {
      const sx = window.scrollX, sy = window.scrollY;
      points = [...sky.querySelectorAll('.star:not(.star--text)')].map((el) => {
        const r = el.getBoundingClientRect();
        return { el, x: r.left + r.width / 2 + sx, y: r.top + r.height / 2 + sy };
      });
    }

    function build() {
      const sr = sky.getBoundingClientRect();
      const w = sr.width, h = sr.height;
      if (!w || !h) return;
      builtWidth = window.innerWidth;
      const mobile = w <= 600;
      const rs = rects(sr);
      lastSig = sig(rs);
      const inText = (x, y) => rs.some((r) => x > r.l && x < r.r && y > r.t && y < r.b);

      // Poisson-style sampling: random but never bunched, so it reads as a calm sky
      const target = cfg.target(w, h, mobile);
      const picked = [];
      let tries = 0;
      while (picked.length < target && tries++ < target * 90) {
        const x = cfg.x(w, mobile);
        const y = rand(cfg.yMin, h - 14);
        const rel = x / w;
        const minD = cfg.minD(rel, mobile);
        const text = inText(x, y);
        if (text && Math.random() < cfg.textReject) continue;
        if (picked.some((p) => (p.x - x) ** 2 + (p.y - y) ** 2 < minD * minD)) continue;
        picked.push({ x, y, rel, text });
      }

      sky.querySelectorAll('.star').forEach((s) => s.remove());
      const frag = document.createDocumentFragment();
      for (const p of picked) {
        const [glyph, , sizes] = pickGlyph();
        let size = sizes[Math.floor(Math.random() * sizes.length)];
        if (sizes.includes(3) && Math.random() > 0.15) size = Math.min(size, 2);

        const o = rand(0.5, 1) * cfg.scale * cfg.side(p.rel, mobile) * (p.text ? cfg.textFade : 1);
        const el = document.createElement('span');
        el.className = 'star star--s' + size +
          (Math.random() < 0.3 ? ' star--gold' : '') +
          (Math.random() < 0.22 ? ' star--still' : '') +
          (p.text ? ' star--text' : '');
        el.textContent = glyph;
        el.style.left = p.x.toFixed(1) + 'px';
        el.style.top  = p.y.toFixed(1) + 'px';
        el.style.setProperty('--o', o.toFixed(2));
        el.style.setProperty('--t', rand(2.4, 6.8).toFixed(2) + 's');
        el.style.setProperty('--d', (-rand(0, 7)).toFixed(2) + 's');
        frag.appendChild(el);
      }
      sky.appendChild(frag);
      measure();
    }

    // hover: the star swells and settles (CSS does the throb); a tiny random delay keeps neighbours out of lockstep
    function twinkle(el) {
      if (el._tw) return;
      el._tw = true;
      setTimeout(() => {
        el.classList.add('twinkle');
        setTimeout(() => { el.classList.remove('twinkle'); el._tw = false; }, 1250);
      }, rand(0, 160));
    }

    let px = 0, py = 0, queued = false;
    function hit() {
      queued = false;
      const R2 = 46 * 46;
      for (const p of points) {
        const dx = p.x - px, dy = p.y - py;
        if (dx * dx + dy * dy < R2) twinkle(p.el);
      }
    }
    const onMove = (e) => {
      px = e.pageX; py = e.pageY;
      if (!queued) { queued = true; requestAnimationFrame(hit); }
    };
    if (!reduceMotion) {
      hover.addEventListener('pointermove', onMove, { passive: true });
      hover.addEventListener('pointerdown', onMove, { passive: true });
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => sky.classList.toggle('is-paused', !en.isIntersecting)).observe(hover);
    }

    return {
      sky, build, measure,
      widthChanged: () => window.innerWidth !== builtWidth,
      moved: () => Math.abs(sig(rects(sky.getBoundingClientRect())) - lastSig) > 24
    };
  }

  const hero  = document.getElementById('hero');
  const heroSky = document.getElementById('hero-sky');
  const about = document.getElementById('about');
  const skies = [];

  if (hero && heroSky) {
    skies.push(createSky({
      sky: heroSky, hover: hero, pad: 16,
      items: [
        { sel: '.hero__tag', mode: 'text' }, { sel: '.hero__name', mode: 'text' },
        { sel: '.hero__sub', mode: 'text' }, { sel: '.hero__actions', mode: 'btns' }
      ],
      scale: 1, textFade: 0.2, textReject: 0.6, yMin: 78,
      target: (w, h, m) => m ? 62 : Math.round(Math.min(170, (w * h) / 8000)),
      // desktop: more toward the right, but still reaching all the way across to the left edge
      x: (w, m) => m ? rand(8, w - 16) : 8 + (w - 24) * Math.pow(Math.random(), 0.75),
      minD: (rel, m) => m ? 56 : lerp(66, 40, smooth(0.1, 0.8, rel)),
      // desktop: fades toward the left (no fade on phones)
      side: (rel, m) => m ? 1 : lerp(0.4, 1, smooth(0.1, 0.7, rel))
    }));
  }

  let aboutSky = null;
  if (about) {
    aboutSky = document.createElement('div');
    aboutSky.className = 'about__sky';
    aboutSky.setAttribute('aria-hidden', 'true');
    about.insertBefore(aboutSky, about.firstChild);
    skies.push(createSky({
      sky: aboutSky, hover: about, pad: 12,
      items: [
        { sel: '#about .about__photo-wrap', mode: 'box' }, { sel: '#about .about__text', mode: 'box' },
        { sel: '#about .about__skills', mode: 'box' },     { sel: '#about .about__details', mode: 'box' }
      ],
      scale: 0.38, textFade: 0.6, textReject: 0.8, yMin: 16,
      target: (w, h, m) => m ? 20 : Math.round(Math.min(70, (w * h) / 24000)),
      x: (w) => rand(8, w - 16),
      minD: () => 72,
      side: () => 1
    }));
  }

  // ── shooting stars: a short volley each time the About section scrolls into view ──
  function launchShootingStars() {
    if (!aboutSky || reduceMotion) return;
    const sr = aboutSky.getBoundingClientRect();
    const w = sr.width, h = sr.height;
    const small = w <= 600;
    const vis0 = Math.max(0, -sr.top);
    const vis1 = Math.min(h, window.innerHeight - sr.top);
    const count = small ? 3 : 5;
    const TRAIL = ['✧', '･', 'ﾟ', '.', '˚', '·'];

    for (let i = 0; i < count; i++) {
      const ang = rand(18, 30);
      const len = small ? rand(220, 340) : rand(420, 660);
      const dx = -len * Math.cos(ang * Math.PI / 180);
      const dy =  len * Math.sin(ang * Math.PI / 180);

      const el = document.createElement('span');
      el.className = 'shoot';
      const head = document.createElement('span');
      head.className = 'shoot__head';
      head.textContent = '✦';
      el.appendChild(head);
      TRAIL.forEach((ch, k) => {
        const t = document.createElement('span');
        t.textContent = ch;
        t.style.opacity = (0.8 - k * 0.13).toFixed(2);
        el.appendChild(t);
      });

      el.style.left = rand(w * 0.35, w - 20).toFixed(0) + 'px';
      el.style.top  = rand(vis0 + 20, vis0 + Math.max(80, (vis1 - vis0) * 0.5)).toFixed(0) + 'px';
      el.style.setProperty('--rot', (-ang).toFixed(1) + 'deg');
      el.style.setProperty('--dx', dx.toFixed(0) + 'px');
      el.style.setProperty('--dy', dy.toFixed(0) + 'px');
      el.style.setProperty('--dur', rand(1.3, 1.9).toFixed(2) + 's');
      el.style.setProperty('--delay', (i * 0.65 + rand(0, 0.5)).toFixed(2) + 's');
      el.addEventListener('animationend', () => el.remove());
      aboutSky.appendChild(el);
    }
  }

  if (about && 'IntersectionObserver' in window) {
    let inView = false, lastShot = 0;
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !inView) {
        inView = true;
        if (Date.now() - lastShot > 8000) { lastShot = Date.now(); launchShootingStars(); }
      } else if (!en.isIntersecting) {
        inView = false;
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -20% 0px' }).observe(about);
  }

  // rebuild on width change; wait for fonts so text areas are measured correctly
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => skies.forEach((s) => (s.widthChanged() ? s.build() : s.measure())), 200);
  });

  const fontsReady = (document.fonts && document.fonts.ready)
    ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))])
    : Promise.resolve();
  fontsReady.then(() => skies.forEach((s) => s.build()));

  if (document.fonts && document.fonts.addEventListener) {
    document.fonts.addEventListener('loadingdone', () => {
      skies.forEach((s) => { if (s.moved()) s.build(); });   // only reshuffle if the layout moved
    });
  }
})();