import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { createRepuesto, updateRepuesto, getRepuestos, deleteRepuesto } from '../services/api';
import RepuestoEditModal from '../components/RepuestoEditModal';

function RepuestoForm({ token, onCreated }) {
  const [form, setForm] = useState({
    nombre: '', stock: '', codigo: '', descripcion: '', precio: '', proveedor: '', ubicacion: '', categoria: ''
  });
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedRepuesto, setSelectedRepuesto] = useState(null);
  const [repuestos, setRepuestos] = useState([]);

  const fetchRepuestos = async () => {
    try {
      const data = await getRepuestos(token);
      setRepuestos(data || []);
    } catch (err) {
      console.error('Error al cargar repuestos:', err);
    }
  };

  useEffect(() => {
    fetchRepuestos();
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.stock || !form.codigo) {
      setError('Nombre, stock y código son obligatorios');
      return;
    }
    try {
      const res = await createRepuesto({
        ...form,
        stock: Number(form.stock),
        precio: form.precio ? Number(form.precio) : undefined
      }, token);
      if (res.id) {
        onCreated && onCreated(res);
        setForm({ nombre: '', stock: '', codigo: '', descripcion: '', precio: '', proveedor: '', ubicacion: '', categoria: '' });
        fetchRepuestos(); // Actualizar la lista después de crear
      } else {
        setError(res.error || 'Error al crear repuesto');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleEdit = (repuesto) => {
    setSelectedRepuesto(repuesto);
  };

  const handleUpdate = async (updatedRepuesto) => {
    setError('');
    try {
      const res = await updateRepuesto(updatedRepuesto, token);
      if (res.id) {
        onCreated && onCreated(res);
        setSelectedRepuesto(null);
        fetchRepuestos(); // Actualizar la lista después de editar
      } else {
        setError(res.error || 'Error al actualizar repuesto');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRepuesto(id, token);
      fetchRepuestos(); // Actualizar la lista después de eliminar
      setSelectedRepuesto(null);
    } catch (err) {
      console.error('Error al eliminar repuesto:', err);
      setError('Error al eliminar repuesto');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Agregar Repuesto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" type="number" required />
          <input name="codigo" value={form.codigo} onChange={handleChange} placeholder="Código" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          <input name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" type="number" />
          <input name="proveedor" value={form.proveedor} onChange={handleChange} placeholder="Proveedor" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Ubicación" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoría" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div className="mt-4">
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full" rows="3" />
        </div>
        <div className="mt-4">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors duration-200">Agregar Repuesto</button>
        </div>
        {error && <div className="text-red-500 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">{error}</div>}
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
              for (const row of rows) {
                try {
                  const res = await createRepuesto(row, token);
                  if (res.id) successCount++;
                  else failCount++;
                } catch {
                  failCount++;
                }
              }
              setBulkSuccess(`Creados: ${successCount}`);
              setBulkError(failCount ? `Fallidos: ${failCount}` : '');
              if (onCreated && successCount) onCreated();
              fetchRepuestos();
            },
            error: (err) => setBulkError('Error al procesar CSV'),
          });
        }} className="mb-2" />
        {bulkSuccess && <div className="text-green-600 mt-2">{bulkSuccess}</div>}
        {bulkError && <div className="text-red-500 mt-2">{bulkError}</div>}
        <div className="text-xs text-gray-500 mt-2">Formato: nombre, stock, codigo, precio, proveedor, ubicacion, categoria, descripcion</div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg mb-2">Lista de Repuestos</h2>
        <div className="grid grid-cols-1 gap-4">
          {repuestos.map((repuesto, index) => (
            <div key={repuesto.id || index} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{repuesto.nombre}</div>
                <div className="text-sm text-gray-600">Código: {repuesto.codigo} - Stock: {repuesto.stock} - Precio: ${repuesto.precio}</div>
              </div>
              <button onClick={() => handleEdit(repuesto)} className="bg-blue-500 text-white px-2 py-1 rounded">Editar</button>
            </div>
          ))}
        </div>
      </div>

      {selectedRepuesto && (
        <RepuestoEditModal
          item={selectedRepuesto}
          onClose={() => setSelectedRepuesto(null)}
          onSave={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default RepuestoForm;
