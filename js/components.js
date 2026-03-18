/* ══════════════════════════════════════════════════════
   TANIA ANGULO — Shared Components
   Head injection · <site-header> · <site-footer>
   ══════════════════════════════════════════════════════ */

/* ── Inject common <head> tags ── */
(function () {
  const head = document.head;
  if (head.querySelector('link[href*="bootstrap"]')) return;

  const fragment = document.createDocumentFragment();
  const tags = [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css' },
    { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css' },
    { rel: 'stylesheet', href: '/css/style.css' }
  ];
  tags.forEach(attrs => {
    const link = document.createElement('link');
    Object.entries(attrs).forEach(([k, v]) => link.setAttribute(k, v));
    fragment.appendChild(link);
  });
  head.appendChild(fragment);
})();

/* ══════════════════════════════════════════════════════
   <site-header current-page="index|youtube|events|contacto">
   ══════════════════════════════════════════════════════ */
class SiteHeader extends HTMLElement {
  connectedCallback() {
    const page = this.getAttribute('current-page') || '';
    const navItems = [
      { href: '/', key: 'nav.home', label: 'Inicio', page: 'index' },
      { href: '/youtube/', key: 'nav.youtube', label: 'YouTube', page: 'youtube' },
      { href: '/events/', key: 'nav.events', label: 'Events', page: 'events', hidden: true },
      { href: '/contacto/', key: 'nav.contact', label: 'Contacto', page: 'contacto' }
    ];

    const navHTML = navItems.map(item => {
      const current = item.page === page ? ' aria-current="page"' : '';
      const hidden = item.hidden ? ' hidden' : '';
      return `<li${hidden}><a href="${item.href}" class="nav-link"${current} data-i18n="${item.key}">${item.label}</a></li>`;
    }).join('\n              ');

    this.innerHTML = `
    <header class="site-header px-2" role="banner">
      <a href="#main-content" class="skip-link">Ir al contenido principal</a>
      <div class="navbar navbar-expand-md container">
        <a href="/" class="navbar-brand" aria-label="Tania Angulo — Inicio">Tania<span>.</span></a>
        <div class="d-flex align-items-center gap-1 d-md-none">
          <button id="a11y-toggle" class="a11y-toggle-btn" aria-expanded="false" aria-controls="a11y-panel" data-i18n-aria="a11y.btnLabel" aria-label="Opciones de accesibilidad">
            <i class="fas fa-universal-access" aria-hidden="true"></i>
          </button>
          <button class="navbar-toggler" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Abrir menú de navegación">
            <span class="hamburger-icon" aria-hidden="true"><span></span><span></span><span></span></span>
          </button>
        </div>
        <div class="flex justify-content-between navbar-collapse" id="main-nav">
          <button class="btn-close-menu" aria-label="Cerrar menú" data-i18n-aria="nav.closeMenu">
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
          <button id="a11y-toggle-desktop" class="a11y-toggle-btn d-none d-md-flex me-3" aria-expanded="false" aria-controls="a11y-panel" data-i18n-aria="a11y.btnLabel" aria-label="Opciones de accesibilidad">
            <i class="fas fa-universal-access" aria-hidden="true"></i>
          </button>
          <nav aria-label="Navegación principal">
            <ul class="navbar-nav ms-auto mb-0 gap-0" role="list">
                ${navHTML}
            </ul>
          </nav>
        </div>
      </div>
    </header>`;
  }
}
customElements.define('site-header', SiteHeader);

/* ══════════════════════════════════════════════════════
   <site-footer>
   Includes footer + a11y panel + live region
   ══════════════════════════════════════════════════════ */
class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <footer class="site-footer" aria-label="Footer">
      <div class="footer-bg-shapes" aria-hidden="true">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
      </div>
      <div class="container">
        <div class="row g-5">
          <div class="col-12 col-lg-4">
            <p class="footer-brand">Tania<span>.</span></p>
            <p class="footer-desc" data-i18n="footer.desc">Acompaño a mujeres a fortalecer su cuerpo, cuidar su centro y reconectar con su bienestar a través de movimiento que transforma.</p>
            <div class="footer-social mt-4">
              <a href="#" aria-label="YouTube"><i class="fab fa-youtube" aria-hidden="true"></i></a>
              <a href="#" aria-label="Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
            </div>
          </div>
          <div class="col-6 col-lg-2">
            <h3 class="footer-heading" data-i18n="footer.nav">Navegación</h3>
            <ul class="footer-links" role="list">
              <li><a href="/" data-i18n="nav.home">Inicio</a></li>
              <li><a href="/youtube/" data-i18n="nav.youtube">YouTube</a></li>
              <li hidden><a href="/events/" data-i18n="nav.events">Events</a></li>
              <li><a href="/contacto/" data-i18n="nav.contact">Contacto</a></li>
            </ul>
          </div>
          <div class="col-6 col-lg-2">
            <h3 class="footer-heading" data-i18n="footer.a11y">Accesibilidad</h3>
            <ul class="footer-links" role="list">
              <li><a href="/accesibilidad/" data-i18n="footer.a11y"><i class="fas fa-universal-access" aria-hidden="true"></i> Accesibilidad</a></li>
            </ul>
          </div>
          <div class="col-12 col-lg-4">
            <h3 class="footer-heading" data-i18n="footer.connect">Conecta</h3>
            <blockquote class="footer-quote">
              <p data-i18n="footer.quote">Entrena con inteligencia. Muévete con conciencia. Siéntete más fuerte.</p>
            </blockquote>
          </div>
        </div>
        <div class="footer-bottom">
          <p data-i18n="footer.rights">&copy; 2026 Tania Angulo. Todos los derechos reservados.</p>
          <a href="#main-content" class="footer-back-top" aria-label="Volver arriba">
            <i class="fas fa-arrow-up" aria-hidden="true"></i>
          </a>
        </div>
        <div class="visually-hidden" aria-live="polite" id="a11y-live"></div>
      </div>
    </footer>

    <div id="a11y-panel" class="a11y-panel" role="region" aria-labelledby="a11y-panel-title" aria-hidden="true">
      <div class="a11y-panel-title">
        <span id="a11y-panel-title" data-i18n="a11y.title">Accesibilidad</span>
        <button id="a11y-close" class="a11y-close-btn" data-i18n-aria="a11y.close" aria-label="Cerrar panel">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
      <div class="a11y-option">
        <span class="a11y-option-label" data-i18n="a11y.textSize">Tamaño de texto</span>
        <div class="text-size-group" role="group" aria-label="Tamaño de texto">
          <button class="text-size-btn" data-scale="1" aria-pressed="true" aria-label="100%">A</button>
          <button class="text-size-btn" data-scale="1.25" aria-pressed="false" aria-label="125%">A+</button>
          <button class="text-size-btn" data-scale="1.5" aria-pressed="false" aria-label="150%">A++</button>
          <button class="text-size-btn" data-scale="2" aria-pressed="false" aria-label="200%">A+++</button>
        </div>
      </div>
      <div class="a11y-option">
        <label class="a11y-option-label" for="a11y-contrast" data-i18n="a11y.highContrast">Alto contraste</label>
        <div class="toggle-switch">
          <input type="checkbox" id="a11y-contrast" role="switch">
          <span class="toggle-track" aria-hidden="true"></span>
        </div>
      </div>
      <div class="a11y-option">
        <label class="a11y-option-label" for="a11y-dark" data-i18n="a11y.darkMode">Modo oscuro</label>
        <div class="toggle-switch">
          <input type="checkbox" id="a11y-dark" role="switch">
          <span class="toggle-track" aria-hidden="true"></span>
        </div>
      </div>
      <div class="a11y-option">
        <label class="a11y-option-label" for="a11y-motion" data-i18n="a11y.reduceMotion">Reducir movimiento</label>
        <div class="toggle-switch">
          <input type="checkbox" id="a11y-motion" role="switch">
          <span class="toggle-track" aria-hidden="true"></span>
        </div>
      </div>
      <div class="a11y-option">
        <label class="a11y-option-label" for="a11y-focus" data-i18n="a11y.highlightFocus">Resaltar foco</label>
        <div class="toggle-switch">
          <input type="checkbox" id="a11y-focus" role="switch">
          <span class="toggle-track" aria-hidden="true"></span>
        </div>
      </div>
      <div class="a11y-option">
        <label class="a11y-option-label" for="a11y-links" data-i18n="a11y.underlineLinks">Subrayar enlaces</label>
        <div class="toggle-switch">
          <input type="checkbox" id="a11y-links" role="switch">
          <span class="toggle-track" aria-hidden="true"></span>
        </div>
      </div>
      <div class="a11y-option">
        <span class="a11y-option-label" data-i18n="a11y.language">Idioma</span>
        <div class="lang-selector" role="group" aria-label="Selector de idioma">
          <button class="lang-btn" data-lang="es" aria-pressed="true" aria-label="Español">ES</button>
          <button class="lang-btn" data-lang="en" aria-pressed="false" aria-label="English">EN</button>
          <button class="lang-btn" data-lang="pt" aria-pressed="false" aria-label="Português">PT</button>
        </div>
      </div>
    </div>
`;
  }
}
customElements.define('site-footer', SiteFooter);
