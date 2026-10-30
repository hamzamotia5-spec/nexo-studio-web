/* Animaciones de scroll compartidas por las demos de Nexo Studio.
   - [data-reveal]        aparece al entrar en pantalla (data-delay en ms opcional)
   - [data-parallax="n"]  se desplaza a n× la velocidad del scroll
   - [data-grow]          expone --g (0→1) según avanza por la pantalla
   - [data-count="4.9"]   cuenta desde 0 al entrar en pantalla
   Sin JS todo se ve igual, solo que quieto. */
(function () {
  "use strict";
  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.warn(e); } }
  document.documentElement.classList.add("js");

  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    var show = function (el) { el.classList.add("in"); };
    if (!("IntersectionObserver" in window)) { items.forEach(show); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var d = e.target.getAttribute("data-delay");
        if (d) e.target.style.transitionDelay = d + "ms";
        show(e.target);
        io.unobserve(e.target);
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { items.forEach(show); }, 6000);
  }

  function initScrollFx() {
    var par = [].slice.call(document.querySelectorAll("[data-parallax]"));
    var grow = [].slice.call(document.querySelectorAll("[data-grow]"));
    if (!par.length && !grow.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight;
      par.forEach(function (el) {
        var host = el.parentElement.getBoundingClientRect();
        var f = parseFloat(el.getAttribute("data-parallax")) || 0.2;
        var off = (host.top + host.height / 2 - vh / 2) * -f;
        el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0) scale(" + (el.getAttribute("data-scale") || 1.12) + ")";
      });
      grow.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var g = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.85)));
        el.style.setProperty("--g", g.toFixed(3));
      });
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    update();
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
  }

  function initCount() {
    var els = document.querySelectorAll("[data-count]");
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, to = parseFloat(el.getAttribute("data-count")), dec = (el.getAttribute("data-count").split(".")[1] || "").length;
        var suffix = el.getAttribute("data-suffix") || "", t0 = null;
        function step(t) {
          if (!t0) t0 = t;
          var p = Math.min(1, (t - t0) / 1400), v = to * (1 - Math.pow(1 - p, 3));
          el.textContent = v.toFixed(dec).replace(".", ",") + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.3 });
    els.forEach(function (el) { io.observe(el); });
  }

  function boot() { safe(initReveal); safe(initScrollFx); safe(initCount); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
