/* ═══════════════════════════════════════════════════════
   MANDATUM · components.js
   Defines <mandatum-header> and <mandatum-footer>.
   ═══════════════════════════════════════════════════════ */

/* ── CONFIG ─────────────────────────────────────────────
   Edit only this block.
   ═══════════════════════════════════════════════════════ */
var CONFIG = {
  DEFAULT_THEME : 'aegis',  // 'mandatum' | 'aegis'
  PERSIST_THEME : false,        // remember across sessions
  SHOW_TOGGLE   : false,       // true = show button in header
  SHORTCUT      : { key: 'T', ctrlKey: true, shiftKey: true }
};
/* ═══════════════════════════════════════════════════════ */

var THEMES = ['mandatum', 'aegis'];
var STORAGE_KEY = 'mandatum-theme';

/* ── THEME HELPERS ─────────────────────────────────────── */
function getTheme() {
  if (CONFIG.PERSIST_THEME) {
    var saved = '';
    try { saved = localStorage.getItem(STORAGE_KEY) || ''; } catch (e) {}
    if (saved) return saved;
  }
  return CONFIG.DEFAULT_THEME;
}

function saveTheme(t) {
  if (CONFIG.PERSIST_THEME) {
    try { localStorage.setItem(STORAGE_KEY, t); } catch (e) {}
  }
}

function applyTheme(theme, animate) {
  var html = document.documentElement;
  if (animate) {
    html.classList.add('theme-transitioning');
    setTimeout(function () { html.classList.remove('theme-transitioning'); }, 400);
  }
  html.setAttribute('data-theme', theme);
  document.querySelectorAll('.theme-orb').forEach(function (el) {
    el.style.display = (theme === 'aegis') ? 'block' : 'none';
  });
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    var lbl = btn.querySelector('.theme-toggle-label');
    var ico = btn.querySelector('.theme-toggle-icon');
    if (lbl) lbl.textContent = (theme === 'aegis') ? 'Mandatum' : 'Aegis';
    if (ico) ico.textContent  = (theme === 'aegis') ? '◐' : '◑';
  });
}

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme') || CONFIG.DEFAULT_THEME;
  var next = THEMES.filter(function (t) { return t !== current; })[0] || CONFIG.DEFAULT_THEME;
  saveTheme(next);
  applyTheme(next, true);
}

/* Apply saved theme immediately to prevent flash */
(function () {
  var t = getTheme();
  document.documentElement.setAttribute('data-theme', t);
})();

/* Keyboard shortcut */
if (CONFIG.SHORTCUT) {
  document.addEventListener('keydown', function (e) {
    var s = CONFIG.SHORTCUT;
    if (e.key === s.key &&
        (!!e.ctrlKey)  === (!!s.ctrlKey) &&
        (!!e.shiftKey) === (!!s.shiftKey) &&
        (!!e.altKey)   === (!!s.altKey)) {
      e.preventDefault();
      toggleTheme();
    }
  });
}

/* Public API */
window.Mandatum = {
  setTheme:    function (t) { if (THEMES.indexOf(t) > -1) { saveTheme(t); applyTheme(t, true); } },
  getTheme:    function ()  { return document.documentElement.getAttribute('data-theme'); },
  toggleTheme: function ()  { toggleTheme(); }
};

/* ── NAV LINKS ─────────────────────────────────────────── */
var NAV_LINKS = [
  { href: 'pricing.html',        label: 'Pricing' },
  { href: 'security.html',       label: 'Security' },
  { href: 'command.html', label: 'Command Center' },
  { href: 'LATAM.html',          label: 'LATAM' },
  { href: 'investors.html',      label: 'Investors' },
  { href: 'contact.html',        label: 'Contact' }
];

var LANGS = [
  { href: '#', code: 'EN', active: true },
  { href: '#', code: 'ES' },
  { href: '#', code: 'PT' }
];

function isActive(href) {
  var page = (window.location.pathname.split('/').pop()) || 'index.html';
  return href === page;
}

function themeToggleHTML() {
  if (!CONFIG.SHOW_TOGGLE) return '';
  var t = getTheme();
  var icon  = (t === 'aegis') ? '◐' : '◑';
  var label = (t === 'aegis') ? 'Mandatum' : 'Aegis';
  return '<button class="theme-toggle" id="theme-toggle" aria-label="Switch theme">' +
         '<span class="theme-toggle-icon">' + icon + '</span>' +
         '<span class="theme-toggle-label">' + label + '</span>' +
         '</button>';
}

