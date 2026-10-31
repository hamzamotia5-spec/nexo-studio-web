# Decisiones

1. **Prototipo web antes que la app Expo + Supabase.** El spec pide una app móvil con backend. Este prototipo es HTML/CSS/JS sin dependencias dentro de la web de Nexo Studio para poder jugarlo ya desde el móvil y validar misiones, textos y prompts. Las reglas de `submit()` en `juego.js` son las mismas que tendrá la RPC `submit_mission`; `contenido.js` se pasará tal cual a `seed.sql`.
2. **Partida guardada en el dispositivo (localStorage).** Sin cuentas: en la app real, email + Google + Apple. Consecuencia: XP y desbloqueos se pueden manipular desde el navegador. El requisito «nunca en el cliente» se cumple solo cuando exista el backend.
3. **Vídeos: búsquedas de YouTube en lugar de IDs inventados.** El spec permite IDs de ejemplo con un TODO; para no enlazar vídeos que no existen, cada misión muestra una búsqueda en YouTube. Cuando haya vídeos elegidos se añaden con `youtube_video_id`, `title`, `channel_name` y `channel_url` y se muestran con el reproductor oficial (youtube-nocookie) y el crédito del canal enlazado. TODO(admin): elegir los vídeos.
4. **Kit Web Pro (petición añadida al spec).** El jugador elige para qué negocio hace la web y el juego le da todos los prompts necesarios, en orden. Está dentro de la misión 2 y también en una pestaña propia, accesible siempre: los prompts no se bloquean; lo que avanza el juego son las pruebas.
5. **Misión 1 (`text`) con dos campos** (marca y zona), cada uno con un mínimo de 3 caracteres. Al entregarla se guardan en el perfil y personalizan el resto de prompts.
6. **Clientes con cuota mensual** = prospects distintos con al menos un ingreso `monthly`. Los ingresos solo se registran desde un prospect en estado «Cliente».
7. **Racha**: se cuenta cualquier acción del día (misión, cambio de estado, ingreso, marcar checklist). Si pasa un día entero sin actividad se muestra 0.
8. **Rutas 2 a 6 (Fase 2).** Las misiones 1–3 son propias de cada ruta; las 4–8 (prospectar, contactar, reunión, cobrar, repetir) siguen el mismo esquema adaptado a cada servicio, generado con `ventas()` en `rutas.js`.
9. **Clientes por ruta.** Cada prospect pertenece a la ruta activa al crearlo; Mis clientes muestra los de la ruta activa. Las misiones de contactos e ingresos y `can_sell_in_track` cuentan solo los de su ruta.
10. **Nuevo `proof_config.min_clients`** (ruta Diseño, misión 8): clientes distintos con al menos un ingreso, porque el diseño no suele cobrarse con cuota mensual.
11. **Prueba `image`** (ruta Diseño, misión 2): la imagen se reduce a 900 px en JPEG y se guarda en el dispositivo. En la app irá a Supabase Storage.
12. **Partidas antiguas**: la partida de una sola ruta se convierte sola al formato de varias rutas sin perder progreso.
