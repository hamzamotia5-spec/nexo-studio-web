(function () {
  'use strict';

  var BRAND = window.__BRAND__ || {};
  var root = document.documentElement;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn('[init] ' + name + ' falló:', e); }
  }

  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    root.classList.add('gsap-on');
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
      var wait = Math.max(0, 900 - (Date.now() - start));
      setTimeout(function () {
        splash.classList.add('is-gone');
        setTimeout(function () { splash.style.display = 'none'; }, 1100);
        if (hasGSAP) ScrollTrigger.refresh();
      }, wait);
    }
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
    setTimeout(hide, 2500);
  }

  /* ---------------------------------------------------------- Nav + menú */
  function initNav() {
    var nav = document.getElementById('nav');
    var burger = document.querySelector('.burger');
    var menu = document.getElementById('menu');
    var bar = document.querySelector('.progress span');
    var ticking = false;

    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      nav.classList.toggle('is-solid', y > 40);
      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();

    function setMenu(open) {
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  /* ---------------------------------------------------------- Hero: parallax suave */
  function initHero() {
    if (!hasGSAP) return;
    gsap.to('.hero-media img', {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    var mm = gsap.matchMedia();
    mm.add('(min-width: 961px)', function () {
      gsap.to('.hero-content', {
        y: -70, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 20%', scrub: true }
      });
    });
  }

  /* ---------------------------------------------------------- Manifiesto: palabras que se encienden */
  function initWords() {
    var el = document.querySelector('[data-words]');
    if (!el || !hasGSAP || el.querySelector('.w')) return;
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    root.classList.add('words-on');
    gsap.to(el.querySelectorAll('.w'), {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 45%', scrub: true }
    });
  }

  /* ---------------------------------------------------------- Trabajos reales (selector por look) */
  var TONES = {
    rojo:         { name: 'Rojo cereza',    service: 'Color',                desc: 'Un rojo profundo, uniforme de raíz a puntas, con un brillo que se ve de lejos.' },
    ondas:        { name: 'Ondas marcadas', service: 'Peinados & recogidos', desc: 'Ondas con cuerpo y definición, de raíz a puntas, que aguantan todo el día.' },
    caramelo:     { name: 'Caramelo',       service: 'Mechas & balayage',    desc: 'Balayage cálido que se funde con tu base y aclara la cara sin marcar la raíz.' },
    semirecogido: { name: 'Semirecogido',   service: 'Novias & eventos',     desc: 'Semirecogido romántico con ondas sueltas, perfecto para bodas, comuniones e invitadas.' },
    miel:         { name: 'Rubio miel',     service: 'Color',                desc: 'Un rubio dorado y luminoso que favorece a las pieles cálidas, incluso en melenas XL.' },
    frio:         { name: 'Rubio frío',     service: 'Mechas & balayage',    desc: 'Mechas con matiz perla: un rubio limpio, sin amarillos, que crece con naturalidad.' }
  };

  function initPalette() {
    var section = document.querySelector('.palette');
    if (!section) return;
    var buttons = section.querySelectorAll('.tone');
    var imgs = section.querySelectorAll('.palette-frame img');
    var desc = section.querySelector('.tone-desc');
    var cta = section.querySelector('.tone-cta');
    var current = 'rojo';
    var timer = null;
    var userPicked = false;

    function show(key) {
      if (key === current || !TONES[key]) return;
      imgs.forEach(function (img) {
        img.classList.remove('is-leaving');
        if (img.getAttribute('data-tone') === current) { img.classList.remove('is-active'); img.classList.add('is-leaving'); }
        if (img.getAttribute('data-tone') === key) img.classList.add('is-active');
      });
      buttons.forEach(function (b) {
        var on = b.getAttribute('data-tone') === key;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      section.setAttribute('data-tone', key);
      desc.classList.add('is-swapping');
      setTimeout(function () { desc.textContent = TONES[key].desc; desc.classList.remove('is-swapping'); }, 250);
      cta.setAttribute('data-shade', TONES[key].name);
      current = key;
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () { userPicked = true; stop(); show(b.getAttribute('data-tone')); });
    });

    // Pase automático mientras la sección está a la vista y nadie ha elegido
    var order = Object.keys(TONES);
    function start() {
      if (timer || userPicked) return;
      timer = setInterval(function () { show(order[(order.indexOf(current) + 1) % order.length]); }, 4200);
    }
    function stop() { clearInterval(timer); timer = null; }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }, { threshold: 0.35 }).observe(section);
    }

    cta.addEventListener('click', function () {
      var key = current;
      window.dispatchEvent(new CustomEvent('ev:shade', { detail: { name: TONES[key].name, service: TONES[key].service } }));
    });
  }

  /* ---------------------------------------------------------- Servicios: número grande sincronizado */
  function initServices() {
    var rows = document.querySelectorAll('.service');
    var aside = document.querySelector('.services-aside');
    if (!rows.length) return;
    var numEl = aside && aside.querySelector('.sa-num');
    var nameEl = aside && aside.querySelector('.sa-name');
    var current = null;
    var swapTimer;
    function activate(row) {
      if (row === current) return;
      current = row;
      rows.forEach(function (r) { r.classList.toggle('is-current', r === row); });
      if (!aside) return;
      aside.classList.add('is-swapping');
      clearTimeout(swapTimer);
      swapTimer = setTimeout(function () {
        numEl.textContent = row.querySelector('.service-num').textContent;
        nameEl.textContent = row.querySelector('h3').textContent;
        aside.classList.remove('is-swapping');
      }, 220);
    }
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) activate(en.target); });
      }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      rows.forEach(function (r) { io.observe(r); });
    }
    if (finePointer) {
      rows.forEach(function (r) {
        r.addEventListener('mouseenter', function () { activate(r); });
      });
    }
  }

  /* ---------------------------------------------------------- Reveal con red de seguridad */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length || !('IntersectionObserver' in window)) return;
    root.classList.add('io-on');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) el.classList.add('is-in');
      });
    }, 6000);
  }

  /* ---------------------------------------------------------- CTA fija en móvil */
  function initMobileCta() {
    var cta = document.querySelector('.mobile-cta');
    var booking = document.getElementById('reserva');
    if (!cta || !booking) return;
    var bookingVisible = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        bookingVisible = en[0].isIntersecting; update();
      }, { threshold: 0 }).observe(booking);
    }
    function update() {
      var y = window.scrollY || window.pageYOffset;
      cta.classList.toggle('is-visible', y > window.innerHeight * 1.6 && !bookingVisible);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------------------------------------------------------- Botones magnéticos */
  function initMagnetic() {
    if (!finePointer) return;
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22;
        var y = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------- Formulario de reserva */
  function initForm() {
    var form = document.getElementById('booking-form');
    if (!form) return;
    var ok = form.querySelector('.form-ok');
    var pick = form.querySelector('.shade-pick');
    window.addEventListener('ev:shade', function (e) {
      form.elements.tono.value = e.detail.name;
      pick.querySelector('strong').textContent = e.detail.name;
      pick.hidden = false;
      var radio = form.querySelector('input[name="servicio"][value="' + e.detail.service + '"]');
      if (radio) radio.checked = true;
    });
    pick.querySelector('button').addEventListener('click', function () {
      form.elements.tono.value = '';
      pick.hidden = true;
    });
    var dateInput = form.querySelector('input[type="date"]');
    if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      ['nombre', 'telefono'].forEach(function (n) {
        var input = form.elements[n];
        var bad = !input.value.trim() || (n === 'telefono' && input.value.replace(/\D/g, '').length < 9);
        input.closest('.field').classList.toggle('is-error', bad);
        if (bad && valid) { input.focus(); valid = false; }
      });
      if (!valid) return;

      var d = form.elements;
      var msg = 'Hola, me gustaría pedir cita en ' + (BRAND.name || 'el salón') + '.\n' +
        'Nombre: ' + d.nombre.value.trim() + '\n' +
        'Teléfono: ' + d.telefono.value.trim() + '\n' +
        'Servicio: ' + d.servicio.value +
        (d.tono.value ? '\nLook que me gusta: ' + d.tono.value : '') +
        (d.fecha.value ? '\nDía preferido: ' + d.fecha.value.split('-').reverse().join('/') : '') +
        (d.mensaje.value.trim() ? '\nComentarios: ' + d.mensaje.value.trim() : '');

      if (BRAND.whatsapp) {
        window.open('https://wa.me/' + BRAND.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      }
      form.querySelector('button[type="submit"]').hidden = true;
      ok.hidden = false;
    });
  }

  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  function boot() {
    safe(initSplash, 'splash');
    safe(initNav, 'nav');
    safe(initHero, 'hero');
    safe(initWords, 'words');
    safe(initPalette, 'palette');
    safe(initServices, 'services');
    safe(initReveal, 'reveal');
    safe(initMobileCta, 'mobileCta');
    safe(initMagnetic, 'magnetic');
    safe(initForm, 'form');
    safe(initYear, 'year');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
