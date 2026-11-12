(function () {
  var fermo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function scuoti(c) {
    if (fermo) return;
    c.classList.remove('scuoti');
    void c.offsetWidth;
    c.classList.add('scuoti');
  }

  // toccando un cartellino, oscilla sul suo chiodo
  document.querySelectorAll('.cartellino').forEach(function (c) {
    c.addEventListener('click', function () { scuoti(c); });
    c.addEventListener('animationend', function () { c.classList.remove('scuoti'); });
  });

  var el = document.querySelectorAll('.compare');
  if (!('IntersectionObserver' in window)) {
    el.forEach(function (x) { x.classList.add('vista'); });
    return;
  }
  var io = new IntersectionObserver(function (voci) {
    voci.forEach(function (v) {
      if (!v.isIntersecting) return;
      var x = v.target;
      x.classList.add('vista');
      // quando la scheda arriva, il suo cartellino dondola una volta
      var c = x.querySelector('.cartellino');
      if (c) setTimeout(function () { scuoti(c); }, 250 + (parseInt(getComputedStyle(x).getPropertyValue('--i'), 10) || 0) * 90);
      io.unobserve(x);
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  el.forEach(function (x) { io.observe(x); });
})();
