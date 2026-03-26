/* ═══════════════════════════════════════════════════════════
   BANAWI MUSLIM WIBOWO — Portfolio JS
   Features:
   - Custom cursor
   - Navbar scroll behavior + active link
   - Theme toggle (dark/light)
   - Mobile hamburger menu
   - Scroll reveal animations
   - Typing animation (hero tagline)
   - Animated stat counters
   - Skill bar fill animation
   - Footer year
═══════════════════════════════════════════════════════════ */

'use strict';

// ─── Wait for DOM ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initThemeToggle();
  initHamburger();
  initScrollReveal();
  initTypingAnimation();
  initStatCounters();
  initSkillBars();
  initFooterYear();
});

/* ═══════════════════════════════════════════════════════════
   1. CUSTOM CURSOR
═══════════════════════════════════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = document.querySelectorAll('a, button, .skill-card, input, textarea');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '0.6';
  });
}

/* ═══════════════════════════════════════════════════════════
   2. NAVBAR — scroll behavior & active section highlight
═══════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }, { passive: true });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      closeMobileMenu();
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  }
}

/* ═══════════════════════════════════════════════════════════
   3. THEME TOGGLE — dark / light
═══════════════════════════════════════════════════════════ */
function initThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const html = document.documentElement;
  if (!btn) return;

  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* ═══════════════════════════════════════════════════════════
   4. HAMBURGER MENU
═══════════════════════════════════════════════════════════ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      navLinks.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

function closeMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

/* ═══════════════════════════════════════════════════════════
   5. SCROLL REVEAL
═══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('skill-card')) {
          const fill = entry.target.querySelector('.skill-fill');
          if (fill) animateSkillBar(fill);
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════
   6. TYPING ANIMATION — hero tagline (Bahasa Indonesia)
═══════════════════════════════════════════════════════════ */
function initTypingAnimation() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    "Saya memahami jaringan dari kabel hingga konfigurasi",
    "Saya menjaga infrastruktur tetap hidup 24/7",
    "Saya terjun langsung ke lapangan dan ke terminal",
    "Saya belajar dari router, switch, dan baris perintah",
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPE_SPEED   = 60;
  const DELETE_SPEED = 35;
  const PAUSE_END    = 2200;
  const PAUSE_START  = 400;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

    if (!isDeleting && charIndex === current.length) {
      if (isPaused) return;
      isPaused = true;
      setTimeout(() => {
        isPaused = false;
        isDeleting = true;
        type();
      }, PAUSE_END);
      return;
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = PAUSE_START;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
}

/* ═══════════════════════════════════════════════════════════
   7. STAT COUNTERS (About section)
═══════════════════════════════════════════════════════════ */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => observer.observe(stat));
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

/* ═══════════════════════════════════════════════════════════
   8. SKILL BAR FILL ANIMATION
═══════════════════════════════════════════════════════════ */
function initSkillBars() {
  setTimeout(() => {
    document.querySelectorAll('.skill-card.visible .skill-fill').forEach(fill => {
      animateSkillBar(fill);
    });
  }, 500);
}

function animateSkillBar(fill) {
  const level = fill.dataset.level || '80';
  setTimeout(() => {
    fill.style.width = level + '%';
  }, 200);
}

/* ═══════════════════════════════════════════════════════════
   9. FOOTER YEAR
═══════════════════════════════════════════════════════════ */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}