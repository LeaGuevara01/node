# 🔒 CONFIGURACIÓN SEGURA DE DEPLOY

## ⚠️ GESTIÓN SEGURA DE CREDENCIALES

Este proyecto implementa un sistema de configuración centralizada que:

- ✅ Lee variables de entorno automáticamente
- ✅ Valida configuraciones requeridas
- ✅ Genera archivos de deploy dinámicamente
- ✅ Separa templates seguros de credenciales reales

## 🛠️ CONFIGURACIÓN SEGURA PARA DEPLOY

### **1. Configuración de Variables de Entorno**

#### Paso 1: Crear archivo .env local

```bash
# Copiar template y configurar
cp .env.template .env
# Editar .env con tus credenciales reales (NO committear)
```

#### Paso 2: Configurar variables requeridas

```bash
# === REQUERIDAS ===
JWT_SECRET=tu_jwt_secret_64_caracteres_minimo
DATABASE_URL=postgresql://usuario:pass@host:puerto/db

# === OPCIONALES (se usan valores por defecto) ===
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://tu-frontend.onrender.com
RENDER_BACKEND_SERVICE_NAME=tu-backend-service
RENDER_FRONTEND_SERVICE_NAME=tu-frontend-service
```

### **2. Generar Configuraciones de Deploy**

#### Opción A: Usar script de generación

```bash
# Generar archivos de deploy con tus credenciales
node scripts/generate-deploy-config.js
```

Este script:

- ✅ Lee variables de tu archivo .env
- ✅ Genera render.yaml con credenciales reales
- ✅ Genera client/.env.production
- ⚠️ Los archivos generados NO se suben a Git (están en .gitignore)

#### Opción B: Variables en Dashboard de Render

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Crea servicios manualmente
3. Configura variables de entorno en la web usando los valores de tu .env local

### **3. Deploy Seguro**

#### Blueprint con archivos generados:

```bash
# 1. Configurar variables locales
cp .env.template .env
# Editar .env con credenciales reales

# 2. Generar configuraciones
node scripts/generate-deploy-config.js

# 3. Verificar que no hay credenciales en staging
git status  # render.yaml debe estar en "Changes not staged"

# 4. Commit solo archivos seguros
git add .
git commit -m "Deploy configuration"
git push

# 5. Usar render.yaml local para Blueprint
```

## 🔧 CONFIGURACIÓN CENTRALIZADA

### Sistema de configuración implementado:

**`server/src/config/index.js`**

- ✅ Lee variables de entorno automáticamente
- ✅ Proporciona valores por defecto seguros
- ✅ Valida configuraciones requeridas
- ✅ Genera URLs dinámicamente

**`scripts/generate-deploy-config.js`**

- ✅ Genera render.yaml con tus credenciales
- ✅ Genera archivos .env.production
- ✅ Usa variables de entorno como fuente única

### Ejemplo de uso en código:

```javascript
const config = require("./config");

// En lugar de process.env.JWT_SECRET
const jwtSecret = config.JWT_SECRET;

// Validación automática
config.validate(); // Lanza error si faltan variables críticas
```

## 🛡️ ARCHIVOS SEGUROS VS SENSIBLES

### ✅ Seguros para Git:

- `.env.template` - Template sin credenciales
- `server/src/config/index.js` - Sistema de configuración
- `scripts/generate-deploy-config.js` - Generador de configs
- `render.yaml.template` - Template sin credenciales

### 🚫 NUNCA subir a Git:

- `.env` - Variables de entorno con credenciales reales
- `render.yaml` - Archivo generado con credenciales
- `client/.env.production` - Archivo generado
- `credenciales-locales.md` - Notas con credenciales

## 🚀 PROCESO COMPLETO DE DEPLOY

1. **Preparación**:

   ```bash
   cp .env.template .env
   # Configurar variables reales en .env
   ```

2. **Generación**:

   ```bash
   node scripts/generate-deploy-config.js
   ```

3. **Verificación**:

   ```bash
   node scripts/verify-deploy.ps1
   ```

4. **Commit seguro**:

   ```bash
   git add .  # Solo archivos seguros
   git commit -m "Configuración de deploy"
   git push
   ```

5. **Deploy**:
   - Usar render.yaml local para Blueprint
   - O configurar variables manualmente en Dashboard

## 🔍 VERIFICACIÓN DE SEGURIDAD

```bash
# Verificar que no hay credenciales en staging
git status | grep -E "(render\.yaml|\.env$)"

# Las credenciales deben estar solo en archivos locales
grep -r "postgresql://" . --exclude-dir=.git --exclude-dir=node_modules
```

## 💡 BENEFICIOS DE ESTE SISTEMA

- 🛡️ **Seguridad**: Credenciales nunca en el repositorio
- 🔧 **Flexibilidad**: Configuración dinámica por entorno
- ✅ **Validación**: Errores tempranos si faltan variables
- 📦 **Automatización**: Generación automática de configs
- 🔄 **Mantenimiento**: Cambios centralizados en un solo lugar
