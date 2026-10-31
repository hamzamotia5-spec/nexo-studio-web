/* IAPRO — rutas 2 a 6: misiones, insignias y kits de prompts.
   Se carga después de contenido.js y añade su contenido a window.IAPRO. */
(function () {
  "use strict";
  var C = window.IAPRO;

  /* ------------------------------------------------------------------
     Misiones 4 a 8, comunes a todas las rutas de servicios a negocios
     (prospectar, contactar, reunirse, cobrar y repetir). Se adaptan con o. */
  function ventas(o) {
    return [
      { number: 4, title: "Lista 20 negocios que te necesitan", goal: o.goal4,
        proof_type: "contacts", proof_config: { min_contacts: 20, status: "todo" }, xp_reward: 60, badge_slug: o.b[0],
        videos: [{ buscar: o.video4 }],
        steps: [
          { text: "Busca en Google Maps e Instagram negocios de {zona} con estas señales: " + o.senales + ".",
            prompt: "Vendo " + o.servicio + " a negocios locales de {zona}. Dame:\n1. Los 10 tipos de negocio que más lo necesitan y más fácilmente pagan por ello, y por qué.\n2. 20 búsquedas concretas para Google Maps e Instagram para encontrarlos.\n3. Las señales que me dicen en 1 minuto que un negocio lo necesita (" + o.senales + ").\n4. Las señales de que NO es buen cliente (para no perder el tiempo)." },
          { text: "Prioriza los que ya tienen clientes (buenas reseñas, local lleno) pero lo hacen mal en " + o.area + ": pueden pagarte y notarán la mejora." },
          { text: "Añade cada negocio en Mis clientes con su nombre, tipo, ubicación, contacto y una nota de qué le falta." },
          { text: "Ordena la lista para empezar por los mejores.",
            prompt: "Te paso mi lista de negocios de {zona} con notas de lo que les falta en " + o.area + ":\n\n[PEGA TU LISTA]\n\nOrdénalos de más a menos prometedor para venderles " + o.servicio + " y explícame en una línea por qué. Marca los 5 primeros para contactar esta semana." }
        ] },
      { number: 5, title: "Envía 10 mensajes con algo de valor", goal: "Contacta a 10 negocios enseñándoles " + o.muestra + " y márcalos como «Mensaje enviado».",
        proof_type: "contacts", proof_config: { min_contacts: 10, status: "sent" }, xp_reward: 80, badge_slug: o.b[1],
        videos: [{ buscar: "cómo escribir a clientes por WhatsApp sin parecer spam" }],
        steps: [
          { text: "Prepara para cada negocio " + o.gancho + ". Así no pides nada: das primero.",
            prompt: "Voy a escribir a [NOMBRE DEL NEGOCIO], un [TIPO DE NEGOCIO] de {zona}. Lo que he visto que le falta: [NOTA].\n\nPrepárame " + o.gancho + " para enseñárselo en el primer mensaje. Que sea concreto para su negocio, rápido de hacer y que se note el valor sin explicarlo." },
          { text: "Escribe el mensaje (en Mis clientes tienes el botón «Mensaje» con uno ya preparado).",
            prompt: "Soy {marca} y ofrezco " + o.servicio + " a negocios de {zona}. Escríbeme un primer mensaje de WhatsApp o Instagram de máximo 50 palabras para [NOMBRE DEL NEGOCIO]: cercano, sin precios, que mencione algo concreto de su negocio, que incluya " + o.muestra + " y que termine con una pregunta fácil de contestar. Dame 3 versiones." },
          { text: "Envía como máximo 10–15 al día y personaliza siempre la primera frase." },
          { text: "Marca cada negocio como «Mensaje enviado» en Mis clientes." },
          { text: "Prepara el seguimiento para quien no conteste.",
            prompt: "Escríbeme 2 mensajes de seguimiento para un negocio que no ha contestado a mi primer mensaje sobre " + o.servicio + ": uno para 3 días después y otro para 10 días después. Cortos, amables, que aporten algo nuevo y que no suenen a reproche." }
        ] },
      { number: 6, title: "Consigue tu primera reunión", goal: "Consigue que un negocio acepte una reunión o llamada contigo y márcalo como «Reunión».",
        proof_type: "contacts", proof_config: { min_contacts: 1, status: "meeting" }, xp_reward: 100, badge_slug: o.b[2],
        videos: [{ buscar: "reunión de ventas consultiva preguntas al cliente" }],
        steps: [
          { text: "Cuando alguien responda, propón una cita corta y concreta (15 minutos, en su local o por videollamada).",
            prompt: "Un negocio me ha respondido a mi mensaje sobre " + o.servicio + " con esto:\n\n\"[PEGA SU RESPUESTA]\"\n\nEscríbeme la mejor respuesta para conseguir una reunión de 15 minutos esta semana, proponiendo dos horas concretas." },
          { text: "Prepara el guion de la reunión.",
            prompt: "Tengo una reunión de 15 minutos con el dueño de un negocio ({tipo}) para hablar de " + o.servicio + ". Prepárame un guion: cómo empezar, 6 preguntas para entender " + o.reunion + ", cómo enseñar " + o.muestra + ", cómo presentar el precio y cómo cerrar con un siguiente paso claro." },
          { text: "Marca el negocio como «Reunión» en Mis clientes cuando tengáis fecha." },
          { text: "Después de la reunión, envía un resumen con la propuesta.",
            prompt: "Acabo de reunirme con [NEGOCIO]. Esto es lo que me contó: [NOTAS].\n\nEscribe el mensaje de resumen que le enviaré hoy por WhatsApp, con la propuesta de " + o.servicio + " que mejor le encaja, el precio y un siguiente paso concreto." }
        ] },
      { number: 7, title: "Cierra tu primer cliente", goal: "Cobra tu primer trabajo: márcalo como «Cliente» y registra el ingreso.",
        proof_type: "income", proof_config: { min_amount: 1 }, xp_reward: 200, badge_slug: o.b[3],
        videos: [{ buscar: "cómo cobrar a tu primer cliente autónomo factura" }],
        steps: [
          { text: "Confirma por escrito qué incluye y pide una señal para empezar.",
            prompt: "Mi cliente [NEGOCIO] ha aceptado " + o.servicio + " ([PAQUETE] por [PRECIO]). Escríbeme el mensaje para confirmarlo: qué incluye y qué no, plazos, forma de pago (señal por Bizum o transferencia) y lo que necesito que me envíe: " + o.necesito + "." },
          { text: "Deja el acuerdo por escrito.",
            prompt: "Redacta un acuerdo de servicio sencillo (1 página) entre {marca} y [NEGOCIO] para " + o.servicio + ": qué incluye, qué no, rondas de cambios, plazos, precio y forma de pago, cuota mensual si la hay, propiedad de lo entregado y cómo darse de baja. Lenguaje claro. Recuérdame que lo revise un profesional." },
          { text: "Haz el trabajo real con el kit de esta ruta y entrégalo." },
          { text: "Emite la factura y registra el ingreso desde el cliente en Mis clientes.",
            prompt: "Explícame, para España, qué tiene que llevar la factura de un servicio de " + o.servicio + " hecho por alguien que empieza: datos, IVA, IRPF si aplica y cuándo tengo que darme de alta como autónomo. Dame una plantilla con huecos." }
        ] },
      { number: 8, title: o.m8.title, goal: o.m8.goal,
        proof_type: "income", proof_config: o.m8.proof_config, xp_reward: 300, badge_slug: o.b[4],
        videos: [{ buscar: o.m8.video }],
        steps: o.m8.steps.concat([
          { text: "Pide recomendaciones a tus clientes contentos.",
            prompt: "Escríbeme un mensaje para pedir a un cliente contento de " + o.servicio + " que me recomiende a otros negocios que conozca, con un pequeño incentivo por cada recomendación que se convierta en cliente." },
          { text: o.m8.last }
        ]) }
    ];
  }

  /* ------------------------------------------------------------ Ruta 2: redes */
  var redes = [
    { number: 1, title: "Elige tu nicho y tu zona", goal: "Decide a qué tipo de negocio vas a llevar las redes y en qué zona.",
      proof_type: "text", proof_config: { fields: [{ key: "nicho", label: "Tu nicho (tipo de negocio)", ph: "Ej.: restaurantes y cafeterías" }, { key: "zona", label: "Tu zona de trabajo", ph: "Ej.: Ruzafa, Valencia" }] },
      xp_reward: 30, badge_slug: "redes-nicho", videos: [{ buscar: "community manager para negocios locales cómo empezar" }],
      steps: [
        { text: "Elige un nicho: es más fácil vender y crear contenido si siempre trabajas con el mismo tipo de negocio.",
          prompt: "Quiero ofrecer gestión de redes sociales con IA a negocios locales de {ciudad}. Compárame 6 nichos (restaurantes, peluquerías, clínicas, gimnasios, inmobiliarias, tiendas…): cuánto suelen poder pagar, cuánto contenido necesitan, lo fácil que es conseguir fotos y vídeos, y lo que más les cuesta de las redes. Recomiéndame uno para empezar y por qué." },
        { text: "Prepara tu propio perfil profesional: tus redes son tu escaparate.",
          prompt: "Mi marca es {marca} y llevo las redes de negocios locales. Escríbeme la bio de Instagram (máx. 150 caracteres), 5 destacados con su nombre e icono, y 9 ideas para mis primeras publicaciones que demuestren que sé lo que hago (antes/después, consejos, casos)." },
        { text: "Escribe tu nicho y tu zona en la pestaña Entregar." }
      ] },
    { number: 2, title: "Crea un perfil de muestra con 9 publicaciones", goal: "Diseña 9 publicaciones para un negocio real de tu zona y pega el enlace (Canva, Drive o un perfil de ejemplo).",
      proof_type: "link", proof_config: { label: "Enlace a tus 9 publicaciones", ph: "https://www.canva.com/…" },
      xp_reward: 80, badge_slug: "redes-creador", videos: [{ buscar: "crear contenido para Instagram con ChatGPT y Canva" }, { buscar: "guiones de reels con IA" }],
      steps: [
        { kit: true, text: "Elige el negocio para el que harás la muestra y rellena sus datos en el Kit Redes." },
        { text: "Haz la auditoría, la estrategia y el calendario del mes con los prompts 1 a 3 del kit." },
        { text: "Crea 6 publicaciones y 3 guiones de reel con los prompts del kit. Diseña las imágenes en Canva con tus plantillas." },
        { text: "Monta las 9 piezas en una cuadrícula (Canva o un perfil de prueba) para que se vea el antes y el después." },
        { text: "Comparte el enlace (Canva en modo ver, Google Drive o Instagram) y pégalo aquí." }
      ] },
    { number: 3, title: "Define tu oferta y tus precios", goal: "Ten claros tus paquetes de gestión de redes, sus precios y qué responder a las pegas.",
      proof_type: "checklist", proof_config: {}, xp_reward: 50, badge_slug: "redes-tarifa",
      videos: [{ buscar: "cuánto cobrar por llevar redes sociales a un negocio" }],
      steps: [
        { text: "Crea 3 paquetes mensuales con número de publicaciones, reels y stories.",
          prompt: "Llevo redes sociales con IA a negocios locales de {ciudad} con mi marca {marca}. Diseña 3 paquetes mensuales (Básico, Crecimiento, Total) con: publicaciones, reels y stories al mes, si incluye responder mensajes y comentarios, sesión de fotos o grabación, informe mensual, y precio mensual realista para el mercado español de alguien que empieza. Explica qué paquete debería venderse más." },
        { text: "Define cómo trabajarás: aprobaciones, fotos y límites.",
          prompt: "Escríbeme las reglas de trabajo de mi servicio de redes para dárselas al cliente en una página: cómo me envía fotos y vídeos, cuándo le paso el calendario para aprobar, cuántos cambios incluye, horario de respuesta a mensajes y qué pasa si no me envía material." },
        { text: "Prepara las respuestas a las objeciones típicas.",
          prompt: "Dame respuestas cortas y honestas a estas objeciones sobre contratar a alguien para las redes: \"ya lo hace mi sobrina\", \"las redes no venden\", \"no tengo tiempo de grabar\", \"es caro\", \"ya probé y no funcionó\", \"no quiero salir en vídeo\"." },
        { text: "Prepara tu plantilla de propuesta.",
          prompt: "Crea una plantilla de propuesta de una página para enviar por WhatsApp o PDF a un negocio después de una reunión sobre sus redes: lo que me contó, lo que haría el primer mes, el paquete recomendado con precio, qué necesito de él y el siguiente paso. Firmada por {marca}." }
      ] }
  ].concat(ventas({
    servicio: "gestión de redes sociales", area: "sus redes", muestra: "una muestra de publicaciones hechas para su negocio",
    goal4: "Añade a Mis clientes 20 negocios con las redes abandonadas o mal llevadas.",
    senales: "última publicación hace meses, fotos oscuras o sin texto, sin reels, bio vacía, no responden comentarios",
    video4: "cómo encontrar clientes para community manager",
    gancho: "una publicación o un guion de reel hecho para su negocio",
    reunion: "cómo le llegan los clientes, qué ha probado en redes y cuánto tiempo puede dedicar a grabar",
    necesito: "accesos a las redes, logo, fotos y vídeos, horarios y promociones del mes",
    b: ["redes-radar", "redes-valiente", "redes-cita", "redes-primer-euro", "redes-agencia"],
    m8: { title: "Consigue 3 clientes con cuota mensual", goal: "Ten 3 negocios pagándote cada mes por llevar sus redes.",
      proof_config: { min_amount: 1, min_monthly_clients: 3 }, video: "cómo retener clientes de community manager informe mensual",
      steps: [
        { text: "Envía cada mes un informe corto: alcance, seguidores, mensajes y lo que harás el mes siguiente (prompt «Informe mensual» del kit)." },
        { text: "Ofrece un paquete superior a quien ya esté contento.",
          prompt: "Escríbeme un mensaje para proponer a un cliente de redes contento pasar al paquete superior, con 2 resultados concretos de este mes ([RESULTADOS]) y lo que añadiría. Sin presionar." }
      ], last: "Registra cada cuota como «Cuota mensual» desde el cliente en Mis clientes." }
  }));

  /* --------------------------------------------------- Ruta 3: automatizaciones */
  var auto = [
    { number: 1, title: "Elige qué automatización vas a vender", goal: "Elige un servicio estrella (por ejemplo, un chatbot de WhatsApp que responde y reserva) y tu zona.",
      proof_type: "text", proof_config: { fields: [{ key: "servicio", label: "Tu servicio estrella", ph: "Ej.: chatbot de WhatsApp para reservas" }, { key: "zona", label: "Tu zona de trabajo", ph: "Ej.: Ruzafa, Valencia" }] },
      xp_reward: 30, badge_slug: "auto-idea", videos: [{ buscar: "automatizaciones con IA para pequeños negocios ejemplos" }],
      steps: [
        { text: "Busca la tarea que más horas roba a los negocios de tu zona.",
          prompt: "Quiero vender automatizaciones y chatbots con IA a negocios locales de {ciudad}. Dame 10 automatizaciones que un negocio pequeño pagaría (responder WhatsApp, reservas, recordatorios, pedir reseñas, presupuestos, facturas…). Para cada una: qué negocio la necesita más, horas que ahorra al mes, herramientas sin programar para hacerla y dificultad (1–5). Recomiéndame una para empezar." },
        { text: "Aprende las herramientas básicas: WhatsApp Business, un creador de chatbots sin código y Make, Zapier o n8n.",
          prompt: "Soy principiante. Explícame en lenguaje sencillo la diferencia entre WhatsApp Business, la API de WhatsApp, un creador de chatbots sin código y herramientas como Make, Zapier o n8n. Dime cuáles necesito para mi servicio estrella, su coste aproximado al mes y un plan para aprenderlas en 7 días." },
        { text: "Escribe tu servicio estrella y tu zona en la pestaña Entregar." }
      ] },
    { number: 2, title: "Construye un chatbot de demo", goal: "Crea un asistente de demo para un negocio real de tu zona y pega el enlace para probarlo.",
      proof_type: "link", proof_config: { label: "Enlace a tu chatbot de demo (o a un vídeo enseñándolo)", ph: "https://…" },
      xp_reward: 80, badge_slug: "auto-maker", videos: [{ buscar: "crear chatbot con IA sin programar tutorial" }, { buscar: "chatbot WhatsApp para negocio paso a paso" }],
      steps: [
        { kit: true, text: "Elige el negocio de la demo y rellena sus datos en el Kit Automatización." },
        { text: "Crea la base de conocimiento y las instrucciones del asistente (prompts 2 y 3 del kit)." },
        { text: "Móntalo en una herramienta sin código (un creador de chatbots, un GPT personalizado o un Proyecto de Claude con esas instrucciones)." },
        { text: "Pruébalo con las preguntas difíciles del prompt 5 y corrige lo que falle." },
        { text: "Graba un vídeo corto de pantalla usándolo o comparte el enlace de prueba, y pégalo aquí." }
      ] },
    { number: 3, title: "Define tu oferta y tus precios", goal: "Ten claro cuánto cobras por montarlo, cuánto al mes por mantenerlo y qué responder a las pegas.",
      proof_type: "checklist", proof_config: {}, xp_reward: 50, badge_slug: "auto-precio",
      videos: [{ buscar: "cuánto cobrar por un chatbot a una empresa" }],
      steps: [
        { text: "Calcula precio de instalación y cuota mensual (incluyendo lo que pagas en herramientas).",
          prompt: "Vendo automatizaciones y chatbots con IA a negocios locales con mi marca {marca}. Diseña 3 paquetes (Respuestas automáticas, Reservas y recordatorios, Todo automatizado) con: qué incluye, precio de instalación, cuota mensual y coste aproximado de herramientas que tengo que cubrir. Explícame cómo justificar el precio con las horas que ahorra el cliente." },
        { text: "Prepara la calculadora de ahorro para enseñarla en las reuniones.",
          prompt: "Crea una calculadora sencilla (tabla que pueda copiar en Google Sheets) para enseñar a un negocio cuánto le cuesta hoy responder mensajes y gestionar citas a mano: mensajes al día, minutos por mensaje, coste por hora, citas perdidas al mes y ticket medio. Que dé el ahorro mensual en euros." },
        { text: "Prepara las respuestas a las objeciones.",
          prompt: "Dame respuestas cortas y honestas a estas objeciones sobre poner un chatbot con IA: \"mis clientes quieren hablar con una persona\", \"¿y si dice algo mal?\", \"es caro\", \"no me fío de la IA\", \"¿qué pasa con los datos de mis clientes?\", \"ya contesto yo rápido\"." },
        { text: "Prepara tu plantilla de propuesta.",
          prompt: "Crea una plantilla de propuesta de una página para un negocio después de una reunión de diagnóstico: tareas que le quitan tiempo, lo que automatizaría, ahorro estimado al mes, paquete con precio de instalación y cuota, plazo y siguiente paso. Firmada por {marca}." }
      ] }
  ].concat(ventas({
    servicio: "automatizaciones y chatbots con IA", area: "la atención a sus clientes", muestra: "un vídeo de 30 segundos de tu chatbot de demo",
    goal4: "Añade a Mis clientes 20 negocios que pierden tiempo o clientes por atender mensajes a mano.",
    senales: "tardan horas en contestar, reseñas que dicen «no cogen el teléfono», reservas solo por llamada, muchas preguntas repetidas en Instagram",
    video4: "cómo vender automatizaciones a pequeñas empresas",
    gancho: "un mini-vídeo de un chatbot respondiendo 3 preguntas reales de sus clientes",
    reunion: "qué mensajes recibe cada día, cómo gestiona las citas y qué tarea odia hacer",
    necesito: "preguntas frecuentes, precios, horarios, accesos a WhatsApp Business y a su agenda",
    b: ["auto-radar", "auto-valiente", "auto-cita", "auto-primer-euro", "auto-negocio"],
    m8: { title: "Consigue 3 clientes con mantenimiento mensual", goal: "Ten 3 negocios pagándote cada mes por mantener y mejorar sus automatizaciones.",
      proof_config: { min_amount: 1, min_monthly_clients: 3 }, video: "mantenimiento mensual chatbot clientes",
      steps: [
        { text: "Envía cada mes el informe de horas ahorradas (prompt «Informe de ahorro» del kit)." },
        { text: "Propón una segunda automatización a quien ya esté contento.",
          prompt: "Mi cliente [NEGOCIO] ya usa mi chatbot y ha ahorrado [HORAS] horas este mes. Escríbeme un mensaje para proponerle la siguiente automatización ([IDEA]: recordatorios, pedir reseñas…) con lo que ganaría y el precio. Sin presionar." }
      ], last: "Registra cada cuota como «Cuota mensual» desde el cliente en Mis clientes." }
  }));

  /* ---------------------------------------------------------- Ruta 4: diseño */
  var diseno = [
    { number: 1, title: "Elige tu nicho y tu estilo", goal: "Decide para qué negocios diseñarás y qué estilo te va a diferenciar.",
      proof_type: "text", proof_config: { fields: [{ key: "nicho", label: "Tu nicho", ph: "Ej.: cafeterías y panaderías" }, { key: "zona", label: "Tu zona de trabajo", ph: "Ej.: Ruzafa, Valencia" }] },
      xp_reward: 30, badge_slug: "dis-nicho", videos: [{ buscar: "diseño de logos con IA para clientes" }],
      steps: [
        { text: "Elige nicho y estilo: un portfolio coherente vende más que uno que lo toca todo.",
          prompt: "Quiero ofrecer diseño y branding con IA a negocios locales de {ciudad}. Recomiéndame 5 nichos con mucha necesidad de diseño (cartas, rótulos, etiquetas, redes…) y, para cada uno, 2 estilos visuales que estén funcionando ahora. Dime cuál elegirías para empezar y por qué." },
        { text: "Aprende tu caja de herramientas: un generador de imágenes con IA, Canva y un vectorizador para tener el logo en SVG.",
          prompt: "Soy principiante en diseño. Explícame qué herramientas con IA uso para: generar ideas de logo, convertirlo en vector (SVG), hacer una carta o tarifa, mockups y plantillas de redes. Qué es gratis, qué es de pago y qué cuidar con los derechos de uso para entregárselo a un cliente." },
        { text: "Escribe tu nicho y tu zona en la pestaña Entregar." }
      ] },
    { number: 2, title: "Diseña una identidad de muestra", goal: "Crea la identidad de un negocio real de tu zona (logo, colores y una pieza aplicada) y sube la imagen.",
      proof_type: "image", proof_config: { label: "Imagen de tu identidad de muestra (logo + mockup)" },
      xp_reward: 80, badge_slug: "dis-artista", videos: [{ buscar: "crear identidad de marca con IA paso a paso" }, { buscar: "mockups de logo en Canva" }],
      steps: [
        { kit: true, text: "Elige el negocio de la muestra y rellena sus datos en el Kit Diseño." },
        { text: "Haz el brief y 3 direcciones de logo con los prompts 1 a 4 del kit." },
        { text: "Elige una, vectorízala y crea la paleta y tipografías (prompt 5)." },
        { text: "Aplícala en una pieza real: carta, tarjeta o rótulo, y monta un mockup (prompts 6 y 9)." },
        { text: "Sube aquí una imagen con el logo y el mockup." }
      ] },
    { number: 3, title: "Define tu oferta y tus precios", goal: "Ten claros tus paquetes de diseño, precios, rondas de cambios y respuestas a las pegas.",
      proof_type: "checklist", proof_config: {}, xp_reward: 50, badge_slug: "dis-precio",
      videos: [{ buscar: "cuánto cobrar por un logo y una identidad de marca" }],
      steps: [
        { text: "Crea 3 paquetes: Logo, Identidad y Marca completa.",
          prompt: "Hago diseño y branding con IA para negocios locales de {ciudad} con mi marca {marca}. Diseña 3 paquetes (Logo, Identidad, Marca completa) con: entregables exactos (formatos, piezas, manual), rondas de cambios, plazo y precio realista para el mercado español de alguien que empieza. Añade 3 extras sueltos con precio (carta, rótulo, plantillas de redes)." },
        { text: "Define tu proceso en 5 pasos y las rondas de cambios.",
          prompt: "Escríbeme mi proceso de trabajo de diseño en 5 pasos para enseñarlo al cliente (brief, propuestas, cambios, entrega, archivos), con cuántas rondas de cambios incluye y qué pasa si pide más. Claro y amable." },
        { text: "Prepara las respuestas a las objeciones.",
          prompt: "Dame respuestas cortas y honestas a: \"un logo con IA lo hago yo gratis\", \"es caro para un dibujo\", \"mi primo sabe Photoshop\", \"ya tengo logo\", \"¿el logo será mío?\"." },
        { text: "Prepara tu plantilla de propuesta.",
          prompt: "Crea una plantilla de propuesta de una página para un negocio después de hablar de su imagen: lo que me contó, lo que cambiaría, el paquete recomendado con precio, plazo, qué necesito de él y el siguiente paso. Firmada por {marca}." }
      ] }
  ].concat(ventas({
    servicio: "diseño de marca e imagen", area: "su imagen", muestra: "un rediseño de muestra (antes y después)",
    goal4: "Añade a Mis clientes 20 negocios con una imagen descuidada.",
    senales: "logo pixelado o anticuado, carta fotocopiada, rótulo viejo, cada red con un estilo distinto, sin colores propios",
    video4: "cómo conseguir clientes de diseño gráfico locales",
    gancho: "un antes y después de su logo, su carta o su rótulo",
    reunion: "cómo quiere que le vean, qué piezas usa a diario (carta, tarjetas, redes) y qué no le gusta de su imagen actual",
    necesito: "logo actual, fotos del local, piezas que quiere rediseñar y ejemplos de marcas que le gustan",
    b: ["dis-radar", "dis-valiente", "dis-cita", "dis-primer-euro", "dis-estudio"],
    m8: { title: "Consigue 3 clientes", goal: "Cobra a 3 negocios distintos por tu trabajo de diseño.",
      proof_config: { min_amount: 1, min_clients: 3 }, video: "cómo conseguir clientes recurrentes de diseño",
      steps: [
        { text: "Pide a cada cliente una frase de opinión y fotos de tu diseño aplicado en su local.",
          prompt: "Escríbeme un mensaje para pedir a un cliente de diseño una opinión de 2 frases y una foto de mi trabajo aplicado (carta, rótulo, bolsa…) para mi portfolio." },
        { text: "Ofrece piezas extra o un plan mensual de diseño (redes, carteles de temporada).",
          prompt: "Propón a un cliente de diseño contento un plan mensual de piezas (carteles de temporada, plantillas de redes, promociones) con precio mensual y 3 ejemplos de lo que haría el próximo mes." }
      ], last: "Registra cada cobro desde el cliente en Mis clientes." }
  }));

  /* ------------------------------------------------------ Ruta 5: tienda online */
  var ecommerce = [
    { number: 1, title: "Elige tu nicho y tu plataforma", goal: "Decide a qué comercios montarás tiendas online y con qué plataforma.",
      proof_type: "text", proof_config: { fields: [{ key: "nicho", label: "Tipo de comercio y plataforma", ph: "Ej.: tiendas de ropa con Shopify" }, { key: "zona", label: "Tu zona de trabajo", ph: "Ej.: Ruzafa, Valencia" }] },
      xp_reward: 30, badge_slug: "eco-nicho", videos: [{ buscar: "Shopify vs WooCommerce para pequeño comercio" }],
      steps: [
        { text: "Elige la plataforma que vas a dominar.",
          prompt: "Quiero montar tiendas online a comercios locales de {ciudad}. Compárame Shopify, WooCommerce y otras opciones sencillas para un comercio pequeño: coste al mes, comisiones, facilidad para el dueño, pagos con Bizum y tarjeta, envíos en España y lo que me cuesta aprenderla. Recomiéndame una." },
        { text: "Elige el tipo de comercio con más posibilidades.",
          prompt: "¿Qué tipos de comercio local de {ciudad} venden mejor online y ya tienen clientes en Instagram o WhatsApp? Dame 8 con: ticket medio, facilidad de envío, competencia y por qué les interesa tener tienda propia." },
        { text: "Escribe tu nicho, la plataforma y tu zona en la pestaña Entregar." }
      ] },
    { number: 2, title: "Monta una tienda de muestra", goal: "Crea una tienda de demo con 6 productos para un comercio real de tu zona y pega el enlace.",
      proof_type: "link", proof_config: { label: "Enlace a tu tienda de muestra", ph: "https://…" },
      xp_reward: 80, badge_slug: "eco-tendero", videos: [{ buscar: "crear tienda Shopify paso a paso desde cero" }, { buscar: "fichas de producto con ChatGPT" }],
      steps: [
        { kit: true, text: "Elige el comercio de la muestra y rellena sus datos en el Kit Tienda Online." },
        { text: "Define la estructura y escribe 6 fichas de producto (prompts 1 a 3 del kit)." },
        { text: "Prepara fotos de producto y la portada (prompts 4 y 5)." },
        { text: "Monta la tienda en la plataforma con su periodo de prueba y añade envíos, pagos y políticas (prompts 6 y 7)." },
        { text: "Pega aquí el enlace de la tienda (o de su vista previa)." }
      ] },
    { number: 3, title: "Define tu oferta y tus precios", goal: "Ten claros tus paquetes de tienda online, sus precios y respuestas a las pegas.",
      proof_type: "checklist", proof_config: {}, xp_reward: 50, badge_slug: "eco-precio",
      videos: [{ buscar: "cuánto cobrar por crear una tienda online" }],
      steps: [
        { text: "Crea 3 paquetes: Tienda básica, Tienda completa y Tienda + gestión mensual.",
          prompt: "Monto tiendas online para comercios locales con mi marca {marca}. Diseña 3 paquetes con: número de productos que subo, diseño, pagos y envíos, legales, formación al dueño, precio de creación y cuota mensual de gestión (subir productos, promociones, informe). Incluye lo que el cliente pagará aparte a la plataforma y en comisiones, para ser transparente." },
        { text: "Prepara una explicación de costes totales para el cliente.",
          prompt: "Hazme una tabla clara para un dueño de tienda con todo lo que cuesta tener tienda online el primer año: plataforma, dominio, comisiones de pago, envíos, mi trabajo y mantenimiento. Y cuántas ventas al mes necesita para cubrirlo con un ticket medio de [TICKET] €." },
        { text: "Prepara las respuestas a las objeciones.",
          prompt: "Dame respuestas cortas y honestas a: \"ya vendo por Instagram\", \"Amazon es más fácil\", \"no tengo tiempo de preparar envíos\", \"es caro\", \"¿y si no vendo nada?\"." },
        { text: "Prepara tu plantilla de propuesta.",
          prompt: "Crea una plantilla de propuesta de una página para un comercio después de la reunión: cómo vende hoy, la tienda que le montaría, costes totales, paquete con precio, plazo y siguiente paso. Firmada por {marca}." }
      ] }
  ].concat(ventas({
    servicio: "tiendas online", area: "su venta online", muestra: "una tienda de muestra con sus productos",
    goal4: "Añade a Mis clientes 20 comercios que venden por Instagram o WhatsApp sin tienda propia.",
    senales: "«pedidos por DM» en la bio, catálogo en historias destacadas, precios por privado, envíos a toda España pero sin web",
    video4: "cómo conseguir clientes para crear tiendas online",
    gancho: "una captura de cómo quedaría uno de sus productos en su propia tienda",
    reunion: "cómo vende hoy, cuántos pedidos tiene por redes, cómo cobra y cómo envía",
    necesito: "lista de productos con precios y stock, fotos, logo, condiciones de envío y datos de la empresa",
    b: ["eco-radar", "eco-valiente", "eco-cita", "eco-primer-euro", "eco-imperio"],
    m8: { title: "Consigue 3 clientes con gestión mensual", goal: "Ten 3 tiendas pagándote cada mes por gestionarlas.",
      proof_config: { min_amount: 1, min_monthly_clients: 3 }, video: "gestión mensual de tiendas online para clientes",
      steps: [
        { text: "Envía cada mes el informe de ventas con recomendaciones (prompt «Informe mensual» del kit)." },
        { text: "Prepara campañas para las fechas fuertes del año.",
          prompt: "Hazme un calendario de campañas para la tienda online de un comercio ({tipo}) en España para los próximos 6 meses (rebajas, Día de la Madre, Black Friday, Navidad…), con la idea de promoción y el mensaje para clientes de cada una." }
      ], last: "Registra cada cuota como «Cuota mensual» desde el cliente en Mis clientes." }
  }));

  /* ------------------------------------------------------- Ruta 6: consultoría */
  var consultoria = [
    { number: 1, title: "Elige tu sector y tu zona", goal: "Decide a qué tipo de pymes vas a enseñar a usar la IA y en qué zona.",
      proof_type: "text", proof_config: { fields: [{ key: "nicho", label: "Tu sector", ph: "Ej.: asesorías y despachos" }, { key: "zona", label: "Tu zona de trabajo", ph: "Ej.: Valencia y alrededores" }] },
      xp_reward: 30, badge_slug: "con-sector", videos: [{ buscar: "consultor de inteligencia artificial para pymes cómo empezar" }],
      steps: [
        { text: "Elige un sector: hablarás su idioma y tus casos servirán para el siguiente cliente.",
          prompt: "Quiero ofrecer consultoría de IA a pymes de {ciudad}. Dame 8 sectores donde la IA ahorra más horas (asesorías, inmobiliarias, clínicas, academias, comercios…) con: tareas concretas que se pueden hacer con IA, horas que ahorran al mes, capacidad de pago y lo que les da miedo. Recomiéndame uno." },
        { text: "Domina tu caso estrella: aprende a resolver de principio a fin 3 tareas típicas de ese sector con IA.",
          prompt: "Para el sector que he elegido, dame las 3 tareas que más tiempo les roban y enséñame a resolver cada una con Claude o ChatGPT paso a paso, con el prompt exacto que usaría el empleado." },
        { text: "Escribe tu sector y tu zona en la pestaña Entregar." }
      ] },
    { number: 2, title: "Crea tu taller o guía de muestra", goal: "Prepara una guía o presentación «IA para [sector]» con casos reales y pega el enlace.",
      proof_type: "link", proof_config: { label: "Enlace a tu guía o presentación", ph: "https://…" },
      xp_reward: 80, badge_slug: "con-mentor", videos: [{ buscar: "cómo dar un taller de inteligencia artificial para empresas" }],
      steps: [
        { kit: true, text: "Elige un negocio de ejemplo de tu sector y rellena sus datos en el Kit Consultoría." },
        { text: "Haz el diagnóstico y el mapa de tareas con los prompts 1 y 2 del kit." },
        { text: "Crea la biblioteca de prompts para su equipo y el guion del taller (prompts 4 y 5)." },
        { text: "Monta una presentación o guía (Google Slides, Canva o Notion) con 3 casos antes/después y el ahorro estimado." },
        { text: "Pega aquí el enlace compartido." }
      ] },
    { number: 3, title: "Define tu oferta y tus precios", goal: "Ten claros tu diagnóstico, tu taller y tu acompañamiento mensual, con precios.",
      proof_type: "checklist", proof_config: {}, xp_reward: 50, badge_slug: "con-precio-pro",
      videos: [{ buscar: "cómo poner precio a una consultoría" }],
      steps: [
        { text: "Crea una escalera de oferta: diagnóstico, taller y acompañamiento mensual.",
          prompt: "Ofrezco consultoría de IA a pymes con mi marca {marca}. Diseña una escalera de 3 servicios (Diagnóstico de 2 h, Taller para el equipo, Acompañamiento mensual) con: qué incluye, entregables, duración y precio realista para el mercado español de alguien que empieza. Explícame cómo el diagnóstico lleva al resto." },
        { text: "Prepara cómo medir y enseñar el ahorro.",
          prompt: "Crea una plantilla para medir el antes y el después de una pyme que empieza a usar IA: tareas, minutos antes, minutos después, veces al mes y ahorro en horas y euros. Que pueda copiarla en Google Sheets." },
        { text: "Prepara las respuestas a las objeciones.",
          prompt: "Dame respuestas cortas y honestas a: \"la IA se equivoca\", \"mis empleados no la van a usar\", \"¿y la protección de datos?\", \"ya pagamos ChatGPT\", \"no tenemos tiempo de formarnos\", \"esto es una moda\"." },
        { text: "Prepara tu plantilla de propuesta.",
          prompt: "Crea una plantilla de propuesta de una página para una pyme después del diagnóstico: tareas detectadas, ahorro estimado, plan en 30 días, servicio recomendado con precio y siguiente paso. Firmada por {marca}." }
      ] }
  ].concat(ventas({
    servicio: "consultoría y formación en IA", area: "el uso de la IA", muestra: "tu guía «IA para tu sector» con un caso parecido al suyo",
    goal4: "Añade a Mis clientes 20 pymes de tu sector con tareas repetitivas que la IA puede ahorrar.",
    senales: "equipo de 3 a 50 personas, mucho papeleo o correos, ofertas de empleo administrativas, publican poco por falta de tiempo",
    video4: "cómo conseguir clientes de consultoría para pymes",
    gancho: "un ejemplo de una tarea de su día a día resuelta con IA en 1 minuto",
    reunion: "qué tareas repiten cada semana, quién las hace, cuánto tardan y qué miedo les da la IA",
    necesito: "lista de tareas y procesos, personas que asistirán, herramientas que ya usan y política de datos",
    b: ["con-radar", "con-valiente", "con-cita", "con-primer-euro", "con-socio"],
    m8: { title: "Consigue 3 clientes con acompañamiento mensual", goal: "Ten 3 pymes pagándote cada mes por acompañarlas con la IA.",
      proof_config: { min_amount: 1, min_monthly_clients: 3 }, video: "retener clientes de consultoría mensual",
      steps: [
        { text: "Envía cada mes el informe de ahorro (prompt «Informe de ahorro» del kit)." },
        { text: "Convierte un taller en acompañamiento mensual.",
          prompt: "Escríbeme un mensaje para proponer a una pyme que ya hizo mi taller un acompañamiento mensual: lo que haríamos cada mes, el ahorro que ya ha conseguido ([DATOS]) y el precio. Sin presionar." }
      ], last: "Registra cada cuota como «Cuota mensual» desde el cliente en Mis clientes." }
  }));

  /* -------------------------------------------------------------- Kits por ruta */
  function L(a) { return a.join("\n"); }

  var kitRedes = [
    { id: "auditoria", fase: "Preparar", herramienta: "Claude o ChatGPT", titulo: "Auditoría de sus redes", cuando: "Lo primero: para saber de dónde partes y para enseñárselo al dueño.",
      prompt: function (v) { return L(["Actúa como community manager senior especializado en negocios locales.", "", "Voy a llevar las redes de " + v.negocio + " (" + v.tipo + " en " + v.zona + "). Te paso lo que veo en su Instagram/TikTok:", "[PEGA: bio, nº de seguidores, fecha de la última publicación, tipo de fotos, si hay reels, si responden comentarios]", "", "Hazme una auditoría con nota del 1 al 10 en: perfil y bio, calidad visual, constancia, tipo de contenido, interacción y llamadas a la acción.", "Termina con las 5 mejoras que más impacto tendrían en el primer mes, ordenadas."]); } },
    { id: "estrategia", fase: "Preparar", herramienta: "Claude o ChatGPT", titulo: "Estrategia de contenido", cuando: "Después de la auditoría, en la misma conversación.",
      prompt: function (v) { return L(["Diseña la estrategia de redes de " + v.negocio + ", " + v.tipo + " en " + v.zona + ".", "", "Su cliente: " + v.cliente + ".", "Servicios: " + v.servicios + ".", "Tono: " + v.tono + ".", "", "Dame:", "1. Objetivo del primer trimestre medible (p. ej. mensajes de reserva al mes).", "2. 4 pilares de contenido con su porcentaje (enseñar, mostrar el día a día, prueba social, promoción).", "3. Qué formatos usar y con qué frecuencia (reels, carruseles, stories).", "4. 15 hashtags locales y de nicho, y 5 cuentas locales con las que colaborar o interactuar.", "5. La acción que queremos que haga quien nos vea: " + v.cta + "."]); } },
    { id: "calendario", fase: "Crear", herramienta: "Claude o ChatGPT", titulo: "Calendario del mes", cuando: "Cada mes. Pásaselo al cliente para que lo apruebe antes de publicar.",
      prompt: function (v) { return L(["Crea el calendario de contenido del mes de [MES] para " + v.negocio + " siguiendo la estrategia.", "", "Formato tabla: fecha, red, formato, pilar, idea, texto corto del gancho y material que necesito (foto, vídeo o nada).", "", "Incluye 12 publicaciones y 3 stories por semana. Ten en cuenta fechas especiales del mes en España y en " + v.zonaCorta + " (fiestas locales, temporada, días mundiales que encajen con un " + v.tipoCorto + ").", "Marca con ★ las 3 publicaciones con más potencial."]); } },
    { id: "copys", fase: "Crear", herramienta: "Claude o ChatGPT", titulo: "Textos de las publicaciones", cuando: "Con el calendario aprobado.",
      prompt: function (v) { return L(["Escribe los textos de las publicaciones del calendario para " + v.negocio + ".", "", "Reglas:", "- Primera línea con gancho que haga parar el scroll.", "- Frases cortas, saltos de línea y máximo 2 emojis por texto.", "- Tono: " + v.tono + ".", "- Cada texto acaba con una llamada a la acción clara (" + v.cta + ", guardar, comentar…).", "- Incluye 5–8 hashtags al final.", "- No inventes precios ni promociones: ponlos como [DATO A CONFIRMAR].", "", "Entrégalos numerados igual que el calendario."]); } },
    { id: "reels", fase: "Crear", herramienta: "Claude o ChatGPT", titulo: "Guiones de reels", cuando: "Para los vídeos del mes. Pensados para grabar con el móvil en 10 minutos.",
      prompt: function (v) { return L(["Escribe 5 guiones de reels de 15 a 30 segundos para " + v.negocio + " (" + v.tipo + ").", "", "Para cada uno:", "- Gancho de los 2 primeros segundos (texto en pantalla y lo que se ve).", "- Plano a plano: qué grabar con el móvil, cuántos segundos y desde dónde.", "- Texto en pantalla y voz en off (si hay).", "- Audio recomendado (tipo de música o tendencia).", "- Texto de la publicación.", "", "Ideas a aprovechar: " + v.fotos + ". Que se puedan grabar sin que salga nadie a cámara si el dueño no quiere."]); } },
    { id: "imagenes", fase: "Crear", herramienta: "ChatGPT (imágenes), Gemini o Canva", titulo: "Imágenes y plantillas", cuando: "Para tener un estilo visual reconocible. Mejor fotos reales del negocio; la IA para fondos y plantillas.",
      prompt: function (v) { return L(["Define el estilo visual de las redes de " + v.negocio + " y crea las plantillas.", "", "Estilo: " + v.estilo + ".", "", "1. Paleta de 4 colores HEX y 2 tipografías disponibles en Canva.", "2. 3 plantillas de carrusel y 2 de story (describe la composición para montarlas en Canva).", "3. Prompts para generar 4 imágenes de fondo o de ambiente sin texto ni logos, en formato 4:5, coherentes con ese estilo.", "4. Cómo editar las fotos del móvil del cliente para que todas parezcan de la misma marca (luz, color, encuadre)."]); } },
    { id: "perfil", fase: "Pulir", herramienta: "Claude o ChatGPT", titulo: "Bio, destacados y perfil", cuando: "Una vez, al empezar. Es lo primero que ve un cliente nuevo.",
      prompt: function (v) { return L(["Optimiza el perfil de Instagram de " + v.negocio + ", " + v.tipo + " en " + v.zona + ".", "", "1. Nombre del perfil con palabra clave (para que salga al buscar \"" + v.tipoCorto + " " + v.zonaCorta + "\").", "2. 3 opciones de bio de máximo 150 caracteres con qué es, dónde está y la acción (" + v.cta + ").", "3. 6 historias destacadas con nombre, icono y qué poner en cada una (incluye respuestas a: " + v.dudas + ").", "4. Qué enlace poner y con qué texto.", "5. Mensaje de bienvenida y respuestas rápidas para los mensajes directos."]); } },
    { id: "comunidad", fase: "Pulir", herramienta: "Claude o ChatGPT", titulo: "Responder comentarios, mensajes y reseñas", cuando: "Para responder rápido y con el mismo tono que el negocio.",
      prompt: function (v) { return L(["Crea una guía de respuestas para " + v.negocio + " con tono " + v.tono + ":", "", "1. 10 respuestas a comentarios positivos, sin repetirse.", "2. Respuestas a preguntas frecuentes por mensaje: " + v.dudas + ".", "3. Cómo responder a una queja en público y pasarla a privado.", "4. 5 respuestas a reseñas de Google de 5 estrellas y 2 a reseñas negativas, profesionales y sin discutir.", "5. Cuándo avisar al dueño en lugar de responder yo."]); } },
    { id: "informe", fase: "Medir", herramienta: "Claude o ChatGPT", titulo: "Informe mensual", cuando: "Cada mes. Es lo que hace que el cliente siga pagando.",
      prompt: function (v) { return L(["Escribe el informe mensual de redes para el dueño de " + v.negocio + ". Te paso los datos:", "[PEGA: seguidores inicio y fin, alcance, visitas al perfil, clics en el enlace, mensajes recibidos, mejores 3 publicaciones]", "", "Formato: que quepa en un mensaje de WhatsApp. 3 logros con números, 1 cosa a mejorar y el plan del mes que viene en 3 puntos. Sin jerga: habla de clientes y reservas, no de \"engagement\"."]); } }
  ];

  var kitAuto = [
    { id: "diagnostico", fase: "Diagnosticar", herramienta: "Claude o ChatGPT", titulo: "Qué automatizar primero", cuando: "Antes de montar nada. Te sirve también como guion de la reunión.",
      prompt: function (v) { return L(["Actúa como consultor de automatización para pequeños negocios.", "", "Negocio: " + v.negocio + ", " + v.tipo + " en " + v.zona + ". Servicios: " + v.servicios + ".", "Su cliente: " + v.cliente + ".", "", "1. Lista las 10 tareas repetitivas más probables en este negocio (mensajes, citas, presupuestos, recordatorios, reseñas, facturas…).", "2. Para cada una: tiempo que roba a la semana, si se puede automatizar sin programar y con qué herramienta.", "3. Elige las 3 que más ahorran con menos esfuerzo y explica el orden.", "4. Las 8 preguntas que tengo que hacer al dueño para confirmarlo."]); } },
    { id: "conocimiento", fase: "Construir", herramienta: "Claude o ChatGPT", titulo: "Base de conocimiento del chatbot", cuando: "Lo que el bot necesita saber. Sin esto, se inventa cosas.",
      prompt: function (v) { return L(["Crea la base de conocimiento para el asistente de " + v.negocio + " en formato preguntas y respuestas, clara y sin contradicciones.", "", "Datos que tengo:", "- Tipo: " + v.tipo + " · Dirección: " + v.direccion + " · Zona: " + v.zona, "- Horario: " + v.horario, "- Teléfono/WhatsApp: " + v.telefono, "- Servicios: " + v.servicios, "", "Incluye: servicios con precio y duración ([DATO A CONFIRMAR] si no lo sé), cómo reservar o pedir presupuesto, cancelaciones, formas de pago, cómo llegar y aparcar, y estas dudas frecuentes: " + v.dudas + ".", "", "Al final, lista lo que falta preguntar al dueño."]); } },
    { id: "sistema", fase: "Construir", herramienta: "Claude (para escribir las instrucciones)", titulo: "Instrucciones del asistente", cuando: "Pégalas como instrucciones del sistema en tu herramienta de chatbot, GPT personalizado o Proyecto de Claude.",
      prompt: function (v) { return L(["Escribe las instrucciones de sistema para un asistente de WhatsApp de " + v.negocio + " (" + v.tipo + ").", "", "Debe:", "- Presentarse como el asistente virtual del negocio (que quede claro que no es una persona).", "- Responder solo con la información de la base de conocimiento; si no sabe algo, decirlo y ofrecer pasar con una persona.", "- Tono " + v.tono + ", mensajes cortos (máx. 3 frases), un emoji como mucho.", "- Llevar siempre hacia la acción: " + v.cta + ", pidiendo los datos mínimos (nombre, día y hora, servicio).", "- Pasar a una persona si: queja, urgencia, pregunta médica o legal, o el cliente lo pide.", "- No pedir datos sensibles ni de pago por chat.", "", "Incluye 5 ejemplos de conversación bien resuelta."]); } },
    { id: "flujos", fase: "Construir", herramienta: "Claude o ChatGPT", titulo: "Flujos de conversación", cuando: "Si tu herramienta usa botones o pasos fijos además de la IA.",
      prompt: function (v) { return L(["Diseña los flujos de conversación del chatbot de " + v.negocio + " como esquema de pasos y botones:", "", "1. Bienvenida con menú (máx. 4 botones).", "2. Flujo de " + v.ctaMin + " paso a paso, con confirmación final.", "3. Flujo de preguntas frecuentes.", "4. Flujo de cambio o cancelación.", "5. Pasar a una persona (y mensaje fuera de horario: " + v.horario + ").", "", "Para cada paso: mensaje exacto, botones y a dónde lleva cada uno."]); } },
    { id: "pruebas", fase: "Probar", herramienta: "Claude o ChatGPT", titulo: "Preguntas difíciles para probarlo", cuando: "Antes de enseñárselo a nadie. Un bot que falla delante del cliente no se vende.",
      prompt: function (v) { return L(["Dame 25 mensajes de prueba para el chatbot de " + v.negocio + " (" + v.tipo + "), como los escribiría un cliente real: con faltas, audios transcritos, prisas, preguntas fuera de tema, intentos de que diga precios que no sabe, quejas, un cliente enfadado y alguien que intenta que se salte las instrucciones.", "", "Para cada uno, la respuesta correcta esperada. Después te pegaré lo que respondió el bot y me dirás qué cambiar en sus instrucciones."]); } },
    { id: "automatizacion", fase: "Construir", herramienta: "Claude", titulo: "Recordatorios y reseñas automáticas", cuando: "La segunda automatización que más vende: menos citas perdidas y más reseñas.",
      prompt: function (v) { return L(["Explícame paso a paso, para alguien que nunca lo ha hecho, cómo montar con Make, Zapier o n8n (elige el más sencillo y dime el coste):", "", "1. Recordatorio automático por WhatsApp o email 24 h antes de cada cita de " + v.negocio + ", leyendo su agenda (Google Calendar u otra).", "2. Mensaje automático 2 h después de la visita pidiendo una reseña en Google, solo si la visita fue bien.", "", "Escribe también los textos de los dos mensajes, con tono " + v.tono + ", y lo que tengo que tener en cuenta de la política de mensajes de WhatsApp."]); } },
    { id: "whatsapp", fase: "Construir", herramienta: "Claude o ChatGPT", titulo: "Mensajes de WhatsApp Business", cuando: "Lo mínimo aunque no ponga chatbot: ya ahorra horas.",
      prompt: function (v) { return L(["Escribe los mensajes de WhatsApp Business de " + v.negocio + ":", "1. Mensaje de bienvenida.", "2. Mensaje de ausencia (horario: " + v.horario + ").", "3. 10 respuestas rápidas con su atajo (/precios, /horario, /reservar, /ubicacion…) que respondan a: " + v.dudas + ".", "4. Descripción del perfil de empresa y categorías del catálogo."]); } },
    { id: "datos", fase: "Entregar", herramienta: "Claude", titulo: "Protección de datos del chatbot", cuando: "Obligatorio con clientes reales en España. Que lo revise un profesional.",
      prompt: function (v) { return L(["El chatbot de " + v.negocio + " (España) recoge nombre, teléfono y día de la cita.", "", "1. Escribe el aviso breve de privacidad que debe mostrar al empezar la conversación (RGPD).", "2. Qué datos no debe pedir ni guardar.", "3. Qué tengo que revisar de la herramienta que uso (dónde guarda los datos, encargado del tratamiento).", "4. Qué debe añadir el negocio a su política de privacidad.", "5. Cómo dejar claro al usuario que habla con una IA.", "", "Recuérdame que lo revise un profesional."]); } },
    { id: "manual", fase: "Entregar", herramienta: "Claude o ChatGPT", titulo: "Manual para el cliente", cuando: "Al entregar. Una página que el dueño y su equipo entiendan.",
      prompt: function (v) { return L(["Escribe un manual de una página para el equipo de " + v.negocio + " sobre su nuevo asistente: qué hace solo, qué les llega a ellos y cuándo, cómo responder cuando el bot les pasa una conversación, cómo pedir cambios y a quién llamar si falla. Lenguaje muy sencillo, con viñetas."]); } },
    { id: "ahorro", fase: "Medir", herramienta: "Claude o ChatGPT", titulo: "Informe de ahorro", cuando: "Cada mes. Demuestra lo que vale tu cuota.",
      prompt: function (v) { return L(["Escribe el informe mensual para el dueño de " + v.negocio + " con estos datos:", "[PEGA: conversaciones atendidas, reservas o presupuestos conseguidos, mensajes pasados a una persona, recordatorios enviados, reseñas nuevas]", "", "Calcula las horas ahorradas (2 min por mensaje respondido) y su valor a [COSTE POR HORA] €/h. Que quepa en un WhatsApp: 3 resultados con números, 1 mejora que voy a hacer y 1 idea para el mes que viene."]); } }
  ];

  var kitDiseno = [
    { id: "brief", fase: "Preparar", herramienta: "Claude o ChatGPT", titulo: "Brief de marca", cuando: "Antes de diseñar nada. Úsalo como cuestionario con el cliente.",
      prompt: function (v) { return L(["Actúa como director de arte de un estudio de branding.", "", "Voy a crear la identidad de " + v.negocio + ", " + v.tipo + " en " + v.zona + ". Servicios: " + v.servicios + ". Su cliente: " + v.cliente + ".", "", "1. Escribe el cuestionario de brief (12 preguntas máximo, fáciles de contestar por WhatsApp).", "2. Con lo que ya sabes, propón: 3 valores de marca, personalidad (si fuera una persona…), 3 adjetivos que debe transmitir y 3 que debe evitar.", "3. 3 marcas (de cualquier país) cuyo estilo sirva de referencia y por qué."]); } },
    { id: "naming", fase: "Preparar", herramienta: "Claude o ChatGPT", titulo: "Nombre y eslogan (si hace falta)", cuando: "Solo si el negocio es nuevo o quiere renovar el nombre.",
      prompt: function (v) { return L(["Propón para " + v.negocio + " (" + v.tipo + " en " + v.zona + "):", "1. 10 eslóganes de máximo 6 palabras con tono " + v.tono + ".", "2. Si el nombre actual es difícil de recordar o de escribir, 10 alternativas cortas y explica por qué funcionan.", "No uses frases vacías como \"calidad y servicio\"."]); } },
    { id: "conceptos", fase: "Crear", herramienta: "Claude o ChatGPT", titulo: "3 direcciones de logo", cuando: "Para presentar opciones distintas y que el cliente elija camino.",
      prompt: function (v) { return L(["Con el brief, propón 3 direcciones creativas para el logo de " + v.negocio + ":", "", "Para cada una: concepto en una frase, tipo de logo (tipográfico, símbolo + texto, emblema), símbolo propuesto, tipografía (estilo y 2 ejemplos de Google Fonts), colores HEX y por qué encaja con un " + v.tipoCorto + ".", "Estilo general deseado: " + v.estilo + ".", "Evita clichés del sector (" + v.tipoCorto + ") salvo que se reinterpreten de forma original."]); } },
    { id: "logo-ia", fase: "Crear", herramienta: "ChatGPT (imágenes), Ideogram o Midjourney", titulo: "Generar el logo con IA", cuando: "Genera muchas variantes, elige y luego vectoriza y ajusta la tipografía a mano.",
      prompt: function (v) { return L(["Logotipo minimalista y profesional para \"" + v.negocio + "\", un " + v.tipoCorto + " local en España.", "Concepto: [PEGA LA DIRECCIÓN ELEGIDA].", "Estilo: diseño plano vectorial, " + v.estiloCorto + ", formas simples que se reconozcan a 32 px, máximo 2 colores ([HEX]), fondo blanco liso, centrado, sin sombras, sin degradados, sin mockup y sin texto adicional.", "", "Genera 4 variantes distintas."]); } },
    { id: "sistema", fase: "Crear", herramienta: "Claude o ChatGPT", titulo: "Paleta, tipografías y reglas", cuando: "Con el logo elegido. Es la base del manual de marca.",
      prompt: function (v) { return L(["Crea el sistema visual de " + v.negocio + " a partir del logo elegido ([DESCRÍBELO O ADJÚNTALO]):", "1. Paleta: principal, secundario, acento, fondo y texto en HEX, RGB y CMYK, con su uso y contraste.", "2. Tipografías (Google Fonts) para titulares y texto, con tamaños para carta, redes y web.", "3. Versiones del logo: horizontal, vertical, solo símbolo, en negativo; zona de respeto y tamaño mínimo.", "4. 5 cosas que nunca se deben hacer con el logo."]); } },
    { id: "carta", fase: "Aplicar", herramienta: "Claude + Canva", titulo: "Carta, tarifa o catálogo", cuando: "La pieza que más usa el negocio a diario: aquí se nota tu trabajo.",
      prompt: function (v) { return L(["Diseña la estructura de la carta/tarifa de " + v.negocio + " para montarla en Canva en A4:", "- Orden de las secciones y qué destacar (lo más rentable arriba a la derecha y con recuadro).", "- Cómo escribir cada servicio/producto: nombre, descripción de máx. 12 palabras que apetezca y precio sin €. Servicios: " + v.servicios + ".", "- Jerarquía tipográfica y espacios con el sistema visual de la marca.", "- Versión para pantalla (QR) y versión para imprimir.", "Deja los precios como [PRECIO]."]); } },
    { id: "papeleria", fase: "Aplicar", herramienta: "Claude + Canva", titulo: "Tarjetas, rótulo y flyers", cuando: "Las piezas que el cliente ve fuera del local.",
      prompt: function (v) { return L(["Propón el diseño y los textos de estas piezas para " + v.negocio + ":", "1. Tarjeta de visita (anverso y reverso) con " + v.telefono + " y QR a " + v.cta + ".", "2. Rótulo de fachada: qué poner, tamaño de letra para leerlo desde la acera de enfrente y materiales.", "3. Flyer A5 de presentación con una oferta de bienvenida [OFERTA].", "4. Vinilo para el escaparate con horario (" + v.horario + ") y redes.", "Para cada pieza: medidas, sangrado y formato de archivo para imprenta."]); } },
    { id: "redes", fase: "Aplicar", herramienta: "Claude + Canva", titulo: "Plantillas para redes", cuando: "Para que todo lo que publique el negocio parezca de la misma marca.",
      prompt: function (v) { return L(["Describe 6 plantillas de Instagram para " + v.negocio + " (montarlas en Canva): post de producto/servicio, promoción, opinión de cliente, consejo, story de horario y portada de reel.", "Para cada una: composición, colores y tipografías del sistema, dónde va el logo y el texto de ejemplo."]); } },
    { id: "mockups", fase: "Presentar", herramienta: "ChatGPT (imágenes) o Canva", titulo: "Mockups para presentar", cuando: "Para que el cliente vea su marca aplicada antes de pagar la imprenta.",
      prompt: function (v) { return L(["Fotografía realista de mockup para presentar una marca de " + v.tipoCorto + ": [ELIGE: fachada con rótulo, carta sobre mesa, bolsa de papel, tarjeta de visita, taza, uniforme], estilo " + v.estiloCorto + ", luz natural, ambiente de un local de España.", "Deja la zona del logo lisa y frontal para colocar el logo real después en Canva o Photoshop. Sin texto ni marcas."]); } },
    { id: "presentacion", fase: "Presentar", herramienta: "Claude", titulo: "Presentación y manual de marca", cuando: "Para la entrega final: el cliente se lleva algo que parece de estudio grande.",
      prompt: function (v) { return L(["Escribe el guion de la presentación de la nueva identidad de " + v.negocio + " (8–10 diapositivas) y un manual de marca de 6 páginas:", "- Presentación: el reto, el concepto, el logo, cómo se construye, colores, tipografías, aplicaciones y siguientes pasos.", "- Manual: logo y versiones, usos correctos e incorrectos, colores, tipografías, tono de voz (" + v.tono + ") y ejemplos.", "Textos breves, que se entiendan sin que yo esté delante."]); } }
  ];

  var kitEco = [
    { id: "estrategia", fase: "Preparar", herramienta: "Claude o ChatGPT", titulo: "Estrategia de la tienda", cuando: "Antes de montar nada: qué vender online, a quién y cómo enviarlo.",
      prompt: function (v) { return L(["Actúa como consultor de ecommerce para pequeño comercio en España.", "", "Comercio: " + v.negocio + ", " + v.tipo + " en " + v.zona + ". Productos/servicios: " + v.servicios + ". Su cliente: " + v.cliente + ".", "", "1. Qué productos vender online primero (y cuáles no) y por qué.", "2. A quién: cliente local (recogida en tienda, reparto en " + v.zonaCorta + ") o toda España.", "3. Envíos: opciones, precio para el cliente, envío gratis a partir de cuánto.", "4. Pagos recomendados (tarjeta, Bizum, PayPal) y comisiones aproximadas.", "5. 3 ventajas frente a comprar en Amazon que la tienda debe comunicar."]); } },
    { id: "estructura", fase: "Preparar", herramienta: "Claude o ChatGPT", titulo: "Estructura y categorías", cuando: "Después de la estrategia.",
      prompt: function (v) { return L(["Diseña la estructura de la tienda online de " + v.negocio + ":", "- Menú principal y categorías (máx. 7), con colecciones destacadas.", "- Páginas: inicio, categoría, producto, sobre nosotros, envíos y devoluciones, contacto, preguntas frecuentes.", "- Filtros útiles para este tipo de producto.", "- Qué se ve en la página de inicio en el móvil, en orden.", "- Llamadas a la acción y elementos de confianza (" + v.confianza + ")."]); } },
    { id: "fichas", fase: "Crear", herramienta: "Claude o ChatGPT", titulo: "Fichas de producto", cuando: "Pásale la lista de productos y te devuelve todas las fichas listas para subir.",
      prompt: function (v) { return L(["Escribe las fichas de producto de la tienda de " + v.negocio + ". Te paso la lista:", "[PEGA: nombre, precio, material/ingredientes, tallas o variantes, medidas]", "", "Para cada producto: título claro con palabra clave (máx. 70 caracteres), descripción de 80–120 palabras centrada en beneficios, viñetas con datos prácticos, variantes, título SEO y meta description.", "Tono: " + v.tono + ". No inventes datos técnicos: ponlos como [DATO A CONFIRMAR].", "Si me lo pides, devuélvelo además como CSV con las columnas de importación de Shopify."]); } },
    { id: "fotos", fase: "Crear", herramienta: "ChatGPT (imágenes), Gemini o Photoroom", titulo: "Fotos de producto", cuando: "Fotos con el móvil + IA para fondos y escenas. Siempre el producto real.",
      prompt: function (v) { return L(["Tengo fotos hechas con el móvil de productos de " + v.negocio + ". Explícame:", "1. Cómo hacer fotos de producto decentes en casa (luz, fondo, ángulos: frontal, detalle, en uso, escala).", "2. Cómo quitar y cambiar el fondo con IA manteniendo el producto real sin deformarlo.", "3. 4 prompts para generar escenas de ambiente (lifestyle) donde colocar el producto, estilo " + v.estiloCorto + ", sin texto ni marcas.", "4. Tamaño y formato ideal para la tienda (cuadrado, peso, nombre de archivo para SEO)."]); } },
    { id: "inicio", fase: "Crear", herramienta: "Claude o ChatGPT", titulo: "Textos de la página de inicio", cuando: "Con la estructura y las fichas hechas.",
      prompt: function (v) { return L(["Escribe los textos de la página de inicio de la tienda online de " + v.negocio + ":", "- Barra de anuncio superior (envío gratis desde X, recogida en tienda en " + v.zonaCorta + ").", "- Portada: título de máx. 8 palabras, subtítulo y botón.", "- Textos de 3 colecciones destacadas.", "- Bloque «Quiénes somos» corto con la historia del comercio.", "- 4 garantías (envío, devoluciones, pago seguro, atención por WhatsApp " + v.telefono + ").", "- Preguntas frecuentes: " + v.dudas + ".", "Tono: " + v.tono + "."]); } },
    { id: "legales", fase: "Configurar", herramienta: "Claude", titulo: "Políticas legales de la tienda", cuando: "Obligatorio en España para vender online. Que lo revise un profesional.",
      prompt: function (v) { return L(["Redacta para la tienda online de " + v.negocio + " (España): aviso legal, condiciones generales de venta (con derecho de desistimiento de 14 días y garantía legal), política de envíos, política de devoluciones, privacidad (RGPD) y cookies.", "Datos del titular como huecos: [razón social], [NIF], [dirección: " + v.direccion + "], [email], teléfono " + v.telefono + ".", "Lenguaje claro y listo para pegar en las páginas de la plataforma. Recuérdame que lo revise un profesional."]); } },
    { id: "configurar", fase: "Configurar", herramienta: "Claude", titulo: "Configurarla paso a paso", cuando: "Mientras montas la tienda, para no dejarte nada.",
      prompt: function (v) { return L(["Guíame paso a paso para dejar lista la tienda de " + v.negocio + " en [PLATAFORMA]:", "1. Datos de la tienda, moneda e impuestos (IVA en España; dime qué consultar si vende a Canarias o fuera de España).", "2. Pagos: tarjeta, Bizum y PayPal.", "3. Envíos: zonas, tarifas, recogida en tienda en " + v.zonaCorta + ".", "4. Dominio y correo.", "5. Emails de pedido en español.", "6. Checklist de pruebas antes de abrir: pedido de prueba, móvil, velocidad, políticas visibles."]); } },
    { id: "emails", fase: "Vender", herramienta: "Claude o ChatGPT", titulo: "Emails automáticos", cuando: "Recuperan ventas solos: bienvenida y carrito abandonado.",
      prompt: function (v) { return L(["Escribe los emails automáticos de la tienda de " + v.negocio + " con tono " + v.tono + ":", "1. Bienvenida al suscribirse (con código de descuento [CÓDIGO]).", "2. Carrito abandonado: 3 emails (1 h, 24 h, 72 h).", "3. Pedido confirmado y pedido enviado.", "4. Petición de opinión 7 días después de la entrega.", "Asunto, preheader y texto de cada uno. Cortos y con un único botón."]); } },
    { id: "lanzamiento", fase: "Vender", herramienta: "Claude o ChatGPT", titulo: "Lanzamiento de la tienda", cuando: "Para que la primera semana ya haya ventas.",
      prompt: function (v) { return L(["Prepara el lanzamiento de la tienda online de " + v.negocio + ":", "1. Mensaje de WhatsApp para enviar a los clientes actuales.", "2. 3 publicaciones y 5 stories para Instagram.", "3. Cartel para el mostrador con QR.", "4. Oferta de lanzamiento razonable para un " + v.tipoCorto + ".", "5. Qué hacer la primera semana para conseguir las primeras 10 ventas."]); } },
    { id: "informe", fase: "Medir", herramienta: "Claude o ChatGPT", titulo: "Informe mensual", cuando: "Cada mes, para tus clientes de gestión.",
      prompt: function (v) { return L(["Escribe el informe mensual de la tienda de " + v.negocio + " para el dueño con estos datos:", "[PEGA: visitas, pedidos, ventas, ticket medio, tasa de conversión, productos más vendidos, carritos recuperados]", "", "Que quepa en un WhatsApp: 3 resultados con números, qué ha funcionado, 1 problema y 3 acciones para el mes que viene."]); } }
  ];

  var kitCons = [
    { id: "entrevista", fase: "Diagnosticar", herramienta: "Claude o ChatGPT", titulo: "Entrevista de diagnóstico", cuando: "Para la primera reunión con la pyme.",
      prompt: function (v) { return L(["Actúa como consultor de IA para pymes.", "", "Voy a hacer un diagnóstico a " + v.negocio + ", " + v.tipo + " en " + v.zona + ". Servicios: " + v.servicios + ".", "", "Prepárame una entrevista de 30 minutos: 15 preguntas para descubrir qué tareas repiten, cuánto tardan, quién las hace, qué herramientas usan, qué datos manejan y qué miedo tienen a la IA. Ordénalas de lo general a lo concreto y dime qué respuesta indica una gran oportunidad."]); } },
    { id: "mapa", fase: "Diagnosticar", herramienta: "Claude o ChatGPT", titulo: "Mapa de tareas y ahorro", cuando: "Con las respuestas de la entrevista.",
      prompt: function (v) { return L(["Con estas respuestas de la entrevista de " + v.negocio + ":", "[PEGA TUS NOTAS]", "", "Haz una tabla: tarea, quién la hace, minutos por vez, veces al mes, si la IA la puede hacer (sí/parcial/no), herramienta, minutos con IA y ahorro mensual en horas.", "Ordénala por ahorro y marca las 3 victorias rápidas para las primeras 2 semanas. Señala riesgos (datos personales, errores) de cada una."]); } },
    { id: "plan", fase: "Planificar", herramienta: "Claude o ChatGPT", titulo: "Plan de 30 días", cuando: "Lo que entregas tras el diagnóstico.",
      prompt: function (v) { return L(["Crea un plan de 30 días para que " + v.negocio + " empiece a usar IA, semana a semana:", "- Semana 1: cuentas, reglas de uso y primera victoria rápida.", "- Semana 2: taller con el equipo.", "- Semana 3: segunda y tercera tarea.", "- Semana 4: medir el ahorro y decidir siguientes pasos.", "Para cada semana: tareas, responsable, tiempo que necesitan y cómo sabremos que ha funcionado."]); } },
    { id: "biblioteca", fase: "Formar", herramienta: "Claude o ChatGPT", titulo: "Biblioteca de prompts para su equipo", cuando: "El entregable que más usan: prompts listos para su día a día.",
      prompt: function (v) { return L(["Crea una biblioteca de 12 prompts listos para copiar para el equipo de " + v.negocio + " (" + v.tipo + "), uno por tarea frecuente del sector: responder correos y reseñas, redactar presupuestos, resumir documentos, preparar publicaciones, atender dudas como " + v.dudas + "…", "", "Para cada uno: nombre de la tarea, cuándo usarlo, el prompt con [HUECOS] claros, y un consejo para revisar el resultado.", "Tono de la empresa: " + v.tono + ". Recuerda no pegar datos personales de clientes."]); } },
    { id: "taller", fase: "Formar", herramienta: "Claude o ChatGPT", titulo: "Guion del taller", cuando: "Para formar al equipo en 2 horas, con práctica.",
      prompt: function (v) { return L(["Diseña un taller práctico de 2 horas sobre IA para el equipo de " + v.negocio + " (personas no técnicas):", "- Agenda con tiempos.", "- 15 min de qué es y qué no es la IA, sin tecnicismos.", "- 3 ejercicios prácticos con sus tareas reales (usa la biblioteca de prompts).", "- Errores típicos y cómo revisar lo que escribe la IA.", "- Reglas de uso de datos.", "- Mini-reto para la semana siguiente.", "Incluye el texto de las diapositivas."]); } },
    { id: "politica", fase: "Formar", herramienta: "Claude", titulo: "Guía de uso responsable", cuando: "Obligatorio para que la empresa use IA con tranquilidad. Que la revise un profesional.",
      prompt: function (v) { return L(["Redacta una guía de uso de IA de 1–2 páginas para el equipo de " + v.negocio + " (España):", "- Qué herramientas están permitidas y con qué cuenta.", "- Qué datos nunca se pegan (datos personales de clientes, salud, contraseñas…) y cómo anonimizar.", "- Revisión humana obligatoria antes de enviar algo a un cliente.", "- Transparencia: cuándo avisar de que se ha usado IA.", "- Obligaciones básicas del RGPD y del Reglamento europeo de IA que les afecten, en lenguaje claro.", "Recuérdame que la revise un profesional."]); } },
    { id: "ahorro", fase: "Medir", herramienta: "Claude o ChatGPT", titulo: "Informe de ahorro", cuando: "Cada mes del acompañamiento.",
      prompt: function (v) { return L(["Escribe el informe mensual de " + v.negocio + " sobre su uso de IA con estos datos:", "[PEGA: tareas, minutos antes y después, veces al mes, personas que la usan, incidencias]", "", "Calcula las horas y euros ahorrados a [COSTE POR HORA] €/h. Formato corto: 3 logros con números, lo que no ha funcionado y 3 próximos pasos."]); } },
    { id: "acompanamiento", fase: "Vender", herramienta: "Claude o ChatGPT", titulo: "Propuesta de acompañamiento mensual", cuando: "Al terminar el plan de 30 días.",
      prompt: function (v) { return L(["Escribe la propuesta de acompañamiento mensual para " + v.negocio + " tras el plan de 30 días: resultados conseguidos ([DATOS]), qué haríamos cada mes (nuevas tareas, dudas del equipo, revisiones, novedades de herramientas), horas incluidas, precio mensual [PRECIO] y condiciones de baja. Firmada por " + v.marca + ". Clara y sin presionar."]); } }
  ];

  /* ------------------------------------------------------------- Registro */
  C.tracks.forEach(function (t) { t.is_published = true; });
  var extra = {
    "webs-locales": { kit: "Kit Web Pro", kitTitle: "Prompts para una web <span class=\"grad\">profesional</span>", kitIntro: "Elige el negocio, rellena lo que sepas y copia cada prompt en Claude o ChatGPT en este orden: estrategia → textos → diseño → web → revisión → SEO → legales → publicar.", muestra: "web de muestra", msg: "no he encontrado vuestra web, así que os he preparado un ejemplo de cómo podría ser" },
    redes: { kit: "Kit Redes", kitTitle: "Prompts para llevar unas redes <span class=\"grad\">que venden</span>", kitIntro: "Elige el negocio y copia los prompts en orden: auditoría → estrategia → calendario → textos → reels → imágenes → perfil → comunidad → informe.", muestra: "muestra de publicaciones", msg: "me he fijado en vuestro Instagram y os he preparado unas publicaciones de ejemplo de cómo podría ser" },
    automatizacion: { kit: "Kit Automatización", kitTitle: "Prompts para un chatbot <span class=\"grad\">que trabaja solo</span>", kitIntro: "Elige el negocio y sigue el orden: diagnóstico → base de conocimiento → instrucciones → flujos → pruebas → recordatorios → entrega → informe.", muestra: "chatbot de demo", msg: "seguro que recibís muchas preguntas por mensaje, así que os he preparado un asistente de prueba que las responde solo" },
    diseno: { kit: "Kit Diseño", kitTitle: "Prompts para una marca <span class=\"grad\">con identidad</span>", kitIntro: "Elige el negocio y sigue el orden: brief → logo → sistema visual → carta y papelería → redes → mockups → presentación.", muestra: "rediseño de muestra", msg: "me ha encantado vuestro local y os he preparado una propuesta de cómo podría verse vuestra imagen" },
    ecommerce: { kit: "Kit Tienda Online", kitTitle: "Prompts para una tienda online <span class=\"grad\">que vende</span>", kitIntro: "Elige el comercio y sigue el orden: estrategia → estructura → fichas → fotos → inicio → legales → configuración → emails → lanzamiento.", muestra: "tienda de muestra", msg: "me he fijado en que vendéis por Instagram y os he preparado un ejemplo de cómo quedaría vuestra propia tienda online" },
    consultoria: { kit: "Kit Consultoría", kitTitle: "Prompts para meter la IA <span class=\"grad\">en una pyme</span>", kitIntro: "Elige el negocio y sigue el orden: entrevista → mapa de ahorro → plan de 30 días → biblioteca de prompts → taller → guía de uso → informe.", muestra: "guía de IA para vuestro sector", msg: "he preparado una guía con tareas de vuestro sector que se pueden hacer en minutos con IA" }
  };
  C.tracks.forEach(function (t) { var e = extra[t.slug]; Object.keys(e).forEach(function (k) { t[k] = e[k]; }); });

  C.kits = { "webs-locales": C.kitWeb, redes: kitRedes, automatizacion: kitAuto, diseno: kitDiseno, ecommerce: kitEco, consultoria: kitCons };
  C.missions.redes = redes;
  C.missions.automatizacion = auto;
  C.missions.diseno = diseno;
  C.missions.ecommerce = ecommerce;
  C.missions.consultoria = consultoria;

  C.badges = C.badges.concat([
    { slug: "redes-nicho", title: "Con nicho", icon: "🎯" }, { slug: "redes-creador", title: "Creador", icon: "🎬" }, { slug: "redes-tarifa", title: "Tarifa clara", icon: "📋" },
    { slug: "redes-radar", title: "Radar social", icon: "🔎" }, { slug: "redes-valiente", title: "Primer DM", icon: "💌" }, { slug: "redes-cita", title: "Café de negocios", icon: "☕" },
    { slug: "redes-primer-euro", title: "Primer like pagado", icon: "💸" }, { slug: "redes-agencia", title: "Agencia", icon: "👑" },
    { slug: "auto-idea", title: "Con idea", icon: "💡" }, { slug: "auto-maker", title: "Automatizador", icon: "⚙️" }, { slug: "auto-precio", title: "Calculadora", icon: "🧮" },
    { slug: "auto-radar", title: "Detector", icon: "📡" }, { slug: "auto-valiente", title: "Demo enviada", icon: "📨" }, { slug: "auto-cita", title: "Diagnóstico", icon: "🧩" },
    { slug: "auto-primer-euro", title: "Primer bot vendido", icon: "💶" }, { slug: "auto-negocio", title: "Fábrica de bots", icon: "🤖" },
    { slug: "dis-nicho", title: "Con estilo", icon: "🖌️" }, { slug: "dis-artista", title: "Artista", icon: "🎨" }, { slug: "dis-precio", title: "Presupuesto", icon: "🧾" },
    { slug: "dis-radar", title: "Ojo de diseñador", icon: "👁️" }, { slug: "dis-valiente", title: "Antes y después", icon: "🔁" }, { slug: "dis-cita", title: "Brief", icon: "📝" },
    { slug: "dis-primer-euro", title: "Primer encargo", icon: "💶" }, { slug: "dis-estudio", title: "Estudio", icon: "🏆" },
    { slug: "eco-nicho", title: "Plataforma elegida", icon: "🧱" }, { slug: "eco-tendero", title: "Tendero", icon: "🛒" }, { slug: "eco-precio", title: "Cuentas claras", icon: "📊" },
    { slug: "eco-radar", title: "Cazatiendas", icon: "🔎" }, { slug: "eco-valiente", title: "Primer contacto", icon: "📦" }, { slug: "eco-cita", title: "Reunión", icon: "🤝" },
    { slug: "eco-primer-euro", title: "Primera venta", icon: "💶" }, { slug: "eco-imperio", title: "Imperio online", icon: "🏬" },
    { slug: "con-sector", title: "Especialista", icon: "🧠" }, { slug: "con-mentor", title: "Mentor", icon: "🎓" }, { slug: "con-precio-pro", title: "Escalera de valor", icon: "🪜" },
    { slug: "con-radar", title: "Analista", icon: "🔬" }, { slug: "con-valiente", title: "Primer contacto", icon: "📬" }, { slug: "con-cita", title: "Diagnóstico", icon: "🩺" },
    { slug: "con-primer-euro", title: "Primer cliente", icon: "💶" }, { slug: "con-socio", title: "Socio de confianza", icon: "🤝" }
  ]);
})();
