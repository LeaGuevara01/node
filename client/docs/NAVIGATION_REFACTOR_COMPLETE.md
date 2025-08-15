# Refactorización Completa del Sistema de Navegación

## 🎯 Objetivo

Estandarizar la navegación en todas las páginas de la aplicación usando componentes modulares y patrones consistentes.

## 📦 Componentes Creados

### 1. Sistema de Layout

- **`AppLayout`**: Layout principal que incluye sidebar, topbar y breadcrumbs
- **`TopNavBar`**: Barra superior con título, acciones y menú de usuario
- **`Breadcrumbs`**: Navegación de ruta automática

### 2. Navegación Contextual

- **`NavigationProvider`**: Contexto global de navegación
- **`useNavigation`**: Hook refactorizado que usa el contexto
- **`NavigationButtons`**: Botones estándar reutilizables

### 3. Páginas de Ejemplo

- **`DashboardRefactored.jsx`**: Dashboard usando el nuevo sistema
- **`MaquinariasPageRefactored.jsx`**: Página de listado refactorizada
- **`MaquinariaDetailsRefactored.jsx`**: Página de detalles refactorizada

## 🚀 Implementación Paso a Paso

### Paso 1: Verificar Instalación de Dependencias

```bash
# Asegurar que las dependencias necesarias estén instaladas
npm install lucide-react react-router-dom
```

### Paso 2: Actualizar App.jsx

El archivo App.jsx ya ha sido actualizado para incluir el NavigationProvider.

### Paso 3: Migrar Páginas Existentes

#### Opción A: Migración Manual

Para cada página existente, seguir este patrón:

```jsx
// Antes
import React from 'react';
import { useNavigate } from 'react-router-dom';

function MaquinariasPage({ token }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sidebar...">{/* sidebar manual */}</div>
      <div className="content...">{/* contenido */}</div>
    </div>
  );
}

// Después
import React from 'react';
import AppLayout from '../components/navigation/AppLayout';
import { CreateButton } from '../components/navigation/NavigationButtons';
import { useNavigation } from '../hooks/useNavigation';

function MaquinariasPage({ token, role, onLogout }) {
  const { navigateToListPage } = useNavigation();

  const breadcrumbs = [{ label: 'Inicio', href: '/' }, { label: 'Maquinarias' }];

  const pageActions = <CreateButton entity="maquinarias" />;

  return (
    <AppLayout
      currentSection="maquinarias"
      breadcrumbs={breadcrumbs}
      title="Gestión de Maquinarias"
      actions={pageActions}
      token={token}
      role={role}
      onLogout={onLogout}
    >
      {/* contenido existente */}
    </AppLayout>
  );
}
```

#### Opción B: Migración Automática

Usar el script de migración (requiere Node.js):

```bash
# Ejecutar desde la carpeta client
cd client
node scripts/migrateNavigation.js
```

### Paso 4: Actualizar Importaciones en Páginas

Reemplazar las páginas originales con las refactorizadas:

```jsx
// En App.jsx, reemplazar:
import Dashboard from './pages/Dashboard';
import MaquinariasPage from './pages/MaquinariasPage';

// Por:
import Dashboard from './pages/DashboardRefactored';
import MaquinariasPage from './pages/MaquinariasPageRefactored';
```

### Paso 5: Refactorizar Páginas Restantes

#### Páginas a migrar:

1. **RepuestosPage.jsx** → **RepuestosPageRefactored.jsx**
2. **ProveedoresPage.jsx** → **ProveedoresPageRefactored.jsx**
3. **ReparacionesPage.jsx** → **ReparacionesPageRefactored.jsx**
4. **UsuariosPage.jsx** → **UsuariosPageRefactored.jsx**
5. **RepuestoDetails.jsx** → **RepuestoDetailsRefactored.jsx**
6. **ProveedorDetails.jsx** → **ProveedorDetailsRefactored.jsx**
7. **ReparacionDetails.jsx** → **ReparacionDetailsRefactored.jsx**

### Paso 6: Actualizar Rutas

Modificar las rutas en `App.jsx` para usar las páginas refactorizadas:

```jsx
// Reemplazar todas las importaciones de páginas originales
// con las versiones refactorizadas
<Route
  path="/maquinarias"
  element={
    <MaquinariasPageRefactored
      token={token}
      role={role}
      onLogout={() => {
        setToken(null);
        setRole(null);
      }}
    />
  }
/>
```

## 🔧 Configuración Adicional

### 1. Estilos CSS

