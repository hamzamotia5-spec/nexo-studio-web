/* La Cabaña de la Viña 3 — interacciones.
   Patrón IIFE, sin módulos: funciona en file:// y en cualquier hosting. */
(function () {
  'use strict';

  var B = window.__BRAND__ || {};
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  var canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn('[init ' + name + ']', e); }
  }

  function initSplash() {
    var splash = document.querySelector('.splash');
    if (!splash) return;
    var hide = function () { splash.classList.add('is-hidden'); };
    if (document.readyState === 'complete') setTimeout(hide, 900);
    else window.addEventListener('load', function () { setTimeout(hide, 900); });
    setTimeout(hide, 3000);
  }

  function initNav() {
    var nav = document.getElementById('nav');
    var burger = document.querySelector('.burger');
    var menu = document.getElementById('menu');
    var onScroll = function () { nav.classList.toggle('is-solid', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var setOpen = function (open) {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menu.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () {
      setOpen(!document.body.classList.contains('menu-open'));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
    // Red de seguridad: nada se queda oculto más de 6s
    setTimeout(function () { els.forEach(function (el) { el.classList.add('is-visible'); }); }, 6000);
  }

  function initParallax() {
    if (!hasGsap) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero-bg img', {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.fromTo('.casa-figure img', { yPercent: -8 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.casa-figure', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  // Carta: en escritorio la sección se fija y las tarjetas avanzan en horizontal.
  // En móvil (o sin GSAP) queda el carrusel táctil nativo con scroll-snap.
  function initShowcase() {
    if (!hasGsap) return;
    var section = document.querySelector('.carta');
    var pin = section.querySelector('.carta-pin');
    var track = section.querySelector('.carta-track');
    var viewport = section.querySelector('.carta-viewport');
    var mm = gsap.matchMedia();
    mm.add('(min-width: 961px)', function () {
      section.classList.add('is-pinned');
      var distance = function () { return Math.max(0, track.scrollWidth - viewport.clientWidth); };
      var tween = gsap.to(track, {
        x: function () { return -distance(); }, ease: 'none',
        scrollTrigger: {
          trigger: pin, start: 'top top', end: function () { return '+=' + distance(); },
          pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1
        }
      });
      return function () { section.classList.remove('is-pinned'); tween.kill(); gsap.set(track, { clearProps: 'transform' }); };
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }

  function initTilt() {
    if (!canHover) return;
    document.querySelectorAll('.dish').forEach(function (card) {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = '1';
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (x * 100) + '%');
        card.style.setProperty('--my', (y * 100) + '%');
        card.style.transform = 'perspective(900px) rotateY(' + ((x - .5) * 10) + 'deg) rotateX(' + ((.5 - y) * 8) + 'deg)';
      });
      card.addEventListener('mouseout', function (e) {
        if (card.contains(e.relatedTarget)) return;
        card.style.transform = '';
      });
    });
  }

  function initMobileCta() {
    var bar = document.querySelector('.mobile-cta');
    var hero = document.querySelector('.hero');
    if (!bar || !hero) return;
    var onScroll = function () {
      bar.classList.toggle('is-visible', window.scrollY > hero.offsetHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initBrandLinks() {
    if (B.mapsUrl) document.querySelectorAll('[data-maps]').forEach(function (a) { a.href = B.mapsUrl; });
  }

  function initForm() {
    var form = document.getElementById('form');
    if (!form) return;
    var msg = form.querySelector('.form-msg');
    var date = form.querySelector('#f-date');
    var today = new Date();
    var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    date.min = iso;
    if (!date.value) date.value = iso;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var fields = [form.name, date, form.time];
      var bad = fields.filter(function (f) { return !f.value.trim(); });
      fields.forEach(function (f) { f.classList.toggle('is-error', bad.indexOf(f) > -1); });
      if (bad.length) { msg.textContent = 'Rellena nombre, día y hora, por favor.'; bad[0].focus(); return; }
      msg.textContent = '';

      var d = new Date(date.value + 'T12:00:00');
      var day = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
      var text = 'Hola, soy ' + name + '. Me gustaría reservar mesa en ' + (B.name || 'La Cabaña de la Viña 3') +
        ' para ' + form.people.value + ' personas el ' + day + ' a las ' + form.time.value + '.';
      if (form.note.value.trim()) text += ' Nota: ' + form.note.value.trim();

      form.classList.add('is-done');
      var url = B.whatsapp
        ? 'https://wa.me/' + B.whatsapp + '?text=' + encodeURIComponent(text)
        : 'tel:' + (B.phone || '').replace(/\s/g, '');
      setTimeout(function () { window.open(url, '_blank', 'noopener'); }, 900);
      setTimeout(function () { form.classList.remove('is-done'); }, 6000);
    });
  }

  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  function boot() {
    safe(initSplash, 'splash');
    safe(initNav, 'nav');
    safe(initReveal, 'reveal');
    safe(initParallax, 'parallax');
    safe(initShowcase, 'showcase');
    safe(initTilt, 'tilt');
    safe(initMobileCta, 'mobileCta');
    safe(initBrandLinks, 'brandLinks');
    safe(initForm, 'form');
    safe(initYear, 'year');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
