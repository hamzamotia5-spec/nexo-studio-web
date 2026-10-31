/* IAPRO — prototipo web jugable (Fase 1 sin backend).
   La partida se guarda en este dispositivo (localStorage). Las reglas de submit()
   son las mismas que tendrá la RPC submit_mission en Supabase. */
(function () {
  "use strict";

  var C = window.IAPRO;
  var KEY = "iapro.partida.v1";
  var TRACK = "webs-locales";
  var STATUS = ["todo", "sent", "replied", "meeting", "won", "lost"];
  var STATUS_LABEL = { todo: "Por contactar", sent: "Mensaje enviado", replied: "Ha respondido", meeting: "Reunión", won: "Cliente", lost: "Descartado" };
  var ORDER = { todo: 0, sent: 1, replied: 2, meeting: 3, won: 4 };
  var app = document.getElementById("app");
  var S; // estado
  var ui = { obStep: 0, tab: "guia", filtro: "all", kitOpen: {}, addOpen: false, tpls: {} };

  /* ------------------------------------------------------------- Estado */
  function blank() {
    return {
      v: 1, onboarded: false,
      perfil: { marca: "", ciudad: "", zona: "", xp: 0, streak: 0, last: null },
      run: { track: TRACK, current: 1, done: {} },
      entregas: {}, checks: {}, prospects: [], ingresos: [], badges: [],
      negocio: { tipo: "", tipoOtro: "", nombre: "", zona: "", direccion: "", telefono: "", servicios: "", horario: "", estilo: "moderno", tono: "cercano" }
    };
  }
  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) { s = null; }
    var b = blank();
    if (!s || s.v !== 1) return b;
    Object.keys(b).forEach(function (k) { if (s[k] === undefined) s[k] = b[k]; });
    Object.keys(b.negocio).forEach(function (k) { if (s.negocio[k] === undefined) s.negocio[k] = b.negocio[k]; });
    return s;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sin almacenamiento: la partida dura lo que la pestaña */ } }

  /* ------------------------------------------------------------ Utilidades */
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function ymd(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function today() { return ymd(new Date()); }
  function yesterday() { var d = new Date(); d.setDate(d.getDate() - 1); return ymd(d); }
  function eur(n) { return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n || 0); }
  function missions() { return C.missions[TRACK]; }
  function mission(n) { return missions().filter(function (m) { return m.number === n; })[0]; }
  function badge(slug) { return C.badges.filter(function (b) { return b.slug === slug; })[0]; }
  function track() { return C.tracks.filter(function (t) { return t.slug === TRACK; })[0]; }
  function negDef(id) { return C.negocios.filter(function (n) { return n.id === id; })[0]; }
  function hl(text) { return esc(text).replace(/\[[^\]\n]{1,70}\]/g, function (m) { return "<mark>" + m + "</mark>"; }); }

  function initials() {
    var w = (S.perfil.marca || "IA PRO").trim().split(/\s+/).filter(function (x) { return x.length > 2 || /^[A-ZÁÉÍÓÚÑ]/.test(x); });
    return (w.length > 1 ? w[0][0] + w[w.length - 1][0] : (w[0] || "IA").slice(0, 2)).toUpperCase();
  }
  function money() { return S.ingresos.reduce(function (a, i) { return a + Number(i.amount); }, 0); }
  function rankOf(xp) { var r = C.ranks[0]; C.ranks.forEach(function (k) { if (xp >= k.min) r = k; }); return r; }
  function nextRank(xp) { return C.ranks.filter(function (k) { return k.min > xp; })[0] || null; }
  function streakShown() { var l = S.perfil.last; return (l === today() || l === yesterday()) ? S.perfil.streak : 0; }
  function touch() {
    var t = today(), l = S.perfil.last;
    if (l === t) return;
    S.perfil.streak = l === yesterday() ? S.perfil.streak + 1 : 1;
    S.perfil.last = t;
  }
  function canSell() {
    var won = S.prospects.some(function (p) { return p.status === "won"; });
    return { won: won, income: S.ingresos.length > 0, ok: won && S.ingresos.length > 0 };
  }
  function countAtLeast(status) {
    return S.prospects.filter(function (p) { return p.status !== "lost" && ORDER[p.status] >= ORDER[status]; }).length;
  }
  function monthlyClients() {
    var set = {};
    S.ingresos.forEach(function (i) { if (i.kind === "monthly") set[i.prospectId] = 1; });
    return Object.keys(set).length;
  }

  /* ---------------------------------------------------- Plantillas de prompts */
  function tipoCorto(label) { return label.split(",")[0].split(" o ")[0].trim().toLowerCase(); }
  function vals() {
    var n = S.negocio, d = negDef(n.tipo) || negDef("otro"), P = function (x) { return "[" + x + "]"; };
    var tipoLabel = n.tipo === "otro" ? (n.tipoOtro.trim() || "") : (n.tipo ? d.label.toLowerCase() : "");
    var zona = n.zona.trim() || S.perfil.zona.trim() || "";
    var est = C.estilos.filter(function (e) { return e.id === n.estilo; })[0] || C.estilos[1];
    var ton = C.tonos.filter(function (e) { return e.id === n.tono; })[0] || C.tonos[0];
    var tel = n.telefono.replace(/[^\d]/g, "");
    if (tel.length === 9) tel = "34" + tel;
    var cta = d.cta;
    return {
      negocio: n.nombre.trim() || P("nombre del negocio"),
      tipo: tipoLabel || P("tipo de negocio"),
      tipoCorto: tipoLabel ? (n.tipo === "otro" ? tipoLabel : tipoCorto(d.label)) : P("tipo de negocio"),
      zona: zona || P("barrio, ciudad"),
      zonaCorta: zona ? zona.split(",")[0].trim() : P("barrio"),
      ciudad: S.perfil.ciudad.trim() || P("tu ciudad"),
      marca: S.perfil.marca.trim() || P("tu marca"),
      servicios: n.servicios.trim() || d.servicios || P("servicios principales"),
      secciones: d.secciones || "portada con botón principal; servicios; por qué elegirnos; galería; reseñas; horario y mapa; preguntas frecuentes; contacto",
      cliente: d.cliente || P("quién es su cliente habitual"),
      dudas: d.dudas || P("las preguntas que más le hacen sus clientes"),
      confianza: d.confianza || "reseñas, fotos reales, años de experiencia y datos de contacto claros",
      fotos: d.fotos || P("3 o 4 escenas típicas del negocio"),
      cta: cta, ctaMin: cta.charAt(0).toLowerCase() + cta.slice(1),
      estilo: est.label + ": " + est.desc, estiloCorto: est.label.toLowerCase(),
      tono: ton.desc,
      direccion: n.direccion.trim() || P("dirección completa"),
      telefono: n.telefono.trim() || P("teléfono"),
      telefonoWa: tel || "34XXXXXXXXX",
      horario: n.horario.trim() || P("horario"),
      schema: d.schema
    };
  }
  function fillMission(tpl, useNegocio) {
    var v = vals(), z = S.perfil.zona.trim() || S.perfil.ciudad.trim();
    if (useNegocio && S.negocio.zona.trim()) z = S.negocio.zona.trim();
    var map = { ciudad: v.ciudad, marca: v.marca, zona: z || "[tu zona]", tipo: S.negocio.tipo ? v.tipoCorto : "[tipo de negocio]" };
    return tpl.replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; });
  }

  /* ------------------------------------------------- Reglas (≈ RPC submit_mission) */
  function submit(m, payload) {
    if (m.number !== S.run.current) return { ok: false, msg: m.number < S.run.current ? "Esta misión ya está completada." : "Esta misión aún está bloqueada. Completa antes la misión " + S.run.current + "." };
    var c = m.proof_config || {}, t = m.proof_type;
    if (t === "text") {
      var fields = c.fields || [{ key: "texto", label: "Respuesta" }];
      for (var i = 0; i < fields.length; i++) {
        var val = String(payload[fields[i].key] || "").trim();
        if (val.length < 3) return { ok: false, msg: "Falta «" + fields[i].label + "»: escribe al menos 3 caracteres." };
      }
    } else if (t === "link") {
      var url;
      try { url = new URL(String(payload.url || "").trim()); } catch (e) { return { ok: false, msg: "Eso no es un enlace válido. Pega la dirección completa, empezando por https://" }; }
      if (url.protocol !== "https:") return { ok: false, msg: "El enlace tiene que empezar por https:// (Netlify y GitHub Pages ya te lo dan así)." };
      if (!/\.[a-z]{2,}$/i.test(url.hostname)) return { ok: false, msg: "El enlace no parece una web publicada. Revisa que esté completo." };
    } else if (t === "checklist") {
      var marks = S.checks[m.number] || [];
      var left = m.steps.filter(function (s, i) { return !marks[i]; }).length;
      if (left) return { ok: false, msg: left === 1 ? "Te queda 1 punto por marcar." : "Te quedan " + left + " puntos por marcar." };
    } else if (t === "contacts") {
      var have = countAtLeast(c.status), need = c.min_contacts;
      if (have < need) return { ok: false, msg: "Tienes " + have + " de " + need + " negocios en «" + STATUS_LABEL[c.status] + "» o más. Te faltan " + (need - have) + "." };
    } else if (t === "income") {
      var sum = money();
      if (sum < c.min_amount) return { ok: false, msg: "Aún no has registrado ningún ingreso. Marca un negocio como «Cliente» en Mis clientes y registra lo que te ha pagado." };
      if (c.min_monthly_clients) {
        var mc = monthlyClients();
        if (mc < c.min_monthly_clients) return { ok: false, msg: "Tienes " + mc + " de " + c.min_monthly_clients + " clientes con cuota mensual. Te faltan " + (c.min_monthly_clients - mc) + "." };
      }
    } else if (t === "image") {
      if (!payload.image) return { ok: false, msg: "Sube una imagen para entregar la misión." };
    }

    var before = rankOf(S.perfil.xp);
    S.entregas[m.number] = { payload: payload, at: new Date().toISOString(), status: "approved" };
    S.perfil.xp += m.xp_reward;
    var newBadge = null;
    if (m.badge_slug && S.badges.indexOf(m.badge_slug) < 0) { S.badges.push(m.badge_slug); newBadge = badge(m.badge_slug); }
    S.run.done[m.number] = today();
    S.run.current = m.number + 1;
    touch();
    save();
    var after = rankOf(S.perfil.xp);
    return { ok: true, xp: m.xp_reward, badge: newBadge, next: mission(m.number + 1) || null, rankUp: after.title !== before.title ? after : null };
  }

  /* ------------------------------------------------------------- Interfaz */
  function hud() {
    var xp = S.perfil.xp, r = rankOf(xp), nr = nextRank(xp);
    var pct = nr ? Math.round((xp - r.min) / (nr.min - r.min) * 100) : 100;
    return '<header class="hud">' +
      '<a class="hud__money" href="#/clientes" aria-label="Dinero ganado"><span class="coin" aria-hidden="true">€</span><b id="money">' + eur(money()) + '</b></a>' +
      '<a class="hud__rank" href="#/perfil"><span>' + esc(r.title) + ' · ' + xp + ' XP</span><i class="bar"><i style="width:' + pct + '%"></i></i></a>' +
      '<span class="hud__streak" title="Racha de días"><span aria-hidden="true">🔥</span>' + streakShown() + '</span>' +
      '</header>';
  }
  function tabbar(active) {
    var items = [["mapa", "🗺️", "Mapa"], ["kit", "✨", "Kit Web Pro"], ["clientes", "👥", "Clientes"], ["perfil", "👤", "Perfil"]];
    return '<nav class="tabbar" aria-label="Secciones">' + items.map(function (it) {
      return '<a href="#/' + it[0] + '" class="' + (active === it[0] ? "is-on" : "") + '"' + (active === it[0] ? ' aria-current="page"' : "") + '><span aria-hidden="true">' + it[1] + '</span>' + it[2] + '</a>';
    }).join("") + '</nav>';
  }
  function shell(active, body) {
    app.innerHTML = hud() + '<main class="screen">' + body + '</main>' + tabbar(active);
    app.style.setProperty("--route", track().color);
    window.scrollTo(0, 0);
  }

  /* ---------- Onboarding */
  function viewOnboarding() {
    var st = ui.obStep, body = "";
    if (st === 0) {
      body = '<div class="ob__hero"><span class="ob__logo">IA<b>PRO</b></span>' +
        '<h1>Monta tu negocio con IA, <span class="grad">misión a misión.</span></h1>' +
        '<p>Un juego en el que avanzas haciendo cosas de verdad: creas una web, escribes a negocios, cierras clientes y ves crecer tu contador de dinero real.</p>' +
        '<ul class="ob__list"><li><b>🎯 Misiones reales.</b> No avanzas por ver vídeos, sino por demostrar lo que has hecho.</li>' +
        '<li><b>✨ Prompts listos.</b> Copia y pega en Claude o ChatGPT, ya adaptados a tu negocio.</li>' +
        '<li><b>💶 Dinero real.</b> Registra lo que ganas, sube de rango y desbloquea tu perfil en el marketplace.</li></ul>' +
        '<button class="btn btn--primary btn--block" data-act="ob-next">Empezar</button></div>';
    } else if (st === 1) {
      body = '<h2 class="ob__h">Elige tu ruta</h2><p class="muted">Cada ruta es un mapa de misiones para montar un tipo de negocio.</p><div class="routes">' +
        C.tracks.map(function (t) {
          var on = t.is_published;
          return '<button class="route' + (on ? "" : " is-off") + '" style="--c:' + t.color + '" ' + (on ? 'data-act="ob-next"' : "disabled") + '>' +
            '<span class="route__ico" aria-hidden="true">' + t.icon + '</span><span><b>' + esc(t.title) + '</b><small>' + esc(t.description) + '</small></span>' +
            (on ? '<em>Jugar</em>' : '<em class="soon">Pronto</em>') + '</button>';
        }).join("") + '</div>';
    } else if (st === 2) {
      body = '<h2 class="ob__h">Tu negocio</h2><p class="muted">Lo usaremos para personalizar todos los prompts. Puedes cambiarlo después.</p>' +
        '<form class="form" data-form="ob-perfil">' +
        '<label>Tu ciudad<input name="ciudad" required minlength="2" autocomplete="address-level2" placeholder="Ej.: Valencia" value="' + esc(S.perfil.ciudad) + '"></label>' +
        '<label>Nombre de tu marca <small>(si aún no lo tienes, lo eliges en la misión 1)</small><input name="marca" placeholder="Ej.: Webs del Barrio" value="' + esc(S.perfil.marca) + '"></label>' +
        '<button class="btn btn--primary btn--block">Continuar</button></form>';
    } else {
      body = '<h2 class="ob__h">Guarda tu partida</h2>' +
        '<p class="muted">En la app tendrás cuenta con email, Google o Apple. En este prototipo tu partida se guarda en este dispositivo.</p>' +
        '<div class="card note">Sin registro, sin anuncios y gratis. Los vídeos son siempre gratis; lo premium serán herramientas extra.</div>' +
        '<button class="btn btn--primary btn--block" data-act="ob-finish">Empezar a jugar</button>';
    }
    app.innerHTML = '<main class="screen ob">' + (st > 0 ? '<button class="back" data-act="ob-back">← Atrás</button>' : "") + body +
      '<div class="dots" aria-hidden="true">' + [0, 1, 2, 3].map(function (i) { return '<i class="' + (i === st ? "is-on" : "") + '"></i>'; }).join("") + '</div></main>';
  }

  /* ---------- Mapa */
  function viewMap() {
    var ms = missions(), t = track(), cur = S.run.current, gap = 132, H = ms.length * gap + 30;
    var pts = ms.map(function (m, i) { return { x: 50 + Math.sin(i * 1.15) * 26, y: 60 + i * gap }; });
    var path = pts.map(function (p, i) { return (i ? "L" : "M") + p.x + " " + p.y; }).join(" ");
    var curIdx = Math.min(cur - 1, ms.length - 1);
    var donePath = pts.slice(0, curIdx + 1).map(function (p, i) { return (i ? "L" : "M") + p.x + " " + p.y; }).join(" ");
    var nodes = ms.map(function (m, i) {
      var st = m.number < cur ? "done" : m.number === cur ? "now" : "locked";
      var b = badge(m.badge_slug);
      return '<div class="node node--' + st + '" style="left:' + pts[i].x + '%;top:' + pts[i].y + 'px">' +
        '<a class="node__dot" href="#/mision/' + m.number + '" aria-label="Misión ' + m.number + ': ' + esc(m.title) + (st === "locked" ? " (bloqueada)" : st === "done" ? " (completada)" : "") + '">' +
        (st === "done" ? "✓" : st === "locked" ? "🔒" : m.number) + '</a>' +
        '<div class="node__label"><small>Misión ' + m.number + ' · ' + m.xp_reward + ' XP ' + (b ? b.icon : "") + '</small><b>' + esc(m.title) + '</b>' +
        (st === "now" ? '<a class="btn btn--primary btn--small" href="#/mision/' + m.number + '">▶ Jugar</a>' : "") + '</div></div>';
    }).join("");
    var finished = cur > ms.length;
    var cs = canSell();
    shell("mapa",
      '<section class="map-head"><span class="route__ico" aria-hidden="true">' + t.icon + '</span><div><small>Tu ruta</small><h1>' + esc(t.title) + '</h1>' +
      '<p class="muted">' + Math.min(cur - 1, ms.length) + ' de ' + ms.length + ' misiones' + (S.perfil.marca ? ' · ' + esc(S.perfil.marca) : "") + '</p></div></section>' +
      (finished ? '<div class="card win">🏆 ¡Ruta completada! Ya tienes un negocio real. Las próximas rutas llegan pronto.</div>' : "") +
      '<div class="map" style="height:' + H + 'px"><svg viewBox="0 0 100 ' + H + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="' + path + '" class="map__path"/><path d="' + donePath + '" class="map__done"/></svg>' + nodes + '</div>' +
      '<a class="card market' + (cs.ok ? " is-open" : "") + '" href="#/marketplace"><span aria-hidden="true">' + (cs.ok ? "🏪" : "🔒") + '</span><span><b>Marketplace</b><small>' +
      (cs.ok ? "Desbloqueado: publica tu servicio y que te contraten." : "Se desbloquea al cerrar tu primer cliente.") + '</small></span></a>');
  }

  /* ---------- Misión */
  function promptBox(text, id) {
    return '<div class="prompt"><pre id="' + id + '">' + hl(text) + '</pre><button class="btn btn--copy" data-copy="' + id + '">Copiar prompt</button></div>';
  }
  function videoBlock(m) {
    return '<div class="videos"><h3>Vídeos guía</h3>' + m.videos.map(function (v, i) {
      if (v.youtube_video_id) {
        var src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(v.youtube_video_id) + "?rel=0&start=" + (v.start_seconds || 0);
        return '<figure class="video"><div class="video__frame"><iframe src="' + src + '" title="' + esc(v.title) + '" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>' +
          '<figcaption>' + (i + 1) + '. ' + esc(v.title) + ' · <a href="' + esc(v.channel_url) + '" target="_blank" rel="noopener">' + esc(v.channel_name) + '</a></figcaption></figure>';
      }
      return '<a class="video video--search" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(v.buscar) + '" target="_blank" rel="noopener">' +
        '<span aria-hidden="true">▶</span><span><b>' + esc(v.buscar) + '</b><small>Buscar en YouTube · vídeo seleccionado próximamente</small></span></a>';
    }).join("") + '</div>';
  }
  function viewMission(n) {
    var m = mission(n);
    if (!m) { location.hash = "#/mapa"; return; }
    var cur = S.run.current, st = n < cur ? "done" : n === cur ? "now" : "locked";
    var b = badge(m.badge_slug);
    var head = '<a class="back" href="#/mapa">← Mapa</a><section class="m-head"><small>Misión ' + n + ' de ' + missions().length + '</small><h1>' + esc(m.title) + '</h1>' +
      '<p class="goal">' + esc(m.goal) + '</p><p class="chips"><span>+' + m.xp_reward + ' XP</span>' + (b ? '<span>' + b.icon + ' ' + esc(b.title) + '</span>' : "") +
      (st === "done" ? '<span class="ok">✓ Completada</span>' : "") + '</p></section>';
    if (st === "locked") {
      shell("mapa", head + '<div class="card locked">🔒 Esta misión se desbloquea al completar la misión ' + cur + '.<br><a class="btn btn--primary btn--small" href="#/mision/' + cur + '">Ir a la misión ' + cur + '</a></div>');
      return;
    }
    var tabs = '<div class="tabs" role="tablist"><button role="tab" aria-selected="' + (ui.tab === "guia") + '" data-tab="guia">Guía</button>' +
      '<button role="tab" aria-selected="' + (ui.tab === "entregar") + '" data-tab="entregar">' + (st === "done" ? "Tu entrega" : "Entregar") + '</button></div>';
    var body = ui.tab === "guia" ? guide(m) : (st === "done" ? delivered(m) : deliver(m));
    shell("mapa", head + tabs + '<div class="tabpanel">' + body + '</div>');
  }
  function guide(m) {
    var html = videoBlock(m) + '<ol class="steps">';
    m.steps.forEach(function (s, i) {
      html += '<li><p>' + esc(s.text) + '</p>';
      if (s.kit) html += '<div class="kit-inline"><p class="muted">Rellena los datos y tendrás <b>' + C.kitWeb.length + ' prompts</b> listos, en orden, para crear una web profesional de principio a fin.</p>' + kitForm() + kitList(true) + '</div>';
      if (s.prompt) { ui.tpls["p" + m.number + "-" + i] = [s.prompt, m.number === 2]; html += promptBox(fillMission(s.prompt, m.number === 2), "p" + m.number + "-" + i); }
      html += '</li>';
    });
    html += '</ol><button class="btn btn--primary btn--block" data-tab="entregar">Ya lo tengo: entregar</button>';
    return html;
  }
  function deliver(m) {
    var c = m.proof_config || {}, t = m.proof_type, f = "";
    if (t === "text") {
      f = (c.fields || [{ key: "texto", label: "Respuesta" }]).map(function (fl) {
        var pre = fl.key === "marca" ? S.perfil.marca : fl.key === "zona" ? S.perfil.zona : "";
        return '<label>' + esc(fl.label) + '<input name="' + fl.key + '" placeholder="' + esc(fl.ph || "") + '" value="' + esc(pre) + '"></label>';
      }).join("");
    } else if (t === "link") {
      f = '<label>' + esc(c.label || "Enlace") + '<input name="url" type="url" inputmode="url" placeholder="' + esc(c.ph || "https://") + '"></label>' +
        '<p class="muted small">¿Aún no la has publicado? Arrastra la carpeta a <a href="https://app.netlify.com/drop" target="_blank" rel="noopener">Netlify Drop</a> y copia el enlace.</p>';
    } else if (t === "checklist") {
      var marks = S.checks[m.number] || [];
      f = '<div class="checklist">' + m.steps.map(function (s, i) {
        return '<label class="check"><input type="checkbox" data-check="' + m.number + ':' + i + '"' + (marks[i] ? " checked" : "") + '><span>' + esc(s.text) + '</span></label>';
      }).join("") + '</div>';
    } else if (t === "contacts") {
      var have = countAtLeast(c.status), pct = Math.min(100, Math.round(have / c.min_contacts * 100));
      f = '<div class="progress"><b>' + Math.min(have, c.min_contacts) + ' / ' + c.min_contacts + '</b> negocios en «' + STATUS_LABEL[c.status] + '» o más<i class="bar bar--big"><i style="width:' + pct + '%"></i></i></div>' +
        '<a class="btn btn--line btn--block" href="#/clientes">👥 Ir a Mis clientes</a>';
    } else if (t === "income") {
      var sum = money(), mc = monthlyClients();
      f = '<div class="progress"><b>' + eur(sum) + '</b> registrados' + (c.min_monthly_clients ? '<br><b>' + mc + ' / ' + c.min_monthly_clients + '</b> clientes con cuota mensual<i class="bar bar--big"><i style="width:' + Math.min(100, Math.round(mc / c.min_monthly_clients * 100)) + '%"></i></i>' : "") + '</div>' +
        '<a class="btn btn--line btn--block" href="#/clientes">👥 Registrar un ingreso en Mis clientes</a>';
    } else if (t === "image") {
      f = '<label>Imagen<input name="image" type="file" accept="image/*"></label>';
    }
    return '<form class="form" data-form="submit" data-n="' + m.number + '">' + f + '<p class="err" role="alert" id="err"></p>' +
      '<button class="btn btn--primary btn--block">Comprobar y completar misión</button></form>';
  }
  function delivered(m) {
    var e = S.entregas[m.number], p = e ? e.payload : {}, out = "";
    if (m.proof_type === "text") out = Object.keys(p).map(function (k) { return '<p><small>' + esc(k) + '</small><br><b>' + esc(p[k]) + '</b></p>'; }).join("");
    else if (m.proof_type === "link") out = '<p><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.url) + '</a></p>';
    else out = '<p>Prueba validada el ' + esc(S.run.done[m.number] || "") + '.</p>';
    return '<div class="card">' + out + '</div><a class="btn btn--primary btn--block" href="#/mision/' + S.run.current + '">Ir a la misión actual</a>';
  }

  /* ---------- Kit Web Pro */
  function kitForm() {
    var n = S.negocio;
    var tipos = C.negocios.map(function (d) {
      return '<button type="button" class="tipo' + (n.tipo === d.id ? " is-on" : "") + '" data-tipo="' + d.id + '" aria-pressed="' + (n.tipo === d.id) + '"><span aria-hidden="true">' + d.emoji + '</span>' + esc(d.label) + '</button>';
    }).join("");
    var def = negDef(n.tipo);
    function opt(list, sel) { return list.map(function (o) { return '<option value="' + o.id + '"' + (o.id === sel ? " selected" : "") + '>' + esc(o.label) + '</option>'; }).join(""); }
    return '<form class="form kitform" data-form="kit" autocomplete="off">' +
      '<fieldset><legend>1. ¿Para qué negocio es la web?</legend><div class="tipos">' + tipos + '</div>' +
      (n.tipo === "otro" ? '<label>¿Qué negocio es?<input name="tipoOtro" placeholder="Ej.: autoescuela" value="' + esc(n.tipoOtro) + '"></label>' : "") + '</fieldset>' +
      '<fieldset><legend>2. Datos del negocio <small>(lo que no sepas queda como [hueco] para rellenar)</small></legend>' +
      '<label>Nombre del negocio<input name="nombre" placeholder="Ej.: Bar Casa Lola" value="' + esc(n.nombre) + '"></label>' +
      '<label>Barrio y ciudad<input name="zona" placeholder="' + esc(S.perfil.zona || "Ej.: Ruzafa, Valencia") + '" value="' + esc(n.zona) + '"></label>' +
      '<label>Servicios principales<textarea name="servicios" rows="2" placeholder="' + esc(def && def.servicios ? def.servicios : "Ej.: lo que más vende") + '">' + esc(n.servicios) + '</textarea></label>' +
      '<div class="two"><label>WhatsApp / teléfono<input name="telefono" inputmode="tel" placeholder="600 000 000" value="' + esc(n.telefono) + '"></label>' +
      '<label>Horario<input name="horario" placeholder="L–V 9–20 h" value="' + esc(n.horario) + '"></label></div>' +
      '<label>Dirección<input name="direccion" placeholder="Calle, número, CP" value="' + esc(n.direccion) + '"></label>' +
      '<div class="two"><label>Estilo visual<select name="estilo">' + opt(C.estilos, n.estilo) + '</select></label>' +
      '<label>Tono de los textos<select name="tono">' + opt(C.tonos, n.tono) + '</select></label></div></fieldset></form>';
  }
  function kitList(compact) {
    var v = vals(), fase = "";
    var html = '<div class="kit" id="kitlist"><div class="kit__top"><h3>3. Tus prompts, en orden</h3><button class="btn btn--line btn--small" data-act="copy-all">Copiar todos</button></div>';
    C.kitWeb.forEach(function (k, i) {
      if (k.fase !== fase) { fase = k.fase; html += '<p class="kit__fase">' + esc(fase) + '</p>'; }
      var open = ui.kitOpen[k.id] != null ? ui.kitOpen[k.id] : (!compact && i === 0);
      html += '<details class="kp"' + (open ? " open" : "") + ' data-kp="' + k.id + '"><summary><i>' + (i + 1) + '</i><span><b>' + esc(k.titulo) + '</b><small>' + esc(k.herramienta) + '</small></span></summary>' +
        '<p class="kp__when">' + esc(k.cuando) + '</p>' + promptBox(k.prompt(v), "kit-" + k.id) + '</details>';
    });
    return html + '</div>';
  }
  function viewKit() {
    shell("kit", '<section class="m-head"><small>Kit Web Pro</small><h1>Prompts para una web <span class="grad">profesional</span></h1>' +
      '<p class="goal">Elige el negocio, rellena lo que sepas y copia cada prompt en Claude o ChatGPT en este orden: estrategia → textos → diseño → web → revisión → SEO → legales → publicar.</p></section>' +
      kitForm() + kitList(false) + missionLibrary());
  }
  function missionLibrary() {
    var html = '<section class="lib"><h2>Todos los prompts de la ruta</h2><p class="muted">Para vender la web: nombre de marca, precios, mensajes, reuniones, cobro y cuotas mensuales.</p>';
    missions().forEach(function (m) {
      var ps = m.steps.filter(function (s) { return s.prompt; });
      if (!ps.length) return;
      html += '<details class="kp"><summary><i>' + m.number + '</i><span><b>' + esc(m.title) + '</b><small>' + ps.length + ' prompts</small></span></summary>' +
        ps.map(function (s, i) { return '<p class="kp__when">' + esc(s.text) + '</p>' + promptBox(fillMission(s.prompt), "lib-" + m.number + "-" + i); }).join("") + '</details>';
    });
    return html + '</section>';
  }
  function refreshKitList() {
    var el = document.getElementById("kitlist");
    if (!el) return;
    var tmp = document.createElement("div");
    tmp.innerHTML = kitList(!!el.closest(".kit-inline"));
    el.replaceWith(tmp.firstChild);
    Object.keys(ui.tpls).forEach(function (id) { var pre = document.getElementById(id); if (pre) pre.innerHTML = hl(fillMission(ui.tpls[id][0], ui.tpls[id][1])); });
  }

  /* ---------- Mis clientes */
  function waMessage(p) {
    var marca = S.perfil.marca || "[tu marca]";
    var link = S.entregas[2] ? S.entregas[2].payload.url : "[enlace a tu web de muestra]";
    return "Hola, ¿qué tal? Soy de " + marca + ", hago páginas web para negocios de " + (S.perfil.zona || "la zona") + ". He visto " + p.business_name +
      " en Google y me ha gustado mucho, pero no he encontrado vuestra web, así que os he preparado un ejemplo de cómo podría ser: " + link +
      "\n\n¿Te la enseño en 10 minutos sin compromiso?";
  }
  function viewClients() {
    var counts = {}; STATUS.forEach(function (s) { counts[s] = 0; });
    S.prospects.forEach(function (p) { counts[p.status]++; });
    var list = S.prospects.filter(function (p) { return ui.filtro === "all" || p.status === ui.filtro; })
      .sort(function (a, b) { return b.updated_at.localeCompare(a.updated_at); });
    var chips = '<div class="filters" role="group" aria-label="Filtrar por estado"><button data-filtro="all" aria-pressed="' + (ui.filtro === "all") + '">Todos <b>' + S.prospects.length + '</b></button>' +
      STATUS.map(function (s) { return '<button data-filtro="' + s + '" class="st-' + s + '" aria-pressed="' + (ui.filtro === s) + '">' + STATUS_LABEL[s] + ' <b>' + counts[s] + '</b></button>'; }).join("") + '</div>';
    var tipos = C.negocios.filter(function (d) { return d.id !== "otro"; }).map(function (d) { return '<option>' + esc(d.label) + '</option>'; }).join("");
    var form = '<details class="card add"' + (ui.addOpen || !S.prospects.length ? " open" : "") + ' data-add><summary>＋ Añadir negocio</summary>' +
      '<form class="form" data-form="prospect"><label>Nombre del negocio *<input name="business_name" required placeholder="Ej.: Peluquería Marisa"></label>' +
      '<div class="two"><label>Tipo<input name="business_type" list="tipos-dl" placeholder="Ej.: Peluquería"></label><datalist id="tipos-dl">' + tipos + '</datalist>' +
      '<label>Ubicación<input name="location" placeholder="Calle o barrio"></label></div>' +
      '<label>Contacto (WhatsApp o Instagram)<input name="contact" placeholder="600 000 000 o @usuario"></label>' +
      '<label>Notas<input name="notes" placeholder="Ej.: 4,7★ en Google, sin web"></label>' +
      '<button class="btn btn--primary btn--block">Añadir a mi lista</button></form></details>';
    var cards = list.map(function (p) {
      var idx = ORDER[p.status], next = p.status === "lost" ? null : STATUS[idx + 1];
      var paid = S.ingresos.filter(function (i) { return i.prospectId === p.id; }).reduce(function (a, i) { return a + Number(i.amount); }, 0);
      return '<article class="pc st-' + p.status + '"><header><div><b>' + esc(p.business_name) + '</b><small>' + esc([p.business_type, p.location].filter(Boolean).join(" · ")) + '</small></div>' +
        '<span class="pill">' + STATUS_LABEL[p.status] + '</span></header>' +
        (p.contact || p.notes ? '<p class="small muted">' + esc([p.contact, p.notes].filter(Boolean).join(" · ")) + '</p>' : "") +
        (paid ? '<p class="small paid">💶 ' + eur(paid) + ' cobrados</p>' : "") +
        '<div class="pc__act">' +
        (next && next !== "lost" ? '<button class="btn btn--primary btn--small" data-adv="' + p.id + '">→ ' + STATUS_LABEL[next] + '</button>' : "") +
        (p.status === "won" ? '<button class="btn btn--gold btn--small" data-income="' + p.id + '">💶 Registrar ingreso</button>' : "") +
        (idx < 2 || p.status === "todo" ? '<button class="btn btn--line btn--small" data-msg="' + p.id + '">💬 Mensaje</button>' : "") +
        '<select data-status="' + p.id + '" aria-label="Cambiar estado">' + STATUS.map(function (s) { return '<option value="' + s + '"' + (s === p.status ? " selected" : "") + '>' + STATUS_LABEL[s] + '</option>'; }).join("") + '</select>' +
        '<button class="icon" data-del="' + p.id + '" aria-label="Eliminar ' + esc(p.business_name) + '">🗑</button></div></article>';
    }).join("");
    shell("clientes", '<section class="m-head"><small>Mini-CRM</small><h1>Mis clientes</h1><p class="goal">Toca el botón de cada tarjeta para moverla al siguiente estado. Cuando alguien sea «Cliente», registra lo que te paga.</p></section>' +
      form + (S.prospects.length ? chips : "") + '<div class="pcs">' + (cards || (S.prospects.length ? '<p class="muted center">No hay negocios en este estado.</p>' : "")) + '</div>' +
      (S.ingresos.length ? '<section class="lib"><h2>Ingresos</h2><ul class="incomes">' + S.ingresos.slice().reverse().map(function (i) {
        var p = S.prospects.filter(function (x) { return x.id === i.prospectId; })[0];
        return '<li><span><b>' + eur(i.amount) + '</b> · ' + (i.kind === "monthly" ? "Cuota mensual" : "Pago único") + '<small>' + esc((p ? p.business_name : "Cliente eliminado") + (i.description ? " · " + i.description : "")) + '</small></span><time>' + esc(i.created_at.slice(0, 10)) + '</time></li>';
      }).join("") + '</ul></section>' : ""));
  }
  function incomeModal(pid) {
    var p = S.prospects.filter(function (x) { return x.id === pid; })[0];
    if (!p) return;
    modal('<h2>💶 Registrar ingreso</h2><p class="muted">' + esc(p.business_name) + '</p><form class="form" data-form="income" data-pid="' + pid + '">' +
      '<label>Importe (€)<input name="amount" type="number" inputmode="decimal" min="0.01" step="0.01" required placeholder="Ej.: 350"></label>' +
      '<div class="seg"><label><input type="radio" name="kind" value="one_time" checked><span>Pago único</span></label><label><input type="radio" name="kind" value="monthly"><span>Cuota mensual</span></label></div>' +
      '<label>Concepto<input name="description" placeholder="Ej.: Web paquete Profesional (50 %)"></label>' +
      '<p class="err" role="alert"></p><button class="btn btn--gold btn--block">Añadir ingreso</button></form>');
  }

  /* ---------- Perfil */
  function viewProfile() {
    var xp = S.perfil.xp, r = rankOf(xp), nr = nextRank(xp), ms = missions(), done = Math.min(S.run.current - 1, ms.length);
    var pct = nr ? Math.round((xp - r.min) / (nr.min - r.min) * 100) : 100;
    var cs = canSell();
    shell("perfil", '<section class="prof"><div class="avatar" aria-hidden="true">' + esc(initials()) + '</div>' +
      '<h1>' + esc(S.perfil.marca || "Tu marca") + '</h1><p class="muted">' + esc([S.perfil.zona, S.perfil.ciudad].filter(Boolean).join(" · ") || "Sin zona aún") + '</p></section>' +
      '<div class="stats"><div><small>Dinero ganado</small><b class="gold">' + eur(money()) + '</b></div><div><small>Rango</small><b>' + esc(r.title) + '</b></div>' +
      '<div><small>XP</small><b>' + xp + '</b></div><div><small>Racha</small><b>🔥 ' + streakShown() + (streakShown() === 1 ? ' día' : ' días') + '</b></div></div>' +
      '<div class="card"><p><b>' + esc(r.title) + '</b>' + (nr ? ' → ' + esc(nr.title) + ' <span class="muted">(' + (nr.min - xp) + ' XP)</span>' : ' · rango máximo') + '</p><i class="bar bar--big"><i style="width:' + pct + '%"></i></i>' +
      '<p class="small muted ranks">' + C.ranks.map(function (k) { return '<span class="' + (xp >= k.min ? "on" : "") + '">' + esc(k.title) + ' ' + k.min + '</span>'; }).join("") + '</p></div>' +
      '<h2 class="sub">Insignias</h2><div class="badges">' + C.badges.map(function (b) {
        var on = S.badges.indexOf(b.slug) >= 0;
        return '<div class="bdg' + (on ? " is-on" : "") + '"><span aria-hidden="true">' + (on ? b.icon : "🔒") + '</span><small>' + esc(b.title) + '</small></div>';
      }).join("") + '</div>' +
      '<h2 class="sub">Rutas en curso</h2><a class="card routecard" href="#/mapa" style="--c:' + track().color + '"><span aria-hidden="true">' + track().icon + '</span><span><b>' + esc(track().title) + '</b><small>' + done + ' / ' + ms.length + ' misiones</small><i class="bar"><i style="width:' + Math.round(done / ms.length * 100) + '%"></i></i></span></a>' +
      '<a class="card market' + (cs.ok ? " is-open" : "") + '" href="#/marketplace"><span aria-hidden="true">' + (cs.ok ? "🏪" : "🔒") + '</span><span><b>Perfil en el marketplace</b><small>' + (cs.ok ? "Desbloqueado" : "Bloqueado hasta tu primer cliente") + '</small></span></a>' +
      '<form class="form card" data-form="perfil"><h2 class="sub">Ajustes</h2><label>Marca<input name="marca" value="' + esc(S.perfil.marca) + '"></label><div class="two"><label>Zona<input name="zona" value="' + esc(S.perfil.zona) + '"></label><label>Ciudad<input name="ciudad" value="' + esc(S.perfil.ciudad) + '"></label></div><button class="btn btn--line btn--block">Guardar</button></form>' +
      '<div class="danger"><button class="btn btn--line btn--small" data-act="export">Descargar mi partida</button><button class="btn btn--line btn--small" data-act="reset">Borrar partida</button></div>');
  }

  /* ---------- Marketplace (vista previa de la Fase 3) */
  function viewMarket() {
    var cs = canSell();
    var body = '<a class="back" href="#/mapa">← Mapa</a><section class="m-head"><small>Marketplace</small><h1>Que te contraten</h1>' +
      '<p class="goal">Cuando cierres tu primer cliente, tu perfil público aparecerá aquí para que otros negocios te contraten.</p></section>';
    if (!cs.ok) {
      body += '<div class="card"><h3>Para desbloquearlo necesitas:</h3><ul class="req"><li class="' + (cs.won ? "on" : "") + '">' + (cs.won ? "✓" : "○") + ' Un negocio marcado como «Cliente»</li>' +
        '<li class="' + (cs.income ? "on" : "") + '">' + (cs.income ? "✓" : "○") + ' Un ingreso registrado en esta ruta</li></ul></div>';
    } else {
      var b = S.badges.map(badge).filter(Boolean).map(function (x) { return x.icon; }).join(" ");
      body += '<div class="card win">🎉 ¡Desbloqueado! Así se verá tu ficha cuando abramos el marketplace.</div>' +
        '<article class="card seller"><div class="avatar" aria-hidden="true">' + esc(initials()) + '</div><div><b>' + esc(S.perfil.marca || "Tu marca") + '</b><small>' + esc(S.perfil.zona || S.perfil.ciudad) + ' · Webs para negocios locales</small><p>' + b + '</p></div></article>' +
        promptBox("Escribe la descripción de mi servicio para un marketplace de profesionales: soy " + (S.perfil.marca || "[tu marca]") + ", hago páginas web con IA para negocios de " + (S.perfil.zona || "[tu zona]") + ". Incluye título (máx. 60 caracteres), descripción de 80 palabras centrada en resultados, qué incluye, plazo de entrega y precio desde [PRECIO]. Tono cercano y profesional.", "mk-desc");
    }
    shell("mapa", body);
  }

  /* ---------- Celebración, modal, toast, monedas */
  function celebrate(res, m) {
    var pieces = ""; for (var i = 0; i < 40; i++) pieces += '<i style="--x:' + Math.round(Math.random() * 100) + '%;--d:' + (Math.random() * .6).toFixed(2) + 's;--r:' + Math.round(Math.random() * 360) + 'deg;--h:' + Math.round(Math.random() * 360) + '"></i>';
    var el = document.createElement("div");
    el.className = "celebrate";
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Misión completada");
    el.innerHTML = '<div class="confetti" aria-hidden="true">' + pieces + '</div><div class="celebrate__box"><p class="kicker">Misión ' + m.number + ' completada</p>' +
      '<h2>¡Bien hecho!</h2><p class="xpwin">+<span data-count="' + res.xp + '">0</span> XP</p>' +
      (res.badge ? '<div class="newbadge"><span aria-hidden="true">' + res.badge.icon + '</span><b>Insignia: ' + esc(res.badge.title) + '</b></div>' : "") +
      (res.rankUp ? '<p class="rankup">⬆ Has subido a <b>' + esc(res.rankUp.title) + '</b></p>' : "") +
      (res.next ? '<p class="muted">Desbloqueada: <b>Misión ' + res.next.number + ' · ' + esc(res.next.title) + '</b></p><a class="btn btn--primary btn--block" href="#/mision/' + res.next.number + '" data-close>Siguiente misión</a>'
        : '<p class="muted">¡Has completado la ruta entera!</p>') +
      '<a class="btn btn--line btn--block" href="#/mapa" data-close>Volver al mapa</a></div>';
    document.body.appendChild(el);
    countUp(el.querySelector("[data-count]"), res.xp, function (v) { return v; });
    el.querySelector("a").focus();
  }
  function modal(html) {
    closeModal();
    var el = document.createElement("div");
    el.className = "modal"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    el.innerHTML = '<div class="modal__box"><button class="icon modal__x" data-close aria-label="Cerrar">✕</button>' + html + '</div>';
    document.body.appendChild(el);
    var f = el.querySelector("input"); if (f) f.focus();
  }
  function closeModal() { document.querySelectorAll(".modal, .celebrate").forEach(function (m) { m.remove(); }); }
  var toastT;
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("is-on"); }, 2200);
  }
  function countUp(el, to, fmt, from) {
    if (!el) return;
    var start = performance.now(), dur = 900, a = from || 0;
    (function tick(now) {
      var k = Math.min(1, (now - start) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round((a + (to - a) * e) * 100) / 100);
      if (k < 1) requestAnimationFrame(tick);
    })(start);
  }
  function coins(prev) {
    var target = document.querySelector(".hud__money"), r = target.getBoundingClientRect();
    for (var i = 0; i < 12; i++) {
      var c = document.createElement("span");
      c.className = "flycoin"; c.textContent = "€";
      c.style.left = (window.innerWidth / 2 + (Math.random() - .5) * 160) + "px";
      c.style.top = (window.innerHeight / 2 + (Math.random() - .5) * 120) + "px";
      c.style.setProperty("--tx", (r.left + 14) + "px"); c.style.setProperty("--ty", (r.top + 10) + "px");
      c.style.animationDelay = (i * 45) + "ms";
      document.body.appendChild(c);
      (function (el) { setTimeout(function () { el.remove(); }, 1400); })(c);
    }
    target.classList.add("is-bump");
    setTimeout(function () { target.classList.remove("is-bump"); countUp(document.getElementById("money"), money(), eur, prev); }, 650);
  }
  function copyText(text) {
    var done = function () { toast("Copiado. Pégalo en Claude o ChatGPT"); };
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(done, fallback); } else fallback();
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("No se pudo copiar: mantén pulsado el texto para copiarlo"); }
      ta.remove();
    }
  }

  /* ------------------------------------------------------------- Router */
  function route() {
    closeModal();
    if (!S.onboarded) { viewOnboarding(); return; }
    var h = location.hash.replace(/^#\/?/, "").split("/");
    if (h[0] === "mision") { var n = parseInt(h[1], 10); if (ui.lastMission !== n) { ui.tab = "guia"; ui.lastMission = n; } viewMission(n); }
    else if (h[0] === "kit") viewKit();
    else if (h[0] === "clientes") viewClients();
    else if (h[0] === "perfil") viewProfile();
    else if (h[0] === "marketplace") viewMarket();
    else viewMap();
  }
  function rerender() { var y = window.scrollY; route(); window.scrollTo(0, y); }

  /* ------------------------------------------------------------- Eventos */
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-act],[data-tab],[data-copy],[data-tipo],[data-filtro],[data-adv],[data-income],[data-msg],[data-del],[data-close]");
    if (!t) return;
    var d = t.dataset;
    if (d.close != null) { closeModal(); if (t.tagName !== "A") e.preventDefault(); return; }
    if (d.copy) { var pre = document.getElementById(d.copy); if (pre) copyText(pre.textContent); return; }
    if (d.tab) { ui.tab = d.tab; rerender(); return; }
    if (d.tipo) {
      S.negocio.tipo = d.tipo; save(); rerender();
      return;
    }
    if (d.filtro) { ui.filtro = d.filtro; rerender(); return; }
    if (d.adv) {
      var p = S.prospects.filter(function (x) { return x.id === d.adv; })[0];
      if (p) { p.status = STATUS[ORDER[p.status] + 1]; p.updated_at = new Date().toISOString(); touch(); save(); toast(p.business_name + " → " + STATUS_LABEL[p.status]); rerender(); if (p.status === "won") incomeModal(p.id); }
      return;
    }
    if (d.income) { incomeModal(d.income); return; }
    if (d.msg) {
      var pm = S.prospects.filter(function (x) { return x.id === d.msg; })[0];
      if (!pm) return;
      var txt = waMessage(pm), num = (pm.contact || "").replace(/[^\d]/g, "");
      if (num.length === 9) num = "34" + num;
      modal('<h2>💬 Mensaje para ' + esc(pm.business_name) + '</h2><p class="muted small">Personaliza la primera frase con algo concreto de su negocio antes de enviarlo.</p>' + promptBox(txt, "wa-msg") +
        (num.length >= 11 ? '<a class="btn btn--wa btn--block" target="_blank" rel="noopener" href="https://wa.me/' + num + '?text=' + encodeURIComponent(txt) + '">Abrir en WhatsApp</a>' : ""));
      return;
    }
    if (d.del) {
      var pd = S.prospects.filter(function (x) { return x.id === d.del; })[0];
      if (pd && confirm("¿Eliminar " + pd.business_name + " de tu lista?")) { S.prospects = S.prospects.filter(function (x) { return x.id !== d.del; }); save(); rerender(); }
      return;
    }
    var a = d.act;
    if (a === "ob-next") { ui.obStep++; viewOnboarding(); }
    else if (a === "ob-back") { ui.obStep = Math.max(0, ui.obStep - 1); viewOnboarding(); }
    else if (a === "ob-finish") { S.onboarded = true; touch(); save(); location.hash = "#/mapa"; route(); }
    else if (a === "copy-all") {
      var v = vals();
      copyText(C.kitWeb.map(function (k, i) { return "### " + (i + 1) + ". " + k.titulo + "\n\n" + k.prompt(v); }).join("\n\n\n"));
    } else if (a === "reset") {
      if (confirm("Se borrará toda tu partida (misiones, clientes e ingresos). ¿Seguro?")) { S = blank(); save(); ui.obStep = 0; location.hash = ""; route(); }
    } else if (a === "export") {
      var blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }), url = URL.createObjectURL(blob), link = document.createElement("a");
      link.href = url; link.download = "iapro-partida.json"; document.body.appendChild(link); link.click(); link.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }
  });

  document.addEventListener("toggle", function (e) {
    if (e.target.matches && e.target.matches("details[data-kp]")) ui.kitOpen[e.target.dataset.kp] = e.target.open;
    if (e.target.matches && e.target.matches("details[data-add]")) ui.addOpen = e.target.open;
  }, true);

  document.addEventListener("input", function (e) {
    var f = e.target.form;
    if (f && f.dataset.form === "kit" && e.target.name) {
      S.negocio[e.target.name] = e.target.value; save();
      clearTimeout(ui.kitT); ui.kitT = setTimeout(refreshKitList, 180);
    }
  });
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.form && t.form.dataset.form === "kit" && t.tagName === "SELECT") { S.negocio[t.name] = t.value; save(); refreshKitList(); }
    if (t.dataset.check) {
      var parts = t.dataset.check.split(":"), n = parts[0];
      S.checks[n] = S.checks[n] || []; S.checks[n][+parts[1]] = t.checked; touch(); save();
    }
    if (t.dataset.status) {
      var p = S.prospects.filter(function (x) { return x.id === t.dataset.status; })[0];
      if (p) { p.status = t.value; p.updated_at = new Date().toISOString(); touch(); save(); rerender(); if (p.status === "won") incomeModal(p.id); }
    }
  });

  document.addEventListener("submit", function (e) {
    var f = e.target, k = f.dataset.form;
    if (!k) return;
    e.preventDefault();
    var fd = new FormData(f), o = {};
    fd.forEach(function (v, key) { o[key] = typeof v === "string" ? v.trim() : v; });
    if (k === "ob-perfil") {
      if (!o.ciudad || o.ciudad.length < 2) return;
      S.perfil.ciudad = o.ciudad; S.perfil.marca = o.marca || S.perfil.marca; save(); ui.obStep = 3; viewOnboarding();
    } else if (k === "perfil") {
      S.perfil.marca = o.marca; S.perfil.zona = o.zona; S.perfil.ciudad = o.ciudad; save(); toast("Guardado"); rerender();
    } else if (k === "prospect") {
      if (!o.business_name) return;
      S.prospects.push({ id: uid(), track: TRACK, business_name: o.business_name, business_type: o.business_type, location: o.location, contact: o.contact, notes: o.notes, status: "todo", updated_at: new Date().toISOString() });
      ui.addOpen = true; ui.filtro = "all"; touch(); save(); toast("Añadido: " + o.business_name); rerender();
      var first = document.querySelector('[data-form="prospect"] input'); if (first) first.focus();
    } else if (k === "income") {
      var amount = Math.round(parseFloat(String(o.amount).replace(",", ".")) * 100) / 100;
      if (!(amount > 0)) { f.querySelector(".err").textContent = "El importe tiene que ser mayor que 0."; return; }
      var prev = money();
      S.ingresos.push({ id: uid(), prospectId: f.dataset.pid, amount: amount, kind: o.kind === "monthly" ? "monthly" : "one_time", description: o.description, created_at: new Date().toISOString() });
      touch(); save(); closeModal(); rerender();
      document.getElementById("money").textContent = eur(prev);
      coins(prev);
    } else if (k === "submit") {
      var m = mission(parseInt(f.dataset.n, 10)), payload = {};
      if (m.proof_type === "text") (m.proof_config.fields || []).forEach(function (fl) { payload[fl.key] = o[fl.key] || ""; });
      if (m.proof_type === "link") payload.url = o.url || "";
      var go = function () {
        var res = submit(m, payload);
        if (!res.ok) { var er = document.getElementById("err"); er.textContent = res.msg; er.classList.remove("shake"); void er.offsetWidth; er.classList.add("shake"); return; }
        if (m.proof_type === "text") { if (payload.marca) S.perfil.marca = payload.marca; if (payload.zona) S.perfil.zona = payload.zona; save(); }
        rerender(); celebrate(res, m);
      };
      if (m.proof_type === "image" && o.image && o.image.size) {
        var rd = new FileReader(); rd.onload = function () { payload.image = rd.result; go(); }; rd.readAsDataURL(o.image);
      } else go();
    }
  });

  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  window.addEventListener("hashchange", route);

  S = load();
  route();
  window.IAPRO_DEBUG = { state: function () { return S; }, submit: submit, vals: vals };
})();
