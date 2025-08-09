## Favicon y dominios en Render

- Se actualizó `index.html` para incluir favicon `.ico` y PNG fallbacks.
- Se agregó una regla en `public/_redirects` para servir `/favicon.ico` desde `favicon-elorza.ico`.
- Se renombraron servicios en `render.yaml`:
  - Backend: `sistemagestionagricola-api`
  - Frontend: `sistemagestionagricola`
- Se ajustaron variables:
  - `CORS_ORIGIN` del backend apunta al nuevo frontend: `https://sistemagestionagricola.onrender.com`.
  - `VITE_API_URL` del frontend apunta al backend: `https://sistemagestionagricola-api.onrender.com/api`.

Notas:

- Si los servicios ya existen en Render con nombres antiguos, crea nuevos servicios o renómbralos en el dashboard y actualiza los Custom Domains si aplica.
- Tras el deploy, limpia caché del navegador y verifica que `/favicon.ico` responda 200.
