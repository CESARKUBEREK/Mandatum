(function(){
'use strict';
const THEMES=['mandatum','aegis'],STORAGE_KEY='mandatum-theme',DEFAULT='mandatum';
function getTheme(){try{return localStorage.getItem(STORAGE_KEY)||DEFAULT}catch{return DEFAULT}}
function saveTheme(t){try{localStorage.setItem(STORAGE_KEY,t)}catch{}}
function applyTheme(theme,animate){
  const html=document.documentElement;
  if(animate){html.classList.add('theme-transitioning');setTimeout(()=>html.classList.remove('theme-transitioning'),400)}
  html.setAttribute('data-theme',theme);
  document.querySelectorAll('.theme-orb').forEach(el=>el.style.display=theme==='aegis'?'block':'none');
  document.querySelectorAll('.theme-toggle').forEach(btn=>{
    const labelEl=btn.querySelector('.theme-toggle-label');
    const iconEl=btn.querySelector('.theme-toggle-icon');
    if(labelEl)labelEl.textContent=theme==='aegis'?'Mandatum':'Aegis';
    if(iconEl)iconEl.textContent=theme==='aegis'?'◐':'◑';
  });
}
function toggleTheme(){
  const current=document.documentElement.getAttribute('data-theme')||DEFAULT;
  const next=THEMES.find(t=>t!==current)||DEFAULT;
  saveTheme(next);applyTheme(next,true);
}
// Apply before paint to avoid FOUC
const saved=getTheme();
document.documentElement.setAttribute('data-theme',saved);
 
const NAV_LINKS=[
  {href:'pricing.html',label:'Pricing'},
  {href:'security.html',label:'Security'},
  {href:'command-center.html',label:'Command Center'},
  {href:'latam.html',label:'LATAM'},
  {href:'investors.html',label:'Investors'},
  {href:'contact.html',label:'Contact'},
];
const LANGS=[{href:'#',code:'EN',active:true},{href:'#',code:'ES'},{href:'#',code:'PT'}];
function isActive(href){const p=window.location.pathname.split('/').pop()||'index.html';return href===p}
function root(){return typeof MANDATUM_ROOT!=='undefined'?MANDATUM_ROOT:''}
 
function themeToggleHTML(){
  const t=getTheme(),icon=t==='aegis'?'◐':'◑',label=t==='aegis'?'Mandatum':'Aegis';
  return `<button class="theme-toggle" id="theme-toggle" aria-label="Switch theme"><span class="theme-toggle-icon">${icon}</span><span class="theme-toggle-label">${label}</span></button>`;
}
 
class MandatumHeader extends HTMLElement{
  connectedCallback(){
    const dark=this.hasAttribute('dark');
    const dLinks=NAV_LINKS.map(l=>`<a href="${root()}${l.href}"${isActive(l.href)?' class="active"':''}>${l.label}</a>`).join('');
    const mLinks=NAV_LINKS.map(l=>`<a href="${root()}${l.href}"${isActive(l.href)?' class="active"':''}>${l.label}</a>`).join('');
    const lD=LANGS.map(l=>`<a href="${l.href}"${l.active?' class="active"':''}>${l.code}</a>`).join('');
    const lM=LANGS.map(l=>`<a href="${l.href}"${l.active?' class="active"':''}>${l.code}</a>`).join('');
    this.innerHTML=`
<div class="theme-orb theme-orb-1" aria-hidden="true"></div>
<div class="theme-orb theme-orb-2" aria-hidden="true"></div>
<div class="nav-overlay" id="nav-overlay"></div>
<header class="site-header${dark?' dark':''}" id="site-header">
  <a href="${root()}index.html" class="logo-container" aria-label="Mandatum home">
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L20 6V12C20 17 16.5 21 12 22C7.5 21 4 17 4 12V6L12 2Z" stroke="currentColor" stroke-width="1.6"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.2"/>
      <circle cx="12" cy="12" r="7" stroke="currentColor" stroke-opacity="0.4" stroke-width="1"/>
    </svg>
    <div class="logo-wordmark" aria-hidden="true">M<span>A</span>NDATUM</div>
  </a>
  <nav class="nav-desktop" aria-label="Main navigation">
    ${dLinks}
    <div class="lang-selector" aria-label="Language">${lD}</div>
    ${themeToggleHTML()}
    <a href="${root()}contact.html" class="nav-cta">Request access</a>
  </nav>
  <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle navigation" aria-expanded="false" aria-controls="nav-mobile">
    <span class="hamburger-bar"></span><span class="hamburger-bar"></span><span class="hamburger-bar"></span>
  </button>
</header>
<nav class="nav-mobile" id="nav-mobile" aria-label="Mobile navigation" aria-hidden="true">
  ${mLinks}
  <div class="nav-mobile-lang" aria-label="Language">${lM}</div>
  <a href="${root()}contact.html" class="nav-mobile-cta">Request access →</a>
</nav>`;
    // Apply orb state
    const cur=getTheme();
    this.querySelectorAll('.theme-orb').forEach(el=>el.style.display=cur==='aegis'?'block':'none');
    this._initMenu();this._initToggle();this._initScroll();
  }
  _initMenu(){
    const btn=this.querySelector('#nav-hamburger'),drawer=this.querySelector('#nav-mobile'),overlay=this.querySelector('#nav-overlay');
    const open=()=>{drawer.classList.add('open');overlay.classList.add('open');btn.classList.add('open');btn.setAttribute('aria-expanded','true');drawer.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';};
    const close=()=>{drawer.classList.remove('open');overlay.classList.remove('open');btn.classList.remove('open');btn.setAttribute('aria-expanded','false');drawer.setAttribute('aria-hidden','true');document.body.style.overflow='';};
    btn.addEventListener('click',()=>btn.classList.contains('open')?close():open());
    overlay.addEventListener('click',close);
    drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  }
  _initToggle(){
    const btn=this.querySelector('#theme-toggle');
    if(btn)btn.addEventListener('click',toggleTheme);
  }
  _initScroll(){
    const h=this.querySelector('#site-header');
    window.addEventListener('scroll',()=>{h.style.boxShadow=window.scrollY>8?'0 1px 20px rgba(0,0,0,.10)':'';},{passive:true});
  }
}
 
class MandatumFooter extends HTMLElement{
  connectedCallback(){
    const dark=this.hasAttribute('dark');
    const year=new Date().getFullYear();
    const links=NAV_LINKS.map(l=>`<a href="${root()}${l.href}">${l.label}</a>`).join('');
    this.innerHTML=`
<footer class="site-footer${dark?' dark':''}">
  <div class="footer-inner">
    <a href="${root()}index.html" class="footer-brand" aria-label="Mandatum home">M<span>A</span>NDATUM</a>
    <nav class="footer-links" aria-label="Footer navigation">${links}</nav>
    <div class="footer-info">© ${year} Mandatum &nbsp;·&nbsp; <a href="mailto:hello@mandatum.io">hello@mandatum.io</a> &nbsp;·&nbsp; mandatum.io</div>
  </div>
</footer>`;
  }
}
 
customElements.define('mandatum-header',MandatumHeader);
customElements.define('mandatum-footer',MandatumFooter);
})();
 
