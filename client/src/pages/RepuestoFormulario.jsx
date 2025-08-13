// Formulario dedicado para crear/editar repuestos
// Página simplificada enfocada únicamente en el formulario

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createRepuesto,
  getRepuestoById,
  getRepuestoFilters,
  updateRepuesto,
} from '../services/api';
import {
  CONTAINER_STYLES,
  INPUT_STYLES,
  BUTTON_STYLES,
  LAYOUT_STYLES,
  ICON_STYLES,
  TEXT_STYLES,
  ALERT_STYLES,
} from '../styles/repuestoStyles';
import AppLayout from '../components/navigation/AppLayout';

function RepuestoFormulario({ token, onCreated }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [form, setForm] = useState({
    nombre: '',
    stock: '',
    codigo: '',
    descripcion: '',
    precio: '',
    proveedor: '',
    ubicacion: '',
    categoria: '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [opciones, setOpciones] = useState({
    categorias: [],
    ubicaciones: [],
  });

  const cargarRepuesto = async () => {
    if (!isEditMode) return;
    setLoadingData(true);
    try {
      const data = await getRepuestoById(id, token);
      setForm({
        nombre: data?.nombre || '',
        stock: data?.stock?.toString?.() || '',
        codigo: data?.codigo || '',
        descripcion: data?.descripcion || '',
        precio: (data?.precio ?? '').toString(),
        proveedor: data?.proveedor || '',
        ubicacion: data?.ubicacion || '',
        categoria: data?.categoria || '',
      });
    } catch (err) {
      console.error('Error al cargar repuesto:', err);
      setError('Error al cargar los datos del repuesto');
    } finally {
      setLoadingData(false);
    }
  };

  const cargarOpciones = async () => {
    try {
      const data = await getRepuestoFilters(token);
      setOpciones({
        categorias: data?.categorias || [],
        ubicaciones: data?.ubicaciones || [],
      });
    } catch (err) {
      console.error('Error al cargar opciones:', err);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const repuestoData = {
        ...form,
        stock: form.stock !== '' ? Number(form.stock) : 0,
        precio: form.precio !== '' ? Number(form.precio) : 0,
      };

      if (isEditMode) {
        await updateRepuesto(id, repuestoData, token);
        setSuccess('Repuesto actualizado exitosamente');
        if (onCreated) onCreated();
      } else {
        await createRepuesto(repuestoData, token);
        setSuccess('Repuesto creado exitosamente');
        if (onCreated) onCreated();
      }

      setTimeout(() => navigate('/repuestos'), 1200);
    } catch (err) {
      console.error('Error al guardar repuesto:', err);
      setError(err?.message || 'Error al guardar el repuesto');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate('/repuestos');

  useEffect(() => {
    cargarOpciones();
    if (isEditMode) cargarRepuesto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]);

  // Breadcrumbs bajo el header (clickeables)
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Repuestos', href: '/repuestos' },
    { label: isEditMode ? 'Editar' : 'Formulario' },
  ];

  return (
    <AppLayout
      currentSection="repuestos"
      breadcrumbs={breadcrumbs}
      title={isEditMode ? 'Editar Repuesto' : 'Nuevo Repuesto'}
      subtitle={
        isEditMode
          ? 'Modifica los datos del repuesto'
          : 'Completa la información para registrar un repuesto'
      }
      token={token}
      hideSearchOnDesktop={true}
      collapseUserOnMd={true}
    >
      <div className={CONTAINER_STYLES.maxWidth}>
        {/* Header */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={TEXT_STYLES.title}>
                {isEditMode ? 'Editar Repuesto' : 'Nuevo Repuesto'}
              </h1>
              <p className={TEXT_STYLES.subtitle}>
                {isEditMode
                  ? 'Modifica los datos del repuesto'
                  : 'Completa la información para registrar un repuesto'}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className={`${BUTTON_STYLES.secondary} flex items-center gap-2`}
            >
              <svg
                className={ICON_STYLES.small}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver al Listado
            </button>
          </div>
        </div>

        {/* Mensajes */}
        {error && <div className={ALERT_STYLES.error}>{error}</div>}
        {success && <div className={ALERT_STYLES.success}>{success}</div>}

        {/* Formulario */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          {loadingData ? (
            <div className="flex items-center justify-center py-8">
              <div className={TEXT_STYLES.loading}>
                <svg
                  className={`${ICON_STYLES.small} ${ICON_STYLES.spin}`}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="opacity-25"
                  ></circle>
                  <path
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    className="opacity-75"
                  ></path>
                </svg>
                Cargando datos...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className={TEXT_STYLES.sectionTitle}>Información Básica</h2>
                <div className={LAYOUT_STYLES.gridForm}>
                  <div>
                    <label className={INPUT_STYLES.label}>Nombre *</label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => handleChange('nombre', e.target.value)}
                      className={INPUT_STYLES.base}
                      required
                    />
                  </div>
                  <div>
                    <label className={INPUT_STYLES.label}>Stock *</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => handleChange('stock', e.target.value)}
                      className={INPUT_STYLES.base}
                      required
                    />
                  </div>
                  <div>
                    <label className={INPUT_STYLES.label}>Código</label>
                    <input
                      type="text"
                      value={form.codigo}
                      onChange={(e) => handleChange('codigo', e.target.value)}
                      className={INPUT_STYLES.base}
                    />
                  </div>
                  <div>
                    <label className={INPUT_STYLES.label}>Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.precio}
                      onChange={(e) => handleChange('precio', e.target.value)}
                      className={INPUT_STYLES.base}
                    />
                  </div>
                  <div>
                    <label className={INPUT_STYLES.label}>Proveedor</label>
                    <input
                      type="text"
                      value={form.proveedor}
                      onChange={(e) => handleChange('proveedor', e.target.value)}
                      className={INPUT_STYLES.base}
                    />
                  </div>
                  <div>
                    <label className={INPUT_STYLES.label}>Ubicación</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.ubicacion}
                        onChange={(e) => handleChange('ubicacion', e.target.value)}
                        className={INPUT_STYLES.base}
                        list="ubicaciones-list"
                      />
                      <datalist id="ubicaciones-list">
                        {opciones.ubicaciones.map((u) => (
                          <option key={u} value={u} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={INPUT_STYLES.label}>Categoría *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.categoria}
                        onChange={(e) => handleChange('categoria', e.target.value)}
                        className={INPUT_STYLES.base}
                        required
                        list="categorias-list"
                      />
                      <datalist id="categorias-list">
                        {opciones.categorias.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={INPUT_STYLES.label}>Descripción</label>
                    <textarea
                      value={form.descripcion}
                      onChange={(e) => handleChange('descripcion', e.target.value)}
                      className={INPUT_STYLES.base}
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className={BUTTON_STYLES.secondary}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={BUTTON_STYLES.primary}
                  disabled={loading || !form.nombre || !form.categoria || form.stock === ''}
                >
                  {loading ? (
                    <>
                      <svg
                        className={`${ICON_STYLES.small} ${ICON_STYLES.spin}`}
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="opacity-25"
                        ></circle>
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          className="opacity-75"
                        ></path>
                      </svg>
                      {isEditMode ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    <>
                      <svg
                        className={ICON_STYLES.small}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {isEditMode ? 'Actualizar Repuesto' : 'Crear Repuesto'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default RepuestoFormulario;
