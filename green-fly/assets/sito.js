(function () {
  var moto = document.documentElement.classList.contains('js-moto');
  var eroe = document.querySelector('.eroe');
  var svg = eroe.querySelector('.volo');
  var maschera = svg.querySelector('.volo-maschera');
  var linee = svg.querySelectorAll('.volo-linea, .volo-ombra');
  var mosca = eroe.querySelector('.mosca');
  var punto = eroe.querySelector('.decollo .punto');
  var cornice = eroe.querySelector('.inquadratura');
  var foto = cornice.querySelector('.foto-wrap');
  var lung = 0, volato = false;

  function disegna() {
    var e = eroe.getBoundingClientRect();
    var p = punto.getBoundingClientRect();
    var f = foto.getBoundingClientRect();
    var sx = p.left - e.left + p.width / 2, sy = p.top - e.top + p.height / 2;
    var ex = f.left - e.left - 2, ey = f.top - e.top + f.height * 0.18;
    var dx = ex - sx, dy = ey - sy;
    var mx = sx + dx * 0.42, my = sy + dy * 0.78;
    var d = 'M' + sx + ' ' + sy +
      ' C' + (sx - dx * 0.08) + ' ' + (sy + dy * 0.45) + ' ' + (mx - dx * 0.3) + ' ' + (my + dy * 0.05) + ' ' + mx + ' ' + my +
      ' C' + (mx + dx * 0.28) + ' ' + (my - dy * 0.04) + ' ' + (ex - dx * 0.32) + ' ' + (ey - dy * 0.42) + ' ' + ex + ' ' + ey;
    svg.setAttribute('viewBox', '0 0 ' + e.width + ' ' + e.height);
    maschera.setAttribute('d', d);
    linee.forEach(function (l) { l.setAttribute('d', d); });
    lung = maschera.getTotalLength();
    maschera.style.strokeDasharray = lung + ' ' + lung;
  }

  function posa(t) {
    var len = lung * t;
    var a = maschera.getPointAtLength(len);
    var b = maschera.getPointAtLength(Math.min(lung, len + 3));
    var c = len > 3 ? maschera.getPointAtLength(len - 3) : a;
    var ang = Math.atan2(b.y - c.y, b.x - c.x) * 180 / Math.PI + 90;
    var w = mosca.offsetWidth, h = mosca.offsetHeight;
    var s = 1 - 0.18 * t;
    mosca.style.transform = 'translate(' + (a.x - w / 2) + 'px,' + (a.y - h / 2) + 'px) rotate(' + ang + 'deg) scale(' + s + ')';
    maschera.style.strokeDashoffset = (lung - len);
  }

  function fermo() {
    disegna();
    posa(1);
    mosca.style.opacity = 1;
    cornice.classList.add('svelata');
  }

  function vola() {
    disegna();
    var durata = 1350, t0 = null;
    mosca.style.opacity = 1;
    function passo(ora) {
      if (t0 === null) t0 = ora;
      var t = Math.min(1, (ora - t0) / durata);
      var k = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      posa(k);
      if (t > 0.86) cornice.classList.add('svelata');
      if (t < 1) requestAnimationFrame(passo); else volato = true;
    }
    requestAnimationFrame(passo);
  }

  if (moto) {
    var via = false;
    var parti = function () { if (via) return; via = true; setTimeout(vola, 250); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(parti);
    setTimeout(parti, 700);
  } else {
    fermo(); volato = true;
  }

  var largh = innerWidth;
  addEventListener('resize', function () {
    if (Math.abs(innerWidth - largh) < 2 && volato) { fermo(); return; }
    largh = innerWidth;
    if (volato) fermo();
  });

  // la rotta che si riempie scorrendo, e le tappe raggiunte
  var rotta = document.querySelector('.rotta');
  var piena = rotta.querySelector('.rotta-piena');
  var tappe = rotta.querySelectorAll('.tappa');
  var inCoda = false;
  function scorri() {
    inCoda = false;
    var r = rotta.getBoundingClientRect(), soglia = innerHeight * 0.62;
    var p = Math.max(0, Math.min(1, (soglia - r.top) / r.height));
    piena.style.setProperty('--p', p.toFixed(3));
    tappe.forEach(function (t) { t.classList.toggle('raggiunta', t.getBoundingClientRect().top < soglia); });
  }
  addEventListener('scroll', function () { if (!inCoda) { inCoda = true; requestAnimationFrame(scorri); } }, { passive: true });
  scorri();

  // comparse
  var el = document.querySelectorAll('.compare');
  if (!moto || !('IntersectionObserver' in window)) { el.forEach(function (x) { x.classList.add('vista'); }); return; }
  var io = new IntersectionObserver(function (voci) {
    voci.forEach(function (v) { if (v.isIntersecting) { v.target.classList.add('vista'); io.unobserve(v.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  el.forEach(function (x) { io.observe(x); });
})();
