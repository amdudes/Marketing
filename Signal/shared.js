// ============================================
// SIGNAL — Shared JS (all pages)
// ============================================

// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
if (cursor && cursorRing) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animateCursor() {
    cursor.style.left = mx - 6 + 'px';
    cursor.style.top = my - 6 + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx - 18 + 'px';
    cursorRing.style.top = ry - 18 + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll('a, button, .service-card, .result-row, .process-step, .platform-item, .team-card, .value-card, .testi-card, .pkg-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(2.5)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
  });
}

// Navbar scroll
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));
