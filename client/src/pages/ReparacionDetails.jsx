import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReparacion, updateReparacion, deleteReparacion, getMaquinarias, getRepuestos } from '../services/api';
import { getUsers } from '../services/users';
import { 
  formatFecha,
  formatDateForInput,
  diasDesdeReparacion,
  getEstadoReparacionColorClass,
  getPrioridadColorClass,
  calculateCostoRepuestos,
  formatRepuestosUsados,
  formatDuracion,
  generateResumenReparacion,
  isValidDate,
  getDefaultEstado,
  getDefaultPrioridad
} from '../utils/reparacionUtils';
import {
  CONTAINER_STYLES,
  INPUT_STYLES,
  BUTTON_STYLES,
  LAYOUT_STYLES,
  ICON_STYLES,
  TEXT_STYLES,
  ALERT_STYLES,
  LIST_STYLES,
  POSITION_STYLES
} from '../styles/repuestoStyles';

function ReparacionDetails({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reparacion, setReparacion] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageError, setImageError] = useState(false);
  
  // Datos para formularios
  const [users, setUsers] = useState([]);
  const [maquinarias, setMaquinarias] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [selectedRepuestos, setSelectedRepuestos] = useState([]);
  
  // Estado del formulario de edición
  const [editForm, setEditForm] = useState({
    fecha: '',
    maquinariaId: '',
    descripcion: '',
    userId: '',
    estado: '',
    prioridad: '',
    duracionEstimada: '',
    costo: '',
    imagen: null,
    observaciones: ''
  });

  const fetchReparacion = async () => {
    try {
      setLoading(true);
      const data = await getReparacion(id, token);
      setReparacion(data);
      
      // Configurar formulario de edición
      setEditForm({
        fecha: formatDateForInput(new Date(data.fecha)),
        maquinariaId: data.maquinariaId || '',
        descripcion: data.descripcion || '',
        userId: data.userId || '',
        estado: data.estado || getDefaultEstado(),
        prioridad: data.prioridad || getDefaultPrioridad(),
        duracionEstimada: data.duracionEstimada || '',
        costo: data.costo || '',
        imagen: null,
        observaciones: data.observaciones || ''
      });
      
      // Configurar repuestos seleccionados
      if (data.repuestos && data.repuestos.length > 0) {
        setSelectedRepuestos(data.repuestos.map(rr => ({
          repuestoId: rr.repuestoId,
          cantidad: rr.cantidad
        })));
      }
    } catch (err) {
      setError('Error al cargar los detalles de la reparación: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormData = async () => {
    try {
      const [usersData, maquinariasData, repuestosData] = await Promise.all([
        getUsers(token),
        getMaquinarias(token),
        getRepuestos(token)
      ]);
      setUsers(usersData || []);
      setMaquinarias(maquinariasData || []);
      setRepuestos(repuestosData || []);
    } catch (err) {
      console.error('Error al cargar datos del formulario:', err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm({ ...editForm, imagen: file });
    }
  };

  const handleRepuestoSelect = (repuestoId, cantidad = 1) => {
    const repuestoExists = selectedRepuestos.find(r => r.repuestoId === parseInt(repuestoId));
    if (repuestoExists) {
      setSelectedRepuestos(selectedRepuestos.map(r => 
        r.repuestoId === parseInt(repuestoId) ? { ...r, cantidad } : r
      ));
    } else {
      setSelectedRepuestos([...selectedRepuestos, { repuestoId: parseInt(repuestoId), cantidad }]);
    }
  };

  const handleRemoveRepuesto = (repuestoId) => {
    setSelectedRepuestos(selectedRepuestos.filter(r => r.repuestoId !== parseInt(repuestoId)));
  };

  const handleSave = async () => {
    try {
      setError('');
      setSuccess('');
      
      // Validaciones
      if (!editForm.fecha || !editForm.maquinariaId || !editForm.userId) {
        setError('Fecha, maquinaria y responsable son obligatorios');
        return;
      }
      
      if (!isValidDate(editForm.fecha)) {
        setError('La fecha no es válida');
        return;
      }

      const reparacionData = {
        ...editForm,
        maquinariaId: Number(editForm.maquinariaId),
        userId: Number(editForm.userId),
        costo: editForm.costo ? Number(editForm.costo) : 0,
        duracionEstimada: editForm.duracionEstimada ? Number(editForm.duracionEstimada) : 0,
        repuestos: selectedRepuestos
      };

      // Si hay imagen, crear FormData
      if (editForm.imagen) {
        const formData = new FormData();
        Object.keys(reparacionData).forEach(key => {
          if (key === 'repuestos') {
            formData.append(key, JSON.stringify(reparacionData[key]));
          } else {
            formData.append(key, reparacionData[key]);
          }
        });
        formData.append('imagen', editForm.imagen);
        
        await updateReparacion(id, formData, token);
      } else {
        await updateReparacion(id, reparacionData, token);
      }

      setSuccess('Reparación actualizada correctamente');
      setEditMode(false);
      await fetchReparacion();
    } catch (err) {
      setError('Error al actualizar la reparación: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reparación?')) {
      return;
    }
    
    try {
      await deleteReparacion(id, token);
      navigate('/reparaciones');
    } catch (err) {
      setError('Error al eliminar la reparación: ' + err.message);
    }
  };

  useEffect(() => {
    if (id && token) {
      fetchReparacion();
      fetchFormData();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className={CONTAINER_STYLES.main}>
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <div className={TEXT_STYLES.loading}>
            <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.spin}`} fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
            </svg>
            Cargando detalles de la reparación...
          </div>
        </div>
      </div>
    );
  }

  if (error && !reparacion) {
    return (
      <div className={CONTAINER_STYLES.main}>
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <div className={ALERT_STYLES.error}>
            {error}
          </div>
          <button
            onClick={() => navigate('/reparaciones')}
            className={BUTTON_STYLES.secondary}
          >
            Volver a Reparaciones
          </button>
        </div>
      </div>
    );
  }

  const estadosDisponibles = [
    'pendiente', 
    'en_progreso', 
    'completada', 
    'cancelada', 
    'pausada'
  ];

  const prioridadesDisponibles = [
    'baja',
    'media', 
    'alta',
    'critica'
  ];

  return (
    <div className={CONTAINER_STYLES.main}>
      <div className={CONTAINER_STYLES.maxWidth}>
        
        {/* Header */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <div className={LAYOUT_STYLES.flexBetween}>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate('/reparaciones')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Volver a reparaciones"
                >
                  <svg className={ICON_STYLES.medium} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className={TEXT_STYLES.title}>
                  {reparacion?.maquinaria?.nombre || 'Reparación'} - Detalles
                </h1>
              </div>
              <p className={TEXT_STYLES.subtitle}>
                Información completa de la reparación
              </p>
            </div>
            <div className="flex gap-2">
              {!editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className={BUTTON_STYLES.edit}
                    title="Editar reparación"
                  >
                    <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  <button
                    onClick={handleDelete}
                    className={BUTTON_STYLES.delete}
                    title="Eliminar reparación"
                  >
                    <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setError('');
                      setSuccess('');
                    }}
                    className={BUTTON_STYLES.secondary}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className={BUTTON_STYLES.primary}
                  >
                    <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Guardar
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mensajes de estado */}
          {error && (
            <div className={ALERT_STYLES.error}>
              {error}
            </div>
          )}
          {success && (
            <div className={ALERT_STYLES.success}>
              {success}
            </div>
          )}
        </div>

        {/* Información principal */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <h2 className={TEXT_STYLES.sectionTitle}>Información General</h2>
          
          {editMode ? (
            <div className={LAYOUT_STYLES.gridForm}>
              <div>
                <label className={INPUT_STYLES.label}>Fecha *</label>
                <input
                  type="date"
                  value={editForm.fecha}
                  onChange={(e) => setEditForm({...editForm, fecha: e.target.value})}
                  className={INPUT_STYLES.base}
                  required
                />
              </div>

              <div>
                <label className={INPUT_STYLES.label}>Maquinaria *</label>
                <select
                  value={editForm.maquinariaId}
                  onChange={(e) => setEditForm({...editForm, maquinariaId: e.target.value})}
                  className={INPUT_STYLES.base}
                  required
                >
                  <option value="">Seleccionar maquinaria</option>
                  {maquinarias.map(maquinaria => (
                    <option key={maquinaria.id} value={maquinaria.id}>
                      {maquinaria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={INPUT_STYLES.label}>Responsable *</label>
                <select
                  value={editForm.userId}
                  onChange={(e) => setEditForm({...editForm, userId: e.target.value})}
                  className={INPUT_STYLES.base}
                  required
                >
                  <option value="">Seleccionar responsable</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={INPUT_STYLES.label}>Estado</label>
                <select
                  value={editForm.estado}
                  onChange={(e) => setEditForm({...editForm, estado: e.target.value})}
                  className={INPUT_STYLES.base}
                >
                  {estadosDisponibles.map(estado => (
                    <option key={estado} value={estado}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={INPUT_STYLES.label}>Prioridad</label>
                <select
                  value={editForm.prioridad}
                  onChange={(e) => setEditForm({...editForm, prioridad: e.target.value})}
                  className={INPUT_STYLES.base}
                >
                  {prioridadesDisponibles.map(prioridad => (
                    <option key={prioridad} value={prioridad}>
                      {prioridad.charAt(0).toUpperCase() + prioridad.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={INPUT_STYLES.label}>Duración Estimada (horas)</label>
                <input
                  type="number"
                  value={editForm.duracionEstimada}
                  onChange={(e) => setEditForm({...editForm, duracionEstimada: e.target.value})}
                  className={INPUT_STYLES.base}
                  min="0"
                  step="0.5"
                />
              </div>

              <div>
                <label className={INPUT_STYLES.label}>Costo</label>
                <input
                  type="number"
                  value={editForm.costo}
                  onChange={(e) => setEditForm({...editForm, costo: e.target.value})}
                  className={INPUT_STYLES.base}
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className={INPUT_STYLES.label}>Imagen</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={INPUT_STYLES.base}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={INPUT_STYLES.label}>Descripción</label>
                <textarea
                  value={editForm.descripcion}
                  onChange={(e) => setEditForm({...editForm, descripcion: e.target.value})}
                  className={INPUT_STYLES.base}
                  rows={3}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={INPUT_STYLES.label}>Observaciones</label>
                <textarea
                  value={editForm.observaciones}
                  onChange={(e) => setEditForm({...editForm, observaciones: e.target.value})}
                  className={INPUT_STYLES.base}
                  rows={3}
                  placeholder="Observaciones adicionales..."
                />
              </div>

              {/* Selección de repuestos */}
              <div className="sm:col-span-2">
                <label className={INPUT_STYLES.label}>Repuestos Utilizados</label>
                <div className="space-y-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleRepuestoSelect(e.target.value, 1);
                        e.target.value = '';
                      }
                    }}
                    className={INPUT_STYLES.base}
                  >
                    <option value="">Agregar repuesto...</option>
                    {repuestos.map(repuesto => (
                      <option key={repuesto.id} value={repuesto.id}>
                        {repuesto.nombre} - Stock: {repuesto.stock}
                      </option>
                    ))}
                  </select>
                  
                  {selectedRepuestos.length > 0 && (
                    <div className="space-y-2 mt-2 p-3 bg-gray-50 rounded-md">
                      <h4 className="font-medium text-sm text-gray-700">Repuestos seleccionados:</h4>
                      {selectedRepuestos.map((selected) => {
                        const repuesto = repuestos.find(r => r.id === selected.repuestoId);
                        return (
                          <div key={selected.repuestoId} className="flex items-center justify-between bg-white p-2 rounded border">
                            <span className="text-sm">{repuesto?.nombre}</span>
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={selected.cantidad}
                                onChange={(e) => handleRepuestoSelect(selected.repuestoId, parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                min="1"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveRepuesto(selected.repuestoId)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Información básica */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fecha</label>
                    <div className="mt-1 flex items-center">
                      <svg className={`${ICON_STYLES.small} text-gray-400 mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-lg text-gray-900">{formatFecha(reparacion?.fecha)}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Días desde reparación</label>
                    <div className="mt-1 flex items-center">
                      <svg className={`${ICON_STYLES.small} text-gray-400 mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg text-gray-900">{diasDesdeReparacion(reparacion?.fecha)} días</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Maquinaria</label>
                    <div className="mt-1 flex items-center">
                      <svg className={`${ICON_STYLES.small} text-gray-400 mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      <p className="text-lg text-gray-900">{reparacion?.maquinaria?.nombre || 'No especificada'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Responsable</label>
                    <div className="mt-1 flex items-center">
                      <svg className={`${ICON_STYLES.small} text-gray-400 mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-lg text-gray-900">{reparacion?.user?.name || 'No asignado'}</p>
                    </div>
                  </div>
                </div>

                {/* Estados y prioridad */}
                <div className="flex flex-wrap gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoReparacionColorClass(reparacion?.estado)}`}>
                    <svg className={`${ICON_STYLES.small} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {reparacion?.estado?.charAt(0).toUpperCase() + reparacion?.estado?.slice(1).replace('_', ' ')}
                  </span>

                  {reparacion?.prioridad && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPrioridadColorClass(reparacion?.prioridad)}`}>
                      <svg className={`${ICON_STYLES.small} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {reparacion?.prioridad.charAt(0).toUpperCase() + reparacion?.prioridad.slice(1)}
                    </span>
                  )}

                  {reparacion?.duracionEstimada > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                      <svg className={`${ICON_STYLES.small} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDuracion(reparacion?.duracionEstimada)}
                    </span>
                  )}

                  {reparacion?.costo > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                      <svg className={`${ICON_STYLES.small} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      ${Number(reparacion?.costo).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Descripción */}
                {reparacion?.descripcion && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Descripción</label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{reparacion.descripcion}</p>
                    </div>
                  </div>
                )}

                {/* Observaciones */}
                {reparacion?.observaciones && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Observaciones</label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">{reparacion.observaciones}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Imagen */}
              <div className="lg:col-span-1">
                <label className="text-sm font-medium text-gray-500">Imagen</label>
                <div className="mt-2">
                  {reparacion?.imagen && !imageError ? (
                    <img
                      src={reparacion.imagen}
                      alt="Imagen de la reparación"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">Sin imagen</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Repuestos utilizados */}
        {reparacion?.repuestos && reparacion.repuestos.length > 0 && (
          <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
            <h2 className={TEXT_STYLES.sectionTitle}>Repuestos Utilizados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reparacion.repuestos.map((rr, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {rr.repuesto?.nombre || 'Repuesto no especificado'}
                      </h3>
                      {rr.repuesto?.codigo && (
                        <p className="text-sm text-gray-500">Código: {rr.repuesto.codigo}</p>
                      )}
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <svg className={`${ICON_STYLES.small} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Cantidad: {rr.cantidad}
                      </div>
                      {rr.repuesto?.precio && (
                        <div className="mt-1 flex items-center text-sm text-green-600">
                          <svg className={`${ICON_STYLES.small} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          ${(Number(rr.repuesto.precio) * rr.cantidad).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Costo total de repuestos */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-900">Costo total de repuestos:</span>
                <span className="text-lg font-semibold text-blue-900">
                  ${calculateCostoRepuestos(reparacion.repuestos).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Resumen de la reparación */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <h2 className={TEXT_STYLES.sectionTitle}>Resumen</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-900 whitespace-pre-wrap">
              {generateResumenReparacion(reparacion)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReparacionDetails;
