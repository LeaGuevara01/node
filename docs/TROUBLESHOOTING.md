# 🐛 Troubleshooting - Solución de Problemas Comunes

## 🔍 Problemas de Desarrollo

### 1. **Error: Puerto en Uso**

**Síntoma**:

```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solución**:

```bash
# Windows
netstat -ano | findstr :4000
taskkill /F /PID [process-id]

# Linux/Mac
lsof -ti:4000 | xargs kill -9

# O cambiar puerto en .env
PORT=4001
```

### 2. **Error: Base de Datos no Conecta**

**Síntoma**:

```
Error: Can't reach database server at `localhost:5432`
```

**Solución**:

```bash
# Verificar DATABASE_URL en .env
echo $DATABASE_URL

# Regenerar cliente Prisma
cd server
npx prisma generate

# Sincronizar schema
npx prisma migrate deploy

# Test de conexión
npx prisma db pull
```

### 3. **Error: Módulos no Encontrados**

**Síntoma**:

```
Module not found: Can't resolve 'module-name'
```

**Solución**:

```bash
# Limpiar e instalar dependencias
rm -rf node_modules package-lock.json
npm install

# O instalar módulo específico
npm install module-name
```

### 4. **Error: CORS en Desarrollo**

**Síntoma**:

```
Access to fetch blocked by CORS policy
```

**Solución**:

```env
# Verificar CORS_ORIGIN en server/.env
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Verificar VITE_API_URL en client/.env
VITE_API_URL=http://localhost:4000/api
```

## 🚀 Problemas de Deployment

### 1. **Render Detecta Python en lugar de Node.js**

**Síntoma**:

```
==> Using Python version 3.13.4 (default)
ERROR: Could not open requirements file
```

**Solución**:

```yaml
# Verificar render.yaml en raíz
services:
  - type: web
    name: backend
    env: node # ← Importante
    rootDir: ./server
```

### 2. **Build Falló en Render**

**Síntoma**:

```
Build failed with exit code 1
```

**Diagnóstico**:

```bash
# Test build local
cd client
npm run build

cd ../server
npm install
npx prisma generate
```

**Solución**:

```yaml
# render.yaml - Comandos correctos
buildCommand: npm install && npx prisma generate
startCommand: npx prisma migrate deploy && npm start
```

### 3. **Variables de Entorno Faltantes**

**Síntoma**:

```
Environment variable DATABASE_URL is not defined
```

**Solución**:

```bash
# En Render Dashboard:
# 1. Backend Service → Environment
# 2. Agregar todas las variables:
DATABASE_URL=postgresql://...
JWT_SECRET=tu_secret_key
CORS_ORIGIN=https://tu-frontend.onrender.com
NODE_ENV=production
```

### 4. **Frontend no Carga**

**Síntoma**: Página en blanco o 404

**Solución**:

```bash
# Verificar build output path
# client/dist/ (no client/build/)

# Verificar _redirects para SPA
echo "/*    /index.html   200" > client/public/_redirects
```

## 🔐 Problemas de Autenticación

### 1. **JWT Token Inválido**

**Síntoma**:

```json
{ "error": "Token inválido" }
```

**Solución**:

```javascript
// Verificar JWT_SECRET en backend
console.log("JWT_SECRET configured:", !!process.env.JWT_SECRET);

// Regenerar token
localStorage.removeItem("token");
// Login nuevamente
```

### 2. **Credenciales Rechazadas**

**Síntoma**:

```json
{ "error": "Credenciales inválidas" }
```

**Solución**:

```bash
# Verificar usuario en base de datos
npx prisma studio
# Buscar en tabla User

# Reset password si es necesario
node scripts/reset-password.js
```

### 3. **Rol Insuficiente**

**Síntoma**:

```json
{ "error": "Acceso denegado" }
```

**Solución**:

```sql
-- Actualizar rol en base de datos
UPDATE "User" SET role = 'ADMIN' WHERE email = 'tu@email.com';
```

## 📊 Problemas de Base de Datos

### 1. **Error de Migración**

**Síntoma**:

```
Migration failed: Foreign key constraint
```

**Solución**:

```bash
# Reset database (CUIDADO: borra datos)
npx prisma migrate reset

# O aplicar migración específica
npx prisma migrate deploy
```

### 2. **Schema Desincronizado**

**Síntoma**:

```
Unknown column in field list
```

**Solución**:

```bash
# Aplicar migraciones en prod
npx prisma migrate deploy

# O generar migración
npx prisma migrate dev --name sync-schema
```

### 3. **Datos de Prueba Faltantes**

**Síntoma**: Base de datos vacía después de deploy

**Solución**:

```bash
# Importar datos iniciales
cd server
node scripts/import-repuestos.js

# Crear usuario admin
node scripts/create-admin.js
```

## 🌐 Problemas de Red y Conectividad

### 1. **API No Responde**

**Síntoma**: Timeout en requests

**Diagnóstico**:

```bash
# Test health check
curl https://tu-backend.onrender.com/api/health

# Test local
curl http://localhost:4000/api/health
```

**Solución**:

```javascript
// Verificar que servidor esté ejecutándose
console.log("Server running on port:", process.env.PORT);

