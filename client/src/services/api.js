/**
 * Servicio API para la comunicación con el backend
 * 
 * Este módulo centraliza todas las llamadas HTTP al servidor backend,
 * proporcionando una interfaz unificada para:
 * - Autenticación y autorización
 * - Operaciones CRUD en todas las entidades
 * - Manejo consistente de headers y tokens
 * - Configuración del endpoint base
 * 
 * Todas las funciones retornan el resultado parseado de la respuesta JSON
 * y manejan automáticamente los headers de autorización cuando se requiere.
 */

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
    body: JSON.stringify({ username, password })
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
    body: JSON.stringify({ username, password, role })
  });
  return res.json();
}

// ===== MAQUINARIAS =====

/**
 * Obtener todas las maquinarias con filtros y paginación
 * @param {string} token - Token de autenticación
 * @param {Object} filtros - Filtros a aplicar (opcional)
 * @param {number} pagina - Página a obtener (opcional)
 * @returns {Promise<Object>} Objeto con maquinarias y paginación
 */
export async function getMaquinarias(token, filtros = {}, pagina = 1, forStats = false) {
  const params = new URLSearchParams({
    page: pagina.toString(),
    limit: forStats ? '10000' : '10',
    sortBy: 'categoria',
    sortOrder: 'asc'
  });

  // Agregar filtros activos
  Object.keys(filtros).forEach(key => {
    if (filtros[key] !== '' && filtros[key] !== false && filtros[key] !== null && filtros[key] !== undefined) {
      params.append(key, filtros[key].toString());
    }
  });

  const res = await fetch(`${API_URL}/maquinaria?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

/**
 * Obtener opciones de filtros para maquinarias
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Opciones de filtros disponibles
 */
export async function getMaquinariaFilters(token) {
  const res = await fetch(`${API_URL}/maquinaria/filtros`, {
    headers: { 'Authorization': `Bearer ${token}` }
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
    headers: { 'Authorization': `Bearer ${token}` }
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
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
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
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteMaquinaria(id, token) {
  const res = await fetch(`${API_URL}/maquinaria/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}

export async function getRepuestos(token) {
  const res = await fetch(`${API_URL}/repuestos?limit=10000`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  // El backend devuelve { repuestos: [...], pagination: {...} }
  // Retornamos solo el array de repuestos para compatibilidad
  return data.repuestos || [];
}

/**
 * Obtener un repuesto por ID
 * @param {string} id - ID del repuesto
 * @param {string} token - Token de autenticación
 * @returns {Promise<Object>} Repuesto encontrado
 */
export async function getRepuestoById(id, token) {
  const res = await fetch(`${API_URL}/repuestos/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function createRepuesto(data, token) {
  const res = await fetch(`${API_URL}/repuestos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateRepuesto(id, data, token) {
  const res = await fetch(`${API_URL}/repuestos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
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
      'Authorization': `Bearer ${token}`
    }
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
export async function getOpcionesFiltrosRepuestos(token) {
  const res = await fetch(`${API_URL}/repuestos/filtros`, {
    headers: { 'Authorization': `Bearer ${token}` }
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
    headers: { 'Authorization': `Bearer ${token}` }
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
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function getProveedores(token) {
  const res = await fetch(`${API_URL}/proveedores?limit=10000`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function createProveedor(data, token) {
  const res = await fetch(`${API_URL}/proveedores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateProveedor(data, token) {
  const res = await fetch(`${API_URL}/proveedores/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteProveedor(id, token) {
  const res = await fetch(`${API_URL}/proveedores/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}

export async function getReparaciones(token) {
  const res = await fetch(`${API_URL}/reparaciones?limit=10000`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

export async function createReparacion(data, token) {
  const res = await fetch(`${API_URL}/reparaciones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateReparacion(data, token) {
  const res = await fetch(`${API_URL}/reparaciones/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteReparacion(id, token) {
  const res = await fetch(`${API_URL}/reparaciones/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}
