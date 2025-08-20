# 📚 Documentación del Sistema de Gestión Agrícola

Esta carpeta contiene toda la documentación técnica y de usuario del sistema.

## 📖 Índice General

### 🚀 **Instalación y Configuración**

- [`SETUP_DESARROLLO.md`](./SETUP_DESARROLLO.md) - Guía completa de instalación local
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) - Deployment en producción con Render
- [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) - Solución de problemas comunes

### 🔧 **Desarrollo**

- [`API_REFERENCE.md`](./API_REFERENCE.md) - Documentación completa de la API
- [`SECURITY.md`](./SECURITY.md) - Mejores prácticas de seguridad
- [`CODE_OPTIMIZATION_COMPLETE.md`](./CODE_OPTIMIZATION_COMPLETE.md) - Optimizaciones implementadas

### 🎯 **Características del Sistema**

- [`SISTEMA_FILTROS.md`](./SISTEMA_FILTROS.md) - Sistema de filtros avanzados
- [`CORS_SOLUTION.md`](./CORS_SOLUTION.md) - Configuración CORS

### 📋 **Logs y Mantenimiento**

- [`SANITIZATION_LOG.md`](./SANITIZATION_LOG.md) - Log de limpieza y optimización
- [`REORGANIZACION_COMPLETADA.md`](./REORGANIZACION_COMPLETADA.md) - Reorganización del código

---

## 🔍 **Documentación por Módulo**

### 🚜 **Maquinarias**

- Gestión completa de equipos agrícolas
- Registro de mantenimiento preventivo
- Historial de reparaciones

### 🔧 **Repuestos**

- Control de inventario con stock
- Sistema de filtros avanzados
- Gestión de proveedores

### 👥 **Proveedores**

- Directorio completo de contactos
- Gestión de productos ofrecidos
- Historial de transacciones

### 🛠️ **Reparaciones**

- Seguimiento de trabajos realizados
- Asignación de responsables
- Control de costos y tiempos

### 👤 **Usuarios**

- Sistema de autenticación JWT
- Roles y permisos (Admin/User)
- Gestión de sesiones

---

## 🏗️ **Arquitectura del Sistema**

```
📦 Sistema de Gestión Agrícola
├── 🖥️ Frontend (React + Vite + Tailwind)
│   ├── Componentes reutilizables
│   ├── Páginas principales
│   ├── Servicios de API
│   └── Utilities y helpers
├── ⚙️ Backend (Node.js + Express + Prisma)
│   ├── Controladores de negocio
│   ├── Rutas de API REST
│   ├── Middleware de autenticación
│   └── Modelos de base de datos
└── 🗃️ Base de Datos (PostgreSQL)
    ├── Esquemas relacionales
    ├── Índices optimizados
    └── Migraciones versionadas
```

---

## 🔄 **Flujo de Trabajo de Desarrollo**

1. **Desarrollo Local**

   ```bash
   npm run dev          # Desarrollo completo
   npm run dev:server   # Solo backend
   npm run dev:client   # Solo frontend
   ```

2. **Testing**

   ```bash
   npm test             # Tests completos
   npm run test:coverage # Coverage reports
   ```

3. **Deployment**
   ```bash
   ./deploy.ps1         # Windows
   ./deploy.sh          # Linux/Mac
   ```

---

## 📊 **Métricas y Monitoreo**

### **Health Checks**

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000/api/health`
- Producción: `https://sistemagestionagricola.onrender.com/api/health`

### **Logs**

- Desarrollo: Consola del navegador + Terminal
- Producción: Render Dashboard → Logs

---

## 🔐 **Seguridad**

### **Autenticación**

- JWT Tokens con expiración
- Passwords hasheados con bcrypt
- Roles y permisos granulares

### **API Security**

- CORS configurado por dominio
- Rate limiting implementado
- Validación de entrada sanitizada

---

## 📞 **Soporte y Contacto**

### **Desarrollo**

- Issues: GitHub repository issues
- Documentation: Esta carpeta de docs/

### **Producción**

- Monitoring: Render Dashboard
- Logs: Centralizados en Render
- Health: Endpoints de monitoreo

---

_📅 Última actualización: Agosto 2025_
_🔄 Versión de documentación: 2.0_
