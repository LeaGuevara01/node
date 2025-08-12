import React, { useState } from 'react';
import { 
  INPUT_STYLES, 
  BUTTON_STYLES, 
  MODAL_STYLES, 
  LAYOUT_STYLES,
  ALERT_STYLES 
} from '../styles/repuestoStyles';

function RepuestoEditModal({ repuesto, onClose, onUpdate, onDelete, token }) {
  // Ensure all fields are initialized to empty string if null/undefined
  const initialForm = {
    nombre: repuesto.nombre ?? '',
    stock: repuesto.stock ?? '',
    codigo: repuesto.codigo ?? '',
    descripcion: repuesto.descripcion ?? '',
    precio: repuesto.precio ?? '',
    proveedor: repuesto.proveedor ?? '',
    ubicacion: repuesto.ubicacion ?? '',
    categoria: repuesto.categoria ?? '',
    id: repuesto.id
  };
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const updateData = {
        ...form,
        precio: Number(form.precio) || 0,
        stock: Number(form.stock) || 0
      };
      await onUpdate(repuesto.id, updateData);
      onClose();
    } catch (err) {
      console.error('Error updating repuesto:', err);
      setError(err.message || 'Error al actualizar el repuesto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este repuesto?')) {
      setLoading(true);
      try {
        await onDelete(repuesto.id);
        onClose();
      } catch (err) {
        console.error('Error deleting repuesto:', err);
        setError(err.message || 'Error al eliminar el repuesto');
        setLoading(false);
      }
    }
  };

  return (
    <div className={MODAL_STYLES.overlay}>
      <div className={MODAL_STYLES.container}>
        <div className={MODAL_STYLES.content}>
          <div className={MODAL_STYLES.header}>
            <h2 className={MODAL_STYLES.title}>Editar Repuesto</h2>
            <button
              onClick={onClose}
              className={MODAL_STYLES.closeButton}
              disabled={loading}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className={MODAL_STYLES.form}>
            <div className={LAYOUT_STYLES.gridForm}>
              <div>
                <label className={INPUT_STYLES.label}>Nombre</label>
                <input 
                  name="nombre" 
                  value={form.nombre} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                  required 
                  disabled={loading}
                />
              </div>
              <div>
                <label className={INPUT_STYLES.label}>Stock</label>
                <input 
                  name="stock" 
                  value={form.stock} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                  type="number" 
                  required 
                  disabled={loading}
                />
              </div>
              <div>
                <label className={INPUT_STYLES.label}>Código</label>
                <input 
                  name="codigo" 
                  value={form.codigo} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                  disabled={loading}
                />
              </div>
              <div>
                <label className={INPUT_STYLES.label}>Precio</label>
                <input 
                  name="precio" 
                  value={form.precio || ''} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                  type="number" 
                  step="0.01"
                  disabled={loading}
                />
              </div>
              <div>
                <label className={INPUT_STYLES.label}>Proveedor</label>
                <input 
                  name="proveedor" 
                  value={form.proveedor || ''} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                  disabled={loading}
                />
              </div>
              <div>
                <label className={INPUT_STYLES.label}>Ubicación</label>
                <input 
                  name="ubicacion" 
                  value={form.ubicacion || ''} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                  disabled={loading}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={INPUT_STYLES.label}>Categoría</label>
                <input 
                  name="categoria" 
                  value={form.categoria || ''} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                  disabled={loading}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={INPUT_STYLES.label}>Descripción</label>
                <textarea 
                  name="descripcion" 
                  value={form.descripcion || ''} 
                  onChange={handleChange} 
                  className={INPUT_STYLES.base}
                  rows={3}
                  disabled={loading}
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
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Eliminar'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={BUTTON_STYLES.secondary}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={BUTTON_STYLES.primary}
                disabled={loading}
              >
                {loading ? (
                  'Guardando...'
                ) : (
                  <>
                    <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Actualizar Repuesto
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

export default RepuestoEditModal;
