/* IAPRO — contenido del juego (rutas, misiones, insignias, tipos de negocio y kit de prompts).
   Este archivo es la fuente que luego se pasará a supabase/seed.sql en la versión con backend.
   Los textos entre {llaves} se rellenan con los datos del jugador y del negocio elegido. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ Rutas */
  var tracks = [
    { slug: "webs-locales", title: "Webs para negocios locales", icon: "🌐", color: "#19c8ff", marketplace_category: "webs", is_published: true,
      description: "Crea webs con IA para bares, peluquerías, clínicas y talleres de tu zona, y cobra por hacerlas y mantenerlas." },
    { slug: "redes", title: "Contenido y gestión de redes", icon: "📱", color: "#ff5ea8", marketplace_category: "redes", is_published: false,
      description: "Lleva el Instagram y el TikTok de negocios locales con contenido hecho con IA." },
    { slug: "automatizacion", title: "Automatizaciones y chatbots", icon: "🤖", color: "#7c5cff", marketplace_category: "automatizacion", is_published: false,
      description: "Chatbots de WhatsApp, reservas automáticas y tareas que se hacen solas." },
    { slug: "diseno", title: "Diseño y branding con IA", icon: "🎨", color: "#ffb020", marketplace_category: "diseno", is_published: false,
      description: "Logos, cartas, carteles y la imagen de marca completa de un negocio." },
    { slug: "ecommerce", title: "Tienda online", icon: "🛒", color: "#22d39a", marketplace_category: "ecommerce", is_published: false,
      description: "Monta y gestiona tiendas online para comercios de tu zona." },
    { slug: "consultoria", title: "Consultoría de IA para pymes", icon: "🧠", color: "#ff7a45", marketplace_category: "consultoria", is_published: false,
      description: "Enseña a pequeñas empresas a ahorrar horas con IA." }
  ];

  /* --------------------------------------------------------------- Insignias */
  var badges = [
    { slug: "fundador", title: "Fundador", icon: "🏁" },
    { slug: "constructor", title: "Constructor", icon: "🏗️" },
    { slug: "con-precio", title: "Con precio", icon: "🏷️" },
    { slug: "explorador", title: "Explorador", icon: "🧭" },
    { slug: "valiente", title: "Valiente", icon: "📣" },
    { slug: "primera-cita", title: "Primera cita", icon: "🤝" },
    { slug: "primer-euro", title: "Primer euro", icon: "💶" },
    { slug: "negocio-real", title: "Negocio real", icon: "🏆" }
  ];

  var ranks = [
    { min: 0, title: "Novato" },
    { min: 200, title: "Aprendiz" },
    { min: 600, title: "Emprendedor" },
    { min: 1500, title: "Pro" },
    { min: 3000, title: "Leyenda" }
  ];

  /* ------------------------------------------------- Tipos de negocio (cliente) */
  var negocios = [
    { id: "restaurante", label: "Restaurante o bar", emoji: "🍽️", schema: "Restaurant", cta: "Reservar mesa",
      servicios: "menú del día, carta de temporada, reservas para grupos y comida para llevar",
      secciones: "portada con el plato estrella y botón de reservar; carta con precios fácil de actualizar; menú del día; reservas por WhatsApp o teléfono; galería del local y los platos; reseñas; horario, mapa y cómo llegar; preguntas frecuentes",
      cliente: "vecinos y gente que trabaja cerca buscando dónde comer hoy, grupos y familias que buscan sitio para celebrar, y turistas que miran Google Maps",
      dudas: "¿hay que reservar?, ¿tenéis menú del día y a qué precio?, ¿hay opciones vegetarianas o sin gluten?, ¿se puede ir con niños?, ¿hacéis comida para llevar?, ¿tenéis terraza?",
      confianza: "fotos reales de los platos, reseñas de Google, años abiertos, producto local y alérgenos indicados",
      fotos: "platos de la carta bien emplatados, el interior del local con luz cálida, la terraza y el equipo en cocina" },
    { id: "cafeteria", label: "Cafetería o panadería", emoji: "🥐", schema: "CafeOrCoffeeShop", cta: "Hacer un encargo",
      servicios: "desayunos, café de especialidad, bollería y pan del día, y tartas por encargo",
      secciones: "portada con foto del mostrador y botón de encargos; desayunos y meriendas con precios; productos del día; tartas por encargo; sobre nosotros (obrador y origen del producto); reseñas; horario y mapa; preguntas frecuentes",
      cliente: "vecinos que desayunan cerca de casa o del trabajo, gente que busca una tarta para un cumpleaños y teletrabajadores que buscan un sitio tranquilo",
      dudas: "¿con cuánta antelación se encarga una tarta?, ¿tenéis opciones sin gluten o veganas?, ¿hay wifi y enchufes?, ¿abrís los domingos?, ¿hacéis pedidos para empresas?",
      confianza: "elaboración propia, fotos del obrador, ingredientes de proveedores locales y reseñas",
      fotos: "café latte art sobre mesa de madera, bollería recién hecha en el mostrador, tarta de cumpleaños artesana y el local por la mañana" },
    { id: "peluqueria", label: "Peluquería o barbería", emoji: "💇", schema: "HairSalon", cta: "Pedir cita",
      servicios: "corte de mujer y hombre, color y mechas, tratamientos capilares y peinados para eventos",
      secciones: "portada con foto de un trabajo real y botón de pedir cita; servicios con precio orientativo; antes y después; el equipo; productos que usáis; reseñas; horario y mapa; preguntas frecuentes",
      cliente: "personas del barrio que buscan peluquería de confianza, novias e invitadas a eventos, y clientes nuevos que comparan por fotos y reseñas",
      dudas: "¿cuánto cuesta un corte o unas mechas?, ¿cuánto dura el servicio?, ¿se puede pedir cita por WhatsApp?, ¿qué pasa si llego tarde o cancelo?, ¿hacéis pruebas de peinado?",
      confianza: "fotos reales de trabajos, nombres y especialidad del equipo, marcas profesionales que usáis y reseñas",
      fotos: "melena con mechas balayage desde atrás, sillón de peluquería con espejo y luz natural, manos de estilista cortando y detalle de productos" },
    { id: "estetica", label: "Centro de estética o uñas", emoji: "💅", schema: "BeautySalon", cta: "Reservar tratamiento",
      servicios: "manicura y pedicura, tratamientos faciales, depilación y masajes",
      secciones: "portada con botón de reservar; tratamientos con precio y duración; bonos y promociones; antes y después; el centro y la higiene; reseñas; horario y mapa; preguntas frecuentes",
      cliente: "mujeres y hombres de la zona que buscan un centro de confianza, personas que quieren regalar un tratamiento y clientes que comparan precios",
      dudas: "¿cuánto dura cada tratamiento?, ¿tenéis bonos?, ¿se puede regalar?, ¿cómo se cancela una cita?, ¿qué productos usáis?, ¿es apto para piel sensible?",
      confianza: "titulación del equipo, protocolos de higiene, marcas profesionales, fotos reales y reseñas",
      fotos: "manicura en tonos nude sobre fondo claro, cabina de tratamiento facial ordenada, toallas y productos naturales y sala de espera acogedora" },
    { id: "dental", label: "Clínica dental", emoji: "🦷", schema: "Dentist", cta: "Pedir primera visita",
      servicios: "revisión e higiene, ortodoncia invisible, implantes y estética dental",
      secciones: "portada con mensaje de confianza y botón de pedir visita; tratamientos explicados sin tecnicismos; financiación; el equipo con número de colegiado; la clínica y su tecnología; testimonios; urgencias; horario y mapa; preguntas frecuentes",
      cliente: "familias del barrio, adultos con miedo al dentista que buscan trato cercano y personas que comparan precios de ortodoncia o implantes",
      dudas: "¿la primera visita es gratis?, ¿se puede financiar?, ¿atendéis urgencias?, ¿cuánto dura una ortodoncia invisible?, ¿trabajáis con mutuas?, ¿duele?",
      confianza: "equipo colegiado con nombre y foto, años de experiencia, tecnología, opiniones verificadas y precios claros",
      fotos: "consulta dental luminosa y moderna, sonrisa natural en primer plano, dentista sonriendo con paciente y recepción limpia" },
    { id: "fisio", label: "Fisioterapia u osteopatía", emoji: "🩺", schema: "MedicalClinic", cta: "Reservar sesión",
      servicios: "fisioterapia deportiva, dolor de espalda y cervicales, rehabilitación de lesiones y pilates terapéutico",
      secciones: "portada con botón de reservar; problemas que tratáis (espalda, lesiones, suelo pélvico…); cómo es la primera sesión; tarifas y bonos; el equipo con número de colegiado; testimonios; horario y mapa; preguntas frecuentes",
      cliente: "personas con dolor de espalda o cuello por el trabajo, deportistas lesionados y mayores que necesitan rehabilitación",
      dudas: "¿necesito informe médico?, ¿cuánto dura una sesión?, ¿cuántas sesiones necesitaré?, ¿trabajáis con mutuas o seguros?, ¿qué ropa llevo?",
      confianza: "fisioterapeutas colegiados, especialidades, explicación del método, testimonios y precios claros",
      fotos: "fisioterapeuta tratando la espalda de un paciente en camilla, sala de ejercicio terapéutico con luz natural y detalle de manos en rodilla" },
    { id: "gimnasio", label: "Gimnasio o entrenador", emoji: "🏋️", schema: "ExerciseGym", cta: "Probar una clase gratis",
      servicios: "entrenamiento personal, clases dirigidas, planes para perder peso y entrenamiento para mayores",
      secciones: "portada con botón de clase de prueba; para quién es; clases y horarios; tarifas; entrenadores; resultados y testimonios; instalaciones; mapa; preguntas frecuentes",
      cliente: "gente que quiere empezar a entrenar sin agobios, personas que buscan perder peso con ayuda y deportistas que buscan un sitio cerca",
      dudas: "¿hay permanencia?, ¿cuánto cuesta al mes?, ¿puedo probar antes?, ¿hay clases para principiantes?, ¿a qué hora hay menos gente?",
      confianza: "titulación de los entrenadores, resultados reales con permiso, sin permanencia y reseñas",
      fotos: "clase dirigida con energía y luz natural, entrenador ayudando a una persona principiante, zona de pesas ordenada y vestuario limpio" },
    { id: "taller", label: "Taller mecánico", emoji: "🔧", schema: "AutoRepair", cta: "Pedir presupuesto",
      servicios: "mantenimiento y revisión, pre-ITV, neumáticos y diagnosis electrónica",
      secciones: "portada con botón de pedir presupuesto por WhatsApp; servicios con precios orientativos; pre-ITV; marcas con las que trabajáis; por qué confiar (garantía, transparencia); reseñas; horario y mapa; preguntas frecuentes",
      cliente: "conductores del barrio que desconfían de los talleres, gente que necesita pasar la ITV y empresas con furgonetas",
      dudas: "¿cuánto cuesta una revisión?, ¿me dais presupuesto antes de tocar nada?, ¿tenéis coche de sustitución?, ¿cuánto tarda?, ¿qué garantía tiene la reparación?",
      confianza: "presupuesto por escrito antes de reparar, garantía, años en el barrio, fotos del taller y reseñas",
      fotos: "mecánico revisando un motor con luz de taller, taller limpio y ordenado con coches en elevador y detalle de neumáticos nuevos" },
    { id: "reformas", label: "Reformas, fontanería o electricidad", emoji: "🛠️", schema: "HomeAndConstructionBusiness", cta: "Pedir presupuesto gratis",
      servicios: "reformas de baño y cocina, fontanería, electricidad y urgencias",
      secciones: "portada con botón de presupuesto gratis; servicios; trabajos realizados (galería antes y después); cómo trabajamos en 4 pasos; zonas donde trabajáis; garantía; reseñas; contacto y urgencias; preguntas frecuentes",
      cliente: "propietarios que quieren reformar el baño o la cocina, gente con una avería urgente y administradores de fincas",
      dudas: "¿el presupuesto es gratis?, ¿cuánto tarda una reforma de baño?, ¿atendéis urgencias el fin de semana?, ¿os encargáis de los permisos?, ¿qué garantía dais?",
      confianza: "fotos de antes y después reales, garantía por escrito, seguro de responsabilidad civil, años de experiencia y reseñas",
      fotos: "baño reformado moderno con luz natural, cocina recién reformada, fontanero trabajando con herramientas y detalle de un cuadro eléctrico ordenado" },
    { id: "asesoria", label: "Asesoría, gestoría o abogados", emoji: "⚖️", schema: "ProfessionalService", cta: "Pedir una consulta",
      servicios: "asesoría fiscal para autónomos, contabilidad para pymes, laboral y nóminas, y trámites",
      secciones: "portada con mensaje claro y botón de consulta; servicios por tipo de cliente (autónomos, pymes, particulares); tarifas o desde; el equipo y su colegiación; cómo trabajamos; testimonios; contacto; preguntas frecuentes",
      cliente: "autónomos que empiezan y no entienden Hacienda, pymes que quieren cambiar de gestoría y particulares con un trámite concreto",
      dudas: "¿cuánto cuesta al mes para un autónomo?, ¿se puede hacer todo online?, ¿me ayudáis a darme de alta?, ¿qué pasa si me llega una carta de Hacienda?, ¿atendéis en persona?",
      confianza: "colegiación y años de experiencia, tarifas claras, testimonios de clientes y respuesta en menos de 24 h",
      fotos: "despacho luminoso con asesora atendiendo a un cliente, mesa ordenada con portátil y documentos y equipo profesional sonriendo" },
    { id: "inmobiliaria", label: "Inmobiliaria", emoji: "🏠", schema: "RealEstateAgent", cta: "Valorar mi vivienda gratis",
      servicios: "venta de viviendas, alquiler, valoración gratuita y gestión de alquileres",
      secciones: "portada con botón de valoración gratuita; inmuebles destacados; vender con nosotros (proceso); alquilar; conocemos el barrio; equipo; reseñas; contacto; preguntas frecuentes",
      cliente: "propietarios que quieren vender o alquilar en la zona, compradores que buscan piso en el barrio y personas que heredan una vivienda",
      dudas: "¿cuánto vale mi piso?, ¿qué comisión cobráis?, ¿cuánto se tarda en vender?, ¿os encargáis del papeleo?, ¿hacéis fotos y vídeo de la vivienda?",
      confianza: "registro de agente inmobiliario, viviendas vendidas en la zona, equipo local y reseñas",
      fotos: "salón luminoso de piso reformado, fachada de edificio del barrio, agente entregando llaves y cocina moderna" },
    { id: "tienda", label: "Tienda local", emoji: "🛍️", schema: "Store", cta: "Escríbenos por WhatsApp",
      servicios: "productos seleccionados, novedades de temporada, asesoramiento personal y envío o recogida en tienda",
      secciones: "portada con la novedad de la temporada; categorías de productos; novedades; sobre la tienda y quién la lleva; recogida o envío; reseñas; horario y mapa; preguntas frecuentes",
      cliente: "vecinos que prefieren comprar en el barrio, gente que busca un regalo especial y clientes que quieren ver el producto antes de comprar",
      dudas: "¿hacéis envíos?, ¿se puede reservar por WhatsApp?, ¿se puede cambiar o devolver?, ¿tenéis tarjeta regalo?, ¿abrís en festivos?",
      confianza: "la historia de la tienda, fotos reales del escaparate, política de cambios clara y reseñas",
      fotos: "escaparate de tienda de barrio con luz cálida, productos bien colocados en estantería, dependienta atendiendo y bolsa de compra con lazo" },
    { id: "academia", label: "Academia o clases", emoji: "📚", schema: "EducationalOrganization", cta: "Reservar clase de prueba",
      servicios: "clases de refuerzo escolar, idiomas, preparación de exámenes y clases online",
      secciones: "portada con botón de clase de prueba; cursos y niveles; metodología; profesores; horarios y precios; resultados (aprobados, certificados); testimonios de familias; mapa; preguntas frecuentes",
      cliente: "padres y madres que buscan refuerzo para sus hijos, estudiantes que preparan un examen oficial y adultos que quieren aprender un idioma",
      dudas: "¿cuántos alumnos hay por grupo?, ¿hay clase de prueba?, ¿cómo informáis a las familias?, ¿cuánto cuesta al mes?, ¿hay clases online?",
      confianza: "titulación de los profesores, grupos reducidos, resultados reales y opiniones de familias",
      fotos: "profesora ayudando a un alumno en mesa luminosa, aula pequeña y ordenada, estudiantes sonriendo con libros y pizarra con apuntes" },
    { id: "veterinaria", label: "Clínica veterinaria", emoji: "🐾", schema: "VeterinaryCare", cta: "Pedir cita",
      servicios: "consultas y vacunas, cirugía, peluquería canina y urgencias",
      secciones: "portada con botón de cita y teléfono de urgencias; servicios; planes de salud; el equipo con número de colegiado; la clínica; consejos; reseñas; horario y mapa; preguntas frecuentes",
      cliente: "familias con perro o gato en el barrio, personas que acaban de adoptar y dueños con una urgencia",
      dudas: "¿atendéis urgencias?, ¿cuánto cuesta una consulta?, ¿qué vacunas necesita un cachorro?, ¿tenéis peluquería?, ¿hacéis visitas a domicilio?",
      confianza: "veterinarios colegiados, trato cariñoso, instalaciones, planes de salud y reseñas",
      fotos: "veterinaria acariciando a un perro en consulta, gato tranquilo en camilla, recepción luminosa y cachorro feliz" },
    { id: "fotografo", label: "Fotógrafo o eventos", emoji: "📸", schema: "ProfessionalService", cta: "Consultar disponibilidad",
      servicios: "bodas, sesiones familiares, fotografía de producto y eventos de empresa",
      secciones: "portada con una foto impactante y botón de disponibilidad; portfolio por categorías; packs y precios desde; cómo trabajo; sobre mí; testimonios; contacto con fecha del evento; preguntas frecuentes",
      cliente: "parejas que se casan, familias que quieren una sesión y empresas que necesitan fotos de producto o de un evento",
      dudas: "¿cuánto cuesta una boda?, ¿cuándo se entregan las fotos?, ¿te desplazas?, ¿cuántas fotos entregas?, ¿cómo se reserva la fecha?",
      confianza: "portfolio real, años y número de eventos, testimonios y contrato claro",
      fotos: "pareja de novios al atardecer, sesión familiar en el parque, fotografía de producto sobre fondo neutro y fotógrafo trabajando" },
    { id: "otro", label: "Otro negocio", emoji: "✨", schema: "LocalBusiness", cta: "Contactar por WhatsApp",
      servicios: "", secciones: "", cliente: "", dudas: "", confianza: "", fotos: "" }
  ];

  var estilos = [
    { id: "premium", label: "Elegante y premium", desc: "colores oscuros o neutros con un acento dorado o profundo, mucho aire, titulares con tipografía serif y fotos grandes" },
    { id: "moderno", label: "Moderno y luminoso", desc: "fondo claro, un color de acento vivo, tipografía sans-serif geométrica, tarjetas redondeadas y sombras suaves" },
    { id: "calido", label: "Cálido y cercano", desc: "tonos tierra y crema, tipografía redondeada y amable, fotos con luz natural y detalles hechos a mano" },
    { id: "atrevido", label: "Atrevido y juvenil", desc: "colores saturados, titulares enormes, formas y degradados, y microanimaciones con personalidad" },
    { id: "minimal", label: "Minimalista y limpio", desc: "blanco y negro con un único color, rejilla clara, tipografía fina y nada que sobre" }
  ];

  var tonos = [
    { id: "cercano", label: "Cercano (tuteo)", desc: "cercano y natural, tuteando al cliente, como habla el dueño en persona" },
    { id: "profesional", label: "Profesional", desc: "profesional y de confianza, claro y sin tecnicismos, tratando de usted si encaja con el sector" },
    { id: "divertido", label: "Divertido", desc: "desenfadado y con chispa, frases cortas y algún guiño, sin perder la claridad" }
  ];

  /* ------------------------------------------------ Kit: web profesional
     Cada prompt es una función que recibe v (valores ya rellenados o con [hueco]). */
  var kitWeb = [
    { id: "estrategia", fase: "Preparar", herramienta: "Claude o ChatGPT", titulo: "Estrategia y cliente ideal",
      cuando: "Antes de escribir nada. Te da la base para que la web venda y no sea solo bonita.",
      prompt: function (v) { return [
        "Actúa como estratega de marketing para negocios locales en España.",
        "",
        "Voy a crear la web de este negocio:",
        "- Nombre: " + v.negocio,
        "- Tipo de negocio: " + v.tipo,
        "- Zona: " + v.zona,
        "- Servicios principales: " + v.servicios,
        "- Acción que quiero que haga el visitante: " + v.cta,
        "",
        "Pista sobre su cliente: " + v.cliente + ".",
        "",
        "Dame, en tablas cortas:",
        "1. 3 perfiles de cliente ideal: quién es, qué busca y qué le frena a elegir un negocio como este.",
        "2. La propuesta de valor del negocio en una frase de máximo 15 palabras.",
        "3. 3 diferenciales creíbles. Si no los sabes, no los inventes: escríbelos como pregunta para que yo se los confirme al dueño.",
        "4. 10 búsquedas reales que haría alguien en Google para encontrar este negocio (ej.: \"" + v.tipoCorto + " en " + v.zonaCorta + "\").",
        "5. Las 5 dudas que más frenan a un cliente antes de " + v.ctaMin + ", y cómo resolverlas en la web.",
        "",
        "Si te falta algún dato importante, hazme primero hasta 5 preguntas y espera mi respuesta."
      ].join("\n"); } },

    { id: "estructura", fase: "Preparar", herramienta: "Claude o ChatGPT", titulo: "Estructura de la web",
      cuando: "Justo después de la estrategia, en la misma conversación.",
      prompt: function (v) { return [
        "Con esa estrategia, diseña la estructura de una web de una sola página para " + v.negocio + " (" + v.tipo + " en " + v.zona + ").",
        "",
        "Secciones que suelen funcionar en este tipo de negocio: " + v.secciones + ".",
        "",
        "Para cada sección dime:",
        "- Objetivo (qué tiene que pensar o hacer el visitante al verla).",
        "- Qué contenido lleva (texto, fotos, botones).",
        "- Dónde aparece el botón \"" + v.cta + "\".",
        "",
        "Reglas: el botón principal tiene que verse sin hacer scroll en el móvil, el teléfono y el WhatsApp siempre a un toque, y nada de secciones de relleno. Ordénalas de más a menos importante para que alguien decida en 30 segundos."
      ].join("\n"); } },

    { id: "textos", fase: "Crear", herramienta: "Claude o ChatGPT", titulo: "Textos de la web (copywriting)",
      cuando: "Cuando tengas la estructura. Revisa los textos antes de pasar a la web.",
      prompt: function (v) { return [
        "Escribe todos los textos de la web de " + v.negocio + ", " + v.tipo + " en " + v.zona + ", siguiendo la estructura que acordamos.",
        "",
        "Incluye: título principal (máximo 8 palabras), frase principal debajo, los servicios (" + v.servicios + ") con una línea cada uno, la sección de confianza, preguntas frecuentes con respuesta y los textos de todos los botones (el principal es \"" + v.cta + "\").",
        "",
        "Tono: " + v.tono + ".",
        "",
        "Reglas:",
        "- Habla de lo que gana el cliente, no de lo bueno que es el negocio.",
        "- Frases cortas, fáciles de leer en el móvil. Nada de \"somos líderes\", \"calidad y profesionalidad\" ni frases vacías.",
        "- Incluye de forma natural \"" + v.tipoCorto + " en " + v.zonaCorta + "\" en el título o la frase principal y en un par de sitios más (para Google).",
        "- No inventes datos: reseñas, años, premios, precios o números de colegiado van como [DATO A CONFIRMAR].",
        "- Preguntas frecuentes a responder: " + v.dudas + ".",
        "",
        "Entrégalo ordenado por secciones, listo para copiar."
      ].join("\n"); } },

    { id: "identidad", fase: "Crear", herramienta: "Claude o ChatGPT", titulo: "Identidad visual (colores y tipografías)",
      cuando: "Si el negocio no tiene logo o colores definidos. Si los tiene, dáselos a la IA en el siguiente paso.",
      prompt: function (v) { return [
        "Propón la identidad visual de la web de " + v.negocio + " (" + v.tipo + ").",
        "",
        "Estilo que buscamos: " + v.estilo + ".",
        "",
        "Dame:",
        "1. Paleta de 5 colores con su código HEX (fondo, superficie, texto, color principal, acento) y comprueba que el texto sobre el fondo y sobre los botones cumple contraste WCAG AA.",
        "2. 2 tipografías de Google Fonts (titulares y texto) y por qué encajan.",
        "3. Estilo de botones, bordes, sombras e iconos.",
        "4. Estilo de fotografía (luz, encuadre, colores) para que todas las fotos parezcan de la misma marca.",
        "5. Todo lo anterior como variables CSS (:root { --color-...: ... }) listas para pegar."
      ].join("\n"); } },

    { id: "fotos", fase: "Crear", herramienta: "ChatGPT (imágenes), Gemini o Midjourney", titulo: "Fotos con IA para la web de muestra",
      cuando: "Para la web de muestra. Cuando el negocio sea tu cliente, cambia estas fotos por fotos reales del local: venden mucho más.",
      prompt: function (v) { return [
        "Crea una fotografía realista para la web de un negocio local en España (" + v.tipoCorto + ").",
        "",
        "Escenas (genera una imagen por cada una): " + v.fotos + ".",
        "",
        "Estilo común para todas: fotografía profesional, luz natural suave, colores coherentes con un estilo " + v.estiloCorto + ", encuadre horizontal 16:9 con espacio libre a un lado para poner texto encima, aspecto de lugar real (no de banco de imágenes).",
        "",
        "Sin texto, sin logotipos, sin marcas de agua y sin caras deformadas. Personas naturales, de aspecto local."
      ].join("\n"); } },

    { id: "web", fase: "Construir", herramienta: "Claude (mejor con artefactos activados)", titulo: "La web completa en un archivo",
      cuando: "El prompt principal. Pégalo en la misma conversación donde tienes los textos y los colores.",
      prompt: function (v) { return [
        "Con los textos y la identidad visual que hemos preparado, crea la página web completa de " + v.negocio + " en un único archivo index.html, con el CSS y el JavaScript dentro.",
        "",
        "Datos del negocio:",
        "- Tipo: " + v.tipo + " · Zona: " + v.zona,
        "- Dirección: " + v.direccion,
        "- WhatsApp y teléfono: " + v.telefono,
        "- Horario: " + v.horario,
        "",
        "Debe tener:",
        "1. Diseño profesional y moderno con estilo " + v.estiloCorto + ", pensado primero para el móvil (que se vea perfecto a 360 px de ancho) y adaptado a tablet y ordenador.",
        "2. Cabecera fija con el nombre, menú que en el móvil se abre con un botón, y el botón \"" + v.cta + "\" siempre visible.",
        "3. Botón flotante de WhatsApp abajo a la derecha que abre https://wa.me/" + v.telefonoWa + "?text= con un mensaje ya escrito, y botón de llamar con tel:.",
        "4. Todas las secciones de la estructura, con animaciones suaves al hacer scroll que se desactivan con prefers-reduced-motion.",
        "5. Preguntas frecuentes en acordeón, sección de reseñas (con [RESEÑA A CONFIRMAR] si no hay reales) y horario en una tabla clara.",
        "6. Mapa de Google Maps incrustado con la dirección y un botón \"Cómo llegar\".",
        "7. Formulario de contacto sencillo que, al enviarlo, abre WhatsApp con los datos ya escritos (sin servidor).",
        "8. SEO: <title> de menos de 60 caracteres, meta description de menos de 155, etiquetas Open Graph, un solo H1, y datos estructurados JSON-LD de tipo " + v.schema + " con nombre, dirección, teléfono, horario y zona.",
        "9. Accesibilidad: contraste AA, textos alternativos en las imágenes, foco visible con teclado y botones de al menos 44 px.",
        "10. Rendimiento: sin frameworks ni librerías (solo Google Fonts), imágenes con loading=\"lazy\" y width/height, y nada que bloquee la carga.",
        "11. Las imágenes como URLs fáciles de cambiar, con un comentario <!-- CAMBIAR FOTO --> al lado.",
        "12. Pie con enlaces a Aviso legal, Privacidad y Cookies, y el año actual.",
        "",
        "Escribe el código limpio y comentado por secciones para que pueda editar textos sin saber programar. Entrega el archivo completo de principio a fin, sin resumir ni dejar partes \"igual que antes\"."
      ].join("\n"); } },

    { id: "continuar", fase: "Construir", herramienta: "Claude o ChatGPT", titulo: "Si el código se corta a medias",
      cuando: "Solo si la respuesta se queda cortada antes del </html>.",
      prompt: function () { return [
        "Te has cortado. Continúa exactamente desde la última línea que escribiste, sin repetir nada de lo anterior y sin explicaciones, hasta cerrar el </html>.",
        "",
        "Cuando termines, dime en una línea en qué punto empezaba tu continuación para que pueda unir las dos partes."
      ].join("\n"); } },

    { id: "revision", fase: "Pulir", herramienta: "Claude", titulo: "Revisión de experto y mejora",
      cuando: "Con la web ya hecha. Es el paso que la convierte de \"hecha con IA\" a \"profesional\".",
      prompt: function (v) { return [
        "Revisa la web que has creado como lo haría un diseñador web senior antes de entregarla a un cliente que paga.",
        "",
        "Comprueba y puntúa del 1 al 10:",
        "- Móvil: ¿se ve bien a 360 px?, ¿algo se sale, se solapa o queda demasiado pequeño?",
        "- Claridad: ¿se entiende en 5 segundos qué es, dónde está y cómo " + v.ctaMin + "?",
        "- Conversión: ¿el botón \"" + v.cta + "\" y el WhatsApp están siempre a mano?",
        "- Diseño: jerarquía, espaciado, alineaciones y coherencia de colores.",
        "- Confianza: ¿hay pruebas reales (" + v.confianza + ")?",
        "- SEO local, accesibilidad y velocidad.",
        "",
        "Haz una lista de problemas ordenada de más a menos grave y después dame el archivo index.html completo con todo corregido."
      ].join("\n"); } },

    { id: "seo", fase: "Pulir", herramienta: "Claude o ChatGPT", titulo: "SEO local y ficha de Google",
      cuando: "Antes de entregarla. La ficha de Google Business trae más clientes que la propia web.",
      prompt: function (v) { return [
        "Prepara el SEO local de " + v.negocio + ", " + v.tipo + " en " + v.zona + ".",
        "",
        "1. 3 opciones de <title> (máx. 60 caracteres) y de meta description (máx. 155) con \"" + v.tipoCorto + " en " + v.zonaCorta + "\".",
        "2. El bloque JSON-LD completo de tipo " + v.schema + " (nombre, dirección " + v.direccion + ", teléfono " + v.telefono + ", horario " + v.horario + ", zona de servicio, redes y URL), validado para schema.org.",
        "3. La descripción para su ficha de Google Business Profile (máx. 750 caracteres), la categoría principal y 4 secundarias.",
        "4. 5 publicaciones cortas para la ficha de Google para el primer mes.",
        "5. Un mensaje de WhatsApp amable para pedir reseñas a los clientes contentos, con el hueco del enlace.",
        "6. 5 ideas de contenido para la web que respondan a búsquedas reales de la zona."
      ].join("\n"); } },

    { id: "legales", fase: "Pulir", herramienta: "Claude", titulo: "Aviso legal, privacidad y cookies",
      cuando: "Obligatorio si la web es de un cliente real en España. Pide que un profesional lo revise.",
      prompt: function (v) { return [
        "Redacta tres páginas para la web de " + v.negocio + ", un negocio en España: Aviso legal (LSSI-CE), Política de privacidad (RGPD y LOPDGDD) y Política de cookies.",
        "",
        "Datos del titular (déjalos como hueco si no los tengo): [razón social o nombre], [NIF], [dirección: " + v.direccion + "], [email], teléfono " + v.telefono + ".",
        "",
        "La web solo usa: formulario que abre WhatsApp, mapa de Google Maps incrustado y Google Fonts. Dime qué cookies o datos puede implicar eso y si necesito banner de cookies o no.",
        "",
        "Entrégalas como tres archivos HTML (aviso-legal.html, privacidad.html, cookies.html) con el mismo estilo que la web, en lenguaje claro. Añade al principio una nota recordando que el texto debe revisarlo un profesional."
      ].join("\n"); } },

    { id: "publicar", fase: "Publicar", herramienta: "Claude", titulo: "Publicarla gratis con enlace",
      cuando: "Para tener el enlace que entregarás en la misión. Lo más fácil: Netlify Drop (arrastrar la carpeta).",
      prompt: function () { return [
        "Nunca he publicado una web. Tengo una carpeta con index.html (y quizá aviso-legal.html, privacidad.html, cookies.html y una carpeta de imágenes).",
        "",
        "Explícame paso a paso, como si fuera la primera vez y desde el móvil o el ordenador:",
        "1. Cómo publicarla gratis en Netlify Drop (app.netlify.com/drop) para tener un enlace https.",
        "2. Cómo cambiar el nombre del enlace para que se vea profesional.",
        "3. Cómo actualizarla cuando cambie algo.",
        "4. Cuando el cliente pague: cómo comprar un dominio .es o .com y conectarlo, y cuánto cuesta al año aproximadamente.",
        "5. Qué comprobar después de publicar (móvil, botones, WhatsApp, mapa)."
      ].join("\n"); } },

    { id: "ensenar", fase: "Vender", herramienta: "Claude o ChatGPT", titulo: "Mensaje para enseñársela al negocio",
      cuando: "Cuando la web de muestra esté publicada (te servirá en la misión 5).",
      prompt: function (v) { return [
        "He creado una web de muestra para " + v.negocio + ", " + v.tipo + " en " + v.zona + ", sin que me la pidieran. El enlace es [ENLACE].",
        "Me llamo [TU NOMBRE] y mi marca es " + v.marca + ".",
        "",
        "Escríbeme 3 versiones de un primer mensaje de WhatsApp o Instagram (máx. 60 palabras cada uno) para enseñársela:",
        "- Cercano, sin parecer spam ni vendedor agresivo, y sin precios.",
        "- Que mencione algo concreto de su negocio (sus reseñas, su local o un plato o servicio).",
        "- Que termine con una pregunta fácil de contestar, como \"¿Te la enseño 10 minutos?\".",
        "",
        "Y un mensaje de seguimiento para 3 días después si no contesta."
      ].join("\n"); } },

    { id: "cambios", fase: "Vender", herramienta: "Claude", titulo: "Aplicar los cambios que pida el cliente",
      cuando: "Cada vez que el cliente te pida retoques.",
      prompt: function () { return [
        "Te paso el index.html actual de la web y la lista de cambios que me ha pedido el cliente.",
        "",
        "Cambios:",
        "[PEGA AQUÍ LOS CAMBIOS]",
        "",
        "Aplica solo esos cambios, sin tocar nada más del diseño ni de los textos. Al final devuélveme el archivo completo y una lista de lo que has cambiado para enviársela al cliente.",
        "",
        "[PEGA AQUÍ EL CÓDIGO]"
      ].join("\n"); } }
  ];

  /* ------------------------------------------------- Misiones de la ruta 1
     steps: [{ text, prompt?, kit? }] · prompt es una plantilla con {claves}.
     videos: [{ youtube_video_id, title, channel_name, channel_url, start_seconds } | { buscar }]
     TODO(admin): sustituir las búsquedas por vídeos concretos cuando estén elegidos. */
  var missions = [
    { number: 1, title: "Elige el nombre de tu marca y tu zona", goal: "Ten un nombre de marca y una zona concreta donde vas a buscar clientes.",
      proof_type: "text", proof_config: { fields: [{ key: "marca", label: "Nombre de tu marca", ph: "Ej.: Webs del Barrio" }, { key: "zona", label: "Tu zona de trabajo", ph: "Ej.: Ruzafa, Valencia" }] },
      xp_reward: 30, badge_slug: "fundador",
      videos: [{ buscar: "cómo elegir nombre de marca con ChatGPT" }, { buscar: "vender páginas web a negocios locales desde cero" }],
      steps: [
        { text: "Pide a la IA nombres de marca cortos y fáciles de recordar.",
          prompt: "Quiero montar un pequeño negocio de páginas web para negocios locales en {ciudad}. Dame 15 nombres de marca cortos (máximo 2 palabras), fáciles de decir por teléfono y de escribir, que transmitan confianza y cercanía.\n\nEvita palabras como \"digital\", \"solutions\", \"agency\" o \"studio\" si no aportan nada.\n\nPara cada nombre dime: por qué funciona, si se parece a una marca conocida, y qué dominio (.es o .com) y usuario de Instagram probarías. Al final recomiéndame tus 3 favoritos." },
        { text: "Elige la zona donde vas a trabajar: mejor un barrio o pueblo al que puedas ir en persona.",
          prompt: "Vivo en {ciudad}. Quiero empezar a vender páginas web a negocios locales y necesito elegir una zona para empezar.\n\nPropónme 3 barrios o zonas y, para cada una: densidad de pequeños comercios, qué tipos de negocio abundan, cuáles suelen tener menos presencia en internet y por qué empezaría por ahí.\n\nSi no conoces bien la ciudad, dime cómo averiguarlo yo en 15 minutos con Google Maps." },
        { text: "Comprueba que el nombre está libre: busca en Google, Instagram y en un buscador de dominios." },
        { text: "Prepara tu presentación de una línea.",
          prompt: "Mi marca es {marca} y hago páginas web para negocios de {zona}. Escríbeme:\n1. Una bio de Instagram de máximo 150 caracteres.\n2. Una frase para presentarme por WhatsApp en una línea.\n3. Una frase para decir en persona cuando entre en un local, natural y sin sonar a vendedor." },
        { text: "Escribe tu marca y tu zona en la pestaña Entregar." }
      ] },

    { number: 2, title: "Crea tu primera web de muestra con IA", goal: "Publica una web profesional de ejemplo para un negocio real de tu zona y pega el enlace.",
      proof_type: "link", proof_config: { label: "Enlace a tu web publicada", ph: "https://tu-web.netlify.app" },
      xp_reward: 80, badge_slug: "constructor",
      videos: [{ buscar: "crear página web con Claude artifacts paso a paso" }, { buscar: "publicar web gratis Netlify Drop" }],
      steps: [
        { kit: true, text: "Elige el negocio para el que vas a hacer la web (mejor uno real de tu zona sin web) y rellena sus datos en el Kit Web Pro." },
        { text: "Pide a Claude los textos de la web.",
          prompt: "Escribe los textos de la web de este negocio: {tipo} en {zona}. Incluye título, frase principal, 4 servicios y un botón de WhatsApp. Tono cercano." },
        { text: "Pide a Claude la web completa (usa el prompt «La web completa en un archivo» del kit para un resultado profesional).",
          prompt: "Con estos textos, crea una página web en un solo archivo HTML, moderna, adaptada al móvil, con botón flotante de WhatsApp." },
        { text: "Pasa el prompt de revisión de experto y aplica las mejoras." },
        { text: "Publícala gratis en Netlify Drop y pega aquí el enlace." }
      ] },

    { number: 3, title: "Define tu oferta y tus precios", goal: "Ten claro qué vendes, a qué precio y qué responder cuando te pongan pegas.",
      proof_type: "checklist", proof_config: {},
      xp_reward: 50, badge_slug: "con-precio",
      videos: [{ buscar: "cuánto cobrar por una página web a un negocio local" }, { buscar: "cómo hacer una propuesta comercial para clientes" }],
      steps: [
        { text: "Crea 3 paquetes: Básico, Profesional y Premium, con pago inicial y cuota mensual.",
          prompt: "Vendo páginas web hechas con IA a negocios locales de {ciudad} con mi marca {marca}.\n\nDiseña 3 paquetes (Básico, Profesional, Premium) con: qué incluye cada uno (secciones, ficha de Google, dominio, cambios al mes, fotos, legales), plazo de entrega, precio de creación y cuota mensual de mantenimiento.\n\nUsa precios realistas para el mercado español actual de autónomos que empiezan, explícame por qué cada precio y qué paquete debería ser el que más venda." },
        { text: "Escribe tu oferta en una frase que cualquier dueño entienda.",
          prompt: "Resume mi oferta en una frase de máximo 20 palabras que entienda a la primera el dueño de un negocio local (por ejemplo, {tipo}), centrada en lo que gana (más clientes, más reservas, menos llamadas), no en la tecnología. Dame 5 opciones." },
        { text: "Prepara las respuestas a las objeciones típicas.",
          prompt: "Soy {marca} y vendo webs a negocios locales. Dame respuestas cortas, honestas y sin presionar a estas objeciones: \"es caro\", \"ya tengo Facebook/Instagram\", \"mi sobrino me la hace\", \"no la necesito, ya tengo clientes\", \"lo pienso\", \"¿y si luego no me sirve?\", \"no tengo tiempo\" y \"ya me engañaron una vez\".\n\nPara cada una: qué hay detrás de la objeción y qué respondería yo en una frase." },
        { text: "Crea la web de tu propia marca para enseñar tus trabajos.",
          prompt: "Crea la web de mi marca {marca}, un pequeño estudio que hace páginas web con IA para negocios de {zona}. Un único index.html con CSS y JS dentro, profesional, adaptado al móvil, con: título claro, problema que resuelvo, cómo trabajo en 3 pasos, mis paquetes y precios (te los paso abajo), trabajos de muestra con enlaces, preguntas frecuentes y botón flotante de WhatsApp.\n\nMis paquetes: [PEGA TUS PAQUETES]\nMis webs de muestra: [ENLACES]" },
        { text: "Prepara tu plantilla de propuesta para enviar después de una reunión.",
          prompt: "Crea una plantilla de propuesta de una página para enviar por WhatsApp o PDF a un negocio local después de una reunión. Huecos para: nombre del negocio, lo que me contó que necesita, la solución, el paquete recomendado con precio, plazo, qué necesito de él para empezar y siguiente paso. Firmada por {marca}. Clara, sin letra pequeña y sin presionar." }
      ] },

    { number: 4, title: "Lista 20 negocios sin web en tu zona", goal: "Añade a Mis clientes 20 negocios de tu zona que no tengan web o la tengan muy mal.",
      proof_type: "contacts", proof_config: { min_contacts: 20, status: "todo" },
      xp_reward: 60, badge_slug: "explorador",
      videos: [{ buscar: "encontrar negocios sin página web en Google Maps" }],
      steps: [
        { text: "Busca en Google Maps tipos de negocio de tu zona y entra en las fichas: si no tienen «Sitio web» o llevan a Facebook, es un candidato.",
          prompt: "Dame 25 búsquedas para Google Maps que me ayuden a encontrar negocios sin página web en {zona}. Mezcla tipos de negocio que suelen necesitar web y pagar por ella (restaurantes, peluquerías, talleres, clínicas, reformas, academias…).\n\nY dime cómo distinguir rápido en una ficha de Google si el negocio necesita una web: sin sitio web, web rota o antigua, solo Facebook, pocas fotos, buenas reseñas pero sin forma de reservar…" },
        { text: "Prioriza: muchas reseñas buenas y sin web = negocio que ya tiene clientes y que puede pagarte." },
        { text: "Añade cada negocio en Mis clientes con su nombre, tipo, ubicación y contacto (WhatsApp o Instagram)." },
        { text: "Pide a la IA que te ordene la lista para empezar por los más prometedores.",
          prompt: "Te paso una lista de negocios de {zona} con su tipo, número de reseñas, nota y si tienen web:\n\n[PEGA TU LISTA]\n\nOrdénalos del más al menos prometedor para venderles una página web y explícame en una línea por qué cada uno. Marca los 5 primeros para contactar esta semana." }
      ] },

    { number: 5, title: "Envía 10 mensajes con tu web de ejemplo", goal: "Contacta a 10 negocios enseñándoles tu web de muestra y márcalos como «Mensaje enviado».",
      proof_type: "contacts", proof_config: { min_contacts: 10, status: "sent" },
      xp_reward: 80, badge_slug: "valiente",
      videos: [{ buscar: "cómo escribir a clientes por WhatsApp sin parecer spam" }],
      steps: [
        { text: "Escribe un mensaje personalizado para cada negocio (en Mis clientes tienes el botón «Mensaje» con uno ya preparado).",
          prompt: "Soy {marca} y hago webs para negocios de {zona}. Voy a escribir a [NOMBRE DEL NEGOCIO], un [TIPO DE NEGOCIO] que no tiene web, pero tiene [DETALLE: p. ej. 4,8 estrellas en Google].\n\nEscríbeme un mensaje de WhatsApp de máximo 50 palabras, cercano, sin precios, que mencione ese detalle, incluya mi web de ejemplo [ENLACE] y termine con una pregunta fácil de contestar." },
        { text: "Versión para Instagram si no tienen WhatsApp público.",
          prompt: "Adapta este mensaje a un mensaje directo de Instagram, más corto (máx. 35 palabras) y natural, como lo escribiría un vecino del barrio:\n\n[PEGA TU MENSAJE]" },
        { text: "Envía como máximo 10–15 al día y personaliza siempre el primer renglón. Nada de copiar y pegar a lo loco." },
        { text: "Marca cada negocio como «Mensaje enviado» en Mis clientes." },
        { text: "Prepara el seguimiento para quien no conteste.",
          prompt: "Escríbeme 2 mensajes de seguimiento para un negocio que no ha contestado a mi primer mensaje sobre su web: uno para 3 días después y otro para 10 días después. Cortos, amables, que aporten algo nuevo (una idea o un dato) y que no suenen a reproche." }
      ] },

    { number: 6, title: "Consigue tu primera reunión", goal: "Consigue que al menos un negocio acepte reunirse contigo o una llamada, y márcalo como «Reunión».",
      proof_type: "contacts", proof_config: { min_contacts: 1, status: "meeting" },
      xp_reward: 100, badge_slug: "primera-cita",
      videos: [{ buscar: "cómo hacer una reunión de ventas con un cliente pequeño" }],
      steps: [
        { text: "Cuando alguien responda, propón una cita corta y concreta (10–15 minutos, en su local o por videollamada).",
          prompt: "Un negocio me ha respondido a mi mensaje sobre su web con esto:\n\n\"[PEGA SU RESPUESTA]\"\n\nEscríbeme la mejor respuesta para conseguir una reunión de 15 minutos esta semana, proponiendo dos horas concretas. Corta y natural." },
        { text: "Prepara el guion de la reunión.",
          prompt: "Tengo una reunión de 15 minutos con el dueño de un negocio ({tipo}) para enseñarle una web. Prepárame un guion: cómo empezar, 6 preguntas para entender qué le hace falta (cómo le llegan los clientes, qué le preguntan siempre, qué le quita tiempo…), cómo enseñar la web de muestra, cómo presentar el precio y cómo cerrar con un siguiente paso claro." },
        { text: "Marca el negocio como «Reunión» en Mis clientes cuando tengáis fecha." },
        { text: "Después de la reunión, envía un resumen y la propuesta.",
          prompt: "Acabo de tener una reunión con [NEGOCIO]. Esto es lo que me contó: [NOTAS].\n\nEscribe el mensaje de resumen que le enviaré hoy por WhatsApp con la propuesta (usa mi plantilla de propuesta) y el paquete que mejor le encaja, con un siguiente paso concreto." }
      ] },

    { number: 7, title: "Cierra tu primer cliente", goal: "Cobra tu primer trabajo: márcalo como «Cliente» y registra el ingreso.",
      proof_type: "income", proof_config: { min_amount: 1 },
      xp_reward: 200, badge_slug: "primer-euro",
      videos: [{ buscar: "cómo cobrar a tu primer cliente autónomo factura" }],
      steps: [
        { text: "Envía la propuesta final y pide una señal (por ejemplo el 50 %) para empezar.",
          prompt: "Mi cliente [NEGOCIO] quiere la web del paquete [PAQUETE] por [PRECIO]. Escríbeme el mensaje para confirmarlo: qué incluye, plazos, que empiezo al recibir el 50 % por Bizum o transferencia y el resto al entregar, y qué necesito que me envíe (logo, fotos, horarios, textos, accesos)." },
        { text: "Deja el acuerdo por escrito.",
          prompt: "Redacta un acuerdo de servicio sencillo (1 página) entre {marca} y [NEGOCIO] para la creación de una página web: qué incluye, qué no incluye, número de rondas de cambios, plazos, precio y forma de pago, cuota mensual si la hay, propiedad de la web y del dominio, y cómo darse de baja. Lenguaje claro. Recuérdame que lo revise un profesional." },
        { text: "Haz la web real con el Kit Web Pro (con sus fotos y datos de verdad) y entrégala." },
        { text: "Emite la factura (o recibo) con tus datos y los del cliente.",
          prompt: "Explícame, para España, qué tiene que llevar una factura de un servicio de diseño web hecho por un particular que empieza: qué datos, IVA, IRPF si aplica, y cuándo tengo que darme de alta como autónomo. Dame una plantilla de factura con huecos." },
        { text: "Marca al negocio como «Cliente» en Mis clientes y registra el ingreso." }
      ] },

    { number: 8, title: "Consigue 3 clientes con cuota mensual", goal: "Ten 3 clientes pagándote una cuota mensual de mantenimiento.",
      proof_type: "income", proof_config: { min_amount: 1, min_monthly_clients: 3 },
      xp_reward: 300, badge_slug: "negocio-real",
      videos: [{ buscar: "cómo vender mantenimiento web mensual a clientes" }],
      steps: [
        { text: "Define tu plan de mantenimiento mensual.",
          prompt: "Diseña un plan de mantenimiento mensual para las webs que hago con {marca}: qué incluye (cambios al mes, copias, revisión, ficha de Google, informe), qué no incluye, precio recomendado y cómo explicarlo en 2 frases a un dueño de negocio para que vea que le ahorra tiempo y le trae clientes." },
        { text: "Ofrece el mantenimiento a tus clientes actuales.",
          prompt: "Escríbeme un mensaje para ofrecer mi plan de mantenimiento mensual a un cliente al que ya le hice la web: amable, centrado en lo que gana, con el precio claro y sin presionar." },
        { text: "Envía cada mes un informe corto: así nadie se da de baja.",
          prompt: "Crea una plantilla de informe mensual muy corto para mis clientes de mantenimiento web: cambios hechos, visitas y clics en WhatsApp o llamadas (te paso los datos), reseñas nuevas en Google y una recomendación para el mes que viene. Que quepa en un mensaje de WhatsApp." },
        { text: "Pide recomendaciones a tus clientes contentos.",
          prompt: "Escríbeme un mensaje para pedir a un cliente contento que me recomiende a otros negocios que conozca, con un pequeño incentivo (por ejemplo un mes de mantenimiento gratis por cada recomendación que se convierta en cliente)." },
        { text: "Registra cada cuota como «Cuota mensual» desde el cliente en Mis clientes." }
      ] }
  ];

  window.IAPRO = {
    appName: "IAPRO",
    tracks: tracks,
    badges: badges,
    ranks: ranks,
    negocios: negocios,
    estilos: estilos,
    tonos: tonos,
    kitWeb: kitWeb,
    missions: { "webs-locales": missions }
  };
})();
