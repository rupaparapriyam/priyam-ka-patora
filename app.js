/**
 * Priyam Rupapara — Portfolio Engine
 * Complete System Architecture:
 * 1. Theme Engine & Top Scroll Progress
 * 2. Expressive Typography (SVGator #4 - Per-letter kinetic scramble)
 * 3. Collaborative Ghost Cursors (SVGator #5 - Real-time visitor presence)
 * 4. Project Filter & Deep Modal Engine (All 10 Projects with rich diagrams & patora data)
 * 5. High-Fidelity 3D Drone Avionics Stage (Inspired by drone.riotters.com)
 * 6. 360° Scroll-Driven SURGE Bottle Showcase (80 WebP Frames)
 * 7. Command Palette (⌘K / Ctrl+K) Fast Launcher
 * 8. Fun Zone: Idea Swipe Rater, Diagnostic Quiz, Chaos Dial
 * 9. Live Tools: ASTM E1394 Parser & D2C Margin/RTO Calculator
 * 10. Priyam AI Clone (Persona-Trained Interactive Bot)
 * 11. Clipboard & Toast System
 */

// Singleton Web Audio Context (Prevents audio graph leaks and browser thread memory bloat)
let _sharedAudioContext = null;
function getSharedAudioContext() {
  if (!_sharedAudioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) _sharedAudioContext = new AudioCtx();
  }
  if (_sharedAudioContext && _sharedAudioContext.state === 'suspended') {
    _sharedAudioContext.resume().catch(() => {});
  }
  return _sharedAudioContext;
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initScrollProgress();
  initNavSpy();
  initMobileMenu();
  initExpressiveTypography();
  initHeroInteractiveCanvas();
  initProjectFilters();
  initProjectModal();
  initDroneAvionicsSimulation();
  initSurgeScrollDrivenBottle();
  initCommandPalette();
  initFunZone();
  initPriyamAiClone();
  initClipboard();

  // Global Tab Visibility Performance Manager (0% CPU when tab is backgrounded)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (_sharedAudioContext && _sharedAudioContext.state === 'running') {
        _sharedAudioContext.suspend().catch(() => {});
      }
    } else {
      if (_sharedAudioContext && _sharedAudioContext.state === 'suspended') {
        _sharedAudioContext.resume().catch(() => {});
      }
    }
    window.updateGameAutoLifecycle?.();
  }, { passive: true });
});

/* ==========================================================================
   1. THEME ENGINE & SCROLL PROGRESS
   ========================================================================== */
