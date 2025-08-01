# 🌾 Sistema de Gestión Agrícola

**Sistema completo de gestión para maquinarias, repuestos, proveedores y reparaciones agrícolas.**

[![Deploy Status](https://img.shields.io/badge/deploy-ready-green.svg)](https://render.com)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 **Descripción**

Sistema web moderno para la gestión integral de talleres agrícolas que incluye:

- 🚜 **Gestión de Maquinarias**: Registro, seguimiento y mantenimiento
- 🔧 **Control de Repuestos**: Inventario, stock y proveedores
- 👥 **Gestión de Proveedores**: Directorio completo con contactos
- 🛠️ **Reparaciones**: Historial y seguimiento de servicios
- 🔐 **Sistema de Usuarios**: Autenticación con roles (Admin/User)

---

## 🏗️ **Arquitectura**

### **Frontend (React + Vite)**

- ⚡ **Vite** para desarrollo rápido
- 🎨 **Tailwind CSS** para estilos
- 🔄 **React Router** para navegación
- 📱 **Responsive Design** para móviles
- 🔐 **JWT Authentication**

### **Backend (Node.js + Express)**

- 🚀 **Express** servidor web
- 🗄️ **Prisma ORM** con PostgreSQL
- 🔒 **JWT + bcrypt** para seguridad
- 📚 **Swagger UI** documentación API
- ✅ **Tests** con Jest + Supertest

### **Base de Datos**

- 🐘 **PostgreSQL** en Render
- 🔄 **Prisma** para migraciones
- 📊 **Schema** optimizado para agricultura

---

## 🚀 **Desarrollo Local**

### **Pre-requisitos**

```bash
Node.js >= 18.0.0
npm >= 8.0.0
Git
```

### **Instalación Rápida**

```bash
# Clonar repositorio
git clone https://github.com/LeaGuevara01/node.git
cd node

# Instalar dependencias
npm install

# Configurar variables de entorno
cp server/.env.example server/.env
# Editar server/.env con tus credenciales

# Ejecutar en desarrollo
npm run dev
```

### **URLs de Desarrollo**

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **API Docs**: http://localhost:4000/api/docs
- **Health**: http://localhost:4000/api/health

---

## 🌐 **Deploy en Render**

### **🚀 Deploy Automático (Blueprint)**

1. **Preparar repositorio**:

```bash
git add .
git commit -m "ready for deploy"
git push origin main
```

2. **Crear Blueprint en Render**:

   - Ve a: https://dashboard.render.com
   - **New** → **Blueprint**
   - Conecta: `LeaGuevara01/node`
   - Branch: `main`

3. **Configurar base de datos existente**:

   **Ya tienes tu base de datos PostgreSQL configurada:**

   - Nombre: `sistema_gestion_agricola`
   - Usuario: `elorza`
   - Hostname: `dpg-d1qpnlodl3ps73eln790-a`

   **Configurar DATABASE_URL manualmente:**

   - En Render Dashboard → Backend Service → Environment
   - Agregar: `DATABASE_URL = postgresql://elorza:[tu-password]@dpg-d1qpnlodl3ps73eln790-a:5432/sistema_gestion_agricola`
   - JWT_SECRET se generará automáticamente

### **URLs de Producción**

- **Frontend**: https://sistemagestionagricola-frontend.onrender.com
- **Backend**: https://sistemagestionagricola.onrender.com
- **API**: https://sistemagestionagricola.onrender.com/api
- **Health Check**: https://sistemagestionagricola.onrender.com/api/health

---

## 📁 **Estructura del Proyecto**

```
📦 node/
├── 📂 client/                 # Frontend React
│   ├── 📂 src/
│   │   ├── 📂 components/     # Componentes reutilizables
│   │   ├── 📂 pages/          # Páginas principales
│   │   ├── 📂 services/       # API calls
│   │   └── 📄 App.jsx         # Componente principal
│   ├── 📄 package.json
│   └── 📄 vite.config.js
├── 📂 server/                 # Backend Node.js
│   ├── 📂 src/
│   │   ├── 📂 controllers/    # Lógica de negocio
│   │   ├── 📂 routes/         # Rutas API
│   │   ├── 📂 middleware/     # Autenticación, etc.
│   │   └── 📄 index.js        # Servidor principal
│   ├── 📂 prisma/
│   │   └── 📄 schema.prisma   # Schema de base de datos
│   └── 📄 package.json
├── 📄 render.yaml             # Configuración de deploy
├── 📄 package.json            # Scripts del monorepo
└── 📄 README.md               # Este archivo
```

---

## 🔧 **Scripts Disponibles**

```bash
# Desarrollo completo (backend + frontend)
npm run dev

# Solo backend
npm run dev:server

# Solo frontend
npm run dev:client

# Build para producción
npm run build

# Deployment preparation (Windows)
./deploy.ps1

# Deployment preparation (Linux/Mac)
./deploy.sh

# Tests
npm test

# Linting
npm run lint
```

### **Scripts de Deployment**

Los scripts `deploy.ps1` (Windows) y `deploy.sh` (Linux/Mac) validan la configuración antes del deployment:

- ✅ Verifican archivos necesarios
- ✅ Instalan dependencias si faltan
- ✅ Compilan el frontend
- ✅ Validan configuración
- ✅ Proporcionan instrucciones paso a paso

---

## 🔐 **Seguridad**

### **Variables de Entorno**

```bash
# Backend (.env)
NODE_ENV=development
PORT=4000
JWT_SECRET=tu-secret-de-64-caracteres-minimo
DATABASE_URL=postgresql://...
CORS_ORIGIN=http://localhost:3000

# Frontend (.env)
VITE_API_URL=http://localhost:4000/api
```

### **Autenticación**

- 🔑 **JWT Tokens** con expiración de 1 día
- 🔒 **Passwords** hasheados con bcrypt
- 👤 **Roles**: Admin (CRUD completo) / User (solo lectura)
- 🛡️ **CORS** configurado para dominios específicos

---

## 📚 **API Endpoints**

### **Autenticación**

```
POST /api/auth/login     # Iniciar sesión
POST /api/auth/register  # Registrar usuario (Admin only)
```

### **Recursos Principales**

```
GET    /api/maquinaria   # Listar maquinarias
POST   /api/maquinaria   # Crear maquinaria (Admin)
PUT    /api/maquinaria/:id # Editar maquinaria (Admin)
DELETE /api/maquinaria/:id # Eliminar maquinaria (Admin)

# Similar para: repuestos, proveedores, reparaciones, users
```

### **Documentación Completa**

- **Swagger UI**: http://localhost:4000/api/docs
- **Health Check**: http://localhost:4000/api/health

---

## 🧪 **Testing**

```bash
# Ejecutar todos los tests
npm test

# Tests del backend
cd server && npm test

# Tests del frontend
cd client && npm test

# Coverage
npm run test:coverage
```

---

## 🚨 **Troubleshooting Deployment**

### **Error: Render detecta Python en lugar de Node.js**

Si ves este error durante el deploy:

```
==> Using Python version 3.13.4 (default)
ERROR: Could not open requirements file: [Errno 2] No such file or directory: 'requirements.txt'
```

**Solución:**

1. Verificar que `render.yaml` está en el directorio raíz
2. Confirmar que cada servicio especifica `env: node`
3. Asegurar que `rootDir` apunta a `./server` y `./client`
4. El archivo `.nvmrc` fuerza la detección de Node.js

### **Error: Puerto en uso**

```bash
# Verificar procesos en puerto 4000
netstat -ano | findstr :4000

# Terminar proceso si es necesario
taskkill /F /PID [process-id]
```

### **Error: Variables de entorno**

- Verificar que existe `server/.env`
- Confirmar que todas las variables estén definidas
- Validar formato de `DATABASE_URL`

### **Error: Base de datos**

```bash
# Regenerar cliente Prisma
cd server
npx prisma generate

# Sincronizar schema
npx prisma db push
```

### **Error: CORS**

- Verificar `CORS_ORIGIN` en variables de entorno
- Confirmar que frontend y backend usan las URLs correctas

---

## 📞 **Soporte**

### **Logs de Desarrollo**

- Backend: Terminal donde ejecutas `npm run dev:server`
- Frontend: Terminal donde ejecutas `npm run dev:client`

### **Logs de Producción**

- Render Dashboard → Service → Logs
- Health check: `/api/health`

### **Base de Datos**

- Prisma Studio: `npx prisma studio`
- Logs de queries: Configurar en Prisma

---

## 📄 **Licencia**

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

## 🤝 **Contribuir**

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

**🌾 Sistema desarrollado para optimizar la gestión de talleres agrícolas**
