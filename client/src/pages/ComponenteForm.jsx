// ComponenteForm.jsx
// Formulario estándar para creación/edición de componentes
import React, { useState } from 'react';
import { FORM_STYLES, BUTTON_STYLES } from '../styles/componentStyles';

function ComponenteForm({ initialData = {}, onSubmit, onClose }) {
  const [form, setForm] = useState({
    nombre: initialData.nombre || '',
    descripcion: initialData.descripcion || '',
    estado: initialData.estado || '',
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
      <h2 className={FORM_STYLES.title}>Formulario de Componente</h2>
      <form onSubmit={handleSubmit}>
        <label className={FORM_STYLES.label}>Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className={FORM_STYLES.input}
        />
        <label className={FORM_STYLES.label}>Descripción</label>
        <input
          name="descripcion"
          value={form.descripcion}
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

export default ComponenteForm;
