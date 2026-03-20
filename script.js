/* ========================================
   COSMIC TERMINAL — Interactions
   ======================================== */

(function () {
  'use strict';

  // ---------- Animated Starfield ----------
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let mouseX = 0;
  let mouseY = 0;
  const STAR_COUNT = 260;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.6 + 0.3,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawStars(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle nebula glow patches
    const glow1 = ctx.createRadialGradient(
      canvas.width * 0.2, canvas.height * 0.3, 0,
      canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.35
    );
    glow1.addColorStop(0, 'rgba(79, 142, 255, 0.015)');
    glow1.addColorStop(1, 'transparent');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const glow2 = ctx.createRadialGradient(
      canvas.width * 0.8, canvas.height * 0.7, 0,
      canvas.width * 0.8, canvas.height * 0.7, canvas.width * 0.3
    );
    glow2.addColorStop(0, 'rgba(139, 92, 246, 0.012)');
    glow2.addColorStop(1, 'transparent');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each star
    stars.forEach((star) => {
      // Twinkling
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
      const currentOpacity = star.opacity * (0.6 + 0.4 * twinkle);

      // Subtle parallax based on mouse position
      const parallaxX = (mouseX - canvas.width / 2) * star.speed * 0.02;
      const parallaxY = (mouseY - canvas.height / 2) * star.speed * 0.02;

      const x = star.x + parallaxX;
      const y = star.y + parallaxY;

      // Star glow
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, star.radius * 3);
      gradient.addColorStop(0, `rgba(180, 200, 255, ${currentOpacity})`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.arc(x, y, star.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Star core
      ctx.beginPath();
      ctx.fillStyle = `rgba(220, 230, 255, ${currentOpacity})`;
      ctx.arc(x, y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Slow drift
    stars.forEach((star) => {
      star.y -= star.speed * 0.3;
      if (star.y < -10) {
        star.y = canvas.height + 10;
        star.x = Math.random() * canvas.width;
      }
    });

    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    createStars();
  });

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  resizeCanvas();
  createStars();
  requestAnimationFrame(drawStars);

  // ---------- Scroll Reveal ----------
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ---------- Mobile Navigation ----------
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ---------- Navbar Background on Scroll ----------
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 80) {
      navbar.style.background = 'rgba(6, 6, 15, 0.9)';
    } else {
      navbar.style.background = 'rgba(6, 6, 15, 0.7)';
    }
    lastScroll = currentScroll;
  });

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

})();
