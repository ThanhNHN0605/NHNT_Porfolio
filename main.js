// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40
    ? 'rgba(10,14,26,0.97)'
    : 'rgba(10,14,26,0.85)';
});

// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
  '.skill-card, .timeline-item, .project-card, .contact-card, .edu-card, .section-header, .hero-text > *'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ===== PARTICLE CANVAS =====
const canvas = document.createElement('canvas');
canvas.id = 'particles';
document.querySelector('.hero').prepend(canvas);
Object.assign(canvas.style, {
  position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '0'
});

const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.8 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(79,142,247,${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 90; i++) particles.push(new Particle());

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(79,142,247,${0.12 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animate);
}
animate();

// ===== TYPING EFFECT =====
const roles = ['Senior Data Engineer', 'Big Data Architect', 'Streaming Systems Builder', 'Cloud Infrastructure Expert'];
let roleIdx = 0, charIdx = 0, deleting = false;
const tagEl = document.querySelector('.hero-tag');
if (tagEl) {
  function typeRole() {
    const role = roles[roleIdx];
    tagEl.textContent = deleting ? role.slice(0, charIdx--) : role.slice(0, charIdx++);
    if (!deleting && charIdx > role.length) { deleting = true; setTimeout(typeRole, 1800); return; }
    if (deleting && charIdx < 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    setTimeout(typeRole, deleting ? 40 : 80);
  }
  setTimeout(typeRole, 1000);
}

// ===== COUNTER ANIMATION =====
function animateCounter(el, target) {
  let current = 0;
  const duration = 1200;
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    current = Math.round(ease * target);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// Hero stats counter
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const nums = e.target.querySelectorAll('.stat-num');
      nums.forEach(n => {
        const raw = n.textContent;
        const num = parseInt(raw.replace(/\D/g, ''));
        const suffix = raw.replace(/[\d]/g, '');
        if (!isNaN(num)) animateCounter(n, num, suffix);
      });
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// Metric band counters
const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.metric-big[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target);
        if (!isNaN(target)) animateCounter(el, target);
      });
      metricObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

const metricsBand = document.querySelector('.metrics-band');
if (metricsBand) metricObserver.observe(metricsBand);

// ===== CURSOR GLOW =====
const glow = document.createElement('div');
glow.className = 'cursor-glow';
document.body.appendChild(glow);
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});
