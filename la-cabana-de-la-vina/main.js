/* La Cabaña de la Viña 3 — interacciones.
   Patrón IIFE, sin módulos: funciona en file:// y en cualquier hosting. */
(function () {
  'use strict';

  var B = window.__BRAND__ || {};
  var DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn('[init ' + name + ']', e); }
  }

  function initSplash() {
    var splash = document.querySelector('.splash');
    if (!splash) return;
    var hide = function () { splash.classList.add('is-hidden'); };
    if (document.readyState === 'complete') setTimeout(hide, 700);
    else window.addEventListener('load', function () { setTimeout(hide, 700); });
    setTimeout(hide, 2800);
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
    document.querySelectorAll('.chalk').forEach(function (el, i) { el.style.setProperty('--i', i); });
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

  // Hora actual en Zaragoza, sea cual sea la zona horaria del visitante
  function madridNow() {
    var parts = {};
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
    return { day: day, mins: parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10) };
  }

  function toMins(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }

  function initHours() {
    if (!B.hours) return;
    var now = madridNow();
    if (now.day < 0) return;

    var row = document.querySelector('.hours tr[data-day="' + now.day + '"]');
    if (row) row.classList.add('is-today');

    var open = null, nextText = '';
    (B.hours[now.day] || []).forEach(function (slot) {
      var s = slot.split('-'), a = toMins(s[0]), b = toMins(s[1]);
      if (now.mins >= a && now.mins < b) open = s[1];
      else if (!open && !nextText && now.mins < a) nextText = 'Abrimos hoy a las ' + s[0];
    });
    if (!open && !nextText) {
      for (var k = 1; k <= 7; k++) {
        var d = (now.day + k) % 7, slots = B.hours[d] || [];
        if (slots.length) {
          nextText = 'Abrimos ' + (k === 1 ? 'mañana' : 'el ' + DAYS[d]) + ' a las ' + slots[0].split('-')[0];
          break;
        }
      }
    }

    var short = document.querySelector('[data-status]');
    var long = document.querySelector('[data-status-long]');
    var closeAt = open === '24:00' ? 'medianoche' : 'las ' + open;
    if (short) {
      short.classList.add(open ? 'is-open' : 'is-closed');
      short.textContent = open ? 'Abierto ahora · hasta ' + (open === '24:00' ? 'las 00:00' : 'las ' + open) : 'Cerrado ahora';
    }
    if (long) {
      long.classList.add(open ? 'is-open' : 'is-closed');
      long.textContent = open ? 'Ahora estamos abiertos, hasta ' + closeAt + '.' : 'Ahora estamos cerrados. ' + nextText + '.';
    }
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

      var d = new Date(date.value + 'T12:00:00');
      var slots = (B.hours && B.hours[d.getDay()]) || [];
      if (B.hours && !slots.length) {
        msg.textContent = 'Ese día cerramos (' + DAYS[d.getDay()] + '). Elige otro, por favor.';
        date.classList.add('is-error'); date.focus(); return;
      }
      msg.textContent = '';

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
    safe(initHours, 'hours');
    safe(initMobileCta, 'mobileCta');
    safe(initBrandLinks, 'brandLinks');
    safe(initForm, 'form');
    safe(initYear, 'year');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
