# Sistema de Gestión Agrícola - Frontend

## Descripción General

Este es el frontend del Sistema de Gestión Agrícola, una aplicación web completa para la administración de talleres y maquinaria agrícola. Desarrollado con React y Tailwind CSS, proporciona una interfaz moderna y responsive para gestionar todos los aspectos del negocio agrícola.

## Características Principales

### 🚜 Gestión de Maquinarias

- Registro completo de maquinaria agrícola
- Control de inventario con detalles técnicos
- Seguimiento de ubicación y estado
- Importación masiva desde CSV

### 🔧 Control de Repuestos

- Inventario de repuestos y componentes
- Control de stock y disponibilidad
- Categorización por tipo de maquinaria
- Gestión de códigos y especificaciones

### 🏢 Directorio de Proveedores

- Base de datos de proveedores
- Información de contacto completa
- Historial de transacciones
- Evaluación y notas

### 🛠️ Registro de Reparaciones

- Seguimiento completo de reparaciones
- Asignación de repuestos utilizados
- Control de costos y tiempos
- Historial detallado por maquinaria

### 👥 Gestión de Usuarios

- Sistema de roles (Admin/User)
- Registro de usuarios (solo administradores)
- Autenticación segura con JWT
- Control de acceso por funcionalidad

## Tecnologías Utilizadas

### Frontend Core

- **React 18** - Biblioteca principal de UI
- **Vite** - Herramienta de build y desarrollo
- **Tailwind CSS** - Framework de estilos utility-first

### UI y UX

- **Lucide React** - Iconografía profesional
- **Sidebar responsivo** - Navegación optimizada para mobile/desktop
- **Modales de edición** - Interfaz moderna para CRUD
- **Tarjetas de estadísticas** - Dashboard visual con métricas

### Funcionalidades Adicionales

- **Papa Parse** - Importación de archivos CSV
- **Fetch API** - Comunicación con backend
- **JWT Authentication** - Autenticación segura
- **Role-based Access** - Control de permisos por rol

## Instalación y Desarrollo

### Requisitos Previos

- Node.js 16 o superior
- npm o yarn
- Backend ejecutándose (ver README del servidor)

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Editar .env con la URL del backend
VITE_API_URL=http://localhost:4000/api
```

### Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

## Arquitectura del Proyecto

### Estructura de Carpetas

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal de la app
│   ├── Sidebar.jsx     # Navegación lateral responsiva
│   ├── StatsCard.jsx   # Tarjetas de estadísticas
│   ├── WelcomeCard.jsx # Tarjeta de bienvenida
│   └── RoleGuard.jsx   # Control de acceso por roles
├── pages/              # Páginas principales y formularios
│   ├── Dashboard.jsx   # Dashboard principal con estadísticas
│   ├── MaquinariaForm.jsx    # CRUD de maquinarias
│   ├── RepuestoForm.jsx      # CRUD de repuestos
│   ├── ProveedorForm.jsx     # CRUD de proveedores
│   ├── ReparacionForm.jsx    # CRUD de reparaciones
│   └── UserRegisterForm.jsx  # Registro de usuarios
├── services/           # Servicios de comunicación
│   └── api.js         # Cliente API centralizado
└── assets/            # Recursos estáticos
```

### Componentes Principales

#### Dashboard.jsx

Componente central que:

- Muestra estadísticas generales del sistema
- Controla la navegación entre secciones
- Renderiza formularios según la sección activa
- Maneja el estado global de la aplicación

#### Sidebar.jsx

Navegación lateral con:

- Diseño responsivo (overlay en mobile, fijo en desktop)
- Iconos de Lucide React para cada sección
- Estados visuales para la sección activa
- Animaciones suaves de apertura/cierre

## Características de UI/UX

### Diseño Responsivo

- **Mobile First**: Optimizado para dispositivos móviles
- **Sidebar Adaptativo**: Overlay en mobile, fijo en desktop
- **Grid Responsivo**: Estadísticas adaptan a 1-4 columnas
- **Navegación Táctil**: Elementos optimizados para touch

### Sistema de Iconos (Lucide React)

- **Azul**: Maquinarias (Truck icon)
- **Verde**: Repuestos (Settings icon)
- **Púrpura**: Proveedores (Building2 icon)
- **Naranja**: Reparaciones (Wrench icon)
- **Rojo**: Usuarios (Users icon)

## API Integration

El frontend se comunica con el backend a través de:

- **Autenticación JWT**: Headers automáticos
- **RESTful endpoints**: Operaciones CRUD estándar
- **Error handling**: Manejo consistente de errores HTTP
- **Loading states**: Indicadores de carga para mejor UX

## Calidad y Testing

- **ESLint**: Configuración estándar de React
- **Tests (Jest)**: Suite de testing unitario
- **JSDoc**: Documentación de componentes
- **Tailwind CSS**: Clases utility para estilos consistentes

## Despliegue

### Build de Producción

```bash
npm run build
```

### Servicios de Hosting

- **Render**: Configurado para static web service
- **Vercel**: Despliegue automático desde Git
- **Netlify**: Integración continua

### Variables de Entorno para Producción

```env
VITE_API_URL=https://tu-backend.com/api
```

## Funcionalidades Avanzadas

### Importación CSV

Los formularios principales soportan importación masiva:

```csv
nombre,modelo,categoria,anio,numero_serie
Tractor,T-100,Tractores,2020,ABC123
```

### Sistema de Roles

- **Admin**: Acceso completo a todas las funcionalidades
- **User**: Acceso limitado (sin gestión de usuarios)

### Validación de Datos

- Campos obligatorios marcados claramente
- Validación en tiempo real
- Mensajes de error descriptivos
