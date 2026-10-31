/* IAPRO — ruta 7: Dropshipping con IA.
   A diferencia del resto, aquí no se venden servicios a negocios: se venden productos.
   Por eso la ruta no usa el mini-CRM (crm: false), registra ventas con su beneficio
   y su kit se rellena con los datos del producto (kitForm: "producto"). */
(function () {
  "use strict";
  var C = window.IAPRO;
  function L(a) { return a.join("\n"); }

  C.tracks.push({
    slug: "dropshipping", title: "Dropshipping con IA", icon: "📦", color: "#c6f432", marketplace_category: null, is_published: true,
    crm: false, kitForm: "producto",
    description: "Encuentra productos ganadores, monta tu tienda y véndelos con anuncios y vídeos hechos con IA. Necesitarás algo de presupuesto para anuncios.",
    kit: "Kit Dropshipping", kitTitle: "Prompts para vender un producto <span class=\"grad\">que funcione</span>",
    kitIntro: "Rellena los datos de tu producto y sigue el orden: validar → cliente y ángulos → números → página de producto → fotos → vídeos → anuncios → legales → posventa → analizar resultados.",
    muestra: "tienda", msg: ""
  });

  var missions = [
    { number: 1, title: "Elige tu nicho y el nombre de tu tienda", goal: "Decide en qué nicho vas a vender y cómo se llamará tu tienda.",
      proof_type: "text", proof_config: { fields: [{ key: "nicho", label: "Tu nicho", ph: "Ej.: accesorios para mascotas" }, { key: "tienda", label: "Nombre de tu tienda", ph: "Ej.: Patitas Felices" }] },
      xp_reward: 30, badge_slug: "drop-nicho", videos: [{ buscar: "cómo elegir nicho dropshipping España" }],
      steps: [
        { text: "Elige un nicho con pasión de compra, no una tienda de todo: es más fácil crear contenido y que vuelvan a comprarte.",
          prompt: "Quiero empezar en dropshipping vendiendo a España con anuncios y vídeos hechos con IA. Dame 10 nichos con:\n- Por qué la gente compra por impulso o por pasión en ese nicho.\n- Precio de venta típico (busco productos entre 25 y 60 €).\n- Lo fácil que es hacer vídeos virales del producto.\n- Riesgos: devoluciones, tallas, productos frágiles, regulados o con certificaciones (eléctricos, cosmética, juguetes…).\nRecomiéndame 3 para empezar y por qué." },
        { text: "Busca nombre y comprueba que el dominio y el usuario de Instagram/TikTok están libres.",
          prompt: "Mi nicho es {nicho}. Dame 15 nombres de tienda cortos, fáciles de recordar y de escribir, que suenen a marca (no a tienda de chollos), con dominio .com o .es probable y usuario de TikTok. Recomiéndame 3." },
        { text: "Haz cuentas de lo que necesitas: tienda (unos 30–40 €/mes) y presupuesto de anuncios para probar (orientativo: 10–20 € al día por producto durante unos días). No juegues con dinero que no puedas perder." },
        { text: "Escribe tu nicho y el nombre de tu tienda en la pestaña Entregar." }
      ] },
    { number: 2, title: "Encuentra 3 productos ganadores", goal: "Elige 3 productos con potencial y apúntalos.",
      proof_type: "text", proof_config: { fields: [{ key: "producto1", label: "Producto 1", ph: "Ej.: fuente de agua silenciosa para gatos" }, { key: "producto2", label: "Producto 2", ph: "" }, { key: "producto3", label: "Producto 3", ph: "" }] },
      xp_reward: 60, badge_slug: "drop-cazador", videos: [{ buscar: "cómo encontrar productos ganadores dropshipping TikTok" }, { buscar: "TikTok Creative Center productos tendencia" }],
      steps: [
        { text: "Busca productos que ya se están moviendo: TikTok (busca «TikTok made me buy it» y tu nicho), el centro creativo de anuncios de TikTok, la biblioteca de anuncios de Meta, lo más vendido de Amazon y tu proveedor (AliExpress, CJ, AutoDS…)." },
        { text: "Pasa cada candidato por este filtro.",
          prompt: "Evalúa estos productos para dropshipping en España (nicho: {nicho}):\n\n[PEGA: producto, precio de coste + envío, precio al que lo venden otros, enlace o descripción]\n\nPuntúa de 1 a 5 cada uno en: efecto «wow» en vídeo, resuelve un problema claro, margen (vender a 3 veces el coste o más), no se encuentra fácil en tiendas físicas, envío fácil (ligero, no frágil, sin tallas), pocas devoluciones esperadas, riesgos legales o de certificación.\nDame una tabla con la nota total y dime con cuáles 3 me quedo y por qué." },
        { text: "Comprueba la competencia: si hay 50 tiendas con el mismo vídeo, busca otro ángulo o descártalo.",
          prompt: "Para el producto [PRODUCTO], dame 5 ángulos de venta distintos a los típicos (público diferente, problema diferente, uso diferente) para no competir con las tiendas que ya lo anuncian igual." },
        { text: "Apunta tus 3 productos en la pestaña Entregar. El primero será el que pruebes primero." }
      ] },
    { number: 3, title: "Haz los números y elige proveedor", goal: "Ten claro precio, margen, cuánto puedes pagar por venta en anuncios y quién envía.",
      proof_type: "checklist", proof_config: {}, xp_reward: 50, badge_slug: "drop-numeros",
      videos: [{ buscar: "calcular margen y ROAS break even dropshipping" }],
      steps: [
        { text: "Calcula precio de venta, margen y lo máximo que puedes pagar en anuncios por cada venta (prompt «Números del producto» del kit)." },
        { text: "Elige proveedor con envío rápido a España (almacén en la UE si puede ser) y pide una muestra para ver la calidad y hacer tus propios vídeos.",
          prompt: "Voy a vender [PRODUCTO] en España. Dame una lista de comprobación para elegir proveedor de dropshipping: tiempos de envío reales, almacén en la UE, seguimiento, gestión de devoluciones y defectuosos, embalaje sin publicidad, valoraciones, y 10 preguntas que tengo que hacerle antes de empezar." },
        { text: "Infórmate de lo legal antes de vender: alta como autónomo o empresa, IVA (incluido el de importación y el régimen IOSS), derecho de desistimiento de 14 días, garantía legal y seguridad del producto (marcado CE).",
          prompt: "Voy a vender por dropshipping a consumidores en España con una tienda propia. Explícame en lenguaje sencillo qué tengo que tener en cuenta: alta como autónomo o sociedad, IVA de mis ventas, IVA de importación e IOSS si el proveedor envía desde fuera de la UE, derecho de desistimiento de 14 días, garantía legal, productos que necesitan marcado CE o están restringidos, y datos obligatorios en la tienda. Hazme una lista de preguntas para mi gestor." },
        { text: "Decide tu política de envíos y devoluciones (prompt «Políticas legales» del kit)." }
      ] },
    { number: 4, title: "Monta tu tienda", goal: "Publica tu tienda con tu primer producto y pega el enlace.",
      proof_type: "link", proof_config: { label: "Enlace a tu tienda", ph: "https://tu-tienda.com" },
      xp_reward: 80, badge_slug: "drop-tienda", videos: [{ buscar: "crear tienda Shopify dropshipping paso a paso" }, { buscar: "página de producto que convierte Shopify" }],
      steps: [
        { kit: true, text: "Rellena los datos de tu producto en el Kit Dropshipping: todos los prompts se adaptan a él." },
        { text: "Crea la tienda con un tema sencillo y rápido. Mejor una tienda de un producto o de un nicho que una tienda de todo." },
        { text: "Escribe la página de producto y prepara fotos y GIFs (prompts 4 y 5 del kit)." },
        { text: "Configura pagos, envíos, políticas legales y emails automáticos (prompts 8 y 9). Haz un pedido de prueba." },
        { text: "Pega aquí el enlace de tu tienda." }
      ] },
    { number: 5, title: "Publica tus primeros 5 vídeos o anuncios", goal: "Publica 5 vídeos del producto (orgánicos o anuncios) y pega el enlace de uno.",
      proof_type: "link", proof_config: { label: "Enlace a uno de tus vídeos o anuncios", ph: "https://www.tiktok.com/@…" },
      xp_reward: 80, badge_slug: "drop-creador", videos: [{ buscar: "cómo hacer vídeos UGC para dropshipping con el móvil" }, { buscar: "primera campaña TikTok ads dropshipping" }],
      steps: [
        { text: "Escribe 5 guiones con ganchos distintos (prompt «Guiones de vídeo» del kit)." },
        { text: "Grábalos con el móvil usando la muestra del producto (es lo que más funciona) y edítalos con subtítulos." },
        { text: "Publícalos en TikTok/Reels y, si tienes presupuesto, lanza una campaña de prueba con los textos del prompt «Textos de anuncios»." },
        { text: "Pega aquí el enlace de uno de tus vídeos." }
      ] },
    { number: 6, title: "Consigue tu primera venta", goal: "Haz tu primera venta y regístrala con su beneficio.",
      proof_type: "income", proof_config: { min_amount: 0.01, min_sales: 1 }, xp_reward: 150, badge_slug: "drop-primera-venta",
      videos: [{ buscar: "primera venta dropshipping qué hacer" }],
      steps: [
        { text: "Cuando entre un pedido, haz el pedido al proveedor el mismo día y envía al cliente el número de seguimiento." },
        { text: "Calcula el beneficio real de la venta: precio cobrado − coste del producto − envío − comisiones − anuncios gastados para conseguirla." },
        { text: "Registra la venta en la pestaña Ventas con su beneficio." },
        { text: "Prepara la atención al cliente para que no te pille por sorpresa (prompt «Atención al cliente» del kit)." }
      ] },
    { number: 7, title: "Llega a 10 ventas", goal: "Consigue 10 pedidos en total y regístralos.",
      proof_type: "income", proof_config: { min_amount: 0.01, min_sales: 10 }, xp_reward: 200, badge_slug: "drop-10",
      videos: [{ buscar: "cómo analizar campañas de anuncios dropshipping cuándo escalar" }],
      steps: [
        { text: "Revisa tus anuncios cada 2–3 días con el prompt «Analizar resultados» del kit: apaga lo que no da beneficio y sube poco a poco lo que sí." },
        { text: "Prueba nuevos ganchos y ángulos cada semana: los vídeos se gastan." },
        { text: "Sube el valor de cada pedido con packs u ofertas.",
          prompt: "Vendo [PRODUCTO] a [PRECIO] €. Propón 4 formas de subir el importe medio del pedido sin bajar el margen: packs (2x, 3x), producto complementario, envío prioritario, regalo… Con precio sugerido y texto para la página de producto." },
        { text: "Registra cada venta (puedes apuntar varias a la vez con el número de pedidos)." }
      ] },
    { number: 8, title: "Llega a 500 € de beneficio", goal: "Acumula 500 € de beneficio real en esta ruta.",
      proof_type: "income", proof_config: { min_amount: 500 }, xp_reward: 300, badge_slug: "drop-rentable",
      videos: [{ buscar: "cómo escalar una tienda dropshipping rentable" }],
      steps: [
        { text: "Pasa de tienda de un producto a marca: logo, packaging y nombre propio para que te recuerden y vuelvan a comprar.",
          prompt: "Mi tienda {tienda} vende [PRODUCTO] en el nicho {nicho} y ya tiene ventas. Dame un plan para convertirla en marca en 60 días: nombre y logo, packaging personalizado, proveedor con marca propia, email y SMS para repetir compra, reseñas con fotos y 3 productos nuevos del mismo nicho para vender a los mismos clientes." },
        { text: "Monta un sistema de email para clientes que ya compraron (prompt «Emails automáticos» del kit)." },
        { text: "Lleva tus números al día: ventas, devoluciones, gasto en anuncios e impuestos. Lo que cuenta es el beneficio, no la facturación." },
        { text: "Registra tus ventas y su beneficio hasta llegar a 500 €." }
      ] }
  ];
  missions.forEach(function (m) { m.track = "dropshipping"; });
  C.missions.dropshipping = missions;

  C.kits.dropshipping = [
    { id: "validar", fase: "Validar", herramienta: "Claude o ChatGPT", titulo: "Validar el producto", cuando: "Antes de gastar un euro: si suspende, busca otro.",
      prompt: function (v) { return L(["Actúa como experto en dropshipping para el mercado español.", "", "Producto: " + v.producto, "Nicho: " + v.nicho, "Problema que resuelve o deseo que cubre: " + v.problema, "Coste (producto + envío): " + v.coste + " · Precio de venta pensado: " + v.precio, "", "1. Puntúa de 1 a 10: efecto «wow» en vídeo, problema real, margen, saturación, facilidad de envío, riesgo de devoluciones, riesgo legal o de certificación.", "2. Dime con sinceridad si lo probarías o no, y por qué.", "3. Si sí: el público con más probabilidad de comprarlo y el precio recomendado.", "4. Si no: qué producto parecido del mismo nicho probarías en su lugar."]); } },
    { id: "angulos", fase: "Validar", herramienta: "Claude o ChatGPT", titulo: "Cliente ideal y ángulos de venta", cuando: "La base de toda la página y los anuncios.",
      prompt: function (v) { return L(["Para vender " + v.producto + " en " + v.pais + ":", "", "1. 3 perfiles de comprador (" + v.publico + " es mi idea inicial): quién es, qué le duele, qué desea y qué le frena a comprar online.", "2. 8 ángulos de venta distintos (problema, regalo, ahorro de tiempo, estatus, miedo, curiosidad, comparación, antes/después).", "3. Las 6 objeciones más probables y cómo responderlas en la página de producto.", "4. Palabras exactas que usaría el cliente para describir su problema (para usarlas en anuncios)."]); } },
    { id: "numeros", fase: "Validar", herramienta: "Claude o ChatGPT", titulo: "Números del producto", cuando: "Para saber cuánto puedes gastar en anuncios sin perder dinero.",
      prompt: function (v) { return L(["Calcula los números de " + v.producto + " para vender en " + v.pais + ":", "- Coste del producto + envío: " + v.coste, "- Precio de venta: " + v.precio, "- Comisión de la pasarela de pago: [≈ 2–3 %]", "- IVA: explica si mi precio debe incluirlo y cómo afecta al margen", "- Devoluciones esperadas: [5 %]", "", "Dame en una tabla: margen bruto por venta, CPA máximo (lo máximo que puedo pagar en anuncios por venta sin perder), ROAS de equilibrio, y beneficio por venta si pago en anuncios 10, 15 y 20 € por venta.", "Dime si el precio es sano y qué precio o pack recomendarías."]); } },
    { id: "pagina", fase: "Tienda", herramienta: "Claude o ChatGPT", titulo: "Página de producto que vende", cuando: "La pieza más importante de la tienda.",
      prompt: function (v) { return L(["Escribe la página de producto de " + v.producto + " para la tienda " + v.tienda + " (" + v.plataforma + "), en español de España.", "", "Incluye:", "- Título del producto (máx. 60 caracteres) y subtítulo con el beneficio principal.", "- 4 viñetas de beneficios (no características), con emoji.", "- Descripción en bloques cortos: problema → solución → cómo funciona → para quién es.", "- Sección «Lo que dicen los clientes» con huecos [RESEÑA REAL], sin inventar reseñas.", "- Preguntas frecuentes (envío, devoluciones de 14 días, garantía, cómo se usa).", "- Textos de confianza: pago seguro, envío con seguimiento, atención por email.", "- Título SEO y meta description.", "", "Problema que resuelve: " + v.problema + ". Público: " + v.publico + ". No prometas nada que el producto no cumpla ni uses afirmaciones de salud sin pruebas."]); } },
    { id: "fotos", fase: "Tienda", herramienta: "ChatGPT (imágenes), Gemini o Photoroom", titulo: "Fotos y GIFs de producto", cuando: "Usa fotos de tu muestra; la IA para fondos, escenas y retoques.",
      prompt: function (v) { return L(["Necesito las imágenes de la página de producto de " + v.producto + ":", "", "1. Lista de 7 imágenes en orden (portada con fondo limpio, en uso, detalle, comparación antes/después, infografía de beneficios, medidas, contenido del paquete).", "2. Prompts para generar fondos y escenas de ambiente donde colocar la foto real del producto, estilo luminoso y natural, sin texto, sin marcas y sin deformar el producto.", "3. Textos cortos para la infografía (máx. 4 palabras por beneficio).", "4. 3 ideas de GIF corto grabado con el móvil que enseñen el producto funcionando."]); } },
    { id: "videos", fase: "Contenido", herramienta: "Claude o ChatGPT", titulo: "Guiones de vídeo (TikTok / Reels)", cuando: "Para tus vídeos orgánicos y anuncios. Grábalos con la muestra.",
      prompt: function (v) { return L(["Escribe 5 guiones de vídeo de 15–30 segundos estilo UGC (como si lo grabara un cliente) para " + v.producto + ".", "", "Cada uno con un ángulo distinto y:", "- 3 opciones de gancho para los 2 primeros segundos (texto en pantalla + lo que se ve).", "- Plano a plano: qué grabar con el móvil y cuánto dura.", "- Texto en pantalla y voz en off.", "- Llamada a la acción final.", "Público: " + v.publico + ". Problema: " + v.problema + ". Nada de promesas falsas ni antes/después trucados."]); } },
    { id: "anuncios", fase: "Contenido", herramienta: "Claude o ChatGPT", titulo: "Textos de anuncios", cuando: "Para tu primera campaña en TikTok o Meta.",
      prompt: function (v) { return L(["Escribe los textos de anuncios para " + v.producto + " (tienda " + v.tienda + "):", "- 5 textos principales para Meta (Facebook/Instagram): corto, medio y largo, con ángulos distintos.", "- 5 titulares de máx. 40 caracteres.", "- 5 textos para TikTok de máx. 100 caracteres.", "- Una estructura de campaña de prueba sencilla para empezar con poco presupuesto (cuántos anuncios, cuánto al día, cuántos días y qué mirar).", "Cumple las políticas publicitarias: sin afirmaciones de salud, sin «antes y después» engañosos y sin urgencias falsas."]); } },
    { id: "legales", fase: "Tienda", herramienta: "Claude", titulo: "Políticas legales de la tienda", cuando: "Obligatorio para vender a consumidores en España. Que las revise un profesional.",
      prompt: function (v) { return L(["Redacta para la tienda online " + v.tienda + " que vende a consumidores en España: aviso legal, condiciones generales de venta (derecho de desistimiento de 14 días con su formulario y garantía legal), política de envíos con plazos reales ([X–Y] días laborables), política de devoluciones (quién paga el envío de vuelta y a qué dirección), privacidad (RGPD) y cookies.", "Datos del titular como huecos: [nombre o razón social], [NIF], [dirección], [email].", "Lenguaje claro y listo para pegar en " + v.plataforma + ". Recuérdame que lo revise un profesional."]); } },
    { id: "emails", fase: "Tienda", herramienta: "Claude o ChatGPT", titulo: "Emails automáticos", cuando: "Recuperan ventas y evitan quejas por el envío.",
      prompt: function (v) { return L(["Escribe los emails automáticos de " + v.tienda + " (producto: " + v.producto + "):", "1. Carrito abandonado: 3 emails (1 h, 24 h, 72 h).", "2. Pedido confirmado, con el plazo de entrega real explicado con honestidad.", "3. Pedido enviado, con el seguimiento.", "4. 7 días después de la entrega: cómo usarlo bien + petición de reseña con foto.", "5. 30 días después: producto complementario.", "Asunto, preheader y texto de cada uno. Tono cercano y un solo botón."]); } },
    { id: "atencion", fase: "Posventa", herramienta: "Claude o ChatGPT", titulo: "Atención al cliente", cuando: "Respuestas listas para que ningún cliente se enfade.",
      prompt: function (v) { return L(["Crea las respuestas tipo de atención al cliente de " + v.tienda + ":", "1. ¿Dónde está mi pedido? (dentro de plazo y con retraso).", "2. Quiero devolverlo (dentro de los 14 días).", "3. Ha llegado roto o no funciona.", "4. No es lo que esperaba.", "5. Quiero cancelar el pedido.", "6. Petición de factura.", "Amables, claras, que cumplan la ley española de consumo y que eviten disputas con el banco o PayPal."]); } },
    { id: "analizar", fase: "Escalar", herramienta: "Claude o ChatGPT", titulo: "Analizar resultados de anuncios", cuando: "Cada 2–3 días con la campaña activa.",
      prompt: function (v) { return L(["Analiza mi campaña de " + v.producto + ". Mis números:", "- Precio de venta: " + v.precio + " · Coste producto + envío: " + v.coste, "- [PEGA POR ANUNCIO: gasto, impresiones, CTR, clics, CPC, añadidos al carrito, compras, coste por compra]", "", "Dime anuncio por anuncio si apagarlo, mantenerlo o subirle presupuesto, con el motivo. Calcula mi beneficio real del periodo. Si el problema está en la página (muchos clics y pocas ventas), dime qué cambiar en ella. Propón 3 ganchos nuevos para probar."]); } },
    { id: "marca", fase: "Escalar", herramienta: "Claude o ChatGPT", titulo: "De tienda a marca", cuando: "Cuando el producto ya da beneficio.",
      prompt: function (v) { return L(["Mi tienda " + v.tienda + " ya vende " + v.producto + " con beneficio. Dame un plan para convertirla en marca:", "1. Nombre, logo y estilo (3 opciones).", "2. Packaging e inserto con mensaje y código para repetir compra.", "3. 5 productos complementarios del nicho " + v.nicho + ".", "4. Programa de reseñas y de creadores (UGC) con pequeño presupuesto.", "5. Qué números vigilar cada semana."]); } }
  ];

  C.badges = C.badges.concat([
    { slug: "drop-nicho", title: "Con nicho", icon: "🧭" }, { slug: "drop-cazador", title: "Cazaproductos", icon: "🔍" },
    { slug: "drop-numeros", title: "Números claros", icon: "🧮" }, { slug: "drop-tienda", title: "Tienda abierta", icon: "🏪" },
    { slug: "drop-creador", title: "En el feed", icon: "🎥" }, { slug: "drop-primera-venta", title: "Primer pedido", icon: "📦" },
    { slug: "drop-10", title: "10 pedidos", icon: "🚀" }, { slug: "drop-rentable", title: "Rentable", icon: "💎" }
  ]);
})();
