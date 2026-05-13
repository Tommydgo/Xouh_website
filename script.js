/* ═══════════════════════════════════════════════════════════
   XOUH v3 — script.js
   Modules: depth gauge | nav | reveal | mobile menu
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── DEPTH GAUGE + NAV SCROLL ─────────────────────────────
   Updates the right-side depth progress bar and nav state
   on every scroll event. Passive listener for performance.
   ──────────────────────────────────────────────────────── */
(function initScrollBehavior() {
  const depthFill  = document.getElementById('depthFill');
  const depthLabel = document.getElementById('depthLabel');
  const nav        = document.getElementById('nav');
  const NAV_THRESHOLD = 60;   // px before nav goes opaque
  const MAX_DEPTH     = 500;  // fictional ocean depth in metres

  function onScroll() {
    const scrollY   = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio     = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

    // Depth gauge fill (0 → 100%)
    if (depthFill)  depthFill.style.height = (ratio * 100) + '%';
    if (depthLabel) depthLabel.textContent = Math.round(ratio * MAX_DEPTH) + ' m';

    // Nav background on scroll
    nav.classList.toggle('scrolled', scrollY > NAV_THRESHOLD);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ─── REVEAL ON SCROLL (IntersectionObserver) ───────────────
   Elements with class .reveal fade up into view when they
   enter the viewport. data-delay="0|1|2" staggers siblings.
   ──────────────────────────────────────────────────────── */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
})();


/* ─── MOBILE NAV TOGGLE ─────────────────────────────────────
   Hamburger button toggles .open on both the button and
   the nav links list. Closes when a link is clicked.
   ──────────────────────────────────────────────────────── */
(function initMobileNav() {
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  function closeNav() {
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on any nav link click
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      closeNav();
    }
  });
})();


/* ─── SMOOTH SCROLL POLYFILL ────────────────────────────────
   Intercepts anchor clicks and uses scrollIntoView with
   'smooth' behavior, offsetting for the fixed nav height.
   ──────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  const NAV_OFFSET = 72; // approximate nav height in px

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
