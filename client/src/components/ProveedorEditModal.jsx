import React, { useState } from 'react';

function ProveedorEditModal({ item, onClose, onSave, onDelete }) {
  const initialForm = {
    nombre: item.nombre ?? '',
    cuit: item.cuit ?? '',
    telefono: item.telefono ?? '',
    email: item.email ?? '',
    direccion: item.direccion ?? '',
    web: item.web ?? '',
    productos: item.productos?.join(', ') ?? '',
    id: item.id
  };
  const [form, setForm] = useState(initialForm);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      onDelete(item.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl mb-4">Editar Proveedor</h2>
        <form onSubmit={e => { e.preventDefault(); onSave({ ...form, productos: form.productos.split(',').map(p => p.trim()) }); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="p-2 border rounded" required />
            <input name="cuit" value={form.cuit || ''} onChange={handleChange} placeholder="CUIT" className="p-2 border rounded" />
            <input name="telefono" value={form.telefono || ''} onChange={handleChange} placeholder="Teléfono" className="p-2 border rounded" />
            <input name="email" value={form.email || ''} onChange={handleChange} placeholder="Email" className="p-2 border rounded" type="email" />
            <input name="direccion" value={form.direccion || ''} onChange={handleChange} placeholder="Dirección" className="p-2 border rounded" />
            <input name="web" value={form.web || ''} onChange={handleChange} placeholder="Web" className="p-2 border rounded" />
          </div>
          <input name="productos" value={form.productos || ''} onChange={handleChange} placeholder="Productos (separados por coma)" className="p-2 border rounded w-full mt-4" />
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

export default ProveedorEditModal;
