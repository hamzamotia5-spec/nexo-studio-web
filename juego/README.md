# IAPRO — prototipo jugable (Fase 1, versión web)

Juego para montar un negocio real con IA, misión a misión. **7 rutas** de 8 misiones cada una, cada una con su kit de prompts:

| Ruta | Kit | Prompts del kit |
|---|---|---|
| Webs para negocios locales | Kit Web Pro | 13 |
| Contenido y gestión de redes | Kit Redes | 9 |
| Automatizaciones y chatbots | Kit Automatización | 10 |
| Diseño y branding con IA | Kit Diseño | 10 |
| Tienda online | Kit Tienda Online | 10 |
| Consultoría de IA para pymes | Kit Consultoría | 8 |
| Dropshipping con IA | Kit Dropshipping | 12 |

Se pueden jugar varias rutas a la vez: XP, dinero, rango y racha son comunes; misiones, clientes, ingresos de la ruta e insignias van por ruta.

Abrir: `juego/index.html` (o `/juego/` en GitHub Pages / Netlify). No necesita compilar nada.

## Qué incluye
- Onboarding: qué es el juego → elige ruta → ciudad y marca → empezar.
- Mapa de niveles con la misión actual brillando, las anteriores completadas y las siguientes bloqueadas.
- Misión: objetivo, pestaña **Guía** (vídeos de YouTube + pasos con «Copiar prompt») y pestaña **Entregar** según `proof_type` (text, link, checklist, contacts, income, image). Pantalla de celebración con XP, insignia y siguiente nivel.
- **Kit Web Pro**: eliges el tipo de negocio (15 tipos + «otro»), rellenas sus datos y el juego genera 13 prompts en orden para crear una web profesional: estrategia, estructura, textos, identidad visual, fotos con IA, web completa en un HTML, rescate si se corta, revisión de experto, SEO local y ficha de Google, legales (LSSI/RGPD), publicación, mensaje para enseñarla y cambios del cliente. Lo que no rellenas queda como `[hueco]` resaltado.
- Biblioteca con todos los prompts de la ruta (marca, precios, objeciones, prospección, mensajes, reunión, cierre, factura, mantenimiento mensual), personalizados con tu marca, ciudad y zona.
- Mis clientes (mini-CRM): estados todo → enviado → respondido → reunión → cliente (o descartado), mensaje de WhatsApp preparado, registro de ingresos desde un cliente con animación de monedas.
- XP, rangos (Novato 0 → Aprendiz 200 → Emprendedor 600 → Pro 1500 → Leyenda 3000), 8 insignias, racha diaria y contador de dinero.
- Vista previa del marketplace, que se desbloquea con un cliente en «Cliente» y un ingreso (`can_sell_in_track`).

## Archivos
- `contenido.js` — rutas, ruta 1, insignias, tipos de negocio y Kit Web Pro.
- `dropshipping.js` — ruta 7: vende productos, no servicios. Sin mini-CRM: la pestaña Clientes pasa a ser **Ventas** (beneficio y nº de pedidos) y el kit se rellena con los datos del producto.
- `rutas.js` — rutas 2 a 6: misiones, insignias y kits. Junto con `contenido.js` es la base del futuro `supabase/seed.sql`.
- `juego.js` — reglas (`submit()` replica la RPC `submit_mission`) e interfaz.
- `juego.css` — estilos (oscuro, color por ruta).

## Criterios de aceptación de la Fase 1 comprobados (en navegador, 375 px)
- Registro (local), elegir ruta, completar misiones 1–3 con pruebas válidas.
- Pruebas inválidas rechazadas con mensaje claro (texto corto, enlace sin https, checklist incompleta, contactos insuficientes).
- Añadir prospects, avanzar estados, registrar un ingreso y ver subir el contador.
- No se puede entregar una misión bloqueada. **Ojo:** en esta versión sin servidor la partida vive en el navegador, así que XP y desbloqueos no están protegidos frente a manipulación; eso llega con Supabase (ver DECISIONS.md).
