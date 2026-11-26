# cybervalles.com

Web estática (HTML/CSS/JS, sin build) para GitHub Pages. Sin formularios ni recursos de terceros.

- `index.html`: la página principal. `servicios/*.html`: una ficha de detalle por servicio (las tarjetas de la portada enlazan a ellas; los botones abren un correo con el asunto del servicio o un chat de WhatsApp). `styles.css` y `script.js` (menú, año y anti-clickjacking). Al cambiar uno de los dos, sube el `?v=` en los HTML.
- `en/`: versión en inglés (`en/index.html`, `en/services/*.html`, `en/privacy.html`, `en/cookies.html`, `en/legal-notice.html`). El selector ES/EN está en el menú y hay `hreflang` en cada página.
- `aviso-legal.html`, `privacidad.html`, `cookies.html`: borradores; sustituir los datos entre corchetes y revisar con asesoría legal.
- `404.html`, `robots.txt`, `sitemap.xml`, `.well-known/security.txt` (hace falta `.nojekyll`).
- **CSP:** cada página lleva una política de contenido en una `<meta>`. Tras añadir páginas o scripts en línea, ejecuta `python tools/update_csp.py`.
- **Dominio:** en GitHub, Settings → Pages → Custom domain: `cybervalles.com` (crea el archivo `CNAME`) y activa Enforce HTTPS. DNS: 4 registros A (185.199.108.153, .109.153, .110.153, .111.153) y CNAME `www` → `<usuario>.github.io`.
- **Pendiente antes de publicar:** datos legales entre corchetes (`[...]`) en las páginas legales: razón social, NIF y calle.

Resumen de protecciones y lista de comprobación del propietario: `SECURITY.md`.
