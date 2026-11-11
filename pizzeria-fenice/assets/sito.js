/* Pizzeria Fenice, prototipo: righe che compaiono, "aperto adesso" sull'ora italiana. */
(function () {
  var el = document.querySelectorAll('.compare');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (vv) {
      vv.forEach(function (v) { if (v.isIntersecting) { v.target.classList.add('vista'); io.unobserve(v.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    el.forEach(function (e) { io.observe(e); });
  } else el.forEach(function (e) { e.classList.add('vista'); });

  /* tutti i giorni 11.30-15 e 18-24, mercoledi' chiuso (scheda Google, 11/11/2026); 0 = domenica */
  var FASCE = [['11:30', '15:00'], ['18:00', '24:00']];
  var CHIUSO = 3;
  var NOMI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  function adesso() {
    try {
      var o = {}; new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()).forEach(function (x) { o[x.type] = x.value; });
      return { g: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), m: (+o.hour % 24) * 60 + (+o.minute) };
    } catch (e) { var d = new Date(); return { g: d.getDay(), m: d.getHours() * 60 + d.getMinutes() }; }
  }
  function min(t) { var p = t.split(':'); return +p[0] * 60 + (+p[1]); }
  function bello(t) { return t.replace(':00', '').replace(':', '.').replace(/^0/, ''); }
  var ora = adesso(), testo = '', aperto = false;
  if (ora.g !== CHIUSO) FASCE.forEach(function (f) { if (ora.m >= min(f[0]) && ora.m < min(f[1])) { aperto = true; testo = 'Aperto adesso, fino alle ' + (f[1] === '24:00' ? 'mezzanotte' : bello(f[1])); } });
  if (!aperto) {
    for (var k = 0; k < 8 && !testo; k++) {
      var g = (ora.g + k) % 7; if (g === CHIUSO) continue;
      for (var i = 0; i < FASCE.length; i++) {
        if (k === 0 && min(FASCE[i][0]) <= ora.m) continue;
        testo = 'Chiuso adesso, riapre ' + (k === 0 ? 'oggi' : k === 1 ? 'domani' : NOMI[g]) + ' alle ' + bello(FASCE[i][0]); break;
      }
    }
  }
  document.querySelectorAll('.stato').forEach(function (b) { b.textContent = testo; b.classList.toggle('aperto', aperto); });
  var r = document.querySelector('.orari tr[data-g="' + ora.g + '"]'); if (r) r.classList.add('oggi');
})();
