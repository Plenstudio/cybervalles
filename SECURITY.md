# Seguridad de cybervalles.com

## Cómo avisar de un fallo
Escribe a **info@cybervalles.com** (también en `/.well-known/security.txt`). Indica la dirección afectada y cómo reproducirlo.

## Qué protege la web
- **Sitio estático** (GitHub Pages): no hay servidor propio, base de datos, panel de acceso ni contraseñas que atacar.
- **HTTPS siempre**: activar *Enforce HTTPS* en GitHub Pages.
- **Política de contenido (CSP)** en cada página: solo se ejecutan scripts propios; las conexiones solo van a este sitio y a `api.web3forms.com`. Se recalcula con `python tools/update_csp.py` (hay que ejecutarlo al añadir páginas o scripts en línea).
- **Sin cookies ni analítica**; solo se guarda en el navegador la hora del último envío (anti-spam).
- **Sin dependencias externas** salvo hCaptcha en el formulario: ni librerías, ni fuentes, ni scripts de terceros.
- **Código sin secretos**: la clave de Web3Forms (`access_key`) es pública por diseño; no hay tokens ni contraseñas en el repositorio ni en su historial.

## Formularios
- Se envían a Web3Forms por HTTPS. Protecciones en el navegador: campo trampa (`botcheck`), tiempo mínimo de relleno, un envío por minuto, bloqueo de enlaces, límites de longitud y validación del email y del teléfono.
- **hCaptcha** activo (también en el panel de Web3Forms, que lo valida en su servidor). Carga `js.hcaptcha.com` y un iframe de hcaptcha.com: la CSP de la página del formulario lo permite y está citado en la política de privacidad.
- Las protecciones del navegador **solo frenan a bots sencillos**; el captcha validado en servidor es la defensa principal.
- El formulario usa `method="post"` y `action="/404.html"`: si JavaScript falla, los datos personales **no** viajan en la dirección ni a terceros.

## Lista de comprobación del propietario (fuera del código)
- [ ] **Verificación en dos pasos** en: cuenta de GitHub, cuenta de Cloudflare, cuenta de Web3Forms, el registrador del dominio y el correo de contacto.
- [ ] **Bloqueo de transferencia del dominio** y **privacidad WHOIS** activados en el registrador.
- [ ] **Registro CAA** en el DNS (por ejemplo, `letsencrypt.org`), si el panel lo permite, y **DNSSEC** si lo ofrece.
- [ ] En GitHub: *Settings → Pages → Enforce HTTPS*; *Settings → Code security*: alertas de secretos activadas.
- [ ] Renovar la fecha `Expires` de `.well-known/security.txt` cada año (caduca el 2027-11-26).
- [ ] Revisar de vez en cuando el panel de Web3Forms: envíos al mes y correos recibidos.
- [ ] No poner nunca contraseñas ni claves secretas en archivos del repositorio.

## Limitaciones conocidas
GitHub Pages no permite configurar cabeceras HTTP (`X-Frame-Options`, `frame-ancestors`, `Permissions-Policy`, `HSTS` propio). Para añadirlas hay que poner un proxy delante, como Cloudflare (plan gratuito), que además da protección contra ataques de denegación de servicio.
