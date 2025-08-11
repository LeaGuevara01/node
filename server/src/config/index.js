/**
 * Configuración centralizada de la aplicación
 * Lee variables de entorno y proporciona valores por defecto seguros
 */

// Asegurar carga de variables de entorno tanto desde server/.env como desde la raíz del repo
// Esto evita fallos cuando se ejecuta desde /server y el .env está en la raíz.
try {
  const path = require('path');
  const dotenv = require('dotenv');
  const candidates = [
    path.resolve(__dirname, '../.env'),     // c:\...\server\.env
    path.resolve(__dirname, '../../.env'),  // c:\...\.env (raíz del repo)
  ];
  for (const p of candidates) {
    dotenv.config({ path: p }); // no sobreescribe valores ya definidos
  }
} catch (_) {
  // Si dotenv no está disponible o ocurre un error, continuar: en muchos entornos ya están definidas
}

/**
 * Obtiene una variable de entorno o lanza error si es requerida
 * @param {string} name - Nombre de la variable
 * @param {string} defaultValue - Valor por defecto (opcional)
 * @param {boolean} required - Si es requerida (default: true)
 * @returns {string} Valor de la variable
 */
function getEnvVar(name, defaultValue = null, required = true) {
  const value = process.env[name] || defaultValue;
  
  if (required && !value) {
    throw new Error(`Variable de entorno requerida no encontrada: ${name}`);
  }
  
  return value;
}

/**
 * Configuración del servidor
 */
const serverConfig = {
  // Server
  NODE_ENV: getEnvVar('NODE_ENV', 'development', false),
  PORT: parseInt(getEnvVar('PORT', '4000', false)),
  
  // Security
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  
  // Database
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  
  // CORS - Soporta múltiples orígenes separados por comas
  CORS_ORIGIN: (() => {
    const corsEnv = getEnvVar('CORS_ORIGIN', 'http://localhost:5173,http://localhost:3000', false);
    if (corsEnv.includes(',')) {
      return corsEnv.split(',').map(origin => origin.trim());
    }
    return corsEnv;
  })(),
  
  // Prisma
  PRISMA_HIDE_UPDATE_MESSAGE: getEnvVar('PRISMA_HIDE_UPDATE_MESSAGE', 'true', false),
  CHECKPOINT_DISABLE: getEnvVar('CHECKPOINT_DISABLE', '1', false),
};

/**
 * Configuración de URLs para diferentes entornos
 */
const urlConfig = {
  development: {
    backend: 'http://localhost:4000',
    frontend: 'http://localhost:5173',
    api: 'http://localhost:4000/api'
  },
  production: {
    backend: getEnvVar('PRODUCTION_BACKEND_URL', '', false),
    frontend: getEnvVar('PRODUCTION_FRONTEND_URL', '', false),
    api: getEnvVar('PRODUCTION_BACKEND_URL', '', false) + '/api'
  }
};

/**
 * Configuración de servicios de Render
 */
const renderConfig = {
  backendServiceName: getEnvVar('RENDER_BACKEND_SERVICE_NAME', 'sistemagestionagricola', false),
  frontendServiceName: getEnvVar('RENDER_FRONTEND_SERVICE_NAME', 'sistemagestionagricola-frontend', false),
  
  // Genera URLs automáticamente basado en nombres de servicios
  getBackendUrl() {
    return `https://${this.backendServiceName}.onrender.com`;
  },
  
  getFrontendUrl() {
    return `https://${this.frontendServiceName}.onrender.com`;
  },
  
  getApiUrl() {
    return `${this.getBackendUrl()}/api`;
  }
};

/**
 * Configuración completa basada en entorno
 */
const config = {
  ...serverConfig,
  
  // URLs dinámicas basadas en entorno
  urls: serverConfig.NODE_ENV === 'production' 
    ? urlConfig.production 
    : urlConfig.development,
    
  render: renderConfig,
  
  // Helpers para validación
  isProduction: () => serverConfig.NODE_ENV === 'production',
  isDevelopment: () => serverConfig.NODE_ENV === 'development',
  
  // Validar configuración completa
  validate() {
    const required = ['JWT_SECRET', 'DATABASE_URL'];
    const missing = required.filter(key => !this[key]);
    
    if (missing.length > 0) {
      throw new Error(`Variables de entorno faltantes: ${missing.join(', ')}`);
    }
    
    // Validar JWT_SECRET length
    if (this.JWT_SECRET.length < 32) {
      throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
    }
    
    // Validar DATABASE_URL format
    if (!this.DATABASE_URL.startsWith('postgresql://')) {
      throw new Error('DATABASE_URL debe ser una URL de PostgreSQL válida');
    }
    
    console.log('✅ Configuración validada correctamente');
    return true;
  }
};

module.exports = config;
