/* Flash Pulizie, prototipo: le animazioni di tutte le pagine. Niente librerie.
   Senza JS (o con prefers-reduced-motion) la pagina resta completa e ferma. */
(function () {
  var fermo = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = 'IntersectionObserver' in window;
  if (io && !fermo) document.documentElement.classList.add('js');

  // testata: bianca appena si scorre; barra Chiama/WhatsApp in basso dopo la prima schermata
  var top = document.querySelector('header.top'), barra = document.querySelector('.barra');
  var proto = document.querySelector('.proto');
  if (proto) document.documentElement.style.setProperty('--proto', proto.offsetHeight + 'px');
  function scorri() {
    var y = scrollY;
    if (top) top.classList.toggle('scorso', y > 8);
    if (barra) barra.classList.toggle('su', y > 380);
  }
  addEventListener('scroll', scorri, { passive: true }); scorri();

  // menu' a tutto schermo sul telefono
  var nav = document.querySelector('.top nav'), apri = document.querySelector('.menu-btn'), chiudi = document.querySelector('.chiudi');
  function menu(a) { nav.classList.toggle('aperto', a); apri.setAttribute('aria-expanded', a); document.body.style.overflow = a ? 'hidden' : ''; }
  if (apri) apri.addEventListener('click', function () { menu(true); });
  if (chiudi) chiudi.addEventListener('click', function () { menu(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav && nav.classList.contains('aperto')) menu(false); });

  // HOME: le tre foto del loro sito che si danno il cambio, con la frase di ognuna
  var hero = document.querySelector('.hero');
  if (hero) {
    var slide = hero.querySelectorAll('.slide'), punti = hero.querySelectorAll('.puntini button');
    var frase = hero.querySelector('.didascalia span'), i = 0, timer;
    function vai(n) {
      slide[i].classList.remove('su'); punti[i].classList.remove('su'); punti[i].removeAttribute('aria-current');
      i = (n + slide.length) % slide.length;
      void slide[i].offsetWidth;
      slide[i].classList.add('su'); punti[i].classList.add('su'); punti[i].setAttribute('aria-current', 'true');
      if (frase) {
        frase.classList.add('via');
        setTimeout(function () { frase.textContent = slide[i].dataset.frase; frase.classList.remove('via'); }, 380);
      }
      clearTimeout(timer); if (!fermo) timer = setTimeout(function () { vai(i + 1); }, 6500);
    }
    punti.forEach(function (p, n) { p.addEventListener('click', function () { vai(n); }); });
    slide[0].classList.add('su'); punti[0].classList.add('su');
    if (!fermo) timer = setTimeout(function () { vai(1); }, 6500);

    // il vetro appannato e il tergivetro: una volta per visita, poi la pagina e' subito pulita
    var visto = false; try { visto = sessionStorage.getItem('flash-tergi') === '1'; } catch (e) {}
    if (fermo || visto || !io) { hero.classList.add('pronto', 'fatto'); }
    else {
      hero.style.setProperty('--w', hero.offsetWidth + 'px');
      setTimeout(function () { hero.classList.add('pulisci'); }, 350);
      setTimeout(function () { hero.classList.add('pronto'); }, 1100);
      setTimeout(function () { hero.classList.add('fatto'); }, 1750);
      try { sessionStorage.setItem('flash-tergi', '1'); } catch (e) {}
    }
  }

  // bolle di sapone: salgono piano, toccandole scoppiano e poi ne riparte un'altra
  document.querySelectorAll('.bolle').forEach(function (box) {
    if (fermo) return;
    for (var k = 0; k < 11; k++) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'bolla'; b.setAttribute('aria-label', 'Bolla di sapone'); b.tabIndex = -1;
      b.style.left = (4 + Math.random() * 88) + '%';
      b.style.setProperty('--d', (26 + Math.random() * 54) + 'px');
      b.style.setProperty('--t', (11 + Math.random() * 9) + 's');
      b.style.setProperty('--r', (-Math.random() * 18) + 's');
      b.addEventListener('click', function () {
        var me = this; if (me.classList.contains('scoppia')) return;
        me.classList.add('scoppia');
        setTimeout(function () { me.classList.remove('scoppia'); me.style.left = (4 + Math.random() * 88) + '%'; me.style.animation = 'none'; void me.offsetWidth; me.style.animation = ''; }, 450);
      });
      box.appendChild(b);
    }
  });

  if (!io || fermo) return;

  // comparse: titoli con la scia, blocchi che salgono sfalsati, foto scoperte dal tergivetro
  var obs = new IntersectionObserver(function (voci) {
    var n = 0;
    voci.forEach(function (v) {
      if (!v.isIntersecting) return;
      var el = v.target;
      if (el.classList.contains('sale')) el.style.setProperty('--rit', (n++ * 110) + 'ms');
      if (el.classList.contains('foto-r')) el.style.setProperty('--fw', (el.offsetWidth + 20) + 'px');
      el.classList.add('vista'); obs.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.sale,.scia-t,.foto-r').forEach(function (el) { obs.observe(el); });

  // chi siamo: la linea degli anni si riempie scorrendo e accende le tappe
  var linea = document.querySelector('.linea');
  if (linea) {
    var tappe = linea.querySelectorAll('li');
    function riempi() {
      var r = linea.getBoundingClientRect(), meta = innerHeight * 0.62;
      var p = Math.max(0, Math.min(1, (meta - r.top) / r.height));
      linea.style.setProperty('--p', p.toFixed(3));
      tappe.forEach(function (t) { t.classList.toggle('acceso', t.getBoundingClientRect().top < meta); });
    }
    linea.style.setProperty('--p', 0);
    addEventListener('scroll', riempi, { passive: true }); addEventListener('resize', riempi); riempi();
  }
})();

// contatti: il modulo non spedisce niente, prepara il messaggio e apre WhatsApp
(function () {
  var f = document.getElementById('preventivo');
  if (!f) return;
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(f), righe = ['Buongiorno, vorrei un preventivo per: ' + d.get('servizio')];
    if (d.get('dove')) righe.push('Dove: ' + d.get('dove'));
    if (d.get('messaggio')) righe.push(d.get('messaggio'));
    if (d.get('nome')) righe.push(d.get('nome'));
    window.open('https://wa.me/393332844193?text=' + encodeURIComponent(righe.join('\n')), '_blank', 'noopener');
  });
})();
