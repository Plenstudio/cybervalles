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

// Formulario (Web3Forms)
const form = document.getElementById('contact-form');
if (form) {
  const status = form.querySelector('.form__status');
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form__status';
    status.textContent = 'Enviando…';
    button.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        status.classList.add('ok');
        status.textContent = 'Gracias, hemos recibido tu consulta. Te responderemos en breve.';
        form.reset();
      } else {
        throw new Error(data.message || 'Error');
      }
    } catch (err) {
      status.classList.add('err');
      status.textContent = 'No se ha podido enviar. Escríbenos a info@cybervalles.com o inténtalo de nuevo.';
    } finally {
      button.disabled = false;
    }
  });
}
