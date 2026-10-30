(function () {
  'use strict';

  // Datos de marca. El contenido crítico está en el HTML; esto solo alimenta
  // el estado "abierto / cerrado" y los enlaces que JS reutiliza.
  // Horario en minutos desde medianoche. Un turno que pasa de 1440 cruza la medianoche.
  window.__BRAND__ = {
    name: 'La Cordobesa',
    links: {
      order: 'https://lacordobesazgz.com/pedidos.html',
      book: 'https://lacordobesazgz.com/reservas.html',
      whatsapp: 'https://wa.me/34634862371?text=Hola%20La%20Cordobesa%2C%20quer%C3%ADa%20hacer%20una%20consulta.',
      phone: 'tel:+34634862371',
      instagram: 'https://www.instagram.com/lacordobesa.zgz/',
      maps: 'https://www.google.com/maps/search/?api=1&query=La+Cordobesa+C.+de+Jord%C3%A1n+de+Urri%C3%A9s+4+50001+Zaragoza',
      mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2983.8741300978936!2d-0.8790013233816668!3d41.65851457124976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd5914edbe71630b%3A0xe5107ad0e2efebba!2sC.%20de%20Jord%C3%A1n%20de%20Urri%C3%A9s%2C%204%2C%20Casco%20Antiguo%2C%2050001%20Zaragoza!5e0!3m2!1ses!2ses!4v1717520000000!5m2!1ses!2ses'
    },
    // 0 = domingo … 6 = sábado
    hours: {
      0: [[720, 960], [1140, 1380]],
      1: [],
      2: [[780, 960], [1200, 1380]],
      3: [[780, 960], [1200, 1380]],
      4: [[780, 960], [1200, 1530]],
      5: [[780, 960], [1140, 1530]],
      6: [[720, 960], [1140, 1530]]
    },
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  };
})();
