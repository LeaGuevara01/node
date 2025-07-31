import React, { useState } from 'react';

function RepuestoEditModal({ item, onClose, onSave, onDelete }) {
  // Ensure all fields are initialized to empty string if null/undefined
  const initialForm = {
    nombre: item.nombre ?? '',
    stock: item.stock ?? '',
    codigo: item.codigo ?? '',
    descripcion: item.descripcion ?? '',
    precio: item.precio ?? '',
    proveedor: item.proveedor ?? '',
    ubicacion: item.ubicacion ?? '',
    categoria: item.categoria ?? '',
    id: item.id
  };
  const [form, setForm] = useState(initialForm);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este repuesto?')) {
      onDelete(item.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl mb-4">Editar Repuesto</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="p-2 border rounded" required />
            <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="p-2 border rounded" type="number" required />
            <input name="codigo" value={form.codigo} onChange={handleChange} placeholder="Código" className="p-2 border rounded" required />
            <input name="precio" value={form.precio || ''} onChange={handleChange} placeholder="Precio" className="p-2 border rounded" type="number" />
            <input name="proveedor" value={form.proveedor || ''} onChange={handleChange} placeholder="Proveedor" className="p-2 border rounded" />
            <input name="ubicacion" value={form.ubicacion || ''} onChange={handleChange} placeholder="Ubicación" className="p-2 border rounded" />
            <input name="categoria" value={form.categoria || ''} onChange={handleChange} placeholder="Categoría" className="p-2 border rounded" />
          </div>
          <textarea name="descripcion" value={form.descripcion || ''} onChange={handleChange} placeholder="Descripción" className="p-2 border rounded w-full mt-4" />
          <div className="flex justify-end space-x-4 mt-4">
            <button type="button" onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">Eliminar</button>
            <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">Cancelar</button>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RepuestoEditModal;
