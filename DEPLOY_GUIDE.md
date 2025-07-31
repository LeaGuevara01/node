# 🚀 Guía de Deploy en Render

## Opciones de Deploy

### Opción 1: Deploy Separado (Recomendado)

Esta opción despliega backend y frontend como servicios independientes, ofreciendo mayor flexibilidad y escalabilidad.

#### Paso 1: Deploy del Backend

1. **Crear Web Service en Render**:

   - Conectar tu repositorio de GitHub
   - Seleccionar "Web Service"
   - Configurar:
     ```
     Name: node-backend
     Environment: Node
     Build Command: cd server && npm install
     Start Command: cd server && npm start
     ```

2. **Variables de entorno del Backend**:

   ```bash
   NODE_ENV=production
   PORT=4000
   JWT_SECRET=[Generate Value]
   DATABASE_URL=[From Database]
   CORS_ORIGIN=https://node-frontend.onrender.com
   ```

3. **Crear Base de Datos**:
   - En Render Dashboard, crear "PostgreSQL Database"
   - Copiar la `DATABASE_URL` a las variables del backend

#### Paso 2: Deploy del Frontend

1. **Crear Static Site en Render**:

   - Conectar el mismo repositorio
   - Seleccionar "Static Site"
   - Configurar:
     ```
     Name: node-frontend
     Build Command: cd client && npm install && npm run build
     Publish Directory: client/dist
     ```

2. **Variables de entorno del Frontend**:
   ```bash
   VITE_API_URL=https://node-backend.onrender.com/api
   ```

#### Usando archivos YAML

Alternativamente, puedes usar los archivos YAML incluidos:

1. **Para Backend** (`render-backend.yaml`):

   ```bash
   # En Render Dashboard
   Blueprint > Import from repo > render-backend.yaml
   ```

2. **Para Frontend** (`render-frontend.yaml`):
   ```bash
   # En Render Dashboard
   Blueprint > Import from repo > render-frontend.yaml
   ```

### Opción 2: Deploy Conjunto (Blueprint)

Usa el archivo `render.yaml` para desplegar todo junto:

1. **En Render Dashboard**:
   - Blueprint > Import from repo
   - Seleccionar `render.yaml`
   - Render creará automáticamente:
     - Backend API
     - Frontend App
     - Base de datos PostgreSQL

## Configuración Pre-Deploy

### 1. Preparar el Backend

Verifica que el archivo `server/package.json` tenga los scripts correctos:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "build": "prisma generate && prisma db push",
    "postinstall": "prisma generate"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. Preparar el Frontend

Verifica que el archivo `client/package.json` tenga:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 3. Variables de Entorno

**Backend (.env en Render)**:

```bash
NODE_ENV=production
PORT=4000
JWT_SECRET=[Render auto-generated]
DATABASE_URL=[From Render PostgreSQL]
CORS_ORIGIN=https://tu-frontend.onrender.com
```

**Frontend (Build-time env vars)**:

```bash
VITE_API_URL=https://tu-backend.onrender.com/api
```

## Proceso de Deploy

### Deploy Automático

1. **Conectar GitHub**: Render se conecta a tu repo
2. **Auto-deploy**: Cada push a main despliega automáticamente
3. **Build logs**: Monitorear en Render dashboard

### Deploy Manual

```bash
# Trigger manual deploy desde Render dashboard
# O hacer push a la rama principal:
git add .
git commit -m "Deploy to production"
git push origin main
```

## Monitoreo Post-Deploy

### Health Checks

El backend incluye endpoint de health check:

```
GET https://tu-backend.onrender.com/api/health
```

### Logs

Monitorear logs en Render Dashboard:

- Backend: Web Service > Logs
- Frontend: Static Site > Deploy logs
- Database: PostgreSQL > Logs

## Troubleshooting

### Errores Comunes

1. **Build Failed**:

   ```bash
   # Verificar dependencias
   cd server && npm install
   cd client && npm install
   ```

2. **Database Connection Error**:

   ```bash
   # Verificar DATABASE_URL en variables de entorno
   # Ejecutar prisma push
   npx prisma db push
   ```

3. **CORS Errors**:

   ```bash
   # Verificar CORS_ORIGIN en backend
   # Debe coincidir con URL del frontend
   ```

4. **API Not Found (404)**:
   ```bash
   # Verificar VITE_API_URL en frontend
   # Debe apuntar al backend correcto
   ```

### Comandos Útiles

```bash
# Verificar build local
npm run build

# Test del backend local
cd server && npm start

# Test del frontend local
cd client && npm run preview

# Verificar variables de entorno
echo $VITE_API_URL
```

## URLs de Ejemplo

Después del deploy exitoso tendrás:

**Backend API**:

- `https://agroservicios-backend.onrender.com/api`
- `https://agroservicios-backend.onrender.com/api/health`
- `https://agroservicios-backend.onrender.com/api/docs`

**Frontend App**:

- `https://agroservicios-frontend.onrender.com`

**Base de Datos**:

- Conectada automáticamente via `DATABASE_URL`

## Seguridad en Producción

### Variables Sensibles

- ✅ `JWT_SECRET`: Generado automáticamente por Render
- ✅ `DATABASE_URL`: Provisto por Render PostgreSQL
- ✅ HTTPS: Habilitado automáticamente por Render

### Headers de Seguridad

El frontend incluye headers de seguridad:

```yaml
headers:
  - path: /*
    name: X-Frame-Options
    value: DENY
  - path: /*
    name: X-Content-Type-Options
    value: nosniff
```

## Escalabilidad

### Planes de Render

- **Free**: Perfecto para desarrollo/testing
- **Starter**: Para aplicaciones en producción
- **Standard**: Para mayor tráfico y recursos

### Optimizaciones

1. **CDN**: Render incluye CDN global para static sites
2. **Gzip**: Compresión automática habilitada
3. **Cache**: Headers de cache configurados para assets
4. **Health Checks**: Monitoreo automático del backend

## Backup y Mantenimiento

### Base de Datos

```bash
# Backup automático incluido en Render PostgreSQL
# Backup manual via pg_dump
pg_dump DATABASE_URL > backup.sql
```

### Monitoreo

- **Uptime**: Render monitorea automáticamente
- **Logs**: Disponibles en dashboard por 7 días (Free plan)
- **Metrics**: CPU, memoria, requests disponibles

---

## 🎯 Resumen Rápido

### Deploy Rápido (Opción 1)

1. Push tu código a GitHub
2. Crear PostgreSQL Database en Render
3. Crear Web Service para backend con `render-backend.yaml`
4. Crear Static Site para frontend con `render-frontend.yaml`
5. Configurar variables de entorno
6. ¡Deploy automático!

### Deploy Todo-en-Uno (Opción 2)

1. Push tu código a GitHub
2. Importar `render.yaml` como Blueprint
3. Render crea todo automáticamente
4. Configurar variables de entorno si es necesario
5. ¡Listo!
