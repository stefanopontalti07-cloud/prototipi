// Giori: la grappa che sale dietro l'etichetta, i cartellini e la scala del colore, gli orari di oggi
(function(){
  var d=document.documentElement, ridotto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!ridotto){ d.classList.add('js'); requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.add('via')})}); }

  var voci=document.querySelectorAll('.cartellini li,.colori li');
  voci.forEach(function(x,i){ if(x.parentNode.classList.contains('cartellini')) x.style.setProperty('--r',((i*37)%7-3)*.6+'deg'); });
  if('IntersectionObserver' in window && !ridotto){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visto');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    voci.forEach(function(x,i){x.style.setProperty('--d',(i%6)*60+'ms');io.observe(x)});
  } else voci.forEach(function(x){x.classList.add('visto')});

  var riga=document.querySelector('.orari tr[data-g="'+new Date().getDay()+'"]'); if(riga) riga.classList.add('oggi');

  var barra=document.querySelector('.barra');
  if(barra){ var su=function(){barra.classList.toggle('su',scrollY>Math.min(innerHeight*.6,420))}; addEventListener('scroll',su,{passive:true}); su(); }
})();
