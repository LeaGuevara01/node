// EntityForm.jsx
import React, { useState } from 'react';
import { FORM_STYLES, BUTTON_STYLES } from '../styles/componentStyles';

/**
 * EntityForm - Formulario genérico de entidades
 * @param {Array} fields - Campos [{ label, key, type }]
 * @param {Object} initialData - Datos iniciales
 * @param {Function} onSubmit - Acción al guardar
 * @param {Function} onClose - Acción al cerrar
 */
function EntityForm({ fields, initialData = {}, onSubmit, onClose }) {
  const [form, setForm] = useState(() => {
    const obj = {};
    fields.forEach(f => { obj[f.key] = initialData[f.key] || ''; });
    return obj;
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
      <h2 className={FORM_STYLES.title}>Formulario</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((f) => (
          <div key={f.key}>
            <label className={FORM_STYLES.label}>{f.label}</label>
            <input
              name={f.key}
              type={f.type || 'text'}
              value={form[f.key]}
              onChange={handleChange}
              className={FORM_STYLES.input}
            />
          </div>
        ))}
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

export default EntityForm;
