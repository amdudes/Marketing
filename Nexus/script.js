/* ============================================================
   NEXUS SOCIAL — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── AOS Init ──────────────────────────────────────────────
  AOS.init({
    duration: 800,
    easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    once: true,
    offset: 60,
  });

  // ── Navbar scroll blur ────────────────────────────────────
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // ── Counter animation ─────────────────────────────────────
  const counters = document.querySelectorAll('.counter');

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2200;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = eased * target;

      if (isDecimal) {
        el.textContent = prefix + value.toFixed(1) + suffix;
      } else {
        el.textContent = prefix + Math.floor(value).toLocaleString() + suffix;
      }

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = prefix + (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
    };

    requestAnimationFrame(update);
  };

  // Observe counters
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(c => observer.observe(c));
  }

  // ── Floating particles ────────────────────────────────────
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * canvas.width;
        this.y  = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r  = Math.random() * 1.5 + 0.5;
        this.a  = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.5
          ? `rgba(124,58,237,${this.a})`
          : `rgba(6,182,212,${this.a})`;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width ||
            this.y < 0 || this.y > canvas.height) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // Spawn particles
    for (let i = 0; i < 70; i++) particles.push(new Particle());

    // Lines between nearby particles
    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(124,58,237,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(animate);
    };
    animate();
  }

  // ── Active nav link ───────────────────────────────────────
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });

  // ── Chart bar heights ─────────────────────────────────────
  const bars = document.querySelectorAll('.chart-bar');
  const heights = [40, 60, 50, 75, 65, 80, 55, 90, 70, 85, 75, 95];
  bars.forEach((bar, i) => {
    bar.style.height = (heights[i % heights.length] || 60) + '%';
    bar.style.animationDelay = (i * 0.06) + 's';
  });

  // ── Form submit (demo) ────────────────────────────────────
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.submit-btn');
      const original = btn.querySelector('span')?.textContent || btn.textContent;

      if (btn.querySelector('span')) {
        btn.querySelector('span').textContent = '✓ Message Sent!';
      } else {
        btn.textContent = '✓ Message Sent!';
      }
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

      setTimeout(() => {
        if (btn.querySelector('span')) {
          btn.querySelector('span').textContent = original;
        } else {
          btn.textContent = original;
        }
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

  // ── Smooth scroll for anchor links ───────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Page transition ───────────────────────────────────────
  document.querySelectorAll('a:not([href^="#"]):not([href^="mailto"]):not([href^="tel"])').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('//')) return;
      // Subtle: already handled by browser navigation
    });
  });

});