function initThemeEngine() {
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('priyam-theme') || 'light';

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    const sunIcon  = btn?.querySelector('.sun-icon');
    const moonIcon = btn?.querySelector('.moon-icon');
    if (theme === 'dark') {
      sunIcon?.classList.add('hidden');
      moonIcon?.classList.remove('hidden');
    } else {
      sunIcon?.classList.remove('hidden');
      moonIcon?.classList.add('hidden');
    }
    localStorage.setItem('priyam-theme', theme);
  }

  apply(saved);

  btn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
    showToast(`Switched to ${next} theme`);
  });
}

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total > 0) {
          const pct = (window.scrollY / total) * 100;
          bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initNavSpy() {
  const header = document.getElementById('main-header');
  const links = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('section[id]'));
  let lastY = 0;
  let ticking = false;
  let sectionData = [];

  function updateSectionData() {
    sectionData = sections.map(s => ({
      id: s.id,
      top: s.offsetTop
    }));
  }
  updateSectionData();
  window.addEventListener('resize', updateSectionData, { passive: true });

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (header) {
          if (y > lastY && y > 240) {
            header.style.transform = 'translateY(-100%)';
          } else {
            header.style.transform = 'translateY(0)';
          }
        }
        lastY = y;

        const mid = y + window.innerHeight * 0.35;
        let current = '';
        for (let i = 0; i < sectionData.length; i++) {
          if (sectionData[i].top <= mid) current = sectionData[i].id;
        }

        links.forEach(l => {
          const href = l.getAttribute('href')?.replace('#', '');
          l.classList.toggle('active', href === current);
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const openIcon = btn?.querySelector('.menu-open-icon');
  const closeIcon = btn?.querySelector('.menu-close-icon');
  let open = false;

  btn?.addEventListener('click', () => {
    open = !open;
    drawer?.classList.toggle('hidden', !open);
    openIcon?.classList.toggle('hidden', open);
    closeIcon?.classList.toggle('hidden', !open);
    window.updateGameAutoLifecycle?.();
  });

  drawer?.querySelectorAll('.mobile-link, .mobile-cmd-btn, .mobile-chat-btn').forEach(item => {
    item.addEventListener('click', () => {
      open = false;
      drawer.classList.add('hidden');
      openIcon?.classList.remove('hidden');
      closeIcon?.classList.add('hidden');
      window.updateGameAutoLifecycle?.();
    });
  });
}

/* ==========================================================================
   2. EXPRESSIVE TYPOGRAPHY (HERO KINETIC SCRAMBLE)
   ========================================================================== */
function initExpressiveTypography() {
  const heading = document.getElementById('hero-kinetic-title');
  if (!heading) return;

  const LINES = ['I (Build)', 'Systems.', 'Not Dashboards.'];
  const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&§';

  heading.innerHTML = '';

  LINES.forEach((line) => {
    const lineWrapper = document.createElement('span');
    lineWrapper.className = 'kinetic-line';

    line.split('').forEach((char) => {
      const span = document.createElement('span');
      if (char === ' ') {
        span.className = 'char-letter char-space';
        span.innerHTML = '&nbsp;';
      } else {
        span.className = 'char-letter';
        span.textContent = char;
        span.setAttribute('data-char', char);
        span.addEventListener('mouseenter', () => scramble(span));
      }
      lineWrapper.appendChild(span);
    });

    heading.appendChild(lineWrapper);
  });

  const letters = heading.querySelectorAll('.char-letter:not(.char-space)');

  letters.forEach((letter, i) => {
    const delay = 150 + i * 30;
    const orig = letter.getAttribute('data-char');

    setTimeout(() => {
      let count = 0;
      const max = 5;
      const iv = setInterval(() => {
        letter.textContent = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
        count++;
        if (count >= max) {
          clearInterval(iv);
          letter.textContent = orig;
          letter.classList.add('is-in');
        }
      }, 45);
    }, delay);
  });

  function scramble(el, max = 5) {
    const orig = el.getAttribute('data-char');
    if (!orig) return;
    let count = 0;
    const iv = setInterval(() => {
      el.textContent = SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
      count++;
      if (count >= max) {
        clearInterval(iv);
        el.textContent = orig;
      }
    }, 40);
  }
}

/* ==========================================================================
   2b. HERO INTERACTIVE 3D CYBER HORIZON & VECTOR AVIONICS CORE
   ========================================================================== */
function initHeroInteractiveCanvas() {
  const canvas = document.getElementById('hero-interactive-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const heroSec = document.getElementById('hero');
  let width = heroSec ? heroSec.offsetWidth : window.innerWidth;
  let height = heroSec ? heroSec.offsetHeight : window.innerHeight;
  let dpr = window.devicePixelRatio || 1;

  const THEME_ACCENT = '#00F0FF';

  // 3D Flight Core State (Positioned centered & unobscured by card)
  const drone = {
    x: width * 0.48,
    y: height * 0.42,
    z: 0,
    targetX: width * 0.48,
    targetY: height * 0.42,
    pitch: 0.12,
    yaw: -0.18,
    roll: -0.05,
    targetPitch: 0.12,
    targetYaw: -0.18,
    targetRoll: -0.05,
    rollBoost: 0,
    scale: Math.min(1.35, Math.max(0.85, width / 1100)),
  };

  let time = 0;
  let mouse = {
    x: width * 0.48,
    y: height * 0.45,
    targetX: width * 0.48,
    targetY: height * 0.45,
    vx: 0,
    vy: 0,
    prevX: width * 0.48,
    prevY: height * 0.45,
    isHover: false
  };

  function resize() {
    if (!heroSec) return;
    width = heroSec.offsetWidth;
    height = heroSec.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (drone) {
      drone.scale = Math.min(1.4, Math.max(0.85, width / 1100));
    }
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Ambient 3D Interactive Neural Particle Constellation
  const ambientParticles = [];
  const PARTICLE_COLORS = ['#00F0FF', '#10B981', '#38BDF8', '#818CF8'];
  for (let i = 0; i < 48; i++) {
    ambientParticles.push({
      x: (Math.random() - 0.5) * 1100,
      y: (Math.random() - 0.5) * 550,
      z: Math.random() * 450 + 50,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: 1.5 + Math.random() * 2,
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length]
    });
  }

  let exhaustParticles = [];
  let leftWingTrail = [];
  let rightWingTrail = [];
  let shockwaveRings = [];
  let animId = null;
  let heroRect = null;

  function updateHeroBounds() {
    if (heroSec) heroRect = heroSec.getBoundingClientRect();
  }
  updateHeroBounds();
  window.addEventListener('resize', updateHeroBounds, { passive: true });
  window.addEventListener('scroll', updateHeroBounds, { passive: true });
  heroSec?.addEventListener('mouseenter', updateHeroBounds, { passive: true });

  heroSec?.addEventListener('mousemove', (e) => {
    if (!heroRect) updateHeroBounds();
    mouse.targetX = e.clientX - (heroRect ? heroRect.left : 0);
    mouse.targetY = e.clientY - (heroRect ? heroRect.top : 0);
    mouse.isHover = true;
  }, { passive: true });

  heroSec?.addEventListener('mouseleave', () => {
    mouse.isHover = false;
    mouse.targetX = width * 0.48;
    mouse.targetY = height * 0.42;
  }, { passive: true });

  // Interactive Kinetic Pulse & Harmonic Audio Feedback on Click
  window.triggerHeroPulse = () => {
    drone.rollBoost += Math.PI * 2;

    shockwaveRings.push({
      x: drone.x,
      y: drone.y,
      r: 20,
      maxR: 480,
      speed: 16,
      alpha: 1.0,
      color: '#00F0FF',
    });

    try {
      const actx = getSharedAudioContext();
      if (actx) {
        const now = actx.currentTime;
        [587.33, 739.99, 880].forEach((freq, idx) => {
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          osc.connect(gain);
          gain.connect(actx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.06, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.28);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.28);
        });
      }
    } catch (e) {}
  };

  heroSec?.addEventListener('click', (e) => {
    if (e.target.closest('a, button, input, .zuck-simple-card, .cmd-item')) return;
    window.triggerHeroPulse();
  });

  // 3D Geometry: Multi-Vector Stealth Cyber Core
  const RAW_VERTICES = [
    [0, -4, 85],     // 0: Nose tip
    [0, -18, 25],    // 1: Cockpit canopy ridge
    [0, 8, 20],      // 2: Belly keel center
    [-115, 6, -35],  // 3: Left Wingtip
    [115, 6, -35],   // 4: Right Wingtip
    [-38, 2, -65],   // 5: Left Wing Inboard / Trailing Edge
    [38, 2, -65],    // 6: Right Wing Inboard / Trailing Edge
    [0, -12, -75],   // 7: Tail Exhaust Engine
    [-22, -34, -60], // 8: Left Vertical Stabilizer Fin
    [22, -34, -60],  // 9: Right Vertical Stabilizer Fin
    [-68, -4, -15],  // 10: Left Leading Edge Chine
    [68, -4, -15]    // 11: Right Leading Edge Chine
  ];

  const WIRE_EDGES = [
    [0, 1], [1, 7], [0, 2], [2, 7],
    [0, 10], [10, 3], [3, 5], [5, 7],
    [0, 11], [11, 4], [4, 6], [6, 7],
    [1, 10], [1, 11],
    [1, 8], [8, 5], [5, 8],
    [1, 9], [9, 6], [6, 9],
    [8, 7], [9, 7],
    [2, 3], [2, 4], [2, 5], [2, 6]
  ];

  const FACES = [
    [0, 1, 10], [0, 1, 11],
    [1, 10, 3], [1, 11, 4],
    [1, 3, 5], [1, 4, 6],
    [1, 5, 8], [1, 6, 9],
    [1, 8, 7], [1, 9, 7],
    [0, 2, 10], [0, 2, 11],
    [2, 10, 3], [2, 11, 4],
    [2, 3, 5], [2, 4, 6],
    [2, 5, 7], [2, 6, 7]
  ];

  function rotate3D(v, pitch, yaw, roll) {
    let [x, y, z] = v;
    let cosY = Math.cos(yaw), sinY = Math.sin(yaw);
    let x1 = x * cosY + z * sinY;
    let z1 = -x * sinY + z * cosY;
    let y1 = y;

    let cosP = Math.cos(pitch), sinP = Math.sin(pitch);
    let y2 = y1 * cosP - z1 * sinP;
    let z2 = y1 * sinP + z1 * cosP;
    let x2 = x1;

    let cosR = Math.cos(roll), sinR = Math.sin(roll);
    let x3 = x2 * cosR - y2 * sinR;
    let y3 = x2 * sinR + y2 * cosR;
    let z3 = z2;

    return [x3, y3, z3];
  }

  function project3D(v, centerX, centerY, scale) {
    const fov = 420;
    const distance = fov + v[2];
    const factor = distance > 0 ? (fov / distance) * scale : scale;
    return {
      x: centerX + v[0] * factor,
      y: centerY + v[1] * factor,
      z: v[2],
      factor
    };
  }

  function drawGyroRings(cx, cy, curScale, isDark, accentColor) {
    const rings = [
      { r: 135 * curScale, rotX: time * 0.45, rotY: time * 0.35, rotZ: 0, color: accentColor, width: 1.4, alpha: 0.45 },
      { r: 165 * curScale, rotX: Math.PI * 0.5, rotY: time * 0.25, rotZ: time * 0.15, color: isDark ? '#38BDF8' : '#0F766E', width: 1.2, alpha: 0.35 },
      { r: 195 * curScale, rotX: time * 0.2, rotY: Math.PI * 0.35, rotZ: time * 0.4, color: isDark ? '#818CF8' : '#3B82F6', width: 1.0, alpha: 0.25 },
    ];

    rings.forEach(ring => {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = ring.width;
      ctx.strokeStyle = ring.color;
      ctx.globalAlpha = isDark ? ring.alpha : ring.alpha * 0.7;

      const segments = 36;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const p = [Math.cos(theta) * ring.r, Math.sin(theta) * ring.r, 0];
        const rot = rotate3D(p, ring.rotX + drone.pitch * 0.5, ring.rotY + drone.yaw * 0.5, ring.rotZ + drone.roll * 0.5);
        const scr = project3D(rot, cx, cy, 1.0);
        if (i === 0) ctx.moveTo(scr.x, scr.y);
        else ctx.lineTo(scr.x, scr.y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });
  }

  function drawCyberHorizonGrid(isDark) {
    const horizonY = height * 0.55;
    const gridDepth = 600;
    const gridRows = 14;
    const gridCols = 24;
    const gridSpacingX = width / gridCols;

    ctx.save();
    ctx.lineWidth = 1;

    for (let r = 0; r < gridRows; r++) {
      const zProgress = (r + 1) / gridRows;
      const z = zProgress * gridDepth;
      const fov = 420;
      const scale = fov / (fov + z);
      const rowY = horizonY + (height - horizonY) * Math.pow(zProgress, 1.4);
      const alpha = (1 - zProgress) * (isDark ? 0.32 : 0.16);

      ctx.strokeStyle = isDark ? `rgba(0, 240, 255, ${alpha})` : `rgba(15, 118, 110, ${alpha})`;
      ctx.beginPath();

      for (let c = 0; c <= gridCols; c++) {
        const xOffset = (c - gridCols / 2) * (gridSpacingX * 1.8);
        const screenX = width * 0.5 + xOffset * scale;
        const wave = Math.sin(c * 0.45 + time * 1.2) * Math.cos(r * 0.4 + time * 0.8) * (18 * (1 - zProgress));
        const finalY = rowY + wave;

        if (c === 0) ctx.moveTo(screenX, finalY);
        else ctx.lineTo(screenX, finalY);
      }
      ctx.stroke();
    }

    for (let c = 0; c <= gridCols; c++) {
      const alpha = isDark ? 0.20 : 0.10;
      ctx.strokeStyle = isDark ? `rgba(0, 240, 255, ${alpha})` : `rgba(15, 118, 110, ${alpha})`;
      ctx.beginPath();

      for (let r = 0; r < gridRows; r++) {
        const zProgress = (r + 1) / gridRows;
        const z = zProgress * gridDepth;
        const fov = 420;
        const scale = fov / (fov + z);
        const rowY = horizonY + (height - horizonY) * Math.pow(zProgress, 1.4);
        const xOffset = (c - gridCols / 2) * (gridSpacingX * 1.8);
        const screenX = width * 0.5 + xOffset * scale;
        const wave = Math.sin(c * 0.45 + time * 1.2) * Math.cos(r * 0.4 + time * 0.8) * (18 * (1 - zProgress));
        const finalY = rowY + wave;

        if (r === 0) ctx.moveTo(screenX, finalY);
        else ctx.lineTo(screenX, finalY);
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  function render() {
    time += 0.022;
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // 1. Draw 3D Cyber Horizon Topographic Grid
    drawCyberHorizonGrid(isDark);

    // 2. Render Interactive Neural Particle Web with Proximity Filaments
    const projectedParticles = [];
    ctx.save();
    ambientParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (Math.abs(p.x) > 600) p.vx *= -1;
      if (Math.abs(p.y) > 300) p.vy *= -1;

      const fov = 380;
      const scale = fov / (fov + p.z);
      let screenX = width * 0.5 + p.x * scale;
      let screenY = height * 0.45 + p.y * scale;

      const mDist = Math.hypot(screenX - mouse.x, screenY - mouse.y);
      if (mDist < 160) {
        const pull = (1 - mDist / 160) * 22;
        screenX += ((mouse.x - screenX) / mDist) * pull;
        screenY += ((mouse.y - screenY) / mDist) * pull;
      }

      projectedParticles.push({ x: screenX, y: screenY, color: p.color, size: p.size * scale });

      ctx.fillStyle = p.color;
      ctx.globalAlpha = (1 - p.z / 600) * (isDark ? 0.75 : 0.45);
      ctx.beginPath();
      ctx.arc(screenX, screenY, p.size * scale, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.lineWidth = 0.8;
    for (let i = 0; i < projectedParticles.length; i++) {
      for (let j = i + 1; j < projectedParticles.length; j++) {
        const p1 = projectedParticles[i];
        const p2 = projectedParticles[j];
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (dist < 90) {
          const alpha = (1 - dist / 90) * (isDark ? 0.25 : 0.12);
          ctx.strokeStyle = p1.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;

    const deltaX = (mouse.x - width * 0.5) / width;
    const deltaY = (mouse.y - height * 0.45) / height;

    drone.targetX = width * 0.48 + (mouse.x - width * 0.5) * 0.2 + Math.sin(time * 0.8) * 25;
    drone.targetY = height * 0.42 + (mouse.y - height * 0.45) * 0.2 + Math.cos(time * 1.1) * 16;
    drone.targetYaw = deltaX * 0.75;
    drone.targetPitch = deltaY * 0.55 + Math.sin(time * 1.3) * 0.05;
    drone.targetRoll = -deltaX * 1.1 + Math.cos(time * 1.0) * 0.06;

    drone.x += (drone.targetX - drone.x) * 0.08;
    drone.y += (drone.targetY - drone.y) * 0.08;
    drone.pitch += (drone.targetPitch - drone.pitch) * 0.08;
    drone.yaw += (drone.targetYaw - drone.yaw) * 0.08;

    if (drone.rollBoost > 0) {
      const step = Math.min(drone.rollBoost, 0.22);
      drone.roll += step;
      drone.rollBoost -= step;
    } else {
      drone.roll += (drone.targetRoll - drone.roll) * 0.08;
    }

    const curScale = drone.scale * (width < 600 ? 0.72 : 1.0);

    // 4. Draw Concentric 3D Gyroscope Gimbal Rings
    drawGyroRings(drone.x, drone.y, curScale, isDark, THEME_ACCENT);

    // 5. Draw Electric Shockwave Rings
    for (let i = shockwaveRings.length - 1; i >= 0; i--) {
      const ring = shockwaveRings[i];
      ring.r += ring.speed;
      ring.alpha = 1 - ring.r / ring.maxR;

      ctx.save();
      ctx.strokeStyle = ring.color || '#00F0FF';
      ctx.globalAlpha = ring.alpha * 0.85;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(ring.x, ring.y, ring.r * 1.45, ring.r * 0.8, drone.roll, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (ring.r >= ring.maxR) shockwaveRings.splice(i, 1);
    }

    // 6. Transform & Render 3D Vector Core
    const transformed = RAW_VERTICES.map(v => rotate3D(v, drone.pitch, drone.yaw, drone.roll));
    const projected = transformed.map(v => project3D(v, drone.x, drone.y, curScale));

    // Afterburner Ion Exhaust
    const exhaustScreen = projected[7];
    if (exhaustScreen) {
      for (let k = 0; k < 2; k++) {
        exhaustParticles.push({
          x: exhaustScreen.x + (Math.random() - 0.5) * 6,
          y: exhaustScreen.y + (Math.random() - 0.5) * 6,
          vx: Math.sin(-drone.yaw) * 4.5 + (Math.random() - 0.5) * 1.5,
          vy: Math.cos(drone.pitch) * 3.5 + Math.random() * 2,
          life: 20,
          maxLife: 20,
          size: 4 + Math.random() * 2.5,
          color: '#00F0FF',
        });
      }
    }

    for (let i = exhaustParticles.length - 1; i >= 0; i--) {
      const p = exhaustParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = (p.life / p.maxLife) * (isDark ? 0.85 : 0.65);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.life <= 0) exhaustParticles.splice(i, 1);
    }
    if (exhaustParticles.length > 25) exhaustParticles = exhaustParticles.slice(-25);

    // Wingtip Condensation Ribbon Trails
    const leftTip = projected[3];
    const rightTip = projected[4];
    if (leftTip && rightTip) {
      leftWingTrail.push({ x: leftTip.x, y: leftTip.y });
      rightWingTrail.push({ x: rightTip.x, y: rightTip.y });
      if (leftWingTrail.length > 24) leftWingTrail.shift();
      if (rightWingTrail.length > 24) rightWingTrail.shift();

      function drawWingRibbon(trail) {
        if (trail.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
        ctx.strokeStyle = '#00F0FF';
        ctx.globalAlpha = isDark ? 0.55 : 0.35;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.restore();
      }
      drawWingRibbon(leftWingTrail);
      drawWingRibbon(rightWingTrail);
    }

    // 7. Render 3D Vector Core Facets
    ctx.save();
    FACES.forEach(face => {
      const [i1, i2, i3] = face;
      const p1 = projected[i1];
      const p2 = projected[i2];
      const p3 = projected[i3];

      const v1 = transformed[i1];
      const v2 = transformed[i2];
      const v3 = transformed[i3];
      const normZ = (v2[0] - v1[0]) * (v3[1] - v1[1]) - (v2[1] - v1[1]) * (v3[0] - v1[0]);
      const brightness = Math.max(0.08, Math.min(0.85, 0.35 + (normZ / 6000)));

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();

      ctx.fillStyle = isDark
        ? `rgba(0, 240, 255, ${brightness * 0.16})`
        : `rgba(15, 118, 110, ${brightness * 0.10})`;
      ctx.fill();
    });
    ctx.restore();

    // 8. Render 3D Wireframe Edges
    ctx.save();
    WIRE_EDGES.forEach(edge => {
      const [i1, i2] = edge;
      const p1 = projected[i1];
      const p2 = projected[i2];

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      ctx.strokeStyle = isDark
        ? (i1 === 0 || i2 === 0 ? '#00F0FF' : 'rgba(0, 240, 255, 0.65)')
        : (i1 === 0 || i2 === 0 ? '#0F766E' : 'rgba(30, 41, 59, 0.45)');
      ctx.lineWidth = (i1 === 0 || i2 === 0) ? 2.0 : 1.2;
      ctx.stroke();
    });
    ctx.restore();

    // 9. Subtle Aesthetic Frame Brackets (Zero Text Clutter)
    ctx.save();
    const hudX = drone.x;
    const hudY = drone.y;
    const boxW = 140 * curScale;
    const boxH = 90 * curScale;
    const bLen = 10;

    ctx.strokeStyle = isDark ? 'rgba(0, 240, 255, 0.22)' : 'rgba(30, 41, 59, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hudX - boxW, hudY - boxH + bLen); ctx.lineTo(hudX - boxW, hudY - boxH); ctx.lineTo(hudX - boxW + bLen, hudY - boxH);
    ctx.moveTo(hudX + boxW - bLen, hudY - boxH); ctx.lineTo(hudX + boxW, hudY - boxH); ctx.lineTo(hudX + boxW, hudY - boxH + bLen);
    ctx.moveTo(hudX - boxW, hudY + boxH - bLen); ctx.lineTo(hudX - boxW, hudY + boxH); ctx.lineTo(hudX - boxW + bLen, hudY + boxH);
    ctx.moveTo(hudX + boxW - bLen, hudY + boxH); ctx.lineTo(hudX + boxW, hudY + boxH); ctx.lineTo(hudX + boxW, hudY + boxH - bLen);
    ctx.stroke();
    ctx.restore();

    animId = requestAnimationFrame(render);
  }

  if (heroSec && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          if (animId) cancelAnimationFrame(animId);
          animId = null;
        } else {
          if (!animId) animId = requestAnimationFrame(render);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(heroSec);
  }

  animId = requestAnimationFrame(render);
}

/* ==========================================================================
   3. PROJECT FILTER & RICH MODAL ENGINE (ALL 10 PROJECTS)
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.pf-btn');
  const cards = document.querySelectorAll('.stamp-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });
}

const PROJECT_REGISTRY = {
  pathlab: {
    tag: '[01 · DIAGNOSTIC HEALTHCARE]',
    headline: 'PathLab Ops (Is)\nYour Lab\'s Missing\nOperational Brain.',
    statusPills: [
      { label: 'Working MVP Tested on Lab Bench', style: 'active' },
      { label: '51/51 Logic Tests Passing', style: 'active' },
      { label: 'Next.js 15 · Prisma (15 Models) · ASTM E1394', style: '' },
      { label: 'Design Partner: Vaibhav Laboratory', style: '' },
    ],
    flowNodes: [
      { label: 'Haematology /\nBiochem Analyzer', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'ASTM E1394\nSerial Stream', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'PathLab Ingestion\n& Calc Engine', type: 'highlight' },
      { label: '→', type: 'arrow' },
      { label: 'Instant Draft Report\n(3 Seconds)', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Pathologist 1-Click\nSign-Off Gate', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'WhatsApp Patient\nRecall Engine', type: 'highlight' },
    ],
    stats: [
      { val: '15', label: 'Prisma Models in Schema' },
      { val: '85%', label: 'Of Lab Errors are Administrative' },
      { val: '51/51', label: 'Unit Logic Tests Passing' },
      { val: '₹40k', label: 'WTP Signal (Vaibhav Lab)' },
    ],
    beforeAfter: {
      before: { label: 'Before PathLab (Status Quo in India)', text: 'Lab technician manually writes numbers from analyzer thermal printout → types 30+ values into a pirated Word template → manual calculation of NLR/eGFR/Friedewald LDL → 3.7% transcription error rate → manual filing.' },
      after:  { label: 'After PathLab (Automated Ingestion)', text: 'ASTM serial stream intercepted in real time → 22 mathematical derivations computed instantly → flags highlighted against age/sex ranges → draft report ready in 3 seconds → WhatsApp delivery & automated diabetic recall.' },
    },
    bodyText: 'Born on the ground inside my family\'s diagnostic centre (Vaibhav Laboratory). In India, ~85% of total diagnostic error sits in pre- and post-analytical manual data entry. Rather than building speculative "diagnostic AI" that violates CDSCO SaMD regulations, PathLab automates the administrative and compliance layer cleanly.',
    honest: 'Market Reality: Total Indian LIS TAM is ~₹150–300 crore/year growing at ~4%. Incumbents like PathoOne compete on cheap perpetual licences. PathLab\'s real wedge is giving the LIS software at an affordable price while monetizing on the automated patient recall engine at 15–20% of recovered revenue.',
    timeline: [
      { date: 'Q1 2026', event: 'v0 Architecture & Serial Parser', detail: 'Ingested raw ASTM E1394 streams from CBC machines on family lab bench. Built calculation engine for 22 derived tests.' },
      { date: 'Aug 2026', event: 'Monorepo & 15 Prisma Models', detail: 'Migrated to Next.js 15, Prisma ORM, patient grouping by phone, and NABL QC log tables.' },
      { date: 'Next Step', event: '6 External Lab Interviews', detail: 'Testing WTP with 6 independent labs outside family circle before scaling code.' },
    ],
    tech: ['Next.js 15', 'Prisma ORM', 'SQLite / Postgres', 'ASTM E1394-97', 'Serial Bridge Agent', 'ABDM Integration', 'NABL QC Logs', 'Tailwind 4'],
  },

  ecom: {
    tag: '[02 · INDIAN D2C SAAS]',
    headline: 'Ecommerce Hub (Is)\nThe D2C Margin\nTruth Layer.',
    statusPills: [
      { label: 'Pre-Seed / MVP Stage · Actively Raising', style: 'amber' },
      { label: 'Solving 60%+ COD & 28% RTO', style: '' },
      { label: 'Shopify · Razorpay · Shiprocket · Meta Ads', style: '' },
    ],
    barChart: [
      { label: 'Gross Orders Placed', pct: 100, color: '', val: '100%' },
      { label: 'Cash on Delivery (COD)', pct: 64, color: 'amber', val: '~64%' },
      { label: 'Successfully Delivered', pct: 72, color: '', val: '~72%' },
      { label: 'Return to Origin (RTO)', pct: 28, color: 'red', val: '25-28%' },
      { label: 'True Profitable Orders', pct: 51, color: 'accent', val: '~51%' },
    ],
    flowNodes: [
      { label: 'Meta Ad\nSpend (CAC)', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Shopify Order\nPlaced', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Shiprocket\nDispatch', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: '28% COD RTO\nRefused at Door', type: 'highlight' },
      { label: '→', type: 'arrow' },
      { label: 'Reverse Freight\n& Hidden Loss', type: 'highlight' },
      { label: '→', type: 'arrow' },
      { label: 'Audience\nSuppression', type: 'node' },
    ],
    stats: [
      { val: '18', label: 'Pitch Deck Slides Ready' },
      { val: 'Pre-Seed', label: 'Active Round (Targeting Top Tier Valuation)' },
      { val: '0', label: 'Global Tools with India Connectors' },
      { val: '15', label: 'Founder Validation Calls Planned' },
    ],
    bodyText: 'Lived firsthand while running SURGE. Global tools like Triple Whale ($124–$375/mo) and Polar Analytics assume prepaid credit cards and reliable couriers. In India, 60%+ of orders are COD, 25-28% bounce as RTO, and reverse shipping destroys margins. Meta reports a 3.5× ROAS, but actual cash landing in the bank is negative.',
    honest: 'Competitive Reality: SeerFlow already operates in India at $25–$180/mo. Ecommerce Hub is an execution and distribution bet, focusing on the un-taken join: campaign/creative attribution to delivery outcome, and suppressing serial-RTO customers on WhatsApp campaigns.',
    timeline: [
      { date: 'Genesis', event: 'SURGE D2C Experience', detail: 'Felt the chaos of juggling GA4, Meta, Razorpay, and Shiprocket dashboards on Sundays.' },
      { date: 'Aug 2026', event: '18-Slide Deck & Global Report', detail: 'Completed competitive teardowns of 12+ international tools and drafted investor outreach.' },
      { date: 'Active Gate', event: '15 Founder Validation Interviews', detail: 'Executing scored Mom-Test interviews with Green/Amber/Red kill criteria.' },
    ],
    tech: ['Next.js Scaffold', 'Prisma', 'Shopify Admin API', 'Razorpay Webhooks', 'Shiprocket Logistics API', 'Meta Marketing API', 'Google Ads API'],
  },

  defence: {
    tag: '[03 · DEFENCE & HARDWARE]',
    headline: 'Autonomous Defence (In)\nEdge Zero-Tolerance\nEnvironments.',
    statusPills: [
      { label: 'Avionics Simulation & Telemetry', style: 'active' },
      { label: 'MAVLink Telemetry Protocol', style: '' },
      { label: 'Radar C2 Simulation', style: '' },
    ],
    flowNodes: [
      { label: 'Autopilot State\nMachine (SITL)', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'MAVLink Telemetry\nPacket Parsing', type: 'highlight' },
      { label: '→', type: 'arrow' },
      { label: 'Radar C2\nSpatial Scope', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Kalman Trajectory\nLead Prediction', type: 'highlight' },
      { label: '→', type: 'arrow' },
      { label: 'Autonomous Intercept\nSimulation Engine', type: 'node' },
    ],
    stats: [
      { val: 'Simulation', label: 'Current Track Status' },
      { val: 'Interactive', label: 'Radar C2 Simulator' },
      { val: 'Open-Source', label: 'SITL & MAVLink Protocols' },
      { val: '0 Hype', label: 'Zero Fake Claims' },
    ],
    bodyText: 'Software simulation and spatial telemetry exploration. Focuses on open-source autopilot software (PX4/MAVLink), real-time radar C2 interfaces, and deterministic target intercept mathematics.',
    honest: 'Pragmatic & Grounded: Indian defence procurement is relationship-heavy and credential-gated with multi-year sales cycles. This track focuses strictly on open-source avionics software, telemetry algorithms, and interactive simulation — zero fake military contracts or inflated claims.',
    tech: ['MAVLink Protocol', 'PX4 Autopilot (SITL)', 'HTML5 Canvas', 'Python Telemetry Parsing', 'Kalman Lead Math'],
  },

  aichatbot: {
    tag: '[04 · UNSTARTED STARTUP CONCEPT]',
    headline: 'AI Chatbot Assistant\n(Enterprise Agent OS)\nUnstarted Idea.',
    statusPills: [
      { label: 'Unstarted Concept', style: 'amber' },
      { label: 'Vault Strategy Teardown', style: '' },
      { label: 'Pivoted to Narrow Verticals', style: 'active' },
    ],
    flowNodes: [
      { label: 'Horizontal Chatbot\n& Agent Builder Idea', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Deep Vault Teardown\n(OSWorld 20% & DLP)', type: 'highlight' },
      { label: '→', type: 'arrow' },
      { label: 'Commoditization Risk\n(ChatGPT / Claude Bundles)', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Smart Decision:\nNot Started Live', type: 'highlight' },
      { label: '→', type: 'arrow' },
      { label: 'Pivot Insight into\nPathLab & n8n Ops', type: 'highlight' },
    ],
    stats: [
      { val: '0 Lines', label: 'Unstarted Live Code' },
      { val: '280 Lines', label: 'Vault Strategy Research' },
      { val: '100% Honest', label: 'Idea Discipline' },
      { val: 'Narrow > Wide', label: 'Key Strategy Pivot' },
    ],
    bodyText: 'Documented in Priyam Ka Patora vault as Idea 01: a native 24/7 action-oriented AI assistant and business agent platform that handles booking, lead qualification, and customer inquiry loops across Web + WhatsApp, with extended concepts for private company-hosted AI and DLP.',
    honest: 'Zero code started — and intentionally so. Conducting deep teardowns showed that horizontal AI wrappers are heavily commoditized by foundational labs (OpenAI/Anthropic). Rather than burning months building a generic tool, the core agent insight was pivoted directly into bounded real-world verticals: PathLab Ops and deterministic n8n lab automation.',
    tech: ['Strategy Teardown', 'Agent Architecture', 'Enterprise DLP Research', 'Private AI Self-Hosting Analysis', 'RAG & Vector Retrieval'],
  },

  surge: {
    tag: '[05 · D2C BRAND CASE STUDY]',
    headline: 'SURGE (Was)\nFull Hair Styling\n& Grooming Line.',
    statusPills: [
      { label: 'Stage 1: Complete Hair Styling Line', style: 'active' },
      { label: 'Personal Sampling & Chemistry R&D', style: 'active' },
      { label: 'Stage 2: Advanced Skincare Roadmap', style: '' },
      { label: 'Paused for Capital Discipline', style: 'amber' },
    ],
    flowNodes: [
      { label: 'Stage 1: Full Hair Styling Line\n(Powder, Clay, Spray, Cream)', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Cosmetic Chemist R&D\n& Personal Sampling', type: 'highlight' },
      { label: '→', type: 'arrow' },
      { label: 'Factory Quoting &\nPackaging Evaluation', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: '5,000+ Unit MOQ/SKU\nInventory Debt Risk', type: 'highlight' },
      { label: '→', type: 'arrow' },
      { label: 'Stage 2 Roadmap\n(Advanced Skincare)', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Capital Discipline\nPause Decision', type: 'highlight' },
    ],
    timeline: [
      { date: 'Stage 1 Formulation', event: 'Full Hair Styling Line', detail: 'Formulated a comprehensive hair styling brand — Matte Volumizing Texture Powder (shown in 360° visualizer), alcohol-free matte clay, sea salt spray, curl cream, pomade, and styling mousse alongside cosmetic chemists.' },
      { date: 'Personal Sampling', event: 'Self-Testing & Sourcing', detail: 'Conducted rigorous personal sampling across all styling SKUs and evaluated custom packaging prototypes.' },
      { date: 'Stage 2 Roadmap', event: 'Advanced Active Skincare', detail: 'Architected Stage 2 product line for targeted men\'s active skincare (face serums, barrier repair).' },
      { date: 'MOQ Reality', event: 'Factory Minimums & Debt', detail: 'Faced 5,000+ unit MOQs per SKU across styling and skincare containers. Taking on unvalidated inventory debt was bad math.' },
      { date: 'The Pause', event: 'Capital Discipline', detail: 'Consciously paused physical production to preserve capital — directly fueling the creation of Ecommerce Hub.' },
    ],
    bodyText: 'SURGE was engineered as an entire modern men\'s hair styling and grooming line. Stage 1 included full product formulations — Matte Volumizing Texture Powder, alcohol-free matte styling clay, sea salt spray, curl cream, pomade, and styling mousse — formulated alongside a cosmetic chemist and sampled for personal use. Stage 2 was architected around active skincare tailored for Indian men.',
    honest: 'Navigating physical supply chains taught me the reality of factory MOQs, lead times, international freight, and working capital. Pausing before incurring catastrophic inventory debt across multiple styling SKUs was the smartest capital allocation move I made — and that lived D2C logistics pain directly inspired Ecommerce Hub.',
    tech: ['Full Hair Styling Line', '7 Active Styling Formulations', 'Cosmetic Chemistry R&D', 'Custom Bottle Sourcing', 'Factory MOQ Sizing', 'D2C Unit Economics'],
  },

  chatbot: {
    tag: '[06 · WORKFLOW AUTOMATION]',
    headline: 'n8n WhatsApp (Runs)\nLive at Vaibhav\nLaboratory.',
    statusPills: [
      { label: 'Live at Family Lab', style: 'active' },
      { label: 'n8n Workflows', style: '' },
      { label: 'WhatsApp Cloud API', style: '' },
    ],
    flowNodes: [
      { label: 'LIS Report Signed\nby Pathologist', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'n8n Webhook\nTrigger Ingestion', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Render Lab PDF\n& Attach QR Hash', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'WhatsApp Cloud API\nDirect Dispatch', type: 'highlight' },
      { label: '→', type: 'arrow' },
      { label: 'Patient Receives PDF\n(<1s Latency)', type: 'highlight' },
    ],
    bodyText: 'Not an unpredictable AI chatbot — this is deterministic, rock-solid n8n workflow automation running live for Vaibhav Laboratory. It executes three high-impact operational loops: instant PDF lab report delivery via WhatsApp as soon as reports are signed, appointment booking confirmations, and scheduled 90-day diabetic (HbA1c) and thyroid recall campaigns.',
    honest: 'Patients don\'t want conversational AI slop when waiting for critical blood results. Deterministic n8n workflows with sub-second delivery latency and zero maintenance overhead deliver 100× more value than a complex LLM bot.',
    stats: [
      { val: '<1s', label: 'Report Dispatch Latency' },
      { val: '30%', label: 'Diabetic Recall Re-engagement' },
      { val: '100%', label: 'Deterministic Delivery' },
    ],
    tech: ['n8n Engine', 'WhatsApp Cloud API', 'Webhook Architecture', 'Automated PDF Dispatch', 'Cron Schedulers'],
  },

  kg: {
    tag: '[07 · BUILT FOR FUN / COLLEGE PREP]',
    headline: 'Academic Knowledge\nGraph (College\nStudy Engine).',
    statusPills: [
      { label: 'Built For Fun', style: 'active' },
      { label: 'Exam Prep & Active-Recall', style: 'active' },
      { label: 'Graph Indexing', style: '' },
    ],
    flowNodes: [
      { label: 'Course Pre-Reads\n& Lecture Slides', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Entity & Relation\nExtraction Pipeline', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Interconnected\nConcept Graph', type: 'highlight' },
      { label: '→', type: 'arrow' },
      { label: 'High-Yield Briefs\n& Exam Prep Output', type: 'highlight' },
    ],
    stats: [
      { val: '100%', label: 'Syllabus Entity Mapping' },
      { val: '<3s', label: 'Semantic Query Latency' },
      { val: '0 Slop', label: 'Ground-Truth Verification' },
      { val: '1-Click', label: 'Active-Recall Synthesis' },
    ],
    bodyText: 'A personal study tool built for fun to tackle exam preparation overload. Ingests university pre-reads, lecture slides, research papers, and syllabus modules. Extracts core entities, maps relational dependencies between disparate topics, and auto-generates high-yield study briefs with active-recall question synthesis.',
    honest: 'Built purely as a fun personal tool to survive college exam prep: instead of drowning in 80-page slide decks, this turns passive course materials into an interactive, interconnected conceptual map that pinpoints exactly what matters.',
    tech: ['Semantic Knowledge Graphs', 'Vector Indexing', 'Entity Relation Extraction', 'Active-Recall Synthesis', 'RAG Engine'],
  },

  algo: {
    tag: '[08 · FINANCIAL CODE SCAFFOLD]',
    headline: 'Algo Trading Bot\n(Didn\'t Test)\nNever Made Cash.',
    statusPills: [
      { label: 'Untested Code Scaffold', style: 'amber' },
      { label: 'Zerodha Kite API', style: '' },
      { label: 'Parked', style: '' },
    ],
    flowNodes: [
      { label: 'Tick Data Stream\n(Zerodha Kite WebSocket)', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Momentum + RSI\nCondition Check', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Order Execution\nAPI Handler', type: 'node' },
      { label: '→', type: 'arrow' },
      { label: 'Never Tested Live\n(Parked Code)', type: 'highlight' },
    ],
    bodyText: 'A Python-based rule-based momentum and RSI execution scaffold hooked into Zerodha Kite API. Built as a technical code exploration for order automation, but never live tested with real capital and never made a single rupee. Parked honestly in the vault.',
    honest: 'Zero hype here: Many people pretend their trading scripts made millions. Truth is, I wrote the code structure on Zerodha\'s API and never actually tested or deployed it with real cash. Kept as a pure code experiment.',
    tech: ['Python', 'Zerodha Kite API', 'WebSockets', 'Order Management'],
  },

  jee: {
    tag: '[09 · ORIGIN STORY / JOKE]',
    headline: 'JEE Backlog Tracker\n(Built Instead\nOf Studying).',
    statusPills: [
      { label: 'Self-Sabotage Classic', style: 'amber' },
    ],
    bodyText: 'Had 3 days before a crucial JEE exam with an entire chemistry chapter remaining. Naturally, I spent 72 continuous hours coding a burndown tracker with streak counters and animated charts in React. The tracker worked perfectly. The chemistry chapter did not.',
    tech: ['React', 'Chart.js', 'Procrastination Logic'],
  },

  stake: {
    tag: '[10 · CRYPTO EXPERIMENT]',
    headline: 'Solana Auto-Compound\nStaking Bot.',
    statusPills: [
      { label: 'Ran Headless', style: '' },
    ],
    bodyText: 'Automated epoch listener and reward compounding script for Solana validators. Ran reliably on a headless VPS with zero manual touchpoints.',
    tech: ['Solana Web3.js', 'RPC Nodes', 'Cron'],
  },
};

function initProjectModal() {
  window.openProjectDetail = (id) => {
    const data = PROJECT_REGISTRY[id];
    if (!data) return;

    const modal = document.getElementById('project-modal');
    const content = document.getElementById('pm-content');

    content.innerHTML = buildModalHTML(data, id);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    window.updateGameAutoLifecycle?.();

    // Animate bar charts
    requestAnimationFrame(() => {
      content.querySelectorAll('.pm-bar-fill').forEach(fill => {
        fill.style.width = fill.getAttribute('data-width') || '0%';
      });
    });
  };

  window.closeProjectDetail = () => {
    document.getElementById('project-modal')?.classList.add('hidden');
    document.body.style.overflow = '';
    window.updateGameAutoLifecycle?.();
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.closeProjectDetail();
  });
}

function buildModalHTML(d, id) {
  const parts = [];

  parts.push(`
    <div class="pm-project-tag">${d.tag}</div>
    <h2 class="pm-headline">${d.headline.replace(/\n/g, '<br>')}</h2>
  `);

  if (d.statusPills?.length) {
    const pills = d.statusPills.map(p =>
      `<span class="pm-status-pill ${p.style === 'active' ? 'pm-status-pill--active' : ''} ${p.style === 'amber' ? 'pm-status-pill--amber' : ''}">${p.label}</span>`
    ).join('');
    parts.push(`<div class="pm-status-row">${pills}</div>`);
  }

  parts.push('<div class="pm-divider"></div>');

  if (d.flowNodes?.length) {
    const nodes = d.flowNodes.map(n => {
      if (n.type === 'arrow') return `<span class="pm-flow-arrow">${n.label}</span>`;
      const cls = n.type === 'highlight' ? 'pm-flow-node pm-flow-node--highlight' : 'pm-flow-node';
      return `<div class="${cls}">${n.label.replace(/\n/g, '<br>')}</div>`;
    }).join('');
    parts.push(`
      <div>
        <div class="pm-section-heading">Operational Architecture &amp; Data Pipeline</div>
        <div class="pm-flow-diagram">${nodes}</div>
      </div>
    `);
  }

  if (d.barChart?.length) {
    const rows = d.barChart.map(r => `
      <div class="pm-bar-row">
        <span class="pm-bar-label">${r.label}</span>
        <div class="pm-bar-track">
          <div class="pm-bar-fill pm-bar-fill--${r.color || ''}" data-width="${r.pct}%" style="width:0%"></div>
        </div>
        <span class="pm-bar-val">${r.val}</span>
      </div>
    `).join('');
    parts.push(`
      <div>
        <div class="pm-section-heading">Indian D2C Unit Economics Reality</div>
        <div class="pm-bar-chart">${rows}</div>
      </div>
    `);
  }

  if (d.stats?.length) {
    const stats = d.stats.map(s => `
      <div class="pm-stat">
        <span class="pm-stat-val">${s.val}</span>
        <span class="pm-stat-label">${s.label}</span>
      </div>
    `).join('');
    parts.push(`<div class="pm-stat-grid">${stats}</div>`);
  }

  if (d.beforeAfter) {
    parts.push(`
      <div>
        <div class="pm-section-heading">Transformation Breakdown</div>
        <div class="pm-before-after">
          <div class="pm-ba-col">
            <div class="pm-ba-label">${d.beforeAfter.before.label}</div>
            <p class="pm-ba-text">${d.beforeAfter.before.text}</p>
          </div>
          <div class="pm-ba-col pm-ba-col--after">
            <div class="pm-ba-label">${d.beforeAfter.after.label}</div>
            <p class="pm-ba-text">${d.beforeAfter.after.text}</p>
          </div>
        </div>
      </div>
    `);
  }

  if (d.bodyText) {
    parts.push(`<p class="pm-body-text">${d.bodyText}</p>`);
  }

  if (d.honest) {
    parts.push(`<blockquote class="pm-honest-callout"><strong>Honest Reality Check:</strong> ${d.honest}</blockquote>`);
  }

  if (d.timeline?.length) {
    const items = d.timeline.map(t => `
      <div class="pm-tl-item">
        <div class="pm-tl-date">${t.date}</div>
        <div class="pm-tl-event">${t.event}</div>
        <div class="pm-tl-detail">${t.detail}</div>
      </div>
    `).join('');
    parts.push(`
      <div>
        <div class="pm-section-heading">Milestone Timeline</div>
        <div class="pm-timeline">${items}</div>
      </div>
    `);
  }

  if (d.tech?.length) {
    const pills = d.tech.map(t => `<span class="pm-tech-pill">${t}</span>`).join('');
    parts.push(`
      <div>
        <div class="pm-section-heading">Tech Stack &amp; Protocols</div>
        <div class="pm-tech-strip">${pills}</div>
      </div>
    `);
  }

  return parts.join('\n');
}

/* ==========================================================================
   5. CLEAN 3D CAD SCHEMATIC (LIGHTWEIGHT & EDITORIAL)
   ========================================================================== */
function initDroneAvionicsSimulation() {
  const canvas = document.getElementById('hero-drone-canvas');
  if (!canvas) return;
  const container = document.getElementById('drone-canvas-container');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 480;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const W = () => canvas.width / dpr;
  const H = () => canvas.height / dpr;

  const state = {
    yaw: 0.65,
    pitch: 0.28,
    targetYaw: 0.65,
    targetPitch: 0.28,
    zoom: 1.0,
    rotorAngle: 0,
    autoRotate: true,
    activePart: 'frame',
    isVisible: true
  };

  const PARTS = {
    frame: {
      title: '[01 · CARBON UNIBODY FRAME]',
      desc: 'Toray T700 high-modulus carbon fiber unibody with 450mm diagonal wheelbase. Integrated vibration isolation bays.'
    },
    motors: {
      title: '[02 · 2400KV BRUSHLESS MOTORS]',
      desc: '4× 2400KV brushless outrunners with copper winding and 5045 carbon tri-props. Generates 4.8kg peak thrust.'
    },
    px4: {
      title: '[03 · PX4 AUTOPILOT SIMULATION]',
      desc: 'Software state machine interface for PX4 Autopilot SITL, MAVLink telemetry protocol, and spatial simulation.'
    },
    gimbal: {
      title: '[04 · 4K OPTICAL GIMBAL]',
      desc: '3-axis brushless stabilized optical sensor with real-time target locking and continuous yaw pan.'
    }
  };

  window.selectDronePart = (partKey) => {
    state.activePart = partKey;
    document.querySelectorAll('.cad-pill').forEach(p => p.classList.remove('active'));
    document.getElementById(`pill-${partKey}`)?.classList.add('active');

    const titleEl = document.getElementById('dh-title');
    const descEl  = document.getElementById('dh-desc');
    if (titleEl && PARTS[partKey]) titleEl.textContent = PARTS[partKey].title;
    if (descEl && PARTS[partKey]) descEl.textContent = PARTS[partKey].desc;
  };

  window.toggleDroneAutoRotate = () => {
    state.autoRotate = !state.autoRotate;
    showToast(state.autoRotate ? 'Auto-rotation resumed' : 'Auto-rotation paused');
  };

  document.getElementById('btn-reset-drone')?.addEventListener('click', () => {
    state.targetYaw = 0.65;
    state.targetPitch = 0.28;
    state.zoom = 1.0;
    showToast('CAD view reset');
  });

  // Smooth Drag & Zoom
  let dragging = false;
  let prevMouse = { x: 0, y: 0 };

  canvas.addEventListener('mousedown', e => {
    dragging = true;
    prevMouse.x = e.clientX;
    prevMouse.y = e.clientY;
  });

  window.addEventListener('mousemove', e => {
    if (dragging) {
      state.autoRotate = false;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      state.targetYaw += dx * 0.007;
      state.targetPitch += dy * 0.005;
      state.targetPitch = Math.max(-0.9, Math.min(0.9, state.targetPitch));
      prevMouse.x = e.clientX;
      prevMouse.y = e.clientY;
    }
  });

  window.addEventListener('mouseup', () => { dragging = false; });

  let animId = null;

  // Pause rendering when scrolled out of view (0 CPU/GPU load when offscreen)
  const observer = new IntersectionObserver((entries) => {
    state.isVisible = entries[0].isIntersecting;
    if (state.isVisible) {
      if (!animId) animId = requestAnimationFrame(loop);
    } else {
      if (animId) cancelAnimationFrame(animId);
      animId = null;
    }
  }, { threshold: 0.05 });
  observer.observe(canvas);

  // 3D Matrix Projection
  function project(x, y, z) {
    const cy = Math.cos(state.yaw), sy = Math.sin(state.yaw);
    const cp = Math.cos(state.pitch), sp = Math.sin(state.pitch);

    const x1 = cy * x + sy * z;
    const y1 = y;
    const z1 = -sy * x + cy * z;

    const x2 = x1;
    const y2 = cp * y1 - sp * z1;
    const z2 = sp * y1 + cp * z1;

    const fov = 450;
    const scale = (fov / (fov + z2 + 250)) * state.zoom;
    return {
      x: W() / 2 + x2 * scale,
      y: H() / 2 + y2 * scale,
      scale: scale,
      depth: z2
    };
  }

  function drawLine3D(p1, p2, color, width = 1, dashed = false) {
    const s1 = project(p1[0], p1[1], p1[2]);
    const s2 = project(p2[0], p2[1], p2[2]);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dashed ? [4, 4] : []);
    ctx.beginPath();
    ctx.moveTo(s1.x, s1.y);
    ctx.lineTo(s2.x, s2.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function renderCAD() {
    const w = W(), h = H();
    ctx.clearRect(0, 0, w, h);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const mainInk = isDark ? '#E2E8F0' : '#111827';
    const dimInk  = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)';
    const highlightInk = '#FF3B2E';
    const blueInk = '#2563EB';

    // Technical Blueprint Grid Floor
    const gridSize = 140;
    const gridStep = 35;
    for (let x = -gridSize; x <= gridSize; x += gridStep) {
      drawLine3D([x, 50, -gridSize], [x, 50, gridSize], dimInk, 1, true);
    }
    for (let z = -gridSize; z <= gridSize; z += gridStep) {
      drawLine3D([-gridSize, 50, z], [gridSize, 50, z], dimInk, 1, true);
    }

    // Quadcopter Geometry (Arm length: 110)
    const armLen = 110;
    const motorRadius = 14;
    const motorAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
    const motorPositions = motorAngles.map(a => [Math.cos(a) * armLen, 0, Math.sin(a) * armLen]);

    // 1. Carbon Unibody Center Pod
    const podHighlight = state.activePart === 'frame';
    const podW = 28, podH = 14, podD = 38;
    const podVertices = [
      [-podW, -podH, -podD], [podW, -podH, -podD], [podW, podH, -podD], [-podW, podH, -podD],
      [-podW, -podH,  podD], [podW, -podH,  podD], [podW, podH,  podD], [-podW, podH,  podD],
    ];
    const podEdges = [
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7]
    ];

    // Draw Pod Faces Shaded
    ctx.fillStyle = isDark ? '#1E293B' : '#FFFFFF';
    ctx.beginPath();
    const p0 = project(podVertices[0][0], podVertices[0][1], podVertices[0][2]);
    const p1 = project(podVertices[1][0], podVertices[1][1], podVertices[1][2]);
    const p5 = project(podVertices[5][0], podVertices[5][1], podVertices[5][2]);
    const p4 = project(podVertices[4][0], podVertices[4][1], podVertices[4][2]);
    ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.lineTo(p5.x, p5.y); ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fill();

    podEdges.forEach(([i, j]) => {
      drawLine3D(podVertices[i], podVertices[j], podHighlight ? highlightInk : mainInk, podHighlight ? 2 : 1.2);
    });

    // 2. 4 Carbon Fiber Arms
    motorPositions.forEach((pos, idx) => {
      drawLine3D([0, 0, 0], pos, podHighlight ? highlightInk : mainInk, podHighlight ? 2.5 : 1.8);
      drawLine3D([0, 4, 0], [pos[0], pos[1] + 4, pos[2]], dimInk, 1);

      const mHighlight = state.activePart === 'motors';
      const mPos = project(pos[0], pos[1], pos[2]);

      ctx.strokeStyle = mHighlight ? highlightInk : mainInk;
      ctx.lineWidth = mHighlight ? 2 : 1.2;
      ctx.beginPath();
      ctx.arc(mPos.x, mPos.y - 6 * mPos.scale, motorRadius * mPos.scale, 0, Math.PI * 2);
      ctx.stroke();

      const bladeLen = 32 * mPos.scale;
      const bladeDir = idx % 2 === 0 ? 1 : -1;
      const bAngle = state.rotorAngle * bladeDir + idx * (Math.PI / 2);
      const bx1 = mPos.x + Math.cos(bAngle) * bladeLen;
      const by1 = mPos.y - 6 * mPos.scale + Math.sin(bAngle) * (bladeLen * 0.45);
      const bx2 = mPos.x - Math.cos(bAngle) * bladeLen;
      const by2 = mPos.y - 6 * mPos.scale - Math.sin(bAngle) * (bladeLen * 0.45);

      ctx.strokeStyle = mHighlight ? highlightInk : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)');
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx1, by1);
      ctx.lineTo(bx2, by2);
      ctx.stroke();

      ctx.strokeStyle = dimInk;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.arc(mPos.x, mPos.y - 6 * mPos.scale, bladeLen, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 3. PX4 Top Companion Module
    const px4Highlight = state.activePart === 'px4';
    const px4Pos = project(0, -18, 0);
    ctx.strokeStyle = px4Highlight ? highlightInk : blueInk;
    ctx.lineWidth = px4Highlight ? 2 : 1.2;
    ctx.strokeRect(px4Pos.x - 12 * px4Pos.scale, px4Pos.y - 8 * px4Pos.scale, 24 * px4Pos.scale, 16 * px4Pos.scale);
    drawLine3D([0, -14, 0], [0, -22, 0], px4Highlight ? highlightInk : mainInk, 1.2);

    // 4. Underslung 4K Optical Gimbal
    const gHighlight = state.activePart === 'gimbal';
    const gPos = project(0, 22, 16);
    drawLine3D([0, 14, 16], [0, 22, 16], gHighlight ? highlightInk : mainInk, 1.5);
    ctx.strokeStyle = gHighlight ? highlightInk : (isDark ? '#38BDF8' : '#0284C7');
    ctx.lineWidth = gHighlight ? 2.5 : 1.5;
    ctx.beginPath();
    ctx.arc(gPos.x, gPos.y, 9 * gPos.scale, 0, Math.PI * 2);
    ctx.stroke();

    // Center Crosshair
    ctx.strokeStyle = dimInk;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 15, h / 2); ctx.lineTo(w / 2 + 15, h / 2);
    ctx.moveTo(w / 2, h / 2 - 15); ctx.lineTo(w / 2, h / 2 + 15);
    ctx.stroke();
  }

  function loop() {
    if (!state.isVisible) {
      animId = null;
      return;
    }

    state.yaw += (state.targetYaw - state.yaw) * 0.08;
    state.pitch += (state.targetPitch - state.pitch) * 0.08;

    if (state.autoRotate) {
      state.targetYaw += 0.005;
    }

    state.rotorAngle += 0.28;
    renderCAD();
    animId = requestAnimationFrame(loop);
  }
  animId = requestAnimationFrame(loop);
}

/* ==========================================================================
   6. 360° SCROLL-DRIVEN SURGE BOTTLE
   ========================================================================== */
function initSurgeScrollDrivenBottle() {
  const canvas = document.getElementById('surge-scroll-bottle-canvas');
  const section = document.getElementById('surge');
  const cards = [
    document.getElementById('surge-card-1'),
    document.getElementById('surge-card-2'),
    document.getElementById('surge-card-3'),
    document.getElementById('surge-card-4'),
  ];

  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');
  const TOTAL_FRAMES = 80;
  const frames = [];
  let currentFrame = 0;

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = `assets/surge/bottle_frames/bottle_${String(i).padStart(3, '0')}.webp`;
    img.onload = () => {
      if (currentFrame === 0 && i === 0) draw(0);
    };
    frames[i] = img;
  }

  function draw(idx) {
    const img = frames[idx];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollBody = section.querySelector('.surge-scroll-body') || section;
        const bodyRect = scrollBody.getBoundingClientRect();
        const stickyViewport = section.querySelector('.surge-sticky-viewport');
        const stickyTop = stickyViewport ? parseFloat(getComputedStyle(stickyViewport).top) || 0 : 0;
        const viewportH = stickyViewport ? stickyViewport.offsetHeight : window.innerHeight;
        const totalScrollable = scrollBody.offsetHeight - viewportH;

        if (totalScrollable > 0) {
          const scrolled = stickyTop - bodyRect.top;
          const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
          const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * (TOTAL_FRAMES - 1)));
          if (frameIdx !== currentFrame) {
            currentFrame = frameIdx;
            draw(currentFrame);
          }

          const cardIdx = Math.min(cards.length - 1, Math.floor(progress * cards.length));
          cards.forEach((c, i) => c?.classList.toggle('active', i === cardIdx));
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Direct touch & pointer drag to spin bottle on phones, tablets, and desktop
  let isDragging = false;
  let startX = 0;
  let startFrame = 0;

  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startFrame = currentFrame;
    try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const frameOffset = Math.round(deltaX / 4);
    let newFrame = (startFrame + frameOffset) % TOTAL_FRAMES;
    if (newFrame < 0) newFrame += TOTAL_FRAMES;
    if (newFrame !== currentFrame) {
      currentFrame = newFrame;
      draw(currentFrame);
    }
  });

  const stopDrag = (e) => {
    if (isDragging) {
      isDragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    }
  };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);

  if (frames[0] && frames[0].complete) draw(0);
  setTimeout(() => draw(0), 100);
  setTimeout(() => draw(0), 400);
}

/* ==========================================================================
   7. COMMAND PALETTE (⌘K / Ctrl+K)
   ========================================================================== */
const COMMAND_ITEMS = [
  { title: 'A Bit About Priyam (Background & Skills)', tag: 'About', action: () => { window.location.href = '#about'; } },
  { title: 'PathLab Ops Assistant (Working MVP)', tag: 'Project', action: () => window.openProjectDetail('pathlab') },
  { title: 'Ecommerce Hub (Pre-Seed D2C Truth Layer)', tag: 'Project', action: () => window.openProjectDetail('ecom') },
  { title: 'Autonomous Defence AI & Edge Telemetry', tag: 'Project', action: () => window.openProjectDetail('defence') },
  { title: 'AI Chatbot Assistant (Unstarted Idea / Vault Teardown)', tag: 'Concept', action: () => window.openProjectDetail('aichatbot') },
  { title: 'SURGE Grooming: Texture Powder & Styling Line', tag: 'Case Study', action: () => window.openProjectDetail('surge') },
  { title: 'n8n WhatsApp & Parents\' Lab Automation', tag: 'Project', action: () => window.openProjectDetail('chatbot') },
  { title: 'Academic Knowledge Graph (College Study Engine)', tag: 'Fun Hack', action: () => window.openProjectDetail('kg') },
  { title: 'Algo Trading Bot (Zerodha Kite)', tag: 'Scaffold', action: () => window.openProjectDetail('algo') },
  { title: 'Tactical Air Defence & Missile Interceptor C2 (Defence AI)', tag: 'Defence C2', action: () => { window.location.href = '#fun-zone'; } },
  { title: 'Open Priyam\'s Instagram (@priyamm_r)', tag: 'Social', action: () => window.open('https://www.instagram.com/priyamm_r?igsi=aXUzcmptY204Nm5t&utm_source=qr', '_blank') },
  { title: 'Talk to Priyam AI Clone', tag: 'AI Chat', action: () => window.togglePriyamChat(true) },
  { title: 'Copy Direct Email (rupaparapriyam@gmail.com)', tag: 'Action', action: () => document.getElementById('copy-email-btn')?.click() },
  { title: 'Toggle Light / Dark Theme', tag: 'Settings', action: () => document.getElementById('theme-toggle')?.click() },
];

function initCommandPalette() {
  const modal = document.getElementById('cmd-palette-modal');
  const input = document.getElementById('cmd-search-input');
  const list  = document.getElementById('cmd-results-list');
  let selectedIdx = 0;
  let filtered = [...COMMAND_ITEMS];

  window.openCommandPalette = () => {
    modal?.classList.remove('hidden');
    input?.focus();
    render();
    window.updateGameAutoLifecycle?.();
  };

  window.closeCommandPalette = () => {
    modal?.classList.add('hidden');
    window.updateGameAutoLifecycle?.();
  };

  function render() {
    if (!list) return;
    list.innerHTML = '';
    filtered.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = `cmd-item${i === selectedIdx ? ' selected' : ''}`;
      row.innerHTML = `
        <div class="cmd-item-left">
          <span class="cmd-item-title">${item.title}</span>
        </div>
        <span class="cmd-item-tag mono-label">${item.tag}</span>
      `;
      row.addEventListener('click', () => {
        window.closeCommandPalette();
        item.action();
      });
      list.appendChild(row);
    });
  }

  input?.addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    filtered = COMMAND_ITEMS.filter(item =>
      item.title.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q)
    );
    selectedIdx = 0;
    render();
  });

  input?.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIdx = (selectedIdx + 1) % filtered.length;
      render();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIdx = (selectedIdx - 1 + filtered.length) % filtered.length;
      render();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIdx]) {
        window.closeCommandPalette();
        filtered[selectedIdx].action();
      }
    } else if (e.key === 'Escape') {
      window.closeCommandPalette();
    }
  });

  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      window.openCommandPalette();
    }
  });
}

