# Sistema de Gestión Agrícola - Documentación Completa

## 📋 Índice

- [Resumen del Proyecto](#resumen-del-proyecto)
- [Arquitectura](#arquitectura)
- [Instalación y Desarrollo](#instalación-y-desarrollo)
- [Características Principales](#características-principales)
- [Seguridad](#seguridad)
- [Deployment en Render](#deployment-en-render)
- [API Documentation](#api-documentation)
- [Problemas de Seguridad Encontrados](#problemas-de-seguridad-encontrados)

## 📖 Resumen del Proyecto

Sistema completo de gestión agrícola desarrollado con:

- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Frontend**: React + Vite + Tailwind CSS
- **Base de datos**: PostgreSQL (Render)
- **Deployment**: Render (Blueprint)

### Funcionalidades

- ✅ **Gestión de usuarios** con autenticación JWT
- ✅ **Inventario de repuestos** con filtros avanzados
- ✅ **Control de maquinaria** agrícola
- ✅ **Gestión de proveedores**
- ✅ **Registro de reparaciones**
- ✅ **Dashboard con estadísticas**
- ✅ **Sistema de roles** (Admin/Usuario)
- ✅ **Importación de CSV**
- ✅ **Compras** integrales y relaciones con proveedores, repuestos, maquinaria y reparaciones

## 🏗 Arquitectura

```
Sistema de Gestión Agrícola/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── pages/          # Páginas principales
│   │   ├── services/       # API calls
│   │   └── authContext.tsx # Contexto de autenticación
│   ├── public/            # Assets estáticos
│   └── dist/              # Build de producción
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── controllers/   # Lógica de negocio
│   │   ├── routes/        # Definición de rutas
│   │   ├── middleware/    # Middlewares (auth, etc.)
│   │   └── config/        # Configuración
│   ├── prisma/           # Schema y migraciones
│   └── scripts/          # Scripts de utilidad
└── scripts/              # Scripts de deployment
```

## 🚀 Instalación y Desarrollo

### Prerequisitos

- Node.js 18+
- Git
- PostgreSQL (para desarrollo local)

### Setup Local

1. **Clonar repositorio**

```bash
git clone https://github.com/LeaGuevara01/node.git
cd node
```

2. **Instalar dependencias**

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. **Configurar base de datos**

```bash
cd ../server
# Copiar .env.example a .env y configurar DATABASE_URL
cp .env.example .env
```

4. **Ejecutar migraciones**

```bash
npx prisma migrate dev
npx prisma generate
```

5. **Importar datos iniciales**

```bash
node scripts/import-repuestos.js
```

6. **Iniciar desarrollo**

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

## ✨ Características Principales

### 🔍 Sistema de Filtros Avanzados para Repuestos

#### Backend Features

- **Filtros múltiples**: búsqueda, categoría, ubicación, rango de stock
- **Paginación inteligente**: Optimizada para grandes volúmenes
- **Ordenamiento dinámico**: Por cualquier campo
- **Búsqueda en tiempo real**: Con debounce
- **Estadísticas**: Distribución por categoría y ubicación

#### Frontend Features

- **Interfaz responsive**: Adaptada a móviles y desktop
- **Búsqueda instantánea**: Con autocompletado
- **Badges de stock**: Indicadores visuales (rojo: agotado, amarillo: bajo, verde: disponible)
- **Exportación de datos**: CSV/PDF (próximamente)

#### API Endpoints

```
GET /api/repuestos                    # Lista con filtros
GET /api/repuestos/filtros           # Opciones de filtros
GET /api/repuestos/estadisticas      # Estadísticas detalladas
GET /api/repuestos/busqueda          # Búsqueda rápida
```

#### Parámetros de Filtrado

| Parámetro   | Tipo    | Descripción                             |
| ----------- | ------- | --------------------------------------- |
| `search`    | string  | Búsqueda en nombre, código, descripción |
| `categoria` | string  | Filtro por categoría específica         |
| `ubicacion` | string  | Filtro por ubicación específica         |
| `stockMin`  | number  | Stock mínimo                            |
| `stockMax`  | number  | Stock máximo                            |
| `sinStock`  | boolean | Solo repuestos sin stock                |
| `codigo`    | string  | Búsqueda por código específico          |
| `page`      | number  | Página (paginación)                     |
| `limit`     | number  | Elementos por página                    |
| `sortBy`    | string  | Campo de ordenamiento                   |
| `sortOrder` | string  | Orden (asc/desc)                        |

### 🔐 Sistema de Autenticación

- **JWT Tokens**: Autenticación segura
- **Roles de usuario**: Admin/Usuario
- **Middleware de autorización**: Protección de rutas
- **Hash de contraseñas**: bcrypt

### 📊 Dashboard con Estadísticas

### 🛒 Compras (nuevo módulo)

Relaciones y reglas:

- Compra pertenece a un proveedor y tiene múltiples detalles.
- Cada detalle referencia un repuesto y puede asociarse opcionalmente a maquinaria y/o reparación.
- Al marcar una compra como RECIBIDA, el stock de los repuestos se incrementa automáticamente según cantidades recibidas.

API principal:

```
GET    /api/compras           # Listar con filtros (proveedor, estado, fechas, búsqueda)
GET    /api/compras/stats     # Estadísticas por proveedor/estado y total mensual
GET    /api/compras/:id       # Detalle
POST   /api/compras           # Crear (admin)
PUT    /api/compras/:id       # Actualizar (admin)
DELETE /api/compras/:id       # Eliminar (admin)
```

Estados: PENDIENTE | RECIBIDA | CANCELADA.

- **Resumen general**: Totales de repuestos, maquinaria, etc.
- **Gráficos visuales**: Distribución por categorías
- **Alertas de stock**: Notificaciones de stock bajo
- **Actividad reciente**: Últimas reparaciones y movimientos

## 🔒 Seguridad

### ⚠️ Problemas de Seguridad Identificados

#### 1. **CRÍTICO: Exposición de Credenciales de Base de Datos**

**Ubicación**: Múltiples archivos de documentación
**Problema**:

- URL de base de datos con estructura expuesta: `postgresql://[usuario]:[password]@[host]:[puerto]/[database]`
- Información de infraestructura expuesta
- Credenciales en texto plano

Evita exponer credenciales, hosts o URLs internas en documentación pública. Utiliza variables de entorno y ejemplos genéricos.

**Solución**:

```bash
# 1. Cambiar credenciales en Render Dashboard
# 2. Usar variables de entorno
# 3. Sanitizar documentación
```

#### 2. **MEDIO: Información de Infraestructura**

**Problema**: Exposición de URLs de servicios y estructura de deployment
**Solución**: Generalizar URLs en documentación pública

#### 3. **BAJO: Estructura de Directorios**

**Problema**: Paths absolutos en documentación
**Solución**: Usar paths relativos

### 🛡️ Mejoras de Seguridad Implementadas

1. **Autenticación JWT**

   - Tokens con expiración
   - Middleware de verificación
   - Headers Authorization

2. **Validación de Entrada**

   - Sanitización de parámetros
   - Validación de tipos
   - Protección contra inyección SQL (Prisma ORM)

3. **Control de Acceso**

   - Roles diferenciados (Admin/Usuario)
   - Protección de rutas sensibles
   - Verificación de permisos por endpoint

4. **Variables de Entorno**
   - Configuración sensible en `.env`
   - Separación de entornos (dev/prod)

### 🔧 Recomendaciones de Seguridad

1. **Inmediato**:

   - [ ] Cambiar password de base de datos
   - [ ] Rotar JWT_SECRET (>= 32 chars)
   - [ ] Sanitizar documentación y eliminar URLs sensibles

2. **Corto plazo**:

   - [ ] Implementar rate limiting
   - [ ] Agregar CORS configurado
   - [ ] Logs de seguridad

3. **Mediano plazo**:
   - [ ] Auditoría de dependencias
   - [ ] Implementar HTTPS
   - [ ] Backup automático de DB

## 🚀 Deployment en Render

### Configuración Actual

```yaml
# render.yaml
services:
   - type: web
      name: <backend-service-name>
      env: node
      buildCommand: "cd server && npm ci && npx prisma generate"
      startCommand: "cd server && npm run deploy"
      envVars:
         - key: DATABASE_URL
            sync: false
         - key: JWT_SECRET
            sync: false
         - key: CORS_ORIGIN
            value: https://<your-frontend-domain>

   - type: static
      name: <frontend-service-name>
      buildCommand: "cd client && npm ci && npm run build"
      staticPublishPath: ./client/dist
```

### Pasos de Deployment

1. **Preparación**

```bash
# Verificar y compilar
./deploy.ps1

# Commit cambios
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Render Dashboard**

   - Ir a https://dashboard.render.com/
   - New > Blueprint
   - Conectar repositorio GitHub
   - Seleccionar rama `main`
   - Deploy

3. **Configuración Post-Deploy**
   - Configurar `DATABASE_URL` en variables de entorno
   - Verificar health checks
   - Monitorear logs

### URLs de Deployment

- Backend: https://<backend-service-name>.onrender.com
- Frontend: https://<frontend-service-name>.onrender.com
- API Health: https://<backend-service-name>.onrender.com/api/health

## 📚 API Documentation

### Autenticación

```
POST /api/auth/login     # Login
POST /api/auth/register  # Registro (solo admin)
```

### Repuestos

```
GET    /api/repuestos              # Lista con filtros
POST   /api/repuestos              # Crear (admin)
PUT    /api/repuestos/:id          # Actualizar (admin)
DELETE /api/repuestos/:id          # Eliminar (admin)
GET    /api/repuestos/filtros      # Opciones de filtros
GET    /api/repuestos/estadisticas # Estadísticas
GET    /api/repuestos/busqueda     # Búsqueda rápida
```

### Maquinaria

```
GET    /api/maquinaria     # Lista
POST   /api/maquinaria     # Crear (admin)
PUT    /api/maquinaria/:id # Actualizar (admin)
DELETE /api/maquinaria/:id # Eliminar (admin)
```

### Proveedores

```
GET    /api/proveedores     # Lista
POST   /api/proveedores     # Crear (admin)
PUT    /api/proveedores/:id # Actualizar (admin)
DELETE /api/proveedores/:id # Eliminar (admin)
```

### Reparaciones

```
GET    /api/reparaciones     # Lista
POST   /api/reparaciones     # Crear
PUT    /api/reparaciones/:id # Actualizar
DELETE /api/reparaciones/:id # Eliminar (admin)
```

### Usuarios

```
GET    /api/users         # Lista (admin)
POST   /api/users/register # Crear (admin)
PUT    /api/users/:id     # Actualizar (admin)
DELETE /api/users/:id     # Eliminar (admin)
```

## 📊 Datos de Ejemplo

### CSV de Repuestos

El sistema incluye **124 repuestos** normalizados en `repuestos_normalizado.csv` con:

- 18 categorías diferentes
- 18 ubicaciones diferentes
- Códigos únicos cuando disponibles
- Stock inicial configurado

### Distribución por Ubicación

- JD 4730: 18 repuestos
- Estantería superior: 11 repuestos
- JD 6145/6615: 12 repuestos
- Cofre: 10 repuestos
- JD 670S: 8 repuestos
- Y más...

## 🔄 Mantenimiento

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar modo desarrollo
npm run build        # Compilar para producción
npm start           # Iniciar producción

# Base de datos
npx prisma migrate dev     # Aplicar migraciones
npx prisma generate       # Generar cliente Prisma
npx prisma studio        # Abrir interface visual

# Deployment
./deploy.ps1         # Script de deployment (opcional)
./verify-deploy.ps1  # Verificar deployment (opcional)

### Contenerización

- Backend: Dockerfile en `server/` preparado para producción.
- Monorepo: Dockerfile raíz opcional para construir ambos servicios.
- Recuerda configurar variables de entorno en Render.
```

### Backup de Base de Datos

```bash
# Exportar
pg_dump $DATABASE_URL > backup.sql

# Importar
psql $DATABASE_URL < backup.sql
```

## 📞 Soporte

Para soporte técnico o reportar problemas:

1. Crear issue en GitHub
2. Verificar logs en Render Dashboard
3. Revisar health checks

---

**⚠️ IMPORTANTE**: Después de leer esta documentación, es crítico cambiar las credenciales de base de datos y sanitizar cualquier información sensible antes de hacer público el repositorio.

**Última actualización**: Agosto 2025
**Versión**: 1.0.0
