/* Mosele Gioielli, prototipo: apertura del libretto, foto che si posano, "aperto adesso". */
(function () {
  var libro = document.querySelector('.libro');
  if (libro) requestAnimationFrame(function () { libro.classList.add('aperto'); });

  var posa = document.querySelectorAll('.posa');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (vv) {
      vv.forEach(function (v) { if (v.isIntersecting) { v.target.classList.add('vista'); io.unobserve(v.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    posa.forEach(function (el) { io.observe(el); });
  } else posa.forEach(function (el) { el.classList.add('vista'); });

  /* orari: data-orari = {"1":["15:00-19:00"], ...}, 0 = domenica. Ora di Trento, non del telefono. */
  var GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  function adesso() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
      var o = {}; f.forEach(function (x) { o[x.type] = x.value; });
      var g = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
      return { g: g, m: (+o.hour % 24) * 60 + (+o.minute) };
    } catch (e) { var d = new Date(); return { g: d.getDay(), m: d.getHours() * 60 + d.getMinutes() }; }
  }
  function min(t) { var p = t.split(':'); return +p[0] * 60 + (+p[1] || 0); }
  function bello(t) { return t.replace(/^0/, '').replace(':00', ''); }
  var ora = adesso();
  document.querySelectorAll('[data-orari]').forEach(function (el) {
    var orari; try { orari = JSON.parse(el.getAttribute('data-orari')); } catch (e) { return; }
    var badge = el.querySelector('.stato');
    var riga = el.querySelector('.orari tr[data-g="' + ora.g + '"]');
    if (riga) riga.classList.add('oggi');
    if (!badge) return;
    var oggi = orari[ora.g] || [], testo = '', aperto = false;
    oggi.forEach(function (f) { var a = f.split('-'); if (ora.m >= min(a[0]) && ora.m < min(a[1])) { aperto = true; testo = 'Aperto adesso, fino alle ' + bello(a[1]); } });
    if (!aperto) {
      for (var k = 0; k < 7 && !testo; k++) {
        var g = (ora.g + k) % 7, fasce = orari[g] || [];
        for (var i = 0; i < fasce.length; i++) {
          var inizio = fasce[i].split('-')[0];
          if (k === 0 && min(inizio) <= ora.m) continue;
          testo = 'Chiuso adesso, riapre ' + (k === 0 ? 'oggi' : k === 1 ? 'domani' : GIORNI[g]) + ' alle ' + bello(inizio);
          break;
        }
      }
    }
    badge.textContent = testo;
    badge.classList.toggle('aperto', aperto);
  });
})();
