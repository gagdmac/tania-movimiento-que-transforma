/* ══════════════════════════════════════════════════════
   TANIA ANGULO — Main JavaScript
   Accessibility · Navigation · Interactions
   ══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.remove('no-js');
  initA11yPanel();
  initScrollReveal();
  initHeaderScroll();
  initFAQ();
  initMobileNav();
  initYtHeroPause();
});


/* ══════════════════════════════════════════════════════
   ACCESSIBILITY PANEL
   ══════════════════════════════════════════════════════ */
function initA11yPanel() {
  const toggleBtn = document.getElementById('a11y-toggle');
  const toggleBtnDesktop = document.getElementById('a11y-toggle-desktop');
  const panel = document.getElementById('a11y-panel');
  const closeBtn = document.getElementById('a11y-close');
  if (!panel) return;

  const allToggles = [toggleBtn, toggleBtnDesktop].filter(Boolean);
  if (!allToggles.length) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'a11y-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  // Move panel to body so it's not trapped in a stacking context
  document.body.appendChild(panel);

  let panelOpen = false;

  // Restore preferences
  restoreA11yPrefs();

  function openPanel() {
    panelOpen = true;
    overlay.classList.add('active');
    panel.setAttribute('aria-hidden', 'false');
    allToggles.forEach(b => b.setAttribute('aria-expanded', 'true'));
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('main, footer, .site-header').forEach(el => el.setAttribute('inert', ''));
    if (closeBtn) closeBtn.focus();
  }

  function closePanel() {
    panelOpen = false;
    overlay.classList.remove('active');
    panel.setAttribute('aria-hidden', 'true');
    allToggles.forEach(b => b.setAttribute('aria-expanded', 'false'));
    document.body.style.overflow = '';
    document.querySelectorAll('main, footer, .site-header').forEach(el => el.removeAttribute('inert'));
    const visible = allToggles.find(b => b.offsetParent !== null);
    if (visible) visible.focus();
  }

  allToggles.forEach(btn => btn.addEventListener('click', () => {
    if (panelOpen) closePanel(); else openPanel();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);

  // Close on Escape + focus trap
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePanel();
      return;
    }
    // Focus trap within panel
    if (e.key === 'Tab') {
      const focusable = panel.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Dark mode toggle
  const darkToggle = document.getElementById('a11y-dark');
  if (darkToggle) {
    darkToggle.addEventListener('change', () => {
      document.documentElement.setAttribute('data-theme', darkToggle.checked ? 'dark' : 'light');
      localStorage.setItem('ta-theme', darkToggle.checked ? 'dark' : 'light');
    });
  }

  // High contrast toggle
  const contrastToggle = document.getElementById('a11y-contrast');
  if (contrastToggle) {
    contrastToggle.addEventListener('change', () => {
      document.documentElement.setAttribute('data-high-contrast', contrastToggle.checked ? 'true' : 'false');
      localStorage.setItem('ta-contrast', contrastToggle.checked ? 'true' : 'false');
    });
  }

  // Reduce motion toggle
  const motionToggle = document.getElementById('a11y-motion');
  if (motionToggle) {
    motionToggle.addEventListener('change', () => {
      document.documentElement.setAttribute('data-reduce-motion', motionToggle.checked ? 'true' : 'false');
      localStorage.setItem('ta-motion', motionToggle.checked ? 'true' : 'false');
    });
  }

  // Highlight focus toggle
  const focusToggle = document.getElementById('a11y-focus');
  if (focusToggle) {
    focusToggle.addEventListener('change', () => {
      document.documentElement.setAttribute('data-highlight-focus', focusToggle.checked ? 'true' : 'false');
      localStorage.setItem('ta-focus', focusToggle.checked ? 'true' : 'false');
    });
  }

  // Underline links toggle
  const linksToggle = document.getElementById('a11y-links');
  if (linksToggle) {
    linksToggle.addEventListener('change', () => {
      document.documentElement.setAttribute('data-underline-links', linksToggle.checked ? 'true' : 'false');
      localStorage.setItem('ta-links', linksToggle.checked ? 'true' : 'false');
    });
  }

  // Text size buttons
  document.querySelectorAll('.text-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const scale = btn.getAttribute('data-scale');
      document.documentElement.style.setProperty('--a11y-text-scale', scale);
      document.documentElement.setAttribute('data-text-zoom', scale);
      localStorage.setItem('ta-text-scale', scale);
      document.querySelectorAll('.text-size-btn').forEach(b => {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
    });
  });
}

function restoreA11yPrefs() {
  // Theme
  const theme = localStorage.getItem('ta-theme');
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const darkToggle = document.getElementById('a11y-dark');
    if (darkToggle) darkToggle.checked = theme === 'dark';
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    const darkToggle = document.getElementById('a11y-dark');
    if (darkToggle) darkToggle.checked = true;
  }

  // High contrast
  const contrast = localStorage.getItem('ta-contrast');
  if (contrast === 'true') {
    document.documentElement.setAttribute('data-high-contrast', 'true');
    const el = document.getElementById('a11y-contrast');
    if (el) el.checked = true;
  }

  // Reduce motion
  const motion = localStorage.getItem('ta-motion');
  if (motion === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.setAttribute('data-reduce-motion', 'true');
    const el = document.getElementById('a11y-motion');
    if (el) el.checked = true;
  }

  // Highlight focus
  const focus = localStorage.getItem('ta-focus');
  if (focus === 'true') {
    document.documentElement.setAttribute('data-highlight-focus', 'true');
    const el = document.getElementById('a11y-focus');
    if (el) el.checked = true;
  }

  // Underline links
  const links = localStorage.getItem('ta-links');
  if (links === 'true') {
    document.documentElement.setAttribute('data-underline-links', 'true');
    const el = document.getElementById('a11y-links');
    if (el) el.checked = true;
  }

  // Text scale
  const scale = localStorage.getItem('ta-text-scale');
  if (scale) {
    document.documentElement.style.setProperty('--a11y-text-scale', scale);
    document.documentElement.setAttribute('data-text-zoom', scale);
    document.querySelectorAll('.text-size-btn').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-scale') === scale ? 'true' : 'false');
    });
  }
}

