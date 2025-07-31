import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { register } from '../services/api';
import { getUsers, updateUser, deleteUser } from '../services/users';
import UserEditModal from '../components/UserEditModal';

function UserRegisterForm({ token, onRegistered }) {
  const [form, setForm] = useState({ username: '', password: '', role: 'User' });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      const data = await getUsers(token);
      setUsers(data || []);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.username || !form.password) {
      setError('Usuario y contraseña son obligatorios');
      return;
    }
    try {
      const res = await register(form.username, form.password, form.role);
      if (res.id) {
        setSuccess('Usuario registrado correctamente');
        setForm({ username: '', password: '', role: 'User' });
        onRegistered && onRegistered(res);
        fetchUsers(); // Actualizar la lista después de crear
      } else {
        setError(res.error || 'Error al registrar usuario');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
  };

  const handleUpdate = async (updatedUser) => {
    setError('');
    try {
      const res = await updateUser(updatedUser, token);
      if (res.id) {
        onRegistered && onRegistered(res);
        setSelectedUser(null);
        fetchUsers(); // Actualizar la lista después de editar
      } else {
        setError(res.error || 'Error al actualizar usuario');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id, token);
      fetchUsers(); // Actualizar la lista después de eliminar
      setSelectedUser(null);
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
      setError('Error al eliminar usuario');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Registrar Usuario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="username" value={form.username} onChange={handleChange} placeholder="Usuario" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" type="password" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" required autoComplete="current-password" />
          <select name="role" value={form.role} onChange={handleChange} className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2">
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="mt-4">
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-md font-medium transition-colors duration-200">Registrar Usuario</button>
        </div>
        {error && <div className="text-red-500 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">{error}</div>}
        {success && <div className="text-green-600 mt-4 p-3 bg-green-50 border border-green-200 rounded-md">{success}</div>}
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Carga Masiva desde CSV</h2>
        <input type="file" accept=".csv" onChange={async (e) => {
          setBulkError('');
          setBulkSuccess('');
          const file = e.target.files[0];
          if (!file) return;
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
              const rows = results.data;
              let successCount = 0;
              let failCount = 0;
              let failDetails = [];
              for (const row of rows) {
                try {
                  const username = (row.username || '').trim();
                  const password = (row.password || '').trim();
                  const role = (row.role || 'User').trim();
                  if (!username || !password) {
                    failCount++;
                    failDetails.push(`Fila: ${JSON.stringify(row)} - Motivo: usuario o contraseña vacío`);
                    continue;
                  }
                  const res = await register(username, password, role);
                  if (res.id) {
                    successCount++;
                  } else {
                    failCount++;
                    failDetails.push(`Usuario: ${username} - Motivo: ${res.error || 'Error desconocido'}`);
                  }
                } catch (err) {
                  failCount++;
                  failDetails.push(`Usuario: ${row.username} - Motivo: ${err.message || 'Error de conexión'}`);
                }
              }
              setBulkSuccess(`Creados: ${successCount}`);
              setBulkError(failCount ? `Fallidos: ${failCount}\n${failDetails.join('\n')}` : '');
              if (onRegistered && successCount) onRegistered();
              fetchUsers(); // Actualizar la lista después de carga masiva
            },
            error: (err) => setBulkError('Error al procesar CSV'),
          });
        }} className="mb-2" />
        {bulkSuccess && <div className="text-green-600 mt-2">{bulkSuccess}</div>}
        {bulkError && <pre className="text-red-500 mt-2 whitespace-pre-wrap">{bulkError}</pre>}
        <div className="text-xs text-gray-500 mt-2">Formato: username, password, role</div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg mb-2">Lista de Usuarios</h2>
        <div className="grid grid-cols-1 gap-4">
          {users.map((user, index) => (
            <div key={user.id || index} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{user.username}</div>
                <div className="text-sm text-gray-600">
                  Rol: {user.role} - ID: {user.id}
                </div>
              </div>
              <button onClick={() => handleEdit(user)} className="bg-blue-500 text-white px-2 py-1 rounded">Editar</button>
            </div>
          ))}
        </div>
      </div>

      {selectedUser && (
        <UserEditModal
          item={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default UserRegisterForm;
