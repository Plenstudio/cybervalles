// Anti-clickjacking básico (GitHub Pages no permite la cabecera frame-ancestors):
// si la web se carga dentro de un iframe ajeno, se oculta y se intenta salir de él.
if (window.top !== window.self) {
  document.documentElement.style.display = 'none';
  try { window.top.location = window.self.location; } catch (_) {}
}

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

// Formulario (Web3Forms + hCaptcha)
// Preselecciona el servicio si se llega desde una ficha (/?servicio=pentesting#contacto)
const svcParam = new URLSearchParams(location.search).get('servicio');
const svcSelect = document.querySelector('select[name="service"]');
if (svcParam && svcSelect) {
  const opt = [...svcSelect.options].find(o => o.dataset.slug === svcParam);
  if (opt) svcSelect.value = opt.value;
}

const MIN_FILL_MS = 4000;   // menos de 4 s desde que carga la página = bot
const COOLDOWN_MS = 60000;  // 1 envío por minuto y navegador
let formStart = Date.now();

const form = document.getElementById('contact-form');
if (form) {
  const status = form.querySelector('.form__status');
  const button = form.querySelector('button[type="submit"]');
  const fail = (msg) => { status.className = 'form__status err'; status.textContent = msg; };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form__status';
    status.textContent = '';

    const fd = new FormData(form);
    if (fd.get('botcheck')) return;                         // campo trampa
    if (!form.querySelector('#f-consent').checked) return fail('Debes aceptar la política de privacidad.');
    if (Date.now() - formStart < MIN_FILL_MS) return fail('Un momento… vuelve a pulsar «Enviar» en unos segundos.');

    const name = String(fd.get('name') || '').trim();
    const company = String(fd.get('company') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const message = String(fd.get('message') || '').trim();
    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Revisa tu nombre, email y mensaje.');

    // Sin enlaces en nombre, empresa ni mensaje (típico del spam)
    if (/(https?:\/\/|www\.|\w+\.(com|net|org|ru|xyz|top|info)\b)/i.test(name + ' ' + company + ' ' + message)) {
      return fail('Por seguridad, no se admiten enlaces en el formulario. Quítalos y vuelve a enviarlo.');
    }

    const phone = String(fd.get('phone') || '').trim();
    if (phone && !/^[0-9+()\s.\-]{6,20}$/.test(phone)) return fail('Revisa el teléfono: solo números, espacios y + ( ) . -');

    try {
      const last = Number(localStorage.getItem('lastSent') || 0);
      if (Date.now() - last < COOLDOWN_MS) return fail('Ya has enviado un mensaje hace un momento. Espera un minuto.');
    } catch (_) {}

    if (form.querySelector('.h-captcha') && !fd.get('h-captcha-response')) {
      return fail('Completa la verificación de seguridad antes de enviar.');
    }

    fd.delete('botcheck');
    fd.delete('consent');
    fd.set('consentimiento', 'Sí');
    fd.set('name', name); fd.set('company', company); fd.set('email', email); fd.set('message', message);
    fd.set('phone', phone);

    status.textContent = 'Enviando…';
    button.disabled = true;
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        status.className = 'form__status ok';
        status.textContent = 'Gracias, hemos recibido tu consulta. Te responderemos en breve.';
        form.reset();
        formStart = Date.now();
        try { localStorage.setItem('lastSent', String(Date.now())); } catch (_) {}
      } else {
        throw new Error('envío rechazado');
      }
    } catch (err) {
      fail('No se ha podido enviar. Escríbenos a info@cybervalles.com o inténtalo de nuevo.');
    } finally {
      button.disabled = false;
      try { if (window.hcaptcha) window.hcaptcha.reset(); } catch (_) {}
    }
  });
}
