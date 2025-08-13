// Servicio API (client): llamadas HTTP unificadas, manejo de token y errores

/**
 * Servicio API para la comunicación con el backend
 *
 * Este módulo centraliza todas las llamadas HTTP al servidor backend,
 * proporcionando una interfaz unificada para:
 * - Autenticación y autorización
 * - Operaciones CRUD en todas las entidades
 * - Manejo consistente de headers y tokens
 * - Configuración del endpoint base
 * - Sistema de logging centralizado y modular
 *
 * Todas las funciones retornan el resultado parseado de la respuesta JSON
 * y manejan automáticamente los headers de autorización cuando se requiere.
 */

import {
  logApiRequest,
  logApiSuccess,
  logApiError,
  formatFiltersForLog,
  logCrudOperation,
} from '../utils/apiLogger';

// Configuración del endpoint base de la API
// Utiliza variable de entorno o fallback a desarrollo local
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Autenticar usuario en el sistema
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<Object>} Respuesta con token y datos del usuario
 */
export async function login(username, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

/**
 * Registrar nuevo usuario (solo administradores)
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @param {string} role - Rol del usuario (Admin/User)
 * @returns {Promise<Object>} Respuesta de confirmación
 */
export async function register(username, password, role) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role }),
  });
  return res.json();
}

// ===== MAQUINARIAS =====

/**
 * Obtener todas las maquinarias con filtros y paginación
 * @param {string} token - Token de autenticación
 * @param {Object} filtros - Filtros a aplicar (opcional)
 * @param {number} pagina - Página a obtener (opcional)
 * @param {boolean} forStats - Si es para estadísticas, retorna todos los elementos
 * @returns {Promise<Object>} Objeto con maquinarias y paginación
 */
export async function getMaquinarias(token, filtros = {}, pagina = 1, forStats = false) {
  const params = new URLSearchParams({
    page: pagina.toString(),
    limit: forStats ? '10000' : '20',
    sortBy: 'categoria',
    sortOrder: 'asc',
  });

  // Agregar filtros activos
  Object.keys(filtros).forEach((key) => {
    if (
      filtros[key] !== '' &&
      filtros[key] !== false &&
      filtros[key] !== null &&
      filtros[key] !== undefined
    ) {
      // Si es un array, convertir a string separado por comas
      if (Array.isArray(filtros[key])) {
        if (filtros[key].length > 0) {
          params.append(key, filtros[key].join(','));
        }
      } else {
        params.append(key, filtros[key].toString());
      }
    }
  });

  const url = `${API_URL}/maquinaria?${params}`;

  // Logging con sistema centralizado
  const startTime = logApiRequest(url, 'GET', filtros);

  // Si es un request duplicado, aún ejecutarlo pero no loggearlo como nuevo
  // Nota: En desarrollo (StrictMode) los efectos pueden ejecutarse dos veces.
  // Si detectamos duplicado (startTime === null), simplemente continuamos
  // con el fetch para no romper el flujo de la UI.

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    // Log de éxito con información específica
    logApiSuccess(url, 'GET', data, startTime, {
      expectedField: 'maquinarias',
    });

    // Si es para estadísticas, retornar solo el array
    if (forStats) {
      return data.maquinarias || data || [];
    }

    // Para uso normal, retornar el objeto completo con paginación
    return data;
  } catch (error) {
    logApiError(url, 'GET', error, startTime);
    throw error;
  }
}

/**
 * Obtener opciones de filtros para maquinarias
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Opciones de filtros disponibles
 */
