# 🌾 Sistema de Gestión Agrícola - Documentación Unificada

[![Deploy Status](https://img.shields.io/badge/deploy-ready-green.svg)](https://render.com)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-production--ready-success.svg)]()

---

## 📋 **Descripción del Proyecto**

Sistema web moderno y completo para la gestión integral de talleres agrícolas, desarrollado con tecnologías de vanguardia y arquitectura escalable.

### **Funcionalidades Principales**

- 🚜 **Gestión de Maquinarias**: Registro, seguimiento, mantenimiento y estados
- 🔧 **Control de Repuestos**: Inventario inteligente con filtros avanzados y control de stock
- 👥 **Gestión de Proveedores**: Directorio completo con contactos y productos
- 🛠️ **Reparaciones**: Historial detallado y seguimiento de servicios
- 🔐 **Sistema de Usuarios**: Autenticación JWT con roles diferenciados (Admin/User)
- 📊 **Dashboard Inteligente**: Estadísticas y métricas en tiempo real
- 🎨 **UI/UX Moderna**: Interfaz responsive y optimizada para todos los dispositivos

---

## 🏗️ **Arquitectura del Sistema**

### **Stack Tecnológico Completo**

#### **Frontend**

- **React 18** - Framework principal con hooks modernos
- **Vite** - Build tool ultra-rápido con Hot Module Replacement
- **Tailwind CSS** - Framework CSS utility-first para diseño responsive
- **React Router v6** - Enrutamiento SPA moderno
- **Axios** - Cliente HTTP para comunicación con API

#### **Backend**

- **Node.js 18+** - Runtime JavaScript del servidor
- **Express.js** - Framework web minimalista y robusto
- **Prisma ORM** - ORM moderno con type-safety
- **PostgreSQL** - Base de datos relacional robusta
- **JWT** - Autenticación stateless segura
- **bcrypt** - Hashing seguro de contraseñas

#### **DevOps & Deployment**

- **Render** - Plataforma cloud nativa con auto-scaling
- **Blueprint Architecture** - Configuración declarativa de infraestructura
- **Environment Variables** - Configuración segura por entorno
- **Health Checks** - Monitoreo automático de servicios

---

## 🚀 **Inicio Rápido**

### **1. Prerrequisitos**

```bash
# Versiones mínimas requeridas
node --version  # >= 18.0.0
npm --version   # >= 8.0.0
```

### **2. Instalación Completa**

```bash
# Clonar repositorio
git clone https://github.com/LeaGuevara01/node.git
cd node

# Instalar dependencias del monorepo
npm install

# Configurar backend
cd server
cp .env.example .env
# Editar .env con tus configuraciones

# Configurar frontend
cd ../client
cp .env.example .env
# Editar .env con tus configuraciones

# Volver al directorio raíz
cd ..
```

### **3. Configuración de Base de Datos**

```bash
# Desde el directorio server/
cd server

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# (Opcional) Poblar con datos de ejemplo
npx prisma db seed
```

### **4. Desarrollo Local**

```bash
# Ejecutar desarrollo completo (backend + frontend)
npm run dev

# O ejecutar servicios por separado:
npm run dev:server  # Solo backend (puerto 4000)
npm run dev:client  # Solo frontend (puerto 5173)
```

### **5. URLs de Desarrollo**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **Health Check**: http://localhost:4000/api/health
- **Prisma Studio**: http://localhost:5555 (ejecutar `npx prisma studio`)

---

## 🔧 **Sistema de Optimización y Modularización**

### **Arquitectura de Componentes Compartidos**

El sistema ha sido completamente optimizado con una arquitectura modular que elimina redundancias y mejora la mantenibilidad:

#### **Nuevos Sistemas Implementados**

1. **`detailsStyles.js`** - Estilos específicos para páginas de detalles
2. **`detailsUtils.jsx`** - Utilidades compartidas (upload, iconos, validaciones)
3. **`DetailsComponents.jsx`** - Componentes reutilizables para todas las páginas de detalles

#### **Componentes Disponibles**

```jsx
import {
  DetailsHeader, // Header con título y navegación
  DetailsAlert, // Alertas de error/éxito consistentes
  DetailsLoading, // Estados de carga unificados
  DetailsSection, // Secciones con títulos estandarizados
  FieldWithIcon, // Campos con iconos y datos
  SimpleField, // Campos de datos simples
  StatCard, // Tarjetas de estadísticas
  ActionButton, // Botones de acción consistentes
  ImageUpload, // Componente de upload de imágenes
} from '../components/shared/DetailsComponents';
```

#### **Patrón de Uso para Nuevas Entidades**

```jsx
function EntityDetails({ token }) {
  // Estados estándar
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Hooks estándar
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados de carga
  if (loading) return <DetailsLoading message="Cargando entidad..." />;
  if (error && !entity) return <DetailsAlert type="error" message={error} />;

  return (
    <div className={DETAILS_CONTAINER.main}>
      <div className={DETAILS_CONTAINER.maxWidth}>
        <DetailsHeader title={entity.name} onBack={() => navigate('/entities')} />

        <div className={DETAILS_CONTAINER.grid}>
          <DetailsSection title="Información Básica">
            <FieldWithIcon icon={COMMON_ICONS.document} label="Código" value={entity.code} />
            <SimpleField label="Descripción" value={entity.description} />
          </DetailsSection>
        </div>
      </div>
    </div>
  );
}
```

### **Beneficios de la Optimización**

#### **Mantenibilidad Mejorada**

- ✅ **Código DRY**: Eliminación de duplicaciones
- ✅ **Componentes Reutilizables**: Una implementación, múltiples usos
- ✅ **Estilos Centralizados**: Consistencia visual automática
- ✅ **Testing Simplificado**: Componentes aislados y testeable

#### **Performance Optimizada**

- ✅ **Bundle Size Reducido**: Menos código duplicado
- ✅ **Tree Shaking Efectivo**: Imports específicos
- ✅ **Lazy Loading**: Componentes cargados bajo demanda
- ✅ **Render Optimizado**: Menos re-renders innecesarios

#### **Developer Experience**

- ✅ **IntelliSense Mejorado**: TypeScript-ready components
- ✅ **Documentación Integrada**: Props documentadas
- ✅ **Hot Reload Rápido**: Cambios reflejados instantáneamente
- ✅ **Debugging Simplificado**: Componentes con nombres descriptivos

---

## 🔒 **Configuración de Seguridad**

### **Variables de Entorno**

#### **Backend (.env)**

```env
# Entorno
NODE_ENV=development
PORT=4000

# Seguridad
JWT_SECRET=tu-secret-jwt-de-64-caracteres-minimo-para-seguridad-optima
JWT_EXPIRES_IN=24h

# Base de Datos
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/database?schema=public

# CORS
CORS_ORIGIN=http://localhost:5173

# Upload (opcional)
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

#### **Frontend (.env)**

```env
# API Backend
VITE_API_URL=http://localhost:4000/api

# Configuración de App
VITE_APP_NAME=Sistema de Gestión Agrícola
VITE_APP_VERSION=1.0.0

# Features (opcional)
VITE_ENABLE_DEBUG=true
VITE_MAX_UPLOAD_SIZE=5242880
```

### **Autenticación y Autorización**

#### **Sistema JWT**

- 🔑 **Tokens seguros** con expiración configurable
- 🔒 **Refresh tokens** para sesiones prolongadas
- 👤 **Roles granulares**: Admin (CRUD completo) / User (lectura y creación limitada)
- 🛡️ **Middleware de protección** en todas las rutas sensibles

#### **Seguridad de Contraseñas**

- 🔐 **bcrypt** con salt rounds configurables
- 📏 **Validación de complejidad** (mínimo 8 caracteres, mayúsculas, números)
- 🚫 **Prevención de ataques** de fuerza bruta
- 🔄 **Políticas de rotación** recomendadas

---

## 📚 **API Documentation**

### **Endpoints de Autenticación**

```http
# Iniciar Sesión
POST /api/auth/login
Content-Type: application/json

{
  \"email\": \"admin@ejemplo.com\",
  \"password\": \"contraseña123\"
}

# Respuesta exitosa
{
  \"token\": \"eyJhbGciOiJIUzI1NiIs...\",
  \"user\": {
    \"id\": 1,
    \"email\": \"admin@ejemplo.com\",
    \"role\": \"Admin\"
  }
}

# Registrar Usuario (Solo Admin)
POST /api/auth/register
Authorization: Bearer {token}
Content-Type: application/json

{
  \"email\": \"nuevo@ejemplo.com\",
  \"password\": \"contraseña123\",
  \"role\": \"User\"
}
```

### **Endpoints de Recursos**

#### **Maquinarias**

```http
GET    /api/maquinarias          # Listar con paginación y filtros
GET    /api/maquinarias/:id      # Obtener por ID
POST   /api/maquinarias          # Crear (Admin/User)
PUT    /api/maquinarias/:id      # Actualizar (Admin)
DELETE /api/maquinarias/:id      # Eliminar (Admin)
```

#### **Repuestos**

```http
GET    /api/repuestos            # Listar con filtros avanzados
GET    /api/repuestos/:id        # Obtener por ID
GET    /api/repuestos/filtros    # Obtener opciones de filtros
POST   /api/repuestos            # Crear (Admin/User)
PUT    /api/repuestos/:id        # Actualizar (Admin)
DELETE /api/repuestos/:id        # Eliminar (Admin)
```

#### **Proveedores**

```http
GET    /api/proveedores          # Listar todos
GET    /api/proveedores/:id      # Obtener por ID
POST   /api/proveedores          # Crear (Admin)
PUT    /api/proveedores/:id      # Actualizar (Admin)
DELETE /api/proveedores/:id      # Eliminar (Admin)
```

#### **Reparaciones**

```http
GET    /api/reparaciones         # Listar (Admin)
GET    /api/reparaciones/:id     # Obtener por ID (Admin)
POST   /api/reparaciones         # Crear (Admin)
PUT    /api/reparaciones/:id     # Actualizar (Admin)
DELETE /api/reparaciones/:id     # Eliminar (Admin)
```

### **Sistema de Filtros Avanzados**

#### **Filtros de Repuestos**

```http
GET /api/repuestos?categoria=motor&ubicacion=deposito&stockMin=10&stockMax=100&search=filtro

# Parámetros disponibles:
# - categoria: string
# - ubicacion: string
# - stockMin: number
# - stockMax: number
# - search: string (búsqueda en nombre, código, descripción)
# - sinStock: boolean (solo items sin stock)
# - page: number (paginación)
# - limit: number (elementos por página)
```

---

## 📊 **Dashboard y Estadísticas**

### **Métricas Principales**

El dashboard proporciona una vista completa del estado del sistema:

- 📈 **Estadísticas en Tiempo Real**: Contadores automáticos de todas las entidades
- 🎯 **Estado de Stock**: Alertas automáticas para repuestos con stock bajo
- 🔧 **Estado de Maquinarias**: Resumen de estados operativos
- 👥 **Actividad de Usuarios**: Registro de acciones recientes
- 📋 **Reparaciones Pendientes**: Lista de trabajos en progreso

### **Características del Dashboard**

```jsx
// Componentes del Dashboard
const stats = {
  maquinarias: maquinarias.length,
  repuestos: repuestos.length,
  proveedores: proveedores.length,
  reparaciones: reparaciones.length
};

// Tarjetas interactivas con navegación directa
<StatsCard
  type=\"repuestos\"
  title=\"Repuestos\"
  value={stats.repuestos}
  onClick={() => setActiveSection('repuestos')}
/>
```

---

## 🚀 **Deployment en Producción**

### **Configuración de Render**

El proyecto está configurado para deployment automático en Render usando Blueprint:

#### **render.yaml**

```yaml
services:
  - type: web
    name: sistemagestionagricola
    env: node
    plan: free
    rootDir: ./server
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: sistemagestionagricola-db
          property: connectionString

  - type: web
    name: sistemagestionagricola-frontend
    env: static
    plan: free
    rootDir: ./client
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist

databases:
  - name: sistemagestionagricola-db
    plan: free
```

### **Scripts de Deployment**

#### **Windows (deploy.ps1)**

```powershell
# Verificar configuración
if (!(Test-Path \"render.yaml\")) {
    Write-Error \"render.yaml no encontrado\"
    exit 1
}

# Construir frontend
cd client
npm install
npm run build

# Preparar backend
cd ../server
npm install
npx prisma generate

Write-Host \"✅ Proyecto listo para deployment en Render\"
```

#### **Linux/Mac (deploy.sh)**

```bash
#!/bin/bash
set -e

# Verificar configuración
if [ ! -f \"render.yaml\" ]; then
    echo \"❌ render.yaml no encontrado\"
    exit 1
fi

# Construir frontend
cd client
npm install
npm run build

# Preparar backend
cd ../server
npm install
npx prisma generate

echo \"✅ Proyecto listo para deployment en Render\"
```

### **URLs de Producción**

- **Frontend**: https://sistemagestionagricola-frontend.onrender.com
- **Backend API**: https://sistemagestionagricola.onrender.com/api
- **Health Check**: https://sistemagestionagricola.onrender.com/api/health

---

## 🧪 **Testing y Calidad**

### **Scripts de Testing**

```bash
# Ejecutar todos los tests
npm test

# Tests con coverage
npm run test:coverage

# Tests del backend únicamente
cd server && npm test

# Tests del frontend únicamente
cd client && npm test

# Linting y formato de código
npm run lint
npm run format

# Type checking (si se usa TypeScript)
npm run type-check
```

### **Herramientas de Calidad**

- **ESLint** - Linting de JavaScript/JSX
- **Prettier** - Formateo automático de código
- **Jest** - Framework de testing para backend
- **React Testing Library** - Testing de componentes React
- **Cypress** - Testing E2E (configuración opcional)

---

## 🔧 **Correcciones y Optimizaciones Implementadas**

### **Problemas Resueltos Recientemente**

#### **✅ Dashboard - Estadísticas de Reparaciones**

- **Problema**: Dashboard mostraba 0 reparaciones aunque había datos
- **Causa**: API devolvía `{data: Array(1), pagination: {...}}` pero el código buscaba solo el array directo
- **Solución**: Agregado `reparacionesData?.data` en el procesamiento
- **Resultado**: Estadísticas funcionando correctamente

#### **✅ MaquinariaDetails - Tag de Estado**

- **Problema**: Tag de estado en ubicación incorrecta
- **Solución**: Movido desde header a sección de información para mejor UX
- **Beneficio**: Mejor organización visual y consistencia

#### **✅ RepuestoForm - Placeholders Responsivos**

- **Problema**: Placeholders no descriptivos en diferentes tamaños de pantalla
- **Solución**: Implementación responsive:
  - Pantallas pequeñas: \"D\" - \"H\"
  - Pantallas grandes: \"Desde\" - \"Hasta\"
- **Implementación**: Inputs duplicados con clases `sm:hidden` y `hidden sm:block`

#### **✅ ProveedorForm - Filtros Vacíos**

- **Problema**: Combos de ciudades y productos sin opciones
- **Solución**: Mejorada función `fetchOpcionesFiltros`:
  - Ciudades extraídas de direcciones usando `extractCiudadFromDireccion`
  - Productos extraídos de strings/arrays con parsing inteligente

#### **✅ ProveedorDetails - Arquitectura Modernizada**

- **Problema**: Código desorganizado con errores de estilos
- **Solución**: Reescritura completa usando componentes compartidos
- **Beneficios**:
  - Consistencia visual con otros Details
  - Código más limpio y mantenible
  - Funcionalidades mejoradas (upload de imágenes, etc.)

#### **✅ Backend - Endpoints Completos**

- **Problema**: Endpoint faltante `GET /api/proveedores/:id`
- **Solución**: Implementación completa con validaciones
- **Resultado**: API consistente para todas las entidades

### **Arquitectura de Estilos Unificada**

```javascript
// Sistema de estilos modular
import { DETAILS_CONTAINER } from '../styles/detailsStyles'; // Para páginas de detalles
import { MODAL_STYLES } from '../styles/repuestoStyles'; // Para modales
import { FORM_STYLES } from '../styles/formStyles'; // Para formularios

// Componentes compartidos
import {
  DetailsHeader,
  DetailsSection,
  FieldWithIcon,
} from '../components/shared/DetailsComponents';

// Utilidades compartidas
import { handleFileUpload, COMMON_ICONS } from '../utils/detailsUtils.jsx';
```

---

## 🚨 **Troubleshooting**

### **Problemas Comunes de Desarrollo**

#### **Error: Puerto en Uso**

```bash
# Windows
netstat -ano | findstr :4000
taskkill /F /PID [process-id]

# Linux/Mac
lsof -ti:4000 | xargs kill -9
```

#### **Error: Base de Datos**

```bash
cd server

# Regenerar cliente Prisma
npx prisma generate

# Reset completo de DB (⚠️ elimina datos)
npx prisma migrate reset

# Aplicar migraciones en producción
npx prisma migrate deploy
```

#### **Error: Variables de Entorno**

```bash
# Verificar archivos .env
ls -la server/.env client/.env

# Validar variables requeridas
node -e \"console.log(process.env.JWT_SECRET)\"
```

### **Problemas de Deployment**

#### **Error: Render detecta Python**

Si Render detecta Python en lugar de Node.js:

1. Verificar que `render.yaml` está en el directorio raíz
2. Confirmar que cada servicio especifica `env: node`
3. Crear archivo `.nvmrc` con la versión de Node:
   ```
   18.17.0
   ```

#### **Error: Build Failure**

```bash
# Limpiar caché local
rm -rf node_modules package-lock.json
npm install

# Limpiar build anterior
rm -rf client/dist server/dist

# Rebuild completo
npm run build
```

#### **Error: Database Connection**

1. Verificar `DATABASE_URL` en variables de entorno de Render
2. Confirmar que la base de datos está activa
3. Verificar conectividad desde logs de Render

---

## 📁 **Estructura del Proyecto Completa**

```
📦 node/
├── 📂 client/                           # Frontend React
│   ├── 📂 public/                       # Assets estáticos
│   │   ├── 📄 index.html
│   │   └── 🎨 favicon.ico
│   ├── 📂 src/
│   │   ├── 📂 components/               # Componentes React
│   │   │   ├── 📂 shared/               # Componentes compartidos optimizados
│   │   │   │   └── 📄 DetailsComponents.jsx
│   │   │   ├── 📄 Sidebar.jsx
│   │   │   ├── 📄 StatsCard.jsx
│   │   │   ├── 📄 RoleGuard.jsx
│   │   │   └── 📄 *EditModal.jsx        # Modales de edición
│   │   ├── 📂 pages/                    # Páginas principales
│   │   │   ├── 📄 Dashboard.jsx         # Dashboard principal
│   │   │   ├── 📄 *Form.jsx            # Formularios de listado
│   │   │   └── 📄 *Details.jsx         # Páginas de detalles optimizadas
│   │   ├── 📂 services/                 # API calls
│   │   │   └── 📄 api.js
│   │   ├── 📂 hooks/                    # Custom hooks
│   │   │   └── 📄 useFormHooks.js
│   │   ├── 📂 utils/                    # Utilidades
│   │   │   ├── 📄 detailsUtils.jsx      # Utilidades para detalles (optimizado)
│   │   │   ├── 📄 colorUtils.js
│   │   │   ├── 📄 dataUtils.js
│   │   │   └── 📄 *Utils.js             # Utilidades específicas por entidad
│   │   ├── 📂 styles/                   # Sistema de estilos modular
│   │   │   ├── 📄 detailsStyles.js      # Estilos para páginas de detalles
│   │   │   ├── 📄 repuestoStyles.js     # Estilos para formularios y modales
│   │   │   └── 📄 index.css             # Estilos globales Tailwind
│   │   ├── 📄 App.jsx                   # Componente raíz
│   │   ├── 📄 main.jsx                  # Entry point
│   │   └── 📄 authContext.tsx           # Context de autenticación
│   ├── 📄 package.json
│   ├── 📄 vite.config.js
│   ├── 📄 tailwind.config.js
│   └── 📄 .env.example
├── 📂 server/                           # Backend Node.js
│   ├── 📂 src/
│   │   ├── 📂 controllers/              # Lógica de negocio
│   │   │   ├── 📄 authController.js
│   │   │   ├── 📄 maquinariaController.js
│   │   │   ├── 📄 repuestoController.js
│   │   │   ├── 📄 proveedorController.js # Optimizado con getById
│   │   │   └── 📄 reparacionController.js
│   │   ├── 📂 routes/                   # Definición de rutas
│   │   │   ├── 📄 auth.js
│   │   │   ├── 📄 maquinaria.js
│   │   │   ├── 📄 repuestos.js
│   │   │   ├── 📄 proveedores.js        # Incluye ruta GET /:id
│   │   │   ├── 📄 reparaciones.js
│   │   │   └── 📄 users.js
│   │   ├── 📂 middleware/               # Middleware personalizado
│   │   │   ├── 📄 auth.js               # Validación JWT
│   │   │   ├── 📄 cors.js               # Configuración CORS
│   │   │   └── 📄 validation.js         # Validación de datos
│   │   ├── 📂 config/                   # Configuraciones
│   │   │   ├── 📄 database.js
│   │   │   └── 📄 jwt.js
│   │   ├── 📂 docs/                     # Documentación API
│   │   │   └── 📄 swagger.js
│   │   └── 📄 index.js                  # Servidor principal
│   ├── 📂 prisma/                       # ORM y base de datos
│   │   ├── 📄 schema.prisma             # Schema de base de datos
│   │   ├── 📂 migrations/               # Migraciones automáticas
│   │   └── 📄 seed.js                   # Datos de ejemplo
│   ├── 📂 scripts/                      # Scripts de utilidad
│   │   └── 📄 import-repuestos.js
│   ├── 📄 package.json
│   └── 📄 .env.example
├── 📂 docs/                             # Documentación completa
│   ├── 📄 API_REFERENCE.md              # Documentación de API
│   ├── 📄 DEPLOYMENT.md                 # Guía de deployment
│   ├── 📄 SETUP_DESARROLLO.md           # Setup de desarrollo
│   ├── 📄 SECURITY.md                   # Guía de seguridad
│   ├── 📄 TROUBLESHOOTING.md            # Solución de problemas
│   ├── 📄 SISTEMA_FILTROS.md            # Sistema de filtros
│   ├── 📄 FIXES_COMPLETED.md            # Log de correcciones
│   ├── 📄 FINAL_FIXES_COMPLETE.md       # Correcciones finales
│   └── 📄 OPTIMIZATION_SUMMARY.md       # Resumen de optimizaciones
├── 📂 scripts/                          # Scripts de deployment
│   ├── 📄 deploy.ps1                    # Script Windows
│   ├── 📄 deploy.sh                     # Script Linux/Mac
│   └── 📄 verify-deploy.sh              # Verificación
├── 📂 data/                             # Datos de ejemplo
│   └── 📂 samples/
│       └── 📄 repuestos_normalizado.csv
├── 📄 render.yaml                       # Configuración de deployment
├── 📄 package.json                      # Scripts del monorepo
├── 📄 .nvmrc                            # Versión de Node.js
├── 📄 .gitignore
└── 📄 README.md                         # Esta documentación
```

---

## 📞 **Soporte y Contacto**

### **Logs y Debugging**

#### **Desarrollo Local**

```bash
# Logs del backend
npm run dev:server

# Logs del frontend
npm run dev:client

# Logs de base de datos
npx prisma studio
```

#### **Producción**

- **Render Dashboard**: Ver logs en tiempo real
- **Health Endpoint**: `/api/health` para verificar estado
- **Database Studio**: Acceso directo desde Render

### **Health Checks**

```http
GET /api/health

# Respuesta esperada:
{
  \"status\": \"ok\",
  \"timestamp\": \"2024-01-01T00:00:00.000Z\",
  \"database\": \"connected\",
  \"version\": \"1.0.0\"
}
```

---

## 🤝 **Contribución al Proyecto**

### **Workflow de Contribución**

1. **Fork** el repositorio
2. **Crear rama**: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollar** siguiendo las convenciones establecidas
4. **Testing**: Asegurar que todos los tests pasan
5. **Commit**: `git commit -m 'feat: nueva funcionalidad'`
6. **Push**: `git push origin feature/nueva-funcionalidad`
7. **Pull Request**: Crear PR con descripción detallada

### **Convenciones de Código**

#### **Commits**

```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: actualización de documentación
style: cambios de formato/estilo
refactor: refactorización de código
test: agregar o modificar tests
chore: tareas de mantenimiento
```

#### **Estructura de Componentes**

```jsx
// Orden de imports
import React from 'react'; // React core
import { useState, useEffect } from 'react'; // React hooks
import { useNavigate } from 'react-router-dom'; // Third party
import { api } from '../services/api'; // Internal services
import { ComponentName } from '../components'; // Internal components
import { STYLES } from '../styles'; // Styles
import './Component.css'; // Component styles

function ComponentName({ prop1, prop2 }) {
  // 1. Hooks
  // 2. State
  // 3. Effects
  // 4. Event handlers
  // 5. Helper functions
  // 6. Render
}

export default ComponentName;
```

---

## 📄 **Licencia y Legal**

### **Licencia MIT**

```
MIT License

Copyright (c) 2024 Sistema de Gestión Agrícola

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the \"Software\"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🎯 **Roadmap y Mejoras Futuras**

### **Versión 2.0 - Planificada**

#### **Nuevas Funcionalidades**

- 📱 **Aplicación Móvil**: React Native para gestión móvil
- 🔔 **Notificaciones**: Alertas automáticas de stock bajo y mantenimientos
- 📊 **Analytics Avanzado**: Dashboard con gráficos y tendencias
- 🔄 **Sincronización Offline**: Trabajo sin conexión con sync automático
- 🎨 **Temas Personalizables**: Dark mode y temas corporativos
- 🔍 **Búsqueda Global**: Búsqueda inteligente cross-entity
- 📄 **Generación de Reportes**: PDF automatizados con datos

#### **Mejoras Técnicas**

- ⚡ **Performance**: Implementación de Redis para caché
- 🔒 **Seguridad**: 2FA y SSO enterprise
- 🧪 **Testing**: Coverage completo con E2E automation
- 🚀 **CI/CD**: Pipeline automatizado con GitHub Actions
- 📦 **Microservicios**: Arquitectura distribuida escalable
- 🌐 **Internacionalización**: Soporte multi-idioma
- 📊 **Monitoring**: APM con alertas automáticas

### **Contribuciones Bienvenidas**

- 🐛 **Bug Reports**: Issues con reproducción clara
- 💡 **Feature Requests**: Sugerencias con casos de uso
- 📝 **Documentación**: Mejoras y traducciones
- 🧪 **Testing**: Agregar tests y casos edge
- 🎨 **UI/UX**: Mejoras de interfaz y experiencia

---

**🌾 Sistema desarrollado para optimizar la gestión integral de talleres agrícolas**

**✨ Arquitectura moderna • Performance optimizada • Código mantenible • Deployment automático**

---

_Última actualización: Agosto 2025 | Versión: 1.0.0 | Estado: Producción_
