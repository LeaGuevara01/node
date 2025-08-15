# 🔒 Guía de Seguridad

## ⚠️ Resumen de Estado de Seguridad

| Aspecto         | Estado               | Prioridad |
| --------------- | -------------------- | --------- |
| Credenciales DB | 🔴 Requiere rotación | CRÍTICA   |
| JWT Secret      | 🔴 Requiere rotación | CRÍTICA   |
| CORS Config     | ✅ Resuelto          | -         |
| Variables ENV   | ✅ Sanitizado        | -         |
| Documentación   | ✅ Sanitizado        | -         |

## 🚨 Acciones Críticas Pendientes

### 1. **Rotar Credenciales de Base de Datos** (URGENTE)

#### En Render Dashboard:

1. Ir a **PostgreSQL Database**
2. **Settings** → **Danger Zone**
3. **Reset Database Password**
4. Copiar nueva `DATABASE_URL`
5. Actualizar en **Backend Environment Variables**

#### Verificar Rotación:

```bash
# Probar nueva conexión
npx prisma db pull
```

### 2. **Regenerar JWT Secret** (URGENTE)

```bash
# Generar nuevo secret (256-bit)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Actualizar en Render:

- **Backend** → **Environment** → `JWT_SECRET`

### 3. **Verificar CORS Configuration** (COMPLETADO ✅)

```javascript
// server/src/index.js - Ya implementado
const getCorsOrigins = () => {
  const corsOrigin = config.CORS_ORIGIN;

  if (typeof corsOrigin === 'string' && corsOrigin.includes(',')) {
    return corsOrigin.split(',').map((origin) => origin.trim());
  }

  return Array.isArray(corsOrigin) ? corsOrigin : [corsOrigin];
};
```

## 🛡️ Mejores Prácticas Implementadas

### 1. **Autenticación Segura**

```javascript
// JWT con expiración
const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
  expiresIn: '24h',
});

// Hash de contraseñas
const hashedPassword = await bcrypt.hash(password, 10);
```

### 2. **Validación de Entrada**

```javascript
// Sanitización de parámetros
const sanitizeQuery = (query) => {
  const allowedFields = ['search', 'categoria', 'ubicacion', 'page', 'limit'];
  return Object.keys(query)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = query[key];
      return obj;
    }, {});
};
```

### 3. **Control de Acceso por Roles**

```javascript
// Middleware de autorización
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};

// Aplicación en rutas
router.post('/repuestos', requireAuth, requireAdmin, createRepuesto);
router.delete('/repuestos/:id', requireAuth, requireAdmin, deleteRepuesto);
```

### 4. **Variables de Entorno Seguras**

```env
# ✅ Configuración segura
DATABASE_URL=postgresql://[auto-generated-by-render]
JWT_SECRET=[256-bit-random-string]
CORS_ORIGIN=https://sistemagestionagricola-frontend.onrender.com
NODE_ENV=production

# ❌ NO hacer
DATABASE_URL=postgresql://user:123@localhost/db
JWT_SECRET=mysecret
CORS_ORIGIN=*
```

## 🔍 Log de Sanitización Completado

### Archivos Eliminados (Contenían Credenciales)

- ❌ `DEPLOY_FINAL.md`
- ❌ `DEPLOYMENT_COMMANDS.md`
- ❌ `DATABASE_CONNECTION_GUIDE.md`
- ❌ `RENDER_DEPLOY_GUIDE.md`

### Archivos Sanitizados

- ✅ `README.md` - Credenciales reemplazadas por placeholders
- ✅ `deploy.ps1` - Credenciales movidas a variables de entorno
- ✅ `.env` - Convertido a `.env.example`

### Templates Seguros Creados

- ✅ `docs/DEPLOYMENT.md` - Guía sin credenciales reales
- ✅ `docs/SECURITY.md` - Este archivo
- ✅ `docs/SANITIZATION_LOG.md` - Log de cambios

## 🚧 Configuración de Desarrollo Seguro

### 1. **Archivo .env.example**

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/sistema_agricola"

# JWT
JWT_SECRET="generar_con_openssl_rand_hex_32"

# CORS
CORS_ORIGIN="http://localhost:3000,http://localhost:5173"

# Puerto
PORT=4000

# Entorno
NODE_ENV="development"
```