/* ══════════════════════════════════════════════════════
   SCROLL REVEAL
   ══════════════════════════════════════════════════════ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════
   HEADER SCROLL EFFECT
   ══════════════════════════════════════════════════════ */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ══════════════════════════════════════════════════════
   FAQ ACCORDION
   ══════════════════════════════════════════════════════ */
function initFAQ() {
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panelId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      if (!panel) return;

      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      panel.setAttribute('aria-hidden', expanded ? 'true' : 'false');
    });
  });
}

/* ══════════════════════════════════════════════════════
   MOBILE NAVIGATION
   ══════════════════════════════════════════════════════ */
function initMobileNav() {
  const toggler = document.querySelector('.navbar-toggler');
  const collapse = document.querySelector('.navbar-collapse');
  const closeBtn = collapse ? collapse.querySelector('.btn-close-menu') : null;
  const nav = document.querySelector('.site-header .navbar');
  if (!toggler || !collapse || !nav) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-nav-overlay';
  document.body.appendChild(overlay);

  let menuOpen = false;

  // Move collapse out of header on mobile so backdrop-filter
  // doesn't break position:fixed and z-index stacking
  const mql = window.matchMedia('(max-width: 767.98px)');
  function handleViewport(e) {
    if (e.matches) {
      document.body.appendChild(collapse);
    } else {
      nav.appendChild(collapse);
      if (menuOpen) closeMenu();
    }
  }

  function openMenu() {
    menuOpen = true;
    overlay.classList.add('active');
    collapse.classList.add('show');
    toggler.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Set inert on main content (not header, so toggler stays clickable)
    document.querySelectorAll('main, footer').forEach(el => el.setAttribute('inert', ''));
  }

  function closeMenu() {
    menuOpen = false;
    overlay.classList.remove('active');
    collapse.classList.remove('show');
    toggler.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    document.querySelectorAll('main, footer').forEach(el => el.removeAttribute('inert'));

    toggler.focus();
  }

  // Init viewport handler after function declarations
  mql.addEventListener('change', handleViewport);
  handleViewport(mql);

  toggler.addEventListener('click', () => {
    if (menuOpen) closeMenu(); else openMenu();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  // Close on nav link click (mobile)
  collapse.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (menuOpen) closeMenu();
    });
  });

  // Focus trap inside menu
  collapse.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !menuOpen) return;
    const focusable = collapse.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}


/* ══════════════════════════════════════════════════════
   YOUTUBE HERO PAUSE / PLAY
   ══════════════════════════════════════════════════════ */
function initYtHeroPause() {
  const btn = document.getElementById('yt-hero-pause');
  const iframe = document.getElementById('yt-hero-iframe');
  if (!btn || !iframe) return;

  let playing = true;

  btn.addEventListener('click', () => {
    const cmd = playing ? 'pauseVideo' : 'playVideo';
    iframe.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: cmd, args: [] }),
      '*'
    );
    playing = !playing;
    btn.querySelector('i').className = playing ? 'fas fa-pause' : 'fas fa-play';
    btn.setAttribute('aria-label', playing ? 'Pausar vídeo de fondo' : 'Reproducir vídeo de fondo');
  });
}
