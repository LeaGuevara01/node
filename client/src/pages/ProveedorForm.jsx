import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { createProveedor, updateProveedor, getProveedores, deleteProveedor } from '../services/api';
import ProveedorEditModal from '../components/ProveedorEditModal';

function ProveedorForm({ token, onCreated }) {
  const [form, setForm] = useState({
    nombre: '', cuit: '', telefono: '', email: '', direccion: '', web: '', productos: ''
  });
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [proveedores, setProveedores] = useState([]);

  const fetchProveedores = async () => {
    try {
      const data = await getProveedores(token);
      setProveedores(data || []);
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.nombre) {
      setError('El nombre es obligatorio');
      return;
    }
    try {
      const res = await createProveedor({
        ...form,
        productos: form.productos ? form.productos.split(',').map(p => p.trim()) : []
      }, token);
      if (res.id) {
        onCreated && onCreated(res);
        setForm({ nombre: '', cuit: '', telefono: '', email: '', direccion: '', web: '', productos: '' });
        fetchProveedores(); // Actualizar la lista después de crear
      } else {
        setError(res.error || 'Error al crear proveedor');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleEdit = (proveedor) => {
    setSelectedProveedor(proveedor);
  };

  const handleUpdate = async (updatedProveedor) => {
    setError('');
    try {
      const res = await updateProveedor(updatedProveedor, token);
      if (res.id) {
        onCreated && onCreated(res);
        setSelectedProveedor(null);
        fetchProveedores(); // Actualizar la lista después de editar
      } else {
        setError(res.error || 'Error al actualizar proveedor');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProveedor(id, token);
      fetchProveedores(); // Actualizar la lista después de eliminar
      setSelectedProveedor(null);
    } catch (err) {
      console.error('Error al eliminar proveedor:', err);
      setError('Error al eliminar proveedor');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Agregar Proveedor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
          <input name="cuit" value={form.cuit} onChange={handleChange} placeholder="CUIT" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" type="email" />
          <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input name="web" value={form.web} onChange={handleChange} placeholder="Web" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <input name="productos" value={form.productos} onChange={handleChange} placeholder="Productos (separados por coma)" className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
        <div className="mt-4">
          <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-6 rounded-md font-medium transition-colors duration-200">Agregar Proveedor</button>
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
                  // Convertir productos de string a array si viene separado por comas
                  if (row.productos && typeof row.productos === 'string') {
                    row.productos = row.productos.split(',').map(p => p.trim());
                  }
                  const res = await createProveedor(row, token);
                  if (res.id) successCount++;
                  else failCount++;
                } catch {
                  failCount++;
                }
              }
              setBulkSuccess(`Creados: ${successCount}`);
              setBulkError(failCount ? `Fallidos: ${failCount}` : '');
              if (onCreated && successCount) onCreated();
              fetchProveedores();
            },
            error: (err) => setBulkError('Error al procesar CSV'),
          });
        }} className="mb-2" />
        {bulkSuccess && <div className="text-green-600 mt-2">{bulkSuccess}</div>}
        {bulkError && <div className="text-red-500 mt-2">{bulkError}</div>}
        <div className="text-xs text-gray-500 mt-2">Formato: nombre, cuit, telefono, email, direccion, web, productos</div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg mb-2">Lista de Proveedores</h2>
        <div className="grid grid-cols-1 gap-4">
          {proveedores.map((proveedor, index) => (
            <div key={proveedor.id || index} className="p-4 border rounded flex justify-between items-center">
              <div>
                <div className="font-semibold">{proveedor.nombre}</div>
                <div className="text-sm text-gray-600">CUIT: {proveedor.cuit} - Teléfono: {proveedor.telefono}</div>
              </div>
              <button onClick={() => handleEdit(proveedor)} className="bg-blue-500 text-white px-2 py-1 rounded">Editar</button>
            </div>
          ))}
        </div>
      </div>

      {selectedProveedor && (
        <ProveedorEditModal
          item={selectedProveedor}
          onClose={() => setSelectedProveedor(null)}
          onSave={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default ProveedorForm;