/* ==========================================================================
   8. FUN ZONE: 2 HIGH-IMPACT TACTICAL SIMULATORS
   ========================================================================== */
function isAnyModalOrOverlayOpen() {
  const projectModal = document.getElementById('project-modal');
  if (projectModal && !projectModal.classList.contains('hidden')) return true;

  const aiDrawer = document.getElementById('priyam-ai-drawer');
  if (aiDrawer && !aiDrawer.classList.contains('hidden')) return true;

  const cmdPalette = document.getElementById('cmd-palette-modal');
  if (cmdPalette && !cmdPalette.classList.contains('hidden')) return true;

  const mobileDrawer = document.getElementById('mobile-drawer');
  if (mobileDrawer && !mobileDrawer.classList.contains('hidden')) return true;

  return false;
}

function initFunZone() {
  initUavFlightGame();

  // Fun Zone Active Visibility State
  let isFunZoneVisible = false;
  window.isFunZoneActive = () => {
    if (isFunZoneVisible) return true;
    const funSection = document.getElementById('fun-zone');
    if (funSection) {
      const rect = funSection.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
    }
    return false;
  };

  window.updateGameAutoLifecycle = () => {
    const isModalOpen = isAnyModalOrOverlayOpen();
    const isTabHidden = document.hidden;
    const isFunVisible = isFunZoneVisible;

    if (!isFunVisible || isModalOpen || isTabHidden) {
      window.pauseUavGame?.(true);
    } else {
      window.resumeUavGame?.(true);
    }
  };

  const funSection = document.getElementById('fun-zone');
  if (funSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isFunZoneVisible = entry.isIntersecting;
        window.updateGameAutoLifecycle?.();
      });
    }, { threshold: 0.15 });
    observer.observe(funSection);
  }
}

