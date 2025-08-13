// Módulo: Servidor Express
// Rol: bootstrap de API, middlewares, rutas y documentación
// Notas: carga Swagger si existe, healthcheck para Render, CORS desde config

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./config');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const app = express();
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');
const prisma = require('./lib/prisma');

// Validar configuración al inicio
try {
  config.validate();
} catch (error) {
  console.error('❌ Error de configuración:', error.message);
  console.error('💡 Verifica tu archivo .env y las variables requeridas');
  process.exit(1);
}

// CORS configuration using centralized config
// En desarrollo, incluir siempre orígenes localhost aunque CORS_ORIGIN esté definido
const getCorsOrigins = () => {
  const fromEnv = (() => {
    const corsOrigin = config.CORS_ORIGIN;
    if (typeof corsOrigin === 'string' && corsOrigin.includes(',')) {
      return corsOrigin.split(',').map(o => o.trim());
    }
    if (typeof corsOrigin === 'string') {
      return [corsOrigin];
    }
    if (Array.isArray(corsOrigin)) {
      return corsOrigin;
    }
    return [];
  })();

  const devDefaults = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'];
  if (config.isDevelopment()) {
    // Unir y deduplicar
    return Array.from(new Set([...
      fromEnv,
      ...devDefaults
    ]));
  }
  return fromEnv.length ? fromEnv : devDefaults;
};

const corsOptions = {
  origin: getCorsOrigins(),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
// Responder a preflight requests a nivel global
app.options('*', cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());

// Health check endpoint para uptime y monitoreo
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// DB health check (attempts a lightweight query)
app.get('/api/health/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ db: 'up' });
  } catch (e) {
    res.status(500).json({ db: 'down', error: e.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Agroservicios API', 
    version: '1.0.0',
    docs: '/api/docs'
  });
});

// Swagger UI (only load if file exists)
try {
  const openapiSpec = yaml.load(fs.readFileSync(__dirname + '/docs/openapi.yaml', 'utf8'));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
} catch (error) {
  console.warn('OpenAPI spec not found, Swagger UI disabled');
}

// Rutas principales
app.use('/api/auth', require('./routes/auth'));
app.use('/api/maquinaria', require('./routes/maquinaria'));
app.use('/api/repuestos', require('./routes/repuestos'));
app.use('/api/proveedores', require('./routes/proveedores'));
app.use('/api/reparaciones', require('./routes/reparaciones'));
app.use('/api/users', require('./routes/users'));
// Alias en español para compatibilidad con el cliente (/api/usuarios)
app.use('/api/usuarios', require('./routes/users'));
app.use('/api/compras', require('./routes/compras'));

// Error handling middleware (respuesta consistente)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  console.log(`📝 Environment: ${config.NODE_ENV}`);
  
  const corsOrigins = getCorsOrigins();
  console.log(`🌐 CORS habilitado para: ${Array.isArray(corsOrigins) ? corsOrigins.join(', ') : corsOrigins}`);
  
  if (fs.existsSync(__dirname + '/docs/openapi.yaml')) {
    console.log(`📖 Swagger UI disponible en http://localhost:${PORT}/api/docs`);
  }
});
