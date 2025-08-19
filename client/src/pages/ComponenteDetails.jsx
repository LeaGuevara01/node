// ComponenteDetails.jsx
// Vista unificada para detalles de cualquier componente
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DETAILS_STYLES } from '../styles/componentStyles';
import { getComponenteById } from '../services/componentesApi';

function ComponenteDetails({ token }) {
  const { id } = useParams();
  const [componente, setComponente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComponente();
  }, [id]);

  const fetchComponente = async () => {
    try {
      setLoading(true);
      const data = await getComponenteById(id, token);
      setComponente(data);
    } catch (err) {
      setError('Error al cargar los detalles del componente');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={DETAILS_STYLES.loading}>Cargando...</div>;
  if (error) return <div className={DETAILS_STYLES.error}>{error}</div>;
  if (!componente) return <div className={DETAILS_STYLES.empty}>No encontrado</div>;

  return (
    <div className={DETAILS_STYLES.container}>
      <h1 className={DETAILS_STYLES.title}>{componente.nombre}</h1>
      <p className={DETAILS_STYLES.label}>Descripción:</p>
      <p>{componente.descripcion}</p>
      <p className={DETAILS_STYLES.label}>Estado:</p>
      <p>{componente.estado}</p>
      {/* Agrega aquí más campos si el modelo lo requiere */}
    </div>
  );
}

export default ComponenteDetails;
