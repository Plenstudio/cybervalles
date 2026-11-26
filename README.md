# cybervalles.com

Web estática (HTML/CSS/JS, sin build) para GitHub Pages.

- `index.html`: la página principal. `servicios/*.html`: una ficha de detalle por servicio (las tarjetas de la portada enlazan a ellas; los botones llevan a `/?servicio=<slug>#contacto`, que preselecciona el servicio en el formulario). `styles.css` y `script.js` (menú y formulario). Al cambiar uno de los dos, sube el `?v=` en los HTML.
- `aviso-legal.html`, `privacidad.html`, `cookies.html`: borradores; sustituir los datos entre corchetes y revisar con asesoría legal.
- `404.html`, `robots.txt`, `sitemap.xml`, `.well-known/security.txt` (hace falta `.nojekyll`).
- **CSP:** cada página lleva una política de contenido en una `<meta>`. Tras añadir páginas o scripts en línea, ejecuta `python tools/update_csp.py`.
- **Dominio:** en GitHub, Settings → Pages → Custom domain: `cybervalles.com` (crea el archivo `CNAME`) y activa Enforce HTTPS. DNS: 4 registros A (185.199.108.153, .109.153, .110.153, .111.153) y CNAME `www` → `<usuario>.github.io`.
- **Pendiente antes de publicar:** email, teléfono y dirección de ejemplo (`TODO` en `index.html`, `[...]` en las páginas legales).

Resumen de protecciones y lista de comprobación del propietario: `SECURITY.md`.
