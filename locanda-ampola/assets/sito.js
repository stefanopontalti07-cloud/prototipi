(function(){
  var ridotto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // barra in basso dopo il primo scorrimento
  var barra = document.getElementById('barra');
  function scorri(){ barra.classList.toggle('su', scrollY > 300) }
  addEventListener('scroll', scorri, {passive:true}); scorri();

  // richiesta camera: compone il messaggio con le date e apre WhatsApp
  var f = document.getElementById('richiesta');
  if (f) {
    var oggi = new Date().toISOString().slice(0, 10);
    f.arrivo.min = oggi; f.partenza.min = oggi;
    f.arrivo.addEventListener('change', function(){ f.partenza.min = f.arrivo.value || oggi });
    function data(v){ var p = v.split('-'); return p[2] + '/' + p[1] + '/' + p[0] }
    f.addEventListener('submit', function(e){
      e.preventDefault();
      var t = 'Buongiorno, vorrei sapere se avete una camera libera dal ' + data(f.arrivo.value) + ' al ' + data(f.partenza.value) +
        ', per ' + f.adulti.value + (f.adulti.value === '1' ? ' adulto' : ' adulti') +
        (f.bambini.value !== '0' ? ' e ' + f.bambini.value + (f.bambini.value === '1' ? ' bambino' : ' bambini') : '') +
        ', formula ' + f.formula.value + '. Grazie!';
      location.href = 'https://wa.me/393475173158?text=' + encodeURIComponent(t);
    });
  }

  // le voci delle liste compaiono sfalsate (solo quelle sotto la piega)
  if (!('IntersectionObserver' in window) || ridotto) return;
  var o = new IntersectionObserver(function(v){
    var n = 0;
    v.forEach(function(x){ if (!x.isIntersecting) return; var el = x.target;
      el.style.setProperty('--d', (n++ * 70) + 'ms'); el.classList.add('visto'); el.classList.remove('attesa'); o.unobserve(el) });
  }, {rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rivela').forEach(function(el){ if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('attesa'); o.observe(el) } });
})();
