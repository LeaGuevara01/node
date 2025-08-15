// Servicio: Usuarios (compatibilidad)
// Objetivo: mantener nombres originales (getUsers/updateUser/deleteUser)
// delegando en la API unificada de `services/api.js` (rutas /usuarios).

import { getUsuarios, updateUsuario, deleteUsuario } from './api';

/** Obtener usuarios (solo campos públicos) */
export async function getUsers(token) {
  // La API unificada devuelve { usuarios, pagination } o array normalizado
  const data = await getUsuarios(token);
  // Para llamadas existentes que esperaban un array simple, retornamos el campo principal si existe
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.usuarios)) return data.usuarios;
  return data;
}

/** Actualizar usuario: id obligatorio en data */
export async function updateUser(data, token) {
  return updateUsuario(data.id, data, token);
}

/** Eliminar usuario por id */
export async function deleteUser(id, token) {
  return deleteUsuario(id, token);
}
