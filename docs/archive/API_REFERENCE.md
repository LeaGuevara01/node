# 📚 API Reference - Documentación Completa

## 🌐 Información General

- **Base URL**: `http://localhost:4000/api` (desarrollo) | `https://sistemagestionagricola.onrender.com/api` (producción)
- **Formato**: JSON
- **Autenticación**: JWT Bearer Token
- **Headers Requeridos**: `Content-Type: application/json`

## 🔐 Autenticación

### Obtener Token

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Respuesta Exitosa (200)**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

### Usar Token en Requests

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Registrar Usuario (Solo Admin)

```http
POST /api/auth/register
Authorization: Bearer [admin-token]
Content-Type: application/json

{
  "nombre": "Nuevo Usuario",
  "email": "usuario@example.com",
  "password": "password123",
  "role": "USER"
}
```

## 🔧 Repuestos API

### Listar Repuestos con Filtros

```http
GET /api/repuestos?search=filtro&categoria=Filtros&page=1&limit=10
Authorization: Bearer [token]
```

#### Parámetros de Query

| Parámetro   | Tipo    | Descripción                                | Ejemplo                |
| ----------- | ------- | ------------------------------------------ | ---------------------- |
| `search`    | string  | Búsqueda en nombre, código, descripción    | `search=filtro aceite` |
| `categoria` | string  | Filtro por categoría específica            | `categoria=Filtros`    |
| `ubicacion` | string  | Filtro por ubicación específica            | `ubicacion=JD 4730`    |
| `stockMin`  | number  | Stock mínimo                               | `stockMin=5`           |
| `stockMax`  | number  | Stock máximo                               | `stockMax=50`          |
| `sinStock`  | boolean | Solo repuestos sin stock                   | `sinStock=true`        |
| `codigo`    | string  | Búsqueda por código específico             | `codigo=T19044`        |
| `page`      | number  | Página (default: 1)                        | `page=2`               |
| `limit`     | number  | Elementos por página (default: 10)         | `limit=20`             |
| `sortBy`    | string  | Campo de ordenamiento (default: createdAt) | `sortBy=stock`         |
| `sortOrder` | string  | Orden asc/desc (default: desc)             | `sortOrder=asc`        |

#### Respuesta (200)

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
      "proveedor": {
        "id": 1,
        "nombre": "Proveedor Ejemplo"
      },
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
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

### Crear Repuesto (Solo Admin)

```http
POST /api/repuestos
Authorization: Bearer [admin-token]
Content-Type: application/json

{
  "nombre": "Filtro de Aire",
  "codigo": "AF123",
  "descripcion": "Filtro de aire para motor",
  "categoria": "Filtros",
  "ubicacion": "Estantería A1",
  "stock": 15,
  "precioUnitario": 18.75,
  "proveedorId": 1
}
```

### Actualizar Repuesto (Solo Admin)

```http
PUT /api/repuestos/1
Authorization: Bearer [admin-token]
Content-Type: application/json

{
  "stock": 20,
  "precioUnitario": 19.50
}
```

### Eliminar Repuesto (Solo Admin)

```http
DELETE /api/repuestos/1
Authorization: Bearer [admin-token]
```

### Obtener Opciones de Filtros

```http
GET /api/repuestos/filtros
Authorization: Bearer [token]
```

**Respuesta (200)**:

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

### Búsqueda Rápida

```http
GET /api/repuestos/busqueda?q=filtro
Authorization: Bearer [token]
```

**Respuesta (200)**:

```json
{
  "resultados": [
    {
      "id": 1,
      "nombre": "Filtro de Aceite Motor",
      "codigo": "T19044",
      "categoria": "Filtros",
      "ubicacion": "JD 4730",
      "stock": 8
    }
  ],
  "total": 1
}
```

### Estadísticas de Repuestos

```http
GET /api/repuestos/estadisticas
Authorization: Bearer [token]
```

**Respuesta (200)**:

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

## 🚜 Maquinaria API

### Listar Maquinaria

