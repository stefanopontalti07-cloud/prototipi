/* Garda Domus, prototipo: apertura, schede che entrano, cartello che si gira, galleria */
(function () {
  var html = document.documentElement;
  var lento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(function () { requestAnimationFrame(function () { html.classList.add('aperto'); }); });

  var sale = document.querySelectorAll('.sale');
  if (!('IntersectionObserver' in window) || lento) {
    sale.forEach(function (e) { e.classList.add('vista'); });
  } else {
    var io = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) { if (v.isIntersecting) { v.target.classList.add('vista'); io.unobserve(v.target); } });
    }, { threshold: 0.12 });
    sale.forEach(function (e) { io.observe(e); });
  }

  /* immobili: vendita / affitto gira il cartello; i comuni filtrano le schede */
  var cartello = document.querySelector('.giro .cartello');
  var tab = document.querySelectorAll('.schede-tab button');
  var comuni = document.querySelectorAll('.comuni button');
  var schede = document.querySelectorAll('.lista .scheda');
  var conta = document.querySelector('.conta');
  var stato = { tipo: 'vendita', comune: 'tutti' };
  function filtra() {
    var n = 0;
    schede.forEach(function (s) {
      var ok = s.dataset.tipo === stato.tipo && (stato.comune === 'tutti' || s.dataset.comune === stato.comune);
      s.hidden = !ok; if (ok) { n++; s.classList.add('vista'); }
    });
    comuni.forEach(function (b) {
      var c = b.dataset.comune;
      var ce = c === 'tutti' || Array.prototype.some.call(schede, function (s) { return s.dataset.tipo === stato.tipo && s.dataset.comune === c; });
      b.hidden = !ce;
    });
    if (conta) conta.textContent = n === 1 ? '1 immobile' : n + ' immobili';
  }
  tab.forEach(function (b) {
    b.addEventListener('click', function () {
      stato.tipo = b.dataset.tipo; stato.comune = 'tutti';
      tab.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
      comuni.forEach(function (x) { x.setAttribute('aria-pressed', x.dataset.comune === 'tutti' ? 'true' : 'false'); });
      if (cartello) cartello.classList.toggle('girato', stato.tipo === 'affitto');
      filtra();
    });
  });
  comuni.forEach(function (b) {
    b.addEventListener('click', function () {
      stato.comune = b.dataset.comune;
      comuni.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      filtra();
    });
  });
  if (schede.length) filtra();

  /* galleria della casa: 1 / 3 */
  var binario = document.querySelector('.binario');
  var cf = document.querySelector('.conta-foto');
  if (binario && cf) {
    var tot = binario.children.length;
    binario.addEventListener('scroll', function () {
      var i = Math.round(binario.scrollLeft / binario.clientWidth) + 1;
      cf.textContent = Math.min(i, tot) + ' / ' + tot;
    }, { passive: true });
  }
})();
