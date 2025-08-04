require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./config');
const app = express();
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');

// Validar configuración al inicio
try {
  config.validate();
} catch (error) {
  console.error('❌ Error de configuración:', error.message);
  console.error('💡 Verifica tu archivo .env y las variables requeridas');
  process.exit(1);
}

// CORS configuration using centralized config
const getCorsOrigins = () => {
  const corsOrigin = config.CORS_ORIGIN;
  
  // Si es una cadena separada por comas, dividir en array
  if (typeof corsOrigin === 'string' && corsOrigin.includes(',')) {
    return corsOrigin.split(',').map(origin => origin.trim());
  }
  
  // Si es una cadena simple, devolverla como array
  if (typeof corsOrigin === 'string') {
    return [corsOrigin];
  }
  
  // Si ya es un array, devolverlo
  if (Array.isArray(corsOrigin)) {
    return corsOrigin;
  }
  
  // Fallback a valores por defecto
  return ['http://localhost:5173', 'http://localhost:3000'];
};

const corsOptions = {
  origin: getCorsOrigins(),
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
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

// Error handling middleware
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
