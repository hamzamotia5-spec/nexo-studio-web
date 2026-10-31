(function () {
  'use strict';

  var BRAND = window.__BRAND__ || {};
  var root = document.documentElement;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  root.classList.add('js');

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn('[init] ' + name + ' falló:', e); }
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
        setTimeout(function () { splash.style.display = 'none'; }, 600);
      }, wait);
    }
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide);
    setTimeout(hide, 2200);
  }

  /* ---------------------------------------------------------- Nav + menú móvil */
  function initNav() {
    var burger = document.querySelector('.burger');
    var menu = document.getElementById('menu');
    if (!burger || !menu) return;

    function setOpen(open) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /* ---------------------------------------------------------- Reveal */
  function initReveal() {
    var els = [].slice.call(document.querySelectorAll('.reveal'));
    if (!els.length) return;
    function show(el) { el.classList.add('is-in'); }
    if (!('IntersectionObserver' in window)) { els.forEach(show); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });
    // Red de seguridad: nada se queda invisible
    setTimeout(function () { els.forEach(show); }, 6000);
  }

  /* ---------------------------------------------------------- Banda: velocidad ligada al scroll */
  function initMarquee() {
    var track = document.querySelector('.marquee-track');
    if (!track) return;
    var x = 0;
    var lastY = window.scrollY;
    var boost = 0;
    var dir = 1;
    function frame() {
      var y = window.scrollY;
      var dy = y - lastY;
      lastY = y;
      if (dy !== 0) dir = dy > 0 ? 1 : -1;
      boost = boost * 0.9 + Math.min(Math.abs(dy), 60) * 0.1;
      x -= (0.6 + boost * 0.35) * dir;
      var half = track.scrollWidth / 2;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------- Mira con coordenadas en la foto */
  function initAim() {
    if (!finePointer) return;
    var media = document.querySelector('.hero-media');
    var label = media && media.querySelector('.coords');
    if (!media || !label) return;
    var idle = label.textContent;
    function pad(n) { n = Math.round(n); return ('000' + n).slice(-3); }
    media.addEventListener('mousemove', function (e) {
      var r = media.getBoundingClientRect();
      var px = e.clientX - r.left;
      var py = e.clientY - r.top;
      media.style.setProperty('--mx', px + 'px');
      media.style.setProperty('--my', py + 'px');
      media.classList.add('is-aiming');
      label.textContent = '[' + pad(px) + ', ' + pad(py) + ']';
    });
    media.addEventListener('mouseleave', function () {
      media.classList.remove('is-aiming');
      label.textContent = idle;
    });
  }

  /* ---------------------------------------------------------- Marcador del hero */
  function initBoard() {
    var board = document.querySelector('.board');
    if (!board) return;
    var clock = board.querySelector('.board-clock');
    var period = board.querySelector('.board-period');
    var sides = [board.querySelector('.board-red'), board.querySelector('.board-blue')];
    var scores = [0, 0];
    var PERIOD = 180;
    var left = PERIOD;
    var p = 1;
    var nextScore = 6 + Math.floor(Math.random() * 6);
    var points = [1, 2, 2, 4, 1, 2];

    function render() {
      var m = Math.floor(left / 60);
      var s = left % 60;
      clock.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      period.textContent = 'Periodo ' + p;
    }
    function score() {
      var i = Math.random() < 0.5 ? 0 : 1;
      scores[i] += points[Math.floor(Math.random() * points.length)];
      var side = sides[i];
      side.querySelector('.board-score').textContent = scores[i];
      side.classList.add('is-scoring');
      setTimeout(function () { side.classList.remove('is-scoring'); }, 260);
    }
    setInterval(function () {
      left -= 1;
      nextScore -= 1;
      if (nextScore <= 0) { score(); nextScore = 7 + Math.floor(Math.random() * 9); }
      if (left < 0) {
        left = PERIOD;
        p = p === 1 ? 2 : 1;
        if (p === 1) {
          scores = [0, 0];
          sides.forEach(function (sd) { sd.querySelector('.board-score').textContent = '0'; });
        }
      }
      render();
    }, 1000);
    render();
  }

  /* ---------------------------------------------------------- Contadores */
  function initCounters() {
    var nums = [].slice.call(document.querySelectorAll('[data-count]'));
    if (!nums.length || !('IntersectionObserver' in window)) return;
    function run(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var from = target > 100 ? target - 120 : 0;
      var t0 = null;
      var dur = 1300;
      function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / dur);
        var e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(from + (target - from) * e);
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.01 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---------------------------------------------------------- Tapiz: se dibuja con el scroll y marca el paso activo */
  function initMat() {
    var section = document.querySelector('.entreno-grid');
    var zone = document.querySelector('.mat-zone');
    var stepTxt = document.querySelector('.mat-step');
    var steps = [].slice.call(document.querySelectorAll('.step'));
    if (!section || !zone) return;
    var LEN = 942.5;
    var ticking = false;

    function update() {
      ticking = false;
      var r = section.getBoundingClientRect();
      var vh = window.innerHeight;
      var k = (vh * 0.75 - r.top) / (r.height + vh * 0.1);
      k = Math.max(0, Math.min(1, k));
      zone.style.setProperty('--draw', (LEN * (1 - k)).toFixed(1));

      var active = 0;
      steps.forEach(function (st, i) {
        if (st.getBoundingClientRect().top < vh * 0.55) active = i;
      });
      steps.forEach(function (st, i) { st.classList.toggle('is-active', i === active); });
      if (stepTxt && steps[active]) stepTxt.textContent = steps[active].getAttribute('data-step');
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  /* ---------------------------------------------------------- CTA móvil: se esconde al llegar al formulario */
  function initMobileCta() {
    var cta = document.querySelector('.mobile-cta');
    var target = document.getElementById('prueba');
    if (!cta || !target || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { cta.classList.toggle('is-hidden', en.isIntersecting); });
    }, { threshold: 0.01 });
    io.observe(target);
  }

  /* ---------------------------------------------------------- Formulario → WhatsApp */
  function initForm() {
    var form = document.getElementById('form');
    var out = document.getElementById('form-out');
    if (!form || !out) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameField = form.querySelector('#f-name');
      var name = nameField.value.trim();
      nameField.closest('.field').classList.toggle('is-error', !name);
      if (!name) {
        out.className = 'form-out err';
        out.textContent = 'Dinos al menos tu nombre.';
        nameField.focus();
        return;
      }
      var group = (form.querySelector('input[name="group"]:checked') || {}).value || '';
      var disc = (form.querySelector('input[name="disc"]:checked') || {}).value || '';
      var msg = form.querySelector('#f-msg').value.trim();
      var text = 'Hola, soy ' + name + '. Me gustaría probar una clase en el Club de Lucha Jesús Lázaro.\n' +
        'Grupo: ' + group + '\nDisciplina: ' + disc + (msg ? '\nNota: ' + msg : '');

      if (BRAND.whatsapp) {
        window.open('https://wa.me/' + BRAND.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
        out.className = 'form-out ok';
        out.textContent = 'Te abrimos WhatsApp con el mensaje listo. Solo tienes que enviarlo.';
      } else {
        out.className = 'form-out ok';
        out.textContent = '¡Apuntado, ' + name + '! Pásate por el gimnasio en el horario de tu grupo y pregunta por el entrenador. Este es tu mensaje:\n\n' + text;
      }
    });
  }

  /* ---------------------------------------------------------- Año del pie */
  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  function boot() {
    safe(initSplash, 'splash');
    safe(initNav, 'nav');
    safe(initReveal, 'reveal');
    safe(initMarquee, 'marquee');
    safe(initAim, 'aim');
    safe(initBoard, 'board');
    safe(initCounters, 'counters');
    safe(initMat, 'mat');
    safe(initMobileCta, 'mobileCta');
    safe(initForm, 'form');
    safe(initYear, 'year');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
