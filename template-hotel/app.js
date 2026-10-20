/* Template HOTEL LAGO — comportamento condiviso (nessuna libreria) */

// Anno footer
document.querySelectorAll('[data-anno]').forEach(el => { el.textContent = new Date().getFullYear(); });

// Header che si scurisce allo scroll
const header = document.querySelector('.header');
if (header) {
  const aggiorna = () => header.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', aggiorna, { passive: true });
  aggiorna();
}

// Menu mobile
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (menuBtn && nav) {
  const imposta = aperto => {
    nav.classList.toggle('aperto', aperto);
    menuBtn.setAttribute('aria-expanded', aperto);
    menuBtn.setAttribute('aria-label', aperto ? 'Chiudi il menu' : 'Apri il menu');
  };
  menuBtn.addEventListener('click', () => imposta(!nav.classList.contains('aperto')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => imposta(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('aperto')) imposta(false); });
}

// Reveal su scroll
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visibile'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visibile'));
}

// Hero video: parte solo se ha senso (motion ok, niente Save-Data, file esistente)
const heroVideo = document.querySelector('.hero-media video');
if (heroVideo) {
  const riduci = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const risparmio = navigator.connection && navigator.connection.saveData;
  if (riduci || risparmio) {
    heroVideo.remove(); // resta il poster/img di fallback
  } else {
    heroVideo.addEventListener('error', () => heroVideo.remove(), true);
    const p = heroVideo.play();
    if (p) p.catch(() => {}); // autoplay negato → resta il poster
  }
}

// Form richiesta disponibilità: compone messaggio WhatsApp o email (zero backend)
const form = document.querySelector('#form-richiesta');
if (form) {
  const leggi = () => {
    const v = id => (form.querySelector('#' + id) || {}).value || '';
    const righe = [
      'Richiesta disponibilità — ' + document.title.split('—')[0].trim(),
      'Nome: ' + v('f-nome'),
      'Arrivo: ' + v('f-arrivo') + '  Partenza: ' + v('f-partenza'),
      'Ospiti: ' + v('f-ospiti') + (v('f-camera') ? '  Camera: ' + v('f-camera') : ''),
    ];
    if (v('f-note')) righe.push('Note: ' + v('f-note'));
    return righe.join('\n');
  };
  const valido = () => form.reportValidity();
  form.addEventListener('submit', e => e.preventDefault());
  const waBtn = form.querySelector('[data-invia="whatsapp"]');
  const mailBtn = form.querySelector('[data-invia="email"]');
  if (waBtn) waBtn.addEventListener('click', () => {
    if (!valido()) return;
    open('https://wa.me/' + waBtn.dataset.numero + '?text=' + encodeURIComponent(leggi()), '_blank');
  });
  if (mailBtn) mailBtn.addEventListener('click', () => {
    if (!valido()) return;
    location.href = 'mailto:' + mailBtn.dataset.email +
      '?subject=' + encodeURIComponent('Richiesta disponibilità') +
      '&body=' + encodeURIComponent(leggi());
  });
}
