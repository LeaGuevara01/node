import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { createReparacion, updateReparacion, getReparaciones, deleteReparacion, getMaquinarias, getRepuestos } from '../services/api';
import { getUsers } from '../services/users';
import ReparacionEditModal from '../components/ReparacionEditModal';

function ReparacionForm({ token, onCreated }) {
  const [form, setForm] = useState({
    fecha: '', maquinariaId: '', descripcion: '', repuestos: [], userId: ''
  });
  const [users, setUsers] = useState([]);
  const [maquinarias, setMaquinarias] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [selectedRepuestos, setSelectedRepuestos] = useState([]);
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedReparacion, setSelectedReparacion] = useState(null);
  const [reparaciones, setReparaciones] = useState([]);

  const fetchReparaciones = async () => {
    try {
      const data = await getReparaciones(token);
      setReparaciones(data || []);
    } catch (err) {
      console.error('Error al cargar reparaciones:', err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, maquinariasData, repuestosData] = await Promise.all([
          getUsers(token),
          getMaquinarias(token),
          getRepuestos(token)
        ]);
        setUsers(usersData || []);
        setMaquinarias(maquinariasData || []);
        setRepuestos(repuestosData || []);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    }
    fetchData();
    fetchReparaciones();
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRepuestoSelect = (repuestoId, cantidad = 1) => {
    const repuestoExists = selectedRepuestos.find(r => r.repuestoId === parseInt(repuestoId));
    if (repuestoExists) {
      setSelectedRepuestos(selectedRepuestos.map(r => 
        r.repuestoId === parseInt(repuestoId) ? { ...r, cantidad } : r
      ));
    } else {
      setSelectedRepuestos([...selectedRepuestos, { repuestoId: parseInt(repuestoId), cantidad }]);
    }
  };

  const handleRemoveRepuesto = (repuestoId) => {
    setSelectedRepuestos(selectedRepuestos.filter(r => r.repuestoId !== parseInt(repuestoId)));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.fecha || !form.maquinariaId || !form.userId) {
      setError('Fecha, maquinaria y responsable son obligatorios');
      return;
    }
    try {
      const res = await createReparacion({
        ...form,
        maquinariaId: Number(form.maquinariaId),
        userId: Number(form.userId),
        repuestos: selectedRepuestos
      }, token);
      if (res.id) {
        onCreated && onCreated(res);
        setForm({ fecha: '', maquinariaId: '', descripcion: '', repuestos: [], userId: '' });
        setSelectedRepuestos([]);
        fetchReparaciones(); // Actualizar la lista después de crear
      } else {
        setError(res.error || 'Error al crear reparación');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleEdit = (reparacion) => {
    setSelectedReparacion(reparacion);
  };

  const handleUpdate = async (updatedReparacion) => {
    setError('');
    try {
      const res = await updateReparacion(updatedReparacion, token);
      if (res.id) {
        onCreated && onCreated(res);
        setSelectedReparacion(null);
        fetchReparaciones(); // Actualizar la lista después de editar
      } else {
        setError(res.error || 'Error al actualizar reparación');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReparacion(id, token);
      fetchReparaciones(); // Actualizar la lista después de eliminar
      setSelectedReparacion(null);
    } catch (err) {
      console.error('Error al eliminar reparación:', err);
      setError('Error al eliminar reparación');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Agregar Reparación</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fecha" value={form.fecha} onChange={handleChange} placeholder="Fecha" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" type="datetime-local" required />
          <select name="userId" value={form.userId} onChange={handleChange} className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
            <option value="">Responsable</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.username} ({u.role})</option>)}
          </select>
        </div>

        <div className="mt-4">
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full" rows="3" />
        </div>

        {/* Sección de Maquinaria */}
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Seleccionar Maquinaria</h3>
          <select name="maquinariaId" value={form.maquinariaId} onChange={handleChange} className="p-2 border rounded w-full" required>
            <option value="">Seleccionar Maquinaria</option>
            {maquinarias.map(m => <option key={m.id} value={m.id}>{m.nombre} - {m.modelo}</option>)}
          </select>
        </div>

        {/* Sección de Repuestos */}
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">Componentes Utilizados</h3>
          <div className="flex gap-2 mb-2">
            <select
              id="repuestoSelect"
              className="p-2 border rounded flex-1"
              onChange={(e) => {
                if (e.target.value) {
                  handleRepuestoSelect(e.target.value, 1);
                  e.target.value = '';
                }
              }}
            >
              <option value="">Seleccionar repuesto...</option>
              {repuestos
                .filter(r => !selectedRepuestos.find(sr => sr.repuestoId === r.id))
                .map(r => (
                  <option key={r.id} value={r.id}>
                    {r.nombre} - {r.codigo} (Stock: {r.stock})
                  </option>
                ))
              }
            </select>
          </div>
          
          {/* Lista de repuestos seleccionados */}
          {selectedRepuestos.length > 0 && (
            <div className="space-y-2">
              {selectedRepuestos.map((item) => {
                const repuesto = repuestos.find(r => r.id === item.repuestoId);
                return (
                  <div key={item.repuestoId} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="flex-1">{repuesto?.nombre} - {repuesto?.codigo}</span>
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => handleRepuestoSelect(item.repuestoId, parseInt(e.target.value) || 1)}
                      className="w-16 p-1 border rounded text-center"
                    />
                    <span className="text-sm text-gray-600">unidades</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRepuesto(item.repuestoId)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button type="submit" className="mt-2 bg-purple-600 text-white py-2 px-4 rounded">Agregar</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg mb-2">Carga Masiva desde CSV</h2>
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
              for (const row of rows) {
                try {
                  // Convertir IDs a números
                  if (row.maquinariaId) row.maquinariaId = parseInt(row.maquinariaId);
                  if (row.userId) row.userId = parseInt(row.userId);
                  
                  const res = await createReparacion(row, token);
                  if (res.id) successCount++;
                  else failCount++;
                } catch {
                  failCount++;
                }
              }
              setBulkSuccess(`Creadas: ${successCount}`);
              setBulkError(failCount ? `Fallidas: ${failCount}` : '');
              if (onCreated && successCount) onCreated();
              fetchReparaciones();
            },
            error: (err) => setBulkError('Error al procesar CSV'),
          });
        }} className="mb-2" />
        {bulkSuccess && <div className="text-green-600 mt-2">{bulkSuccess}</div>}
        {bulkError && <div className="text-red-500 mt-2">{bulkError}</div>}
        <div className="text-xs text-gray-500 mt-2">Formato: fecha, maquinariaId, userId, descripcion</div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg mb-2">Lista de Reparaciones</h2>
        <div className="grid grid-cols-1 gap-4">
          {reparaciones.map((reparacion, index) => (
            <div key={reparacion.id || index} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{reparacion.descripcion || 'Sin descripción'}</div>
                <div className="text-sm text-gray-600">
                  Fecha: {new Date(reparacion.fecha).toLocaleDateString()} - 
                  Maquinaria: {reparacion.maquinaria?.nombre || `ID: ${reparacion.maquinariaId}`} - 
                  Responsable: {reparacion.usuario?.username || 'No asignado'}
                </div>
                {reparacion.repuestos && reparacion.repuestos.length > 0 && (
                  <div className="text-xs text-blue-600 mt-1">
                    Repuestos: {reparacion.repuestos.map(r => `${r.repuesto?.nombre} (${r.cantidad})`).join(', ')}
                  </div>
                )}
              </div>
              <button onClick={() => handleEdit(reparacion)} className="bg-blue-500 text-white px-2 py-1 rounded">Editar</button>
            </div>
          ))}
        </div>
      </div>

      {selectedReparacion && (
        <ReparacionEditModal
          item={selectedReparacion}
          onClose={() => setSelectedReparacion(null)}
          onSave={handleUpdate}
          onDelete={handleDelete}
          users={users}
          maquinarias={maquinarias}
          repuestos={repuestos}
        />
      )}
    </div>
  );
}

export default ReparacionForm;
