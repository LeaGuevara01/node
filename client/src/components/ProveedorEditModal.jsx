import React, { useState } from 'react';
import {
  INPUT_STYLES,
  BUTTON_STYLES,
  LAYOUT_STYLES,
  ICON_STYLES,
  ALERT_STYLES,
  MODAL_STYLES
} from '../styles/repuestoStyles';
import { DETAILS_CONTAINER } from '../styles/detailsStyles';

function ProveedorEditModal({ proveedor, onClose, onUpdate, onDelete, token }) {
  // Validación de props
  if (!proveedor) {
    return null;
  }

  const initialForm = {
    nombre: proveedor.nombre ?? '',
    cuit: proveedor.cuit ?? '',
    telefono: proveedor.telefono ?? '',
    email: proveedor.email ?? '',
    direccion: proveedor.direccion ?? '',
    web: proveedor.web ?? '',
    productos: Array.isArray(proveedor.productos) ? proveedor.productos.join(', ') : (proveedor.productos ?? ''),
    id: proveedor.id
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
        productos: form.productos.split(',').map(p => p.trim()).filter(p => p)
      };
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
      setLoading(true);
      try {
        await onDelete(proveedor.id);
        onClose();
      } catch (err) {
        console.error('Error deleting proveedor:', err);
        setError(err.message || 'Error al eliminar el proveedor');
        setLoading(false);
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
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={LAYOUT_STYLES.gridForm}>
              <div>
                <label className={INPUT_STYLES.label}>Nombre *</label>
                <input 
                  name="nombre" 
                  value={form.nombre} 
                  onChange={handleChange} 
                  placeholder="Nombre del proveedor" 
                  className={INPUT_STYLES.input} 
                  required 
                />
              </div>

              <div>
                <label className={INPUT_STYLES.label}>CUIT</label>
                <input 
                  name="cuit" 
                  value={form.cuit || ''} 
                  onChange={handleChange} 
                  placeholder="20-12345678-9" 
                  className={INPUT_STYLES.input} 
                />
              </div>

              <div>
                <label className={INPUT_STYLES.label}>Teléfono</label>
                <input 
                  name="telefono" 
                  value={form.telefono || ''} 
                  onChange={handleChange} 
                  placeholder="+54 9 11 1234-5678" 
                  className={INPUT_STYLES.input} 
                />
              </div>

              <div>
                <label className={INPUT_STYLES.label}>Email</label>
                <input 
                  name="email" 
                  value={form.email || ''} 
                  onChange={handleChange} 
                  placeholder="contacto@proveedor.com" 
                  className={INPUT_STYLES.input} 
                  type="email" 
                />
              </div>

              <div className="sm:col-span-2">
                <label className={INPUT_STYLES.label}>Dirección</label>
                <input 
                  name="direccion" 
                  value={form.direccion || ''} 
                  onChange={handleChange} 
                  placeholder="Calle 123, Ciudad, Provincia" 
                  className={INPUT_STYLES.input} 
                />
              </div>

              <div className="sm:col-span-2">
                <label className={INPUT_STYLES.label}>Productos (separados por comas)</label>
                <textarea 
                  name="productos" 
                  value={form.productos || ''} 
                  onChange={handleChange} 
                  placeholder="Ejemplo: Filtros, Aceites, Repuestos hidráulicos, Neumáticos" 
                  className={INPUT_STYLES.input}
                  rows={3}
                />
              </div>
            </div>

            {/* Botones de Acción */}
            <div className={MODAL_STYLES.buttonGroup}>
              <button 
                type="button" 
                onClick={handleDelete} 
                className={`${BUTTON_STYLES.danger}`}
              >
                <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Eliminar
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className={BUTTON_STYLES.secondary}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={BUTTON_STYLES.primary}
                >
                  <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProveedorEditModal;
