/**
 * Sistema de Logging Centralizado y Modular
 * 
 * Este módulo proporciona un sistema de logging unificado que:
 * - Maneja diferentes niveles de logging (debug, info, warn, error)
 * - Incluye contexto y timestamps automáticos
 * - Permite filtrar logs por categorías
 * - Facilita el debugging en desarrollo y monitoreo en producción
 * - Soporta formateo consistente y emojis para mejor legibilidad
 * 
 * Uso:
 * import { Logger } from './utils/logger';
 * const logger = new Logger('ComponentName');
 * logger.info('Mensaje de información', { data: value });
 */

// Niveles de logging ordenados por prioridad
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// Configuración por defecto del logger
const DEFAULT_CONFIG = {
  level: process.env.NODE_ENV === 'development' ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO,
  enableColors: true,
  enableTimestamps: true,
  enableContext: true,
  maxLogLength: 1000
};

// Emojis para cada tipo de log
const LOG_EMOJIS = {
  DEBUG: '🔍',
  INFO: 'ℹ️',
  WARN: '⚠️',
  ERROR: '❌',
  SUCCESS: '✅',
  API: '🌐',
  FILTER: '🔗',
  DATA: '📊',
  NAV: '🧭',
  USER: '👤'
};

// Colores para consola (solo en desarrollo)
const LOG_COLORS = {
  DEBUG: '\x1b[36m', // Cyan
  INFO: '\x1b[34m',  // Blue
  WARN: '\x1b[33m',  // Yellow
  ERROR: '\x1b[31m', // Red
  SUCCESS: '\x1b[32m', // Green
  RESET: '\x1b[0m'
};

/**
 * Clase principal del Logger
 */
class Logger {
  constructor(context = 'App', config = {}) {
    this.context = context;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.startTime = Date.now();
  }

  /**
   * Formatea un mensaje de log con timestamp y contexto
   */
  formatMessage(level, message, data = null, category = null) {
    const parts = [];
    
    // Timestamp
    if (this.config.enableTimestamps) {
      const now = new Date();
      const timestamp = now.toLocaleTimeString('es-ES', { 
        hour12: false,
        fractionalSecondDigits: 3 
      });
      parts.push(`[${timestamp}]`);
    }

    // Contexto
    if (this.config.enableContext && this.context) {
      parts.push(`[${this.context}]`);
    }

    // Categoría
    if (category) {
      const emoji = LOG_EMOJIS[category.toUpperCase()] || '';
      parts.push(`${emoji} [${category.toUpperCase()}]`);
    }

    // Emoji del nivel
    const levelEmoji = LOG_EMOJIS[level] || '';
    
    // Mensaje principal
    const baseMessage = `${parts.join(' ')} ${levelEmoji} ${message}`;
    
    // Truncar si es muy largo
    const truncatedMessage = baseMessage.length > this.config.maxLogLength
      ? baseMessage.substring(0, this.config.maxLogLength) + '...'
      : baseMessage;

    return { message: truncatedMessage, data };
  }

  /**
   * Aplica color al mensaje (solo en desarrollo)
   */
  colorize(message, level) {
    if (!this.config.enableColors || process.env.NODE_ENV !== 'development') {
      return message;
    }
    
    const color = LOG_COLORS[level] || LOG_COLORS.RESET;
    return `${color}${message}${LOG_COLORS.RESET}`;
  }

  /**
   * Método interno para logging
   */
  log(level, message, data = null, category = null) {
    if (LOG_LEVELS[level] < this.config.level) {
      return; // Nivel demasiado bajo, no mostrar
    }

    const formatted = this.formatMessage(level, message, data, category);
    const coloredMessage = this.colorize(formatted.message, level);

    // Usar el método de consola apropiado
    const consoleMethod = level === 'ERROR' ? 'error' : 
                         level === 'WARN' ? 'warn' : 
                         level === 'DEBUG' ? 'debug' : 'log';

    if (formatted.data) {
      console[consoleMethod](coloredMessage, formatted.data);
    } else {
      console[consoleMethod](coloredMessage);
    }
  }

  // Métodos públicos de logging
  debug(message, data = null, category = null) {
    this.log('DEBUG', message, data, category);
  }

  info(message, data = null, category = null) {
    this.log('INFO', message, data, category);
  }

  warn(message, data = null, category = null) {
    this.log('WARN', message, data, category);
  }

  error(message, data = null, category = null) {
    this.log('ERROR', message, data, category);
  }

  success(message, data = null, category = null) {
    this.log('INFO', message, data, category || 'SUCCESS');
  }

  // Métodos especializados para diferentes contextos
  api(message, data = null) {
    this.info(message, data, 'API');
  }

  filter(message, data = null) {
    this.info(message, data, 'FILTER');
  }

  data(message, data = null) {
    this.info(message, data, 'DATA');
  }

  navigation(message, data = null) {
    this.info(message, data, 'NAV');
  }

  user(message, data = null) {
    this.info(message, data, 'USER');
  }

  // Utilidades para performance
  time(label) {
    this.debug(`⏱️ Timer started: ${label}`);
    return Date.now();
  }

  timeEnd(label, startTime) {
    const duration = Date.now() - startTime;
    this.debug(`⏱️ Timer ended: ${label} (${duration}ms)`);
    return duration;
  }

  // Método para crear sub-loggers con contexto adicional
  createChild(additionalContext) {
    const childContext = `${this.context}:${additionalContext}`;
    return new Logger(childContext, this.config);
  }
}

/**
 * Instancia global del logger para uso general
 */
export const logger = new Logger('App');

/**
 * Factory function para crear loggers con contexto específico
 */
export function createLogger(context, config = {}) {
  return new Logger(context, config);
}

/**
 * Hook para usar logger en componentes React
 * Nota: Importar React en el componente que use este hook
 */
export function useLogger(context) {
  // Verificar si React está disponible (para uso en hooks)
  if (typeof React !== 'undefined' && React.useMemo) {
    return React.useMemo(() => createLogger(context), [context]);
  }
  // Fallback para uso fuera de componentes React
  return createLogger(context);
}

/**
 * Loggers especializados para diferentes módulos
 */
export const apiLogger = createLogger('API');
export const uiLogger = createLogger('UI');
export const dataLogger = createLogger('Data');
export const authLogger = createLogger('Auth');
export const filterLogger = createLogger('Filter');
export const navLogger = createLogger('Navigation');

/**
 * Utilidad para capturar errores globales
 */
export function setupGlobalErrorLogging() {
  // Capturar errores no manejados
  window.addEventListener('error', (event) => {
    logger.error('Error global no manejado', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });

  // Capturar promesas rechazadas
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Promise rechazada sin manejar', {
      reason: event.reason
    });
  });
}

/**
 * Configuración para diferentes entornos
 */
export const LoggerConfig = {
  development: {
    level: LOG_LEVELS.DEBUG,
    enableColors: true,
    enableTimestamps: true,
    enableContext: true
  },
  
  production: {
    level: LOG_LEVELS.WARN,
    enableColors: false,
    enableTimestamps: true,
    enableContext: true
  },
  
  testing: {
    level: LOG_LEVELS.ERROR,
    enableColors: false,
    enableTimestamps: false,
    enableContext: true
  }
};

export { Logger, LOG_LEVELS, LOG_EMOJIS };
export default Logger;
