/**
 * Módulo: ReparacionDetails
 * Rol: Vista de detalle con edición inline y resumen de repuestos
 * Notas: Normaliza ids numéricos y valida fecha antes de guardar
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReparacion, updateReparacion, deleteReparacion, getMaquinarias, getRepuestos } from '../services/api';
import { getUsers } from '../services/users';
import ReparacionEditModal from '../components/ReparacionEditModal';
import { 
  formatFecha,
  formatDateForInput,
  diasDesdeReparacion,
  calculateCostoRepuestos,
  formatRepuestosUsados,
  generateResumenReparacion,
  isValidDate
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
import AppLayout from '../components/navigation/AppLayout';
import { useNavigation } from '../hooks/useNavigation';

function ReparacionDetails({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { navigateToListPage } = useNavigation();
  const [reparacion, setReparacion] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Datos para formularios
  const [users, setUsers] = useState([]);
  const [maquinarias, setMaquinarias] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [selectedRepuestos, setSelectedRepuestos] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Estado del formulario de edición
  const [editForm, setEditForm] = useState({
    fecha: '',
    maquinariaId: '',
    descripcion: '',
    userId: ''
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
        userId: data.userId || ''
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
        getMaquinarias(token, {}, 1, true),
        getRepuestos(token, {}, 1, true)
      ]);
      setUsers(Array.isArray(usersData) ? usersData : (usersData?.usuarios || []));
      setMaquinarias(Array.isArray(maquinariasData) ? maquinariasData : (maquinariasData?.maquinarias || []));
      setRepuestos(Array.isArray(repuestosData) ? repuestosData : (repuestosData?.repuestos || []));
    } catch (err) {
      console.error('Error al cargar datos del formulario:', err);
      setUsers([]);
      setMaquinarias([]);
      setRepuestos([]);
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
        repuestos: selectedRepuestos
      };

      await updateReparacion(id, reparacionData, token);

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
    if (!token) return;
    // Evitar llamadas si el id no es numérico (p.ej. 'formulario')
    if (!id || !/^\d+$/.test(String(id))) {
      setLoading(false);
      return;
    }
    fetchReparacion();
    fetchFormData();
  }, [id, token]);

  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Reparaciones', href: '/reparaciones' },
    { label: `Reparación #${id}` }
  ];

  const handleEdit = () => setShowEditModal(true);
  const handleDeleteAction = async () => {
    await handleDelete();
  };

  if (loading) {
    return (
      <AppLayout currentSection="reparaciones" breadcrumbs={breadcrumbs} title="Cargando reparación..." token={token} isDetails={true}>
        <div className="flex justify-center items-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (!reparacion) {
    return (
      <AppLayout currentSection="reparaciones" breadcrumbs={breadcrumbs} title="Reparación no encontrada" token={token}>
        <div className={CONTAINER_STYLES.maxWidth}>
          <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
            <div className={ALERT_STYLES.error}>
              Reparación no encontrada
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      currentSection="reparaciones"
      breadcrumbs={breadcrumbs}
      title={`${reparacion?.maquinaria?.nombre || 'Reparación'} - Detalles`}
      isDetails={true}
      onEdit={handleEdit}
      onDelete={handleDeleteAction}
      token={token}
    >
        
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
            </div>
            <div className="flex gap-2"></div>
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
          
          {false ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className={INPUT_STYLES.label}>Descripción</label>
                <textarea
                  value={editForm.descripcion}
                  onChange={(e) => setEditForm({...editForm, descripcion: e.target.value})}
                  className={INPUT_STYLES.textarea}
                  rows="4"
                  placeholder="Describe los detalles de la reparación..."
                />
              </div>

              {/* Selección de repuestos */}
              <div className="mt-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Información básica */}
              <div className="space-y-4">
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
                    <p className="text-lg text-gray-900">{reparacion?.usuario?.username || 'No asignado'}</p>
                  </div>
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
              </div>
            </div>
          )}
        </div>

        {/* Repuestos utilizados */}
        {reparacion?.repuestos && reparacion.repuestos.length > 0 && (
          <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
            <h2 className={TEXT_STYLES.sectionTitle}>Repuestos Utilizados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reparacion.repuestos.map((reparacionRepuesto, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">
                      {reparacionRepuesto.repuesto?.nombre || 'Repuesto desconocido'}
                    </h4>
                    <span className="text-sm text-gray-500">
                      x{reparacionRepuesto.cantidad}
                    </span>
                  </div>
                  {reparacionRepuesto.repuesto?.precio && (
                    <p className="text-sm text-gray-600">
                      Precio unitario: ${Number(reparacionRepuesto.repuesto.precio).toLocaleString()}
                    </p>
                  )}
                  {reparacionRepuesto.repuesto?.precio && (
                    <p className="text-sm font-medium text-gray-900">
                      Subtotal: ${(Number(reparacionRepuesto.repuesto.precio) * reparacionRepuesto.cantidad).toLocaleString()}
                    </p>
                  )}
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
      {showEditModal && (
        <ReparacionEditModal
          item={reparacion}
          onClose={() => setShowEditModal(false)}
          onSave={async (data) => {
            await updateReparacion(data.id || id, data, token);
            setShowEditModal(false);
            await fetchReparacion();
          }}
          onDelete={async (rid) => {
            await deleteReparacion(rid, token);
            setShowEditModal(false);
            navigate('/reparaciones');
          }}
          users={users}
          maquinarias={maquinarias}
          repuestos={repuestos}
        />
      )}
    </AppLayout>
  );
}

export default ReparacionDetails;
