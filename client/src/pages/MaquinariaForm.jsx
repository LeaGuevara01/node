/**
 * Componente MaquinariaForm - Gestión completa de maquinarias agrícolas
 * 
 * Este componente proporciona funcionalidad completa CRUD para maquinarias:
 * - Formulario de creación de nuevas maquinarias
 * - Lista visual de maquinarias existentes con filtros
 * - Edición in-place mediante modales
 * - Eliminación con confirmación
 * - Importación masiva desde archivos CSV
 * - Validación de datos requeridos
 * - Manejo de errores y estados de carga
 * 
 * @param {string} token - Token de autenticación del usuario
 * @param {function} onCreated - Callback ejecutado cuando se crea una maquinaria
 */

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { createMaquinaria, getMaquinarias, updateMaquinaria, deleteMaquinaria } from '../services/api';

function MaquinariaForm({ token, onCreated }) {
  // Estado del formulario de creación
  const [form, setForm] = useState({
    nombre: '', modelo: '', categoria: '', anio: '', numero_serie: '', 
    descripcion: '', proveedor: '', ubicacion: '', estado: ''
  });
  
  // Estados para importación masiva CSV
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  
  // Estados de la UI y datos
  const [error, setError] = useState('');
  const [maquinarias, setMaquinarias] = useState([]);
  const [editingMaquinaria, setEditingMaquinaria] = useState(null);
  const [editForm, setEditForm] = useState(null);

  /**
   * Cargar todas las maquinarias desde la API
   * Se ejecuta al montar el componente y tras operaciones CRUD
   */
  async function fetchMaquinarias() {
    try {
      const data = await getMaquinarias(token);
      setMaquinarias(data || []);
    } catch (err) {
      console.error('Error al cargar maquinarias:', err);
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchMaquinarias();
  }, [token, onCreated]);

  // Manejar cambios en el formulario de creación
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Procesar envío del formulario de creación
   * Valida campos requeridos y crea nueva maquinaria
   */
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    // Validación de campos obligatorios
    if (!form.nombre || !form.modelo || !form.categoria) {
      setError('Nombre, modelo y categoría son obligatorios');
      return;
    }
    
    try {
      const res = await createMaquinaria(form, token);
      if (res.id) {
        onCreated && onCreated(res);
        // Limpiar formulario tras éxito
        setForm({ 
          nombre: '', modelo: '', categoria: '', anio: '', numero_serie: '', 
          descripcion: '', proveedor: '', ubicacion: '', estado: '' 
        });
        fetchMaquinarias();
      } else {
        setError(res.error || 'Error al crear maquinaria');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleEdit = (maquinaria) => {
    setEditingMaquinaria(maquinaria);
    setEditForm({ ...maquinaria });
  };

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      await updateMaquinaria(editForm, token);
      setEditingMaquinaria(null);
      fetchMaquinarias();
    } catch (err) {
      console.error('Error al actualizar maquinaria:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta maquinaria?')) {
      try {
        await deleteMaquinaria(id, token);
        setEditingMaquinaria(null);
        fetchMaquinarias();
      } catch (err) {
        console.error('Error al eliminar maquinaria:', err);
      }
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Agregar Maquinaria</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoría" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          <input name="anio" value={form.anio} onChange={handleChange} placeholder="Año" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" type="number" />
          <input name="numero_serie" value={form.numero_serie} onChange={handleChange} placeholder="N° Serie" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input name="proveedor" value={form.proveedor} onChange={handleChange} placeholder="Proveedor" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Ubicación" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div className="mt-4">
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full" rows="3" />
        </div>
        <div className="mt-4">
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-medium transition-colors duration-200">Agregar Maquinaria</button>
        </div>
        {error && <div className="text-red-500 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">{error}</div>}
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Carga Masiva desde CSV</h2>
        <input 
          type="file" 
          accept=".csv" 
          onChange={async (e) => {
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
                    const res = await createMaquinaria(row, token);
                    if (res.id) successCount++;
                    else failCount++;
                  } catch {
                    failCount++;
                  }
                }
                setBulkSuccess(`Creadas: ${successCount}`);
                setBulkError(failCount ? `Fallidas: ${failCount}` : '');
                if (onCreated && successCount) onCreated();
                fetchMaquinarias();
              },
              error: (err) => setBulkError('Error al procesar CSV'),
            });
          }} 
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
        />
        {bulkSuccess && <div className="text-green-600 mt-3 p-3 bg-green-50 border border-green-200 rounded-md">{bulkSuccess}</div>}
        {bulkError && <div className="text-red-500 mt-3 p-3 bg-red-50 border border-red-200 rounded-md">{bulkError}</div>}
        <div className="text-sm text-gray-500 mt-3 p-3 bg-gray-50 rounded-md">
          <strong>Formato CSV:</strong> nombre, modelo, categoria, año, numSerie, descripcion, proveedor, ubicacion, estado
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Lista de Maquinarias ({maquinarias.length})</h2>
        <div className="grid grid-cols-1 gap-4">
          {maquinarias.map((maquinaria, index) => (
            <div key={maquinaria.id || index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-900">{maquinaria.nombre}</div>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="mr-4">Modelo: {maquinaria.modelo}</span>
                  <span className="mr-4">Categoría: {maquinaria.categoria}</span>
                  <span>Año: {maquinaria.anio}</span>
                </div>
              </div>
              <button onClick={() => handleEdit(maquinaria)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200">Editar</button>
            </div>
          ))}
        </div>
      </div>

      {editingMaquinaria && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Editar Maquinaria</h2>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="nombre" value={editForm.nombre} onChange={handleEditChange} placeholder="Nombre" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                <input name="modelo" value={editForm.modelo} onChange={handleEditChange} placeholder="Modelo" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                <input name="categoria" value={editForm.categoria} onChange={handleEditChange} placeholder="Categoría" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                <input name="anio" value={editForm.anio || ''} onChange={handleEditChange} placeholder="Año" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" type="number" />
                <input name="numero_serie" value={editForm.numero_serie || ''} onChange={handleEditChange} placeholder="N° Serie" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <input name="proveedor" value={editForm.proveedor || ''} onChange={handleEditChange} placeholder="Proveedor" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <input name="ubicacion" value={editForm.ubicacion || ''} onChange={handleEditChange} placeholder="Ubicación" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <input name="estado" value={editForm.estado || ''} onChange={handleEditChange} placeholder="Estado" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              </div>
              <div className="mt-4">
                <textarea name="descripcion" value={editForm.descripcion || ''} onChange={handleEditChange} placeholder="Descripción" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full" rows="3" />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button type="button" onClick={() => handleDelete(editingMaquinaria.id)} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200">Eliminar</button>
                <button type="button" onClick={() => setEditingMaquinaria(null)} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200">Cancelar</button>
                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaquinariaForm;
