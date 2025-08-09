# 🌾 Sistema de Gestión Agrícola — Guía Rápida

Estado: producción | Node >= 18 | Licencia: MIT

## Qué es

Plataforma web para gestionar maquinaria, repuestos, proveedores, reparaciones y usuarios. Frontend en React + Vite + Tailwind. Backend en Node.js + Express + Prisma (PostgreSQL). Deploy en Render.

## Estructura

- client: SPA React
- server: API REST Express
- docs: guías y referencias
- scripts: utilidades de deploy

## Empezar en 5 minutos

```bash
# Requisitos
node -v   # >= 18
npm -v    # >= 8

# Instalar y preparar
npm i
cp server/.env.example server/.env
cp client/.env.example client/.env

# Base de datos
cd server && npx prisma generate && npx prisma db push

# Desarrollo (dos servicios)
cd .. && npm run dev
```

URLs de dev

- Frontend: http://localhost:5173
- API: http://localhost:4000/api
- Health: http://localhost:4000/api/health

## Scripts útiles (raíz)

- npm run dev: levantar frontend y backend
- npm run dev:server | dev:client: servicios por separado
- npm run build: construir client y server

## Configuración mínima

Backend (server/.env)

- PORT=4000
- DATABASE_URL=postgresql://user:pass@host:5432/db
- JWT_SECRET=valor-seguro
- CORS_ORIGIN=http://localhost:5173

Frontend (client/.env)

- VITE_API_URL=http://localhost:4000/api

## Documentación

- docs/DEPLOYMENT.md: deploy en Render
- docs/API_REFERENCE.md: endpoints principales
- docs/SECURITY.md: prácticas recomendadas
- docs/TROUBLESHOOTING.md: errores comunes
- docs/DOCUMENTATION_STYLE.md: guía de estilo de documentación y comentarios

## Licencia

MIT. Ver LICENSE.

— Documentación breve y accionable. Profundiza en docs/ cuando lo necesites.