// Verificar rutas registradas
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});
```

### 2. **Lentitud en Render**

**Síntoma**: Requests lentos en producción

**Solución**:

```javascript
// Optimizar queries de base de datos
const repuestos = await prisma.repuesto.findMany({
  select: { id: true, nombre: true, stock: true }, // Solo campos necesarios
  where: whereClause,
  take: 10, // Limitar resultados
});

// Implementar cache simple
const cache = new Map();
app.get("/api/heavy-endpoint", (req, res) => {
  const cacheKey = req.url;
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }
  // ... computar resultado
  cache.set(cacheKey, result);
  res.json(result);
});
```

## 🔧 Problemas de Desarrollo Específicos

### 1. **Hot Reload no Funciona**

**Síntoma**: Cambios no se reflejan automáticamente

**Solución**:

```bash
# Vite: verificar configuración
# vite.config.js
export default {
  server: {
    watch: {
      usePolling: true
    }
  }
}

# Nodemon: verificar configuración
# package.json
"scripts": {
  "dev": "nodemon --watch src src/index.js"
}
```

### 2. **Prisma Studio no Abre**

**Síntoma**: Error al ejecutar `npx prisma studio`

**Solución**:

```bash
# Verificar DATABASE_URL
echo $DATABASE_URL

# Regenerar cliente
npx prisma generate

# Usar puerto alternativo
npx prisma studio --port 5556
```

### 3. **Error de ESLint/Prettier**

**Síntoma**: Errores de formato o linting

**Solución**:

```bash
# Arreglar automáticamente
npm run lint -- --fix

# Formatear código
npx prettier --write "src/**/*.{js,jsx,ts,tsx}"

# Desactivar temporalmente
// eslint-disable-next-line rule-name
```

## 📱 Problemas de Frontend Específicos

### 1. **Componente no Renderiza**

**Diagnóstico**:

```javascript
// Debug con logs
console.log("Component props:", props);
console.log("Component state:", state);

// Verificar importaciones
import { ComponentName } from "./path"; // Named import
import ComponentName from "./path"; // Default import
```

### 2. **Estado no se Actualiza**

**Solución**:

```javascript
// React state updates
const [state, setState] = useState(initialState);

// Usar callback para updates basados en estado anterior
setState((prevState) => ({ ...prevState, newValue }));

// useEffect dependencies
useEffect(() => {
  // effect
}, [dependency1, dependency2]); // ← Incluir todas las dependencias
```

### 3. **Routing no Funciona en Producción**

**Síntoma**: 404 en rutas directas en producción

**Solución**:

```bash
# Agregar _redirects en public/
echo "/*    /index.html   200" > client/public/_redirects

# O configurar en render.yaml
- type: static
  name: frontend
  buildCommand: npm install && npm run build
  staticPublishPath: ./client/dist
  headers:
    - key: X-Frame-Options
      value: DENY
  routes:
    - type: rewrite
      source: /*
      destination: /index.html
```

## 🆘 Comandos de Emergencia

### Reset Completo de Desarrollo

```bash
# Parar todos los procesos
pkill -f node
pkill -f npm

# Limpiar dependencias
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
rm -rf server/node_modules server/package-lock.json

# Reinstalar todo
npm install
cd client && npm install
cd ../server && npm install

# Regenerar Prisma
cd server
npx prisma generate
npx prisma migrate dev

# Restart
npm run dev
```

### Logs de Debug

```bash
# Backend logs detallados
DEBUG=* npm run dev

# Frontend build verbose
npm run build -- --verbose

# Prisma query logs
# En schema.prisma
generator client {
  provider = "prisma-client-js"
  log      = ["query", "info", "warn", "error"]
}
```

### Verificación de Health

```bash
# Script de health check completo
#!/bin/bash
echo "🔍 Health Check Completo..."

# 1. Verificar puertos
lsof -i :3000 && echo "✅ Frontend port" || echo "❌ Frontend port"
lsof -i :4000 && echo "✅ Backend port" || echo "❌ Backend port"

# 2. Verificar base de datos
cd server && npx prisma db pull &>/dev/null && echo "✅ Database" || echo "❌ Database"

# 3. Verificar APIs
curl -s http://localhost:4000/api/health | grep "OK" &>/dev/null && echo "✅ API Health" || echo "❌ API Health"

# 4. Verificar frontend
curl -s http://localhost:3000 | grep "html" &>/dev/null && echo "✅ Frontend" || echo "❌ Frontend"

echo "✅ Health check completado"
```

## 📞 Escalation Path

### 1. **Problemas No Resueltos**

1. Crear issue en GitHub con:

   - Descripción detallada del problema
   - Pasos para reproducir
   - Logs relevantes
   - Configuración del entorno

2. Incluir información del sistema:

```bash
node --version
npm --version
git --version
# En Windows: systeminfo
# En Linux/Mac: uname -a
```

### 2. **Emergencias de Producción**

1. **Rollback** a versión anterior
2. **Verificar** logs en Render Dashboard
3. **Contactar** al equipo de desarrollo
4. **Documentar** el incidente para futuras referencias

---

**💡 Tip**: Mantén este documento actualizado con nuevos problemas y soluciones que encuentres.
