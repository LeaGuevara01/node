# 📊 Sistema de Filtros Avanzados para Repuestos

## 🎯 Descripción General

Sistema completo de filtros para la gestión de repuestos que incluye:

- 🔍 **Búsqueda en tiempo real** con debounce
- 📂 **Filtros por categoría** y ubicación
- 📊 **Filtros de stock** (rango y sin stock)
- 📄 **Paginación inteligente**
- 📈 **Estadísticas detalladas**
- 🎨 **Interfaz responsive**

## 🚀 Características Implementadas

### Frontend Features

- **Búsqueda instantánea** con autocompletado
- **Badges de stock** con colores indicativos:
  - 🔴 **Rojo**: Sin stock (0 unidades)
  - 🟡 **Amarillo**: Stock bajo (1-10 unidades)
  - 🟢 **Verde**: Stock disponible (>10 unidades)
- **Filtros múltiples** aplicables simultáneamente
- **Exportación** (preparado para CSV/PDF)
- **Interfaz responsive** para móviles y desktop

### Backend Features

- **Búsqueda optimizada** en múltiples campos
- **Paginación** con límites configurables
- **Ordenamiento dinámico** por cualquier campo
- **Estadísticas** calculadas en tiempo real
- **Cache** de opciones de filtros

## 📡 API Endpoints

### 1. **Lista con Filtros**

```http
GET /api/repuestos
```

#### Parámetros de Query

| Parámetro   | Tipo    | Descripción                             | Ejemplo                |
| ----------- | ------- | --------------------------------------- | ---------------------- |
| `search`    | string  | Búsqueda en nombre, código, descripción | `search=filtro aceite` |
| `categoria` | string  | Filtro por categoría específica         | `categoria=Filtros`    |
| `ubicacion` | string  | Filtro por ubicación específica         | `ubicacion=JD 4730`    |
| `stockMin`  | number  | Stock mínimo                            | `stockMin=5`           |
| `stockMax`  | number  | Stock máximo                            | `stockMax=50`          |
| `sinStock`  | boolean | Solo repuestos sin stock                | `sinStock=true`        |
| `codigo`    | string  | Búsqueda por código específico          | `codigo=T19044`        |
| `page`      | number  | Página (paginación)                     | `page=2`               |
| `limit`     | number  | Elementos por página                    | `limit=20`             |
| `sortBy`    | string  | Campo de ordenamiento                   | `sortBy=stock`         |
| `sortOrder` | string  | Orden (asc/desc)                        | `sortOrder=desc`       |

#### Ejemplo de Uso

```javascript
// Buscar filtros de aceite en JD 4730 con stock bajo
const response = await fetch(
  "/api/repuestos?" +
    new URLSearchParams({
      search: "aceite",
      categoria: "Filtros",
      ubicacion: "JD 4730",
      stockMax: "10",
      page: "1",
      limit: "10",
    })
);
```

#### Respuesta

