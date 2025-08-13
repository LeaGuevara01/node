import React, { useState, useEffect } from 'react';

function ReparacionEditModal({ item, onClose, onSave, onDelete, users, maquinarias, repuestos, isCreate = false }) {
  const [form, setForm] = useState({
    fecha: '',
    maquinariaId: '',
    descripcion: '',
    userId: '',
    id: ''
  });
  const [selectedRepuestos, setSelectedRepuestos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item && !isCreate) {
      setForm({
        fecha: item.fecha ? new Date(item.fecha).toISOString().slice(0, 16) : '',
        maquinariaId: item.maquinariaId || '',
        descripcion: item.descripcion || '',
        userId: item.userId || '',
        id: item.id || ''
      });
      // Cargar repuestos existentes de la reparación
      if (item.repuestos && item.repuestos.length > 0) {
        const repuestosData = item.repuestos.map(r => ({
          repuestoId: r.repuestoId,
          cantidad: r.cantidad
        }));
        setSelectedRepuestos(repuestosData);
      } else {
        setSelectedRepuestos([]);
      }
    } else if (isCreate) {
      // Valores por defecto para creación
      const now = new Date();
      const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setForm({
        fecha: local,
        maquinariaId: '',
        descripcion: '',
        userId: '',
        id: ''
      });
      setSelectedRepuestos([]);
    }
  }, [item, isCreate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const dataToSend = {
        ...form,
        maquinariaId: parseInt(form.maquinariaId),
        userId: parseInt(form.userId),
        repuestos: selectedRepuestos
      };
      
      await onSave(dataToSend);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
      setError(error.message || 'Error al guardar la reparación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reparación?')) {
      setIsLoading(true);
      try {
        await onDelete(form.id);
        onClose();
      } catch (error) {
        console.error('Error al eliminar:', error);
        setError(error.message || 'Error al eliminar la reparación');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // En modo creación, mostramos el modal aunque item sea null/undefined
  if (!item && !isCreate) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{isCreate ? 'Nueva Reparación' : 'Editar Reparación'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
            <input
              type="datetime-local"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
              min="2000-01-01T00:00"
              max="2100-12-31T23:59"
              title="Seleccione fecha y hora (2000-2100)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsable
            </label>
            <select
              name="userId"
              value={form.userId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            >
              <option value="">Seleccionar Responsable</option>
              {users?.map(u => (
                <option key={u.id} value={u.id}>
                  {u.username} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción de la reparación..."
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maquinaria
            </label>
            <select
              name="maquinariaId"
              value={form.maquinariaId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            >
              <option value="">Seleccionar Maquinaria</option>
              {maquinarias?.map(m => (
                <option key={m.id} value={m.id}>
                  {m.nombre} - {m.modelo}
                </option>
              ))}
            </select>
          </div>

          {/* Sección de Repuestos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Componentes Utilizados
            </label>
            <div className="flex gap-2 mb-2">
              <select
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                onChange={(e) => {
                  if (e.target.value) {
                    handleRepuestoSelect(e.target.value, 1);
                    e.target.value = '';
                  }
                }}
              >
                <option value="">Seleccionar repuesto...</option>
                {repuestos
                  ?.filter(r => !selectedRepuestos.find(sr => sr.repuestoId === r.id))
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
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedRepuestos.map((item) => {
                  const repuesto = repuestos?.find(r => r.id === item.repuestoId);
                  return (
                    <div key={item.repuestoId} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                      <span className="flex-1">{repuesto?.nombre} - {repuesto?.codigo}</span>
                      <input
                        type="number"
                        min="1"
                        value={item.cantidad}
                        onChange={(e) => handleRepuestoSelect(item.repuestoId, parseInt(e.target.value) || 1)}
                        className="w-12 p-1 border rounded text-center text-xs"
                        disabled={isLoading}
                      />
                      <span className="text-xs text-gray-600">und</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRepuesto(item.repuestoId)}
                        className="text-red-500 hover:text-red-700 px-1"
                        disabled={isLoading}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-between space-x-3 pt-4">
            {!isCreate && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            )}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (isCreate ? 'Creando...' : 'Guardando...') : (isCreate ? 'Crear' : 'Guardar')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReparacionEditModal;