Asegurar que los estilos necesarios estén incluidos en `index.css` o Tailwind:

```css
/* Animaciones para el sidebar y modales */
@keyframes slide-up {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.2s ease-out;
}

/* Gradientes para temas */
.bg-gradient-agricultural {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}
```

### 2. Variables de Entorno

Verificar que las variables necesarias estén en `.env`:

```env
VITE_API_URL=http://localhost:4000
```

## 📋 Lista de Verificación

### Componentes Base

- [x] AppLayout creado
- [x] TopNavBar creado
- [x] Breadcrumbs creado
- [x] NavigationButtons creado
- [x] NavigationProvider creado
- [x] useNavigation refactorizado

### Páginas de Ejemplo

- [x] DashboardRefactored
- [x] MaquinariasPageRefactored
- [x] MaquinariaDetailsRefactored

### Páginas Pendientes

- [ ] RepuestosPageRefactored
- [ ] ProveedoresPageRefactored
- [ ] ReparacionesPageRefactored
- [ ] UsuariosPageRefactored
- [ ] RepuestoDetailsRefactored
- [ ] ProveedorDetailsRefactored
- [ ] ReparacionDetailsRefactored

### Integración

- [x] App.jsx actualizado con NavigationProvider
- [ ] Todas las rutas actualizadas
- [ ] Páginas originales reemplazadas
- [ ] Pruebas de navegación realizadas

## 🧪 Pruebas

### Funcionalidades a Probar

1. **Navegación del Sidebar**
   - [ ] Clic en secciones navega correctamente
   - [ ] Estado activo se muestra correctamente
   - [ ] Responsive en mobile funciona

2. **Breadcrumbs**
   - [ ] Se generan automáticamente
   - [ ] Enlaces funcionan correctamente
   - [ ] Se actualizan con la navegación

3. **Botones de Navegación**
   - [ ] CreateButton navega a formularios
   - [ ] EditButton navega a edición
   - [ ] BackButton regresa correctamente
   - [ ] DeleteButton ejecuta eliminación

4. **Contexto de Navegación**
   - [ ] Funciones de navegación funcionan
   - [ ] Historial se mantiene
   - [ ] Estado global se actualiza

## 🔍 Debugging

### Problemas Comunes

1. **Error: "useNavigationContext must be used within a NavigationProvider"**
   - Solución: Verificar que App.jsx tenga NavigationProvider

2. **Breadcrumbs no se muestran**
   - Solución: Verificar que se pasan correctamente a AppLayout

3. **Botones no navegan**
   - Solución: Verificar que useNavigation esté importado correctamente

4. **Estilos rotos**
   - Solución: Verificar que Tailwind esté configurado correctamente

### Logs de Debugging

```jsx
// Agregar en useNavigation para debugging
console.log('Navigation context:', context);
console.log('Current page info:', getCurrentPageInfo());
```

## 📚 Documentación Adicional

### API de Componentes

#### AppLayout Props

```jsx
AppLayout({
  children, // React.Node - Contenido de la página
  currentSection, // string - Sección activa del sidebar
  breadcrumbs, // Array - [{label, href}]
  title, // string - Título de la página
  subtitle, // string - Subtítulo de la página
  actions, // React.Node - Botones/acciones
  token, // string - Token de auth
  role, // string - Rol del usuario
  onLogout, // Function - Función de logout
  className, // string - Clases adicionales
});
```

#### NavigationButtons Props

```jsx
CreateButton({ entity, label, variant, size, className });
EditButton({ entity, id, label, variant, size, className });
DeleteButton({ onClick, label, variant, size, className, loading });
BackButton({ onClick, label, variant, size, className });
ViewButton({ entity, id, label, variant, size, className });
```

### Próximos Pasos

1. **Completar migración de todas las páginas**
2. **Agregar tests unitarios para navegación**
3. **Implementar animaciones de transición**
4. **Optimizar performance del contexto**
5. **Agregar soporte para deep linking**
6. **Implementar navegación por teclado**

## 🎉 Beneficios Obtenidos

- ✅ **Consistencia**: Todas las páginas usan el mismo layout
- ✅ **Mantenibilidad**: Componentes reutilizables y modulares
- ✅ **Accesibilidad**: Navegación estandarizada
- ✅ **Performance**: Navegación optimizada con contexto
- ✅ **Developer Experience**: APIs claras y fáciles de usar
- ✅ **Responsive**: Layout funciona en todos los tamaños
- ✅ **Escalabilidad**: Fácil agregar nuevas páginas
