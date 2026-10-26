(function(){
  var ridotto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var IO = 'IntersectionObserver' in window;

  // barra in basso dopo il primo scorrimento
  var barra = document.getElementById('barra');
  function scorri(){ barra.classList.toggle('su', scrollY > 300) }
  addEventListener('scroll', scorri, {passive:true}); scorri();

  // orari: il giorno di oggi in evidenza
  var oggi = document.querySelector('#orari li[data-g="' + new Date().getDay() + '"]');
  if (oggi) oggi.classList.add('oggi');

  // pannello forato: finita l'apertura, ogni attrezzo oscilla quando lo si tocca
  var pan = document.getElementById('pannello');
  if (pan) {
    var att = pan.querySelectorAll('.attrezzo');
    setTimeout(function(){ att.forEach(function(a){ a.style.animation = 'none' }) }, ridotto ? 0 : 2300);
    att.forEach(function(a){
      function muovi(){ if (ridotto) return; a.style.animation = 'none'; void a.getBoundingClientRect(); a.style.animation = 'oscilla2 .8s cubic-bezier(.25,1,.5,1)' }
      a.addEventListener('click', muovi);
      a.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); muovi() } });
    });
  }

  // la chiave si taglia quando arriva sullo schermo
  var ch = document.getElementById('chiave');
  if (ch && !ridotto && IO) {
    new IntersectionObserver(function(v, o){ if (v[0].isIntersecting) { o.disconnect(); ch.classList.add('taglia'); setTimeout(function(){ ch.classList.add('fatta') }, 1350) } }, {threshold:.6}).observe(ch);
  } else if (ch) ch.classList.add('taglia','fatta');

  // le voci delle liste compaiono sfalsate (solo quelle sotto la piega)
  if (!IO || ridotto) return;
  var o = new IntersectionObserver(function(v){
    var n = 0;
    v.forEach(function(x){ if (!x.isIntersecting) return; var el = x.target;
      el.style.setProperty('--d', (n++ * 60) + 'ms'); el.classList.add('visto'); el.classList.remove('attesa'); o.unobserve(el) });
  }, {rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rivela').forEach(function(el){ if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('attesa'); o.observe(el) } });
})();
