# Backend — API REST

Node.js + Express + Prisma (PostgreSQL). JWT para auth.

## Correr

```bash
npm i
cp .env.example .env
npx prisma generate && npx prisma db push
npm run dev   # desarrollo
# npm start   # producción
```

## Endpoints

- POST /api/auth/register
- POST /api/auth/login
- CRUD /api/maquinaria
- CRUD /api/repuestos
- CRUD /api/proveedores
- CRUD /api/reparaciones
- GET /api/health

Docs: /api/docs (si existe openapi.yaml)

## Config (.env)

- PORT=4000
- DATABASE_URL=...
- JWT_SECRET=...
- CORS_ORIGIN=http://localhost:5173

## Notas

- Respuestas JSON consistentes (404/400/500).
- Paginación simple: page, limit. Orden: sortBy, sortOrder.
- Ver docs/SECURITY.md para prácticas recomendadas.
