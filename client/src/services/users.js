// Servicio: Usuarios (client)
// Rol: list/update/delete con token Bearer

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/** Obtener usuarios (solo campos públicos) */
export async function getUsers(token) {
  const res = await fetch(`${API_URL}/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}

/** Actualizar usuario: id obligatorio en data */
export async function updateUser(data, token) {
  const res = await fetch(`${API_URL}/users/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

/** Eliminar usuario por id */
export async function deleteUser(id, token) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
}
