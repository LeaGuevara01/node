// CompraForm.jsx
import React, { useState } from 'react';
import { FORM_STYLES, BUTTON_STYLES } from '../styles/componentStyles';

function CompraForm({ initialData = {}, onSubmit, onClose }) {
  const [form, setForm] = useState({
    proveedorId: initialData.proveedorId || '',
    estado: initialData.estado || '',
    total: initialData.total || '',
    fecha: initialData.fecha || '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className={FORM_STYLES.container}>
      <h2 className={FORM_STYLES.title}>Formulario de Compra</h2>
      <form onSubmit={handleSubmit}>
        <label className={FORM_STYLES.label}>Proveedor ID</label>
        <input
          name="proveedorId"
          value={form.proveedorId}
          onChange={handleChange}
          className={FORM_STYLES.input}
        />
        <label className={FORM_STYLES.label}>Estado</label>
        <input
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className={FORM_STYLES.input}
        />
        <label className={FORM_STYLES.label}>Total</label>
        <input
          name="total"
          value={form.total}
          onChange={handleChange}
          className={FORM_STYLES.input}
        />
        <label className={FORM_STYLES.label}>Fecha</label>
        <input
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChange}
          className={FORM_STYLES.input}
        />
        <div className={FORM_STYLES.actions}>
          <button type="submit" className={BUTTON_STYLES.primary}>
            Guardar
          </button>
          <button type="button" className={BUTTON_STYLES.secondary} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CompraForm;
