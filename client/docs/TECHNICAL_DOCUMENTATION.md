# Documentación Técnica - Sistema de Gestión Agrícola Frontend

## Arquitectura y Patrones de Diseño

### Patrón de Componentes

El sistema utiliza un patrón de arquitectura basado en componentes React con las siguientes capas:

```
Presentational Components (UI)
├── Sidebar.jsx - Navegación
├── StatsCard.jsx - Visualización de datos
├── WelcomeCard.jsx - Información contextual
└── RoleGuard.jsx - Control de acceso

Container Components (Logic)
├── Dashboard.jsx - Estado global y coordinación
├── MaquinariaForm.jsx - CRUD maquinarias
├── RepuestoForm.jsx - CRUD repuestos
├── ProveedorForm.jsx - CRUD proveedores
├── ReparacionForm.jsx - CRUD reparaciones
└── UserRegisterForm.jsx - Gestión usuarios

Service Layer
└── api.js - Comunicación con backend
```

### Flujo de Datos

```
Usuario → Componente → Service → API Backend
  ↓         ↓          ↓         ↓
Evento → Estado Local → HTTP → Base de Datos
  ↓         ↓          ↓         ↓
UI Update ← Callback ← Response ← Resultado
```

## Documentación de Componentes

### Dashboard.jsx

**Propósito**: Componente principal que actúa como contenedor y controlador de la aplicación.

**Props**:

- `token` (string): Token JWT para autenticación
- `role` (string): Rol del usuario ('Admin' | 'User')
- `onLogout` (function): Callback para cerrar sesión

**Estado Interno**:

```javascript
// Datos de las entidades
const [maquinarias, setMaquinarias] = useState([]);
const [repuestos, setRepuestos] = useState([]);
const [proveedores, setProveedores] = useState([]);
const [reparaciones, setReparaciones] = useState([]);

// Control de UI
const [loading, setLoading] = useState(true);
const [activeSection, setActiveSection] = useState(null);
```

**Funciones Principales**:

- `fetchData()`: Carga inicial de todos los datos
- `stats`: Cálculo de estadísticas para el dashboard

### Sidebar.jsx

**Propósito**: Navegación lateral responsive con soporte para mobile y desktop.

**Props**:

- `active` (string|null): Sección actualmente activa
- `setActive` (function): Función para cambiar sección

**Características Técnicas**:

- **Fixed Positioning**: No afecta el flujo del documento
- **Transform Animations**: Slide desde la izquierda en mobile
- **Z-index Stacking**: Gestión de capas para overlay
- **Responsive Breakpoints**: Comportamiento diferente en md+

**Estados de UI**:

```javascript
const [open, setOpen] = useState(false); // Control de apertura en mobile
```

### StatsCard.jsx

**Propósito**: Componente de visualización de estadísticas con iconos y colores temáticos.

**Props**:

- `type` (string): Tipo de estadística ('maquinarias'|'repuestos'|'proveedores'|'reparaciones')
- `title` (string): Título a mostrar
- `value` (number): Valor numérico

**Configuración de Estilos**:

```javascript
const cardStyles = {
  maquinarias: { bgColor: "bg-blue-100", textColor: "text-blue-600" },
  repuestos: { bgColor: "bg-green-100", textColor: "text-green-600" },
  // ... más configuraciones
};

const iconMap = {
  maquinarias: Truck,
  repuestos: Settings,
  // ... mapeo de iconos Lucide React
};
```

### Formularios CRUD

Todos los formularios (`MaquinariaForm.jsx`, `RepuestoForm.jsx`, etc.) siguen el mismo patrón:

**Estados Comunes**:

```javascript
const [form, setForm] = useState({}); // Formulario de creación
const [items, setItems] = useState([]); // Lista de elementos
const [editingItem, setEditingItem] = useState(null); // Item en edición
const [editForm, setEditForm] = useState(null); // Formulario de edición
const [error, setError] = useState(""); // Manejo de errores
```

**Funciones Estándar**:

- `fetch{Entity}()`: Cargar datos desde API
- `handleSubmit()`: Crear nuevo elemento
- `handleEdit()`: Iniciar edición
- `handleUpdate()`: Actualizar elemento
- `handleDelete()`: Eliminar elemento
- `handleFileUpload()`: Importación CSV (donde aplique)

## Servicios y API

### api.js