```http
GET /api/maquinaria
Authorization: Bearer [token]
```

### Crear Maquinaria (Solo Admin)

```http
POST /api/maquinaria
Authorization: Bearer [admin-token]
Content-Type: application/json

{
  "marca": "John Deere",
  "modelo": "6145",
  "tipo": "Tractor",
  "numeroSerie": "JD6145001",
  "año": 2020,
  "horasUso": 1500,
  "estado": "OPERATIVO"
}
```

### Actualizar Maquinaria (Solo Admin)

```http
PUT /api/maquinaria/1
Authorization: Bearer [admin-token]
Content-Type: application/json

{
  "horasUso": 1600,
  "estado": "MANTENIMIENTO"
}
```

### Eliminar Maquinaria (Solo Admin)

```http
DELETE /api/maquinaria/1
Authorization: Bearer [admin-token]
```

## 👥 Proveedores API

### Listar Proveedores

```http
GET /api/proveedores
Authorization: Bearer [token]
```

### Crear Proveedor (Solo Admin)

```http
POST /api/proveedores
Authorization: Bearer [admin-token]
Content-Type: application/json

{
  "nombre": "Proveedores Agrícolas SA",
  "contacto": "Juan Pérez",
  "telefono": "+54 11 1234-5678",
  "email": "contacto@proveedores.com",
  "direccion": "Av. Principal 123, CABA"
}
```

### Actualizar Proveedor (Solo Admin)

```http
PUT /api/proveedores/1
Authorization: Bearer [admin-token]
Content-Type: application/json

{
  "telefono": "+54 11 8765-4321",
  "email": "nuevo@email.com"
}
```

### Eliminar Proveedor (Solo Admin)

```http
DELETE /api/proveedores/1
Authorization: Bearer [admin-token]
```

## 🛠️ Reparaciones API

### Listar Reparaciones

```http
GET /api/reparaciones
Authorization: Bearer [token]
```

### Crear Reparación

```http
POST /api/reparaciones
Authorization: Bearer [token]
Content-Type: application/json

{
  "maquinariaId": 1,
  "descripcion": "Cambio de aceite y filtros",
  "fechaInicio": "2024-01-15T09:00:00.000Z",
  "fechaFin": "2024-01-15T11:00:00.000Z",
  "costo": 250.50,
  "estado": "COMPLETADA",
  "repuestos": [
    {
      "repuestoId": 1,
      "cantidad": 2
    },
    {
      "repuestoId": 3,
      "cantidad": 1
    }
  ]
}
```

### Actualizar Reparación

```http
PUT /api/reparaciones/1
Authorization: Bearer [token]
Content-Type: application/json

{
  "estado": "EN_PROGRESO",
  "costo": 275.00
}
```

### Eliminar Reparación (Solo Admin)

```http
DELETE /api/reparaciones/1
Authorization: Bearer [admin-token]
```

## 👤 Usuarios API (Solo Admin)

### Listar Usuarios

```http
GET /api/users
Authorization: Bearer [admin-token]
```

### Crear Usuario

```http
POST /api/users/register
Authorization: Bearer [admin-token]
Content-Type: application/json

{
  "nombre": "Nuevo Usuario",
  "email": "usuario@example.com",
  "password": "password123",
  "role": "USER"
}
```

### Actualizar Usuario

```http
PUT /api/users/1
Authorization: Bearer [admin-token]
Content-Type: application/json

{
  "nombre": "Nombre Actualizado",
  "role": "ADMIN"
}
```

### Eliminar Usuario

```http
DELETE /api/users/1
Authorization: Bearer [admin-token]
```

## 🔍 Health Check

### Verificar Estado del Servidor

```http
GET /api/health
```

