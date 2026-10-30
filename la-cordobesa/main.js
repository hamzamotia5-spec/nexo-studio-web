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

  /* ---------------------------------------------------------- Pedido y reserva por WhatsApp */
  var STORE_KEY = 'lacordobesa_pedido';
  var cart = [];

  function eur(n) {
    return (Math.round(n * 100) % 100 === 0 ? String(Math.round(n)) : n.toFixed(2).replace('.', ',')) + ' €';
  }
  function ceilTo(min, step) { return Math.ceil(min / step) * step; }

  function openWhatsApp(text) {
    var url = 'https://wa.me/' + (BRAND.whatsappNumber || '34634862371') + '?text=' + encodeURIComponent(text);
    var w = window.open(url, '_blank');
    if (w) { try { w.opener = null; } catch (e) {} } else { window.location.href = url; }
  }

  function setMsg(el, text, ok) {
    if (!el) return;
    el.textContent = text || '';
    el.style.color = ok ? 'var(--teal)' : '';
  }

  function loadCart() {
    try { cart = JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { cart = []; }
    if (!Array.isArray(cart)) cart = [];
  }
  function saveCart() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) {}
  }

  function isDelivery() {
    var r = document.querySelector('[data-order-form] input[name="mode"]:checked');
    return !!r && r.value === 'domicilio';
  }

  function totals() {
    var units = 0, potatoes = 0, unpriced = false;
    cart.forEach(function (it) {
      units += it.qty;
      if (typeof it.price === 'number') potatoes += it.price * it.qty;
      else unpriced = true;
    });
    var ship = isDelivery() && units ? (BRAND.shippingCost || 0) : 0;
    return { units: units, potatoes: potatoes, ship: ship, total: potatoes + ship, unpriced: unpriced };
  }

  function lineLabel(it) {
    return it.size ? it.name + ' · ' + (it.size === 'media' ? 'media ración' : 'entera') : it.name;
  }

  function renderCart() {
    var list = document.querySelector('[data-cart-list]');
    var empty = document.querySelector('[data-cart-empty]');
    var box = document.querySelector('[data-cart-total]');
    var t = totals();

    if (list) {
      list.innerHTML = '';
      cart.forEach(function (it) {
        var li = document.createElement('li');
        var name = document.createElement('p');
        name.className = 'cart-name';
        name.textContent = it.name;
        var small = document.createElement('small');
        small.textContent = it.size ? (it.size === 'media' ? 'Media ración' : 'Entera') : 'Para picar · precio en carta';
        name.appendChild(small);

        var step = document.createElement('div');
        step.className = 'stepper';
        step.innerHTML = '<button type="button" data-dec aria-label="Quitar uno">−</button><output></output><button type="button" data-inc aria-label="Añadir uno">+</button>';
        step.querySelector('output').textContent = it.qty;
        step.setAttribute('data-id', it.id);

        var price = document.createElement('p');
        price.className = 'cart-price';
        price.textContent = typeof it.price === 'number' ? eur(it.price * it.qty) : '—';

        li.appendChild(name); li.appendChild(step); li.appendChild(price);
        list.appendChild(li);
      });
    }
    if (empty) empty.hidden = cart.length > 0;
    if (box) {
      box.hidden = cart.length === 0;
      var q = function (s) { return box.querySelector(s); };
      q('[data-sum-potatoes]').textContent = eur(t.potatoes);
      q('[data-sum-ship-row]').hidden = !t.ship;
      q('[data-sum-total]').textContent = eur(t.total);
      q('[data-sum-extra]').hidden = !t.unpriced;
    }

    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = t.units;
      el.hidden = t.units === 0;
    });
    var pill = document.querySelector('[data-cart-pill]');
    if (pill) {
      pill.querySelector('[data-cart-pill-text]').textContent = t.units + (t.potatoes ? ' · ' + eur(t.total) : '');
      pill.hidden = t.units === 0 || pill.__inView;
    }
  }

  function addItem(btn) {
    var id = btn.getAttribute('data-add');
    var priceAttr = btn.getAttribute('data-price');
    var found = null;
    cart.forEach(function (it) { if (it.id === id) found = it; });
    if (found) found.qty += 1;
    else cart.push({
      id: id,
      name: btn.getAttribute('data-name'),
      size: btn.getAttribute('data-size') || '',
      price: priceAttr ? parseFloat(priceAttr) : null,
      qty: 1
    });
    saveCart();
    renderCart();

    btn.classList.add('is-added');
    clearTimeout(btn.__t);
    btn.__t = setTimeout(function () { btn.classList.remove('is-added'); }, 900);
    var pill = document.querySelector('[data-cart-pill]');
    if (pill) { pill.classList.remove('is-bump'); void pill.offsetWidth; pill.classList.add('is-bump'); }
  }

  function initCart() {
    loadCart();

    document.addEventListener('click', function (e) {
      var add = e.target.closest('[data-add]');
      if (add) { addItem(add); return; }
      var stepBtn = e.target.closest('.stepper button');
      if (!stepBtn) return;
      var id = stepBtn.parentNode.getAttribute('data-id');
      cart = cart.map(function (it) {
        if (it.id === id) it.qty += stepBtn.hasAttribute('data-inc') ? 1 : -1;
        return it;
      }).filter(function (it) { return it.qty > 0; });
      saveCart();
      renderCart();
    });

    // El resumen flotante se esconde mientras el formulario de pedido está a la vista
    var pill = document.querySelector('[data-cart-pill]');
    var sec = document.getElementById('pedir');
    if (pill && sec && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        pill.__inView = entries[0].isIntersecting;
        renderCart();
      }, { threshold: 0.01 }).observe(sec);
    }
    renderCart();
  }

  // Horas a las que se puede pedir hoy, en tramos de 15 minutos
  function orderSlots() {
    var hours = BRAND.hours || {};
    var now = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();
    var from = ceilTo(mins + 30, 15);
    var out = [];
    (hours[now.getDay()] || []).forEach(function (s) {
      for (var t = Math.max(s[0], from); t <= s[1] - 15; t += 15) out.push(fmt(t));
    });
    return out;
  }

  function initOrderForm() {
    var form = document.querySelector('[data-order-form]');
    if (!form) return;
    var msg = form.querySelector('[data-order-msg]');
    var addr = form.querySelector('[data-address]');
    var timeSel = form.querySelector('[data-order-time]');

    var slots = orderSlots();
    timeSel.innerHTML = '';
    [slots.length ? 'Lo antes posible' : 'En el próximo turno'].concat(slots).forEach(function (v) {
      var o = document.createElement('option'); o.textContent = v; timeSel.appendChild(o);
    });

    addr.hidden = !isDelivery();
    form.querySelectorAll('input[name="mode"]').forEach(function (r) {
      r.addEventListener('change', function () {
        addr.hidden = !isDelivery();
        renderCart();
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setMsg(msg, '');
      form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });

      var name = form.elements['name'].value.trim();
      var address = form.elements['address'].value.trim();
      var delivery = isDelivery();
      if (!cart.length) { setMsg(msg, 'Añade al menos una patata o algo para picar desde la carta.'); return; }
      if (!name) { form.elements['name'].classList.add('is-invalid'); form.elements['name'].focus(); setMsg(msg, 'Dinos tu nombre.'); return; }
      if (delivery && !address) { form.elements['address'].classList.add('is-invalid'); form.elements['address'].focus(); setMsg(msg, 'Necesitamos la dirección de entrega.'); return; }

      var t = totals();
      var lines = ['Hola La Cordobesa, quiero hacer un pedido:', ''];
      cart.forEach(function (it) {
        lines.push('• ' + it.qty + ' × ' + lineLabel(it) + (typeof it.price === 'number' ? ' — ' + eur(it.price * it.qty) : ''));
      });
      lines.push('');
      if (t.potatoes) lines.push('Patatas: ' + eur(t.potatoes));
      if (t.ship) lines.push('Envío a domicilio: ' + eur(t.ship));
      if (t.potatoes) lines.push('Total orientativo: ' + eur(t.total) + (t.unpriced ? ' + picoteo' : ''));
      lines.push('');
      lines.push('Entrega: ' + (delivery ? 'a domicilio' : 'recojo en el local'));
      if (delivery) lines.push('Dirección: ' + address);
      lines.push('Hora: ' + timeSel.value);
      lines.push('Nombre: ' + name);
      var notes = form.elements['notes'].value.trim();
      if (notes) lines.push('Notas: ' + notes);

      openWhatsApp(lines.join('\n'));
      setMsg(msg, 'Se ha abierto WhatsApp con tu pedido. Envía el mensaje y te contestamos para confirmarlo.', true);
    });
  }

  // Horas de reserva para un día: cada 30 min, hasta una hora antes del cierre (máx. 23:30)
  function bookSlots(date) {
    var shifts = (BRAND.hours || {})[date.getDay()] || [];
    var now = new Date();
    var isToday = date.toDateString() === now.toDateString();
    var minNow = isToday ? now.getHours() * 60 + now.getMinutes() + 30 : -1;
    var out = [];
    shifts.forEach(function (s) {
      var last = Math.min(s[1] - 60, 23 * 60 + 30);
      for (var t = s[0]; t <= last; t += 30) if (t > minNow) out.push(fmt(t));
    });
    return out;
  }

  function initBookingForm() {
    var form = document.querySelector('[data-book-form]');
    if (!form) return;
    var msg = form.querySelector('[data-book-msg]');
    var dateIn = form.querySelector('[data-book-date]');
    var timeSel = form.querySelector('[data-book-time]');

    var today = new Date();
    var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
    dateIn.min = iso(today);
    var max = new Date(today); max.setDate(max.getDate() + 60);
    dateIn.max = iso(max);

    function parseDate(v) {
      var p = (v || '').split('-');
      return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null;
    }
    function fillTimes() {
      var d = parseDate(dateIn.value);
      timeSel.innerHTML = '';
      var add = function (v, label) { var o = document.createElement('option'); o.value = v; o.textContent = label || v; timeSel.appendChild(o); };
      if (!d) { add('', 'Elige un día'); return; }
      var slots = bookSlots(d);
      if (!slots.length) {
        add('', d.getDay() === 1 ? 'Los lunes cerramos' : 'Sin horas libres ese día');
        return;
      }
      slots.forEach(function (s) { add(s); });
    }
    dateIn.addEventListener('change', fillTimes);
    // Por defecto: hoy si quedan horas, si no el siguiente día con servicio
    for (var k = 0; k < 8; k++) {
      var d = new Date(today); d.setDate(d.getDate() + k);
      if (bookSlots(d).length) { dateIn.value = iso(d); break; }
    }
    fillTimes();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setMsg(msg, '');
      form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
      var name = form.elements['name'].value.trim();
      var d = parseDate(dateIn.value);
      if (!name) { form.elements['name'].classList.add('is-invalid'); form.elements['name'].focus(); setMsg(msg, 'Dinos a nombre de quién va la reserva.'); return; }
      if (!d) { dateIn.classList.add('is-invalid'); dateIn.focus(); setMsg(msg, 'Elige el día.'); return; }
      if (!timeSel.value) { timeSel.classList.add('is-invalid'); timeSel.focus(); setMsg(msg, 'Ese día no hay horas disponibles: prueba con otro.'); return; }

      var day = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
      var lines = [
        'Hola La Cordobesa, quiero reservar mesa:',
        '',
        'Nombre: ' + name,
        'Día: ' + day,
        'Hora: ' + timeSel.value,
        'Personas: ' + form.elements['people'].value
      ];
      var notes = form.elements['notes'].value.trim();
      if (notes) lines.push('Notas: ' + notes);

      openWhatsApp(lines.join('\n'));
      setMsg(msg, 'Se ha abierto WhatsApp con tu reserva. Envía el mensaje y te la confirmamos.', true);
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
    safe(initCart, 'cart');
    safe(initOrderForm, 'order');
    safe(initBookingForm, 'booking');
    safe(initParallax, 'parallax');
    safe(initYear, 'year');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
