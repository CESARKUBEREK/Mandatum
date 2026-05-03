/* ═══════════════════════════════════════════════════════
   MANDATUM · SHARED COMPONENTS · assets/components.js
   Injects <mandatum-header> and <mandatum-footer> into
   every page. Edit once, updates everywhere.
   ═══════════════════════════════════════════════════════ */
 
(function () {
  'use strict';
 
  /* ── NAV LINKS CONFIG ──────────────────────────────── */
  const NAV_LINKS = [
    { href: 'pricing.html',         label: 'Pricing' },
    { href: 'security.html',        label: 'Security' },
    { href: 'command-center.html',  label: 'Command Center' },
    { href: 'latam.html',           label: 'LATAM' },
    { href: 'investors.html',       label: 'Investors' },
    { href: 'contact.html',         label: 'Contact' },
  ];
 
  const LANGS = [
    { href: '#', code: 'EN', active: true },
    { href: '#', code: 'ES' },
    { href: '#', code: 'PT' },
  ];
 
  /* ── HELPER: detect active page ────────────────────── */
  function isActive(href) {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    return href === page;
  }
 
  /* ── HELPER: resolve root path ─────────────────────── */
  // Pages may live in subdirectories; adjust asset paths if needed.
  function root() {
    return typeof MANDATUM_ROOT !== 'undefined' ? MANDATUM_ROOT : '';
  }
 
  /* ═══════════════════════════════════════════════════════
     HEADER COMPONENT
     Usage: <mandatum-header dark></mandatum-header>
       dark  attr → dark background variant (for pages
               with full-bleed dark hero above the fold)
     ═══════════════════════════════════════════════════════ */
  class MandatumHeader extends HTMLElement {
    connectedCallback() {
      const dark = this.hasAttribute('dark');
 
      const desktopLinks = NAV_LINKS.map(l => {
        const active = isActive(l.href) ? ' active' : '';
        return `<a href="${root()}${l.href}" class="${active}">${l.label}</a>`;
      }).join('');
 
      const mobileLinks = NAV_LINKS.map(l => {
        const active = isActive(l.href) ? ' active' : '';
        return `<a href="${root()}${l.href}" class="${active}">${l.label}</a>`;
      }).join('');
 
      const langDesktop = LANGS.map(l =>
        `<a href="${l.href}"${l.active ? ' class="active"' : ''}>${l.code}</a>`
      ).join('');
 
      const langMobile = LANGS.map(l =>
        `<a href="${l.href}"${l.active ? ' class="active"' : ''}>${l.code}</a>`
      ).join('');
 
      this.innerHTML = `
        <!-- Mobile overlay -->
        <div class="nav-overlay" id="nav-overlay"></div>
 
        <header class="site-header${dark ? ' dark' : ''}" id="site-header">
          <!-- Logo -->
          <a href="${root()}index.html" class="logo-container" aria-label="Mandatum home">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2L20 6V12C20 17 16.5 21 12 22C7.5 21 4 17 4 12V6L12 2Z"
                    stroke="currentColor" stroke-width="1.6"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.2"/>
              <circle cx="12" cy="12" r="7" stroke="currentColor"
                      stroke-opacity="0.4" stroke-width="1"/>
            </svg>
            <div class="logo-wordmark" aria-hidden="true">M<span>A</span>NDATUM</div>
          </a>
 
          <!-- Desktop navigation -->
          <nav class="nav-desktop" aria-label="Main navigation">
            ${desktopLinks}
            <div class="lang-selector" aria-label="Language selector">
              ${langDesktop}
            </div>
            <a href="${root()}contact.html" class="nav-cta">Request access</a>
          </nav>
 
          <!-- Mobile hamburger -->
          <button class="nav-hamburger" id="nav-hamburger"
                  aria-label="Toggle navigation" aria-expanded="false"
                  aria-controls="nav-mobile">
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
          </button>
        </header>
 
        <!-- Mobile drawer -->
        <nav class="nav-mobile" id="nav-mobile"
             aria-label="Mobile navigation" aria-hidden="true">
          ${mobileLinks}
          <div class="nav-mobile-lang">${langMobile}</div>
          <a href="${root()}contact.html" class="nav-mobile-cta">Request access →</a>
        </nav>
      `;
 
      this._initMobileMenu();
    }
 
    _initMobileMenu() {
      const btn     = this.querySelector('#nav-hamburger');
      const drawer  = this.querySelector('#nav-mobile');
      const overlay = this.querySelector('#nav-overlay');
      const header  = this.querySelector('#site-header');
 
      const open = () => {
        drawer.classList.add('open');
        overlay.classList.add('open');
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        drawer.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      };
 
      const close = () => {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      };
 
      btn.addEventListener('click', () => {
        btn.classList.contains('open') ? close() : open();
      });
 
      overlay.addEventListener('click', close);
 
      // Close on link click
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', close);
      });
 
      // Close on Escape
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') close();
      });
 
      // Scroll behaviour: add shadow when scrolled
      window.addEventListener('scroll', () => {
        if (window.scrollY > 8) {
          header.style.boxShadow = '0 1px 20px rgba(0,0,0,.08)';
        } else {
          header.style.boxShadow = '';
        }
      }, { passive: true });
    }
  }
 
  /* ═══════════════════════════════════════════════════════
     FOOTER COMPONENT
     Usage: <mandatum-footer></mandatum-footer>
            <mandatum-footer dark></mandatum-footer>
     ═══════════════════════════════════════════════════════ */
  class MandatumFooter extends HTMLElement {
    connectedCallback() {
      const dark = this.hasAttribute('dark');
 
      const footerLinks = NAV_LINKS.map(l =>
        `<a href="${root()}${l.href}">${l.label}</a>`
      ).join('');
 
      const year = new Date().getFullYear();
 
      this.innerHTML = `
        <footer class="site-footer${dark ? ' dark' : ''}">
          <div class="footer-inner">
            <a href="${root()}index.html" class="footer-brand" aria-label="Mandatum home">
              M<span>A</span>NDATUM
            </a>
            <nav class="footer-links" aria-label="Footer navigation">
              ${footerLinks}
            </nav>
            <div class="footer-info">
              © ${year} Mandatum &nbsp;·&nbsp;
              <a href="mailto:hello@mandatum.io">hello@mandatum.io</a>
              &nbsp;·&nbsp; mandatum.io
            </div>
          </div>
        </footer>
      `;
    }
  }
 
  /* ── REGISTER CUSTOM ELEMENTS ────────────────────────── */
  customElements.define('mandatum-header', MandatumHeader);
  customElements.define('mandatum-footer', MandatumFooter);
 
})();
