// Formulario dedicado para crear/editar maquinarias
// Página simplificada enfocada únicamente en el formulario

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createMaquinaria,
  updateMaquinaria,
  getMaquinariaById,
  getMaquinariaFilters,
  deleteMaquinaria,
} from '../services/api';
import {
  CONTAINER_STYLES,
  INPUT_STYLES,
  BUTTON_STYLES,
  LAYOUT_STYLES,
  ICON_STYLES,
  TEXT_STYLES,
  ALERT_STYLES,
  MODAL_STYLES,
} from '../styles/repuestoStyles';

function MaquinariaFormulario({ token, onCreated }) {
  const navigate = useNavigate();
  const { id } = useParams(); // Si hay ID, es edición
  const isEditMode = !!id;

  // Estados del formulario
  const [form, setForm] = useState({
    nombre: '',
    modelo: '',
    categoria: '',
    anio: '',
    numero_serie: '',
    descripcion: '',
    proveedor: '',
    ubicacion: '',
    estado: '',
  });

  // Estados de control
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Opciones para campos select
  const [opciones, setOpciones] = useState({
    categorias: [],
    ubicaciones: [],
    estados: [],
  });

  /**
   * Carga los datos de la maquinaria para edición
   */
  const cargarMaquinaria = async () => {
    if (!isEditMode) return;

    setLoadingData(true);
    try {
      const data = await getMaquinariaById(id, token);
      setForm({
        nombre: data.nombre || '',
        modelo: data.modelo || '',
        categoria: data.categoria || '',
        anio: data.anio ? data.anio.toString() : '',
        numero_serie: data.numero_serie || '',
        descripcion: data.descripcion || '',
        proveedor: data.proveedor || '',
        ubicacion: data.ubicacion || '',
        estado: data.estado || '',
      });
    } catch (err) {
      console.error('Error al cargar maquinaria:', err);
      setError('Error al cargar los datos de la maquinaria');
    } finally {
      setLoadingData(false);
    }
  };

  /**
   * Carga las opciones para los campos select
   */
  const cargarOpciones = async () => {
    try {
      const data = await getMaquinariaFilters(token);
      setOpciones({
        categorias: data.categorias || [],
        ubicaciones: data.ubicaciones || [],
        estados: data.estados || [],
      });
    } catch (err) {
      console.error('Error al cargar opciones:', err);
    }
  };

  /**
   * Maneja cambios en los campos del formulario
   */
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Limpiar mensajes al modificar campos
    if (error) setError('');
    if (success) setSuccess('');
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const maquinariaData = {
        ...form,
        anio: form.anio ? Number(form.anio) : null,
      };

      if (isEditMode) {
        await updateMaquinaria({ ...maquinariaData, id: Number(id) }, token);
        setSuccess('Maquinaria actualizada exitosamente');
        if (onCreated) onCreated();

        // Redirigir después de un momento
        setTimeout(() => {
          navigate('/maquinarias');
        }, 1500);
      } else {
        await createMaquinaria(maquinariaData, token);
        setSuccess('Maquinaria creada exitosamente');
        if (onCreated) onCreated();

        // Limpiar formulario y mostrar mensaje
        setForm({
          nombre: '',
          modelo: '',
          categoria: '',
          anio: '',
          numero_serie: '',
          descripcion: '',
          proveedor: '',
          ubicacion: '',
          estado: '',
        });

        // Redirigir después de un momento
        setTimeout(() => {
          navigate('/maquinarias');
        }, 1500);
      }
    } catch (err) {
      console.error('Error al guardar maquinaria:', err);
      setError(err.message || 'Error al guardar la maquinaria');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancelar y volver al listado
   */
  const handleCancel = () => {
    navigate('/maquinarias');
  };

  // Efectos
  useEffect(() => {
    cargarOpciones();
    if (isEditMode) {
      cargarMaquinaria();
    }
  }, [id, isEditMode]);

  return (
    <div className={CONTAINER_STYLES.main}>
      <div className={CONTAINER_STYLES.maxWidth}>
        {/* Header */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={TEXT_STYLES.title}>
                {isEditMode ? 'Editar Maquinaria' : 'Nueva Maquinaria'}
              </h1>
              <p className={TEXT_STYLES.subtitle}>
                {isEditMode
                  ? 'Modifica los datos de la maquinaria existente'
                  : 'Completa la información para registrar una nueva maquinaria'}
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

        {/* Mensajes de estado */}
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
              {/* Información básica */}
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
                      placeholder="Ej: Tractor Principal"
                    />
                  </div>

                  <div>
                    <label className={INPUT_STYLES.label}>Modelo *</label>
                    <input
                      type="text"
                      value={form.modelo}
                      onChange={(e) => handleChange('modelo', e.target.value)}
                      className={INPUT_STYLES.base}
                      required
                      placeholder="Ej: JD 6145"
                    />
                  </div>

                  <div>
                    <label className={INPUT_STYLES.label}>Categoría *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.categoria}
                        onChange={(e) => handleChange('categoria', e.target.value)}
                        className={INPUT_STYLES.base}
                        required
                        placeholder="Ej: Tractor"
                        list="categorias-list"
                      />
                      <datalist id="categorias-list">
                        {opciones.categorias.map((categoria) => (
                          <option key={categoria} value={categoria} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <label className={INPUT_STYLES.label}>Año</label>
                    <input
                      type="number"
                      value={form.anio}
                      onChange={(e) => handleChange('anio', e.target.value)}
                      className={INPUT_STYLES.base}
                      min="1900"
                      max={new Date().getFullYear() + 5}
                      placeholder={new Date().getFullYear().toString()}
                    />
                  </div>

                  <div>
                    <label className={INPUT_STYLES.label}>Número de Serie</label>
                    <input
                      type="text"
                      value={form.numero_serie}
                      onChange={(e) => handleChange('numero_serie', e.target.value)}
                      className={INPUT_STYLES.base}
                      placeholder="Ej: JD6145001"
                    />
                  </div>

                  <div>
                    <label className={INPUT_STYLES.label}>Proveedor</label>
                    <input
                      type="text"
                      value={form.proveedor}
                      onChange={(e) => handleChange('proveedor', e.target.value)}
                      className={INPUT_STYLES.base}
                      placeholder="Ej: John Deere"
                    />
                  </div>
                </div>
              </div>

              {/* Ubicación y Estado */}
              <div>
                <h2 className={TEXT_STYLES.sectionTitle}>Ubicación y Estado</h2>
                <div className={LAYOUT_STYLES.gridForm}>
                  <div>
                    <label className={INPUT_STYLES.label}>Ubicación</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.ubicacion}
                        onChange={(e) => handleChange('ubicacion', e.target.value)}
                        className={INPUT_STYLES.base}
                        placeholder="Ej: Campo Norte"
                        list="ubicaciones-list"
                      />
                      <datalist id="ubicaciones-list">
                        {opciones.ubicaciones.map((ubicacion) => (
                          <option key={ubicacion} value={ubicacion} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <label className={INPUT_STYLES.label}>Estado</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={form.estado}
                        onChange={(e) => handleChange('estado', e.target.value)}
                        className={INPUT_STYLES.base}
                        placeholder="Ej: Operativo"
                        list="estados-list"
                      />
                      <datalist id="estados-list">
                        {opciones.estados.map((estado) => (
                          <option key={estado} value={estado} />
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
                      placeholder="Información adicional sobre la maquinaria..."
                    />
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
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
                  disabled={loading || !form.nombre || !form.modelo || !form.categoria}
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
                      {isEditMode ? 'Actualizar Maquinaria' : 'Crear Maquinaria'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default MaquinariaFormulario;
