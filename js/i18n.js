/**
 * Lightweight i18n — loads translations from /locales/*.json
 * Supports data-i18n, data-i18n-aria, data-i18n-placeholder
 */

class I18n {
  constructor() {
    this.currentLang = this.getStoredLanguage() || this.detectLanguage();
    this.translations = {};
    this.fallbackLang = 'es';
  }

  detectLanguage() {
    const browserLang = navigator.language.split('-')[0];
    const supported = ['es', 'en', 'pt'];
    return supported.includes(browserLang) ? browserLang : 'es';
  }

  getStoredLanguage() {
    return localStorage.getItem('ta-lang');
  }

  setStoredLanguage(lang) {
    localStorage.setItem('ta-lang', lang);
  }

  async loadTranslations(lang) {
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (!response.ok) throw new Error(`Failed to load ${lang}`);
      this.translations[lang] = this.flatten(await response.json());
      return true;
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);
      return false;
    }
  }

  /**
   * Flatten nested JSON to dot-notation keys
   * e.g. { nav: { home: "Inicio" } } → { "nav.home": "Inicio" }
   */
  flatten(obj, prefix = '') {
    const flat = {};
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(flat, this.flatten(value, fullKey));
      } else {
        flat[fullKey] = value;
      }
    }
    return flat;
  }

  t(key, lang = this.currentLang) {
    const dict = this.translations[lang];
    if (dict && dict[key] !== undefined) return dict[key];

    // Fallback
    if (lang !== this.fallbackLang) {
      return this.t(key, this.fallbackLang);
    }
    return key;
  }

  updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      const icon = el.querySelector('[aria-hidden="true"]');
      if (icon) {
        el.textContent = '';
        el.appendChild(icon);
        el.append(' ' + text);
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', this.t(key));
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
    });

    document.documentElement.setAttribute('lang', this.currentLang);
  }

  async changeLanguage(lang) {
    if (!this.translations[lang]) {
      const loaded = await this.loadTranslations(lang);
      if (!loaded) return false;
    }

    this.currentLang = lang;
    this.setStoredLanguage(lang);
    this.updateContent();

    document.querySelectorAll('.lang-btn').forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === lang;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    document.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: this.currentLang }
    }));

    return true;
  }

  async init() {
    await this.loadTranslations(this.currentLang);

    if (this.currentLang !== this.fallbackLang) {
      await this.loadTranslations(this.fallbackLang);
    }

    this.updateContent();

    document.querySelectorAll('.lang-btn').forEach(btn => {
      const isActive = btn.getAttribute('data-lang') === this.currentLang;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');

      btn.addEventListener('click', () => {
        this.changeLanguage(btn.getAttribute('data-lang'));
      });
    });

    return this;
  }
}

const i18n = new I18n();
window.i18n = i18n;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
  i18n.init();
}
