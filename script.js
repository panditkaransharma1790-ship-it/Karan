/**
 * KARAN SEHRA - PORTFOLIO INTERACTIVE SCRIPT
 * Features:
 *  - High-Performance Canvas Live Wallpaper Engine (Mesh, Matrix, Orbs)
 *  - Red, White & Green Color Scheme with Interactive Mouse Reactivity
 *  - Typewriter Text Engine
 *  - Navbar Scroll Spy & Mobile Navigation
 *  - Contact Form Dispatcher & Print CV
 *  - Toast Notifications
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. LIVE WALLPAPER CANVAS ENGINE
     ========================================================== */
  const canvas = document.getElementById('live-wallpaper');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function setDimensions() {
    width = canvas.width = window.innerWidth || document.documentElement.clientWidth || 1200;
    height = canvas.height = window.innerHeight || document.documentElement.clientHeight || 800;
  }

  let width = 0;
  let height = 0;
  setDimensions();

  let currentMode = 'constellation'; // 'constellation' | 'matrix' | 'particles'
  let isPaused = false;
  let animationFrameId = null;

  // Mouse & Touch Tracking for Interactive Reactions
  const mouse = {
    x: null,
    y: null,
    radius: 180
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Mobile Touch Support for Live Wallpaper
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function handleResize() {
    setDimensions();
    initWallpaper();
  }
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  // Color Palette: Vibrant Red, White, Emerald Green
  const THEME_COLORS = [
    { r: 255, g: 51, b: 85, hex: '#ff3355' },    // Neon Red
    { r: 255, g: 255, b: 255, hex: '#ffffff' }, // Pure White
    { r: 0, g: 245, b: 155, hex: '#00f59b' }     // Emerald Green
  ];

  /* --- MODE 1: CYBER CONSTELLATION MESH --- */
  let nodes = [];
  const NODE_COUNT = Math.max(55, Math.min(Math.floor((width * height) / 9000), 120));

  class Node {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.1;
      this.vy = (Math.random() - 0.5) * 1.1;
      this.radius = Math.random() * 3 + 2.4;
      this.colorObj = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
      this.alpha = Math.random() * 0.35 + 0.65;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity - Attraction and excitation
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
        }
      }
    }

    draw() {
      // Outer glow aura
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.colorObj.r}, ${this.colorObj.g}, ${this.colorObj.b}, 0.22)`;
      ctx.fill();

      // Core particle
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.colorObj.r}, ${this.colorObj.g}, ${this.colorObj.b}, ${this.alpha})`;
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.colorObj.hex;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initConstellation() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push(new Node());
    }
  }

  function renderConstellation() {
    // Render deep dark gradient background directly on canvas
    const bgGrad = ctx.createRadialGradient(
      width / 2, height / 2, 50,
      width / 2, height / 2, Math.max(width, height) * 0.75
    );
    bgGrad.addColorStop(0, '#0c1324');
    bgGrad.addColorStop(1, '#05070c');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw connecting lines between nodes
    const maxDist = 155;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * 0.48;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);

          // Glowing gradient connecting line
          const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          grad.addColorStop(0, `rgba(${nodes[i].colorObj.r}, ${nodes[i].colorObj.g}, ${nodes[i].colorObj.b}, ${lineAlpha})`);
          grad.addColorStop(1, `rgba(${nodes[j].colorObj.r}, ${nodes[j].colorObj.g}, ${nodes[j].colorObj.b}, ${lineAlpha})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      }

      // Draw connection to mouse cursor
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = nodes[i].x - mouse.x;
        const mdy = nodes[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          const mAlpha = (1 - mdist / mouse.radius) * 0.85;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 245, 155, ${mAlpha})`;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }
      }
    }

    nodes.forEach((node) => {
      node.update();
      node.draw();
    });
  }

  /* --- MODE 2: MATRIX CYBER STREAM --- */
  const matrixChars = '01ICTSMHARDWARESUPPORTNETWORKINGRAMCPUBIOS2026KARAN';
  const fontSize = 15;
  let columns = Math.floor(width / fontSize);
  let drops = [];

  function initMatrix() {
    columns = Math.floor(width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50);
    }
    ctx.fillStyle = '#05070c';
    ctx.fillRect(0, 0, width, height);
  }

  function renderMatrix() {
    ctx.fillStyle = 'rgba(7, 10, 18, 0.14)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px 'Fira Code', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      const randColor = Math.random();
      if (randColor < 0.15) {
        ctx.fillStyle = '#ff3355'; // Red
      } else if (randColor < 0.3) {
        ctx.fillStyle = '#ffffff'; // White lead
      } else {
        ctx.fillStyle = '#00f59b'; // Green
      }

      ctx.fillText(char, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  /* --- MODE 3: NEON TECH ORBS --- */
  let orbs = [];
  const ORB_COUNT = 35;

  class Orb {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 60 + 20;
      this.color = THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseVal = Math.random() * Math.PI;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulseVal += this.pulseSpeed;

      if (this.x < -this.radius) this.x = width + this.radius;
      if (this.x > width + this.radius) this.x = -this.radius;
      if (this.y < -this.radius) this.y = height + this.radius;
      if (this.y > height + this.radius) this.y = -this.radius;
    }

    draw() {
      const currentRadius = this.radius + Math.sin(this.pulseVal) * 15;
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, Math.max(1, currentRadius)
      );
      gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.4)`);
      gradient.addColorStop(0.45, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.15)`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(1, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  function initOrbs() {
    orbs = [];
    for (let i = 0; i < ORB_COUNT; i++) {
      orbs.push(new Orb());
    }
  }

  function renderOrbs() {
    ctx.fillStyle = '#05070c';
    ctx.fillRect(0, 0, width, height);
    orbs.forEach((orb) => {
      orb.update();
      orb.draw();
    });
  }

  /* --- Wallpaper Loop Controller --- */
  function initWallpaper() {
    if (currentMode === 'constellation') {
      initConstellation();
    } else if (currentMode === 'matrix') {
      initMatrix();
    } else if (currentMode === 'particles') {
      initOrbs();
    }
  }

  function animateWallpaper() {
    if (!isPaused) {
      if (currentMode === 'constellation') {
        renderConstellation();
      } else if (currentMode === 'matrix') {
        renderMatrix();
      } else if (currentMode === 'particles') {
        renderOrbs();
      }
    }
    animationFrameId = requestAnimationFrame(animateWallpaper);
  }

  initWallpaper();
  animateWallpaper();

  // Mode Switcher Buttons
  const modeButtons = document.querySelectorAll('.wp-mode-btn');
  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      ctx.clearRect(0, 0, width, height);
      initWallpaper();
      showToast(`Live Wallpaper: ${currentMode.toUpperCase()}`);
    });
  });

  // Pause / Resume Button
  const pauseBtn = document.getElementById('wp-pause-btn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isPaused = !isPaused;
      pauseBtn.innerHTML = isPaused ? '&#9658;' : '&#10074;&#10074;';
      showToast(isPaused ? 'Live Wallpaper Paused' : 'Live Wallpaper Resumed');
    });
  }


  /* ==========================================================
     2. DYNAMIC TYPEWRITER EFFECT
     ========================================================== */
  const typewriterElement = document.getElementById('typewriter');
  const wordsToType = [
    'Cyber Security Mentor & Technology Guide',
    'IT Student & ICTSM Specialist',
    'HTML, C, C++ & Ruby Programmer',
    'Computer Hardware & Troubleshooting Specialist',
    'Digital Technology & Systems Explorer',
    'Aspiring IT Professional & Problem Solver'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;

  function typeEffect() {
    const currentWord = wordsToType[wordIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 40;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 85;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingDelay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % wordsToType.length;
      typingDelay = 400;
    }

    setTimeout(typeEffect, typingDelay);
  }

  typeEffect();


  /* ==========================================================
     3. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTING
     ========================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (scrollPos > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile Menu Drawer
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileToggle.classList.toggle('open');
      navLinksContainer.classList.toggle('open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navLinksContainer.classList.remove('open');
      });
    });

    // Close when tapping outside
    document.addEventListener('click', (e) => {
      if (navLinksContainer.classList.contains('open') &&
          !navLinksContainer.contains(e.target) &&
          !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('open');
        navLinksContainer.classList.remove('open');
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinksContainer.classList.contains('open')) {
        mobileToggle.classList.remove('open');
        navLinksContainer.classList.remove('open');
      }
    });
  }


  /* ==========================================================
     4. BACK TO TOP BUTTON
     ========================================================== */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  /* ==========================================================
     6. TOAST NOTIFICATION UTILITY
     ========================================================== */
  const toast = document.getElementById('toast');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

});
