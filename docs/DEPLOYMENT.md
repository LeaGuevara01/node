# 🚀 Guía de Deployment en Render

## 📋 Prerequisitos

- Cuenta en [Render](https://render.com) (gratuita)
- Repositorio en GitHub
- Código preparado con `render.yaml`

## ⚡ Deployment Rápido

### 1. **Preparar el Repositorio**

```bash
# Verificar que render.yaml existe
ls render.yaml

# Commit todos los cambios
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. **Crear Servicios en Render**

#### Opción A: Blueprint (Recomendado)

1. Ir a [Render Dashboard](https://dashboard.render.com/)
2. Click en **"New"** → **"Blueprint"**
3. Conectar repositorio GitHub
4. Seleccionar rama `main`
5. Click **"Apply"**

#### Opción B: Manual

**Backend:**

1. **"New"** → **"Web Service"**
2. Conectar repositorio
3. Configurar:
   - **Root Directory**: `server`
  - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`

**Frontend:**

1. **"New"** → **"Static Site"**
2. Conectar repositorio
3. Configurar:
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 3. **Configurar Base de Datos**

```bash
# En Render Dashboard
# 1. "New" → "PostgreSQL"
# 2. Nombrar: "sistema-gestion-agricola-db"
# 3. Copiar DATABASE_URL generada
```

### 4. **Variables de Entorno**

#### Backend Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui
CORS_ORIGIN=https://tu-frontend.onrender.com
NODE_ENV=production
```

#### Frontend Environment Variables

```env
VITE_API_URL=https://tu-backend.onrender.com/api
```

## 📄 Configuración render.yaml

```yaml
services:
  # Backend - Node.js API
  - type: web
    name: sistemagestionagricola
    env: node
    plan: starter
    rootDir: ./server
  buildCommand: npm install && npx prisma generate
  startCommand: npx prisma migrate deploy && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: sistema-gestion-agricola-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ORIGIN
        value: https://sistemagestionagricola-frontend.onrender.com

  # Frontend - Static React App
  - type: static
    name: sistemagestionagricola-frontend
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: ./client/dist
    envVars:
      - key: VITE_API_URL
        value: https://sistemagestionagricola.onrender.com/api

databases:
  - name: sistema-gestion-agricola-db
    databaseName: sistema_gestion_agricola
    user: elorza
    plan: starter
```

## 🔧 Scripts de Deployment

### Verificación Pre-Deploy

```powershell
# Crear script verify-deploy.ps1
Write-Host "🔍 Verificando configuración para deployment..."

# 1. Verificar archivos esenciales
$files = @("render.yaml", "server/package.json", "client/package.json")
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file existe"
    } else {
        Write-Host "❌ $file NO ENCONTRADO"
        exit 1
    }
}

# 2. Verificar builds locales
Write-Host "📦 Verificando build del cliente..."
cd client
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build exitoso"
} else {
    Write-Host "❌ Frontend build falló"
    exit 1
}

cd ../server
Write-Host "🔍 Verificando servidor..."
npm run start --dry-run
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend configuración OK"
} else {
    Write-Host "❌ Backend configuración falló"
    exit 1
}

Write-Host "🚀 Todo listo para deployment!"
```

### Post-Deploy Setup

```bash
# (Opcional) Importar datos iniciales si aplica
node scripts/import-repuestos.js

# Verificar health check
curl https://tu-backend.onrender.com/api/health
```

## 🌐 URLs de Producción

Una vez deployado, tendrás:

- **Frontend**: `https://sistemagestionagricola-frontend.onrender.com`
- **Backend API**: `https://sistemagestionagricola.onrender.com`
- **API Health**: `https://sistemagestionagricola.onrender.com/api/health`
- **Base de Datos**: Interno en Render

## 🔍 Verificación Post-Deploy

### 1. **Health Check del Backend**

```bash
curl https://sistemagestionagricola.onrender.com/api/health
```

Respuesta esperada:

```json
{
  "status": "OK",
  "timestamp": "2025-08-03T12:00:00.000Z",
  "database": "connected"
}
```

### 2. **Frontend Funcionando**

- Navegar a la URL del frontend
- Verificar que carga sin errores
- Probar login y navegación

