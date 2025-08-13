# 🔧 Solución CORS - Problema Resuelto

## ❌ Problema Original

```
Access to fetch at 'http://localhost:4000/api/auth/login' from origin 'http://localhost:3000'
has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header contains multiple
values 'http://localhost:5173,http://localhost:3000,https://sistemagestionagricola-frontend.onrender.com',
but only one is allowed.
```

## 🎯 Causa Raíz

El servidor estaba enviando múltiples valores en el header `Access-Control-Allow-Origin` como una cadena separada por comas, cuando debe ser un array manejado correctamente por Express CORS middleware.

## ✅ Solución Implementada

### 1. **Función `getCorsOrigins()` - `server/src/index.js`**

```javascript
// Nueva función para manejar múltiples orígenes correctamente
const getCorsOrigins = () => {
  const corsOrigin = config.CORS_ORIGIN;

  // Si es una cadena separada por comas, dividir en array
  if (typeof corsOrigin === 'string' && corsOrigin.includes(',')) {
    return corsOrigin.split(',').map((origin) => origin.trim());
  }

  // Si es una cadena simple, devolverla como array
  if (typeof corsOrigin === 'string') {
    return [corsOrigin];
  }

  // Si ya es un array, devolverlo
  if (Array.isArray(corsOrigin)) {
    return corsOrigin;
  }

  // Fallback por defecto
  return ['http://localhost:3000'];
};

// Configuración CORS actualizada
const corsOptions = {
  origin: getCorsOrigins(), // Array en lugar de string
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

### 2. **Configuración Centralizada - `server/src/config/index.js`**

```javascript
// Configuración actualizada para manejar múltiples orígenes
module.exports = {
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL,
};
```

### 3. **Variables de Entorno Actualizadas**

#### Desarrollo (`.env`)

```env
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

#### Producción (Render Environment Variables)

```env
CORS_ORIGIN=https://sistemagestionagricola-frontend.onrender.com,http://localhost:3000,http://localhost:5173
```

## 🧪 Testing de la Solución

### 1. **Verificar en Desarrollo**

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev

# Terminal 3: Test CORS
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:4000/api/auth/login
```

### 2. **Respuesta Esperada**

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization
Access-Control-Allow-Credentials: true
```

### 3. **Test desde Frontend**

```javascript
// En consola del navegador
fetch('http://localhost:4000/api/health')
  .then((res) => res.json())
  .then((data) => console.log('✅ CORS funcionando:', data))
  .catch((err) => console.error('❌ Error CORS:', err));
```

## 🔍 Análisis del Problema

### Antes (❌ Incorrecto)

```javascript
// Esto causaba el error
const corsOptions = {
  origin: 'http://localhost:3000,http://localhost:5173', // String con comas
  credentials: true,
};
```

**Resultado**: Header `Access-Control-Allow-Origin` contenía literalmente:

```
Access-Control-Allow-Origin: http://localhost:3000,http://localhost:5173
```

### Después (✅ Correcto)

```javascript
// Esto funciona correctamente
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Array
  credentials: true,
};
```

**Resultado**: Express CORS middleware maneja correctamente el array y retorna un solo origen válido según el request.

## 🛠️ Implementación Técnica

### 1. **Flujo de Validación CORS**

```javascript
// server/src/index.js
const validateOrigin = (origin, callback) => {
  const allowedOrigins = getCorsOrigins();

  // Permitir requests sin origin (ej: mobile apps, Postman)
  if (!origin) return callback(null, true);

  // Verificar si el origin está en la lista permitida
  if (allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('No permitido por CORS'));
  }
};

const corsOptions = {
  origin: validateOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
};
```

### 2. **Logging de CORS para Debug**

```javascript
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    console.log('CORS Preflight:', {
      origin: req.headers.origin,
      method: req.headers['access-control-request-method'],
      headers: req.headers['access-control-request-headers'],
    });
  }
  next();
});
```

### 3. **Manejo de Errores CORS**

```javascript
app.use((err, req, res, next) => {
  if (err.message === 'No permitido por CORS') {
    res.status(403).json({
      error: 'CORS: Origen no permitido',
      origin: req.headers.origin,
      allowedOrigins: getCorsOrigins(),
    });
  } else {
    next(err);
  }
});
```

## 📊 Configuraciones por Entorno

### Desarrollo Local

```env
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:8080
```

### Staging

```env
CORS_ORIGIN=https://staging-frontend.onrender.com,http://localhost:3000
```

### Producción

```env
CORS_ORIGIN=https://sistemagestionagricola-frontend.onrender.com
```

## 🚀 Deployment Considerations

### 1. **Render Environment Variables**

En Render Dashboard:

- **Backend Service** → **Environment**
- Agregar: `CORS_ORIGIN=https://tu-frontend.onrender.com`

### 2. **Verificación Post-Deploy**

```bash
# Test CORS en producción
curl -H "Origin: https://sistemagestionagricola-frontend.onrender.com" \
     -X OPTIONS \
     https://sistemagestionagricola.onrender.com/api/auth/login
```

### 3. **Health Check con CORS**

```javascript
// Endpoint para verificar CORS
app.get('/api/cors-test', (req, res) => {
  res.json({
    status: 'CORS OK',
    origin: req.headers.origin,
    allowedOrigins: getCorsOrigins(),
    timestamp: new Date().toISOString(),
  });
});
```

## 🐛 Troubleshooting

### Problema: Frontend en puerto diferente

**Solución**: Actualizar `CORS_ORIGIN`

```env
# Si frontend corre en puerto 8080
CORS_ORIGIN=http://localhost:3000,http://localhost:5173,http://localhost:8080
```

### Problema: CORS en subdominios

**Solución**: Permitir subdominios específicos

```javascript
const corsOptions = {
  origin: (origin, callback) => {
    // Permitir subdominios de example.com
    if (!origin || /^https:\/\/.*\.example\.com$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
};
```

### Problema: Credenciales no enviadas

**Solución**: Configurar `credentials: true` en ambos lados

```javascript
// Backend
const corsOptions = {
  origin: getCorsOrigins(),
  credentials: true, // ← Importante
};

// Frontend
fetch('/api/login', {
  method: 'POST',
  credentials: 'include', // ← Importante
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(loginData),
});
```

## ✅ Verificación Final

### Checklist de Verificación CORS

- [x] `getCorsOrigins()` función implementada
- [x] `corsOptions` configurado con array de orígenes
- [x] `credentials: true` habilitado
- [x] Variables de entorno actualizadas
- [x] Frontend puede conectar sin errores CORS
- [x] Preflight OPTIONS requests funcionan
- [x] Producción configurada correctamente

### Test de Integración Completo

```javascript
// Test completo frontend-backend
describe('CORS Integration', () => {
  test('Login desde frontend funciona', async () => {
    const response = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'test123' }),
    });

    expect(response.ok).toBe(true);
    expect(response.headers.get('access-control-allow-origin')).toBe('http://localhost:3000');
  });
});
```

## 📚 Referencias

- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Middleware](https://github.com/expressjs/cors)
- [CORS Preflight](https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request)

---

**✅ Estado**: RESUELTO - CORS funcionando correctamente en desarrollo y producción
