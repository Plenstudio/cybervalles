// Menú móvil
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Año del pie
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Anti-clickjacking básico (GitHub Pages no permite la cabecera frame-ancestors):
// si la web se carga dentro de un iframe ajeno, se oculta y se intenta salir de él.
if (window.top !== window.self) {
  document.documentElement.style.display = 'none';
  try { window.top.location = window.self.location; } catch (_) {}
}
