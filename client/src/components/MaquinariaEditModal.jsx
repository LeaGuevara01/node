import React, { useState } from 'react';

function MaquinariaEditModal({ item, onClose, onSave, onDelete }) {
  // Ensure all fields are initialized to empty string if null/undefined
  const initialForm = {
    nombre: item.nombre ?? '',
    modelo: item.modelo ?? '',
    categoria: item.categoria ?? '',
    anio: item.anio ?? '',
    numero_serie: item.numero_serie ?? '',
    proveedor: item.proveedor ?? '',
    ubicacion: item.ubicacion ?? '',
    estado: item.estado ?? '',
    descripcion: item.descripcion ?? '',
    id: item.id
  };
  const [form, setForm] = useState(initialForm);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold mb-4">Editar Maquinaria</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="mb-2 p-2 border rounded w-full" required />
          <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Modelo" className="mb-2 p-2 border rounded w-full" required />
          <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoría" className="mb-2 p-2 border rounded w-full" required />
          <input name="anio" value={form.anio} onChange={handleChange} placeholder="Año" className="mb-2 p-2 border rounded w-full" type="number" />
          <input name="numero_serie" value={form.numero_serie} onChange={handleChange} placeholder="N° Serie" className="mb-2 p-2 border rounded w-full" />
          <input name="proveedor" value={form.proveedor} onChange={handleChange} placeholder="Proveedor" className="mb-2 p-2 border rounded w-full" />
          <input name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Ubicación" className="mb-2 p-2 border rounded w-full" />
          <input name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" className="mb-2 p-2 border rounded w-full" />
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" className="mb-2 p-2 border rounded w-full" />
          <div className="flex justify-between mt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
            <button type="button" className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => setConfirmDelete(true)}>Eliminar</button>
          </div>
        </form>
        {confirmDelete && (
          <div className="mt-4 p-4 bg-red-100 rounded">
            <div className="mb-2">¿Seguro que deseas eliminar esta maquinaria?</div>
            <button className="bg-red-700 text-white px-4 py-2 rounded mr-2" onClick={() => onDelete(item.id)}>Confirmar</button>
            <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setConfirmDelete(false)}>Cancelar</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MaquinariaEditModal;
