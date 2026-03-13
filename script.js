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
   - Contact form validation
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
  initContactForm();
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

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  });

  // Ring follows with lag (requestAnimationFrame)
  function animateRing() {
    // Lerp (linear interpolation) for smooth lag
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Grow ring on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .skill-card, .project-card, input, textarea');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  // Hide cursor when leaving window
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

  // Add shadow when scrolled
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  }, { passive: true });

  // Smooth scroll on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        const offset = 80; // navbar height offset
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  // Update active nav link based on scroll position
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

  // Load saved preference
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

  // Close on outside click
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
        // Trigger skill bars & counters when visible
        if (entry.target.classList.contains('skill-card')) {
          const fill = entry.target.querySelector('.skill-fill');
          if (fill) animateSkillBar(fill);
        }
        observer.unobserve(entry.target); // only animate once
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════
   6. TYPING ANIMATION — hero tagline
═══════════════════════════════════════════════════════════ */
function initTypingAnimation() {
  const el = document.getElementById('typedText');
  if (!el) return;

  // You can add more phrases here
  const phrases = [
    "I build digital experiences that matter",
    "I design APIs that scale",
    "I craft backends that never break",
    "I turn data into reliable systems",
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let isPaused    = false;

  const TYPE_SPEED   = 60;   // ms per character typing
  const DELETE_SPEED = 35;   // ms per character deleting
  const PAUSE_END    = 2200; // pause at end of phrase
  const PAUSE_START  = 400;  // pause before re-typing

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

    // Finished typing
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

    // Finished deleting
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = PAUSE_START;
    }

    setTimeout(type, delay);
  }

  // Start with a small delay
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
    // easeOutExpo
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
  // Bars are triggered by scroll reveal observer above
  // This fallback handles any already-visible cards on load
  setTimeout(() => {
    document.querySelectorAll('.skill-card.visible .skill-fill').forEach(fill => {
      animateSkillBar(fill);
    });
  }, 500);
}

function animateSkillBar(fill) {
  const level = fill.dataset.level || '80';
  // Small delay for visual delight
  setTimeout(() => {
    fill.style.width = level + '%';
  }, 200);
}

/* ═══════════════════════════════════════════════════════════
   9. CONTACT FORM VALIDATION
═══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    // Simulate sending (replace with real API call)
    const btn      = form.querySelector('.btn');
    const btnText  = btn.querySelector('.btn-text');
    const success  = document.getElementById('formSuccess');

    btnText.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btnText.textContent = 'Send Message';
      btn.disabled = false;
      form.reset();
      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    }, 1500);
  });

  // Live validation on blur
  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', () => validateField(el));
      el.addEventListener('input', () => clearError(el));
    }
  });
}

function validateForm() {
  const name    = document.getElementById('name');
  const email   = document.getElementById('email');
  const message = document.getElementById('message');
  let valid = true;

  if (!validateField(name))    valid = false;
  if (!validateField(email))   valid = false;
  if (!validateField(message)) valid = false;

  return valid;
}

function validateField(el) {
  const id    = el.id;
  const value = el.value.trim();
  const error = document.getElementById(id + 'Error');

  // Clear first
  el.classList.remove('invalid');
  if (error) error.textContent = '';

  if (!value) {
    setError(el, error, 'This field is required.');
    return false;
  }

  if (id === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError(el, error, 'Please enter a valid email address.');
      return false;
    }
  }

  if (id === 'message' && value.length < 10) {
    setError(el, error, 'Message must be at least 10 characters.');
    return false;
  }

  return true;
}

function setError(el, errorEl, message) {
  el.classList.add('invalid');
  if (errorEl) errorEl.textContent = message;
}

function clearError(el) {
  el.classList.remove('invalid');
  const error = document.getElementById(el.id + 'Error');
  if (error) error.textContent = '';
}

/* ═══════════════════════════════════════════════════════════
   10. FOOTER YEAR
═══════════════════════════════════════════════════════════ */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}