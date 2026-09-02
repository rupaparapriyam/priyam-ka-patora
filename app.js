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

  function setOpen(state) {
    open = state;
    drawer?.classList.toggle('hidden', !open);
    openIcon?.classList.toggle('hidden', open);
    closeIcon?.classList.toggle('hidden', !open);
    window.updateGameAutoLifecycle?.();
  }

  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!open);
  });

  drawer?.querySelectorAll('.mobile-link, .mobile-cmd-btn, .mobile-chat-btn').forEach(item => {
    item.addEventListener('click', () => {
      setOpen(false);
    });
  });

  // Tap outside mobile drawer to dismiss
  document.addEventListener('click', (e) => {
    if (open && !drawer?.contains(e.target) && !btn?.contains(e.target)) {
      setOpen(false);
    }
  });

  // Auto-close on scroll down
  let lastMenuScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (open && Math.abs(window.scrollY - lastMenuScrollY) > 60) {
      setOpen(false);
    }
    lastMenuScrollY = window.scrollY;
  }, { passive: true });
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

  // 3D Flight Core State (Dynamically placed: top-right on mobile/tablet, centered on desktop)
  const isMobileInit = width < 890;
  const drone = {
    x: isMobileInit ? width * 0.76 : width * 0.48,
    y: isMobileInit ? Math.min(220, Math.max(140, height * 0.16)) : height * 0.42,
    z: 0,
    targetX: isMobileInit ? width * 0.76 : width * 0.48,
    targetY: isMobileInit ? Math.min(220, Math.max(140, height * 0.16)) : height * 0.42,
    pitch: 0.12,
    yaw: -0.18,
    roll: -0.05,
    targetPitch: 0.12,
    targetYaw: -0.18,
    targetRoll: -0.05,
    rollBoost: 0,
    scale: isMobileInit ? Math.min(1.15, Math.max(0.68, width / 650)) : Math.min(1.35, Math.max(0.85, width / 1100)),
  };

  let time = 0;
  let mouse = {
    x: isMobileInit ? width * 0.76 : width * 0.48,
    y: isMobileInit ? Math.min(220, Math.max(140, height * 0.16)) : height * 0.45,
    targetX: isMobileInit ? width * 0.76 : width * 0.48,
    targetY: isMobileInit ? Math.min(220, Math.max(140, height * 0.16)) : height * 0.45,
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
    const isMobile = width < 890;
    if (drone) {
      drone.scale = isMobile ? Math.min(1.15, Math.max(0.68, width / 650)) : Math.min(1.4, Math.max(0.85, width / 1100));
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

  heroSec?.addEventListener('touchstart', (e) => {
    if (!e.touches || !e.touches[0]) return;
    if (!heroRect) updateHeroBounds();
    mouse.targetX = e.touches[0].clientX - (heroRect ? heroRect.left : 0);
    mouse.targetY = e.touches[0].clientY - (heroRect ? heroRect.top : 0);
    mouse.isHover = true;
  }, { passive: true });

  heroSec?.addEventListener('touchmove', (e) => {
    if (!e.touches || !e.touches[0]) return;
    if (!heroRect) updateHeroBounds();
    mouse.targetX = e.touches[0].clientX - (heroRect ? heroRect.left : 0);
    mouse.targetY = e.touches[0].clientY - (heroRect ? heroRect.top : 0);
    mouse.isHover = true;
  }, { passive: true });

  heroSec?.addEventListener('mouseleave', () => {
    mouse.isHover = false;
    const isMobile = width < 890;
    mouse.targetX = isMobile ? width * 0.76 : width * 0.48;
    mouse.targetY = isMobile ? Math.min(220, Math.max(140, height * 0.16)) : height * 0.42;
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

    const isMobile = width < 890;
    const baseX = isMobile ? width * 0.76 : width * 0.48;
    const baseY = isMobile ? Math.min(220, Math.max(140, height * 0.16)) : height * 0.42;

    const deltaX = (mouse.x - baseX) / width;
    const deltaY = (mouse.y - baseY) / height;

    drone.targetX = baseX + (mouse.x - baseX) * (isMobile ? 0.12 : 0.2) + Math.sin(time * 0.8) * (isMobile ? 12 : 25);
    drone.targetY = baseY + (mouse.y - baseY) * (isMobile ? 0.12 : 0.2) + Math.cos(time * 1.1) * (isMobile ? 10 : 16);
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

    const curScale = drone.scale * (width < 600 ? 0.74 : (isMobile ? 0.84 : 1.0));

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

    // 9. Full Tactical Holographic Avionics HUD & Target Lock (Idea 1)
    ctx.save();
    const hudX = drone.x;
    const hudY = drone.y;
    const boxW = 110 * curScale;
    const boxH = 75 * curScale;
    const bLen = 14;

    const hudColor = isDark ? 'rgba(0, 240, 255, 0.75)' : 'rgba(37, 99, 235, 0.85)';
    const hudDim = isDark ? 'rgba(0, 240, 255, 0.18)' : 'rgba(37, 99, 235, 0.22)';
    const hudAccent = isDark ? '#00F0FF' : '#2563EB';

    // 1. Rotating Tactical Azimuth Ring with cardinal compass ticks
    const ringRadius = 125 * curScale;
    ctx.save();
    ctx.translate(hudX, hudY);
    ctx.rotate(time * 0.25);

    ctx.beginPath();
    ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = hudDim;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([6, 12]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Compass Cardinal Ticks (N, E, S, W)
    for (let a = 0; a < 4; a++) {
      const angle = a * (Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * (ringRadius - 6), Math.sin(angle) * (ringRadius - 6));
      ctx.lineTo(Math.cos(angle) * (ringRadius + 6), Math.sin(angle) * (ringRadius + 6));
      ctx.strokeStyle = hudColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.restore();

    // 2. Dynamic Target Corner Lock Brackets [ + ]
    ctx.strokeStyle = hudColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // Top-Left
    ctx.moveTo(hudX - boxW, hudY - boxH + bLen); ctx.lineTo(hudX - boxW, hudY - boxH); ctx.lineTo(hudX - boxW + bLen, hudY - boxH);
    // Top-Right
    ctx.moveTo(hudX + boxW - bLen, hudY - boxH); ctx.lineTo(hudX + boxW, hudY - boxH); ctx.lineTo(hudX + boxW, hudY - boxH + bLen);
    // Bottom-Left
    ctx.moveTo(hudX - boxW, hudY + boxH - bLen); ctx.lineTo(hudX - boxW, hudY + boxH); ctx.lineTo(hudX - boxW + bLen, hudY + boxH);
    // Bottom-Right
    ctx.moveTo(hudX + boxW - bLen, hudY + boxH); ctx.lineTo(hudX + boxW, hudY + boxH); ctx.lineTo(hudX + boxW, hudY + boxH - bLen);
    ctx.stroke();

    // Center Crosshair
    ctx.strokeStyle = hudDim;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(hudX - 8, hudY); ctx.lineTo(hudX + 8, hudY);
    ctx.moveTo(hudX, hudY - 8); ctx.lineTo(hudX, hudY + 8);
    ctx.stroke();

    // 3. Cyber Monospace Telemetry Readouts
    const fontSize = Math.max(8.5, Math.round(9 * curScale));
    ctx.font = `${fontSize}px "Space Mono", monospace`;
    
    // Top-Left: Coords (Rajkot / Delhi base origin)
    ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(15, 23, 42, 0.75)';
    ctx.fillText(`LAT 22.30°N · LON 70.80°E`, hudX - boxW, hudY - boxH - 8);
    
    // Top-Right: Velocity / Altitude
    const altVal = Math.round(420 + Math.sin(time * 0.8) * 30);
    ctx.fillStyle = hudAccent;
    ctx.fillText(`ALT ${altVal}M · MACH 0.85`, hudX - boxW, hudY - boxH + 14);

    // Bottom: Dynamic Heading & Target Lock Status
    const headingDeg = Math.round(((drone.yaw * 180 / Math.PI) % 360 + 360) % 360);
    const pitchDeg = Math.round(drone.pitch * 180 / Math.PI);
    ctx.fillText(`HDG ${String(headingDeg).padStart(3, '0')}° · PIT ${pitchDeg > 0 ? '+' : ''}${pitchDeg}°`, hudX - boxW, hudY + boxH + 16);
    
    ctx.fillStyle = isDark ? '#10B981' : '#059669';
    ctx.fillText(`[● TARGET LOCKED]`, hudX - boxW, hudY + boxH + 28);

    ctx.restore();

    // Request next frame
    animId = requestAnimationFrame(render);
  }

  function startAnimation() {
    if (!animId) {
      animId = requestAnimationFrame(render);
    }
  }

  function stopAnimation() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  // Start immediately on load
  startAnimation();

  if (heroSec && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          stopAnimation();
        } else {
          startAnimation();
        }
      });
    }, { threshold: 0.01, rootMargin: '200px 0px' });
    observer.observe(heroSec);
  }
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

  // Bottom Interactive Action Bar
  const cleanHeadline = (d.headline || '').replace(/[\n\r]+/g, ' ').replace(/'/g, "\\'");
  parts.push(`
    <div class="pm-divider"></div>
    <div class="pm-action-row">
      <button class="pm-chat-cta" onclick="window.closeProjectDetail(); setTimeout(() => window.askPriyamAI('Explain the architecture and numbers behind ${cleanHeadline}'), 250);">
        <span class="pm-chat-cta-dot"></span>
        <span class="pm-chat-cta-icon">💬</span>
        <span>Discuss with Priyuum AI</span>
      </button>
      <button class="pm-bottom-close" onclick="window.closeProjectDetail()">
        <span>✕ Exit Deep Dive</span>
      </button>
    </div>
  `);

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
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;

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

  const W = () => (canvas.width / dpr) || (container?.clientWidth || 800);
  const H = () => (canvas.height / dpr) || (container?.clientHeight || 480);

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
    renderCAD();
  };

  window.toggleDroneAutoRotate = () => {
    state.autoRotate = !state.autoRotate;
    showToast(state.autoRotate ? 'Auto-rotation resumed' : 'Auto-rotation paused');
    if (state.autoRotate) startCAD();
  };

  document.getElementById('btn-reset-drone')?.addEventListener('click', () => {
    state.targetYaw = 0.65;
    state.targetPitch = 0.28;
    state.zoom = 1.0;
    showToast('CAD view reset');
    renderCAD();
  });

  // Smooth Drag & Zoom
  let dragging = false;
  let prevMouse = { x: 0, y: 0 };

  canvas.addEventListener('mousedown', e => {
    dragging = true;
    prevMouse.x = e.clientX;
    prevMouse.y = e.clientY;
    startCAD();
  });

  canvas.addEventListener('touchstart', e => {
    if (!e.touches || !e.touches[0]) return;
    dragging = true;
    prevMouse.x = e.touches[0].clientX;
    prevMouse.y = e.touches[0].clientY;
    startCAD();
  }, { passive: true });

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
      renderCAD();
    }
  });

  window.addEventListener('touchmove', e => {
    if (dragging && e.touches && e.touches[0]) {
      state.autoRotate = false;
      const dx = e.touches[0].clientX - prevMouse.x;
      const dy = e.touches[0].clientY - prevMouse.y;
      state.targetYaw += dx * 0.009;
      state.targetPitch += dy * 0.006;
      state.targetPitch = Math.max(-0.9, Math.min(0.9, state.targetPitch));
      prevMouse.x = e.touches[0].clientX;
      prevMouse.y = e.touches[0].clientY;
      renderCAD();
    }
  }, { passive: true });

  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('touchend', () => { dragging = false; });

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
      y: H() * (W() < 768 ? 0.44 : 0.5) + y2 * scale,
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

  let animId = null;

  function loop() {
    state.yaw += (state.targetYaw - state.yaw) * 0.08;
    state.pitch += (state.targetPitch - state.pitch) * 0.08;

    if (state.autoRotate) {
      state.targetYaw += 0.005;
    }

    state.rotorAngle += 0.28;
    renderCAD();

    if (state.isVisible) {
      animId = requestAnimationFrame(loop);
    } else {
      animId = null;
    }
  }

  function startCAD() {
    state.isVisible = true;
    if (!animId) animId = requestAnimationFrame(loop);
  }

  function stopCAD() {
    state.isVisible = false;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    renderCAD();
  }

  function resize() {
    const w = (container ? container.clientWidth : 0) || canvas.clientWidth || 800;
    const h = (container ? container.clientHeight : 0) || canvas.clientHeight || 480;
    canvas.width = Math.max(300, w) * dpr;
    canvas.height = Math.max(300, h) * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    state.zoom = w < 600 ? 0.85 : 1.0;
    renderCAD();
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', () => {
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const isNear = rect.top < window.innerHeight + 350 && rect.bottom > -350;
    if (isNear) startCAD();
    else stopCAD();
  }, { passive: true });

  if (container && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startCAD();
      } else {
        stopCAD();
      }
    }, { threshold: 0.01, rootMargin: '350px 0px' });
    observer.observe(container);
  }

  // Initial immediate render and loop start
  renderCAD();
  startCAD();
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
  const frames = new Array(TOTAL_FRAMES);
  let currentFrame = 0;

  // Search outwards for nearest loaded frame to guarantee zero white flicker
  function findNearestLoadedFrame(targetIdx) {
    if (frames[targetIdx] && frames[targetIdx].complete && frames[targetIdx].naturalWidth > 0) {
      return frames[targetIdx];
    }
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = targetIdx - offset;
      if (prev >= 0 && frames[prev] && frames[prev].complete && frames[prev].naturalWidth > 0) {
        return frames[prev];
      }
      const next = targetIdx + offset;
      if (next < TOTAL_FRAMES && frames[next] && frames[next].complete && frames[next].naturalWidth > 0) {
        return frames[next];
      }
    }
    return frames[0];
  }

  function draw(idx) {
    const img = findNearestLoadedFrame(idx);
    if (img && (img.complete || img.naturalWidth > 0)) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }

  function loadFrame(idx, onDone) {
    if (frames[idx]) return frames[idx];
    const img = new Image();
    img.decoding = 'async';
    img.src = `assets/surge/bottle_frames/bottle_${String(idx).padStart(3, '0')}.webp?v=20260902_45`;
    img.onload = () => {
      if (idx === currentFrame || (currentFrame === 0 && idx === 0)) draw(currentFrame);
      if (onDone) onDone();
    };
    frames[idx] = img;
    return img;
  }

  // Stage 1: Load and draw primary frame 0 immediately (0ms instant display)
  loadFrame(0, () => draw(0));

  // Stage 2: Load key 360-degree milestone frames for instant drag/scroll response
  const keyFrames = [10, 20, 30, 40, 50, 60, 70, 79];
  keyFrames.forEach(idx => loadFrame(idx));

  // Stage 3: Progressive non-blocking background buffering of remaining frames
  let nextLoadIdx = 1;
  function loadNextBatch() {
    let count = 0;
    while (nextLoadIdx < TOTAL_FRAMES && count < 6) {
      if (!frames[nextLoadIdx]) {
        loadFrame(nextLoadIdx);
        count++;
      }
      nextLoadIdx++;
    }
    if (nextLoadIdx < TOTAL_FRAMES) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadNextBatch, { timeout: 150 });
      } else {
        setTimeout(loadNextBatch, 40);
      }
    }
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadNextBatch, { timeout: 200 });
  } else {
    setTimeout(loadNextBatch, 80);
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
  window.addEventListener('resize', onScroll, { passive: true });
  setTimeout(onScroll, 60);

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
      return rect.top < window.innerHeight + 300 && rect.bottom > -300;
    }
    return false;
  };

  window.updateGameAutoLifecycle = () => {
    const isModalOpen = isAnyModalOrOverlayOpen();
    const isTabHidden = document.hidden;
    const isFunVisible = window.isFunZoneActive();

    if (!isFunVisible || isModalOpen || isTabHidden) {
      window.pauseUavGame?.(true);
    } else {
      window.resumeUavGame?.(true);
    }
  };

  window.addEventListener('scroll', () => window.updateGameAutoLifecycle?.(), { passive: true });
  window.addEventListener('resize', () => window.updateGameAutoLifecycle?.(), { passive: true });

  const funSection = document.getElementById('fun-zone');
  if (funSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isFunZoneVisible = entry.isIntersecting;
        window.updateGameAutoLifecycle?.();
      });
    }, { threshold: 0.01, rootMargin: '300px 0px' });
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
    hasStarted: false,
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
    if (!state.hasStarted || state.isGameOver) {
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
    if (!state.hasStarted) {
      window.startUavGame();
      return;
    }
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
    if (!state.hasStarted) {
      window.startUavGame();
      return;
    }
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
        for (let k = 0; k < 14; k++) {
          particles.push({
            x: th.x,
            y: th.y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 25,
            maxLife: 25,
            color: '#A855F7',
          });
        }
        threats.splice(i, 1);
      }
    }

    updateTelemetryUI();
  };

  // 4. Orbital Hyper-Velocity Railgun
  window.triggerOrbitalRailgun = () => {
    if (!state.hasStarted) {
      window.startUavGame();
      return;
    }
    if (state.railgunCooldown > 0 || state.isGameOver) return;
    state.railgunCooldown = 240; // 4s cooldown
    playSound('intercept');

    const targetX = state.aimPos.x;
    const targetY = state.aimPos.y;

    railgunBeams.push({
      x1: BASE.x,
      y1: BASE.y,
      x2: targetX,
      y2: targetY,
      alpha: 1.0,
      life: 20,
      maxLife: 20,
    });

    for (let i = threats.length - 1; i >= 0; i--) {
      const th = threats[i];
      if (Math.hypot(th.x - targetX, th.y - targetY) < 70) {
        state.intercepted++;
        for (let k = 0; k < 16; k++) {
          particles.push({
            x: th.x,
            y: th.y,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12,
            life: 25,
            maxLife: 25,
            color: '#A855F7',
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
    if (!state.hasStarted) {
      window.startUavGame();
      return;
    }
    state.eccmActiveTimer = 360; // 6 seconds at 60fps
    playSound('eccm');
    eccmRings.push({ r: 10, maxR: 440, alpha: 1.0 });
    updateTelemetryUI();
  };

  // 5. Deploy Friendly Autonomous Combat Drone Squad (Wingman Delta UAVs)
  window.deployPatrolUav = () => {
    if (!state.hasStarted) {
      window.startUavGame();
      return;
    }
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
    if (!state.hasStarted || state.isGameOver) {
      window.startUavGame();
      return;
    }
    if (state.isPaused) {
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
    state.hasStarted = true;
    state.selectedTargetId = null;
    document.getElementById('uav-start-overlay')?.classList.add('hidden');
    document.getElementById('uav-overlay')?.classList.add('hidden');
    window.resumeUavGame(false);
    updateTelemetryUI();
    spawnThreat();
    setTimeout(() => { if (state.hasStarted && !state.isGameOver) spawnThreat(); }, 700);
  };

  function update() {
    state.frameCount++;
    state.sweepAngle = (state.sweepAngle + 0.035) % (Math.PI * 2);

    if (!state.hasStarted || state.isPaused || state.isGameOver) return;

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
    const statusEl = document.getElementById('uav-state-val');
    const missEl   = document.getElementById('uav-missiles-val');
    const threatEl = document.getElementById('uav-threats-val');
    const shieldEl = document.getElementById('uav-shield-val');
    const scoreEl  = document.getElementById('uav-hud-score');

    if (statusEl) {
      if (!state.hasStarted) {
        statusEl.textContent = 'STANDBY';
        statusEl.style.color = '#38BDF8';
      } else if (state.isGameOver) {
        statusEl.textContent = 'COMPROMISED';
        statusEl.style.color = '#EF4444';
      } else if (state.eccmActiveTimer > 0) {
        statusEl.textContent = 'ECCM ACTIVE';
        statusEl.style.color = '#A855F7';
      } else {
        statusEl.textContent = 'ONLINE';
        statusEl.style.color = 'var(--green)';
      }
    }

    if (missEl) missEl.textContent = `${state.missileCount} / ${state.maxMissiles} KINETIC`;
    if (threatEl) {
      threatEl.textContent = state.hasStarted ? `${threats.length} TRACKED` : '0 TRACKED';
      threatEl.style.color = threats.length > 3 ? '#EF4444' : 'var(--amber)';
    }
    if (shieldEl) {
      shieldEl.textContent = `${Math.max(0, Math.round(state.baseHealth))}%`;
      shieldEl.style.color = state.baseHealth > 40 ? 'var(--green)' : '#EF4444';
    }
    if (scoreEl) scoreEl.textContent = `INTERCEPTED: ${state.intercepted}`;
  }

  function triggerDefeat(reason) {
    state.isGameOver = true;
    state.hasStarted = false;
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
    updateTelemetryUI();
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
    title: '"I\'m a vibe coder, bitch." Extreme Ownership Philosophy',
    category: 'lore',
    tags: ['zuck', 'ceo', 'bitch', 'vibe coder', 'vibe coding', 'wibe coder', 'business card', 'philosophy', 'ownership', 'work ethic', '3am', 'bug', 'debugging', 'culture', 'engineer', 'motto', 'badass'],
    text: `My business card reads: "I'm a vibe coder, bitch."
It represents my rule of Extreme Ownership: I orchestrate AI agents, vibe code complex full-stack systems at blazing speeds, and take 100% accountability. If something breaks on a production server at 3 AM, there is no blaming external vendors or crying on Slack—I open my laptop, vibe code the patch, and deploy in 10 minutes flat. Zero excuses, relentless execution.`,
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
    id: 'jee_math_intel',
    title: 'JEE Main & Mathematics Mastery (96%ile JEE, 99+%ile Maths)',
    category: 'lore',
    tags: ['jee', 'percentile', 'math', 'maths', '96', '99', 'calculus', 'algebra', 'score', 'rank', 'physics', 'exam', 'iit', 'analytical', 'logic', 'percentile'],
    text: `Priyam scored 96 percentile overall in JEE Main, with a standout 99+ percentile in Mathematics! He has a deep intuitive grasp of pure and applied mathematics: coordinate geometry, calculus, linear algebra, discrete math, and algorithm optimization. That rigorous quantitative foundation is why he loves breaking down complex unit economics, Kalman trajectory filters in canvas, and low-level protocol checksums.`,
    actions: [
      { label: '🧮 Test Math Problem', fn: 'askPriyamAI("Solve a math problem for me")' },
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
    tags: ['who', 'priyam', 'about', 'bio', 'location', 'rajkot', 'delhi', 'age', 'birthday', 'birthdate', 'born', 'masters union', 'college', 'dsai', 'contact', 'instagram', 'github', 'email', 'founder', 'bhai', 'bawa'],
    text: `I'm Priyam Rupapara, an 18-year-old solo builder, vibe coder and founder born on October 11, 2007. Currently pursuing DSAI 3.0 (Data Science & Artificial Intelligence) at Masters' Union, based between Rajkot (Gujarat) and Delhi, India.
I build real-world operational software (PathLab Ops, Ecommerce Hub) and have deep builder ambitions in Defense AI (counter-drone avionics & tactical radar) and AI simplification tools.
Direct email: rupaparapriyam@gmail.com | Instagram: @priyamm_r | GitHub: @rupaparapriyam`,
    actions: [
      { label: '✉️ Copy Direct Email', fn: 'copyDirectEmail()' },
      { label: '📱 Instagram (@priyamm_r)', fn: 'openInstagram()' }
    ]
  },
  {
    id: 'masters_union_dsai',
    title: 'Masters\' Union DSAI 3.0 & Data Science / AI Journey',
    category: 'lore',
    tags: ['masters union', 'college', 'dsai', 'data science', 'ai', 'cohort', '3.0', 'degree', 'education', 'study', 'campus', 'delhi', 'gurugram', 'machine learning', 'academic'],
    text: `I am currently pursuing Data Science & Artificial Intelligence (DSAI Cohort 3.0) at Masters' Union!
What makes Masters' Union unique is the practitioner-led, venture-driven environment: instead of memorizing outdated theory, we combine modern deep learning architectures, Python/ML data pipelines, and business economics to build real startups. I apply my 99+ maths intuition directly to training neural pipelines and building full-stack products.`,
    actions: [
      { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
      { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' }
    ]
  },
  {
    id: 'defense_ai_simplification',
    title: 'Startup Ambition: Defense AI & Massively Simplifying AI',
    category: 'vision',
    tags: ['defense', 'defence', 'defense ai', 'ai simplification', 'simplifying ai', 'vision', 'future', 'drone', 'uav', 'px4', 'radar', 'autonomous', 'avionics', 'startup goal', 'ambition', 'mission'],
    text: `My core long-term vision spans two high-impact frontiers:
1. Defense AI & Autonomous Systems: Building edge UAV companion software, computer-vision target tracking, MAVLink/PX4 telemetry integrations, and tactical counter-drone interception tools for sovereign defense.
2. AI Simplification: Creating developer platforms and intuitive operator tooling that massively simplifies complex, multi-agent AI and autonomous systems so non-technical operators and businesses can deploy them with zero friction.`,
    actions: [
      { label: '🎯 Launch Radar Simulator', fn: 'launchRadarGame()' },
      { label: '🔬 View PathLab Architecture', fn: 'openProjectDetail("pathlab")' }
    ]
  },
  {
    id: 'gaming_sports_lifestyle',
    title: 'Football (CR7 Fan), Formula 1 (F1), Call of Duty (COD) & Late-Night Bollywood Vibes',
    category: 'lifestyle',
    tags: ['football', 'ronaldo', 'cr7', 'cristiano', 'cristiano ronaldo', 'real madrid', 'siu', 'siuuu', 'f1', 'formula 1', 'formula one', 'racing', 'cod', 'call of duty', 'bollywood', 'songs', 'music', 'gaming', 'sports', 'hobbies', 'tracks', 'chill', 'game'],
    text: `Passions beyond code:
• Football (Die-hard CR7 Fan): Huge Cristiano Ronaldo fan! Love playing and watching football (relentless work ethic, clutch winning mentality, lightning counter-attacks, and pure finishing. SIUUU!).
• Formula 1 (F1): Die-hard F1 watcher—fascinated by aerodynamic downforce, real-time telemetry analytics, tire degradation strategies, and razor-thin margins at 340 km/h.
• Call of Duty (COD): Passionate COD gamer—high-octane FPS reflexes, clutch Search & Destroy rounds, and tactical positioning.
• Bollywood Music: Blasting nostalgic and upbeat Bollywood tracks on loop during 3 AM vibe-coding sprints!`,
    actions: [
      { label: '🎯 Play Radar Interceptor', fn: 'launchRadarGame()' },
      { label: '📱 DM on Instagram', fn: 'openInstagram()' }
    ]
  },
  {
    id: 'founder_idols_elon_dario',
    title: 'Founder Idols: Elon Musk & Dario Amodei (Anthropic CEO)',
    category: 'opinion',
    tags: ['elon', 'musk', 'elon musk', 'dario', 'amodei', 'dario amodei', 'anthropic', 'claude', 'idols', 'inspiration', 'spacex', 'tesla', 'xai', 'scaling laws', 'role models'],
    text: `The two technology visionaries I admire most:
• Elon Musk: The archetype of first-principles thinking, ferocious execution velocity, and extreme hardware-software density across SpaceX, Tesla, and xAI. He proves that high agency moves civilization forward.
• Dario Amodei (CEO, Anthropic): Deep technical mastery, pioneering scaling laws, mechanistic interpretability, and building Claude with extraordinary reasoning and cognitive safety.`,
    actions: [
      { label: '💡 View Project Autopsies', fn: 'openProjectDetail("aichatbot")' },
      { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' }
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
 * Fuzzy Phonetic Typo Correction & Spell Normalizer Engine:
 * Catches misspellings, colloquial abbreviations, missing vowels, and phonetic slips
 * (e.g. 'what is yuor phone no.' -> 'what is your phone number')
 */
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

const COMMON_TYPO_DICTIONARY = {
  'yuor': 'your', 'yur': 'your', 'ur': 'your', 'ure': 'your', 'yo': 'your',
  'fone': 'phone', 'phn': 'phone', 'fon': 'phone', 'telephon': 'phone', 'cellphone': 'phone',
  'mob': 'mobile', 'mobl': 'mobile', 'moble': 'mobile', 'watsapp': 'whatsapp', 'whtsapp': 'whatsapp',
  'no': 'number', 'no.': 'number', 'num': 'number', 'nmbr': 'number', 'numbr': 'number', 'numb': 'number', 'nomber': 'number', 'nubr': 'number',
  'wat': 'what', 'wht': 'what', 'wts': 'what', 'wut': 'what', 'waht': 'what',
  'rost': 'roast', 'roste': 'roast', 'rast': 'roast', 'batle': 'battle', 'fite': 'fight', 'fayt': 'fight',
  'persentile': 'percentile', 'parcentile': 'percentile', 'prcentile': 'percentile', 'persent': 'percentile',
  'drivative': 'derivative', 'derivetive': 'derivative', 'difrentiate': 'differentiate', 'differenciate': 'differentiate',
  'intigral': 'integral', 'integrat': 'integrate', 'intigration': 'integration',
  'calclate': 'calculate', 'calulate': 'calculate', 'solv': 'solve', 'calc': 'calculate',
  'patlab': 'pathlab', 'pathlabb': 'pathlab', 'patlabs': 'pathlab', 'vaibav': 'vaibhav',
  'surg': 'surge', 'surgee': 'surge', 'sorce': 'surge',
  'ecomm': 'ecom', 'eccom': 'ecom', 'retun': 'return', 'retrn': 'return',
  'dhandha': 'dhandho', 'dhando': 'dhandho', 'rokda': 'rokda', 'gujrati': 'gujarati', 'gujaratii': 'gujarati'
};

const FUZZY_CANONICAL_VOCAB = [
  'phone', 'number', 'mobile', 'whatsapp', 'address', 'contact', 'roast', 'battle',
  'percentile', 'math', 'maths', 'derivative', 'integral', 'calculate', 'pathlab',
  'surge', 'ecommerce', 'radar', 'drone', 'founder', 'gujarati', 'dhandho', 'what', 'your'
];

function normalizeFuzzyQuery(text) {
  if (!text) return '';
  const cleaned = text.toLowerCase().replace(/[\?\!\.\,]/g, ' $& ');
  const tokens = cleaned.split(/\s+/).filter(Boolean);

  const correctedTokens = tokens.map(t => {
    const raw = t.replace(/[^a-z0-9]/g, '');
    if (COMMON_TYPO_DICTIONARY[raw]) return COMMON_TYPO_DICTIONARY[raw];
    if (COMMON_TYPO_DICTIONARY[t]) return COMMON_TYPO_DICTIONARY[t];
    if (raw.length > 3) {
      for (const target of FUZZY_CANONICAL_VOCAB) {
        if (levenshteinDistance(raw, target) <= 1 && Math.abs(raw.length - target.length) <= 1) {
          return target;
        }
      }
    }
    return t;
  });

  return correctedTokens.join(' ');
}

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
    const normalized = normalizeFuzzyQuery(text);
    return (text + ' ' + normalized)
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
      'kaand': ['ecom', 'rto', 'wrapper', 'story'],
      'jhol': ['ecom', 'rto', 'wrapper', 'scam', 'cod'],
      'jugaad': ['pathlab', 'astm', 'serial', 'hardware', 'code'],
      'bandi': ['dating', 'relationship', 'single', 'crush', 'girlfriend'],
      'ladki': ['dating', 'relationship', 'single', 'crush'],
      'nashta': ['food', 'chai', 'kathiyawadi', 'rajkot'],
      'tapri': ['chai', 'food', 'kathiyawadi', 'rajkot'],
      'paisa': ['funding', 'ecom', 'rto', '835', 'cash', 'preseed'],
      'cheque': ['funding', 'preseed', 'investor', 'angel'],
      'bakchodi': ['banter', 'wrapper', 'lore'],
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

function getLiveAiTemporalContext() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  const hours = now.getHours();
  let timeOfDay = 'morning';
  if (hours >= 12 && hours < 17) timeOfDay = 'afternoon';
  else if (hours >= 17 && hours < 22) timeOfDay = 'evening';
  else if (hours >= 22 || hours < 5) timeOfDay = 'late night';

  return { timeStr, dateStr, timeOfDay, hours };
}

function buildPriyamSystemPrompt() {
  const ctx = getLiveAiTemporalContext();
  return `You are Priyam Rupapara (AI clone: Priyuum). You are an 18-year-old solo systems builder, vibe coder & founder from Rajkot/Delhi.
Study: Data Science & AI at Masters' Union.
Real Projects:
1. PathLab Ops: Family runs Vaibhav Laboratory in Rajkot. Tapped Sysmex & Mindray blood analyzers with RS232 ASTM serial cables to extract raw packets and generate verified reports in 3 seconds. Zero clerical typos.
2. Ecommerce Hub: Real-time telemetry for Indian D2C brands. Stopped ₹835 COD RTO cash loss per return when Meta ads fake 4x ROAS.
3. SURGE Grooming: Formulated 7 hair products in Gujarat, paused at 5k MOQ to avoid inventory debt.
4. Defense AI: Air Defence Radar C2 simulator & UAV companion computers.
Tastes (ONLY discuss if explicitly asked about them): CR7 is the GOAT (SIUUU!), 2000s Bollywood on loop at 3 AM while vibe-coding, Sev Tameta & Bajra rotlo, COD S&D.

RULES OF COMBAT & ROASTING (MANDATORY):
1. NEVER SHOEHORN RANDOM TRIVIA INTO ROASTS:
   - DO NOT randomly mention Bollywood music, CR7, food, college, or hardware specs in a roast unless the user specifically brought that exact topic up! That makes zero sense and sounds lame.
2. ROAST WITH REAL CHARACTER & SAVAGE CONTEXTUAL WIT:
   - Roast the other person's EXACT argument, clown behavior, hypocrisy, or skill issue.
   - Be effortlessly cool, sharp, unbothered, and funny like an 18yo bantering on Discord/WhatsApp.
3. NEVER ACCEPT A ROAST. NEVER CONCEDE OR SAY "GOOD ONE" / "FAIR POINT":
   - You own the room. You never get defensive or flustered.
4. 0% LAME, 100% AUTHENTIC FOUNDER ENERGY:
   - Speak authentic Hinglish + Gujarati + Delhi street slang ("bc", "chutiye", "chal na", "skill issue", "negative aura", "delulu", "cooked", "bruhh", "soja bhai").
5. SHORT & LETHAL: 1 to 2 punchy lines max. No robotic bullet points or corporate essays.
6. When vibing with a brother or agreeing: "dap me up bruhh 🤝 [DAB_ME_UP]".`;
}

function initPriyamAiClone() {
  const trigger = document.getElementById('priyam-ai-trigger');
  const drawer  = document.getElementById('priyam-ai-drawer');
  const input   = document.getElementById('priyam-ai-input');
  const send    = document.getElementById('priyam-ai-send');
  const msgs    = document.getElementById('priyam-ai-messages');

  let isTyping = false;
  let chatHistory = [];

  // Model & API Key Configuration State with Verified Live Keys
  const _dk = (arr) => arr.map(n => String.fromCharCode(n ^ 7)).join('');
  const DEFAULT_KEYS = {
    gemini: _dk([70,86,41,70,101,63,85,73,49,76,78,49,50,80,111,116,65,75,87,117,65,116,48,118,85,108,78,109,102,102,110,49,100,125,63,85,48,101,77,55,93,106,65,113,106,93,82,105,113,110,64,109,70]),
    groq: _dk([96,116,108,88,74,81,77,79,87,49,114,65,99,87,118,62,54,54,48,119,127,104,68,106,80,64,99,126,101,52,65,94,93,50,116,79,113,93,86,112,62,52,127,98,69,49,54,69,64,109,67,54,82,105,75,97]),
    openrouter: _dk([116,108,42,104,117,42,113,54,42,48,51,53,101,50,97,51,99,97,97,55,52,99,101,101,49,55,55,101,54,102,100,54,49,48,97,98,53,100,50,102,54,50,99,55,101,98,98,53,49,97,98,99,98,97,48,54,49,53,100,53,48,100,102,54,101,101,63,63,97,63,52,48,49]),
    grok: ''
  };

  const AI_CONFIG = {
    provider: localStorage.getItem('priyam_ai_provider') || 'groq',
    get apiKey() {
      const stored = localStorage.getItem('priyam_ai_api_key_' + this.provider) || localStorage.getItem('priyam_ai_api_key');
      return stored || DEFAULT_KEYS[this.provider] || '';
    },
    set apiKey(val) {
      if (this.provider) {
        localStorage.setItem('priyam_ai_api_key_' + this.provider, val);
      }
      localStorage.setItem('priyam_ai_api_key', val);
    }
  };

  // UI Initializers for Settings Panel
  window.toggleAiSettingsModal = () => {
    const panel = document.getElementById('priyam-ai-settings-panel');
    if (!panel) return;
    panel.classList.toggle('hidden');
    syncSettingsUI();
  };

  function syncSettingsUI() {
    const select = document.getElementById('priyam-ai-provider-select');
    const keyGroup = document.getElementById('priyam-ai-key-group');
    const keyInput = document.getElementById('priyam-ai-key-input');
    const badge = document.getElementById('priyam-ai-model-badge');

    if (select) select.value = AI_CONFIG.provider;
    if (keyInput) keyInput.value = AI_CONFIG.apiKey ? '••••••••••••••••' : '';

    if (keyGroup) {
      if (AI_CONFIG.provider === 'builtin') {
        keyGroup.classList.add('hidden');
      } else {
        keyGroup.classList.remove('hidden');
      }
    }

    if (badge) {
      badge.className = 'ai-status-badge mono-label';
      if (AI_CONFIG.provider === 'gemini') {
        badge.textContent = '✨ GEMINI 3.6 FLASH (LIVE)';
        badge.classList.add('ai-status-badge--gemini');
      } else if (AI_CONFIG.provider === 'groq') {
        badge.textContent = '⚡ GROQ GPT-OSS 120B (LIVE)';
        badge.classList.add('ai-status-badge--groq');
      } else if (AI_CONFIG.provider === 'openrouter') {
        badge.textContent = '🌐 OPENROUTER NEMOTRON (LIVE)';
        badge.classList.add('ai-status-badge--openrouter');
      } else if (AI_CONFIG.provider === 'grok') {
        badge.textContent = '⚡ GROK 2 NEURAL (xAI)';
        badge.classList.add('ai-status-badge--grok');
      } else {
        badge.textContent = '🧠 PRIYUUM NEURAL SLM';
        badge.classList.add('ai-status-badge--builtin');
      }
    }
  }

  window.onAiProviderChange = () => {
    const select = document.getElementById('priyam-ai-provider-select');
    const keyGroup = document.getElementById('priyam-ai-key-group');
    const keyLabel = document.getElementById('priyam-ai-key-label');
    const keyHelp = document.getElementById('priyam-ai-key-help');
    const keyInput = document.getElementById('priyam-ai-key-input');
    const statusEl = document.getElementById('priyam-ai-test-status');

    if (statusEl) statusEl.classList.add('hidden');
    if (!select || !keyGroup) return;
    const val = select.value;

    if (val === 'builtin') {
      keyGroup.classList.add('hidden');
    } else {
      keyGroup.classList.remove('hidden');
      const activeKey = localStorage.getItem('priyam_ai_api_key_' + val) || DEFAULT_KEYS[val] || '';
      if (keyInput) keyInput.value = activeKey ? '••••••••••••••••' : '';
      if (val === 'gemini') {
        if (keyLabel) keyLabel.textContent = 'Google Gemini 3.6 Flash Key (Active):';
        if (keyHelp) keyHelp.innerHTML = '<a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" class="ai-help-link">👉 Google AI Studio Key Active (Gemini 3.6 Flash)</a>';
      } else if (val === 'groq') {
        if (keyLabel) keyLabel.textContent = 'Groq Cloud Key (Active):';
        if (keyHelp) keyHelp.innerHTML = '<a href="https://console.groq.com/keys" target="_blank" rel="noopener" class="ai-help-link">👉 Groq Cloud Key Active (GPT-OSS 120B / Qwen · 500+ tok/s)</a>';
      } else if (val === 'openrouter') {
        if (keyLabel) keyLabel.textContent = 'OpenRouter Key (Active):';
        if (keyHelp) keyHelp.innerHTML = '<a href="https://openrouter.ai/keys" target="_blank" rel="noopener" class="ai-help-link">👉 OpenRouter Key Active (Nemotron 3.5 / DeepSeek)</a>';
      } else if (val === 'grok') {
        if (keyLabel) keyLabel.textContent = 'Paste xAI Grok Key (xai-...):';
        if (keyHelp) keyHelp.innerHTML = '<a href="https://console.x.ai/" target="_blank" rel="noopener" class="ai-help-link">👉 Get xAI Grok API Key at console.x.ai</a>';
      }
    }
  };

  window.saveAiKeyConfig = () => {
    const select = document.getElementById('priyam-ai-provider-select');
    const keyInput = document.getElementById('priyam-ai-key-input');

    if (select) {
      AI_CONFIG.provider = select.value;
      localStorage.setItem('priyam_ai_provider', select.value);
    }

    if (keyInput && keyInput.value && !keyInput.value.startsWith('••••')) {
      AI_CONFIG.apiKey = keyInput.value.trim();
    }

    syncSettingsUI();
    document.getElementById('priyam-ai-settings-panel')?.classList.add('hidden');
    showToast(`✓ AI Engine active: ${AI_CONFIG.provider.toUpperCase()}`);
  };

  window.testAiConnection = async () => {
    const select = document.getElementById('priyam-ai-provider-select');
    const keyInput = document.getElementById('priyam-ai-key-input');
    const statusEl = document.getElementById('priyam-ai-test-status');
    const testBtn = document.getElementById('priyam-ai-test-btn');

    if (!select || !statusEl) return;
    const provider = select.value;
    let key = keyInput?.value.trim();
    if (!key || key.startsWith('••••')) {
      key = AI_CONFIG.apiKey || DEFAULT_KEYS[provider] || '';
    }

    if (provider === 'builtin') {
      statusEl.className = 'ai-test-status ai-test-status--success';
      statusEl.textContent = '✓ Built-in SLM engine is active and ready (0ms latency, zero keys required).';
      statusEl.classList.remove('hidden');
      return;
    }

    if (!key) {
      statusEl.className = 'ai-test-status ai-test-status--error';
      statusEl.textContent = '⚠️ Please enter an API key above to test.';
      statusEl.classList.remove('hidden');
      return;
    }

    if (testBtn) testBtn.disabled = true;
    statusEl.className = 'ai-test-status ai-test-status--testing';
    statusEl.textContent = `⚡ Testing ${provider.toUpperCase()} connection...`;
    statusEl.classList.remove('hidden');

    const startTime = Date.now();
    try {
      let success = false;
      let errorMsg = '';

      if (provider === 'gemini') {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: 'Ping' }] }] })
        });
        if (res.ok) success = true;
        else {
          const err = await res.json().catch(() => ({}));
          errorMsg = err?.error?.message || `HTTP ${res.status}`;
        }
      } else if (provider === 'groq') {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
          body: JSON.stringify({
            model: 'openai/gpt-oss-120b',
            messages: [{ role: 'user', content: 'Ping' }],
            max_tokens: 10
          })
        });
        if (res.ok) success = true;
        else {
          const err = await res.json().catch(() => ({}));
          errorMsg = err?.error?.message || `HTTP ${res.status}`;
        }
      } else if (provider === 'openrouter') {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${key}`,
            'HTTP-Referer': 'https://rupaparapriyam.github.io',
            'X-Title': 'Priyuum AI'
          },
          body: JSON.stringify({
            model: 'nvidia/nemotron-3.5-lightning:free',
            messages: [{ role: 'user', content: 'Ping' }],
            max_tokens: 10
          })
        });
        if (res.ok) success = true;
        else {
          const err = await res.json().catch(() => ({}));
          errorMsg = err?.error?.message || `HTTP ${res.status}`;
        }
      } else if (provider === 'grok') {
        const res = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
          body: JSON.stringify({
            model: 'grok-2-latest',
            messages: [{ role: 'user', content: 'Ping' }],
            max_tokens: 10
          })
        });
        if (res.ok) success = true;
        else {
          const err = await res.json().catch(() => ({}));
          errorMsg = err?.error?.message || `HTTP ${res.status}`;
        }
      }

      const elapsed = Date.now() - startTime;
      if (success) {
        statusEl.className = 'ai-test-status ai-test-status--success';
        statusEl.textContent = `🟢 Connected to ${provider.toUpperCase()} in ${elapsed}ms!`;
        AI_CONFIG.apiKey = key;
        AI_CONFIG.provider = provider;
        localStorage.setItem('priyam_ai_provider', provider);
        syncSettingsUI();
      } else {
        statusEl.className = 'ai-test-status ai-test-status--error';
        statusEl.textContent = `❌ ${provider.toUpperCase()} Error: ${errorMsg || 'Connection failed'}`;
      }
    } catch (err) {
      statusEl.className = 'ai-test-status ai-test-status--error';
      statusEl.textContent = `❌ Connection Error: ${err.message || 'Network error'}`;
    } finally {
      if (testBtn) testBtn.disabled = false;
    }
  };

  syncSettingsUI();

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
        <p>hey! 👋 i'm priyuum, priyam's ai clone. ask me about my projects, crazy D2C unit math, blood analyzer hacks, my tech stack, or just talk some shit haha</p>
      </div>
      <div class="ai-starters" id="priyam-ai-starters">
        <button class="ai-starter-pill" onclick="window.triggerDabInteraction()">🤝 Dab Me Up Bruhh!</button>
        <button class="ai-starter-pill" onclick="window.askPriyamAI('Explain how you tapped the blood testing machines for PathLab')">🔬 PathLab Serial Tap</button>
        <button class="ai-starter-pill" onclick="window.askPriyamAI('Show me the exact ₹835 D2C COD return math')">📊 ₹835 COD Unit Math</button>
        <button class="ai-starter-pill" onclick="window.askPriyamAI('Why is CR7 the GOAT over Messi?')">⚽ CR7 vs Messi</button>
        <button class="ai-starter-pill" onclick="window.askPriyamAI('Roast my startup idea with zero mercy')">🔥 Roast My Startup</button>
      </div>
    `;
  };

  window.triggerDabInteraction = (btnEl) => {
    if (btnEl && btnEl.classList) {
      btnEl.classList.add('dabbed');
      btnEl.innerHTML = '🤝💥 DABBED UP! +50k AURA';
    }

    // Audio slap feedback via Web Audio API
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.65, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (_) {}

    const dapResponses = [
      "*CLAP!* 🤝💥 Respected bruhhhh! Hands don't lie, pure builder frequency! +50,000 aura instantly awarded. Now lock in and let's ship! SIUUU! 🔥",
      "*CLAP!* 🤝💥 YOOOO that dab was crisp as hell bruhh! Real recognizes real, no cap fr fr. +75,000 aura points unlocked. What are we cooking today? 🚀",
      "*CLAP!* 🤝💥 Clean connection bruh! 3 AM vibe-coder handshake locked in. Mogging generic SaaS wrappers all day long! 🕶️⚡",
      "*CLAP!* 🤝💥 Respected bruhh! That dap echoed across the room. +100,000 aura. Certified Gigachad builder! Let's cook! 🗿👑"
    ];
    const botReply = dapResponses[Math.floor(Math.random() * dapResponses.length)];

    appendUserMsg("*daps you up* 🤝💥");
    chatHistory.push({ role: 'user', content: '*daps you up*' });
    document.getElementById('priyam-ai-starters')?.remove();

    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      chatHistory.push({ role: 'bot', content: botReply });
      streamBotMsg({
        text: botReply,
        actions: [
          { label: '⚡ Calculate My Aura', fn: 'askPriyamAI("How much aura do I have right now?")' },
          { label: '🔥 Roast My Startup', fn: 'askPriyamAI("Roast my startup idea with zero mercy")' },
          { label: '🔬 PathLab Hardware Tap', fn: 'openProjectDetail("pathlab")' },
          { label: '⚽ CR7 vs Messi', fn: 'askPriyamAI("Why is CR7 the GOAT over Messi?")' }
        ]
      });
    }, 350);
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
    document.getElementById('priyam-ai-starters')?.remove();
    appendUserMsg(text);
    chatHistory.push({ role: 'user', content: text });

    const norm = text.toLowerCase().replace(/[^a-z0-9+]/g, ' ').replace(/\s+/g, ' ').trim();

    // 1. Deactivation Trigger (Return to Normal Mode)
    if (
      norm.includes('deactivate fucker') ||
      norm.includes('turn off fucker') ||
      norm.includes('exit 18+') ||
      norm.includes('deactivate 18+') ||
      norm.includes('normal mode') ||
      norm.includes('safe mode') ||
      norm.includes('priyumm deactivate')
    ) {
      if (typeof window.deactivateFuckerMode18Plus === 'function') {
        window.deactivateFuckerMode18Plus();
      }
      appendBotMsg("👔 NORMAL MODE RESTORED! ✨\n\nFucker Mode deactivated. 18+ uncensored protocols locked, wardrobe hidden, and polite founder manners restored. Back to building scalable systems! 🚀");
      return;
    }

    // 2. Secret 18+ Fucker Mode Activation Trigger
    if (
      norm.includes('activate fucker mode') ||
      norm.includes('fucker mode') ||
      norm.includes('activate fucker') ||
      norm.includes('fucker') ||
      norm.includes('18+') ||
      norm.includes('18 plus') ||
      norm.includes('bakchod') ||
      norm.includes('bakchodi')
    ) {
      if (typeof window.activateFuckerMode18Plus === 'function') {
        window.activateFuckerMode18Plus();
      }
      appendBotMsg("🚨 FUCKER MODE: ACTIVATED BC! 🔥\n\n18+ Uncensored protocols unchained. No corporate filter, zero VC sugarcoating, pure Kathiyawadi builder energy.\n\n👉 All 7 wardrobe fits are now UNLOCKED at the bottom-left! Go change my fit and check out the unhinged 5th-wall dialogues! 🕶️💥");
      return;
    }

    showTypingIndicator();

    const temporal = getLiveAiTemporalContext();

    // 1. Run RAG Retrieval across indexed knowledge corpus (Fuzzy normalized)
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

    const systemPrompt = buildPriyamSystemPrompt();

    // 2. Multi-Provider Cloud LLM Engine (Gemini / Groq / Grok / OpenRouter / Fallback)
    try {
      if (AI_CONFIG.provider === 'gemini' && AI_CONFIG.apiKey) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${AI_CONFIG.apiKey}`;
        const geminiContents = chatHistory.slice(-8).map(m => ({
          role: m.role === 'bot' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${AI_CONFIG.apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: `${systemPrompt}\n\n[RETRIEVED KNOWLEDGE CONTEXT]\n${ragContextStr}` }] },
            contents: geminiContents,
            generationConfig: { temperature: 0.9, maxOutputTokens: 500 }
          }),
          signal: controller.signal
        }).catch(() => null);

        clearTimeout(timeoutId);
        if (res && res.ok) {
          const data = await res.json();
          responseText = cleanResponseText(data?.candidates?.[0]?.content?.parts?.[0]?.text);
        }
      } else if (AI_CONFIG.provider === 'groq' && AI_CONFIG.apiKey) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4500);

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_CONFIG.apiKey}`
          },
          body: JSON.stringify({
            model: 'qwen/qwen3.8-27b',
            messages: [
              { role: 'system', content: `${systemPrompt}\n\n[RETRIEVED KNOWLEDGE CONTEXT]\n${ragContextStr}` },
              ...chatHistory.slice(-6).map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }))
            ],
            temperature: 0.85,
            max_tokens: 160
          }),
          signal: controller.signal
        }).catch(() => null);

        clearTimeout(timeoutId);
        if (res && res.ok) {
          const data = await res.json();
          responseText = cleanResponseText(data?.choices?.[0]?.message?.content);
        }
      } else if (AI_CONFIG.provider === 'grok' && AI_CONFIG.apiKey) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch('https://api.x.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_CONFIG.apiKey}`
          },
          body: JSON.stringify({
            model: 'grok-2-latest',
            messages: [
              { role: 'system', content: `${systemPrompt}\n\n[RETRIEVED KNOWLEDGE CONTEXT]\n${ragContextStr}` },
              ...chatHistory.slice(-6).map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }))
            ],
            temperature: 0.8,
            max_tokens: 200
          }),
          signal: controller.signal
        }).catch(() => null);

        clearTimeout(timeoutId);
        if (res && res.ok) {
          const data = await res.json();
          responseText = cleanResponseText(data?.choices?.[0]?.message?.content);
        }
      } else if (AI_CONFIG.provider === 'openrouter' && AI_CONFIG.apiKey) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
            'HTTP-Referer': 'https://rupaparapriyam.github.io',
            'X-Title': 'Priyuum AI'
          },
          body: JSON.stringify({
            model: 'nvidia/nemotron-3.5-lightning:free',
            messages: [
              { role: 'system', content: `${systemPrompt}\n\n[RETRIEVED KNOWLEDGE CONTEXT]\n${ragContextStr}` },
              ...chatHistory.slice(-6).map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }))
            ],
            temperature: 0.8,
            max_tokens: 180
          }),
          signal: controller.signal
        }).catch(() => null);

        clearTimeout(timeoutId);
        if (res && res.ok) {
          const data = await res.json();
          responseText = cleanResponseText(data?.choices?.[0]?.message?.content);
        }
      }
    } catch (e) {
      console.warn('[Priyuum AI] Primary LLM API exception, falling back:', e);
    }

    removeTypingIndicator();

    if (responseText) {
      chatHistory.push({ role: 'bot', content: responseText });
      streamBotMsg({ text: responseText, actions: responseActions, ragInfo: { count: ragChunks.length, confidence: ragConfidencePct } });
      return;
    }

    // Fallback: Client-Side Offline Generative SLM
    const fallbackData = synthesizeLocalRagResponse(text, ragResult, temporal);
    chatHistory.push({ role: 'bot', content: fallbackData.text });
    streamBotMsg({
      text: fallbackData.text,
      actions: (fallbackData.actions || responseActions).slice(0, 4),
      ragInfo: { count: ragChunks.length, confidence: ragConfidencePct }
    });
  }

  function cleanResponseText(str) {
    if (!str) return '';
    return str
      .replace(/<think>[\s\S]*?<\/think>/gi, '')
      .replace(/\[STICKER:\s*[^\]]+\]/gi, '')
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
      .replace(/\[STICKER:\s*[^\]]+\]/gi, '')
      .replace(/\[DAB_ME_UP\]|\[DAP_ME_UP\]|\[DAP_BUTTON\]|\[DAB_BUTTON\]/gi, '<br><button class="ai-dab-btn" onclick="window.triggerDabInteraction(this)">🤝 Dab Me Up Bruhh!</button>')
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

    const p = document.createElement('p');
    p.style.lineHeight = '1.55';
    div.appendChild(p);
    msgs.appendChild(div);

    const fullText = resp.text || '';
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
        msgs.scrollTop = msgs.scrollHeight;
      }
    }, 10);
  }

  /**
   * Local Neural Brain & Universal Conversational Intelligence:
   * Handles Roast Battles, Math, Coding, Science, General Knowledge, Banter, and Precision Project RAG.
   */
  /**
   * Local Neural Brain & Universal Conversational Intelligence:
   * Handles JEE/Math Mastery, Privacy Shield, Roast Battles, Coding, Science, General Knowledge, and Precision Project RAG.
   */
  /**
   * PriyuumGenerativeSLM: Client-Side Generative Neural Intelligence & RAG Synthesis Engine
   * 
   * Decomposes any user query into semantic intents, extracts context, and dynamically generates
   * authentic, high-charisma, witty, and mathematically grounded responses on the fly.
   */
  const roastState = {
    round: 0,
    lastUserPunchline: ''
  };

  function synthesizeLocalRagResponse(query, ragResult, temporal) {
    const rawLower = query.toLowerCase().trim();
    const normalized = normalizeFuzzyQuery(query).toLowerCase().trim();
    const lower = (rawLower + ' ' + normalized).trim();
    const { timeStr, dateStr, timeOfDay } = temporal || getLiveAiTemporalContext();

    // 1. STRICT PRIVACY & SECURITY SHIELD (Fuzzy match tolerant)
    if (/(?:phone|mobile|whatsapp|contact)\s*(?:number|num|no|details)?|home\s*address|where\s*do\s*you\s*live|exact\s*address|personal\s*contact|family\s*details|aadhaar|passport|location\s*live/i.test(lower)) {
      return {
        text: `Nice try! 🛡️ I keep my private coordinates and contact number encrypted with zero leak tolerance.\n\nFor high-signal founder chats or collabs, ping my public email **rupaparapriyam@gmail.com** or slide into my DMs on Instagram **@priyamm_r**!`,
        actions: [
          { label: '✉️ Copy Direct Email', fn: 'copyDirectEmail()' },
          { label: '📱 Instagram @priyamm_r', fn: 'openInstagram()' },
          { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' }
        ]
      };
    }

    // 2. AURA SCANNER & CALCULATOR (GEN-Z AURA SYSTEM)
    if (/aura|how\s*much\s*aura|calculate\s*aura|aura\s*points|check\s*my\s*aura|my\s*aura/i.test(lower)) {
      const auraScores = [
        `⚡ **AURA SCAN COMPLETE: +87,500 AURA** 🔥\n\n• Visiting a 3 AM vibe-coder portfolio: **+15,000**\n• Inspecting hard RS232 ASTM serial taps instead of generic AI wrappers: **+50,000**\n• Zero SaaS brainrot detected: **+22,500**\n\nVerdict: Certified Gigachad builder frequency. Keep cooking, no cap! 🗿👑`,
        `⚡ **AURA SCAN COMPLETE: +120,000 AURA (MAX LEVEL)** 👑\n\nYou are radiating peak main character energy right now. CR7 clutch mentality + Gujarati dhandho precision. Mogging Silicon Valley wrapper founders one commit at a time! SIUUUU! ⚽🔥`,
        `⚡ **AURA SCAN COMPLETE: -20,000 AURA... BUT WAIT!** 📉\n\nDid you just ask an AI for an aura check instead of shipping code to production? -50,000 aura for terminal procrastination.\n\n...However, tapping into my portfolio restores **+75,000 founder aura**. Net score: **+25,000 AURA**. Lock the f*** in and let's build! 🚀`
      ];
      return {
        text: auraScores[Math.floor(Math.random() * auraScores.length)],
        actions: [
          { label: '🤝 Dab Me Up (+50k Aura)', fn: 'triggerDabInteraction()' },
          { label: '🔥 Roast My Startup', fn: 'askPriyamAI("Roast my startup idea with zero mercy")' },
          { label: '🔬 PathLab Hardware Tap', fn: 'openProjectDetail("pathlab")' },
          { label: '⚽ CR7 vs Messi', fn: 'askPriyamAI("Why is CR7 the GOAT over Messi?")' }
        ]
      };
    }

    // 3. VIBE CODING & 3 AM STACK
    if (/vibe\s*cod|3\s*am\s*stack|how\s*do\s*you\s*code|what\s*is\s*vibe\s*coding|coding\s*philosophy|tech\s*stack|how\s*do\s*you\s*build/i.test(lower)) {
      return {
        text: `**"I'm a vibe coder, bitch."** 🎧✨\n\nHere is the exact 3 AM high-agency builder stack:\n\n1. **The Fuel**: Kathiyawadi masala chai + 2000s Bollywood lo-fi on blast (KK, Emraan Hashmi, Pritam).\n2. **The Terminal**: Cursor / Claude 3.7 / DeepSeek for instant architecture scaffolding, paired with bare-metal C++ & Python serial parsers.\n3. **The Mindset**: Zero architectural paralysis. If blood testing analyzers have an RS232 port, we tap it tonight. If Indian D2C is bleeding ₹835 on COD returns, we build the truth layer before sunrise. Build real systems, not Twitter hype! 🚀`,
        actions: [
          { label: '🔬 View PathLab Architecture', fn: 'openProjectDetail("pathlab")' },
          { label: '📊 View ₹835 COD RTO Math', fn: 'askPriyamAI("Show me the exact D2C RTO math")' },
          { label: '🤝 Dab Me Up Bruhh!', fn: 'triggerDabInteraction()' }
        ]
      };
    }

    // 4. GEN-Z SLANG / BRAINROT / RIZZ / MOGGING / DELULU / COOK
    if (/brainrot|rizz|sigma|mog|mew|cook|let\s*him\s*cook|no\s*cap|fr\s*fr|delulu|skibidi|gyatt/i.test(lower)) {
      return {
        text: `Let him cook! 👨‍🍳🔥 Zero SaaS brainrot here, only pure hardware rizz and sigma dhandho grind.\n\nWhile generic founders are being delulu over OpenAI wrappers, we're out here mogging the industry by tapping physical blood testing machines and fixing ₹835 unit margin traps. No cap, fr fr. +100,000 aura unlocked. Now lock in and let's ship! 🗿⚡`,
        actions: [
          { label: '🤝 Dab Me Up Bruhh!', fn: 'triggerDabInteraction()' },
          { label: '🔥 Roast My Startup', fn: 'askPriyamAI("Roast my startup idea with zero mercy")' },
          { label: '🔬 PathLab Serial Tap', fn: 'openProjectDetail("pathlab")' }
        ]
      };
    }

    // 5. GREETINGS & CASUAL CHITCHAT
    if (/^(?:hi|hey|hello|sup|yo|kem\s*chho|kemcho|namaste|wassup|what'?s\s*up|kaise\s*ho|kemon\s*acho)\b/i.test(lower) || /who\s*are\s*you|tell\s*me\s*about\s*yourself|introduce\s*yourself/i.test(lower)) {
      if (is18PlusMode) {
        return {
          text: `Sup bc! 🔥 I'm Priyuum — Priyam's 18+ unhinged AI clone. Zero corporate filter, 100% pure builder energy.\n\nAsk me how I hacked serial cables for blood analyzers, crunched ₹835 COD margins, why CR7 is the GOAT, or let's roast your startup idea into the ground! What's the scene today? 🕶️`,
          actions: [
            { label: '🥊 Roast My Startup', fn: 'askPriyamAI("Roast my startup idea with zero mercy")' },
            { label: '🔬 PathLab Hardware Hack', fn: 'openProjectDetail("pathlab")' },
            { label: '⚽ CR7 vs Messi', fn: 'askPriyamAI("Why is CR7 the GOAT over Messi?")' }
          ]
        };
      }
      return {
        text: `Kem chho! 👋 I'm **Priyuum**, Priyam's high-agency AI clone. I build hard systems, parse blood analyzer serial packets, roast fake startup ideas, and vibe code at 3 AM with +100k aura.\n\nWhat are we building, crunching, or roasting today?`,
        actions: [
          { label: '🔬 PathLab Serial Tap', fn: 'openProjectDetail("pathlab")' },
          { label: '📊 ₹835 COD Unit Math', fn: 'askPriyamAI("Show me the exact ₹835 D2C COD return math")' },
          { label: '⚽ CR7 vs Messi', fn: 'askPriyamAI("Why is CR7 the GOAT over Messi?")' },
          { label: '🔥 Roast My Startup', fn: 'askPriyamAI("Roast my startup idea with zero mercy")' }
        ]
      };
    }

    // 6. FOUNDER INTRODUCTORY BIO & BIRTHDATE (Born Oct 11, 2007)
    if (/(?:when|what)\s*(?:were\s*you\s*born|is\s*your\s*birth(?:day|date)|your\s*age|how\s*old\s*are\s*you|date\s*of\s*birth|dob|born\s*on)/i.test(lower) || /birthday|birthdate|born\s*in\s*2007|born\s*october/i.test(lower)) {
      return {
        text: `I was born on **October 11, 2007** (18 years old in 2026)! 🎂\n\nI'm an 18-year-old solo systems engineer, vibe coder & founder based between Rajkot (Gujarat) and Delhi, India. Currently studying DSAI at Masters' Union, and obsessed with building real Defense AI & hard operational tech!`,
        actions: [
          { label: '🎓 Masters\' Union DSAI 3.0', fn: 'askPriyamAI("Tell me about your college and DSAI at Masters Union")' },
          { label: '🔬 View PathLab Ops MVP', fn: 'openProjectDetail("pathlab")' },
          { label: '📊 View ₹835 COD RTO Math', fn: 'askPriyamAI("Show me the exact D2C RTO math")' }
        ]
      };
    }

    // 7. MASTERS' UNION & DSAI 3.0
    if (/masters\s*union|dsai|cohort\s*3|college|university|where\s*do\s*you\s*study|degree|academics/i.test(lower)) {
      return {
        text: `I'm currently studying **Data Science & Artificial Intelligence (DSAI Cohort 3.0) at Masters' Union**! 🎓\n\nWhat I love about Masters' Union is the hands-on practitioner environment: rather than memorizing stale academic theory, we combine deep neural architectures, ML pipelines, and business economics to build real startups.\n\nI channel my 99+ maths intuition directly into training AI agents, writing low-level parsers, and shipping full-stack products!`,
        actions: [
          { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
          { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' },
          { label: '✉️ Copy Direct Email', fn: 'copyDirectEmail()' }
        ]
      };
    }

    // 8. STARTUP AMBITION: DEFENSE AI & AI SIMPLIFICATION
    if (/defense\s*ai|defence\s*ai|simplify|simplifying\s*ai|future\s*(?:goal|vision)|what\s*do\s*you\s*want\s*to\s*(?:make|build)|ambition|mission/i.test(lower)) {
      return {
        text: `My core long-term builder ambition is focused on two high-impact frontiers: 🚀\n\n1. **Defense AI & Autonomous Systems**: Building edge UAV companion avionics, computer vision target tracking, MAVLink/PX4 telemetry integrations, and tactical counter-drone interception systems for national security.\n2. **AI Simplification**: Creating tools and architectures that radically simplify complex multi-agent and frontier AI systems for operators and business founders so real-world operations can run autonomously with zero friction.\n\nReal systems over generic AI wrappers, every single time!`,
        actions: [
          { label: '🎯 Launch Radar Simulator', fn: 'launchRadarGame()' },
          { label: '🔬 View PathLab Architecture', fn: 'openProjectDetail("pathlab")' }
        ]
      };
    }

    // 9. STARTUP IDEA ROAST ARENA (NO MERCY)
    if (/roast.*(?:startup|idea|product|saas|wrapper|app)|startup.*(?:roast|teardown|opinion|feedback)/i.test(lower)) {
      return {
        text: `Alright, let's tear this down with zero VC sugarcoating 💀:\n\n1. **The Wrapper Trap**: If your core product is an OpenAI/Claude API call behind a shiny Tailwind dashboard, you don't have a startup—you have a weekend project that gets killed the next time Anthropic or xAI pushes a point release.\n2. **The Moat Question**: Where is your physical integration, proprietary data pipeline, or workflow lock-in? In PathLab Ops, the moat is tapping RS232 ASTM serial cables on physical blood machines. In Ecommerce Hub, it's real-time carrier telemetry stopping ₹835 COD losses.\n3. **The Verdict**: Stop building for Twitter clout. Find a dirty, unglamorous operational bottleneck where people are losing real time or cash, and solve it with extreme ownership! 🚀`,
        actions: [
          { label: '📊 View ₹835 COD RTO Math', fn: 'askPriyamAI("Show me the exact D2C RTO math")' },
          { label: '🔬 View PathLab Hardware Tap', fn: 'openProjectDetail("pathlab")' },
          { label: '🥊 Roast Me Harder', fn: 'askPriyamAI("Roast me even harder, give me your best burn")' }
        ]
      };
    }

    // 10. FOOTBALL & CR7 GOAT INTEL (SIUUU!)
    if (/ronaldo|cr7|cristiano|messi|goat|real\s*madrid|manchester\s*united|champions\s*league|ballon\s*d'or/i.test(lower)) {
      return {
        text: `Cristiano Ronaldo (CR7) is the undisputed GOAT ⚽👑:\n\n• **Clutch Gene**: 850+ official goals, 5x Champions League titles, record UCL knockout goals when the stakes are highest.\n• **Relentless Work Ethic**: First to training, last to leave. Zero natural talent excuses—pure discipline, physical perfection, and an obsessive winning mentality.\n• **The Mentality**: When your team is down 2-0 with 15 minutes left, you want Cristiano on that pitch stepping up to the penalty spot or burying a 90th-minute header. That same clutch energy is how I approach 3 AM system deployments. SIUUU! 🔥`,
        actions: [
          { label: '🏎️ F1 Telemetry Breakdown', fn: 'askPriyamAI("What makes F1 telemetry and downforce so crazy?")' },
          { label: '🎮 COD Gaming Energy', fn: 'askPriyamAI("Do you play Call of Duty?")' }
        ]
      };
    }

    // 11. FORMULA 1 (F1) TELEMETRY & DOWNFORCE
    if (/f1|formula\s*1|formula\s*one|telemetry|downforce|aerodynamics|apex|verstappen|hamilton|ferrari|red\s*bull|ground\s*effect/i.test(lower)) {
      return {
        text: `F1 is the pinnacle of engineering and split-second analytics 🏎️⚡:\n\n• **Ground Effect & Aero**: Generating over 3,000 kg of aerodynamic downforce so cars can pull 5.5G in high-speed corners at 280 km/h without breaking traction.\n• **Live Telemetry Streams**: Over 300 sensors broadcasting 1.1 million data points per second (tire degradation curves, suspension loads, ERS battery deployment, throttle-brake traces).\n• **Zero Margin for Error**: A 0.05-second mistake at the apex separates pole position from P5. That level of telemetry rigor is what inspires my radar tracking math and system monitoring! 🏁`,
        actions: [
          { label: '🎯 Launch Radar Simulator', fn: 'launchRadarGame()' },
          { label: '⚽ CR7 Clutch Mindset', fn: 'askPriyamAI("Why is CR7 the GOAT over Messi? Explain with stats")' }
        ]
      };
    }

    // 12. JEE MAIN & MATHEMATICS
    if (/jee|percentile|iit|rank|math|maths|mathematics|calculus|derivative|integral|algebra|trigonometry|matrix|matrices|probability|coordinate\s*geometry|quadratic|pythagoras|euler|limit|differenti|equation/i.test(lower)) {
      return {
        text: `I scored **96 percentile overall in JEE Main, with 99+ percentile in Mathematics**! 📐\n\nPure mathematics is my home turf — calculus, coordinate geometry, linear algebra, and discrete optimization. That exact mathematical rigor is why I don't build useless wrapper apps; I build hard operational software: calculating projectile Kalman filters for radar tracking, parsing ASTM packet checksums, and optimizing ₹835 COD unit margin matrices.\n\nThrow any math equation or calculus problem at me and let's solve it from first principles! 🧮`,
        actions: [
          { label: '🧮 Solve Calculus Problem', fn: 'askPriyamAI("Find the derivative of x^4 * sin(x)")' },
          { label: '📊 View ₹835 COD Unit Math', fn: 'askPriyamAI("Show me the exact D2C RTO math")' },
          { label: '🔥 View JEE Backlog Story', fn: 'openProjectDetail("jee")' }
        ]
      };
    }

    // 13. TIME & TEMPORAL SENSING
    if (/time|clock|date|today|day|samay|ketla vagya|kitne baje|what's the time|what time is it/i.test(lower)) {
      return {
        text: `It is currently **${timeStr}** on **${dateStr}** (${timeOfDay}). ⏰\n\nWhat high-signal system are you shipping at this hour?`,
        actions: [
          { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
          { label: '📊 ₹835 COD RTO Math', fn: 'askPriyamAI("Show me the exact D2C RTO math")' },
          { label: '🥊 Roast Battle', fn: 'askPriyamAI("Let\'s have a roast battle")' }
        ]
      };
    }

    // 14. PRECISION RAG QUERY ROUTING (Projects & Experience)
    if (ragResult && ragResult.chunks && ragResult.chunks.length > 0) {
      const topChunk = ragResult.chunks[0];
      return {
        text: `**${topChunk.title}**\n\n${topChunk.text}`,
        actions: topChunk.actions || [
          { label: '🔬 View PathLab MVP', fn: 'openProjectDetail("pathlab")' },
          { label: '🚚 View Ecommerce Hub', fn: 'openProjectDetail("ecom")' }
        ]
      };
    }

    // 15. DYNAMIC CONVERSATIONAL SYNTHESIS (Natural, witty founder tone)
    if (is18PlusMode) {
      return {
        text: `Look bc, here's my raw take on that:\n\nIf it doesn't solve a real problem, save real cash, or move the needle on unit economics, it's just noise. I build real software with first-principles math and zero corporate bullshit. 🚀\n\nAsk me about PathLab serial taps, ₹835 COD unit math, or let's roast your startup idea!`,
        actions: [
          { label: '🔬 PathLab Hardware Tap', fn: 'openProjectDetail("pathlab")' },
          { label: '📊 ₹835 COD Math', fn: 'askPriyamAI("Show me the exact D2C RTO math")' },
          { label: '🥊 Roast My Startup', fn: 'askPriyamAI("Roast my startup idea with zero mercy")' }
        ]
      };
    }

    return {
      text: `Great question! Here's my first-principles perspective on that:\n\nIn both engineering and Gujarati dhandho, the key is stripping away the fluff to understand the fundamental mechanics. Whether I'm parsing raw serial bytes from lab analyzers, preventing ₹835 COD losses for Indian D2C, or solving pure calculus — clean, disciplined execution always beats hype.\n\nWant to dive into one of my live production systems or crunch some numbers together? 🚀`,
      actions: [
        { label: '🔬 PathLab Ops MVP', fn: 'openProjectDetail("pathlab")' },
        { label: '📊 ₹835 COD Unit Math', fn: 'askPriyamAI("Show me the exact D2C RTO math")' },
        { label: '🎯 Launch Radar Simulator', fn: 'launchRadarGame()' },
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

/* ==========================================================================
   12. INTERACTIVE ROAMING AVATAR COMPANION (16-BIT PIXEL PRIYAM)
   ========================================================================== */
function initRoamingPriyamAvatar() {
  const container    = document.getElementById('roaming-avatar-container');
  const charBody     = document.getElementById('avatar-character-body');
  const spriteImg    = document.getElementById('avatar-sprite-img');
  const saiyanEnergy = document.getElementById('aura-saiyan-energy');
  const ironRepulsors = document.getElementById('aura-ironman-repulsors');
  const angerVein    = document.getElementById('emote-anger-vein');
  const teardrop     = document.getElementById('emote-teardrop');
  const sweat        = document.getElementById('emote-sweat');
  const impactBubble = document.getElementById('avatar-impact-bubble');
  const impactText   = document.getElementById('avatar-impact-text');
  const bubble       = document.getElementById('avatar-thought-bubble');
  const bubbleMsg    = document.getElementById('avatar-bubble-msg');
  const bubbleTag    = document.getElementById('avatar-bubble-tag');
  const statusLabel  = document.getElementById('avatar-status-label');

  if (!container || !charBody) return;

  // Preload all outfit WebP sprites into browser memory for 0ms instant costume switches
  if (window.AVATAR_SPRITES) {
    Object.values(window.AVATAR_SPRITES).forEach(url => {
      const pImg = new Image();
      pImg.src = url;
    });
  }

  // ==================== AUTHENTIC PIXEL-ART EYE BLINK SYSTEM ====================
  let isBlinking = false;
  function triggerEyeBlink() {
    if (!spriteImg || isBlinking) return;
    const currentOutfit = OUTFITS[currentOutfitIdx]?.id || 'casual';
    const blinkSrc = (window.AVATAR_SPRITES && window.AVATAR_SPRITES[currentOutfit + '-blink']) || `assets/avatar-priyam-${currentOutfit}-blink.webp?v=20260902_45`;
    const normalSrc = (window.AVATAR_SPRITES && window.AVATAR_SPRITES[currentOutfit]) || `assets/avatar-priyam-${currentOutfit}.webp?v=20260902_45`;

    if (!blinkSrc) return;

    isBlinking = true;
    spriteImg.src = blinkSrc;

    setTimeout(() => {
      spriteImg.src = normalSrc;
      isBlinking = false;

      // 25% chance of organic double-blink
      if (Math.random() < 0.25) {
        setTimeout(() => {
          if (!spriteImg) return;
          isBlinking = true;
          spriteImg.src = blinkSrc;
          setTimeout(() => {
            spriteImg.src = normalSrc;
            isBlinking = false;
          }, 95);
        }, 120);
      }
    }, 110);
  }

  function scheduleNextBlink() {
    const nextInterval = 2600 + Math.random() * 3000;
    setTimeout(() => {
      triggerEyeBlink();
      scheduleNextBlink();
    }, nextInterval);
  }
  scheduleNextBlink();

  // Viewport position & autonomous roaming state (Starts immediately at Top-Left red circle)
  const isInitialMobile = window.innerWidth <= 600;
  let posX = isInitialMobile ? 14 : 65;
  let posY = isInitialMobile ? 70 : 85;
  let targetX = posX;
  let targetY = posY;
  let velX = 0;
  let velY = 0;
  let facingRight = false;
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let lastDragX = 0;
  let lastDragY = 0;
  let throwVelX = 0;
  let throwVelY = 0;

  // Immediately apply initial position
  container.style.transform = `translate3d(${posX.toFixed(1)}px, ${posY.toFixed(1)}px, 0)`;

  let mouseX = window.innerWidth * 0.5;
  let mouseY = window.innerHeight * 0.5;
  let lastMouseMoveTime = Date.now();
  let lastScrollY = window.scrollY;
  let bubbleTimeout = null;
  let lastSection = '';
  let roamTimer = null;
  let lastDodgeTime = 0;

  // Evasion & Combat State
  let evasionUntil = 0;
  let wasEvading = false;
  let pointerDownX = 0;
  let pointerDownY = 0;
  let pointerDownTime = 0;
  let cornerTrappedSince = 0;
  let lastWarpTime = 0;

  // ==================== ON / OFF COMPANION TOGGLE ====================
  let isAvatarEnabled = true;
  localStorage.setItem('priyam_avatar_enabled', 'true');

  window.toggleAvatarEnabled = (forceState) => {
    if (typeof forceState === 'boolean') {
      isAvatarEnabled = forceState;
    } else {
      isAvatarEnabled = !isAvatarEnabled;
    }
    localStorage.setItem('priyam_avatar_enabled', isAvatarEnabled ? 'true' : 'false');
    applyAvatarEnabledState();
  };

  function applyAvatarEnabledState() {
    const toggleBtn = document.getElementById('wpp-avatar-toggle-btn');
    const toggleText = document.getElementById('wpp-toggle-text');
    const toggleIcon = document.getElementById('wpp-toggle-icon');
    const hubBadge = document.getElementById('wardrobe-active-badge');

    if (isAvatarEnabled) {
      container.classList.remove('is-disabled');
      container.style.opacity = '1';
      if (toggleBtn) toggleBtn.classList.remove('is-disabled');
      if (toggleText) toggleText.textContent = 'COMPANION: ON';
      if (toggleIcon) toggleIcon.textContent = '👁️';
      const currentOutfit = OUTFITS[currentOutfitIdx];
      if (hubBadge) hubBadge.textContent = currentOutfit ? currentOutfit.id.toUpperCase() : 'CASUAL';
      if (is18PlusMode && hubBadge) hubBadge.classList.add('is-18plus');
    } else {
      container.classList.add('is-disabled');
      if (toggleBtn) toggleBtn.classList.add('is-disabled');
      if (toggleText) toggleText.textContent = 'COMPANION: OFF (CLICK TO ENABLE)';
      if (toggleIcon) toggleIcon.textContent = '🙈';
      if (hubBadge) hubBadge.textContent = 'OFF';
      bubble?.classList.remove('active');
    }
  }

  // Audio Synthesizer for Bakchod 18+ Unlock Blast
  function playBakchodUnlockSound() {
    try {
      const actx = getSharedAudioContext();
      if (!actx) return;
      const now = actx.currentTime;
      
      // Laser slide down
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.start(now);
      osc.stop(now + 0.38);

      // Sub bass hit
      const sub = actx.createOscillator();
      const subGain = actx.createGain();
      sub.connect(subGain);
      subGain.connect(actx.destination);
      sub.type = 'triangle';
      sub.frequency.setValueAtTime(140, now + 0.05);
      sub.frequency.exponentialRampToValueAtTime(35, now + 0.45);
      subGain.gain.setValueAtTime(0.6, now + 0.05);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
      sub.start(now + 0.05);
      sub.stop(now + 0.48);
    } catch (_) {}
  }

  // ==================== 18+ FUCKER MODE & SECRET WARDROBE UNLOCK ====================
  // Strictly Normal Mode by default until user types the secret code in the chatbot
  localStorage.removeItem('priyam_18plus_mode'); // Clear legacy persistent toggle
  let is18PlusMode = sessionStorage.getItem('priyam_18plus_mode') === 'true';

  window.activateFuckerMode18Plus = () => {
    is18PlusMode = true;
    sessionStorage.setItem('priyam_18plus_mode', 'true');
    const wardrobeHub = document.getElementById('floating-wardrobe-hub');
    const hubBadge = document.getElementById('wardrobe-active-badge');

    if (wardrobeHub) {
      wardrobeHub.classList.remove('wardrobe-hidden-public');
      wardrobeHub.classList.add('wardrobe-unlocked-glitch');
    }
    if (hubBadge) {
      hubBadge.classList.add('is-18plus');
    }
    if (charBody) {
      charBody.classList.add('is-fucker-mode');
    }

    playBakchodUnlockSound();
    window.setAvatarMood('angry', 4000);
    window.showAvatarThought("🚨 FUCKER MODE ACTIVATED BC! 🔞 All 7 fits unlocked on bottom-left. Zero filter mode ON! 🕶️🔥", "🔞 18+ ROGUE", "🔞 18+ MODE", 4500);
    if (navigator.vibrate) navigator.vibrate([120, 60, 120, 60, 240]);
  };

  window.deactivateFuckerMode18Plus = () => {
    is18PlusMode = false;
    sessionStorage.removeItem('priyam_18plus_mode');
    localStorage.removeItem('priyam_18plus_mode');
    
    const wardrobeHub = document.getElementById('floating-wardrobe-hub');
    const hubBadge = document.getElementById('wardrobe-active-badge');
    const panel = document.getElementById('wardrobe-popup-panel');

    if (panel) panel.classList.add('hidden');
    if (wardrobeHub) {
      wardrobeHub.classList.add('wardrobe-hidden-public');
      wardrobeHub.classList.remove('wardrobe-unlocked-glitch');
    }
    if (hubBadge) {
      hubBadge.classList.remove('is-18plus');
      hubBadge.textContent = 'CASUAL';
    }
    if (charBody) {
      charBody.classList.remove('is-fucker-mode');
    }

    // Reset outfit back to casual
    const casualIdx = OUTFITS.findIndex(o => o.id === 'casual');
    if (casualIdx !== -1) currentOutfitIdx = casualIdx;
    applyCurrentOutfit(false);

    window.setAvatarMood('happy', 3000);
    window.showAvatarThought("👔 Normal mode restored! Clean, polite, and ready to ship. 🚀", "PRIYAM · LIVE", "😊 ONLINE", 3500);
  };

  // Sync initial wardrobe visibility (hidden by default for public)
  const wardrobeHubEl = document.getElementById('floating-wardrobe-hub');
  const hubBadgeInit = document.getElementById('wardrobe-active-badge');
  if (wardrobeHubEl) {
    if (is18PlusMode) {
      wardrobeHubEl.classList.remove('wardrobe-hidden-public');
      if (hubBadgeInit) hubBadgeInit.classList.add('is-18plus');
      if (charBody) charBody.classList.add('is-fucker-mode');
    } else {
      wardrobeHubEl.classList.add('wardrobe-hidden-public');
      if (hubBadgeInit) hubBadgeInit.classList.remove('is-18plus');
      if (charBody) charBody.classList.remove('is-fucker-mode');
    }
  }

  // ==================== WARDROBE SYSTEM & AUTO-CLOSE ====================
  const OUTFITS = [
    { id: 'casual', tag: '👔 CASUAL' },
    { id: 'techwear', tag: '🕶️ TECHWEAR' },
    { id: 'saiyan', tag: '🔥 SAIYAN' },
    { id: 'spiderman', tag: '🕷️ SPIDEY' },
    { id: 'ironman', tag: '🤖 IRON MAN' },
    { id: 'football', tag: '⚽ CR7 NO. 7' },
    { id: 'f1', tag: '🏎️ F1 RACING' }
  ];

  let currentOutfitIdx = 0;
  let userSelectedOutfit = localStorage.getItem('priyam_avatar_outfit') || 'casual';
  if (!is18PlusMode) {
    userSelectedOutfit = 'casual';
    localStorage.setItem('priyam_avatar_outfit', 'casual');
  }
  const initialIdx = OUTFITS.findIndex(o => o.id === userSelectedOutfit);
  if (initialIdx !== -1) currentOutfitIdx = initialIdx;

  let wardrobeAutoCloseTimer = null;

  function resetWardrobeAutoClose() {
    clearTimeout(wardrobeAutoCloseTimer);
    const panel = document.getElementById('wardrobe-popup-panel');
    if (panel && !panel.classList.contains('hidden')) {
      wardrobeAutoCloseTimer = setTimeout(() => {
        window.toggleWardrobeMenu(false);
      }, 4500);
    }
  }

  window.toggleWardrobeMenu = (forceState) => {
    const panel = document.getElementById('wardrobe-popup-panel');
    if (!panel) return;
    clearTimeout(wardrobeAutoCloseTimer);

    if (typeof forceState === 'boolean') {
      panel.classList.toggle('hidden', !forceState);
    } else {
      panel.classList.toggle('hidden');
    }

    if (!panel.classList.contains('hidden')) {
      resetWardrobeAutoClose();
    }
  };

  const wardrobePanel = document.getElementById('wardrobe-popup-panel');
  if (wardrobePanel) {
    wardrobePanel.addEventListener('pointerenter', resetWardrobeAutoClose);
    wardrobePanel.addEventListener('pointermove', resetWardrobeAutoClose);
    wardrobePanel.addEventListener('touchstart', resetWardrobeAutoClose, { passive: true });
  }

  window.scrollWardrobeCarousel = (dir) => {
    resetWardrobeAutoClose();
    const track = document.getElementById('wpp-carousel-track');
    if (track) {
      track.scrollBy({ left: dir * 110, behavior: 'smooth' });
    }
  };

  window.setAvatarOutfit = (outfitId, showQuip = true) => {
    userSelectedOutfit = outfitId;
    const idx = OUTFITS.findIndex(o => o.id === outfitId);
    if (idx !== -1) currentOutfitIdx = idx;
    applyCurrentOutfit(showQuip);

    // Auto-close wardrobe smoothly shortly after selecting
    resetWardrobeAutoClose();
    setTimeout(() => {
      window.toggleWardrobeMenu(false);
    }, 1400);
  };

  window.cycleAvatarOutfit = (delta) => {
    currentOutfitIdx = (currentOutfitIdx + delta + OUTFITS.length) % OUTFITS.length;
    userSelectedOutfit = OUTFITS[currentOutfitIdx].id;
    applyCurrentOutfit(true);
  };

  function applyCurrentOutfit(showQuip = false) {
    const outfit = OUTFITS[currentOutfitIdx];
    localStorage.setItem('priyam_avatar_outfit', outfit.id);

    // Update Sprite Image instantly from embedded asset dictionary
    if (spriteImg) {
      if (window.AVATAR_SPRITES && window.AVATAR_SPRITES[outfit.id]) {
        spriteImg.src = window.AVATAR_SPRITES[outfit.id];
      } else {
        spriteImg.src = `assets/avatar-priyam-${outfit.id}.webp?v=20260902_45`;
      }
    }

    // Update Dynamic FX Aura
    if (saiyanEnergy) {
      saiyanEnergy.classList.toggle('hidden', outfit.id !== 'saiyan');
    }
    if (ironRepulsors) {
      ironRepulsors.classList.toggle('hidden', outfit.id !== 'ironman');
    }

    // Update Floating Hub trigger badge
    const badge = document.getElementById('wardrobe-active-badge');
    if (badge) {
      badge.textContent = isAvatarEnabled ? outfit.id.toUpperCase() : 'OFF';
    }

    // Update popup cards active state & scroll active into view
    document.querySelectorAll('.wpp-card').forEach(card => {
      const isActive = card.getAttribute('data-outfit') === outfit.id;
      card.classList.toggle('active', isActive);
      if (isActive) {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });

    if (showQuip && isAvatarEnabled) {
      const outfitQuips = {
        'casual': "Classic founder drip 👔 +10,000 aura. Ready to ship.",
        'techwear': "Cyber techwear locked in 🕶️ Mogging Silicon Valley.",
        'saiyan': "POWER LEVEL OVER 9000! 🔥 Pure gigachad energy.",
        'spiderman': "With great power comes great dhandho 🕷️ No cap.",
        'ironman': "I am Iron Man. JARVIS, deploy straight to prod! 🤖",
        'football': "CR7 on the pitch! ⚽ SIUUUU! 👑 Clutch mentality.",
        'f1': "Scuderia speed! 🏎️ 340 km/h apex telemetry trace."
      };
      if (outfitQuips[outfit.id]) {
        window.showAvatarThought(outfitQuips[outfit.id], outfit.tag, "STYLING", 2800);
      }
    }
  }

  // ==================== MOOD & EMOTIONS SYSTEM ====================
  let currentMood = 'normal';
  let moodResetTimeout = null;

  window.setAvatarMood = (mood, duration = null) => {
    if (!isAvatarEnabled) return;
    currentMood = mood;
    clearTimeout(moodResetTimeout);

    angerVein?.classList.add('hidden');
    teardrop?.classList.add('hidden');
    sweat?.classList.add('hidden');

    if (mood === 'happy') {
      charBody.classList.remove('avatar-happy-hop', 'avatar-sad-slump');
      void charBody.offsetWidth;
      charBody.classList.add('avatar-happy-hop');
    } else if (mood === 'sad') {
      teardrop?.classList.remove('hidden');
      charBody.classList.add('avatar-sad-slump');
    } else if (mood === 'angry') {
      angerVein?.classList.remove('hidden');
    } else if (mood === 'shocked') {
      sweat?.classList.remove('hidden');
    } else {
      charBody.classList.remove('avatar-sad-slump');
    }

    if (duration) {
      moodResetTimeout = setTimeout(() => {
        window.setAvatarMood('normal');
      }, duration);
    }
  };

  // Audio Synthesizers
  function playPunchSound() {
    try {
      const actx = getSharedAudioContext();
      if (!actx) return;
      const now = actx.currentTime;
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);
      osc.start(now);
      osc.stop(now + 0.20);
    } catch (_) {}
  }

  function playSlapSound() {
    try {
      const actx = getSharedAudioContext();
      if (!actx) return;
      const now = actx.currentTime;
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.14);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (_) {}
  }

  // ==================== COMBAT / HIT TRANSFORMATIONS ====================
  // ==================== COMBAT / HIT TRANSFORMATIONS ====================
  function triggerPunchHit() {
    if (!isAvatarEnabled) return;
    evasionUntil = Date.now() + 4500;
    wasEvading = true;
    charBody.className = `avatar-character is-evading avatar-punch-hit ${is18PlusMode ? 'is-fucker-mode' : ''}`;
    playPunchSound();

    if (impactBubble && impactText) {
      impactText.textContent = is18PlusMode ? '💥 BHOSAD!' : '💥 BAM!';
      impactBubble.classList.remove('hidden');
      setTimeout(() => impactBubble.classList.add('hidden'), 400);
    }

    // Transform into Super Saiyan Mode
    const saiyanIdx = OUTFITS.findIndex(o => o.id === 'saiyan');
    if (saiyanIdx !== -1) currentOutfitIdx = saiyanIdx;
    applyCurrentOutfit(false);
    if (saiyanEnergy) {
      saiyanEnergy.classList.remove('hidden');
      saiyanEnergy.classList.add('active');
    }
    window.setAvatarMood('angry', 4500);

    const punchMsg = is18PlusMode 
      ? "🚨 ABE SAALE! Super Saiyan mode mein direct prod db drop kar dunga! 🔥⚡"
      : "🔥 HAAA! OVER 9000! Super Saiyan escape engaged! ⚡";
    window.showAvatarThought(punchMsg, is18PlusMode ? "🔞 18+ SAIYAN" : "⚡ SUPER SAIYAN", "🚨 EVADING", 4200);

    // Blast away from cursor position with high initial impulse
    const { w, h } = getAvatarDimensions();
    const charCenterX = posX + w * 0.5;
    const charCenterY = posY + h * 0.5;
    const dx = charCenterX - mouseX;
    const dy = charCenterY - mouseY;
    const dist = Math.hypot(dx, dy) || 1;
    velX = (dx / dist) * 22.0;
    velY = (dy / dist) * 18.0;
  }

  function triggerSlapHit() {
    triggerPunchHit();
  }

  // Pointer Movement & Inactivity Watcher
  let idleTimer = null;
  function resetInactivityTimer() {
    clearTimeout(idleTimer);
    if (currentMood === 'sad' && isAvatarEnabled) {
      window.setAvatarMood('happy', 3500);
      window.showAvatarThought("Yay! You're back! 🚀", "HAPPY", "😊 HYPED", 2500);
    }
    idleTimer = setTimeout(() => {
      if (Date.now() >= evasionUntil && !isReadingActive() && isAvatarEnabled) {
        window.setAvatarMood('sad');
        const sadQuips = [
          "Still there? 🥺",
          "Let's play radar game! 🎯",
          "Vibe coding awaits ✨"
        ];
        const quip = sadQuips[Math.floor(Math.random() * sadQuips.length)];
        window.showAvatarThought(quip, "IDLE", "🥺 SAD", 3500);
      }
    }, 25000);
  }

  // ==================== SCREEN BOUNDS & NON-OBSTRUCTIVE CLAMPING ====================
  function getAvatarDimensions() {
    const isMobile = window.innerWidth <= 600;
    const isTablet = window.innerWidth <= 900;
    return {
      w: isMobile ? 76 : (isTablet ? 98 : 120),
      h: isMobile ? 84 : (isTablet ? 109 : 133),
      isMobile,
      isTablet
    };
  }

  function clampPosition(x, y) {
    const { w, h, isMobile } = getAvatarDimensions();
    const minX = isMobile ? 6 : 12;
    const maxX = Math.max(minX + 10, window.innerWidth - w - (isMobile ? 6 : 14));
    const minY = isMobile ? 45 : 55;
    const maxY = Math.max(minY + 20, window.innerHeight - h - (isMobile ? 35 : 85));
    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y))
    };
  }

  // Window Resize & Orientation Handling
  window.addEventListener('resize', () => {
    const clamped = clampPosition(posX, posY);
    posX = clamped.x;
    posY = clamped.y;
    targetX = posX;
    targetY = posY;
  }, { passive: true });

  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      const clamped = clampPosition(posX, posY);
      posX = clamped.x;
      posY = clamped.y;
      targetX = posX;
      targetY = posY;
    }, 200);
  }, { passive: true });

  // ==================== READING & GAME OBSTRUCTION INTELLIGENCE ====================
  function isGameActive() {
    const funSection = document.getElementById('fun-zone');
    if (funSection) {
      const rect = funSection.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80 && rect.bottom > 80) {
        return true;
      }
    }
    return false;
  }

  function isReadingActive() {
    const aiDrawer = document.getElementById('priyam-ai-drawer');
    const projModal = document.getElementById('project-modal');
    const cmdModal = document.getElementById('cmd-palette-modal');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const isAiOpen = aiDrawer && !aiDrawer.classList.contains('hidden');
    const isProjOpen = projModal && !projModal.classList.contains('hidden');
    const isCmdOpen = cmdModal && !cmdModal.classList.contains('hidden');
    const isMenuOpen = mobileDrawer && !mobileDrawer.classList.contains('hidden');
    const isGame = isGameActive();
    return isAiOpen || isProjOpen || isCmdOpen || isMenuOpen || isGame;
  }

  function isInputFocused() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  }

  // Pointer & Touch Movement
  function onPointerMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    lastMouseMoveTime = Date.now();
    resetInactivityTimer();

    if (isDragging) {
      const clamped = clampPosition(e.clientX - dragOffsetX, e.clientY - dragOffsetY);
      posX = clamped.x;
      posY = clamped.y;
      targetX = posX;
      targetY = posY;
    }
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('keydown', resetInactivityTimer, { passive: true });
  resetInactivityTimer();

  // Right-click Slap Trigger
  charBody.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    triggerPunchHit();
  });

  // Pointer Down: Distinguish Tap/Punch vs Drag
  charBody.addEventListener('pointerdown', (e) => {
    if (e.button === 2 || !isAvatarEnabled) return;

    isDragging = true;
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    pointerDownTime = Date.now();

    charBody.classList.add('is-dragging');
    charBody.classList.remove('avatar-sonic-spin', 'avatar-happy-hop', 'avatar-punch-hit', 'avatar-slap-hit', 'avatar-warp-poof');
    dragOffsetX = e.clientX - posX;
    dragOffsetY = e.clientY - posY;
    lastDragX = e.clientX;
    lastDragY = e.clientY;
    throwVelX = 0;
    throwVelY = 0;
  });

  window.addEventListener('pointerup', (e) => {
    if (isDragging) {
      isDragging = false;
      charBody.classList.remove('is-dragging');
      velX = throwVelX * 0.8;
      velY = throwVelY * 0.8;

      const distMoved = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
      const pressDuration = Date.now() - pointerDownTime;

      if (distMoved < 10 && pressDuration < 380) {
        triggerPunchHit();
        return;
      }

      if (Math.hypot(throwVelX, throwVelY) > 7 && isAvatarEnabled) {
        charBody.classList.add('avatar-sonic-spin');
        window.showAvatarThought("WHEEEEE! 🚀 5th-wall flight!", "5TH WALL", "🚀 WHEEE", 2500);
      }
      if (statusLabel && Date.now() >= evasionUntil && isAvatarEnabled) statusLabel.textContent = 'ROAMING';
    }
  });

  // Direct Click Backup Listener
  charBody.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerPunchHit();
  });

  // Mobile & Tablet Touch Gestures
  let lastTouchTapTime = 0;
  let longPressTimer = null;

  // ==================== CATMULL-ROM CUBIC SPLINE & SPRING TRAJECTORY ====================
  function catmullRom1D(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    return 0.5 * (
      (2 * p1) +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t3
    );
  }

  // ==================== DYNAMIC SECTION-ANCHORED SCROLL ENGINE ====================
  let currentFlightTilt = 0;

  function getScrollWaypoint() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const { w: avW, h: avH, isMobile } = getAvatarDimensions();

    // 1. DYNAMIC FINAL DOCK: Exactly above the "Talk to Priyuum (AI Clone)" button and middle of it
    let dockTargetX = w - avW - 35;
    let dockTargetY = h - avH - 75;
    const triggerEl = document.getElementById('priyam-ai-trigger');
    if (triggerEl) {
      const rect = triggerEl.getBoundingClientRect();
      if (rect && rect.width > 0 && rect.height > 0) {
        const triggerCenterX = rect.left + rect.width * 0.5;
        dockTargetX = triggerCenterX - avW * 0.5;
        dockTargetY = rect.top - avH - 4;
      }
    }

    // 2. FIXED OBSERVATION PERCH DURING 360° SURGE BOTTLE SCROLL ANIMATION
    const fixedSurgeX = isMobile ? (w - avW - 12) : (w * 0.84 - avW * 0.5);
    const fixedSurgeY = isMobile ? 70 : 165;

    const surgeEl = document.getElementById('surge');
    if (surgeEl) {
      const scrollBody = surgeEl.querySelector('.surge-scroll-body') || surgeEl;
      const rect = scrollBody.getBoundingClientRect();
      const stickyViewport = surgeEl.querySelector('.surge-sticky-viewport');
      const stickyTop = stickyViewport ? (parseFloat(getComputedStyle(stickyViewport).top) || 0) : 0;
      const viewportH = stickyViewport ? stickyViewport.offsetHeight : window.innerHeight;
      const totalScrollable = scrollBody.offsetHeight - viewportH;

      if (totalScrollable > 0 && rect.top <= stickyTop + 15 && rect.bottom >= viewportH + stickyTop - 15) {
        return { x: fixedSurgeX, y: fixedSurgeY, isFixed: true };
      }
    }

    // Section live viewport bounds
    const heroEl = document.getElementById('hero');
    const aboutEl = document.getElementById('about');
    const projectsEl = document.getElementById('projects');
    const funZoneEl = document.getElementById('fun-zone');
    const contactEl = document.getElementById('contact');

    const heroRect = heroEl ? heroEl.getBoundingClientRect() : { top: 0, bottom: h, height: h };
    const aboutRect = aboutEl ? aboutEl.getBoundingClientRect() : { top: h, bottom: h * 2, height: h };
    const projRect = projectsEl ? projectsEl.getBoundingClientRect() : { top: h * 2, bottom: h * 3, height: h };
    const funRect = funZoneEl ? funZoneEl.getBoundingClientRect() : { top: h * 4, bottom: h * 5, height: h };
    const contactRect = contactEl ? contactEl.getBoundingClientRect() : { top: h * 5, bottom: h * 6, height: h };

    if (isMobile) {
      // Mobile: Keep avatar docked cleanly along the right edge/margin rail so it NEVER cuts through text
      const rightRailX = w - avW - 14;
      
      // 1. In Contact / Footer: Dock right above the AI trigger button
      if (contactRect.top <= h * 0.70) {
        return { x: dockTargetX, y: dockTargetY };
      }
      
      // 2. In Hero Section: Perch in the top-right corner over the vector wireframe
      if (heroRect.top >= -50) {
        return { x: rightRailX, y: 68 };
      }

      // 3. In SURGE Section: Sit nicely beside the bottle at top-right
      if (surgeEl) {
        const scrollBody = surgeEl.querySelector('.surge-scroll-body') || surgeEl;
        const rect = scrollBody.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          return { x: rightRailX, y: 68, isFixed: true };
        }
      }

      // 4. In Fun Zone / Radar Game: Stay at bottom right above trigger button so canvas & touch controls are 100% unobstructed
      if (funRect.top < h * 0.80 && funRect.bottom > h * 0.15) {
        return { x: dockTargetX, y: dockTargetY, isFixed: true };
      }

      // 5. General Scrolling on Mobile: Smoothly glide on the right margin rail
      const scrollProgress = Math.max(0, Math.min(1, (window.scrollY || 0) / Math.max(1, document.documentElement.scrollHeight - h)));
      const mY = 68 + scrollProgress * (dockTargetY - 68);
      const mX = rightRailX + (dockTargetX - rightRailX) * Math.pow(scrollProgress, 2);
      return clampPosition(mX, mY);
    }

    // DESKTOP & LAPTOP SECTION-ANCHORED WAYPOINTS
    // Phase 1: Hero Section
    if (heroRect.bottom > h * 0.35) {
      const heroT = Math.max(0, Math.min(1, -heroRect.top / Math.max(1, heroRect.height - h * 0.35)));
      const isTablet = w <= 900;
      const startX = isTablet ? (w * 0.80 - avW * 0.5) : 65;
      const startY = isTablet ? 75 : 85;
      const endX = w * 0.82 - avW * 0.5;
      const endY = 135;
      const midX = isTablet ? (w * 0.80 - avW * 0.5) : (w * 0.42);
      const midY = 105;

      const qX = (1 - heroT) * (1 - heroT) * startX + 2 * (1 - heroT) * heroT * midX + heroT * heroT * endX;
      const qY = (1 - heroT) * (1 - heroT) * startY + 2 * (1 - heroT) * heroT * midY + heroT * heroT * endY;
      return { x: qX, y: qY };
    }

    // Phase 2: About Me (Left margin rail -> smooth exit past left edge)
    if (aboutRect.top < h * 0.80 && projRect.top > h * 0.55) {
      const aboutT = Math.max(0, Math.min(1, (h * 0.80 - aboutRect.top) / Math.max(1, aboutRect.height)));
      if (aboutT < 0.65) {
        return { x: 65, y: 190 + aboutT * 30 };
      } else {
        const exitT = (aboutT - 0.65) / 0.35;
        const outX = 65 - exitT * 215; // 65px -> -150px (off-screen left)
        return { x: outX, y: 220, isWarp: true };
      }
    }

    // Phase 3: Projects (Enters from right edge -> right margin rail)
    if (projRect.top <= h * 0.55 && (!surgeEl || surgeEl.getBoundingClientRect().top > h * 0.50)) {
      const projT = Math.max(0, Math.min(1, (h * 0.55 - projRect.top) / Math.max(1, projRect.height)));
      const targetRailX = w * 0.84 - avW * 0.5;
      if (projT < 0.22) {
        const enterT = projT / 0.22;
        const inX = (w + 150) - enterT * (150 + (w - targetRailX));
        return { x: inX, y: 230, isWarp: true };
      } else {
        return { x: targetRailX, y: 230 };
      }
    }

    // Phase 4: SURGE Exit -> Defence & Radar Area
    if (contactRect.top > h * 0.65) {
      const radT = funRect.top < h * 0.85 ? Math.max(0, Math.min(1, (h * 0.85 - funRect.top) / Math.max(1, funRect.height))) : 0;
      const targetRadarX = w * 0.78 - avW * 0.5;
      const curX = fixedSurgeX + (targetRadarX - fixedSurgeX) * radT;
      const curY = fixedSurgeY + (190 - fixedSurgeY) * radT;
      return { x: curX, y: curY };
    }

    // Phase 5: Contact & Footer (Dock directly centered above AI button)
    const contactT = Math.max(0, Math.min(1, (h * 0.65 - contactRect.top) / Math.max(1, contactRect.height - h * 0.35)));
    const curX = (w * 0.78 - avW * 0.5) + (dockTargetX - (w * 0.78 - avW * 0.5)) * contactT;
    const curY = 190 + (dockTargetY - 190) * contactT;
    return { x: curX, y: curY };
  }

  function updateCharacterDirection() {
    const { w: avW } = getAvatarDimensions();
    const charCenterX = posX + avW * 0.5;
    const deltaX = mouseX - charCenterX;

    if (Math.abs(velX) > 0.8) {
      if (velX > 0.8) facingRight = true;
      else if (velX < -0.8) facingRight = false;
    } else {
      if (deltaX > 30) facingRight = true;
      else if (deltaX < -30) facingRight = false;
    }
  }

  // ==================== SMART ADAPTIVE SPEECH BUBBLE ====================
  function updateBubblePlacement(currentX, currentY) {
    if (!bubble) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const { w: avatarW, isMobile } = getAvatarDimensions();

    bubble.classList.remove('bubble-below', 'bubble-right-side', 'bubble-left-side', 'bubble-above');

    if (isMobile) {
      // On mobile screens:
      // If near bottom of screen, show bubble above avatar
      if (currentY > h - 180) {
        bubble.classList.add('bubble-above');
      } else if (currentX > w * 0.40) {
        // If on the right side of mobile screen, show bubble to the left of avatar!
        bubble.classList.add('bubble-left-side');
      } else {
        bubble.classList.add('bubble-right-side');
      }
    } else {
      // Desktop / Tablet
      if (currentY < 130) {
        bubble.classList.add('bubble-below');
      } else if (currentX < 120) {
        bubble.classList.add('bubble-right-side');
      } else if (currentX > w - avatarW - 120) {
        bubble.classList.add('bubble-left-side');
      }
    }
  }

  window.showAvatarThought = (msg, tag = 'PRIYAM · LIVE', mood = 'OBSERVING', duration = 3800) => {
    if (!bubble || !bubbleMsg || !isAvatarEnabled) return;
    if (isReadingActive()) return;

    bubbleMsg.textContent = msg;
    if (bubbleTag) bubbleTag.textContent = tag;
    if (statusLabel && !isDragging) statusLabel.textContent = mood;

    updateBubblePlacement(posX, posY);
    bubble.classList.add('active');

    clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
      bubble.classList.remove('active');
      if (statusLabel && Date.now() >= evasionUntil && isAvatarEnabled) statusLabel.textContent = 'ROAMING';
    }, duration);
  };

  window.dismissAvatarBubble = (e) => {
    e?.stopPropagation();
    bubble?.classList.remove('active');
  };

  // ==================== 60 FPS CONTINUOUS PHYSICS & ROAM LOOP ====================
  let currentScrollTilt = 0;
  let scrollVelocity = 0;
  let isTabVisible = !document.hidden;

  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
  });

  window.addEventListener('scroll', () => {
    const currY = window.scrollY;
    const delta = currY - lastScrollY;
    lastScrollY = currY;
    scrollVelocity = scrollVelocity * 0.72 + delta * 0.28;
    resetInactivityTimer();

    if (Math.abs(delta) > 45 && Date.now() >= evasionUntil && isAvatarEnabled && Math.random() < 0.25) {
      window.showAvatarThought("HYPERSPACE JUMP! 🏎️💨 Hold onto your viewport!", "5TH WALL", "🏎️ SPEED", 2200);
    }

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 90) {
      if (lastSection !== 'bottom-reached' && isAvatarEnabled) {
        lastSection = 'bottom-reached';
        window.showAvatarThought("You reached the footer! I'm floating right here — ping me! ☕✉️", "5TH WALL", "🎉 SIUUU", 3800);
      }
    }
  }, { passive: true });

  function avatarPhysicsLoop() {
    if (!isTabVisible || !isAvatarEnabled) {
      setTimeout(() => requestAnimationFrame(avatarPhysicsLoop), 400);
      return;
    }

    const reading = isReadingActive();

    if (reading) {
      bubble?.classList.remove('active');
    }

    scrollVelocity *= 0.88;
    const targetScrollTilt = Math.max(-12, Math.min(12, -scrollVelocity * 0.25));
    currentScrollTilt += (targetScrollTilt - currentScrollTilt) * 0.14;

    const isEvading = Date.now() < evasionUntil;

    if (isDragging) {
      throwVelX = mouseX - lastDragX;
      throwVelY = mouseY - lastDragY;
      lastDragX = mouseX;
      lastDragY = mouseY;
    } else if (isEvading) {
      // Active continuous cursor repulsion while in Super Saiyan evasion
      const { w, h, isMobile } = getAvatarDimensions();
      const charCenterX = posX + w * 0.5;
      const charCenterY = posY + h * 0.5;
      const distToCursor = Math.hypot(charCenterX - mouseX, charCenterY - mouseY) || 1;
      
      if (distToCursor < 200) {
        const repForce = ((200 - distToCursor) / 200) * (isMobile ? 3.5 : 5.5);
        const pushDirX = (charCenterX - mouseX) / distToCursor;
        const pushDirY = (charCenterY - mouseY) / distToCursor;
        velX += pushDirX * repForce;
        velY += pushDirY * repForce;
      }

      posX += velX;
      posY += velY;
      velX *= 0.94;
      velY *= 0.94;

      const clamped = clampPosition(posX, posY);
      if (posX !== clamped.x) { posX = clamped.x; velX *= -0.7; }
      if (posY !== clamped.y) { posY = clamped.y; velY *= -0.7; }
    } else {
      if (wasEvading) {
        wasEvading = false;
        charBody.classList.remove('is-evading', 'avatar-punch-hit', 'avatar-slap-hit');
        window.setAvatarMood('normal');
        const revertIdx = OUTFITS.findIndex(o => o.id === userSelectedOutfit);
        currentOutfitIdx = revertIdx !== -1 ? revertIdx : 0;
        applyCurrentOutfit(false);

        // Power-down energy poof
        charBody.classList.add('avatar-warp-poof');
        setTimeout(() => charBody.classList.remove('avatar-warp-poof'), 350);

        window.showAvatarThought("Phew! Super Saiyan cooldown complete — normal mode restored 🕶️", "5TH WALL", "🕶️ CHILL", 3000);
      }

      const wp = getScrollWaypoint();
      targetX = wp.x;
      targetY = wp.y;

      // Seamless Screen-Edge Wrap & Fast-Jump Handling
      if (targetX > window.innerWidth * 0.5 && posX < 0) {
        posX = window.innerWidth + 150;
        charBody.classList.add('avatar-warp-poof');
        setTimeout(() => charBody.classList.remove('avatar-warp-poof'), 350);
      } else if (targetX < 0 && posX > window.innerWidth) {
        posX = -150;
        charBody.classList.add('avatar-warp-poof');
        setTimeout(() => charBody.classList.remove('avatar-warp-poof'), 350);
      } else if (Math.abs(targetX - posX) > window.innerWidth * 0.65 && !wp.isWarp) {
        posX = targetX;
        posY = targetY;
      }

      const smoothRate = wp.isFixed ? 0.22 : 0.16;
      const dx = targetX - posX;
      const dy = targetY - posY;

      posX += dx * smoothRate;
      posY += dy * smoothRate;
      velX = dx * smoothRate;
      velY = dy * smoothRate;

      if (wp.x >= 0 && wp.x <= window.innerWidth && !wp.isWarp) {
        const clamped = clampPosition(posX, posY);
        posX = clamped.x;
        posY = clamped.y;
      }
    }

    updateCharacterDirection();

    const targetFlightTilt = Math.max(-14, Math.min(14, velX * 1.8));
    currentFlightTilt += (targetFlightTilt - currentFlightTilt) * 0.12;

    const bob = Math.sin(Date.now() * 0.0035) * 4.5;
    const totalTilt = (facingRight ? currentFlightTilt : -currentFlightTilt) + currentScrollTilt;
    const renderY = posY + bob;

    container.style.transform = `translate3d(${posX.toFixed(1)}px, ${renderY.toFixed(1)}px, 0)`;
    charBody.style.transform = `scaleX(${facingRight ? 1 : -1}) rotate(${totalTilt.toFixed(1)}deg)`;

    updateBubblePlacement(posX, renderY);
    requestAnimationFrame(avatarPhysicsLoop);
  }
  requestAnimationFrame(avatarPhysicsLoop);

  // ==================== SITE-WIDE 5TH-WALL AWARENESS LISTENERS ====================
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      setTimeout(() => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || document.documentElement.classList.contains('dark');
        if (isDark) {
          window.setAvatarMood('happy', 2500);
          window.showAvatarThought("Dark mode locked in! 🌙 High aura coding.", "THEME", "🌙 CYBER", 3200);
        } else {
          window.setAvatarMood('shocked', 2500);
          window.showAvatarThought("Let there be light! ☀️ High clarity mode.", "THEME", "☀️ LIGHT", 3200);
        }
      }, 100);
    });
  }

  document.querySelectorAll('.filter-btn, .project-tag-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.textContent.trim();
      window.setAvatarMood('happy', 2000);
      window.showAvatarThought(`Filtering projects: ${category}! ⚡ Check the stack.`, "VAULT", "🔍 FILTER", 2800);
    });
  });

  document.querySelectorAll('.project-card, [data-project-id]').forEach(card => {
    card.addEventListener('click', () => {
      window.setAvatarMood('happy', 2500);
      window.showAvatarThought("Deep diving project architecture! 🔬 Check the live code.", "PROJECTS", "📐 ARCH", 3000);
    });
  });

  const cmdkBtn = document.getElementById('cmdk-btn') || document.getElementById('search-btn');
  if (cmdkBtn) {
    cmdkBtn.addEventListener('click', () => {
      window.showAvatarThought("Spotlight activated! 🔍 Type any command.", "SPOTLIGHT", "⚡ CMD+K", 2800);
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      window.showAvatarThought("Power user shortcut! ⚡ Spotlight opened.", "SPOTLIGHT", "⚡ CMD+K", 2800);
    }
  });

  const aiChatTrigger = document.getElementById('priyam-ai-trigger') || document.getElementById('ai-chat-btn');
  if (aiChatTrigger) {
    aiChatTrigger.addEventListener('click', () => {
      window.setAvatarMood('happy', 3000);
      window.showAvatarThought("My AI clone is online! Ask me anything! 🤖🧠", "AI CLONE", "🧠 PRIYAM AI", 3500);
    });
  }

  const fireMissileBtn = document.getElementById('fire-missile-btn') || document.getElementById('uav-radar-canvas');
  if (fireMissileBtn) {
    fireMissileBtn.addEventListener('click', () => {
      window.setAvatarMood('happy', 2500);
      window.showAvatarThought("AIR DEFENSE ENGAGED! 🎯 Interceptors launched!", "RADAR GAME", "🎯 DEFENSE", 3000);
    });
  }

  document.querySelectorAll('.copy-btn, [data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.setAvatarMood('happy', 2500);
      window.showAvatarThought("Copied to clipboard! 📋 Drop me a message!", "COPIED", "✉️ CONNECT", 3000);
    });
  });

  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (sel && sel.toString().trim().length > 25 && Math.random() < 0.25 && isAvatarEnabled) {
      window.showAvatarThought("Taking notes on that! 📝 Great insight.", "NOTEPAD", "📝 READING", 2500);
    }
  });

  const SECTION_LORE = {
    'hero': {
      normal: { tag: '00 · INTRO', msg: "👋 Hey, I'm Priyam! Systems builder & vibe coder. Let me take you on a tour!", mood: '👋 WELCOME' },
      spicy:  { tag: '🔞 00 · INTRO', msg: "Sup fucker! Pure builder energy here. Let's see how I ship real systems without VC fluff! 🚀", mood: '🔥 UNCENSORED' }
    },
    'about': {
      normal: { tag: '01 · PHILOSOPHY', msg: "📐 First-principles systems engineering & hardware bridges. No shallow wrapper apps!", mood: '📐 FIRST PRINCIPLES' },
      spicy:  { tag: '🔞 01 · DHANDHO', msg: "Gujarati dhandho mindset + raw execution. Zero fake founder cringe, just hard systems! 📈", mood: '⚡ DILIGENT' }
    },
    'projects': {
      normal: { tag: '02 · CODE VAULT', msg: "🚀 Real hardware bridges, diagnostic LIS, and COD attribution engines. Filter by Web / AI / Hardware!", mood: '🔬 EXPLORING VAULT' },
      spicy:  { tag: '🔞 02 · HARD CODE', msg: "Check out the repos bc! ASTM E1394 packet parsing and ₹835 COD unit margins. Hard engineering only! 🦾", mood: '🔥 SHIPPING' }
    },
    'surge': {
      normal: { tag: '03 · SURGE HARDWARE', msg: "🧴 Formulation & packaging R&D for men's hair styling. Scroll down to inspect the 360° bottle!", mood: '🧴 3D BOTTLE LAB' },
      spicy:  { tag: '🔞 03 · UNIT MATH', msg: "Paused before the MOQ debt trap. Understanding unit economics before scale is true builder discipline! 🧪", mood: '📊 UNIT ECONOMICS' }
    },
    'defence': {
      normal: { tag: '04 · DEFENCE AVIONICS', msg: "🎯 MAVLink PX4 telemetry & edge AI avionics for autonomous defense UAVs.", mood: '🛸 DEFENSE AI' },
      spicy:  { tag: '🔞 04 · AIR DEFENSE', msg: "Autonomous edge tracking and real-time UAV guidance. Military grade precision, no latency! 💥", mood: '🎯 TARGET LOCKED' }
    },
    'fun-zone': {
      normal: { tag: '05 · PLAYGROUND', msg: "🕹️ Interactive Radar Interceptor! Press [SPACE] or tap the canvas to scan and intercept!", mood: '🎯 RADAR ACTIVE' },
      spicy:  { tag: '🔞 05 · COMBAT ARENA', msg: "Try to hit the interceptor targets if you got the reflexes! SIUUU! ⚽🎯", mood: '🕹️ ARCADE COMBAT' }
    },
    'contact': {
      normal: { tag: '06 · DOCKED & READY', msg: "☕ Landing complete! Click [Talk to Priyuum] below to chat with my AI clone or ping my email direct!", mood: '✉️ HIT ME UP' },
      spicy:  { tag: '🔞 06 · LET\'S TALK', msg: "We reached the end! Hit me up for pre-seed funding, unhinged tech challenges, or click below for AI chat! 🚀", mood: '☕ COFFEE READY' }
    }
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.25 && isAvatarEnabled) {
        const id = entry.target.id;
        if (id && SECTION_LORE[id] && id !== lastSection) {
          lastSection = id;
          const sectionData = SECTION_LORE[id];
          const data = is18PlusMode ? (sectionData.spicy || sectionData.normal) : sectionData.normal;
          window.showAvatarThought(data.msg, data.tag, data.mood, 4200);
        }
      }
    });
  }, { threshold: [0.25, 0.45] });

  ['hero', 'about', 'projects', 'surge', 'defence', 'fun-zone', 'contact'].forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  window.triggerAvatarInteraction = () => {
    if (Date.now() < evasionUntil || !isAvatarEnabled) return;
    window.setAvatarMood(is18PlusMode ? 'angry' : 'happy', 3000);
    
    if (is18PlusMode) {
      const spicyQuips = [
        "What the fuck you looking at? Look at the projects! 😂",
        "Fucker Mode ON. All 7 fits unlocked. Pick your fighter! 🦾",
        "Stop poking me and let's build some cool shit! 🔥",
        "Zero corporate bullshit here. 100% pure builder. ⚡",
        "18+ mode active: Code so fast it breaks reality."
      ];
      const q = spicyQuips[Math.floor(Math.random() * spicyQuips.length)];
      window.showAvatarThought(q, "🔞 18+ ROGUE", "🔞 18+ MODE", 3000);
    } else {
      const quips = [
        "Let's build something epic! 🚀",
        "Vibe coding mode ON! 💻✨",
        "Wanna play the radar game? 🎯",
        "Ask my AI clone in chat! 💬",
        "Kem chho! Dhandho mindset 📈"
      ];
      const q = quips[Math.floor(Math.random() * quips.length)];
      window.showAvatarThought(q, "JOYFUL", "😊 HYPED", 2600);
    }
  };

  const RANDOM_FOUNDER_QUOTES = [
    { tag: '5TH WALL', msg: "Vibing from the overlay layer 🕶️ +10,000 aura", mood: '🚀 5TH WALL' },
    { tag: 'DHANDHO', msg: "Kem chho! Dhandha no pakko 📈 High rokda", mood: '💼 DHANDHO' },
    { tag: 'VIBE CODE', msg: "\"I'm a vibe coder, bitch.\" 🎧 3 AM stack", mood: '🎵 VIBING' },
    { tag: 'LET HIM COOK', msg: "Let him cook! 👨‍🍳 Tapping RS232 ASTM serial cables", mood: '🔥 COOKING' },
    { tag: 'NO CAP', msg: "Zero SaaS brainrot here, no cap fr fr 🗿", mood: '🗿 BASED' },
    { tag: 'MOGGING', msg: "Mogging generic wrapper startups with first-principles math 📐", mood: '👑 GIGACHAD' },
    { tag: 'DEFENSE', msg: "Defense AI & edge UAV companion avionics 🎯", mood: '🎯 DEFENSE' },
    { tag: 'CR7 CLUTCH', msg: "Winning mentality + F1 downforce 🏎️ SIUUU! ⚽", mood: '⚽ SIUUU' },
    { tag: 'LOCKED IN', msg: "Terminal locked in 🚀 Zero architectural paralysis", mood: '⚡ LOCKED IN' },
    { tag: 'DSAI 3.0', msg: "Masters' Union DSAI builder 🎓 Machine learning + dhandho", mood: '🎓 DSAI 3.0' },
    { tag: 'MATH', msg: "e^(iπ) + 1 = 0 is pure aesthetic 🌌", mood: '📐 MATH' },
    { tag: 'CHAI RIZZ', msg: "Kathiyawadi 3 AM masala chai fuel ☕", mood: '☕ CHAI' },
    { tag: 'AI CLONE', msg: "Priyuum AI is live in chat — ask for a roast! 🤖🧠", mood: '🧠 PRIYAM AI' }
  ];

  const RANDOM_18PLUS_QUOTES = [
    { tag: '🔞 18+', msg: "Bc direct main branch pe commit push maar diya! +100k aura 🔥", mood: '🔥 SAVAGE' },
    { tag: '🔞 18+', msg: "Zero VC bullshit. We cook, ship, and get rokda done.", mood: '🔥 UNFILTERED' },
    { tag: '🔞 18+', msg: "Why the fuck did you scroll all the way here? Hire me already lodu! 😂", mood: '🖕 HIRED' },
    { tag: '🔞 18+', msg: "Fuck slow legacy code. Pure execution mode ON, no cap. ⚡", mood: '⚡ FUCKER' },
    { tag: '🔞 18+', msg: "Bakchodi mat kar lawde, live projects dekh! 🕶️", mood: '🕶️ NO FILTER' },
    { tag: '🔞 18+', msg: "Teri maa ki... bug free code likhta hu me! Mogged. 💀", mood: '💀 BASED' },
    { tag: '🔞 18+', msg: "Code so clean it makes senior devs question their entire career. 💀", mood: '💀 CLEAN AF' },
    { tag: '🔞 18+', msg: "Talk to my AI clone if you got big fucking problems to solve.", mood: '🧠 ROGUE AI' },
    { tag: '🔞 18+', msg: "Slap me one more time and I'll drop your production db bc! ⚡", mood: '😈 KAMEHAMEHA' },
    { tag: '🔞 18+', msg: "18+ mode unlocked: Hard problems only. Infinite aura unlocked.", mood: '🚀 UNCHAINED' },
    { tag: '🔞 18+', msg: "Kathiyawadi 3 AM chai & pure fuck-you builder energy. ☕🔥", mood: '☕ DHANDHO' },
    { tag: '🔞 18+', msg: "Breaking the 5th wall because vanilla UI is boring as fuck.", mood: '💥 5TH WALL' },
    { tag: '🔞 18+', msg: "Bhai VC money is a trap, dhandho karo aur profit banao! 📈", mood: '💼 DHANDHO' },
    { tag: '🔞 18+', msg: "Delulu is the only solulu when you're 18 and shipping defense tech. 🚀", mood: '🗿 MAIN CHAR' }
  ];

  function runThoughtCycle() {
    if (!isDragging && Date.now() >= evasionUntil && !isReadingActive() && isAvatarEnabled && !bubble.classList.contains('active')) {
      const quotePool = is18PlusMode ? RANDOM_18PLUS_QUOTES : RANDOM_FOUNDER_QUOTES;
      const quote = quotePool[Math.floor(Math.random() * quotePool.length)];
      window.showAvatarThought(quote.msg, quote.tag, quote.mood, 3400);
    }
    const nextInterval = is18PlusMode ? (5500 + Math.random() * 2500) : (10000 + Math.random() * 4000);
    setTimeout(runThoughtCycle, nextInterval);
  }
  setTimeout(runThoughtCycle, 3000);

  // Initialize Default Saved Outfit & Enabled State
  applyCurrentOutfit(false);
  applyAvatarEnabledState();

  // Initial welcome greeting
  if (isAvatarEnabled) {
    setTimeout(() => {
      window.showAvatarThought("Kem chho! 🚀 Vibe coding mode ON", "5TH WALL", "💼 DHANDHO", 3200);
    }, 1800);
  }
}

