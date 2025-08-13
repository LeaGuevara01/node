// Formulario dedicado para crear/editar proveedores
// Página enfocada únicamente en el formulario, con breadcrumbs clickeables

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProveedor, getProveedorById, updateProveedor } from '../services/api';
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

function ProveedorFormulario({ token, onCreated }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [form, setForm] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
    ubicacion: '',
    notas: '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const cargarProveedor = async () => {
    if (!isEditMode) return;
    setLoadingData(true);
    try {
      const data = await getProveedorById(id, token);
      setForm({
        nombre: data?.nombre || '',
        contacto: data?.contacto || '',
        telefono: data?.telefono || '',
        email: data?.email || '',
        direccion: data?.direccion || '',
        ubicacion: data?.ubicacion || '',
        notas: data?.notas || '',
      });
    } catch (err) {
      console.error('Error al cargar proveedor:', err);
      setError('Error al cargar los datos del proveedor');
    } finally {
      setLoadingData(false);
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
      if (isEditMode) {
        await updateProveedor(id, form, token);
        setSuccess('Proveedor actualizado exitosamente');
        if (onCreated) onCreated();
      } else {
        await createProveedor(form, token);
        setSuccess('Proveedor creado exitosamente');
        if (onCreated) onCreated();
      }
      setTimeout(() => navigate('/proveedores'), 1200);
    } catch (err) {
      console.error('Error al guardar proveedor:', err);
      setError(err?.message || 'Error al guardar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate('/proveedores');

  useEffect(() => {
    if (isEditMode) cargarProveedor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]);

  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Proveedores', href: '/proveedores' },
    { label: isEditMode ? 'Editar' : 'Formulario' },
  ];

  return (
    <AppLayout
      currentSection="proveedores"
      breadcrumbs={breadcrumbs}
      title={isEditMode ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      subtitle={
        isEditMode
          ? 'Modifica los datos del proveedor'
          : 'Completa la información para registrar un proveedor'
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
                {isEditMode ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h1>
              <p className={TEXT_STYLES.subtitle}>
                {isEditMode
                  ? 'Modifica los datos del proveedor'
                  : 'Completa la información para registrar un proveedor'}
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
                    <label className={INPUT_STYLES.label}>Contacto</label>
                    <input
                      type="text"
                      value={form.contacto}
                      onChange={(e) => handleChange('contacto', e.target.value)}
                      className={INPUT_STYLES.base}
                    />
                  </div>
                  <div>
                    <label className={INPUT_STYLES.label}>Teléfono</label>
                    <input
                      type="tel"
                      value={form.telefono}
                      onChange={(e) => handleChange('telefono', e.target.value)}
                      className={INPUT_STYLES.base}
                    />
                  </div>
                  <div>
                    <label className={INPUT_STYLES.label}>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className={INPUT_STYLES.base}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={INPUT_STYLES.label}>Dirección</label>
                    <input
                      type="text"
                      value={form.direccion}
                      onChange={(e) => handleChange('direccion', e.target.value)}
                      className={INPUT_STYLES.base}
                    />
                  </div>
                  <div>
                    <label className={INPUT_STYLES.label}>Ubicación</label>
                    <input
                      type="text"
                      value={form.ubicacion}
                      onChange={(e) => handleChange('ubicacion', e.target.value)}
                      className={INPUT_STYLES.base}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={INPUT_STYLES.label}>Notas</label>
                    <textarea
                      value={form.notas}
                      onChange={(e) => handleChange('notas', e.target.value)}
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
                  disabled={loading || !form.nombre}
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
                      {isEditMode ? 'Actualizar Proveedor' : 'Crear Proveedor'}
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

export default ProveedorFormulario;
