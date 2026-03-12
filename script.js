/**
 * script.js — Banawi Muslim Wibowo Portfolio
 * Features: Theme toggle + Staggered scroll reveal
 */

// =============================================
// 1. THEME TOGGLE
// =============================================
const themeBtn = document.getElementById('theme-toggle');

// Restore saved preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
  themeBtn.textContent = 'Light Mode';
}

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  themeBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});


// =============================================
// 2. STAGGERED SECTION REVEAL (Intersection Observer)
// =============================================
const sections = document.querySelectorAll('.cv-section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

// Stagger each section's transition delay
sections.forEach((section, i) => {
  section.style.transitionDelay = `${i * 0.1}s`;
  observer.observe(section);
});