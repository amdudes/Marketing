// ============================================
// AURA — Shared JS
// ============================================

// Cursor
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
if (dot && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animCursor() {
    dot.style.left = mx - 4 + 'px';
    dot.style.top = my - 4 + 'px';
    rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1;
    ring.style.left = rx - 20 + 'px';
    ring.style.top = ry - 20 + 'px';
    requestAnimationFrame(animCursor);
  })();
  document.querySelectorAll('a, button, .glass-card, .service-block, .process-step, .pkg-card, .team-card, .result-item').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hover'); ring.classList.remove('hover'); });
  });
}

// Navbar scroll
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.08 });
revealEls.forEach(el => revObs.observe(el));

// Particles canvas (subtle floating dots)
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const pts = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    o: Math.random() * 0.5 + 0.1
  }));
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.o})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const isOpen = q.classList.contains('open');
    document.querySelectorAll('.faq-q').forEach(x => {
      x.classList.remove('open');
      x.nextElementSibling.style.maxHeight = null;
    });
    if (!isOpen) {
      q.classList.add('open');
      q.nextElementSibling.style.maxHeight = q.nextElementSibling.scrollHeight + 'px';
    }
  });
});

// Counter animation
function animCount(el, target, suffix='') {
  let start = null;
  const dur = 2000;
  function step(ts) {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - prog, 4);
    el.textContent = (target < 10 ? (ease * target).toFixed(1) : Math.floor(ease * target)) + suffix;
    if (prog < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-count]').forEach(el => {
        const t = parseFloat(el.dataset.count);
        const s = el.dataset.suffix || '';
        animCount(el, t, s);
      });
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-group').forEach(g => statObs.observe(g));
