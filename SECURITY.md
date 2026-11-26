# Seguridad de cybervalles.com

## Cómo avisar de un fallo
Escribe a **info@cybervalles.com** (también en `/.well-known/security.txt`). Indica la dirección afectada y cómo reproducirlo.

## Qué protege la web
- **Sitio estático** (GitHub Pages): no hay servidor propio, base de datos, panel de acceso, formularios ni contraseñas que atacar.
- **Nada de terceros**: ni scripts, ni fuentes, ni librerías, ni iframes, ni analítica, ni cookies, ni almacenamiento local.
- **HTTPS siempre**: activar *Enforce HTTPS* en GitHub Pages. `upgrade-insecure-requests` fuerza HTTPS en cualquier recurso.
- **Política de contenido (CSP)** en cada página: solo scripts, estilos, imágenes y fuentes propios; `connect-src 'none'`, `frame-src 'none'` y `object-src 'none'`. Se recalcula con `python tools/update_csp.py` (hay que ejecutarlo al añadir páginas o scripts en línea).
- **Sin estilos ni scripts en línea** en ninguna página.
- **Anti-clickjacking básico** en `script.js` (oculta la web si se carga en un iframe ajeno). La defensa completa es la cabecera `frame-ancestors`, que GitHub Pages no permite.
- **Enlaces externos** con `rel="noopener noreferrer"`.
- **Código sin secretos**: no hay claves, tokens ni contraseñas en el repositorio ni en su historial.

## Contacto
No hay formulario: el contacto es por email, teléfono y WhatsApp. Así no se recogen datos desde la web ni se depende de servicios externos (antes se usaban Web3Forms y hCaptcha; ya no).

## Lista de comprobación del propietario (fuera del código)
- [ ] **Verificación en dos pasos** en: cuenta de GitHub, registrador del dominio (Namecheap) y correo que reciba `info@cybervalles.com`.
- [ ] **Bloqueo de transferencia del dominio** y **privacidad WHOIS** activados en el registrador.
- [ ] **DMARC** (TXT `_dmarc`) en el DNS, y SPF/DKIM si algún día se envía correo desde el dominio.
- [ ] **Registro CAA** en el DNS (por ejemplo, `letsencrypt.org`), si el panel lo permite, y **DNSSEC** activado.
- [ ] En GitHub: *Settings → Pages → Enforce HTTPS*; *Settings → Code security*: alertas de secretos activadas.
- [ ] Renovar la fecha `Expires` de `.well-known/security.txt` cada año (caduca el 2027-11-26).
- [ ] No poner nunca contraseñas ni claves secretas en archivos del repositorio.

## Limitaciones conocidas
GitHub Pages no permite configurar cabeceras HTTP (`X-Frame-Options`, `frame-ancestors`, `Permissions-Policy`, `HSTS` propio). Para añadirlas hay que poner un proxy delante, como Cloudflare (plan gratuito), que además da protección contra ataques de denegación de servicio.