### 3. **Conectividad Frontend-Backend**

```javascript
// En la consola del navegador
fetch("https://sistemagestionagricola.onrender.com/api/health")
  .then((res) => res.json())
  .then((data) => console.log("✅ Backend conectado:", data))
  .catch((err) => console.error("❌ Error de conexión:", err));
```

## 🔒 Configuración de Seguridad

### Variables de Entorno Seguras

```bash
# En Render Dashboard
# ✅ Hacer:
DATABASE_URL=postgresql://... # Auto-generada por Render
JWT_SECRET=[Generar aleatoria] # 256-bit random string
CORS_ORIGIN=https://tu-frontend.onrender.com

# ❌ NO hacer:
DATABASE_URL=postgresql://user:123@... # Credenciales débiles
JWT_SECRET=mysecret # Secreto predecible
CORS_ORIGIN=* # Permitir todos los orígenes
```

### HTTPS y Dominios

```yaml
# render.yaml - Configuración SSL automática
- type: static
  name: frontend
  customDomains:
    - domain: tu-dominio.com
      certificateType: letsencrypt
```

## 🐛 Solución de Problemas

### Build Falló

```bash
# Revisar logs en Render Dashboard
# Problemas comunes:

# 1. Dependencias faltantes
npm install --production=false

# 2. Variables de entorno faltantes
# Verificar en Dashboard > Environment

# 3. Error de Prisma
npx prisma generate
npx prisma migrate deploy
```

### Frontend no Carga

```bash
# 1. Verificar build path
# Build Output: ./client/dist (no ./client/build)

# 2. Verificar variables de entorno
VITE_API_URL=https://backend.onrender.com/api

# 3. Verificar redirects para SPA
# En client/dist/_redirects:
/*    /index.html   200
```

### Error de CORS

```javascript
// En server/src/index.js
const corsOptions = {
  origin: process.env.CORS_ORIGIN.split(","),
  credentials: true,
  optionsSuccessStatus: 200,
};
```

### Base de Datos no Conecta

```bash
# 1. Verificar DATABASE_URL en Environment Variables
# 2. Ejecutar migraciones (prod)
npx prisma migrate deploy

# 3. Verificar conexión
npx prisma db pull
```

## 📊 Monitoreo

### Logs en Tiempo Real

```bash
# En Render Dashboard
# 1. Ir a tu servicio
# 2. Tab "Logs"
# 3. Monitor en tiempo real
```

### Métricas de Rendimiento

- **CPU Usage**: < 50% en plan starter
- **Memory Usage**: < 512MB en plan starter
- **Response Time**: < 2s para APIs
- **Uptime**: > 99% esperado

### Alertas

```yaml
# Configurar en Render Dashboard
healthCheckPath: /api/health
```

## 🔄 Updates y Redeploys

### Auto-Deploy desde GitHub

```bash
# Cada push a main triggers redeploy automático
git add .
git commit -m "Update: nueva feature"
git push origin main
# ✅ Render automáticamente redeploya
```

### Manual Deploy

```bash
# En Render Dashboard
# 1. Ir a tu servicio
# 2. Click "Manual Deploy"
# 3. Seleccionar rama
# 4. Click "Deploy"
```

## 💰 Costos

### Plan Starter (Gratis)

- **Web Services**: 750 horas/mes gratis
- **Static Sites**: Ilimitado gratis
- **PostgreSQL**: 90 días gratis, luego $7/mes

### Optimización de Costos

```yaml
# render.yaml
services:
  - type: web
    plan: starter # Gratis
    autoDeploy: false # Solo deploy manual

  - type: static
    plan: starter # Siempre gratis
```

## 🎯 Próximos Pasos

Después del deployment:

1. **Configurar dominio personalizado** (opcional)
2. **Setup de backups** automáticos de DB
3. **Monitoreo con alertas**
4. **CDN** para assets estáticos
5. **Analytics** y métricas de usuario

Para más información, consultar:

- [`SECURITY.md`](./SECURITY.md) - Configuración de seguridad
- [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) - Problemas comunes
- [`API_REFERENCE.md`](./API_REFERENCE.md) - Documentación completa de API
