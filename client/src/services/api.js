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
 * Obtener todas las maquinarias
 * @param {string} token - Token de autenticación
 * @returns {Promise<Array>} Lista de maquinarias
 */
export async function getMaquinarias(token) {
  const res = await fetch(`${API_URL}/maquinaria`, {
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
  const res = await fetch(`${API_URL}/repuestos`, {
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

export async function updateRepuesto(data, token) {
  const res = await fetch(`${API_URL}/repuestos/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteRepuesto(id, token) {
  const res = await fetch(`${API_URL}/repuestos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}

export async function getProveedores(token) {
  const res = await fetch(`${API_URL}/proveedores`, {
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
  const res = await fetch(`${API_URL}/reparaciones`, {
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