export async function getMaquinariaFilters(token) {
  const res = await fetch(`${API_URL}/maquinaria/filtros`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

/**
 * Obtener una maquinaria por ID
 * @param {string} id - ID de la maquinaria
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Maquinaria encontrada
 */
export async function getMaquinariaById(id, token) {
  const res = await fetch(`${API_URL}/maquinaria/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

/**
 * Crear nueva maquinaria
 * @param {Object} data - Datos de la maquinaria
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Maquinaria creada
 */
export async function createMaquinaria(data, token) {
  const res = await fetch(`${API_URL}/maquinaria`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

/**
 * Actualizar maquinaria existente
 * @param {Object} data - Datos actualizados (debe incluir id)
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Maquinaria actualizada
 */
export async function updateMaquinaria(data, token) {
  const res = await fetch(`${API_URL}/maquinaria/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteMaquinaria(id, token) {
  const res = await fetch(`${API_URL}/maquinaria/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

// ===== REPUESTOS =====

/**
 * Obtener todos los repuestos con filtros y paginación
 * @param {string} token - Token de autenticación
 * @param {Object} filtros - Filtros a aplicar (opcional)
 * @param {number} pagina - Página a obtener (opcional)
 * @param {boolean} forStats - Si es para estadísticas, retorna todos los elementos
 * @returns {Promise<Object>} Objeto con repuestos y paginación
 */
export async function getRepuestos(token, filtros = {}, pagina = 1, forStats = false) {
  const params = new URLSearchParams({
    page: pagina.toString(),
    limit: forStats ? '10000' : '20',
    sortBy: 'nombre',
    sortOrder: 'asc',
  });

  // Agregar filtros activos
  Object.keys(filtros).forEach((key) => {
    if (
      filtros[key] !== '' &&
      filtros[key] !== false &&
      filtros[key] !== null &&
      filtros[key] !== undefined
    ) {
      if (Array.isArray(filtros[key])) {
        if (filtros[key].length > 0) {
          params.append(key, filtros[key].join(','));
        }
      } else {
        params.append(key, filtros[key].toString());
      }
    }
  });

  const res = await fetch(`${API_URL}/repuestos?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();

  // Si es para estadísticas, retornar solo el array
  if (forStats) {
    return data.repuestos || data || [];
  }

  // Para uso normal, retornar el objeto completo con paginación
  return data;
}

/**
 * Obtener un repuesto por ID
 * @param {string} id - ID del repuesto
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Repuesto encontrado
 */
export async function getRepuestoById(id, token) {
  const res = await fetch(`${API_URL}/repuestos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createRepuesto(data, token) {
  const res = await fetch(`${API_URL}/repuestos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateRepuesto(id, data, token) {
  const res = await fetch(`${API_URL}/repuestos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteRepuesto(id, token) {
  const res = await fetch(`${API_URL}/repuestos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Obtener opciones disponibles para filtros de repuestos
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Opciones de filtros (categorías, ubicaciones, etc.)
 */
export async function getRepuestoFilters(token) {
  const res = await fetch(`${API_URL}/repuestos/filtros`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

/**
 * Obtener estadísticas detalladas de repuestos
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Estadísticas de repuestos
 */
export async function getEstadisticasRepuestos(token) {
  const res = await fetch(`${API_URL}/repuestos/estadisticas`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

/**
 * Búsqueda rápida de repuestos
 * @param {string} query - Término de búsqueda
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Resultados de búsqueda rápida
 */
export async function busquedaRapidaRepuestos(query, token) {
  const res = await fetch(`${API_URL}/repuestos/busqueda?q=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ===== PROVEEDORES =====

/**
 * Obtener todos los proveedores con filtros y paginación
 * @param {string} token - Token de autenticación
 * @param {Object} filtros - Filtros a aplicar (opcional)
 * @param {number} pagina - Página a obtener (opcional)
 * @param {boolean} forStats - Si es para estadísticas, retorna todos los elementos
 * @returns {Promise<Object>} Objeto con proveedores y paginación
 */
export async function getProveedores(token, filtros = {}, pagina = 1, forStats = false) {
  const params = new URLSearchParams({
    page: pagina.toString(),
    limit: forStats ? '10000' : '20',
    sortBy: 'nombre',
    sortOrder: 'asc',
  });

  // Agregar filtros activos
  Object.keys(filtros).forEach((key) => {
    if (
      filtros[key] !== '' &&
      filtros[key] !== false &&
      filtros[key] !== null &&
      filtros[key] !== undefined
    ) {
      if (Array.isArray(filtros[key])) {
        if (filtros[key].length > 0) {
          params.append(key, filtros[key].join(','));
        }
      } else {
        params.append(key, filtros[key].toString());
      }
    }
  });

  const res = await fetch(`${API_URL}/proveedores?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();

  // Si es para estadísticas, retornar solo el array
  if (forStats) {
    return data.proveedores || data || [];
  }

  // Para uso normal, retornar el objeto completo con paginación
  return data;
}

export async function getProveedorById(id, token) {
  const res = await fetch(`${API_URL}/proveedores/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createProveedor(data, token) {
  const res = await fetch(`${API_URL}/proveedores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProveedor(id, data, token) {
  const res = await fetch(`${API_URL}/proveedores/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProveedor(id, token) {
  const res = await fetch(`${API_URL}/proveedores/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

/**
 * Obtener opciones de filtros para proveedores
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Opciones de filtros disponibles
 */
export async function getProveedorFilters(token) {
  const res = await fetch(`${API_URL}/proveedores/filtros`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ===== REPARACIONES =====

/**
 * Obtener todas las reparaciones con filtros y paginación
 * @param {string} token - Token de autenticación
 * @param {Object} filtros - Filtros a aplicar (opcional)
 * @param {number} pagina - Página a obtener (opcional)
 * @param {boolean} forStats - Si es para estadísticas, retorna todos los elementos
 * @returns {Promise<Object>} Objeto con reparaciones y paginación
 */
export async function getReparaciones(token, filtros = {}, pagina = 1, forStats = false) {
  const params = new URLSearchParams({
    page: pagina.toString(),
    limit: forStats ? '10000' : '20',
    sortBy: 'fecha',
    sortOrder: 'desc',
  });

  // Agregar filtros activos
  Object.keys(filtros).forEach((key) => {
    if (
      filtros[key] !== '' &&
      filtros[key] !== false &&
      filtros[key] !== null &&
      filtros[key] !== undefined
    ) {
      if (Array.isArray(filtros[key])) {
        if (filtros[key].length > 0) {
          params.append(key, filtros[key].join(','));
        }
      } else {
        params.append(key, filtros[key].toString());
      }
    }
  });

  const res = await fetch(`${API_URL}/reparaciones?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.json()).error || res.statusText;
    } catch {}
    throw new Error(`Error ${res.status}: ${detail}`);
  }
  const data = await res.json();

  // Si es para estadísticas, retornar solo el array
  if (forStats) {
    // El backend actual responde { data: [...], pagination: {...} }
    return data.reparaciones || data.data || data || [];
  }

  // Para uso normal, retornar el objeto completo con paginación
  // Normalizar para que las páginas puedan manejar ambos formatos
  if (Array.isArray(data)) {
    return {
      reparaciones: data,
      pagination: {
        current: Number(pagina) || 1,
        total: 1,
        totalItems: data.length,
        limit: Number(params.get('limit')) || 20,
      },
    };
  }
  if (data && (data.data || data.reparaciones)) {
    return { reparaciones: data.reparaciones || data.data, pagination: data.pagination };
  }
  return data;
}

export async function getReparacion(id, token) {
  const res = await fetch(`${API_URL}/reparaciones/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createReparacion(data, token) {
  const res = await fetch(`${API_URL}/reparaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function updateReparacion(id, data, token) {
  const res = await fetch(`${API_URL}/reparaciones/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function deleteReparacion(id, token) {
  const res = await fetch(`${API_URL}/reparaciones/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

/**
 * Obtener opciones de filtros para reparaciones
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Opciones de filtros disponibles
 */
export async function getReparacionFilters(token) {
  const res = await fetch(`${API_URL}/reparaciones/filtros`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.json()).error || res.statusText;
    } catch {}
    throw new Error(`Error ${res.status}: ${detail}`);
  }
  return res.json();
}

// ===== USUARIOS =====

/**
 * Obtener todos los usuarios con filtros y paginación
 * @param {string} token - Token de autenticación
 * @param {Object} filtros - Filtros a aplicar (opcional)
 * @param {number} pagina - Página a obtener (opcional)
 * @param {boolean} forStats - Si es para estadísticas, retorna todos los elementos
 * @returns {Promise<Object>} Objeto con usuarios y paginación
 */
export async function getUsuarios(token, filtros = {}, pagina = 1, forStats = false) {
  const params = new URLSearchParams({
    page: pagina.toString(),
    limit: forStats ? '10000' : '20',
    sortBy: 'username',
    sortOrder: 'asc',
  });

  // Agregar filtros activos
  Object.keys(filtros).forEach((key) => {
    if (
      filtros[key] !== '' &&
      filtros[key] !== false &&
      filtros[key] !== null &&
      filtros[key] !== undefined
    ) {
      if (Array.isArray(filtros[key])) {
        if (filtros[key].length > 0) {
          params.append(key, filtros[key].join(','));
        }
      } else {
        params.append(key, filtros[key].toString());
      }
    }
  });

  const res = await fetch(`${API_URL}/users?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();

  // Si es para estadísticas, retornar solo el array
  if (forStats) {
    return data.usuarios || data || [];
  }

  // Para uso normal, retornar el objeto completo con paginación
  return data;
}

/**
 * Obtener un usuario por ID
 * @param {string} id - ID del usuario
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Usuario encontrado
 */
export async function getUsuarioById(id, token) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

/**
 * Crear nuevo usuario
 * @param {Object} data - Datos del usuario
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Usuario creado
 */
export async function createUsuario(data, token) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Actualizar usuario existente
 * @param {string} id - ID del usuario
 * @param {Object} data - Datos actualizados
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Usuario actualizado
 */
export async function updateUsuario(id, data, token) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Eliminar usuario
 * @param {string} id - ID del usuario
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Respuesta de confirmación
 */
export async function deleteUsuario(id, token) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Obtener opciones de filtros para usuarios
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Opciones de filtros disponibles
 */
export async function getUsuarioFilters(token) {
  const res = await fetch(`${API_URL}/usuarios/filtros`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ===== COMPRAS =====

export async function getCompras(token, filtros = {}, pagina = 1, forStats = false) {
  const params = new URLSearchParams({
    page: pagina.toString(),
    limit: forStats ? '10000' : '20',
  });
  Object.keys(filtros).forEach((key) => {
    if (
      filtros[key] !== '' &&
      filtros[key] !== false &&
      filtros[key] !== null &&
      filtros[key] !== undefined
    ) {
      if (Array.isArray(filtros[key])) {
        if (filtros[key].length > 0) params.append(key, filtros[key].join(','));
      } else {
        params.append(key, filtros[key].toString());
      }
    }
  });
  const res = await fetch(`${API_URL}/compras?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return forStats ? data.data || data || [] : data;
}

export async function getCompra(id, token) {
  const res = await fetch(`${API_URL}/compras/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function createCompra(data, token) {
  const res = await fetch(`${API_URL}/compras`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error al crear compra');
  return res.json();
}

export async function updateCompra(id, data, token) {
  const res = await fetch(`${API_URL}/compras/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error al actualizar compra');
  return res.json();
}

export async function deleteCompra(id, token) {
  const res = await fetch(`${API_URL}/compras/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error al eliminar compra');
  return res.json();
}

export async function getComprasStats(token) {
  const res = await fetch(`${API_URL}/compras/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