**Configuración Base**:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
```

**Patrón de Funciones**:

```javascript
export async function operacion(params, token) {
  const res = await fetch(`${API_URL}/endpoint`, {
    method: "HTTP_METHOD",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Si requiere auth
    },
    body: JSON.stringify(data), // Si tiene payload
  });
  return res.json();
}
```

**Funciones por Categoría**:

_Autenticación_:

- `login(username, password)`
- `register(username, password, role)`

_CRUD Maquinarias_:

- `getMaquinarias(token)`
- `createMaquinaria(data, token)`
- `updateMaquinaria(data, token)`
- `deleteMaquinaria(id, token)`

_CRUD Repuestos_:

- `getRepuestos(token)`
- `createRepuesto(data, token)`
- `updateRepuesto(data, token)`
- `deleteRepuesto(id, token)`

_CRUD Proveedores_:

- `getProveedores(token)`
- `createProveedor(data, token)`
- `updateProveedor(data, token)`
- `deleteProveedor(id, token)`

_CRUD Reparaciones_:

- `getReparaciones(token)`
- `createReparacion(data, token)`
- `updateReparacion(data, token)`
- `deleteReparacion(id, token)`

## Manejo de Estado

### Estado Local vs Global

**Estado Local** (useState):

- Formularios de entrada
- Estados de UI (loading, errores)
- Datos temporales de edición

**Estado Compartido** (Props drilling):

- Token de autenticación
- Rol del usuario
- Callbacks de actualización

### Patrón de Actualización

```javascript
// 1. Operación en API
const result = await createItem(data, token);

// 2. Actualización optimista o pesimista
if (result.id) {
  // Éxito: limpiar formulario y recargar datos
  setForm(initialState);
  fetchItems();
} else {
  // Error: mostrar mensaje
  setError(result.error);
}

// 3. Notificar componente padre (opcional)
onCreated && onCreated(result);
```

## Responsive Design

### Breakpoints de Tailwind

```css
/* Mobile First Approach */
.class                /* Desde 0px */
.sm:class            /* Desde 640px */
.md:class            /* Desde 768px */
.lg:class            /* Desde 1024px */
.xl:class            /* Desde 1280px */
```

### Patrones Responsivos Utilizados

**Sidebar Responsive**:

```javascript
// Mobile: transform translate
className={`... ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}

// Desktop: siempre visible, mobile: condicional
className="... md:hidden" // Solo mobile
className="... hidden md:block" // Solo desktop
```

**Grid Responsivo**:

```css
/* Estadísticas: 1 → 2 → 4 columnas */
grid-cols-1 md:grid-cols-2 lg:grid-cols-4

/* Contenido: padding lateral variable */
pl-12 md:pl-60 /* 48px mobile, 240px desktop */
```

## Sistema de Iconos

### Lucide React Integration

```javascript
import {
  Truck,
  Settings,
  Building2,
  Wrench,
  Users,
  BarChart3,
  Menu,
} from "lucide-react";

// Uso básico
<Truck size={24} className="text-blue-600" />;

// Uso dinámico
const IconComponent = iconMap[type];
<IconComponent size={18} className="mr-2" />;
```

### Mapeo Semántico

```javascript
const semanticIcons = {
  // Entidades principales
  maquinarias: Truck, // Vehículo/transporte
  repuestos: Settings, // Configuración/mecánica
  proveedores: Building2, // Empresa/negocio
  reparaciones: Wrench, // Herramienta/arreglo
  usuarios: Users, // Personas/gestión

  // Navegación
  dashboard: BarChart3, // Estadísticas/panel
  menu: Menu, // Navegación móvil
};
```

## Optimizaciones de Rendimiento

### Lazy Loading

```javascript
// Carga diferida de componentes pesados
const HeavyComponent = React.lazy(() => import("./HeavyComponent"));

// Uso con Suspense
<Suspense fallback={<div>Cargando...</div>}>
  <HeavyComponent />
</Suspense>;
```

### Memoización

```javascript
// Prevenir re-renders innecesarios
const MemoizedComponent = React.memo(Component);

// Callbacks estables
const stableCallback = useCallback(
  (data) => {
    // lógica
  },
  [dependencies]
);

// Cálculos costosos
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### Fetch Optimizations

```javascript
// Cargar datos en paralelo
const [data1, data2, data3] = await Promise.all([
  getResource1(token),
  getResource2(token),
  getResource3(token),
]);

// Evitar fetch duplicados
useEffect(() => {
  if (!data.length) {
    fetchData();
  }
}, [token]);
```

## Manejo de Errores

### Patrón de Error Handling

```javascript
// 1. Estado de error local
const [error, setError] = useState("");

// 2. Try-catch en operaciones async
try {
  const result = await apiCall(data, token);
  if (result.error) {
    setError(result.error);
  } else {
    // Éxito
    setError("");
  }
} catch (err) {
  setError("Error de conexión");
}

// 3. Mostrar error en UI
{
  error && <div className="text-red-600 text-sm mt-2">{error}</div>;
}
```

### Error Boundaries

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Algo salió mal. Por favor recarga la página.</div>;
    }
    return this.props.children;
  }
}
```

## Testing Guidelines

### Estructura de Tests

```javascript
// ComponentName.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import ComponentName from "./ComponentName";

describe("ComponentName", () => {
  test("renders correctly", () => {
    render(<ComponentName />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  test("handles user interaction", () => {
    render(<ComponentName />);
    fireEvent.click(screen.getByRole("button"));
    // assertions
  });
});
```

### Testing Patterns

**Mock de API calls**:

```javascript
jest.mock("../services/api", () => ({
  getMaquinarias: jest.fn().mockResolvedValue([]),
  createMaquinaria: jest.fn().mockResolvedValue({ id: 1 }),
}));
```

**Testing con Props**:

```javascript
const defaultProps = {
  token: "mock-token",
  role: "Admin",
  onCreated: jest.fn(),
};

render(<Component {...defaultProps} />);
```

## Deployment y Build

### Variables de Entorno

```env
# Desarrollo
VITE_API_URL=http://localhost:4000/api

# Producción
VITE_API_URL=https://api.ejemplo.com/api
```

### Build Process

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["lucide-react"],
        },
      },
    },
  },
});
```

### Render.com Configuration

```yaml
# render.yaml
services:
  - type: web
    name: frontend
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_API_URL
        value: https://backend-url.com/api
