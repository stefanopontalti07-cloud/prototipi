document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const header = document.querySelector('.site-header');
navToggle.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => header.classList.remove('nav-open'));
});

// Build menu tabs + panels from MENU_DATA
const tabsEl = document.getElementById('menu-tabs');
const contentEl = document.getElementById('menu-content');
const eur = n => '€ ' + n.toFixed(2).replace('.', ',');

MENU_DATA.forEach((category, i) => {
  const tab = document.createElement('button');
  tab.className = 'menu-tab' + (i === 0 ? ' active' : '');
  tab.type = 'button';
  tab.textContent = category.name;
  tab.dataset.target = category.id;
  tab.setAttribute('role', 'tab');
  tabsEl.appendChild(tab);

  const panel = document.createElement('div');
  panel.className = 'menu-panel' + (i === 0 ? ' active' : '');
  panel.id = category.id;
  const grid = document.createElement('div');
  grid.className = 'menu-grid';
  category.items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'menu-item';
    row.innerHTML = `
      <div>
        <div class="menu-item-name">${item.name}</div>
        ${item.desc ? `<div class="menu-item-desc">${item.desc}</div>` : ''}
      </div>
      <div class="menu-item-price">${eur(item.price)}</div>
    `;
    grid.appendChild(row);
  });
  panel.appendChild(grid);
  contentEl.appendChild(panel);
});

tabsEl.addEventListener('click', e => {
  const btn = e.target.closest('.menu-tab');
  if (!btn) return;
  tabsEl.querySelectorAll('.menu-tab').forEach(t => t.classList.remove('active'));
  contentEl.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(btn.dataset.target).classList.add('active');
});

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Back to top button
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