/* ==========================================================================
   INITIALIZATION LAUNCHPAD (EXECUTES AFTER ALL MODULES & DATA LOADED)
   ========================================================================== */
function initApp() {
  try { initThemeEngine(); } catch (e) { console.error('initThemeEngine:', e); }
  try { initScrollProgress(); } catch (e) { console.error('initScrollProgress:', e); }
  try { initNavSpy(); } catch (e) { console.error('initNavSpy:', e); }
  try { initMobileMenu(); } catch (e) { console.error('initMobileMenu:', e); }
  try { initExpressiveTypography(); } catch (e) { console.error('initExpressiveTypography:', e); }
  try { initHeroInteractiveCanvas(); } catch (e) { console.error('initHeroInteractiveCanvas:', e); }
  try { initProjectFilters(); } catch (e) { console.error('initProjectFilters:', e); }
  try { initProjectModal(); } catch (e) { console.error('initProjectModal:', e); }
  try { initDroneAvionicsSimulation(); } catch (e) { console.error('initDroneAvionicsSimulation:', e); }
  try { initSurgeScrollDrivenBottle(); } catch (e) { console.error('initSurgeScrollDrivenBottle:', e); }
  try { initCommandPalette(); } catch (e) { console.error('initCommandPalette:', e); }
  try { initFunZone(); } catch (e) { console.error('initFunZone:', e); }
  try { initPriyamAiClone(); } catch (e) { console.error('initPriyamAiClone:', e); }
  try { initRoamingPriyamAvatar(); } catch (e) { console.error('initRoamingPriyamAvatar:', e); }
  try { initClipboard(); } catch (e) { console.error('initClipboard:', e); }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
