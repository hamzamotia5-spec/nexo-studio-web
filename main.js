/* Nexo Studio — interacciones ligeras. El contenido está en el HTML; esto solo lo mejora. */
(function () {
  "use strict";

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn("[nexo] " + name + " falló:", e); }
  }

  document.documentElement.classList.add("js");

  function initNav() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 10); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    var showAll = function () { items.forEach(function (el) { el.classList.add("is-in"); }); };
    if (!("IntersectionObserver" in window)) { showAll(); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
    // Red de seguridad: nada se queda oculto.
    setTimeout(showAll, 6000);
  }

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  // Hero: el móvil se endereza, va al centro y su pantalla hace scroll.
  function initHeroScene() {
    var hero = document.getElementById("inicio");
    var visual = hero && hero.querySelector(".hero__visual");
    var layout = hero && hero.querySelector(".hero__layout");
    if (!hero || !visual || !layout) return;
    var scene = window.matchMedia("(min-width: 881px) and (min-height: 641px)");
    var ticking = false;

    function measure() {
      var dx = scene.matches ? layout.clientWidth / 2 - (visual.offsetLeft + visual.offsetWidth / 2) : 0;
      hero.style.setProperty("--dx", dx.toFixed(1) + "px");
    }

    function update() {
      ticking = false;
      var vh = window.innerHeight;
      var p, p1, p2;
      if (scene.matches) {
        var total = hero.offsetHeight - vh;
        p = clamp(-hero.getBoundingClientRect().top / (total || 1));
        p1 = clamp(p / 0.45);
        p2 = clamp((p - 0.5) / 0.45);
      } else {
        var r = visual.getBoundingClientRect();
        p1 = clamp((vh - r.top) / (vh * 0.75));
        p2 = clamp((vh * 0.3 - r.top) / (r.height * 0.7));
        p = p1;
      }
      hero.style.setProperty("--p", p.toFixed(4));
      hero.style.setProperty("--p1", p1.toFixed(4));
      hero.style.setProperty("--p2", p2.toFixed(4));
    }

    function request() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }

    measure();
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", function () { measure(); request(); });
  }

  // Brillo que sigue al ratón en las tarjetas.
  function initCardGlow() {
    if (!window.matchMedia("(hover: hover)").matches) return;
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  function initFaq() {
    // Solo una pregunta abierta a la vez.
    var all = document.querySelectorAll(".faq details");
    all.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (!d.open) return;
        all.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }

  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  function boot() {
    safe(initNav, "nav");
    safe(initHeroScene, "hero");
    safe(initReveal, "reveal");
    safe(initCardGlow, "cards");
    safe(initFaq, "faq");
    safe(initYear, "year");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