**Respuesta (200)**:

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "database": "connected",
  "uptime": 3600
}
```

## 📊 Códigos de Respuesta

| Código | Significado           | Descripción                     |
| ------ | --------------------- | ------------------------------- |
| 200    | OK                    | Solicitud exitosa               |
| 201    | Created               | Recurso creado exitosamente     |
| 400    | Bad Request           | Datos de entrada inválidos      |
| 401    | Unauthorized          | Token faltante o inválido       |
| 403    | Forbidden             | Sin permisos suficientes        |
| 404    | Not Found             | Recurso no encontrado           |
| 409    | Conflict              | Conflicto (ej: email duplicado) |
| 500    | Internal Server Error | Error del servidor              |

## ❌ Formato de Errores

```json
{
  "error": "Descripción del error",
  "code": "ERROR_CODE",
  "details": {
    "field": "Campo específico con error",
    "message": "Detalle adicional"
  }
}
```

### Ejemplos de Errores Comunes

#### Token Inválido (401)

```json
{
  "error": "Token inválido o expirado",
  "code": "INVALID_TOKEN"
}
```

#### Permisos Insuficientes (403)

```json
{
  "error": "Acceso denegado",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

#### Validación de Datos (400)

```json
{
  "error": "Datos de entrada inválidos",
  "code": "VALIDATION_ERROR",
  "details": [
    {
      "field": "email",
      "message": "Email es requerido"
    },
    {
      "field": "stock",
      "message": "Stock debe ser un número positivo"
    }
  ]
}
```

## 🚀 Ejemplos de Uso con JavaScript

### Configurar Cliente API

```javascript
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en la solicitud');
    }

    return response.json();
  }

  // Métodos específicos
  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.token);
    return response;
  }

  async getRepuestos(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    return this.request(`/repuestos?${queryString}`);
  }

  async createRepuesto(data) {
    return this.request('/repuestos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Uso
const api = new ApiClient('http://localhost:4000/api');

// Login
await api.login('admin@example.com', 'password');

// Obtener repuestos con filtros
const repuestos = await api.getRepuestos({
  search: 'filtro',
  categoria: 'Filtros',
  page: 1,
  limit: 10,
});

// Crear repuesto
const nuevoRepuesto = await api.createRepuesto({
  nombre: 'Filtro Nuevo',
  categoria: 'Filtros',
  stock: 10,
  precioUnitario: 25.5,
});
```

### Manejo de Errores

```javascript
try {
  const repuestos = await api.getRepuestos();
  console.log('Repuestos:', repuestos);
} catch (error) {
  if (error.message.includes('Token inválido')) {
    // Redirigir a login
    window.location.href = '/login';
  } else {
    // Mostrar error al usuario
    console.error('Error:', error.message);
  }
}
```

### Paginación (Detalles)

```javascript
class RepuestosPaginated {
  constructor(api) {
    this.api = api;
    this.currentPage = 1;
    this.filters = {};
  }

  async loadPage(page = 1) {
    this.currentPage = page;
    const response = await this.api.getRepuestos({
      ...this.filters,
      page: this.currentPage,
      limit: 10,
    });

    return {
      items: response.repuestos,
      pagination: response.pagination,
    };
  }

  async nextPage() {
    return this.loadPage(this.currentPage + 1);
  }

  async prevPage() {
    return this.loadPage(this.currentPage - 1);
  }

  setFilters(filters) {
    this.filters = filters;
    this.currentPage = 1;
    return this.loadPage();
  }
}
```

## 📝 Notas de Implementación

### Rate Limiting

- En desarrollo: Sin límites
- En producción: 100 requests por IP cada 15 minutos

### Cache

- Los endpoints de filtros y estadísticas tienen cache de 5 minutos
- Las búsquedas rápidas no tienen cache

### Paginación

- Límite máximo por página: 100 elementos
- Límite por defecto: 10 elementos

### Ordenamiento

- Campos válidos para `sortBy`: todos los campos del modelo
- Órdenes válidos para `sortOrder`: `asc`, `desc`

### Búsqueda

- La búsqueda es case-insensitive
- Se busca en campos: `nombre`, `codigo`, `descripcion`
- Mínimo 2 caracteres para búsqueda rápida

---

**📚 Para más ejemplos y casos de uso, consultar [`SISTEMA_FILTROS.md`](./SISTEMA_FILTROS.md)**