```json
{
  "repuestos": [
    {
      "id": 1,
      "nombre": "Filtro de Aceite Motor",
      "codigo": "T19044",
      "descripcion": "Filtro de aceite para motor JD",
      "categoria": "Filtros",
      "ubicacion": "JD 4730",
      "stock": 8,
      "precioUnitario": 25.5,
      "proveedorId": 1,
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. **Opciones de Filtros**

```http
GET /api/repuestos/filtros
```

#### Respuesta

```json
{
  "categorias": ["Filtros", "Lubricantes", "Piezas Motor", "Hidráulicos"],
  "ubicaciones": ["JD 4730", "JD 6145/6615", "Estantería superior", "Cofre"],
  "rangosStock": {
    "min": 0,
    "max": 150
  }
}
```

### 3. **Búsqueda Rápida**

```http
GET /api/repuestos/busqueda?q=filtro
```

#### Respuesta

```json
{
  "resultados": [
    {
      "id": 1,
      "nombre": "Filtro de Aceite Motor",
      "codigo": "T19044",
      "categoria": "Filtros",
      "stock": 8
    }
  ],
  "total": 1
}
```

### 4. **Estadísticas Detalladas**

```http
GET /api/repuestos/estadisticas
```

#### Respuesta

```json
{
  "totales": {
    "totalRepuestos": 124,
    "totalCategorias": 18,
    "totalUbicaciones": 18,
    "stockTotal": 2850,
    "valorInventario": 145500.75
  },
  "distribucionCategorias": [
    {
      "categoria": "Filtros",
      "cantidad": 25,
      "porcentaje": 20.16
    }
  ],
  "distribucionUbicaciones": [
    {
      "ubicacion": "JD 4730",
      "cantidad": 18,
      "porcentaje": 14.52
    }
  ],
  "estadisticasStock": {
    "sinStock": 12,
    "stockBajo": 28,
    "stockNormal": 84
  }
}
```

## 🎨 Componentes Frontend

### 1. **RepuestosPage.jsx**

Componente principal que maneja:

- Estado de filtros
- Paginación
- Comunicación con API
- Renderizado de resultados

```jsx
const [filtros, setFiltros] = useState({
  search: "",
  categoria: "",
  ubicacion: "",
  stockMin: "",
  stockMax: "",
  sinStock: false,
});
```

### 2. **BusquedaRapida.jsx**

Componente de búsqueda con:

- Debounce de 300ms
- Autocompletado
- Navegación por teclado

```jsx
const [query, setQuery] = useState("");
const [resultados, setResultados] = useState([]);
const [isOpen, setIsOpen] = useState(false);
```

### 3. **EstadisticasRepuestos.jsx**

Dashboard de estadísticas con:

- Gráficos de distribución
- Métricas de stock
- Alertas de stock bajo

## 🔧 Implementación Backend

### Controlador Principal (`repuestoController.js`)

```javascript
// Función principal de filtros
exports.getRepuestos = async (req, res) => {
  try {
    const {
      search,
      categoria,
      ubicacion,
      stockMin,
      stockMax,
      sinStock,
      codigo,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Construcción de filtros dinámicos
    const whereClause = {};

    if (search) {
      whereClause.OR = [
        { nombre: { contains: search, mode: "insensitive" } },
        { descripcion: { contains: search, mode: "insensitive" } },
        { codigo: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoria) whereClause.categoria = categoria;
    if (ubicacion) whereClause.ubicacion = ubicacion;
    if (codigo) whereClause.codigo = { contains: codigo, mode: "insensitive" };

    // Filtros de stock
    if (sinStock === "true") {
      whereClause.stock = 0;
    } else {
      if (stockMin || stockMax) {
        whereClause.stock = {};
        if (stockMin) whereClause.stock.gte = parseInt(stockMin);
        if (stockMax) whereClause.stock.lte = parseInt(stockMax);
      }
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Query principal
    const [repuestos, total] = await Promise.all([
      prisma.repuesto.findMany({
        where: whereClause,
        skip,
        take: parseInt(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          proveedor: {
            select: { id: true, nombre: true },
          },
        },
      }),
      prisma.repuesto.count({ where: whereClause }),
    ]);

    // Respuesta con paginación
    res.json({
      repuestos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
        hasNext: skip + parseInt(limit) < total,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Función de Búsqueda Rápida

```javascript
exports.busquedaRapida = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({ resultados: [], total: 0 });
    }

    const resultados = await prisma.repuesto.findMany({
      where: {
        OR: [
          { nombre: { contains: q, mode: "insensitive" } },
          { codigo: { contains: q, mode: "insensitive" } },
          { descripcion: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        nombre: true,
        codigo: true,
        categoria: true,
        ubicacion: true,
        stock: true,
      },
      take: 10,
      orderBy: { nombre: "asc" },
    });

    res.json({
      resultados,
      total: resultados.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## 🎯 Casos de Uso Comunes

### 1. **Buscar Filtros con Stock Bajo**

```javascript
const filtros = {
  search: "filtro",
  stockMax: "10",
  sortBy: "stock",
  sortOrder: "asc",
};
```

### 2. **Repuestos de JD 4730 sin Stock**

```javascript
const filtros = {
  ubicacion: "JD 4730",
  sinStock: true,
};
```

### 3. **Lubricantes por Código**

```javascript
const filtros = {
  categoria: "Lubricantes",
  codigo: "SAE",
  sortBy: "nombre",
};
```

## 🔮 Funcionalidades Futuras

- [ ] **Exportación CSV/PDF** de resultados filtrados
- [ ] **Filtros favoritos** guardados por usuario
- [ ] **Alertas automáticas** de stock bajo
- [ ] **Búsqueda por imagen** de repuestos
- [ ] **Códigos QR** para gestión rápida
- [ ] **Integración con proveedores** para pedidos automáticos

## 📊 Rendimiento

- **Búsqueda optimizada** con índices en campos frecuentes
- **Paginación** para manejar grandes volúmenes
- **Debounce** en frontend para reducir requests
- **Cache** de filtros para mejorar UX

## 🐛 Troubleshooting

### Búsqueda muy lenta

```sql
-- Crear índices para mejorar rendimiento
CREATE INDEX idx_repuesto_nombre ON repuesto(nombre);
CREATE INDEX idx_repuesto_categoria ON repuesto(categoria);
CREATE INDEX idx_repuesto_ubicacion ON repuesto(ubicacion);
```

### Filtros no funcionan

1. Verificar estructura de query parameters
2. Revisar logs del servidor
3. Confirmar que los campos existen en la base de datos
