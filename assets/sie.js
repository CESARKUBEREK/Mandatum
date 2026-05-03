/* ═══════════════════════════════════════════════════════
   MANDATUM · assets/site.js
   Mobile menu + theme switcher. No web components.
   ═══════════════════════════════════════════════════════ */
 
/* ── CONFIG ── */
var CFG = {
  DEFAULT_THEME : 'mandatum',   /* 'mandatum' | 'aegis' */
  PERSIST       : true,
  SHOW_TOGGLE   : false,        /* true = button visible in header */
  SHORTCUT      : { key:'T', ctrl:true, shift:true }
};
 
/* ── THEME ── */
var THEMES = ['mandatum','aegis'];
 
function getTheme(){
  if(CFG.PERSIST){ try{ var s=localStorage.getItem('mdt'); if(s) return s; }catch(e){} }
  return CFG.DEFAULT_THEME;
}
function saveTheme(t){ if(CFG.PERSIST){ try{ localStorage.setItem('mdt',t); }catch(e){} } }
 
function applyTheme(t,anim){
  var html=document.documentElement;
  if(anim){ html.classList.add('switching'); setTimeout(function(){ html.classList.remove('switching'); },400); }
  html.setAttribute('data-theme',t);
}
 
function toggleTheme(){
  var cur=document.documentElement.getAttribute('data-theme')||CFG.DEFAULT_THEME;
  var next=THEMES[0]===cur?THEMES[1]:THEMES[0];
  saveTheme(next); applyTheme(next,true);
}
 
/* Apply saved theme immediately */
applyTheme(getTheme(),false);
 
/* Public console API */
window.Mandatum={
  setTheme:function(t){ if(THEMES.indexOf(t)>-1){ saveTheme(t); applyTheme(t,true); } },
  getTheme:function(){ return document.documentElement.getAttribute('data-theme'); },
  toggle:toggleTheme
};
 
/* ── MOBILE MENU ── */
document.addEventListener('DOMContentLoaded', function(){
 
  var burger  = document.getElementById('nav-burger');
  var drawer  = document.getElementById('nav-drawer');
  var overlay = document.getElementById('nav-overlay');
  var header  = document.getElementById('site-header');
 
  if(!burger || !drawer || !overlay) return;
 
  function openMenu(){
    drawer.classList.add('open');
    overlay.classList.add('open');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded','true');
    document.body.style.overflow='hidden';
  }
  function closeMenu(){
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
  }
 
  burger.addEventListener('click', function(){ burger.classList.contains('open')?closeMenu():openMenu(); });
  overlay.addEventListener('click', closeMenu);
  drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',closeMenu); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeMenu(); });
 
  /* Scroll shadow */
  if(header){
    window.addEventListener('scroll',function(){
      header.style.boxShadow=window.scrollY>8?'0 1px 20px rgba(0,0,0,.10)':'';
    },{passive:true});
  }
 
  /* Theme shortcut */
  if(CFG.SHORTCUT){
    document.addEventListener('keydown',function(e){
      if(e.key===CFG.SHORTCUT.key && !!e.ctrlKey===!!CFG.SHORTCUT.ctrl && !!e.shiftKey===!!CFG.SHORTCUT.shift){
        e.preventDefault(); toggleTheme();
      }
    });
  }
 
  /* Theme toggle button (if SHOW_TOGGLE:true) */
  var toggleBtn=document.getElementById('theme-toggle');
  if(toggleBtn) toggleBtn.addEventListener('click',toggleTheme);
});
 