/* ── HEADER COMPONENT ─────────────────────────────────── */
var MandatumHeader = (function () {
  function MandatumHeader() {
    return Reflect.construct(HTMLElement, [], MandatumHeader);
  }
  MandatumHeader.prototype = Object.create(HTMLElement.prototype);
  MandatumHeader.prototype.constructor = MandatumHeader;

  MandatumHeader.prototype.connectedCallback = function () {
    var dark = this.hasAttribute('dark');

    var dLinks = NAV_LINKS.map(function (l) {
      var cls = isActive(l.href) ? ' class="active"' : '';
      return '<a href="' + l.href + '"' + cls + '>' + l.label + '</a>';
    }).join('');

    var mLinks = NAV_LINKS.map(function (l) {
      var cls = isActive(l.href) ? ' class="active"' : '';
      return '<a href="' + l.href + '"' + cls + '>' + l.label + '</a>';
    }).join('');

    var lD = LANGS.map(function (l) {
      return '<a href="' + l.href + '"' + (l.active ? ' class="active"' : '') + '>' + l.code + '</a>';
    }).join('');

    var lM = LANGS.map(function (l) {
      return '<a href="' + l.href + '"' + (l.active ? ' class="active"' : '') + '>' + l.code + '</a>';
    }).join('');

    this.innerHTML =
      '<div class="theme-orb theme-orb-1" aria-hidden="true"></div>' +
      '<div class="theme-orb theme-orb-2" aria-hidden="true"></div>' +
      '<div class="nav-overlay" id="nav-overlay"></div>' +
      '<header class="site-header' + (dark ? ' dark' : '') + '" id="site-header">' +
        '<a href="index.html" class="logo-container" aria-label="Mandatum home">' +
          '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
            '<path d="M12 2L20 6V12C20 17 16.5 21 12 22C7.5 21 4 17 4 12V6L12 2Z" stroke="currentColor" stroke-width="1.6"/>' +
            '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.2"/>' +
            '<circle cx="12" cy="12" r="7" stroke="currentColor" stroke-opacity="0.4" stroke-width="1"/>' +
          '</svg>' +
          '<div class="logo-wordmark" aria-hidden="true">M<span>A</span>NDATUM</div>' +
        '</a>' +
        '<nav class="nav-desktop" aria-label="Main navigation">' +
          dLinks +
          '<div class="lang-selector" aria-label="Language">' + lD + '</div>' +
          themeToggleHTML() +
          '<a href="contact.html" class="nav-cta">Request access</a>' +
        '</nav>' +
        '<button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-mobile">' +
          '<span class="hamburger-bar"></span>' +
          '<span class="hamburger-bar"></span>' +
          '<span class="hamburger-bar"></span>' +
        '</button>' +
      '</header>' +
      '<nav class="nav-mobile" id="nav-mobile" aria-label="Mobile navigation" aria-hidden="true">' +
        mLinks +
        '<div class="nav-mobile-lang" aria-label="Language">' + lM + '</div>' +
        '<a href="contact.html" class="nav-mobile-cta">Request access &#8594;</a>' +
      '</nav>';

    /* Apply orb visibility */
    var cur = getTheme();
    this.querySelectorAll('.theme-orb').forEach(function (el) {
      el.style.display = (cur === 'aegis') ? 'block' : 'none';
    });

    this._initMenu();
    if (CONFIG.SHOW_TOGGLE) this._initToggle();
    this._initScroll();
  };

  MandatumHeader.prototype._initMenu = function () {
    var btn     = this.querySelector('#nav-hamburger');
    var drawer  = this.querySelector('#nav-mobile');
    var overlay = this.querySelector('#nav-overlay');

    if (!btn || !drawer || !overlay) return;

    function open() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', function () {
      if (btn.classList.contains('open')) { close(); } else { open(); }
    });
    overlay.addEventListener('click', close);
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  };

  MandatumHeader.prototype._initToggle = function () {
    var btn = this.querySelector('#theme-toggle');
    if (btn) btn.addEventListener('click', toggleTheme);
  };

  MandatumHeader.prototype._initScroll = function () {
    var header = this.querySelector('#site-header');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 8 ? '0 1px 20px rgba(0,0,0,.10)' : '';
    }, { passive: true });
  };

  return MandatumHeader;
})();

/* ── FOOTER COMPONENT ─────────────────────────────────── */
var MandatumFooter = (function () {
  function MandatumFooter() {
    return Reflect.construct(HTMLElement, [], MandatumFooter);
  }
  MandatumFooter.prototype = Object.create(HTMLElement.prototype);
  MandatumFooter.prototype.constructor = MandatumFooter;

  MandatumFooter.prototype.connectedCallback = function () {
    var dark  = this.hasAttribute('dark');
    var year  = new Date().getFullYear();
    var links = NAV_LINKS.map(function (l) {
      return '<a href="' + l.href + '">' + l.label + '</a>';
    }).join('');

    this.innerHTML =
      '<footer class="site-footer' + (dark ? ' dark' : '') + '">' +
        '<div class="footer-inner">' +
          '<a href="index.html" class="footer-brand" aria-label="Mandatum home">M<span>A</span>NDATUM</a>' +
          '<nav class="footer-links" aria-label="Footer navigation">' + links + '</nav>' +
          '<div class="footer-info">' +
            '&copy; ' + year + ' Mandatum &nbsp;&middot;&nbsp; ' +
            '<a href="mailto:hello@mandatum.io">hello@mandatum.io</a>' +
            ' &nbsp;&middot;&nbsp; mandatum.io' +
          '</div>' +
        '</div>' +
      '</footer>';
  };

  return MandatumFooter;
})();

/* ── REGISTER ──────────────────────────────────────────── */
customElements.define('mandatum-header', MandatumHeader);
customElements.define('mandatum-footer', MandatumFooter);
