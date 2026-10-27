(function(){
  var ridotto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // barra in basso dopo il primo scorrimento
  var barra = document.getElementById('barra');
  function scorri(){ barra.classList.toggle('su', scrollY > 300) }
  addEventListener('scroll', scorri, {passive:true}); scorri();

  // le voci delle liste compaiono sfalsate (solo quelle sotto la piega)
  if (!('IntersectionObserver' in window) || ridotto) return;
  var o = new IntersectionObserver(function(v){
    var n = 0;
    v.forEach(function(x){ if (!x.isIntersecting) return; var el = x.target;
      el.style.setProperty('--d', (n++ * 70) + 'ms'); el.classList.add('visto'); el.classList.remove('attesa'); o.unobserve(el) });
  }, {rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rivela').forEach(function(el){ if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('attesa'); o.observe(el) } });
})();
