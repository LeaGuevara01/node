/**
 * Configuración centralizada del sistema de logging
 *
 * Este archivo configura el comportamiento del logging en toda la aplicación:
 * - Niveles de logging por entorno
 * - Configuraciones específicas por módulo
 * - Inicialización automática del sistema
 * - Métricas y monitoreo de performance
 */

import {
  logger,
  apiLogger,
  uiLogger,
  dataLogger,
  authLogger,
  filterLogger,
  navLogger,
  setupGlobalErrorLogging,
  LoggerConfig,
  LOG_LEVELS,
} from './logger';

// Configuración específica por entorno
const ENVIRONMENT_CONFIGS = {
  development: {
    ...LoggerConfig.development,
    enableApiLogging: true,
    enablePerformanceLogging: true,
    enableDeprecationWarnings: true,
    logApiResponses: false, // No loggear responses completas en desarrollo
    maxApiLogLength: 500,
  },

  production: {
    ...LoggerConfig.production,
    enableApiLogging: true,
    enablePerformanceLogging: true,
    enableDeprecationWarnings: false, // Desactivar warnings en producción
    logApiResponses: false,
    maxApiLogLength: 200,
  },

  testing: {
    ...LoggerConfig.testing,
    enableApiLogging: false, // Menos logging en tests
    enablePerformanceLogging: false,
    enableDeprecationWarnings: false,
    logApiResponses: false,
    maxApiLogLength: 100,
  },
};

// Obtener configuración para el entorno actual
const getCurrentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return ENVIRONMENT_CONFIGS[env] || ENVIRONMENT_CONFIGS.development;
};

/**
 * Inicializa el sistema de logging con la configuración apropiada
 */
export function initializeLogging() {
  const config = getCurrentConfig();

  logger.info('🔧 Inicializando sistema de logging', {
    environment: process.env.NODE_ENV || 'development',
    config: {
      level: Object.keys(LOG_LEVELS)[config.level],
      apiLogging: config.enableApiLogging,
      performanceLogging: config.enablePerformanceLogging,
      deprecationWarnings: config.enableDeprecationWarnings,
    },
  });

  // Configurar captura de errores globales
  if (config.enableGlobalErrorCapture !== false) {
    setupGlobalErrorLogging();
    logger.info('✅ Captura de errores globales activada');
  }

  // Configurar métricas de performance
  if (config.enablePerformanceLogging) {
    setupPerformanceLogging();
    logger.info('📊 Logging de performance activado');
  }

  // Configurar logging específico para desarrollo
  if (process.env.NODE_ENV === 'development') {
    setupDevelopmentLogging();
    logger.info('🛠️ Configuración de desarrollo activada');
  }

  logger.success('Sistema de logging inicializado correctamente');
}

/**
 * Configura logging de performance y métricas
 */
function setupPerformanceLogging() {
  // Monitorear renders lentos (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    // Crear observer para mutations en el DOM
    const observer = new MutationObserver((mutations) => {
      if (mutations.length > 50) {
        uiLogger.warn('🐌 Muchas mutations DOM detectadas', {
          count: mutations.length,
        });
      }
    });

    // Observar cambios en el body
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  // Monitorear memory usage periódicamente
  setInterval(() => {
    if (window.performance && window.performance.memory) {
      const memory = window.performance.memory;
      const memoryData = {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
      };

      // Solo loggear si el uso es alto
      if (memoryData.used > 50) {
        uiLogger.debug('💾 Uso de memoria', memoryData);
      }
    }
  }, 30000); // Cada 30 segundos
}

/**
 * Configura logging específico para desarrollo
 */
function setupDevelopmentLogging() {
  // Log de hot reloads
  if (module.hot) {
    module.hot.accept(() => {
      logger.info('🔄 Hot reload detectado');
    });
  }

  // Log de navegación (solo en desarrollo)
  window.addEventListener('popstate', (event) => {
    navLogger.debug('⬅️ Navegación hacia atrás', {
      path: window.location.pathname,
    });
  });

  // Log de errores de React (si está disponible)
  const originalError = console.error;
  console.error = function (...args) {
    // Detectar errores de React
    if (args[0] && typeof args[0] === 'string') {
      if (args[0].includes('React') || args[0].includes('Warning:')) {
        uiLogger.error('⚛️ Error de React', { message: args[0] });
      }
    }
    originalError.apply(console, args);
  };
}

/**
 * Configura filtros de logging específicos
 */
export function configureLogFilters() {
  const config = getCurrentConfig();

  // Configurar qué tipos de logs mostrar
  const filters = {
    api: config.enableApiLogging,
    performance: config.enablePerformanceLogging,
    deprecation: config.enableDeprecationWarnings,
    navigation: process.env.NODE_ENV === 'development',
    user: true, // Siempre loggear acciones del usuario
    data: true, // Siempre loggear operaciones de datos
  };

  logger.info('🔍 Filtros de logging configurados', filters);
  return filters;
}

/**
 * Obtiene estadísticas del sistema de logging
 */
export function getLoggingStats() {
  const config = getCurrentConfig();

  return {
    environment: process.env.NODE_ENV || 'development',
    level: Object.keys(LOG_LEVELS)[config.level],
    features: {
      apiLogging: config.enableApiLogging,
      performanceLogging: config.enablePerformanceLogging,
      deprecationWarnings: config.enableDeprecationWarnings,
      globalErrorCapture: config.enableGlobalErrorCapture !== false,
    },
    loggers: {
      main: 'logger',
      api: 'apiLogger',
      ui: 'uiLogger',
      data: 'dataLogger',
      auth: 'authLogger',
      filter: 'filterLogger',
      navigation: 'navLogger',
    },
  };
}

/**
 * Limpia logs antiguos y reinicia métricas
 */
export function cleanupLogging() {
  logger.info('🧹 Limpiando sistema de logging');

  // Limpiar métricas de API
  if (window.apiMetrics) {
    window.apiMetrics = {
      requests: 0,
      totalTime: 0,
      errors: 0,
    };
  }

  logger.info('✅ Limpieza de logging completada');
}

/**
 * Configura logging para testing
 */
export function setupTestingLogging() {
  // En testing, minimizar el logging
  const testConfig = ENVIRONMENT_CONFIGS.testing;

  logger.info('🧪 Configurando logging para testing', {
    level: Object.keys(LOG_LEVELS)[testConfig.level],
    apiLogging: testConfig.enableApiLogging,
  });
}

/**
 * Exporta loggers configurados para uso directo
 */
export const configuredLoggers = {
  main: logger,
  api: apiLogger,
  ui: uiLogger,
  data: dataLogger,
  auth: authLogger,
  filter: filterLogger,
  nav: navLogger,
};

/**
 * Configuración por defecto para exportar
 */
export const loggingConfig = getCurrentConfig();

// Auto-inicialización del sistema de logging
if (typeof window !== 'undefined') {
  // Solo inicializar en el browser, no en SSR
  document.addEventListener('DOMContentLoaded', () => {
    initializeLogging();
  });
}

export default {
  initializeLogging,
  configureLogFilters,
  getLoggingStats,
  cleanupLogging,
  setupTestingLogging,
  configuredLoggers,
  loggingConfig,
};
