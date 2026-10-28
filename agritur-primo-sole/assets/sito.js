// Agritur Primo Sole: barra in basso dopo la prima schermata, liste che compaiono una dopo l'altra
(function(){
  var ridotto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var barra = document.querySelector('.barra');
  if (barra) {
    var su = function(){ barra.classList.toggle('su', window.scrollY > Math.min(window.innerHeight * 0.6, 420)); };
    window.addEventListener('scroll', su, {passive:true}); su();
  }
  var voci = document.querySelectorAll('.rivela');
  if ('IntersectionObserver' in window && !ridotto && voci.length) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
    }, {rootMargin:'0px 0px -8% 0px'});
    voci.forEach(function(v, i){ v.classList.add('attesa'); v.style.setProperty('--d', (i % 4) * 80 + 'ms'); io.observe(v); });
  }
})();
