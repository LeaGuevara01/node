/**
 * Utilidades de Logging para APIs
 *
 * Este módulo proporciona funciones especializadas para logging de operaciones API:
 * - Logging de requests y responses
 * - Medición de tiempos de respuesta
 * - Formateo consistente de filtros y parámetros
 * - Detección y logging de duplicados
 * - Métricas de performance
 *
 * Utilidad: apiLogger
 * Rol: logging centralizado para requests/responses y métricas de latencia
 */

import { createLogger } from './logger';

const apiLogger = createLogger('API');

// Cache para detectar requests duplicados
const requestCache = new Map();
const REQUEST_CACHE_TTL = 5000; // 5 segundos

/**
 * Limpia el cache de requests antiguos
 */
function cleanRequestCache() {
  const now = Date.now();
  for (const [key, timestamp] of requestCache.entries()) {
    if (now - timestamp > REQUEST_CACHE_TTL) {
      requestCache.delete(key);
    }
  }
}

/**
 * Genera una clave única para un request
 */
function generateRequestKey(url, method = 'GET', body = null) {
  return `${method}:${url}:${body ? JSON.stringify(body) : ''}`;
}

/**
 * Detecta si un request es duplicado
 */
function isDuplicateRequest(url, method = 'GET', body = null) {
  cleanRequestCache();
  const key = generateRequestKey(url, method, body);
  const now = Date.now();

  if (requestCache.has(key)) {
    const lastRequestTime = requestCache.get(key);
    if (now - lastRequestTime < REQUEST_CACHE_TTL) {
      return true;
    }
  }

  requestCache.set(key, now);
  return false;
}

/**
 * Formatea filtros para logging
 */
export function formatFiltersForLog(filtros) {
  if (!filtros || typeof filtros !== 'object') {
    return '{}';
  }

  const activeFilters = Object.entries(filtros)
    .filter(([key, value]) => {
      return (
        value !== '' &&
        value !== false &&
        value !== null &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0)
      );
    })
    .reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        acc[key] = `[${value.length} items]`;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

  return JSON.stringify(activeFilters);
}

/**
 * Log de inicio de request API
 */
