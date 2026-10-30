(function () {
  'use strict';

  var BRAND = window.__BRAND__ || {};
  var root = document.documentElement;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);

  root.classList.add('js');

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn('[init] ' + name + ' falló:', e); }
  }

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }

  /* ---------------------------------------------------------- Splash */
  function initSplash() {
    var splash = document.querySelector('.splash');
    if (!splash) return;
    var start = Date.now();
    var done = false;
    function hide() {
      if (done) return;
      done = true;
      var wait = Math.max(0, 700 - (Date.now() - start));
      setTimeout(function () {
        splash.classList.add('is-gone');
        setTimeout(function () { splash.style.display = 'none'; }, 1000);
        if (hasGSAP) ScrollTrigger.refresh();
      }, wait);
    }
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
    setTimeout(hide, 2200);
  }

  /* ---------------------------------------------------------- Menú móvil */
  function initMenu() {
    var burger = document.querySelector('.burger');
    var menu = document.getElementById('menu');
    if (!burger || !menu) return;

    function set(open) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menu.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () {
      set(burger.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) set(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') set(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024) set(false);
    });
  }

  /* ---------------------------------------------------------- Revelado */
  function initReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // Escalonado suave entre hermanos que entran a la vez
        var siblings = Array.prototype.filter.call(el.parentNode.children, function (n) { return n.hasAttribute('data-reveal'); });
        var idx = Math.max(0, siblings.indexOf(el)) % 4;
        el.style.transitionDelay = (idx * 70) + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -4% 0px' });
    els.forEach(function (el) { io.observe(el); });

    // Red de seguridad: a los 6s, todo lo que esté en pantalla se muestra
    setTimeout(function () {
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
      });
    }, 6000);
  }

  /* ---------------------------------------------------------- Contadores */
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        var to = parseFloat(el.getAttribute('data-count'));
        var from = parseFloat(el.getAttribute('data-from') || '0');
        var dur = 1100;
        var t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / dur);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(from + (to - from) * eased);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.01 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------- Abierto / cerrado */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmt(min) { min = min % 1440; return pad(Math.floor(min / 60)) + ':' + pad(min % 60); }

  function initHours() {
    var hours = BRAND.hours;
    var names = BRAND.dayNames;
    if (!hours || !names) return;

    var now = new Date();
    var day = now.getDay();
    var mins = now.getHours() * 60 + now.getMinutes();

    var openUntil = null;
    (hours[day] || []).forEach(function (s) {
      if (mins >= s[0] && mins < s[1]) openUntil = s[1];
    });
    // Turno de ayer que cruza la medianoche (p. ej. viernes hasta la 01:30)
    var prev = (day + 6) % 7;
    (hours[prev] || []).forEach(function (s) {
      if (s[1] > 1440 && mins < s[1] - 1440) openUntil = s[1];
    });

    var shortTxt, longTxt, when = '', isOpen = openUntil !== null;
    if (isOpen) {
      shortTxt = 'Abierto ahora';
      longTxt = 'Abierto ahora · hasta las ' + fmt(openUntil);
    } else {
      var next = null;
      (hours[day] || []).some(function (s) {
        if (s[0] > mins) { next = { k: 0, at: s[0] }; return true; }
        return false;
      });
      for (var k = 1; !next && k <= 7; k++) {
        var d = (day + k) % 7;
        if (hours[d] && hours[d].length) next = { k: k, d: d, at: hours[d][0][0] };
      }
      when = !next ? '' :
        next.k === 0 ? 'hoy a las ' + fmt(next.at) :
        next.k === 1 ? 'mañana a las ' + fmt(next.at) :
        'el ' + names[next.d] + ' a las ' + fmt(next.at);
      shortTxt = 'Cerrado ahora';
      longTxt = 'Cerrado ahora · abrimos ' + when;
    }

    var st = document.querySelector('[data-status]');
    if (st) {
      st.textContent = shortTxt;
      st.classList.add(isOpen ? 'is-open' : 'is-closed');
    }
    var td = document.querySelector('[data-today]');
    if (td) td.textContent = isOpen ? 'Hasta las ' + fmt(openUntil) : 'Abrimos ' + when;
    var lg = document.querySelector('[data-status-long]');
    if (lg) {
      lg.textContent = longTxt;
      lg.classList.toggle('is-open', isOpen);
    }
    var row = document.querySelector('.hours-table tr[data-day="' + day + '"]');
    if (row) row.classList.add('is-today');
  }

  /* ---------------------------------------------------------- Mapa bajo demanda (sin cookies de Google hasta que se pide) */
  function initMap() {
    var box = document.querySelector('[data-map]');
    var btn = document.querySelector('[data-map-load]');
    if (!box || !btn || !BRAND.links) return;
    btn.addEventListener('click', function () {
      if (box.querySelector('iframe')) return;
      var f = document.createElement('iframe');
      f.src = BRAND.links.mapEmbed;
      f.title = 'Mapa: La Cordobesa, C. de Jordán de Urriés 4, Zaragoza';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      f.setAttribute('allowfullscreen', '');
      box.appendChild(f);
      var ph = box.querySelector('.map-placeholder');
      if (ph) ph.remove();
    });
  }

  /* ---------------------------------------------------------- Parallax suave (≤40px) */
  function initParallax() {
    if (!hasGSAP) return;
    document.querySelectorAll('[data-parallax]').forEach(function (el) {
      var host = el.closest('.cell') || el.parentNode;
      gsap.fromTo(el, { y: -30 }, {
        y: 30,
        ease: 'none',
        scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    });
  }

  /* ---------------------------------------------------------- Año */
  function initYear() {
    var y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
  }

  function boot() {
    safe(initSplash, 'splash');
    safe(initMenu, 'menu');
    safe(initReveal, 'reveal');
    safe(initCounters, 'counters');
    safe(initHours, 'hours');
    safe(initMap, 'map');
    safe(initParallax, 'parallax');
    safe(initYear, 'year');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