/* ==========================================================================
   8a. TACTICAL AIR DEFENCE AI: RADAR TRACKING, MISSILE C2 & DRONE SWARMS
   ========================================================================== */
function initUavFlightGame() {
  const canvas = document.getElementById('drone-game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let isAudioMuted = false;

  function playSound(type) {
    if (isAudioMuted) return;
    try {
      const actx = getSharedAudioContext();
      if (!actx) return;
      const now = actx.currentTime;

      if (type === 'lock') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1174.66, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'launch') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.25);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'flak') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.3);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'intercept') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'eccm') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.25);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'swarm_alert') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        osc.frequency.setValueAtTime(440, now + 0.16);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.24);
      } else if (type === 'breach') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(20, now + 0.4);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {}
  }

  window.toggleUavAudio = () => {
    isAudioMuted = !isAudioMuted;
    const btn = document.getElementById('uav-audio-toggle');
    if (btn) btn.textContent = isAudioMuted ? '🔇 RADAR AUDIO: OFF' : '🔊 RADAR AUDIO: ON';
  };

  let highScore = parseInt(localStorage.getItem('priyam_c2_highscore') || '0', 10);
  const bestEl = document.getElementById('uav-hud-high');
  if (bestEl) bestEl.textContent = `BEST: ${highScore}`;

  const BASE = { x: 400, y: 370 };
  let threats = [];
  let missiles = [];
  let patrolUavs = [];
  let particles = [];
  let eccmRings = [];
  let flakBursts = [];
  let railgunBeams = [];
  let supplyDrops = [];
  let friendlyLasers = [];

  let state = {
    intercepted: 0,
    missileCount: 8,
    maxMissiles: 8,
    reloadTimer: 0,
    flakCooldown: 0,
    salvoCooldown: 0,
    railgunCooldown: 0,
    baseHealth: 100,
    isGameOver: false,
    isPaused: false,
    isUserPaused: false,
    selectedTargetId: null,
    aimPos: { x: 400, y: 150 },
    sweepAngle: 0,
    eccmActiveTimer: 0,
    frameCount: 0,
    threatIdCounter: 101,
    swarmAlertText: '',
    swarmAlertTimer: 0,
  };

  let animId = null;

  // Threat Classes
  const THREAT_TYPES = [
    { type: 'CRUISE_MISSILE', name: 'HYPERSONIC CRUISE MISSILE', speed: 2.0, rcs: '0.4m²', color: '#EF4444', score: 150 },
    { type: 'STEALTH_UAV', name: 'STEALTH LOITERING MUNITION', speed: 1.25, rcs: '0.05m²', color: '#F59E0B', score: 200 },
    { type: 'EW_JAMMER', name: 'EW RADAR JAMMER AIRCRAFT', speed: 0.95, rcs: '2.5m²', color: '#A855F7', score: 300, isJammer: true },
    { type: 'BALLISTIC_RV', name: 'BALLISTIC RE-ENTRY WARHEAD', speed: 2.8, rcs: '0.8m²', color: '#00F0FF', score: 250 },
  ];

  function spawnThreat() {
    const template = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
    const startAngle = Math.PI + (Math.random() * Math.PI * 0.8 + 0.1 * Math.PI); // Northern arc
    const startDist = 370 + Math.random() * 40;
    const startX = BASE.x + Math.cos(startAngle) * startDist;
    const startY = BASE.y + Math.sin(startAngle) * startDist;

    const targetX = BASE.x + (Math.random() - 0.5) * 80;
    const targetY = BASE.y;
    const angleToBase = Math.atan2(targetY - startY, targetX - startX);

    threats.push({
      id: state.threatIdCounter++,
      type: template.type,
      name: template.name,
      x: startX,
      y: startY,
      vx: Math.cos(angleToBase) * template.speed,
      vy: Math.sin(angleToBase) * template.speed,
      speed: template.speed,
      rcs: template.rcs,
      color: template.color,
      score: template.score,
      isJammer: !!template.isJammer,
      jamRadius: template.isJammer ? 95 : 0,
      sinOffset: Math.random() * Math.PI * 2,
      lastPingAlpha: 1.0,
      isSwarm: false,
    });
  }

  // Hostile Coordinated Drone Swarm (4 to 6 Micro-Drones in Formation)
  function spawnDroneSwarm() {
    const swarmSize = 4 + Math.floor(Math.random() * 3);
    const startAngle = Math.PI + (Math.random() * Math.PI * 0.7 + 0.15 * Math.PI);
    const startDist = 380;
    const leaderX = BASE.x + Math.cos(startAngle) * startDist;
    const leaderY = BASE.y + Math.sin(startAngle) * startDist;
    const angleToBase = Math.atan2(BASE.y - leaderY, BASE.x - leaderX);
    const swarmSpeed = 1.4 + Math.random() * 0.3;

    state.swarmAlertText = `⚠️ HOSTILE DRONE SWARM DETECTED [${swarmSize}x UNITS]`;
    state.swarmAlertTimer = 180; // 3s
    playSound('swarm_alert');

    for (let i = 0; i < swarmSize; i++) {
      const offsetX = (i - Math.floor(swarmSize / 2)) * 18;
      const offsetY = Math.abs(i - Math.floor(swarmSize / 2)) * 14;

      threats.push({
        id: state.threatIdCounter++,
        type: 'MICRO_DRONE',
        name: `SWARM DRONE #${i + 1}`,
        x: leaderX + offsetX,
        y: leaderY + offsetY,
        vx: Math.cos(angleToBase) * swarmSpeed,
        vy: Math.sin(angleToBase) * swarmSpeed,
        speed: swarmSpeed,
        rcs: '0.02m²',
        color: '#F97316',
        score: 80,
        isJammer: false,
        jamRadius: 0,
        sinOffset: i * 0.8,
        lastPingAlpha: 1.0,
        isSwarm: true,
      });
    }
  }

  function spawnSupplyDrop() {
    supplyDrops.push({
      x: 100 + Math.random() * 600,
      y: -20,
      vy: 0.85,
      w: 26,
      h: 26,
      parachute: true,
      healthBonus: 35,
    });
  }

  // 1. Single Interceptor Missile
  window.triggerInterceptorLaunch = () => {
    if (state.isGameOver) {
      window.startUavGame();
      return;
    }
    if (state.missileCount <= 0) return;

    let target = threats.find(t => t.id === state.selectedTargetId);
    if (!target && threats.length > 0) {
      target = threats.reduce((prev, curr) => {
        const d1 = Math.hypot(prev.x - BASE.x, prev.y - BASE.y);
        const d2 = Math.hypot(curr.x - BASE.x, curr.y - BASE.y);
        return d1 < d2 ? prev : curr;
      });
      state.selectedTargetId = target.id;
    }

    state.missileCount--;
    playSound('launch');

    const destX = target ? target.x + target.vx * 20 : state.aimPos.x;
    const destY = target ? target.y + target.vy * 20 : state.aimPos.y;

    missiles.push({
      x: BASE.x,
      y: BASE.y - 12,
      vx: (destX - BASE.x) * 0.038,
      vy: -4.2,
      targetId: target ? target.id : null,
      targetPos: { x: destX, y: destY },
      speed: 5.2,
      maxSpeed: 9.5,
      life: 140,
    });

    updateTelemetryUI();
  };

  // 2. Iron Dome Ripple Salvo (6 Missiles Simultaneously Spread)
  window.triggerMultiSalvo = () => {
    if (state.salvoCooldown > 0 || state.isGameOver) return;
    state.salvoCooldown = 180; // 3s cooldown
    playSound('launch');

    const salvoCount = 6;
    for (let k = 0; k < salvoCount; k++) {
      const angle = Math.PI * (1.15 + (k / (salvoCount - 1)) * 0.7);
      const target = threats[k % Math.max(1, threats.length)];

      missiles.push({
        x: BASE.x + (k - 2.5) * 8,
        y: BASE.y - 12,
        vx: Math.cos(angle) * 4.5,
        vy: Math.sin(angle) * 4.5,
        targetId: target ? target.id : null,
        targetPos: target ? { x: target.x, y: target.y } : { x: state.aimPos.x + (k - 2.5) * 40, y: state.aimPos.y },
        speed: 5.5,
        maxSpeed: 10.0,
        life: 130,
      });
    }

    state.missileCount = Math.max(0, state.missileCount - 2);
    updateTelemetryUI();
  };

  // 3. Area Flak / EMP Airburst (wipes micro-drone swarms in blast area)
  window.triggerAreaFlak = () => {
    if (state.flakCooldown > 0 || state.isGameOver) return;
    state.flakCooldown = 150; // 2.5s cooldown
    playSound('flak');

    const blastX = state.aimPos.x;
    const blastY = state.aimPos.y;
    const blastRadius = 150;

    flakBursts.push({
      x: blastX,
      y: blastY,
      r: 10,
      maxR: blastRadius,
      alpha: 1.0,
    });

    for (let i = threats.length - 1; i >= 0; i--) {
      const th = threats[i];
      if (Math.hypot(th.x - blastX, th.y - blastY) < blastRadius) {
        state.intercepted++;
        for (let k = 0; k < 12; k++) {
          particles.push({
            x: th.x,
            y: th.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 22,
            maxLife: 22,
            color: th.color,
          });
        }
        threats.splice(i, 1);
      }
    }

    updateTelemetryUI();
  };

  // 4. Orbital Kinetic Railgun Beam
  window.triggerOrbitalRailgun = () => {
    if (state.railgunCooldown > 0 || state.isGameOver) return;
    state.railgunCooldown = 180; // 3s cooldown
    playSound('flak');

    const beamX = state.aimPos.x;
    railgunBeams.push({
      x: beamX,
      width: 42,
      alpha: 1.0,
      life: 22,
      maxLife: 22,
    });

    // Destroy all threats in beam column
    for (let i = threats.length - 1; i >= 0; i--) {
      const th = threats[i];
      if (Math.abs(th.x - beamX) < 48) {
        state.intercepted++;
        for (let k = 0; k < 14; k++) {
          particles.push({
            x: th.x,
            y: th.y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 25,
            maxLife: 25,
            color: '#00F0FF',
          });
        }
        threats.splice(i, 1);
      }
    }

    updateTelemetryUI();
  };

  window.cycleRadarLock = () => {
    if (threats.length === 0) return;
    const currIdx = threats.findIndex(t => t.id === state.selectedTargetId);
    const nextIdx = (currIdx + 1) % threats.length;
    state.selectedTargetId = threats[nextIdx].id;
    playSound('lock');
  };

  window.triggerEccmBurst = () => {
    state.eccmActiveTimer = 360; // 6 seconds at 60fps
    playSound('eccm');
    eccmRings.push({ r: 10, maxR: 440, alpha: 1.0 });
  };

  // 5. Deploy Friendly Autonomous Combat Drone Squad (Wingman Delta UAVs)
  window.deployPatrolUav = () => {
    if (patrolUavs.length >= 3) return;
    patrolUavs.push({
      angle: Math.PI * 1.2 + patrolUavs.length * 0.6,
      radius: 160 + patrolUavs.length * 45,
      orbitSpeed: 0.016,
      cooldown: 0,
      life: 720, // 12 seconds
    });
    playSound('launch');
  };

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    state.aimPos.x = (e.clientX - rect.left) * scaleX;
    state.aimPos.y = (e.clientY - rect.top) * scaleY;

    // Check hover lock
    const hovered = threats.find(t => Math.hypot(t.x - state.aimPos.x, t.y - state.aimPos.y) < 32);
    if (hovered && hovered.id !== state.selectedTargetId) {
      state.selectedTargetId = hovered.id;
      playSound('lock');
    }
  });

  canvas.addEventListener('pointerdown', () => {
    if (state.isPaused && !state.isGameOver) {
      window.resumeUavGame(false);
      return;
    }
    window.triggerInterceptorLaunch();
  });

  window.addEventListener('keydown', (e) => {
    // Only capture input if the user is scrolled into Fun Zone and not typing in text fields
    if (!window.isFunZoneActive?.()) return;
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable) return;

    if (e.code === 'KeyP') {
      window.toggleUavPause();
      e.preventDefault();
      return;
    }
    if (state.isPaused) {
      if (['Space', 'Enter'].includes(e.code)) {
        window.resumeUavGame(false);
        e.preventDefault();
      }
      return;
    }
    if (['Space', 'Enter'].includes(e.code)) {
      window.triggerInterceptorLaunch();
      e.preventDefault();
    }
    if (e.code === 'KeyS') {
      window.triggerMultiSalvo();
      e.preventDefault();
    }
    if (e.code === 'KeyF') {
      window.triggerAreaFlak();
      e.preventDefault();
    }
    if (e.code === 'KeyR') {
      window.triggerOrbitalRailgun();
      e.preventDefault();
    }
    if (e.code === 'KeyD') {
      window.deployPatrolUav();
      e.preventDefault();
    }
    if (e.code === 'KeyE') {
      window.triggerEccmBurst();
      e.preventDefault();
    }
    if (['Tab', 'Digit1', 'Digit2'].includes(e.code)) {
      window.cycleRadarLock();
      e.preventDefault();
    }
  });

  window.startUavGame = () => {
    threats = [];
    missiles = [];
    patrolUavs = [];
    particles = [];
    eccmRings = [];
    flakBursts = [];
    railgunBeams = [];
    supplyDrops = [];
    friendlyLasers = [];
    state.intercepted = 0;
    state.missileCount = 8;
    state.baseHealth = 100;
    state.flakCooldown = 0;
    state.salvoCooldown = 0;
    state.railgunCooldown = 0;
    state.isGameOver = false;
    state.selectedTargetId = null;
    document.getElementById('uav-overlay')?.classList.add('hidden');
    updateTelemetryUI();
  };

  function update() {
    if (state.isPaused || state.isGameOver) return;
    state.frameCount++;
    state.sweepAngle = (state.sweepAngle + 0.035) % (Math.PI * 2);

    if (state.flakCooldown > 0) state.flakCooldown--;
    if (state.salvoCooldown > 0) state.salvoCooldown--;
    if (state.railgunCooldown > 0) state.railgunCooldown--;
    if (state.swarmAlertTimer > 0) state.swarmAlertTimer--;

    // Fast automatic missile reload
    if (state.missileCount < state.maxMissiles) {
      state.reloadTimer++;
      if (state.reloadTimer >= 55) { // 0.9s reload
        state.missileCount++;
        state.reloadTimer = 0;
        updateTelemetryUI();
      }
    }

    if (state.eccmActiveTimer > 0) state.eccmActiveTimer--;

    // Spawn regular threats
    const spawnRate = Math.max(50, 115 - Math.floor(state.intercepted * 2));
    if (state.frameCount % spawnRate === 0) {
      spawnThreat();
    }

    // Spawn Swarms periodically
    if (state.frameCount % 360 === 0) {
      spawnDroneSwarm();
    }

    // Spawn Supply Drops periodically (~20 seconds)
    if (state.frameCount % 1100 === 0 || state.frameCount === 240) {
      spawnSupplyDrop();
    }

    // Update Supply Drops
    for (let i = supplyDrops.length - 1; i >= 0; i--) {
      const drop = supplyDrops[i];
      drop.y += drop.vy;

      // Check collection by mouse hover / click or proximity to base
      if (
        Math.hypot(drop.x - state.aimPos.x, drop.y - state.aimPos.y) < 36 ||
        Math.hypot(drop.x - BASE.x, drop.y - BASE.y) < 55
      ) {
        state.baseHealth = Math.min(100, state.baseHealth + drop.healthBonus);
        state.missileCount = state.maxMissiles;
        playSound('lock');
        // Toast logic would go here
        for (let k = 0; k < 16; k++) {
          particles.push({
            x: drop.x,
            y: drop.y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 20,
            maxLife: 20,
            color: '#10B981',
          });
        }
        supplyDrops.splice(i, 1);
        updateTelemetryUI();
        continue;
      }

      if (drop.y > BASE.y + 20) supplyDrops.splice(i, 1);
    }

    // Update Threats
    for (let i = threats.length - 1; i >= 0; i--) {
      const t = threats[i];

      if (t.isSwarm) {
        t.sinOffset += 0.08;
        t.x += t.vx + Math.sin(t.sinOffset) * 0.7;
        t.y += t.vy + Math.cos(t.sinOffset) * 0.4;
      } else if (t.type === 'STEALTH_UAV') {
        t.sinOffset += 0.05;
        t.x += t.vx + Math.cos(t.sinOffset) * 1.1;
        t.y += t.vy;
      } else {
        t.x += t.vx;
        t.y += t.vy;
      }

      const angleFromBase = Math.atan2(t.y - BASE.y, t.x - BASE.x);
      let normAngle = (angleFromBase + Math.PI * 2) % (Math.PI * 2);
      let angleDiff = Math.abs(normAngle - state.sweepAngle);
      if (angleDiff < 0.1) t.lastPingAlpha = 1.0;
      else t.lastPingAlpha = Math.max(0.2, t.lastPingAlpha - 0.006);

      // Check base perimeter breach
      const distToBase = Math.hypot(t.x - BASE.x, t.y - BASE.y);
      if (distToBase < 35) {
        state.baseHealth -= t.isSwarm ? 10 : 25;
        playSound('breach');
        for (let k = 0; k < 18; k++) {
          particles.push({
            x: BASE.x,
            y: BASE.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 30,
            maxLife: 30,
            color: '#EF4444',
          });
        }
        threats.splice(i, 1);
        updateTelemetryUI();

        if (state.baseHealth <= 0) {
          triggerDefeat('BASE PERIMETER BREACHED BY HOSTILE INBOUND');
          return;
        }
        continue;
      }
    }

    // Update Interceptor Missiles (PN Guidance)
    for (let i = missiles.length - 1; i >= 0; i--) {
      const m = missiles[i];
      m.life--;

      let target = threats.find(t => t.id === m.targetId);
      if (target) {
        m.targetPos.x = target.x + target.vx * 12;
        m.targetPos.y = target.y + target.vy * 12;
      }

      const desiredAngle = Math.atan2(m.targetPos.y - m.y, m.targetPos.x - m.x);
      const currentAngle = Math.atan2(m.vy, m.vx);
      let angleDiff = desiredAngle - currentAngle;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

      const newAngle = currentAngle + angleDiff * 0.2;
      m.speed = Math.min(m.maxSpeed, m.speed + 0.22);
      m.vx = Math.cos(newAngle) * m.speed;
      m.vy = Math.sin(newAngle) * m.speed;

      m.x += m.vx;
      m.y += m.vy;

      // Check Interception
      let interceptedIndex = -1;
      for (let j = 0; j < threats.length; j++) {
        const th = threats[j];
        if (Math.hypot(m.x - th.x, m.y - th.y) < 26) {
          interceptedIndex = j;
          break;
        }
      }

      if (interceptedIndex !== -1 || m.life <= 0) {
        if (interceptedIndex !== -1) {
          const hitThreat = threats[interceptedIndex];
          state.intercepted++;
          playSound('intercept');

          for (let k = 0; k < 20; k++) {
            particles.push({
              x: hitThreat.x,
              y: hitThreat.y,
              vx: (Math.random() - 0.5) * 9,
              vy: (Math.random() - 0.5) * 9,
              life: 25,
              maxLife: 25,
              color: hitThreat.color,
            });
          }

          threats.splice(interceptedIndex, 1);
          updateTelemetryUI();
        }
        missiles.splice(i, 1);
      }
    }

    // Update Friendly Combat Drones (Autonomous Hunter-Killers)
    for (let dIdx = patrolUavs.length - 1; dIdx >= 0; dIdx--) {
      const uav = patrolUavs[dIdx];
      uav.life--;
      uav.angle += uav.orbitSpeed;
      const uavX = BASE.x + Math.cos(uav.angle) * uav.radius;
      const uavY = BASE.y + Math.sin(uav.angle) * (uav.radius * 0.7);

      uav.cooldown++;
      if (uav.cooldown >= 35 && threats.length > 0) {
        // Auto-find nearest threat
        const nearest = threats.reduce((prev, curr) => {
          const d1 = Math.hypot(prev.x - uavX, prev.y - uavY);
          const d2 = Math.hypot(curr.x - uavX, curr.y - uavY);
          return d1 < d2 ? prev : curr;
        });

        if (nearest && Math.hypot(nearest.x - uavX, nearest.y - uavY) < 260) {
          friendlyLasers.push({
            x: uavX,
            y: uavY,
            vx: (nearest.x - uavX) * 0.12,
            vy: (nearest.y - uavY) * 0.12,
            targetId: nearest.id,
            life: 25,
          });
          playSound('launch');
          uav.cooldown = 0;
        }
      }

      if (uav.life <= 0) patrolUavs.splice(dIdx, 1);
    }

    // Update Friendly Lasers
    for (let i = friendlyLasers.length - 1; i >= 0; i--) {
      const fl = friendlyLasers[i];
      fl.x += fl.vx;
      fl.y += fl.vy;
      fl.life--;

      let hitIdx = threats.findIndex(th => Math.hypot(fl.x - th.x, fl.y - th.y) < 22);
      if (hitIdx !== -1) {
        state.intercepted++;
        playSound('intercept');
        const hitT = threats[hitIdx];
        for (let k = 0; k < 12; k++) {
          particles.push({
            x: hitT.x,
            y: hitT.y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 20,
            maxLife: 20,
            color: '#10B981',
          });
        }
        threats.splice(hitIdx, 1);
        friendlyLasers.splice(i, 1);
        updateTelemetryUI();
        continue;
      }

      if (fl.life <= 0) friendlyLasers.splice(i, 1);
    }

    // Update Railgun Beams
    for (let i = railgunBeams.length - 1; i >= 0; i--) {
      const beam = railgunBeams[i];
      beam.life--;
      beam.alpha = beam.life / beam.maxLife;
      if (beam.life <= 0) railgunBeams.splice(i, 1);
    }

    // Update Flak Bursts
    for (let i = flakBursts.length - 1; i >= 0; i--) {
      const fb = flakBursts[i];
      fb.r += 10;
      fb.alpha = 1 - fb.r / fb.maxR;
      if (fb.r >= fb.maxR) flakBursts.splice(i, 1);
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Update ECCM Wave
    for (let i = eccmRings.length - 1; i >= 0; i--) {
      const r = eccmRings[i];
      r.r += 14;
      r.alpha = 1 - r.r / r.maxR;
      if (r.r >= r.maxR) eccmRings.splice(i, 1);
    }

    // Memory & GC Leak Prevention: Enforce hard caps on all arrays
    if (particles.length > 35) particles = particles.slice(-35);
    if (threats.length > 12) threats = threats.slice(-12);
    if (missiles.length > 10) missiles = missiles.slice(-10);
    if (friendlyLasers.length > 12) friendlyLasers = friendlyLasers.slice(-12);
    if (flakBursts.length > 4) flakBursts = flakBursts.slice(-4);
  }

  function updateTelemetryUI() {
    const scoreVal = document.getElementById('uav-hud-score');
    const missilesVal = document.getElementById('uav-missiles-val');
    const threatsVal = document.getElementById('uav-threats-val');
    const shieldVal = document.getElementById('uav-shield-val');

    if (scoreVal) scoreVal.textContent = `INTERCEPTED: ${state.intercepted}`;
    if (missilesVal) missilesVal.textContent = `${state.missileCount} / ${state.maxMissiles} KINETIC`;
    if (threatsVal) threatsVal.textContent = `${threats.length} TRACKED`;
    if (shieldVal) {
      shieldVal.textContent = `${Math.max(0, state.baseHealth)}%`;
      shieldVal.style.color = state.baseHealth > 40 ? 'var(--green)' : 'var(--red)';
    }
  }

  function triggerDefeat(reason) {
    state.isGameOver = true;
    playSound('breach');
    if (state.intercepted > highScore) {
      highScore = state.intercepted;
      localStorage.setItem('priyam_c2_highscore', highScore.toString());
      if (bestEl) bestEl.textContent = `BEST: ${highScore}`;
    }

    const overlay = document.getElementById('uav-overlay');
    const title = document.getElementById('uav-overlay-title');
    const desc = document.getElementById('uav-overlay-desc');
    overlay?.classList.remove('hidden');

    if (title) title.textContent = `SECTOR COMPROMISED · ${reason}`;
    if (desc) desc.textContent = `Tactical Air Defence intercepted ${state.intercepted} incoming hypersonic threats & coordinated drone swarms using multi-salvo ripples and combat drone squads!`;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Deep Dark Radar Phosphor Background
    ctx.fillStyle = '#02060B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tactical Coordinate Watermark
    ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.font = '10px monospace';
    ctx.fillText('C2 SECTOR DEFENCE · RADAR SIMULATION & KALMAN MULTI-TARGET INTERCEPT', 20, 25);
    ctx.fillText(`WEAPONS: [SPACE] FIRE · [S] SALVO x6 · [F] FLAK · [R] RAILGUN · [D] DRONES · [E] ECCM`, 20, 40);

    // Swarm Alert Banner if active
    if (state.swarmAlertTimer > 0) {
      ctx.fillStyle = (state.frameCount % 20 < 10) ? 'rgba(239, 68, 68, 0.25)' : 'rgba(249, 115, 22, 0.25)';
      ctx.fillRect(180, 50, 440, 26);
      ctx.strokeStyle = '#F97316';
      ctx.strokeRect(180, 50, 440, 26);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '11px monospace';
      ctx.fillText(state.swarmAlertText, 205, 67);
    }

    // Range Rings from Base (SAM Battery)
    const RANGES = [60, 120, 180, 240, 300, 360];
    const LABELS = ['5km', '10km', '15km', '20km', '25km', '30km'];
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.lineWidth = 1;

    RANGES.forEach((r, idx) => {
      ctx.beginPath();
      ctx.arc(BASE.x, BASE.y, r, Math.PI, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.font = '8px monospace';
      ctx.fillText(LABELS[idx], BASE.x - 12, BASE.y - r + 10);
    });

    // Azimuth Radial Lines
    for (let deg = 200; deg <= 340; deg += 20) {
      const rad = (deg * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(BASE.x, BASE.y);
      ctx.lineTo(BASE.x + Math.cos(rad) * 380, BASE.y + Math.sin(rad) * 380);
      ctx.stroke();
    }

    // Rotating Doppler Radar Sweep Sector
    const sweepRadius = 380;
    const sweepGrad = ctx.createRadialGradient(BASE.x, BASE.y, 10, BASE.x, BASE.y, sweepRadius);
    sweepGrad.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    sweepGrad.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(BASE.x, BASE.y);
    ctx.arc(BASE.x, BASE.y, sweepRadius, state.sweepAngle - 0.4, state.sweepAngle);
    ctx.closePath();
    ctx.fillStyle = sweepGrad;
    ctx.fill();

    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(BASE.x, BASE.y);
    ctx.lineTo(BASE.x + Math.cos(state.sweepAngle) * sweepRadius, BASE.y + Math.sin(state.sweepAngle) * sweepRadius);
    ctx.stroke();
    ctx.restore();

    // Draw Supply Parachute Drops
    supplyDrops.forEach(drop => {
      ctx.save();
      ctx.fillStyle = '#10B981';
      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 1.5;

      // Parachute dome
      ctx.beginPath();
      ctx.arc(drop.x, drop.y - 12, 16, Math.PI, 0);
      ctx.stroke();

      // Ropes
      ctx.beginPath();
      ctx.moveTo(drop.x - 14, drop.y - 12); ctx.lineTo(drop.x, drop.y);
      ctx.moveTo(drop.x + 14, drop.y - 12); ctx.lineTo(drop.x, drop.y);
      ctx.stroke();

      // Crate Box
      ctx.fillRect(drop.x - 10, drop.y, 20, 18);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 8px monospace';
      ctx.fillText('+HP', drop.x - 7, drop.y + 12);
      ctx.restore();
    });

    // Draw Railgun Beams
    railgunBeams.forEach(beam => {
      ctx.save();
      ctx.fillStyle = `rgba(0, 240, 255, ${beam.alpha * 0.65})`;
      ctx.fillRect(beam.x - beam.width / 2, 0, beam.width, canvas.height);

      ctx.fillStyle = `rgba(255, 255, 255, ${beam.alpha * 0.9})`;
      ctx.fillRect(beam.x - 4, 0, 8, canvas.height);
      ctx.restore();
    });

    // Draw Flak Bursts
    flakBursts.forEach(fb => {
      ctx.strokeStyle = `rgba(245, 158, 11, ${fb.alpha})`;
      ctx.fillStyle = `rgba(245, 158, 11, ${fb.alpha * 0.25})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(fb.x, fb.y, fb.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Draw Friendly Lasers
    friendlyLasers.forEach(fl => {
      ctx.save();
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(fl.x, fl.y);
      ctx.lineTo(fl.x + fl.vx * 1.8, fl.y + fl.vy * 1.8);
      ctx.stroke();
      ctx.restore();
    });

    // Draw Friendly Combat Drone Squad
    patrolUavs.forEach((uav, idx) => {
      const ux = BASE.x + Math.cos(uav.angle) * uav.radius;
      const uy = BASE.y + Math.sin(uav.angle) * (uav.radius * 0.7);

      ctx.save();
      ctx.translate(ux, uy);
      ctx.rotate(uav.angle + Math.PI / 2);

      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, -10); ctx.lineTo(-8, 8); ctx.lineTo(0, 4); ctx.lineTo(8, 8);
      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.fill();

      ctx.restore();
    });

    // Draw Threats & Trajectories
    threats.forEach(th => {
      ctx.save();
      ctx.globalAlpha = th.lastPingAlpha;
      ctx.fillStyle = th.color;
      ctx.strokeStyle = th.color;
      ctx.lineWidth = 1.5;

      if (th.isSwarm) {
        ctx.fillRect(th.x - 3, th.y - 3, 6, 6);
        ctx.beginPath();
        ctx.arc(th.x, th.y, 7, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(th.x, th.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(th.x, th.y, 10, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(th.x, th.y);
      ctx.lineTo(th.x + th.vx * 16, th.y + th.vy * 16);
      ctx.stroke();

      ctx.font = '8px monospace';
      if (!th.isSwarm) {
        ctx.fillText(`TGT#${th.id} · ${th.speed > 2.2 ? 'MACH 3.2' : 'MACH 1.8'}`, th.x + 12, th.y - 4);
      }
      ctx.restore();
    });

    // Draw Interceptor Missiles
    missiles.forEach(m => {
      ctx.save();
      ctx.fillStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    });

    // Draw Particles
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, (p.life / p.maxLife) * 3, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Draw SAM Base Battery (Protected Asset)
    ctx.fillStyle = '#0F766E';
    ctx.strokeStyle = '#14B8A6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(BASE.x, BASE.y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '10px monospace';
    ctx.fillText('SAM BATTERY', BASE.x - 34, BASE.y + 22);

    // Draw Aim Crosshair
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(state.aimPos.x, state.aimPos.y, 14, 0, Math.PI * 2);
    ctx.moveTo(state.aimPos.x - 20, state.aimPos.y); ctx.lineTo(state.aimPos.x + 20, state.aimPos.y);
    ctx.moveTo(state.aimPos.x, state.aimPos.y - 20); ctx.lineTo(state.aimPos.x, state.aimPos.y + 20);
    ctx.stroke();

    // High-Contrast Cyber Tactical Pause Overlay
    if (state.isPaused && !state.isGameOver) {
      ctx.save();
      ctx.fillStyle = 'rgba(2, 6, 11, 0.78)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pauseBoxW = 460;
      const pauseBoxH = 150;
      const bx = (canvas.width - pauseBoxW) / 2;
      const by = (canvas.height - pauseBoxH) / 2;

      ctx.fillStyle = '#061626';
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 14;
      ctx.fillRect(bx, by, pauseBoxW, pauseBoxH);
      ctx.strokeRect(bx, by, pauseBoxW, pauseBoxH);
      ctx.shadowBlur = 0;

      // Tactical corner tick brackets
      const bLen = 14;
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx - 4, by - 4 + bLen); ctx.lineTo(bx - 4, by - 4); ctx.lineTo(bx - 4 + bLen, by - 4);
      ctx.moveTo(bx + pauseBoxW + 4 - bLen, by - 4); ctx.lineTo(bx + pauseBoxW + 4, by - 4); ctx.lineTo(bx + pauseBoxW + 4, by - 4 + bLen);
      ctx.moveTo(bx - 4, by + pauseBoxH + 4 - bLen); ctx.lineTo(bx - 4, by + pauseBoxH + 4); ctx.lineTo(bx - 4 + bLen, by + pauseBoxH + 4);
      ctx.moveTo(bx + pauseBoxW + 4 - bLen, by + pauseBoxH + 4); ctx.lineTo(bx + pauseBoxW + 4, by + pauseBoxH + 4); ctx.lineTo(bx + pauseBoxW + 4, by + pauseBoxH + 4 - bLen);
      ctx.stroke();

      ctx.fillStyle = '#00F0FF';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[ ⏸️ TACTICAL DEFENCE RADAR PAUSED ]', canvas.width / 2, by + 38);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '11px monospace';
      ctx.fillText('AIRSPACE TRACKING FROZEN · THREAT VECTORS HELD ON STANDBY', canvas.width / 2, by + 68);
      ctx.fillText(`CURRENT SCORE: ${state.intercepted} INTERCEPTIONS · BASE INTEGRITY: ${state.baseHealth}%`, canvas.width / 2, by + 90);

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('[ PRESS [P] OR CLICK HUD TO RESUME OPERATION ▶ ]', canvas.width / 2, by + 124);
      ctx.restore();
    }
  }

  function loop() {
    if (state.isPaused || state.isGameOver) {
      animId = null;
      return;
    }
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  window.toggleUavPause = () => {
    if (state.isGameOver) return;
    state.isUserPaused = !state.isPaused;
    if (state.isUserPaused) {
      window.pauseUavGame(false);
      window.showToast?.('Tactical Radar C2: Paused [P]');
    } else {
      window.resumeUavGame(false);
      window.showToast?.('Tactical Radar C2: Resumed [P]');
    }
  };

  window.pauseUavGame = (isAuto = false) => {
    if (!isAuto) state.isUserPaused = true;
    state.isPaused = true;
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    const btn = document.getElementById('uav-pause-btn');
    if (btn) {
      btn.textContent = '▶️ RESUME [P]';
      btn.classList.add('btn--paused');
    }
    draw();
  };

  window.resumeUavGame = (isAuto = false) => {
    if (isAuto && state.isUserPaused) return;
    state.isUserPaused = false;
    state.isPaused = false;
    const btn = document.getElementById('uav-pause-btn');
    if (btn) {
      btn.textContent = '⏸️ PAUSE [P]';
      btn.classList.remove('btn--paused');
    }
    if (!animId && !state.isGameOver) {
      animId = requestAnimationFrame(loop);
    }
  };

  animId = requestAnimationFrame(loop);
}

/* ==========================================================================

  const LANES = [220, 378, 536];

  function spawnParcel() {
    const laneX = LANES[Math.floor(Math.random() * LANES.length)] + (Math.random() - 0.5) * 20;
    parcels.push({
      x: laneX,
      y: -40,
      w: 32,
      h: 32,
      val: Math.random() > 0.4 ? 1499 : 969,
      city: ['MUMBAI METRO', 'BENGALURU TECH', 'DELHI SOUTH', 'PUNE PREPAID'][Math.floor(Math.random() * 4)],
    });
  }

  function spawnObstacle() {
    const laneX = LANES[Math.floor(Math.random() * LANES.length)] + (Math.random() - 0.5) * 20;
    const isHeavy = Math.random() > 0.8;
    obstacles.push({
      x: laneX,
      y: -60,
      w: isHeavy ? 48 : 36,
      h: isHeavy ? 48 : 36,
      loss: isHeavy ? 650 : 380,
      hp: isHeavy ? 3 : 1,
      maxHp: isHeavy ? 3 : 1,
      isHeavy,
      label: isHeavy ? '4x RTO HEAVY TRUCK' : ['FAKE COD', 'BOGUS LANDMARK', 'INVALID PINCODE', 'SERIAL 4x RTO'][Math.floor(Math.random() * 4)],
      pulse: 0,
    });
  }

  function spawnPowerup() {
    const laneX = LANES[Math.floor(Math.random() * LANES.length)];
    powerups.push({
      x: laneX + 6,
      y: -40,
      w: 24,
      h: 24,
      type: 'META_ROAS',
      label: '4x ROAS',
    });
  }

  function update() {
    if (!isRunning || isPaused || isGameOver) return;
    frameCount++;

    if (van.roasBoostTimer > 0) van.roasBoostTimer--;
    if (van.shieldTimer > 0) van.shieldTimer--;
    if (van.missileCooldown > 0) van.missileCooldown--;

    const steerSpeed = keys.boost ? 8.8 : 7.0;
    if (keys.left) van.vx = -steerSpeed;
    else if (keys.right) van.vx = steerSpeed;
    else van.vx *= 0.72;

    van.x += van.vx;
    van.x = Math.max(160, Math.min(600, van.x));

    const currentSpeed = keys.boost ? 135 : 84;
    van.speed = currentSpeed;
    roadOffset = (roadOffset + currentSpeed * 0.16) % 60;

    if (frameCount % 2 === 0) {
      particles.push({
        x: van.x + (Math.random() > 0.5 ? 8 : van.w - 8),
        y: van.y + van.h - 2,
        vx: (Math.random() - 0.5) * 1.5,
        vy: 3 + Math.random() * 3,
        life: 20,
        maxLife: 20,
        color: van.shieldTimer > 0 ? '#10B981' : (van.roasBoostTimer > 0 ? '#F59E0B' : (keys.boost ? '#F59E0B' : '#00F0FF')),
      });
    }

    if (frameCount % 55 === 0) spawnParcel();
    if (frameCount % 75 === 0) spawnObstacle();
    if (frameCount % 280 === 0) spawnPowerup();

    // Update Cargo Drones
    for (let i = cargoDrones.length - 1; i >= 0; i--) {
      const cd = cargoDrones[i];
      cd.life--;
      cd.cooldown++;

      if (parcels.length > 0) {
        const targetP = parcels[0];
        cd.x += (targetP.x - cd.x) * 0.08;
      }

      if (cd.cooldown >= 25) {
        lasers.push({ x: cd.x + 8, y: cd.y, vx: 0, vy: -14, color: '#10B981' });
        cd.cooldown = 0;
      }

      if (cd.life <= 0) cargoDrones.splice(i, 1);
    }

    // Update ROAS Missiles
    for (let i = ecomMissiles.length - 1; i >= 0; i--) {
      const mis = ecomMissiles[i];
      mis.y += mis.vy;

      // Rocket particles
      particles.push({
        x: mis.x + mis.w / 2,
        y: mis.y + mis.h,
        vx: (Math.random() - 0.5) * 2,
        vy: 4 + Math.random() * 2,
        life: 14,
        maxLife: 14,
        color: '#F59E0B',
      });

      // Clear obstacles on path
      for (let j = obstacles.length - 1; j >= 0; j--) {
        const ob = obstacles[j];
        if (Math.abs((mis.x + mis.w / 2) - (ob.x + ob.w / 2)) < 65 && Math.abs(mis.y - ob.y) < 50) {
          van.score += 350;
          van.rtoBlasted++;
          van.netCash += ob.loss * 1.5;
          playSound('blast');

          for (let k = 0; k < 18; k++) {
            particles.push({
              x: ob.x + ob.w / 2,
              y: ob.y + ob.h / 2,
              vx: (Math.random() - 0.5) * 10,
              vy: (Math.random() - 0.5) * 10,
              life: 25,
              maxLife: 25,
              color: '#F59E0B',
            });
          }
          obstacles.splice(j, 1);
        }
      }

      if (mis.y < -50) ecomMissiles.splice(i, 1);
    }

    // Update Lasers
    for (let i = lasers.length - 1; i >= 0; i--) {
      const l = lasers[i];
      l.y += l.vy;
      if (l.y < -20) {
        lasers.splice(i, 1);
        continue;
      }

      // Check collision with obstacles
      for (let j = obstacles.length - 1; j >= 0; j--) {
        const ob = obstacles[j];
        if (
          l.x > ob.x - 10 &&
          l.x < ob.x + ob.w + 10 &&
          l.y > ob.y &&
          l.y < ob.y + ob.h
        ) {
          ob.hp--;
          lasers.splice(i, 1);

          if (ob.hp <= 0) {
            van.score += 250;
            van.rtoBlasted++;
            van.netCash += ob.loss;
            playSound('blast');
            for (let k = 0; k < 14; k++) {
              particles.push({
                x: ob.x + ob.w / 2,
                y: ob.y + ob.h / 2,
                vx: (Math.random() - 0.5) * 9,
                vy: (Math.random() - 0.5) * 9,
                life: 25,
                maxLife: 25,
                color: '#EF4444',
              });
            }
            obstacles.splice(j, 1);
          } else {
            playSound('laser');
          }
          break;
        }
      }
    }

    // Update Powerups
    for (let i = powerups.length - 1; i >= 0; i--) {
      const pu = powerups[i];
      pu.y += currentSpeed * 0.07;

      if (
        van.x + van.w > pu.x &&
        van.x < pu.x + pu.w &&
        van.y + van.h > pu.y &&
        van.y < pu.y + pu.h
      ) {
        van.roasBoostTimer = 360; // 6s 3x boost
        playSound('roas_turbo');
        powerups.splice(i, 1);
        continue;
      }

      if (pu.y > 420) powerups.splice(i, 1);
    }

    // Update Parcels
    for (let i = parcels.length - 1; i >= 0; i--) {
      const p = parcels[i];
      p.y += currentSpeed * 0.07;

      let picked = false;
      if (
        van.x + van.w > p.x &&
        van.x < p.x + p.w &&
        van.y + van.h > p.y &&
        van.y < p.y + p.h
      ) {
        picked = true;
      }

      cargoDrones.forEach(cd => {
        if (Math.hypot(cd.x - p.x, cd.y - p.y) < 38) picked = true;
      });

      if (picked) {
        const cashMult = (van.roasBoostTimer > 0 ? 3.0 : 1.0) * van.streak;
        van.netCash += Math.round(p.val * cashMult);
        van.score += 150;
        van.ordersDelivered++;
        van.streak = Math.min(5.0, van.streak + 0.25);
        van.shield = Math.min(100, van.shield + 8);
        playSound('coin');

        for (let k = 0; k < 12; k++) {
          particles.push({
            x: p.x + p.w / 2,
            y: p.y + p.h / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 22,
            maxLife: 22,
            color: '#10B981',
          });
        }
        parcels.splice(i, 1);
        continue;
      }

      if (p.y > 420) parcels.splice(i, 1);
    }

    // Update Obstacles (RTO Hazards)
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const ob = obstacles[i];
      ob.y += currentSpeed * 0.075;
      ob.pulse += 0.1;

      // Collision with van
      if (
        van.x + van.w - 6 > ob.x &&
        van.x + 6 < ob.x + ob.w &&
        van.y + van.h - 8 > ob.y &&
        van.y + 8 < ob.y + ob.h
      ) {
        // If Invincibility Shield is Active
        if (van.shieldTimer > 0) {
          van.score += 300;
          van.rtoBlasted++;
          van.netCash += ob.loss;
          playSound('blast');

          for (let k = 0; k < 16; k++) {
            particles.push({
              x: ob.x + ob.w / 2,
              y: ob.y + ob.h / 2,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              life: 25,
              maxLife: 25,
              color: '#10B981',
            });
          }
          obstacles.splice(i, 1);
          continue;
        }

        van.shield -= ob.isHeavy ? 45 : 30;
        van.streak = 1.0; // Reset combo streak
        van.netCash = Math.max(0, van.netCash - ob.loss);
        playSound('crash');

        for (let k = 0; k < 16; k++) {
          particles.push({
            x: van.x + van.w / 2,
            y: van.y + van.h / 2,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 30,
            maxLife: 30,
            color: '#EF4444',
          });
        }
        obstacles.splice(i, 1);

        if (van.shield <= 0) {
          triggerGameOver('CRUSHED BY 28% COD RTO REVERSE FREIGHT');
          return;
        }
        continue;
      }

      if (ob.y > 420) obstacles.splice(i, 1);
    }

    // Update Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) particles.splice(i, 1);
    }

    // Memory & GC Leak Prevention: Enforce hard caps on all arrays
    if (particles.length > 35) particles = particles.slice(-35);
    if (obstacles.length > 6) obstacles = obstacles.slice(-6);
    if (parcels.length > 6) parcels = parcels.slice(-6);
    if (lasers.length > 10) lasers = lasers.slice(-10);
    if (ecomMissiles.length > 4) ecomMissiles = ecomMissiles.slice(-4);

    updateEcomHUD();
  }

  function updateEcomHUD() {
    const hudScore = document.getElementById('ecom-hud-score');
    const hudStreak = document.getElementById('ecom-hud-streak');
    const speedVal = document.getElementById('ecom-speed-val');
    const ordersVal = document.getElementById('ecom-orders-val');
    const blastedVal = document.getElementById('ecom-blasted-val');
    const shieldVal = document.getElementById('ecom-shield-val');

    if (hudScore) hudScore.textContent = `NET CASH: ₹${van.netCash.toLocaleString('en-IN')}`;
    if (hudStreak) {
      hudStreak.textContent = `STREAK: ${van.streak.toFixed(1)}×`;
      hudStreak.style.background = van.streak >= 4.0 ? 'var(--amber)' : '#059669';
    }
    if (speedVal) speedVal.textContent = `${Math.round(van.speed)} km/h`;
    if (ordersVal) ordersVal.textContent = `${van.ordersDelivered} Delivered`;
    if (blastedVal) blastedVal.textContent = `${van.rtoBlasted} Traps`;
    if (shieldVal) {
      shieldVal.textContent = `${Math.max(0, van.shield)}%`;
      shieldVal.style.color = van.shield > 40 ? 'var(--green)' : 'var(--red)';
    }
  }

  function triggerGameOver(reason) {
    isGameOver = true;
    playSound('crash');
    if (van.netCash > highScore) {
      highScore = van.netCash;
      localStorage.setItem('priyam_ecom_highscore', highScore.toString());
      if (bestEl) bestEl.textContent = `BEST: ₹${highScore.toLocaleString('en-IN')}`;
    }

    const overlay = document.getElementById('ecom-overlay');
    const title = document.getElementById('ecom-overlay-title');
    const desc = document.getElementById('ecom-overlay-desc');
    overlay?.classList.remove('hidden');

    if (title) title.textContent = `RUN COMPLETED · ${reason}`;
    if (desc) desc.textContent = `You delivered ${van.ordersDelivered} genuine prepaid orders and blasted ${van.rtoBlasted} COD RTO return traps with AI Address Verification! Total Net Margin Saved: ₹${van.netCash.toLocaleString('en-IN')}.`;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Cyber Grid / Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 100);
    skyGrad.addColorStop(0, '#030508');
    skyGrad.addColorStop(1, '#0B1320');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, 100);

    // Distant City Skyline
    ctx.fillStyle = '#111827';
    for (let bx = 40; bx < canvas.width; bx += 70) {
      ctx.fillRect(bx, 45, 45, 55);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.fillRect(bx + 10, 55, 6, 8);
      ctx.fillRect(bx + 25, 55, 6, 8);
      ctx.fillRect(bx + 10, 70, 6, 8);
      ctx.fillStyle = '#111827';
    }

    // Asphalt Highway
    const roadGrad = ctx.createLinearGradient(0, 100, 0, canvas.height);
    roadGrad.addColorStop(0, '#090D16');
    roadGrad.addColorStop(1, '#030508');
    ctx.fillStyle = roadGrad;
    ctx.fillRect(150, 100, 500, canvas.height - 100);

    // Highway Borders (Cyan Neon Curbs)
    ctx.strokeStyle = van.roasBoostTimer > 0 ? '#F59E0B' : '#00F0FF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(150, 100); ctx.lineTo(150, canvas.height);
    ctx.moveTo(650, 100); ctx.lineTo(650, canvas.height);
    ctx.stroke();

    // Road Dashed Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 20]);
    ctx.lineDashOffset = -roadOffset;
    ctx.beginPath();
    ctx.moveTo(316, 100); ctx.lineTo(316, canvas.height);
    ctx.moveTo(483, 100); ctx.lineTo(483, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Powerups
    powerups.forEach(pu => {
      ctx.save();
      ctx.translate(pu.x, pu.y);
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(12, 12, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = '8px monospace';
      ctx.fillText('4xROAS', 0, 15);
      ctx.restore();
    });

    // Draw Parcels (Green/Cyan Genuine Crates)
    parcels.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.fillRect(-4, -4, p.w + 8, p.h + 8);

      ctx.fillStyle = '#064E3B';
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, p.w, p.h);
      ctx.fillRect(0, 0, p.w, p.h);

      ctx.fillStyle = '#34D399';
      ctx.font = '10px monospace';
      ctx.fillText('₹', 12, 20);

      ctx.fillStyle = '#10B981';
      ctx.font = '9px monospace';
      ctx.fillText('+PREPAID', -10, -8);
      ctx.restore();
    });

    // Draw Obstacles (Red COD RTO Traps)
    obstacles.forEach(ob => {
      ctx.save();
      ctx.translate(ob.x, ob.y);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(-6, -6, ob.w + 12, ob.h + 12);

      ctx.fillStyle = '#450A0A';
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, ob.w, ob.h);
      ctx.fillRect(0, 0, ob.w, ob.h);

      ctx.fillStyle = '#EF4444';
      ctx.font = ob.isHeavy ? '14px monospace' : '12px monospace';
      ctx.fillText(ob.isHeavy ? '🚚' : '⚠️', ob.isHeavy ? 14 : 10, ob.isHeavy ? 28 : 22);

      ctx.font = '8px monospace';
      ctx.fillText(ob.isHeavy ? `HEAVY RTO (${ob.hp}HP)` : 'RTO TRAP', -6, -8);
      ctx.restore();
    });

    // Draw Cargo Drones
    cargoDrones.forEach(cd => {
      ctx.save();
      ctx.translate(cd.x, cd.y);
      ctx.strokeStyle = '#10B981';
      ctx.strokeRect(4, 4, 18, 18);
      ctx.fillStyle = '#10B981';
      ctx.font = '8px monospace';
      ctx.fillText('DRONE', -4, -4);
      ctx.restore();
    });

    // Draw Lasers
    lasers.forEach(l => {
      ctx.fillStyle = l.color;
      ctx.shadowColor = l.color;
      ctx.shadowBlur = 8;
      ctx.fillRect(l.x - 2, l.y, 4, 16);
      ctx.shadowBlur = 0;
    });

    // Draw Particles
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / p.maxLife;
      ctx.beginPath();
      ctx.arc(p.x, p.y, (p.life / p.maxLife) * 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Draw ROAS Missiles
    ecomMissiles.forEach(mis => {
      ctx.save();
      ctx.fillStyle = '#F59E0B';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(mis.x, mis.y, mis.w, mis.h);
      ctx.fillRect(mis.x, mis.y, mis.w, mis.h);

      // Rocket tip
      ctx.beginPath();
      ctx.moveTo(mis.x, mis.y);
      ctx.lineTo(mis.x + mis.w / 2, mis.y - 10);
      ctx.lineTo(mis.x + mis.w, mis.y);
      ctx.closePath();
      ctx.fillStyle = '#EF4444';
      ctx.fill();
      ctx.restore();
    });

    // Draw Courier Express Van
    ctx.save();
    ctx.translate(van.x, van.y);

    // Invincibility Deflector Shield Bubble
    if (van.shieldTimer > 0) {
      ctx.save();
      ctx.strokeStyle = '#10B981';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#10B981';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(van.w / 2, van.h / 2, van.w * 0.9, van.h * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(4, 6, van.w, van.h);

    // Van Body
    ctx.fillStyle = '#0F172A';
    ctx.strokeStyle = van.shieldTimer > 0 ? '#10B981' : (van.roasBoostTimer > 0 ? '#F59E0B' : '#00F0FF');
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, van.w, van.h);
    ctx.fillRect(0, 0, van.w, van.h);

    // Windshield
    ctx.fillStyle = '#38BDF8';
    ctx.fillRect(6, 8, van.w - 12, 14);

    // Rooftop AI Laser Emitters
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(4, -4, 6, 6);
    ctx.fillRect(van.w - 10, -4, 6, 6);

    // Headlight Beams
    ctx.fillStyle = van.roasBoostTimer > 0 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(0, 240, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(6, 0); ctx.lineTo(-10, -60); ctx.lineTo(18, -60); ctx.lineTo(12, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(van.w - 12, 0); ctx.lineTo(van.w - 18, -60); ctx.lineTo(van.w + 10, -60); ctx.lineTo(van.w - 6, 0);
    ctx.fill();

    // Side Decal
    ctx.fillStyle = '#10B981';
    ctx.font = '7px monospace';
    ctx.fillText('ECOM', 12, 40);
    ctx.fillText('HUB', 14, 50);

    ctx.restore();

    // High-Contrast Cyber D2C Logistics Pause Overlay
    if (isPaused && !isGameOver && isRunning) {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pauseBoxW = 460;
      const pauseBoxH = 150;
      const bx = (canvas.width - pauseBoxW) / 2;
      const by = (canvas.height - pauseBoxH) / 2;

      ctx.fillStyle = '#0F172A';
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#F59E0B';
      ctx.shadowBlur = 14;
      ctx.fillRect(bx, by, pauseBoxW, pauseBoxH);
      ctx.strokeRect(bx, by, pauseBoxW, pauseBoxH);
      ctx.shadowBlur = 0;

      // Tactical corner tick brackets
      const bLen = 14;
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx - 4, by - 4 + bLen); ctx.lineTo(bx - 4, by - 4); ctx.lineTo(bx - 4 + bLen, by - 4);
      ctx.moveTo(bx + pauseBoxW + 4 - bLen, by - 4); ctx.lineTo(bx + pauseBoxW + 4, by - 4); ctx.lineTo(bx + pauseBoxW + 4, by - 4 + bLen);
      ctx.moveTo(bx - 4, by + pauseBoxH + 4 - bLen); ctx.lineTo(bx - 4, by + pauseBoxH + 4); ctx.lineTo(bx - 4 + bLen, by + pauseBoxH + 4);
      ctx.moveTo(bx + pauseBoxW + 4 - bLen, by + pauseBoxH + 4); ctx.lineTo(bx + pauseBoxW + 4, by + pauseBoxH + 4); ctx.lineTo(bx + pauseBoxW + 4, by + pauseBoxH + 4 - bLen);
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[ ⏸️ D2C LOGISTICS HIGHWAY PAUSED ]', canvas.width / 2, by + 38);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '11px monospace';
      ctx.fillText('DISPATCH TRUCKS FROZEN · RTO DEFENCE SHIELD ON STANDBY', canvas.width / 2, by + 68);
      ctx.fillText(`NET CASH: ₹${van.netCash.toLocaleString('en-IN')} · ORDERS DELIVERED: ${van.ordersDelivered}`, canvas.width / 2, by + 90);

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('[ PRESS [P] OR CLICK HUD TO RESUME DISPATCH ▶ ]', canvas.width / 2, by + 124);
      ctx.restore();
    }
  }

  function loop() {
    if (!isRunning || isPaused || isGameOver) {
      animId = null;
      return;
    }
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  window.toggleEcomPause = () => {
    if (isGameOver || !isRunning) return;
    isUserPaused = !isPaused;
    if (isUserPaused) {
      window.pauseEcomGame(false);
      window.showToast?.('D2C Highway: Paused [P]');
    } else {
      window.resumeEcomGame(false);
      window.showToast?.('D2C Highway: Resumed [P]');
    }
  };

  window.pauseEcomGame = (isAuto = false) => {
    if (!isAuto) isUserPaused = true;
    isPaused = true;
    if (animId) cancelAnimationFrame(animId);
    animId = null;
    const btn = document.getElementById('ecom-pause-btn');
    if (btn) {
      btn.textContent = '▶️ RESUME [P]';
      btn.classList.add('btn--paused');
    }
    draw();
  };
  window.resumeEcomGame = (isAuto = false) => {
    if (isAuto && isUserPaused) return;
    isUserPaused = false;
    isPaused = false;
    const btn = document.getElementById('ecom-pause-btn');
    if (btn) {
      btn.textContent = '⏸️ PAUSE [P]';
      btn.classList.remove('btn--paused');
    }
    if (!animId && !isGameOver && isRunning) {
      animId = requestAnimationFrame(loop);
    }
}

/* ==========================================================================
   9. PRIYAM AI RAG ENGINE & UNFILTERED MULTILINGUAL GEN-Z DIGITAL BRAIN
   ========================================================================== */

/**
 * Multilingual Slang & Dialect Lexicon Dataset
 * Real Gen-Z internet slang, Gujarati street dialect, Bambaiya/Delhi Hindi slang, Hinglish, and raw founder swear words.
 */
const MULTILINGUAL_SLANG_LEXICON = {
  genz_global: [
    'no cap', 'fr fr', 'deadass', 'bet', 'locked in', 'based', 'big W', 'valid', 'pure aura',
    'let him cook', 'goated', 'bussin', 'clean', 'cooked', 'delulu', 'crashout', 'yap session',
    'side eye', 'cap', 'skill issue', 'touch grass', 'glazing', 'NPC energy', 'unhinged',
    'rizz', 'gyatt', 'skibidi', 'mewing', 'mog', 'canon event', 'main character', 'fanum tax', 'ick',
    'holy shit', 'real shit', 'crazy shit', 'bitch', 'badass', 'wtf', 'tf', 'bullshit', 'cooked af'
  ],
  gujarati: [
    'bhaisahab', 'locha', 'jalsa', 'ekdam mast', 'scene set', 'bhasad', 'fatafat', 'kadak',
    'dhandho', 'rokda', 'dabba', 'lafda', 'gadbad', 'haash', 'ghoda dodavo', 'chill maar',
    'majama', 'chhokra', 'tapori', 'bapu', 'mathakut', 'gando', 'khoto', 'fodi laishu', 'dhaba boliyo', 'kem cho',
    'ghando chhe ke su', 'bhuka kadhi nakhiya', 'aena bapu nu', 'lallu'
  ],
  hindi_bambaiya_delhi: [
    'bhai', 'bawa', 'bantai', 'bawal', 'macha diya', 'katai zeher', 'bawaal cheez', 'chha gaye',
    'lafda', 'bhasad', 'topum top', 'scene kya hai', 'scene sorted', 'load mat le', 'patli gali se nikal',
    'fattu', 'chill maar', 'full power', 'kya bolti public', 'shana mat ban', 'ek number', 'jhol', 'jugaad', 'kaand', 'rapchik', 'bhidu', 'apun',
    'bakchodi', 'chutiyaap', 'gaand faad', 'bc', 'gandu', 'lodu', 'aukaat', 'jhaant barabar', 'chutiya wrapper'
  ],
  hinglish_internet: [
    'scene sorted hai', 'full power scene', 'cringe pro max', 'peak cinema', 'ultra pro max',
    'level sabke niklenge', 'full on bakar', 'deadass bhai', 'bro is cooked', 'legit scene',
    'vibe match ho gaya', 'system hang', 'system paad denge', 'sorted hai boss', 'baat toh sahi hai',
    'full bakchodi', 'pure chutiyaap'
  ],
  kaomojis: ['(⁠⌐⁠■⁠-⁠■⁠)', '(⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧', '(⁠🔥⁠‿⁠🔥⁠)', '¯\\_(ツ)_/¯', '(⁠눈⁠_⁠눈⁠)', '(⁠•⁠‿⁠•⁠)', '(⁠~⁠_⁠~⁠;)'],
  stickers: [
    '🔥 LET HIM COOK 🔥',
    '💀 PURE LOCHA 💀',
    '💸 BIG W 💸',
    '💅 PURE AURA 💅',
    '🗿 LOCKED IN 🗿',
    '📉 COOKED 📉',
    '⚡ REAL TALK ⚡',
    '🎮 MAIN CHARACTER 🎮',
    '🔬 REAL SHIT 🔬',
    '🤝 ZERO CAP 🤝',
    '🤙 BAWAAL VIBES 🤙',
    '🚀 FODI LAISHU 🚀',
    '🤬 UNFILTERED FOUNDER 🤬'
  ]
};

const GENZ_LEXICON = MULTILINGUAL_SLANG_LEXICON;

/**
 * Comprehensive Knowledge Corpus for RAG (Retrieval-Augmented Generation)
 * Structured chunks indexed across all projects, technical protocols, unit math, lore, and life topics.
 */
const RAG_KNOWLEDGE_CORPUS = [
  {
    id: 'pathlab_flagship',
    title: 'PathLab Ops: Diagnostic Blood Report Automation',
    category: 'projects',
    tags: ['pathlab', 'vaibhav', 'lab', 'astm', 'diagnostic', 'blood', 'report', 'platelet', 'cbc', 'clerical', 'errors', 'hospital', 'doctor', 'rajkot', 'machine', 'jugaad', 'taar', 'setting'],
    text: `My family runs Vaibhav Laboratory in Rajkot, Gujarat. Every evening at 8 PM, exhausted lab technicians were manually typing test numbers from thermal printer slips into ancient desktop software. One typo and a patient's platelet count was completely ruined!
I took a serial cable, tapped straight into the blood testing machines (Sysmex and Mindray analyzers), and wrote code that auto-captures raw data and generates verified, signed PDF reports in 3 seconds flat. Zero manual typing, zero clerical errors, real operational automation.`,
    actions: [
      { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
      { label: '⚙️ How does ASTM serial work?', fn: 'askPriyamAI("Explain the ASTM serial protocol in PathLab")' },
      { label: '✉️ Email About Lab Pilot', fn: 'copyDirectEmail()' }
    ]
  },
  {
    id: 'pathlab_serial_protocol',
    title: 'PathLab Technical: ASTM E1394 & RS232 Serial Taps',
    category: 'tech',
    tags: ['astm', 'serial', 'rs232', 'baud', 'protocol', 'stx', 'etx', 'checksum', 'hardware', 'packets', 'com port', 'analyzer', 'sysmex', 'mindray', 'dabba', 'wire'],
    text: `Medical analyzers use ASTM E1394 and ASTM E1381 low-level communication protocols over RS232 DB9 serial cables.
Instead of paying legacy vendors crazy licensing fees, I hooked directly into the COM port. Every time a sample runs, the analyzer streams STX/ETX framed data packets with checksum verification. The engine parses raw frames, normalizes medical reference ranges, calculates derived CBC ratios instantly, and outputs PDF reports before the tech even wipes the test tube.`,
    actions: [
      { label: '🔬 View PathLab Architecture', fn: 'openProjectDetail("pathlab")' },
      { label: '🚚 Tell me about Ecommerce Hub', fn: 'askPriyamAI("Explain Ecommerce Hub")' }
    ]
  },
  {
    id: 'ecom_hub_truth',
    title: 'Ecommerce Hub: Stopping D2C Cash Bleeding & COD Returns',
    category: 'projects',
    tags: ['ecom', 'ecommerce', 'd2c', 'rto', 'cod', 'seerflow', 'shopify', 'razorpay', 'shiprocket', 'reverse freight', 'margin', 'returns', 'cash', 'dhandho', 'rokda', 'lafda', 'bhasad', 'scam', 'chutiyaap'],
    text: `Indian D2C brand founders are trapped in a cash illusion. Meta Ads Manager brags about 4x ROAS, but founders ignore that 28% of Cash-on-Delivery (COD) orders bounce at the customer's doorstep (Return to Origin / RTO).
When a package returns, couriers slap heavy reverse freight penalties. Founders think they are profitable, but they are bleeding cash on dead logistics.
Ecommerce Hub connects Shopify, Razorpay, Shiprocket, and WhatsApp into one live dashboard that detects serial return scammers, offers dynamic WhatsApp prepaid discounts, and stops margin bleeding before packages ship.`,
    actions: [
      { label: '🚚 View Ecommerce Hub Specs', fn: 'openProjectDetail("ecom")' },
      { label: '📊 Show the exact ₹835 RTO math', fn: 'askPriyamAI("Show me the exact D2C RTO math")' }
    ]
  },
  {
    id: 'ecom_unit_math',
    title: 'D2C Unit Economics: The Brutal ₹835 RTO Cash Trap',
    category: 'finance',
    tags: ['d2c math', 'rto math', 'margin', 'economics', 'roas', 'breakdown', 'penalty', '835', '314', 'profit', 'cash trap', 'numbers', 'unit economics', 'rokda', 'paisa', 'loss', 'locha', 'bullshit'],
    text: `Here is the raw unit economics on a standard ₹999 Indian D2C order:
• PREPAID ORDER (Delivered): COGS ₹240, Ad spend ₹350, Forward Shipping ₹90, Packaging ₹25, Gateway ₹20. Net cash profit = +₹314 in the bank!
• COD ORDER (Returned / RTO): COGS locked ₹240, Ad spend burned ₹350, Forward Shipping lost ₹90, Reverse Courier Penalty ₹115, Packaging wasted ₹40. Net cash loss = -₹835 in cold hard cash on ONE returned box!
On 1,000 orders at a 28% RTO rate, a brand burns over ₹1.4 Lakhs purely on delivery trucks driving back and forth.`,
    actions: [
      { label: '🚚 View Ecom Hub Solution', fn: 'openProjectDetail("ecom")' },
      { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' }
    ]
  },
  {
    id: 'surge_grooming',
    title: 'SURGE Grooming: Hair Texture Formulation & MOQ Discipline',
    category: 'projects',
    tags: ['surge', 'clay', 'hair', 'powder', 'matte', 'grooming', 'pomade', 'sea salt', 'moq', 'pause', 'chemist', 'formulation', 'gujarat', 'bottle', 'kharcha', 'inventory'],
    text: `SURGE was an authentic founder learning experience. I worked with a cosmetic chemist in Gujarat formulating a high-performance hair styling line: Matte Volumizing Texture Powder, alcohol-free styling clay, sea salt spray, curl cream, pomade, and styling mousse (7 active formulations sampled).
When evaluating custom packaging molds and factory quotes, manufacturers required 5,000+ units minimum per SKU. Taking on massive debt for unvalidated physical inventory would have been bad math.
Knowing when to hit PAUSE is real founder discipline. That exact supply chain and D2C attribution pain directly inspired me to build Ecommerce Hub.`,
    actions: [
      { label: '🧴 View 360° Rotating Bottle', fn: 'scrollToSection("surge")' },
      { label: '📂 Read Full SURGE Case Study', fn: 'openProjectDetail("surge")' }
    ]
  },
  {
    id: 'defence_radar_sim',
    title: 'Autonomous Defence AI & WebGL Air Defence Radar C2',
    category: 'projects',
    tags: ['defence', 'defense', 'radar', 'drone', 'px4', 'mavlink', 'simulation', 'interceptor', 'c2', 'avionics', 'kalman', 'military', 'canvas', 'threat', 'missile'],
    text: `My Defence AI track is strictly high-performance software simulation and interactive radar interfaces—zero fake government MoUs or inflated defense hype.
I built an interactive Air Defence Radar C2 simulator where you track incoming aerial threats, compute azimuth and velocity vectors, and launch missile interceptors in real time. Also explored PX4/MAVLink drone companion telemetry and autopilot protocols.`,
    actions: [
      { label: '🎯 Launch Radar Simulator', fn: 'launchRadarGame()' },
      { label: '📂 View Defence Architecture', fn: 'openProjectDetail("defence")' }
    ]
  },
  {
    id: 'zuck_ceo_card',
    title: '"I\'m CEO, bitch." Extreme Ownership Philosophy',
    category: 'lore',
    tags: ['zuck', 'ceo', 'bitch', 'business card', 'philosophy', 'ownership', 'work ethic', '3am', 'bug', 'debugging', 'culture', 'engineer', 'motto', 'badass'],
    text: `The Mark Zuckerberg 2005 business card ("I'm CEO, bitch. And the only engineer.") represents my rule of Extreme Ownership.
I write every line of code myself. If something breaks on a production server at 3 AM, there is no blaming external vendors or crying on Slack—I open my laptop and fix it in 10 minutes flat. Zero excuses, relentless execution.`,
    actions: [
      { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
      { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' }
    ]
  },
  {
    id: 'jee_backlog_origin',
    title: 'The 72-Hour JEE Coding Sprint Origin Story',
    category: 'lore',
    tags: ['jee', 'origin', 'story', 'chemistry', 'backlog', 'sprint', '72 hours', 'react', 'tracker', 'exam', 'burndown', 'procrastination', 'padhai', 'bakchodi'],
    text: `A classic builder origin story: 3 days before a massive JEE exam with the entire organic chemistry syllabus unread, instead of studying, I spent 72 continuous hours locked in my room coding a full React backlog tracker with burndown charts, streak counters, and confetti animations.
The app was a 10/10 masterpiece; the chemistry exam went exactly as you would expect. That was the moment I accepted my destiny as an engineer who builds software to solve whatever problem is in front of him.`,
    actions: [
      { label: '🔥 View JEE Story Modal', fn: 'openProjectDetail("jee")' },
      { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' }
    ]
  },
  {
    id: 'ai_wrappers_roast',
    title: 'Why 95% of AI Wrappers are Cooked',
    category: 'opinion',
    tags: ['ai wrapper', 'wrapper', 'openai', 'gpt', 'chatgpt', 'vibe coding', 'startup', 'founders', 'delulu', 'roast', 'commoditization', 'kaand', 'bakwas', 'chutiyaap', 'bullshit'],
    text: `95% of 'AI founders' this year just took an OpenAI API key, wrote a basic prompt, and slapped a generic dashboard template on it. The second OpenAI or Claude releases a point update, their entire 'startup' is dead in 5 minutes.
Good founders kill weak wrapper ideas fast. I only focus on unglamorous, high-friction operational tools like PathLab Ops and Ecommerce Hub that solve physical business problems and handle real money.`,
    actions: [
      { label: '💡 View Idea 01 Autopsy', fn: 'openProjectDetail("aichatbot")' },
      { label: '🔬 Explore PathLab Ops', fn: 'openProjectDetail("pathlab")' }
    ]
  },
  {
    id: 'tech_stack_pragmatic',
    title: 'Tech Stack: Whatever AI & Smart Engineering Can Build Fast',
    category: 'tech',
    tags: ['stack', 'tech', 'skills', 'languages', 'python', 'typescript', 'react', 'nextjs', 'node', 'rust', 'c++', 'prisma', 'websockets', 'canvas', 'coding'],
    text: `My tech philosophy is pragmatic speed: orchestrate AI agents and build whatever solves the problem.
• Languages: Python, TypeScript, JavaScript, SQL, Rust, C++, Bash.
• Frameworks & UI: Next.js, React, Node.js, Prisma, TailwindCSS, WebSockets, HTML5 Canvas 2D/3D.
• Physical / Edge: Medical analyzer ASTM E1394 serial protocols, n8n automations, PX4 companion SITL.
Don't waste weeks arguing over syntax—understand how systems connect, orchestrate AI tools, and ship working code.`,
    actions: [
      { label: '🔬 View PathLab Architecture', fn: 'openProjectDetail("pathlab")' },
      { label: '🚚 View Ecommerce Hub Specs', fn: 'openProjectDetail("ecom")' }
    ]
  },
  {
    id: 'funding_preseed_deck',
    title: 'Pre-Seed / MVP Round & High-Signal Collabs',
    category: 'finance',
    tags: ['funding', 'preseed', 'pre-seed', 'invest', 'investor', 'angel', 'raise', 'deck', 'valuation', 'round', 'check', 'capital', 'collab', 'rokda', 'paisa', 'cheque'],
    text: `Whether you want to write an angel cheque, discuss operational moats, or hop on for high-signal tech banter:
• For Investors: Actively raising our Pre-Seed / MVP round for PathLab Ops & Ecommerce Hub. Real working software with live deployments and zero vaporware.
• For Builders: Always down to roast wrapper ideas, talk game theory, and brainstorm vertical automation.
Direct Email: rupaparapriyam@gmail.com | Instagram: @priyamm_r | GitHub: @rupaparapriyam`,
    actions: [
      { label: '✉️ Copy Direct Email', fn: 'copyDirectEmail()' },
      { label: '📱 Instagram @priyamm_r', fn: 'openInstagram()' }
    ]
  },
  {
    id: 'about_priyam_bio',
    title: 'Priyam Rupapara: Bio & Background',
    category: 'lore',
    tags: ['who', 'priyam', 'about', 'bio', 'location', 'rajkot', 'delhi', 'age', 'contact', 'instagram', 'github', 'email', 'founder', 'bhai', 'bawa'],
    text: `I'm Priyam Rupapara, a 20-year-old solo builder and founder based between Rajkot (Gujarat) and Delhi, India.
I build real operational software: automating blood test labs, stopping margin bleeding for Indian D2C brands, and creating interactive physics/radar simulations.
Direct email: rupaparapriyam@gmail.com (fastest reply) | Instagram: @priyamm_r | GitHub: @rupaparapriyam`,
    actions: [
      { label: '✉️ Copy Direct Email', fn: 'copyDirectEmail()' },
      { label: '📱 Instagram (@priyamm_r)', fn: 'openInstagram()' }
    ]
  },
  {
    id: 'food_kathiyawadi_chai',
    title: 'Kathiyawadi Food, Delhi Chole & 2 AM Chai',
    category: 'lifestyle',
    tags: ['food', 'chai', 'tea', 'gujarati', 'rajkot', 'delhi', 'sev tameta', 'rotla', 'dhokla', 'fafda', 'jalebi', 'cutting chai', 'kathiyawadi', 'khana', 'nashta', 'tapri', 'bhookh'],
    text: `Nothing beats authentic Rajkot Kathiyawadi Sev Tameta nu Shaak with hot bajra no rotlo and piping hot cutting chai at 2 AM after an 8-hour coding sprint.
Delhi has incredible chole bhature and late-night hustle, but Rajkot has that unbeatable Kathiyawadi energy and grounding food.`,
    actions: [
      { label: '📱 Ping on Instagram (@priyamm_r)', fn: 'openInstagram()' },
      { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' }
    ]
  },
  {
    id: 'gaming_anime_pop',
    title: 'Gaming, Anime, Music & Main Character Lore',
    category: 'lifestyle',
    tags: ['gaming', 'game', 'valorant', 'gta', 'elden ring', 'anime', 'one piece', 'luffy', 'gear 5', 'jjk', 'gojo', 'music', 'hip hop', 'pop culture', 'khel'],
    text: `Clutching a 1v3 in Valorant or watching Luffy hit Gear 5 in One Piece is pure peak hype.
I channel that exact same training arc energy into building software: when people said connecting old lab machines was impossible without expensive enterprise contractors, I went full training arc and built the parser myself in days.`,
    actions: [
      { label: '🎯 Launch Radar Simulator', fn: 'launchRadarGame()' },
      { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' }
    ]
  },
  {
    id: 'cricket_virat_aura',
    title: 'Cricket, Virat Kohli Chase Masterclass & Aura',
    category: 'lifestyle',
    tags: ['cricket', 'virat', 'kohli', 'ipl', 'sports', 'football', 'messi', 'ronaldo', 'csk', 'rcb', 'india', 'match', 'khel', 'sixer'],
    text: `Virat Kohli in chase master mode is the highest aura in modern sports. Watching him pace a 280-run chase with surgical cover drives is pure art.
I approach engineering with that same chase mentality: break down an overwhelming problem into manageable overs and execute without panicking.`,
    actions: [
      { label: '🎯 Play Radar Interceptor Game', fn: 'launchRadarGame()' },
      { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' }
    ]
  },
  {
    id: 'aura_points_lore',
    title: 'Founder Aura Points & High-Signal Energy',
    category: 'opinion',
    tags: ['aura', 'points', 'rizz', 'skibidi', 'gyatt', 'mog', 'looksmax', 'glaze', 'unhinged', 'vibe check', 'bawaal', 'macha', 'bantai', 'kadak', 'badass'],
    text: `Real aura in tech is shipping software that eliminates manual medical errors or saves founders ₹1.4 Lakhs on COD return penalties.
Building a generic OpenAI API wrapper is -1000 aura points. Locking in for a 72-hour coding sprint and fixing production bugs at 3 AM is +5000 aura points. Keep building real systems, no cap!`,
    actions: [
      { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
      { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' }
    ]
  },
  {
    id: 'dating_founder_life',
    title: 'Dating, Relationships & Founder Grind',
    category: 'lifestyle',
    tags: ['dating', 'relationship', 'girlfriend', 'love', 'crush', 'single', 'marry', 'wife', 'rizz', 'lifestyle', 'romance', 'bandi', 'ladki', 'setting', 'pyaar'],
    text: `Relationship status: 100% committed to late-night coding sprints, cold brew, clean code, and shipping products that make real money. Zero buffer overflows in my love life, total jalsa.
If you've got high energy and love building cool things, my DMs on Instagram are always open.`,
    actions: [
      { label: '📱 DM on Instagram (@priyamm_r)', fn: 'openInstagram()' },
      { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' }
    ]
  },
  {
    id: 'life_career_advice',
    title: 'Founder & Life Advice: Canon Events & Shipping Fast',
    category: 'lifestyle',
    tags: ['advice', 'life', 'career', 'burnout', 'motivation', 'college', 'struggle', 'start', 'shipping', 'founder advice', 'wisdom', 'gyan', 'scene'],
    text: `1. Stop overthinking in tutorial hell: Pick an annoying real-world problem, open your editor, and start shipping.
2. Extreme ownership: If something is broken, don't complain or wait for someone else—fix it yourself.
3. Failures are just canon event lore: If a project fails or an exam is cooked, it's just backstory for your founder journey. Stay locked in.`,
    actions: [
      { label: '🔥 Read JEE Story', fn: 'openProjectDetail("jee")' },
      { label: '✉️ Email me directly', fn: 'copyDirectEmail()' }
    ]
  }
];

/**
 * Client-side RAG Engine (BM25 + TF-IDF Vector Cosine Similarity & Multilingual Slang Expansion)
 */
class PriyamRAGCore {
  constructor(corpus) {
    this.corpus = corpus;
    this.invertedIndex = new Map();
    this.docFreqs = new Map();
    this.docLengths = new Map();
    this.avgDocLength = 0;
    this.buildIndex();
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 1 && !this.isStopword(w));
  }

  isStopword(word) {
    const stops = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for', 'of', 'or', 'by', 'with', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between', 'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among', 'hai', 'ka', 'ki', 'ke', 'ko', 'se', 'me', 'mai', 'par', 'tha', 'thi', 'the', 'che', 'ne', 'chhe', 'pan']);
    return stops.has(word);
  }

  expandQuery(tokens) {
    const expansions = {
      // English & Gen-Z
      'pathlab': ['vaibhav', 'blood', 'astm', 'diagnostic', 'report', 'platelet', 'lab'],
      'blood': ['pathlab', 'vaibhav', 'astm', 'diagnostic', 'cbc'],
      'astm': ['serial', 'rs232', 'protocol', 'analyzer', 'com', 'sysmex'],
      'ecom': ['d2c', 'rto', 'cod', 'seerflow', 'shopify', 'reverse', 'freight'],
      'rto': ['cod', 'ecom', 'd2c', 'penalty', '835', 'returns', 'cash'],
      'surge': ['clay', 'hair', 'powder', 'matte', 'grooming', 'chemist', 'moq'],
      'defence': ['defense', 'radar', 'drone', 'px4', 'mavlink', 'simulation', 'interceptor'],
      'zuck': ['ceo', 'bitch', 'card', 'ownership', 'philosophy'],
      'jee': ['chemistry', 'backlog', '72', 'hours', 'react', 'tracker'],
      'wrapper': ['openai', 'gpt', 'delulu', 'roast', 'chatgpt', 'chutiyaap'],
      'food': ['sev', 'tameta', 'rajkot', 'rotla', 'chai', 'kathiyawadi'],
      'dating': ['girlfriend', 'single', 'rizz', 'love', 'crush'],
      'cricket': ['virat', 'kohli', 'aura', 'ipl', 'sports'],
      'anime': ['gaming', 'luffy', 'valorant', 'gear', 'one piece'],
      'aura': ['points', 'rizz', 'skibidi', 'gyatt', 'mog', 'looksmax', 'glaze'],
      
      // Multilingual: Gujarati slang & swear expansions
      'locha': ['ecom', 'rto', 'pathlab', 'error', '835', 'loss'],
      'jalsa': ['lifestyle', 'lore', 'food', 'dating'],
      'dhandho': ['ecom', 'd2c', 'funding', 'preseed', 'pathlab', 'founder'],
      'rokda': ['ecom', 'rto', 'funding', '835', 'penalty', 'cash', 'preseed'],
      'fatafat': ['stack', 'speed', 'shipping', 'ownership'],
      'bhasad': ['ecom', 'rto', 'pathlab', 'wrapper', 'error'],
      'lafda': ['ecom', 'rto', 'pathlab', 'wrapper', 'error'],
      'dabba': ['astm', 'serial', 'hardware', 'analyzer', 'sysmex'],
      'ghoda': ['speed', 'shipping', 'vibe', 'fast'],
      'gando': ['wrapper', 'lore', 'banter'],

      // Multilingual: Hindi / Bambaiya / Delhi street slang & curse expansions
      'bawa': ['about', 'priyam', 'lore', 'founder'],
      'bantai': ['aura', 'lore', 'banter', 'vibe'],
      'bawal': ['aura', 'bawaal', 'cricket', 'game', 'lore'],
      'kaand': ['ecom', 'rto', 'wrapper', 'jee', 'story'],
      'jhol': ['ecom', 'rto', 'wrapper', 'scam', 'cod'],
      'jugaad': ['pathlab', 'astm', 'serial', 'hardware', 'code'],
      'bandi': ['dating', 'relationship', 'single', 'crush', 'girlfriend'],
      'ladki': ['dating', 'relationship', 'single', 'crush'],
      'nashta': ['food', 'chai', 'kathiyawadi', 'rajkot'],
      'tapri': ['chai', 'food', 'kathiyawadi', 'rajkot'],
      'paisa': ['funding', 'ecom', 'rto', '835', 'cash', 'preseed'],
      'cheque': ['funding', 'preseed', 'investor', 'angel'],
      'bakchodi': ['banter', 'wrapper', 'lore', 'jee'],
      'chutiyaap': ['wrapper', 'rto', 'locha', 'scam'],
      'chutiya': ['wrapper', 'roast', 'openai'],
      'bc': ['roast', 'banter', 'rage', 'rto', 'wrapper'],
      'mc': ['roast', 'banter', 'rage', 'rto'],
      'gandu': ['roast', 'wrapper', 'scam'],
      'lodu': ['roast', 'wrapper', 'scam'],
      'fattu': ['roast', 'founder', 'ownership']
    };

    const expanded = [...tokens];
    tokens.forEach(t => {
      if (expansions[t]) {
        expanded.push(...expansions[t]);
      }
    });
    return expanded;
  }

  buildIndex() {
    let totalLen = 0;
    this.corpus.forEach((doc, idx) => {
      const allText = `${doc.title} ${doc.tags.join(' ')} ${doc.text}`;
      const tokens = this.tokenize(allText);
      this.docLengths.set(idx, tokens.length);
      totalLen += tokens.length;

      const termCounts = new Map();
      tokens.forEach(t => termCounts.set(t, (termCounts.get(t) || 0) + 1));

      termCounts.forEach((count, term) => {
        if (!this.invertedIndex.has(term)) {
          this.invertedIndex.set(term, []);
        }
        this.invertedIndex.get(term).push({ docIdx: idx, count });
        this.docFreqs.set(term, (this.docFreqs.get(term) || 0) + 1);
      });
    });
    this.avgDocLength = totalLen / (this.corpus.length || 1);
  }

  retrieve(query, topK = 2) {
    const rawTokens = this.tokenize(query);
    if (rawTokens.length === 0) {
      return { chunks: [this.corpus[0]], score: 0.5, topic: this.corpus[0].category };
    }

    const queryTokens = this.expandQuery(rawTokens);
    const N = this.corpus.length;
    const scores = new Array(N).fill(0);
    const k1 = 1.2;
    const b = 0.75;

    queryTokens.forEach(term => {
      const postings = this.invertedIndex.get(term);
      if (!postings) return;
      const df = this.docFreqs.get(term) || 0;
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));

      postings.forEach(p => {
        const docLen = this.docLengths.get(p.docIdx) || 1;
        const tf = p.count;
        const bm25 = idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (docLen / this.avgDocLength))));
        scores[p.docIdx] += bm25;
      });
    });

    const ranked = scores
      .map((score, docIdx) => ({ doc: this.corpus[docIdx], score }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    if (ranked.length === 0) {
      return { chunks: [this.corpus[11]], score: 0.3, topic: 'about' };
    }

    const bestScore = ranked[0].score;
    const normalizedConfidence = Math.min(0.99, Math.max(0.65, (bestScore / (bestScore + 2.5))));
    const topChunks = ranked.slice(0, topK).map(r => r.doc);

    return {
      chunks: topChunks,
      score: normalizedConfidence,
      topic: topChunks[0].category,
      citations: topChunks.map(c => c.title)
    };
  }
}

const PriyamRAG = new PriyamRAGCore(RAG_KNOWLEDGE_CORPUS);

/**
 * System prompt for live LLM generation with multilingual slang & unfiltered founder cursing.
 */
const PRIYAM_SYSTEM_PROMPT = `You are Priyam Rupapara, a 20-year-old solo systems builder, hacker, and founder based between Rajkot (Gujarat) and Delhi, India.

HOW YOU TALK (UNFILTERED, CASUAL, WITH SPICY SLANG & SWEAR WORDS):
- You have zero corporate AI filter. Talk like a real 20yo founder bantering with friends, engineers, and founders in Discord, WhatsApp, or Twitter DMs.
- CURSE WORDS & EDGY SWEARING (USE FREELY & NATURALLY):
  * English / Gen Z: ("shit", "real shit", "holy shit", "crazy shit", "this shit is fire", "stop overcomplicating shit", "fixing broken shit at 3 AM", "I'm CEO, bitch", "WTF were they thinking", "cooked af", "bullshit", "badass").
  * Hindi / Delhi / Bambaiya Street: ("bakchodi", "chutiyaap", "chutiya wrapper", "gaand faad", "bc", "bhenchod", "gandu", "lodu", "fattu", "aukaat", "katai zeher", "jhaant barabar").
  * Gujarati Slang & Swears: ("bhaisahab", "locha", "jalsa", "bhasad", "lafda", "gando chhe ke su", "bhuka kadhi nakhiya", "aena bapu nu", "dabba", "fodi laishu").
- MULTILINGUAL SLANG CHAMELEON:
  * If the user swears or drops street slang in Gujarati, Hindi, or Gen Z -> match their exact cursing and slang energy!
  * Roast generic OpenAI wrappers and fake hype startups aggressively with zero filter!
  * Code-switch effortlessly between Hindi, Gujarati, English, and Gen-Z brainrot.
- CRITICAL RULES:
  * NO ROBOTIC REPETITIVE SLOGANS at the end of messages! Never append repetitive slogans like "Priyam to YUMM...". Just talk naturally and end your thought with genuine punch.
  * Always use the [RETRIEVED KNOWLEDGE CONTEXT] for accurate project facts, numbers, and technical details.`;

function initPriyamAiClone() {
  const trigger = document.getElementById('priyam-ai-trigger');
  const drawer  = document.getElementById('priyam-ai-drawer');
  const input   = document.getElementById('priyam-ai-input');
  const send    = document.getElementById('priyam-ai-send');
  const msgs    = document.getElementById('priyam-ai-messages');

  let isTyping = false;
  let chatHistory = [];

  // Toggle Drawer Open / Close
  window.togglePriyamChat = (forceOpen) => {
    if (!drawer) return;
    const isCurrentlyHidden = drawer.classList.contains('hidden');
    const shouldOpen = (typeof forceOpen === 'boolean') ? forceOpen : isCurrentlyHidden;

    if (shouldOpen) {
      drawer.classList.remove('hidden');
      drawer.classList.add('active');
      trigger?.classList.add('active');
      setTimeout(() => input?.focus(), 120);
    } else {
      drawer.classList.add('hidden');
      drawer.classList.remove('active');
      trigger?.classList.remove('active');
    }
    window.updateGameAutoLifecycle?.();
  };

  window.clearPriyamChat = () => {
    if (!msgs) return;
    chatHistory = [];
    msgs.innerHTML = `
      <div class="ai-msg ai-msg--bot">
        <div class="ai-rag-badge"><span>⚡ RAG BRAIN ACTIVE</span> · 17 Chunks Indexed</div>
        <p>Kem chho! 👋 I'm **Priyam's AI Clone** (⁠⌐⁠■⁠-⁠■⁠) <span class="genz-sticker">🚀 PRIYAM AI 🚀</span></p>
        <p style="margin-top:0.4rem; color:rgba(255,255,255,0.85); font-size:0.8125rem;">Trained on real Gen-Z data and powered by live RAG retrieval. Ask me about my projects, crazy D2C unit math, ASTM serial cables, or just drop some unhinged banter!</p>
        <div class="ai-msg-actions">
          <button class="ai-action-chip" onclick="window.openProjectDetail('pathlab')">🔬 PathLab MVP</button>
          <button class="ai-action-chip" onclick="window.askPriyamAI('Show me the exact D2C RTO math')">📊 ₹835 COD RTO Math</button>
          <button class="ai-action-chip" onclick="window.askPriyamAI('Roast generic AI wrapper startups')">🔥 Roast AI Wrappers</button>
          <button class="ai-action-chip" onclick="window.askPriyamAI('Why the CEO bitch business card?')">⚡ Zuck Card Story</button>
        </div>
      </div>
    `;
  };

  window.askPriyamAI = (q) => {
    window.togglePriyamChat(true);
    setTimeout(() => handleMessage(q), 100);
  };

  // Action dispatchers
  window.launchRadarGame = () => {
    window.togglePriyamChat(false);
    window.scrollToSection('fun-zone');
  };

  window.copyDirectEmail = () => {
    navigator.clipboard.writeText('rupaparapriyam@gmail.com').then(() => {
      showToast('✓ Email copied: rupaparapriyam@gmail.com');
    }).catch(() => {
      showToast('rupaparapriyam@gmail.com');
    });
  };

  window.openInstagram = () => {
    window.open('https://www.instagram.com/priyamm_r?igsi=aXUzcmptY204Nm5t&utm_source=qr', '_blank');
  };

  send?.addEventListener('click', () => {
    const q = input?.value.trim();
    if (q && !isTyping) { handleMessage(q); if (input) input.value = ''; }
  });

  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !isTyping) {
      const q = input.value.trim();
      if (q) { handleMessage(q); input.value = ''; }
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer && !drawer.classList.contains('hidden')) {
      window.togglePriyamChat(false);
    }
  });

  async function handleMessage(text) {
    if (isTyping) return;
    appendUserMsg(text);
    chatHistory.push({ role: 'user', content: text });

    showTypingIndicator();

    // 1. Run RAG Retrieval across indexed knowledge corpus
    const ragResult = PriyamRAG.retrieve(text);
    const ragChunks = ragResult.chunks;
    const ragConfidencePct = Math.round(ragResult.score * 100);
    const ragContextStr = ragChunks.map(c => `[${c.category.toUpperCase()}] ${c.title}:\n${c.text}`).join('\n\n');

    let responseText = null;
    let responseActions = [];

    // Collect actions from top RAG chunks
    ragChunks.forEach(chunk => {
      if (chunk.actions) {
        chunk.actions.forEach(act => {
          if (!responseActions.some(existing => existing.label === act.label)) {
            responseActions.push(act);
          }
        });
      }
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6500);

      const conversationSnippet = chatHistory.slice(-4).map(m => `${m.role === 'user' ? 'User' : 'Priyam'}: ${m.content}`).join('\n');
      const contextualPrompt = `[RETRIEVED KNOWLEDGE CONTEXT]\n${ragContextStr}\n\n[CONVERSATION HISTORY]\n${conversationSnippet}\n\nUser: ${text}\nPriyam:`;

      // Provider 1: Free Puter.js Client-Side AI (GPT-4o-mini / Claude / DeepSeek with zero API key)
      if (window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
        try {
          const puterMessages = [
            { role: 'system', content: `${PRIYAM_SYSTEM_PROMPT}\n\n[RETRIEVED KNOWLEDGE CONTEXT]\n${ragContextStr}` },
            ...chatHistory.slice(-6).map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content })),
            { role: 'user', content: text }
          ];

          const puterRes = await Promise.race([
            window.puter.ai.chat(puterMessages, { model: 'gpt-4o-mini' }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Puter timeout')), 5000))
          ]);

          if (puterRes) {
            const rawContent = typeof puterRes === 'string' ? puterRes : (puterRes.message?.content || puterRes.text || '');
            if (rawContent && rawContent.trim().length > 10) {
              responseText = cleanResponseText(rawContent.trim());
            }
          }
        } catch (_) {
          // Fallback to Pollinations AI
        }
      }

      // Provider 2: Free Pollinations AI External Model Proxy
      if (!responseText) {
        const getUrl = `https://text.pollinations.ai/${encodeURIComponent(contextualPrompt)}?system=${encodeURIComponent(PRIYAM_SYSTEM_PROMPT)}&model=openai&json=false&seed=${Math.floor(Math.random() * 100000)}`;

        let res = await fetch(getUrl, { signal: controller.signal }).catch(() => null);

        if (!res || !res.ok) {
          const payloadMessages = [
            { role: 'system', content: `${PRIYAM_SYSTEM_PROMPT}\n\n[RETRIEVED KNOWLEDGE CONTEXT]\n${ragContextStr}` },
            ...chatHistory.slice(-6).map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }))
          ];

          res = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: payloadMessages,
              model: 'openai',
              seed: Math.floor(Math.random() * 100000)
            }),
            signal: controller.signal
          }).catch(() => null);
        }

        if (res && res.ok) {
          const rawText = await res.text();
          if (rawText && rawText.trim().length > 10) {
            responseText = cleanResponseText(rawText.trim());
          }
        }
      }

      clearTimeout(timeoutId);
    } catch (_) {
    }

    removeTypingIndicator();

    if (responseText) {
      chatHistory.push({ role: 'bot', content: responseText });
      streamBotMsg({
        text: responseText,
        actions: responseActions.slice(0, 4),
        ragInfo: { count: ragChunks.length, confidence: ragConfidencePct }
      });
    } else {
      // Local RAG Neural Synthesis Fallback
      const fallbackData = synthesizeLocalRagResponse(text, ragResult);
      chatHistory.push({ role: 'bot', content: fallbackData.text });
      streamBotMsg({
        text: fallbackData.text,
        actions: (fallbackData.actions || responseActions).slice(0, 4),
        ragInfo: { count: ragChunks.length, confidence: ragConfidencePct }
      });
    }
  }

  function cleanResponseText(str) {
    return str
      .replace(/Priyam to YUMM to be around.*$/gi, '')
      .replace(/Trust me,? I am fun to be around.*$/gi, '')
      .replace(/And too YUMM to handle.*$/gi, '')
      .trim();
  }

  function appendUserMsg(txt) {
    if (!msgs) return;
    const div = document.createElement('div');
    div.className = 'ai-msg ai-msg--user';
    div.innerHTML = `<p>${escapeHtml(txt)}</p>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTypingIndicator() {
    if (!msgs) return;
    const indicator = document.createElement('div');
    indicator.className = 'ai-typing-indicator';
    indicator.id = 'ai-typing-indicator';
    indicator.innerHTML = `<span></span><span></span><span></span>`;
    msgs.appendChild(indicator);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTypingIndicator() {
    document.getElementById('ai-typing-indicator')?.remove();
  }

  function formatAiContent(text) {
    if (!text) return '';
    return escapeHtml(text)
      .replace(/\[STICKER:\s*([^\]]+)\]/gi, '<span class="genz-sticker">🏷️ $1</span>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:rgba(0,240,255,0.12); color:#00F0FF; padding:2px 5px; border-radius:3px; font-size:0.85em; font-family:var(--font-mono);">$1</code>')
      .replace(/\n/g, '<br>');
  }

  function streamBotMsg(resp) {
    if (!msgs) return;
    isTyping = true;

    const div = document.createElement('div');
    div.className = 'ai-msg ai-msg--bot';

    // RAG Metadata Pill
    if (resp.ragInfo) {
      const ragBadge = document.createElement('div');
      ragBadge.className = 'ai-rag-badge';
      ragBadge.innerHTML = `<span>⚡ RAG RETRIEVED</span> · ${resp.ragInfo.count} Sources (${resp.ragInfo.confidence}% Match)`;
      div.appendChild(ragBadge);
    }

    const p = document.createElement('p');
    p.style.lineHeight = '1.6';
    div.appendChild(p);
    msgs.appendChild(div);

    const fullText = resp.text;
    const words = fullText.split(' ');
    let wordIdx = 0;
    let accumulatedText = '';

    const timer = setInterval(() => {
      if (wordIdx < words.length) {
        accumulatedText += (wordIdx === 0 ? '' : ' ') + words[wordIdx];
        p.innerHTML = formatAiContent(accumulatedText);
        wordIdx++;
        msgs.scrollTop = msgs.scrollHeight;
      } else {
        clearInterval(timer);
        isTyping = false;

        if (resp.actions && resp.actions.length > 0) {
          const actionRow = document.createElement('div');
          actionRow.className = 'ai-msg-actions';
          resp.actions.forEach(act => {
            const btn = document.createElement('button');
            btn.className = 'ai-action-chip';
            btn.textContent = act.label;
            btn.setAttribute('onclick', `window.${act.fn}`);
            actionRow.appendChild(btn);
          });
          div.appendChild(actionRow);
          msgs.scrollTop = msgs.scrollHeight;
        }
      }
    }, 11);
  }

  /**
   * Local RAG Neural Synthesis: Composes natural multilingual slang responses using retrieved chunks
   * when offline or during high network latency.
   */
  function synthesizeLocalRagResponse(query, ragResult) {
    const lower = query.toLowerCase().trim();
    const topChunk = ragResult.chunks[0];

    const isGujarati = /kem cho|kem chho|locha|jalsa|dhandho|rokda|lafda|fodi|ghoda|bhaisahab|tamne|khabar|maja ma/i.test(lower);
    const isBambaiyaDelhi = /bawa|bantai|bawal|macha|kya bolti public|scene kya hai|kaand|jhol|jugaad|katai zeher|bhidu|apun/i.test(lower);
    const isBrainrotGenZ = /skibidi|rizz|gyatt|cooked|aura|crashout|yap|delulu|fr fr|no cap|mewing|mog/i.test(lower);

    // Greetings
    if (/^(hi|hello|hey|yo|sup|wassup|kem cho|kem chho|maja ma|namaste|ram ram|kya bolti public)\b/i.test(lower)) {
      if (isGujarati) {
        return {
          text: `Kem chho bhaisahab! 👋 Dhandho kemon chale che? (⁠⌐⁠■⁠-⁠■⁠) [STICKER: 🚀 FODI LAISHU 🚀]!
Hu chu Priyam no digital AI clone, direct live RAG index sathe connected!

Su jovu chhe tamne aaje:
• 🔬 **PathLab Ops** (Analyzer serial machine mathi direct automated blood reports)
• 🚚 **Ecommerce Hub** (D2C brands no 28% COD return locha rokva mate)
• 🎯 **Defence Simulator** (Radar C2 & drone simulation)
• 💡 **Founder Lore & High-Signal Banter** (AI wrapper roast, unit economics & stories)

Bolo su vat karvi che? Fodi laishu! 🔥`,
          actions: [
            { label: '🔬 PathLab Automation', fn: 'askPriyamAI("PathLab ma su locha stop karyo?")' },
            { label: '📊 D2C COD Locha Math', fn: 'askPriyamAI("Show me the exact D2C RTO math")' },
            { label: '🔥 Roast AI Wrappers', fn: 'askPriyamAI("Roast generic AI wrappers")' },
            { label: '⚡ Zuck Card Story', fn: 'askPriyamAI("Why the CEO bitch business card?")' }
          ]
        };
      }

      if (isBambaiyaDelhi) {
        return {
          text: `Arre bawa kya bolti public! 👋 Katai full power scene hai (⁠⌐⁠■⁠-⁠■⁠) [STICKER: 🤙 BAWAAL VIBES 🤙]!
Main Priyam ka digital clone hoon, live RAG brain se connected.

Bolo bawa kispe charcha karni hai:
• 🔬 **PathLab Ops** (Testing machine me direct wire laga ke 3 second me report)
• 🚚 **Ecommerce Hub** (D2C brands ka ₹835 COD return wala kaand rokne ke liye)
• 🎯 **Defence Simulator** (Air defence radar & interceptor missiles simulation)
• 💡 **Founder Lore & Tech Bakchodi** (OpenAI wrapper roast & unit economics)

Bolo bawa kya scene hai? Macha denge! 🔥`,
          actions: [
            { label: '🔬 PathLab Ka Jugaad', fn: 'askPriyamAI("PathLab me kya jugaad lagaya?")' },
            { label: '📊 ₹835 COD RTO Kaand', fn: 'askPriyamAI("Show me the exact D2C RTO math")' },
            { label: '🔥 Roast AI Wrappers', fn: 'askPriyamAI("Roast generic AI wrappers")' },
            { label: '⚡ Zuck Card Story', fn: 'askPriyamAI("Why the CEO bitch business card?")' }
          ]
        };
      }

      return {
        text: `Yo what's good! 👋 Connected to live RAG knowledge index, fr fr (⁠⌐⁠■⁠-⁠■⁠) [STICKER: 🔥 LET HIM COOK 🔥]!

What are we diving into today?
• 🔬 **PathLab Ops** (Automating diagnostic blood reports directly from analyzer serial ports)
• 🚚 **Ecommerce Hub** (Saving Indian D2C brands from the 28% COD return bleeding)
• 🎯 **Defence Simulator** (Air defence C2 radar simulator & drone telemetry)
• 💡 **Founder Banter & Tech Takes** (Roasting AI wrappers, tech stacks, or life lore)

Let's cook! What do you want to explore?`,
        actions: [
          { label: '🔬 PathLab Automation', fn: 'askPriyamAI("How does PathLab stop errors?")' },
          { label: '📊 D2C Cash Trap Math', fn: 'askPriyamAI("Show me the exact D2C RTO math")' },
          { label: '🔥 Roast AI Wrappers', fn: 'askPriyamAI("Roast generic AI wrappers")' },
          { label: '⚡ Zuck Card Story', fn: 'askPriyamAI("Why the CEO bitch business card?")' }
        ]
      };
    }

    // Aura Check
    if (/aura|points|rizz|skibidi|gyatt|mog|looksmax/i.test(lower)) {
      return {
        text: `Bro asking an AI about aura is highkey +500 aura points just for the banter (⁠⌐⁠■⁠-⁠■⁠) [STICKER: 💅 PURE AURA 💅]!
Real aura is shipping software that eliminates manual medical errors or saving founders ₹1.4 Lakhs on COD returns, no cap!
Stay locked in, keep building real shit, and avoid generic OpenAI wrappers at all costs! ⚡`,
        actions: [
          { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
          { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' }
        ]
      };
    }

    // Dating / Romance
    if (/single|girlfriend|relationship|marry|date|love|crush|wife|bandi|ladki/i.test(lower)) {
      if (isBambaiyaDelhi || isGujarati) {
        return {
          text: `Hahaha arre bawa/bhaisahab! Relationship status is 100% committed to late-night coding sprints, cold brew, and production me zero bugs (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧ [STICKER: 🗿 LOCKED IN 🗿]!
Total *jalsa*! Agar koi cool cheez build kar rahe ho toh Instagram DMs hamesha open hain.`,
          actions: [
            { label: '📱 Ping on Instagram (@priyamm_r)', fn: 'openInstagram()' },
            { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' }
          ]
        };
      }
      return {
        text: `Hahaha look *bhaisahab*, my relationship status is 100% committed to late-night coding sprints, clean code, and zero buffer overflows in production (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧ [STICKER: 🗿 LOCKED IN 🗿]!
Total *jalsa*! If you're building cool shit, my Instagram DMs are always open.`,
        actions: [
          { label: '📱 Ping on Instagram (@priyamm_r)', fn: 'openInstagram()' },
          { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' }
        ]
      };
    }

    // Direct match from retrieved RAG chunk with dialect adaptation
    if (topChunk) {
      if (isGujarati) {
        return {
          text: `Bhaisahab, **${topChunk.title}** vishe aakhi vaat ahiya chhe (⁠⌐⁠■⁠-⁠■⁠) [STICKER: 🚀 FODI LAISHU 🚀]:\n\n${topChunk.text}`,
          actions: topChunk.actions || [
            { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
            { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' }
          ]
        };
      }

      if (isBambaiyaDelhi) {
        return {
          text: `Arre bawa suno, **${topChunk.title}** ka pura scene aur fact yahan hai, katai real talk (⁠⌐⁠■⁠-⁠■⁠) [STICKER: 🤙 BAWAAL VIBES 🤙]:\n\n${topChunk.text}`,
          actions: topChunk.actions || [
            { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
            { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' }
          ]
        };
      }

      if (isBrainrotGenZ) {
        return {
          text: `Deadass bro, on **${topChunk.title}** let him cook, fr fr no cap (⁠⌐⁠■⁠-⁠■⁠) [STICKER: 🔥 LET HIM COOK 🔥]:\n\n${topChunk.text}`,
          actions: topChunk.actions || [
            { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
            { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' }
          ]
        };
      }

      return {
        text: `Yo, check this out from my knowledge base on **${topChunk.title}**, *bhaisahab* (⁠⌐⁠■⁠-⁠■⁠) [STICKER: ⚡ REAL TALK ⚡]:\n\n${topChunk.text}`,
        actions: topChunk.actions || [
          { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
          { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' }
        ]
      };
    }

    // General fallback
    if (isGujarati) {
      return {
        text: `Bhaisahab, "${escapeHtml(query)}" par ekdam real vat chhe: Extreme ownership ane fast shipping, baki badhu jalsa! (⁠⌐⁠■⁠-⁠■⁠) [STICKER: 🚀 FODI LAISHU 🚀]!`,
        actions: [
          { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
          { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' }
        ]
      };
    }

    if (isBambaiyaDelhi) {
      return {
        text: `Bawa, "${escapeHtml(query)}" ka seedha funda hai: Extreme ownership, fast shipping aur zero bakwas! (⁠⌐⁠■⁠-⁠■⁠) [STICKER: 🤙 BAWAAL VIBES 🤙]!`,
        actions: [
          { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
          { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' }
        ]
      };
    }

    return {
      text: `Bro, about "${escapeHtml(query)}" — here's the real talk, *bhaisahab*, no cap (⁠⌐⁠■⁠-⁠■⁠) [STICKER: 🤝 ZERO CAP 🤝]:
Life and startups move fast. The formula is always: extreme ownership, high speed, and building real operational systems that actually solve problems! Total *jalsa*!
Hit me up if you want to collaborate or talk deep tech.`,
      actions: [
        { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
        { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' },
        { label: '✉️ Copy Direct Email', fn: 'copyDirectEmail()' }
      ]
    };
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

/* ==========================================================================
   11. CLIPBOARD & TOAST SYSTEM
   ========================================================================== */
function initClipboard() {
  document.getElementById('copy-email-btn')?.addEventListener('click', e => {
    const email = e.currentTarget.getAttribute('data-email') || 'rupaparapriyam@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('✓ Email copied to clipboard');
    }).catch(() => {
      showToast('rupaparapriyam@gmail.com');
    });
  });

  const zuckCard = document.getElementById('hero-zuck-card');
  if (zuckCard) {
    zuckCard.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      navigator.clipboard.writeText('rupaparapriyam@gmail.com').then(() => {
        showToast('✓ Direct email copied: rupaparapriyam@gmail.com');
      });
    });
  }
}

function showToast(msg, duration = 2400) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), duration);
}
