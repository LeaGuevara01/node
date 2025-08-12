import React, { useState } from 'react';
import {
  INPUT_STYLES,
  BUTTON_STYLES,
  LAYOUT_STYLES,
  ICON_STYLES,
  ALERT_STYLES,
  MODAL_STYLES
} from '../styles/repuestoStyles';

function ProveedorEditModal({ proveedor, onClose, onUpdate, onDelete, token }) {
  // Validación de props
  if (!proveedor) {
    return null;
  }

  const initialForm = {
    nombre: proveedor.nombre ?? '',
    contacto: proveedor.contacto ?? '',
    telefono: proveedor.telefono ?? '',
    email: proveedor.email ?? '',
    direccion: proveedor.direccion ?? '',
    ubicacion: proveedor.ubicacion ?? '',
    notas: proveedor.notas ?? '',
    id: proveedor.id
  };
  
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const updateData = { ...form };
      await onUpdate(proveedor.id, updateData);
      onClose();
    } catch (err) {
      console.error('Error updating proveedor:', err);
      setError(err.message || 'Error al actualizar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      try {
        await onDelete(proveedor.id);
        onClose();
      } catch (err) {
        console.error('Error deleting proveedor:', err);
        setError(err.message || 'Error al eliminar el proveedor');
      }
    }
  };

  return (
    <div className={MODAL_STYLES.overlay}>
      <div className={MODAL_STYLES.container}>
        <div className={MODAL_STYLES.content}>
          
          {/* Header del Modal */}
          <div className={MODAL_STYLES.header}>
            <h2 className={MODAL_STYLES.title}>Editar Proveedor</h2>
            <button
              onClick={onClose}
              className={MODAL_STYLES.closeButton}
            >
              ×
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className={MODAL_STYLES.form}>
            <div className={LAYOUT_STYLES.gridForm}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input 
                  type="text"
                  name="nombre" 
                  value={form.nombre} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
                <input 
                  type="text"
                  name="contacto" 
                  value={form.contacto} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input 
                  type="tel"
                  name="telefono" 
                  value={form.telefono} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email"
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                <input 
                  type="text"
                  name="ubicacion" 
                  value={form.ubicacion} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input 
                  type="text"
                  name="direccion" 
                  value={form.direccion} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea 
                  name="notas" 
                  value={form.notas} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                  rows={3}
                />
              </div>
            </div>

            {error && (
              <div className={ALERT_STYLES.errorModal}>
                {error}
              </div>
            )}

            <div className={MODAL_STYLES.buttonGroup}>
              <button 
                type="button" 
                onClick={handleDelete} 
                className={BUTTON_STYLES.danger}
              >
                <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
              
              <button 
                type="button" 
                onClick={onClose} 
                className={BUTTON_STYLES.secondary}
              >
                Cancelar
              </button>
              
              <button 
                type="submit" 
                disabled={loading}
                className={BUTTON_STYLES.primary}
              >
                {loading ? (
                  <>
                    <svg className={`${ICON_STYLES.small} ${ICON_STYLES.spin}`} fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                    </svg>
                    Guardando...
                  </>
                ) : (
                  <>
                    <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Actualizar Proveedor
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProveedorEditModal;
