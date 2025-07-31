# Backend Node.js

API RESTful para gestión de taller agrícola.

## Stack

- Node.js
- Express
- Prisma ORM
- PostgreSQL

## Seguridad

- JWT
- Roles

## Calidad

- Tests (Jest, Supertest)
- Linter (ESLint)

## Endpoints principales

- `/api/auth/register` — Registro de usuario
- `/api/auth/login` — Login y obtención de token JWT
- `/api/maquinaria` — Gestión de maquinaria
- `/api/repuestos` — Gestión de repuestos
- `/api/proveedores` — Gestión de proveedores
- `/api/reparaciones` — Gestión de reparaciones

## Migraciones

- Prisma gestiona el esquema y migraciones de la base de datos

## Variables de entorno

Ver `.env.example` para configuración de base de datos y JWT

## Despliegue en Render

- Configurar variables de entorno en Render
- Usar `npm start` para producción

## Ejecución local

```bash
npm run dev
```

## Ejecución de tests

```bash
npm test
```