export function logApiRequest(url, method = 'GET', filtros = {}, options = {}) {
  const { skipDuplicateCheck = false } = options;

  if (!skipDuplicateCheck && isDuplicateRequest(url, method, filtros)) {
    apiLogger.warn('🔄 Request duplicado detectado', { url, method, filtros });
    return null; // Retornar null indica que es duplicado
  }

  const startTime = Date.now();

  apiLogger.api('📡 Request iniciado', {
    url: url.replace(/^.*\/api\//, '/api/'), // Limpiar URL para logging
    method,
    filters: formatFiltersForLog(filtros),
    timestamp: new Date().toISOString(),
  });

  return startTime;
}

/**
 * Log de respuesta exitosa de API
 */
export function logApiSuccess(url, method = 'GET', data, startTime, options = {}) {
  const { logData = false, expectedField = null } = options;
  const duration = startTime ? Date.now() - startTime : 0;

  const logPayload = {
    url: url.replace(/^.*\/api\//, '/api/'),
    method,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
  };

  // Agregar información específica de la respuesta
  if (data) {
    if (expectedField && data[expectedField]) {
      logPayload.itemCount = Array.isArray(data[expectedField]) ? data[expectedField].length : 1;
    }

    if (data.pagination) {
      logPayload.pagination = {
        page: data.pagination.paginaActual || data.pagination.page,
        total: data.pagination.totalElementos || data.pagination.total,
        pages: data.pagination.totalPaginas || data.pagination.pages,
      };
    }

    if (logData) {
      logPayload.responseData = data;
    }
  }

  apiLogger.success('✅ Request completado', logPayload);

  // Log de performance si es lento
  if (duration > 2000) {
    apiLogger.warn('🐌 Request lento detectado', { url, duration: `${duration}ms` });
  }
}

/**
 * Log de error de API
 */
export function logApiError(url, method = 'GET', error, startTime, options = {}) {
  const duration = startTime ? Date.now() - startTime : 0;

  apiLogger.error('❌ Request fallido', {
    url: url.replace(/^.*\/api\//, '/api/'),
    method,
    duration: `${duration}ms`,
    error: error.message || error,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Wrapper para operaciones API con logging automático
 */
export function withApiLogging(apiFunction, options = {}) {
  return async function loggedApiCall(...args) {
    const {
      name = apiFunction.name || 'API Call',
      extractUrl = (args) => args[0],
      extractMethod = () => 'GET',
      extractFilters = (args) => args[1] || {},
      logResponse = false,
    } = options;

    let url, method, filters;
    let startTime = null;

    try {
      url = extractUrl(args);
      method = extractMethod(args);
      filters = extractFilters(args);

      startTime = logApiRequest(url, method, filters);

      if (startTime === null) {
        // Request duplicado, pero aún ejecutar la función
        apiLogger.debug('Ejecutando request duplicado');
      }

      const result = await apiFunction.apply(this, args);

      logApiSuccess(url, method, result, startTime, {
        logData: logResponse,
        expectedField: getExpectedField(name),
      });

      return result;
    } catch (error) {
      logApiError(url, method, error, startTime);
      throw error; // Re-lanzar el error
    }
  };
}

/**
 * Obtiene el campo esperado basado en el nombre de la función
 */
function getExpectedField(functionName) {
  const fieldMap = {
    getMaquinarias: 'maquinarias',
    getRepuestos: 'repuestos',
    getTareas: 'tareas',
    getMantenimientos: 'mantenimientos',
  };
  return fieldMap[functionName] || null;
}

/**
 * Log de filtros aplicados
 */
export function logFilterApplication(filtros, tokensActivos = []) {
  const activeFiltersCount = Object.keys(filtros).filter((key) => {
    const value = filtros[key];
    return (
      value !== '' &&
      value !== false &&
      value !== null &&
      value !== undefined &&
      !(Array.isArray(value) && value.length === 0)
    );
  }).length;

  apiLogger.filter('🔍 Filtros aplicados', {
    activeFilters: activeFiltersCount,
    totalTokens: tokensActivos.length,
    filters: formatFiltersForLog(filtros),
  });
}

/**
 * Log de cambios de paginación
 */
export function logPaginationChange(page, totalPages, totalItems) {
  apiLogger.data('📄 Cambio de paginación', {
    page,
    totalPages,
    totalItems,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log de operaciones CRUD
 */
export function logCrudOperation(operation, entity, id = null, data = null) {
  const operations = {
    CREATE: '➕ Creando',
    UPDATE: '✏️ Actualizando',
    DELETE: '🗑️ Eliminando',
    READ: '👁️ Leyendo',
  };

  apiLogger.data(`${operations[operation]} ${entity}`, {
    operation,
    entity,
    id,
    hasData: !!data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log de bulk operations
 */
export function logBulkOperation(operation, entity, count, result = null) {
  apiLogger.data(`📦 Operación masiva: ${operation}`, {
    entity,
    count,
    success: !result ? null : result.success,
    errors: !result ? null : result.errors,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Métricas de performance de API
 */
const performanceMetrics = {
  requests: 0,
  totalTime: 0,
  errors: 0,
  slowRequests: 0,
};

export function getApiMetrics() {
  return {
    ...performanceMetrics,
    averageTime:
      performanceMetrics.requests > 0
        ? Math.round(performanceMetrics.totalTime / performanceMetrics.requests)
        : 0,
  };
}

export function resetApiMetrics() {
  Object.keys(performanceMetrics).forEach((key) => {
    performanceMetrics[key] = 0;
  });
}

// Limpiar cache periódicamente
setInterval(cleanRequestCache, REQUEST_CACHE_TTL);

export default {
  logApiRequest,
  logApiSuccess,
  logApiError,
  logFilterApplication,
  logPaginationChange,
  logCrudOperation,
  logBulkOperation,
  withApiLogging,
  formatFiltersForLog,
  getApiMetrics,
  resetApiMetrics,
};