```

## Convenciones de Código

### Naming Conventions

```javascript
// Componentes: PascalCase
const UserProfile = () => {};

// Funciones: camelCase
const handleSubmit = () => {};

// Constantes: UPPER_SNAKE_CASE
const API_URL = "http://localhost:4000/api";

// Props: camelCase
<Component userName="john" onUpdate={handleUpdate} />;
```

### File Organization

```
src/
├── components/
│   ├── ui/           # Componentes básicos reutilizables
│   ├── forms/        # Formularios específicos
│   └── layout/       # Componentes de layout
├── pages/            # Páginas/rutas principales
├── services/         # API y servicios externos
├── utils/            # Funciones utilitarias
├── hooks/            # Custom hooks
└── types/            # Definiciones de tipos (si usa TypeScript)
```

### JSDoc Standards

```javascript
/**
 * Brief description of the component
 *
 * Longer description explaining the purpose,
 * behavior, and any important implementation details.
 *
 * @param {string} propName - Description of the prop
 * @param {function} callback - Description of callback function
 * @returns {JSX.Element} Description of what is rendered
 *
 * @example
 * <Component propName="value" callback={handleCallback} />
 */
function Component({ propName, callback }) {
  // implementation
}
```

## Troubleshooting Common Issues

### Build Errors

**Error**: `Module not found`

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

**Error**: `Cannot resolve module`

```javascript
// Verificar imports relativos
import Component from "./Component"; // ✓ Correcto
import Component from "Component"; // ✗ Incorrecto
```

### Runtime Errors

**Error**: `Cannot read property of undefined`

```javascript
// Usar optional chaining
const value = obj?.property?.subProperty;

// Valores por defecto
const items = data || [];
```

**Error**: `Token expired`

```javascript
// Implementar refresh de token o redirect a login
if (response.status === 401) {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
```

### Performance Issues

**Problema**: Re-renders excesivos

```javascript
// Usar React.memo para componentes puros
const MemoizedComponent = React.memo(Component);

// Stable references con useCallback
const stableHandler = useCallback(handler, [deps]);
```

**Problema**: Bundle size grande

```javascript
// Importaciones específicas en lugar de globales
import { Button } from "ui-library/Button"; // ✓
import * as UI from "ui-library"; // ✗
```
