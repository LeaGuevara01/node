/**
 * Script para generar archivos de configuración de deploy
 * Usa variables de entorno para crear configuraciones seguras
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * Obtiene variable de entorno con validación
 */
function getEnvVar(name, defaultValue = null, required = true) {
  const value = process.env[name] || defaultValue;
  
  if (required && !value) {
    console.error(`❌ Variable requerida no encontrada: ${name}`);
    process.exit(1);
  }
  
  return value;
}

/**
 * Template para render.yaml con variables dinámicas
 */
function generateRenderYaml() {
  const backendService = getEnvVar('RENDER_BACKEND_SERVICE_NAME', 'sistemagestionagricola', false);
  const frontendService = getEnvVar('RENDER_FRONTEND_SERVICE_NAME', 'sistemagestionagricola-frontend', false);
  const jwtSecret = getEnvVar('JWT_SECRET');
  const databaseUrl = getEnvVar('DATABASE_URL');
  
  const template = `services:
  # Backend API
  - type: web
    name: ${backendService}
    env: node
    region: oregon
    plan: free
    rootDir: server
    buildCommand: npm install && npx prisma generate
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 4000
      - key: JWT_SECRET
        value: ${jwtSecret}
      - key: DATABASE_URL
        value: ${databaseUrl}
      - key: CORS_ORIGIN
        value: https://${frontendService}.onrender.com
      - key: PRISMA_HIDE_UPDATE_MESSAGE
        value: true
      - key: CHECKPOINT_DISABLE
        value: 1
    autoDeploy: true

  # Frontend App
  - type: web
    name: ${frontendService}
    env: static
    region: oregon
    plan: free
    rootDir: client
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    envVars:
      - key: VITE_API_URL
        value: https://${backendService}.onrender.com/api
    headers:
      - path: /*
        name: Cache-Control
        value: no-cache
      - path: /assets/*
        name: Cache-Control
        value: max-age=31536000
    redirects:
      - source: /*
        destination: /index.html
        type: rewrite
    autoDeploy: true`;

  return template;
}

/**
 * Template para .env.production del cliente
 */
function generateClientEnvProduction() {
  const backendService = getEnvVar('RENDER_BACKEND_SERVICE_NAME', 'sistemagestionagricola', false);
  
  const template = `# Variables de entorno para PRODUCCION
# Este archivo se genera automáticamente - NO editar manualmente

# URL de la API del backend en producción
VITE_API_URL=https://${backendService}.onrender.com/api

# Información de la aplicación
VITE_APP_NAME="Sistema de Gestión Agrícola"
VITE_APP_VERSION="1.0.0"`;

  return template;
}

/**
 * Genera todos los archivos de configuración
 */
function generateConfigs() {
  console.log('🔧 Generando archivos de configuración...');
  
  try {
    // Crear directorio si no existe
    const configDir = path.join(__dirname, '..');
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    // Generar render.yaml
    const renderYaml = generateRenderYaml();
    fs.writeFileSync(path.join(configDir, 'render.yaml'), renderYaml);
    console.log('✅ render.yaml generado');
    
    // Generar .env.production para cliente
    const clientEnv = generateClientEnvProduction();
    const clientDir = path.join(configDir, 'client');
    if (!fs.existsSync(clientDir)) {
      fs.mkdirSync(clientDir, { recursive: true });
    }
    fs.writeFileSync(path.join(clientDir, '.env.production'), clientEnv);
    console.log('✅ client/.env.production generado');
    
    console.log('\n🚀 Archivos de configuración generados exitosamente!');
    console.log('⚠️  IMPORTANTE: Estos archivos contienen credenciales - NO los subas a Git');
    
  } catch (error) {
    console.error('❌ Error generando configuraciones:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateConfigs();
}

module.exports = {
  generateRenderYaml,
  generateClientEnvProduction,
  generateConfigs
};
