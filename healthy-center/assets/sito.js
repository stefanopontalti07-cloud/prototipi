// Healthy Center: il biglietto dell'appuntamento, gli orari di oggi, la barra in basso
(function(){
  var d=document.documentElement, ridotto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!ridotto){ d.classList.add('js'); requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.add('via')})}); }

  // sul biglietto la penna scrive il giorno di oggi
  var giorni=['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'];
  var mesi=['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  var oggi=new Date();
  document.querySelectorAll('.oggi-scritto').forEach(function(el){ el.textContent=giorni[oggi.getDay()]+' '+oggi.getDate()+' '+mesi[oggi.getMonth()]; });
  var riga=document.querySelector('.orari tr[data-g="'+oggi.getDay()+'"]'); if(riga) riga.classList.add('oggi');

  // il team compare uno dopo l'altro
  var team=document.querySelectorAll('.team li');
  if('IntersectionObserver' in window && !ridotto){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visto');io.unobserve(e.target)}})},{rootMargin:'0px 0px -6% 0px'});
    team.forEach(function(x,i){x.style.setProperty('--d',(i%9)*60+'ms');io.observe(x)});
  } else team.forEach(function(x){x.classList.add('visto')});

  // «Lo scrivo sul biglietto»: il trattamento va sul biglietto in basso e nel messaggio WhatsApp
  var barra=document.querySelector('.barra'), scritto=barra&&barra.querySelector('.appunto b'), wa=barra&&barra.querySelector('a.wa');
  var base='https://wa.me/393455832223?text=';
  document.querySelectorAll('.listino button[data-t]').forEach(function(b){
    b.addEventListener('click',function(){
      document.querySelectorAll('.listino button[aria-pressed="true"]').forEach(function(x){ if(x!==b){x.setAttribute('aria-pressed','false');x.textContent='Lo scrivo sul biglietto'} });
      var on=b.getAttribute('aria-pressed')!=='true';
      b.setAttribute('aria-pressed',on?'true':'false'); b.textContent=on?'Scritto sul biglietto':'Lo scrivo sul biglietto';
      var t=on?b.getAttribute('data-t'):'';
      scritto.textContent=t||'lo scegliamo insieme';
      scritto.classList.remove('nuovo'); void scritto.offsetWidth; scritto.classList.add('nuovo');
      wa.href=base+encodeURIComponent(t?'Buongiorno, vorrei fissare un appuntamento per: '+t:'Buongiorno, vorrei fissare un appuntamento');
      barra.classList.add('su');
    });
  });

  if(barra){
    var su=function(){ if(!document.querySelector('.listino button[aria-pressed="true"]')) barra.classList.toggle('su',scrollY>Math.min(innerHeight*.5,380)); };
    addEventListener('scroll',su,{passive:true}); su();
  }
})();
