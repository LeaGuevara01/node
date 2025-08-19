// ComponentePage.jsx
// Página estándar para listado y navegación de componentes
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ComponenteForm from './ComponenteForm';
import { getComponentes, createComponente, updateComponente, deleteComponente } from '../services/componentesApi';
import { PAGE_STYLES, BUTTON_STYLES, LIST_STYLES } from '../styles/componentStyles';

function ComponentePage({ token }) {
  const navigate = useNavigate();
  const [componentes, setComponentes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComponentes();
  }, []);

  const fetchComponentes = async () => {
    try {
      const data = await getComponentes(token);
      setComponentes(data);
    } catch (err) {
      setError('Error al cargar componentes');
    }
  };

  const handleCreate = async (form) => {
    try {
      const res = await createComponente(form, token);
      if (res.error) {
        setError(res.error);
        return;
      }
      fetchComponentes();
      setShowForm(false);
    } catch (err) {
      setError('Error al crear componente');
    }
  };

  const handleEdit = (comp) => {
    setSelected(comp);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteComponente(id, token);
      fetchComponentes();
    } catch (err) {
      setError('Error al eliminar componente');
    }
  };

  return (
    <div className={PAGE_STYLES.container}>
      <h1 className={PAGE_STYLES.title}>Componentes</h1>
      <button className={BUTTON_STYLES.primary} onClick={() => setShowForm(true)}>
        Nuevo Componente
      </button>
      {error && <div className={PAGE_STYLES.error}>{error}</div>}
      <ul className={LIST_STYLES.list}>
        {componentes.map((comp) => (
          <li key={comp.id} className={LIST_STYLES.item}>
            <span>{comp.nombre}</span>
            <button onClick={() => handleEdit(comp)}>Editar</button>
            <button onClick={() => handleDelete(comp.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      {showForm && (
        <ComponenteForm
          initialData={selected}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default ComponentePage;