### 2. **Configuración de .gitignore**

```gitignore
# Variables de entorno
.env
.env.local
.env.production

# Logs
logs/
*.log

# Base de datos local
*.db
*.sqlite

# Credenciales
credentials/
secrets/
```

### 3. **Scripts de Desarrollo Seguro**

```json
{
  "scripts": {
    "dev": "NODE_ENV=development nodemon src/index.js",
    "start": "NODE_ENV=production node src/index.js",
    "test": "NODE_ENV=test jest",
    "security-check": "npm audit && npm outdated"
  }
}
```

## 🔐 Configuración de Producción

### 1. **Headers de Seguridad**

```javascript
// server/src/index.js
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  next();
});
```

### 2. **Rate Limiting**

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Demasiadas solicitudes, intenta más tarde',
});

app.use('/api/', limiter);
```

### 3. **Validación de Input**

```javascript
const { body, validationResult } = require('express-validator');

const validateRepuesto = [
  body('nombre').trim().isLength({ min: 1 }).escape(),
  body('categoria').trim().isLength({ min: 1 }).escape(),
  body('stock').isInt({ min: 0 }),
  body('precio').isFloat({ min: 0 }),
];

router.post('/repuestos', validateRepuesto, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Continuar con lógica
});
```

## 📊 Monitoreo de Seguridad

### 1. **Logs de Seguridad**

```javascript
const winston = require('winston');

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'security.log' })],
});

// Log intentos de acceso
app.use('/api/admin', (req, res, next) => {
  securityLogger.info('Admin access attempt', {
    ip: req.ip,
    user: req.user?.id,
    endpoint: req.path,
    timestamp: new Date(),
  });
  next();
});
```

### 2. **Health Checks de Seguridad**

```javascript
app.get('/api/security-health', requireAdmin, (req, res) => {
  const checks = {
    database: 'connected',
    jwt: process.env.JWT_SECRET ? 'configured' : 'missing',
    cors: process.env.CORS_ORIGIN ? 'configured' : 'missing',
    https: req.secure ? 'enabled' : 'disabled',
  };

  res.json({ status: 'OK', checks });
});
```

## 🔄 Auditoría Regular

### Checklist Mensual

- [ ] **Actualizar dependencias**: `npm audit fix`
- [ ] **Revisar logs de seguridad**
- [ ] **Verificar certificados SSL**
- [ ] **Backup de base de datos**
- [ ] **Rotar JWT secrets** (cada 3 meses)

### Scripts de Auditoría

```bash
# audit-security.sh
#!/bin/bash
echo "🔍 Iniciando auditoría de seguridad..."

# 1. Verificar dependencias vulnerables
npm audit --audit-level high

# 2. Verificar configuración
if [ -z "$JWT_SECRET" ]; then
    echo "❌ JWT_SECRET no configurado"
fi

# 3. Verificar archivos sensibles
if [ -f ".env" ]; then
    echo "⚠️ Archivo .env encontrado (no debería estar en producción)"
fi

echo "✅ Auditoría completada"
```

## 📞 Incident Response

### En caso de brecha de seguridad:

1. **Inmediato** (0-1 hora):
   - Rotar todas las credenciales
   - Revisar logs de acceso
   - Desactivar cuentas comprometidas

2. **Corto plazo** (1-24 horas):
   - Analizar scope del incidente
   - Aplicar patches de seguridad
   - Notificar a usuarios si es necesario

3. **Mediano plazo** (1-7 días):
   - Implementar medidas adicionales
   - Actualizar procedimientos
   - Documentar lecciones aprendidas

## 🎯 Roadmap de Seguridad

### Próximas mejoras:

1. **Two-Factor Authentication (2FA)**
2. **Encriptación de datos sensibles**
3. **WAF (Web Application Firewall)**
4. **Automated security scanning**
5. **Penetration testing**

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)
- [Render Security Docs](https://render.com/docs/security)

---

**⚠️ RECORDATORIO**: Las credenciales comprometidas identificadas DEBEN ser rotadas antes de cualquier deployment público.
