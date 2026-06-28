/* ── IMAGE LOAD: hide placeholder when real image loads ──────── */
document.querySelectorAll('.card__real-img').forEach(img => {
  const markLoaded = () => img.closest('.card__img').classList.add('has-image');
  if (img.complete && img.naturalWidth > 0) {
    markLoaded();
  } else {
    img.addEventListener('load', markLoaded);
  }
});

/* ── NAV SCROLL ─────────────────────────────────────────────── */
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

/* ── MOBILE NAV ─────────────────────────────────────────────── */
const burger = document.querySelector('.nav__burger');

// Create mobile overlay
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

/* ── WORK FILTER ────────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    cards.forEach(card => {
      const cat = card.dataset.cat;
      const show = filter === 'all' || cat === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.card, .about__grid, .section__heading, .contact__sub');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});