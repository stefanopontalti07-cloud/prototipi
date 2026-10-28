// Sushi Land: il cerchio a pennello, la barra in basso, le liste che compaiono, la comanda del menù
(function(){
  var ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // il pennello: la maschera scopre la pennellata nel verso in cui si dipinge
  var guida = document.querySelector('.enso .guida');
  if (guida) {
    var L = Math.ceil(guida.getTotalLength());
    guida.style.strokeDasharray = L;
    guida.style.strokeDashoffset = ridotto ? 0 : L;
    if (!ridotto) {
      requestAnimationFrame(function(){ requestAnimationFrame(function(){
        guida.style.transition = 'stroke-dashoffset 1.15s cubic-bezier(.25,1,.5,1) .2s';
        guida.style.strokeDashoffset = 0;
      }); });
    }
  }

  // barra Chiama / Come arrivare: compare dopo la prima schermata
  var barra = document.querySelector('.barra');
  if (barra) {
    var soglia = function(){ return Math.min(window.innerHeight * 0.6, 420); };
    var su = function(){ barra.classList.toggle('su', window.scrollY > soglia()); };
    window.addEventListener('scroll', su, {passive:true}); su();
  }

  // solo le liste vere compaiono una voce dopo l'altra
  var voci = document.querySelectorAll('.rivela');
  if ('IntersectionObserver' in window && !ridotto && voci.length) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
    }, {rootMargin:'0px 0px -8% 0px'});
    voci.forEach(function(v, i){ v.classList.add('attesa'); v.style.setProperty('--d', (i % 5) * 70 + 'ms'); io.observe(v); });
  }

  // la comanda: si tocca un piatto e il numero si scrive sul foglietto (6 a testa per volta, come da menù)
  var foglio = document.querySelector('.foglietto');
  if (foglio) {
    var scritti = foglio.querySelector('.scritti'), conta = foglio.querySelector('.conta'), avviso = foglio.querySelector('.avviso');
    var scelti = [];
    var aggiorna = function(){
      scritti.textContent = scelti.length ? scelti.join(', ') : '';
      conta.textContent = scelti.length + ' su 6';
      avviso.hidden = scelti.length < 6;
      foglio.classList.toggle('aperto', scelti.length > 0);
    };
    document.querySelectorAll('.lista button[data-n]').forEach(function(b){
      b.addEventListener('click', function(){
        var n = b.getAttribute('data-n'), i = scelti.indexOf(n);
        if (i > -1) { scelti.splice(i, 1); b.setAttribute('aria-pressed', 'false'); }
        else if (scelti.length < 6) { scelti.push(n); b.setAttribute('aria-pressed', 'true'); }
        else { avviso.hidden = false; return; }
        aggiorna();
      });
    });
    foglio.querySelector('button').addEventListener('click', function(){
      scelti = [];
      document.querySelectorAll('.lista button[aria-pressed=true]').forEach(function(b){ b.setAttribute('aria-pressed', 'false'); });
      aggiorna();
    });
  }
})();
