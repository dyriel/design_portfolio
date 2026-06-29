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
  <a href="#work">Work</a>
  <a href="#contact">Contact</a>
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
document.querySelectorAll('.card, .about__grid, .section__heading, .contact__sub').forEach(el => {
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