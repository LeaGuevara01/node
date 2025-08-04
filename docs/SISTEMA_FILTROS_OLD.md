# Sistema de Filtros para Repuestos

## Implementación Completa

### Backend (Server)

#### 1. Controlador actualizado (`repuestoController.js`)

Se agregaron las siguientes funciones:

- **`getRepuestos`** - Filtros avanzados con paginación
- **`getFilterOptions`** - Opciones para filtros (categorías, ubicaciones)
- **`getEstadisticas`** - Estadísticas detalladas por categoría y ubicación
- **`busquedaRapida`** - Búsqueda en tiempo real

#### 2. Rutas actualizadas (`routes/repuestos.js`)

Nuevas rutas agregadas:

- `GET /api/repuestos/filtros` - Opciones de filtros
- `GET /api/repuestos/estadisticas` - Estadísticas
- `GET /api/repuestos/busqueda` - Búsqueda rápida

#### 3. Parámetros de filtrado disponibles

| Parámetro   | Tipo    | Descripción                             |
| ----------- | ------- | --------------------------------------- |
| `search`    | string  | Búsqueda en nombre, código, descripción |
| `categoria` | string  | Filtro por categoría específica         |
| `ubicacion` | string  | Filtro por ubicación específica         |
| `stockMin`  | number  | Stock mínimo                            |
| `stockMax`  | number  | Stock máximo                            |
| `sinStock`  | boolean | Solo repuestos sin stock                |
| `codigo`    | string  | Búsqueda por código específico          |
| `page`      | number  | Página (paginación)                     |
| `limit`     | number  | Elementos por página                    |
| `sortBy`    | string  | Campo de ordenamiento                   |
| `sortOrder` | string  | Orden (asc/desc)                        |

### Frontend (Client)

#### 1. Componente principal (`RepuestosPage.jsx`)

Características:

- **Filtros múltiples**: Búsqueda, categoría, ubicación, stock
- **Paginación inteligente**: Con información de páginas
- **Ordenamiento dinámico**: Por cualquier campo
- **Interfaz responsive**: Adaptada a diferentes pantallas
- **Estado de carga**: Indicadores visuales
- **Badges de stock**: Colores según disponibilidad

#### 2. Búsqueda rápida (`BusquedaRapida.jsx`)

Características:

- **Búsqueda en tiempo real** con debounce
- **Resultados instantáneos** con información relevante
- **Selección por click**
- **Indicadores de stock** con colores
- **Autocompletado inteligente**

#### 3. Estadísticas (`EstadisticasRepuestos.jsx`)

Incluye:

- **Resumen general**: Total, con stock, stock bajo, sin stock
- **Distribución por categoría**: Cantidad y stock total
- **Distribución por ubicación**: Cantidad y stock total
- **Gráficos de barras**: Visualización de porcentajes

### Uso de la API

#### Ejemplos de consultas:

```javascript
// Búsqueda básica
GET /api/repuestos?search=filtro

// Filtro por categoría
GET /api/repuestos?categoria=Filtros

// Filtro por ubicación
GET /api/repuestos?ubicacion=JD%204730

// Filtro por stock bajo
GET /api/repuestos?stockMin=1&stockMax=2

// Solo sin stock
GET /api/repuestos?sinStock=true

// Paginación con ordenamiento
GET /api/repuestos?page=2&limit=20&sortBy=stock&sortOrder=asc

// Búsqueda combinada
GET /api/repuestos?search=filtro&categoria=Filtros&ubicacion=JD%204730&page=1&limit=50
```

#### Respuesta de la API:

```json
{
  "repuestos": [
    {
      "id": 1,
      "nombre": "Filtro de aceite",
      "codigo": "RE504836",
      "stock": 3,
      "categoria": "Filtros",
      "ubicacion": "JD 4730",
      "descripcion": "Filtro de aceite para motor",
      "precio": null,
      "proveedor": null
    }
  ],
  "pagination": {
    "current": 1,
    "total": 5,
    "hasNext": true,
    "hasPrev": false,
    "totalItems": 124
  }
}
```

### Integración en el Dashboard

Para usar en el dashboard principal, agregar en `Dashboard.jsx`:

```jsx
import RepuestosPage from './RepuestosPage';
import BusquedaRapida from '../components/BusquedaRapida';
import EstadisticasRepuestos from '../components/EstadisticasRepuestos';

// En el switch de secciones:
case 'repuestos':
  return <RepuestosPage token={token} role={role} />;
```

### Características Destacadas

1. **Performance**: Consultas optimizadas con índices en campos de filtro
2. **UX**: Interfaz intuitiva con indicadores visuales
3. **Escalabilidad**: Paginación para manejar grandes volúmenes
4. **Flexibilidad**: Filtros combinables
5. **Responsive**: Funciona en móviles y desktop
6. **Accesibilidad**: Componentes semánticamente correctos

### Próximas Mejoras Sugeridas

1. **Exportación**: Generar CSV/PDF de resultados filtrados
2. **Filtros guardados**: Permitir guardar combinaciones de filtros
3. **Gráficos avanzados**: Integrar Chart.js o similar
4. **Notificaciones**: Alertas para stock bajo
5. **Historial**: Tracking de cambios de stock
6. **Predicciones**: IA para recomendaciones de restock

### CSV Normalizado

El archivo `repuestos_normalizado.csv` contiene **124 registros** listos para importar con las columnas:

- nombre, codigo, stock, categoria, ubicacion, descripcion

Total esperado después de importación: **124 repuestos**
