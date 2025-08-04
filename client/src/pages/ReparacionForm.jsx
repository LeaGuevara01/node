// Archivo optimizado para ReparacionForm.jsx con utilidades modulares
// Este archivo es una versión refactorizada que usa las utilidades creadas

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { 
  createReparacion, 
  updateReparacion, 
  getReparaciones, 
  deleteReparacion, 
  getMaquinarias, 
  getRepuestos 
} from '../services/api';
import { getUsers } from '../services/users';
import ReparacionEditModal from '../components/ReparacionEditModal';
import { getColorFromString } from '../utils/colorUtils';
import { 
  sortReparacionesByDate,
  buildReparacionQueryParams,
  clearReparacionFilters,
  formatFecha,
  formatDateForInput,
  diasDesdeReparacion,
  getEstadoReparacionColorClass,
  getPrioridadColorClass,
  calculateCostoRepuestos,
  formatRepuestosUsados,
  isValidDate,
  getDefaultEstado,
  getDefaultPrioridad,
  formatDuracion,
  generateResumenReparacion
} from '../utils/reparacionUtils';
import { 
  CONTAINER_STYLES, 
  INPUT_STYLES, 
  BUTTON_STYLES, 
  LAYOUT_STYLES,
  ICON_STYLES,
  TEXT_STYLES,
  ALERT_STYLES,
  MODAL_STYLES,
  LIST_STYLES,
  POSITION_STYLES,
  RANGE_STYLES
} from '../styles/repuestoStyles';

function ReparacionForm({ token, onCreated }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fecha: formatDateForInput(new Date()),
    maquinariaId: '',
    descripcion: '',
    userId: '',
    estado: getDefaultEstado(),
    prioridad: getDefaultPrioridad(),
    duracionEstimada: '',
    costo: ''
  });
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedReparacion, setSelectedReparacion] = useState(null);
  const [reparaciones, setReparaciones] = useState([]);
  const [selectedRepuestos, setSelectedRepuestos] = useState([]);
  
  // Datos para formularios
  const [users, setUsers] = useState([]);
  const [maquinarias, setMaquinarias] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    search: '',
    maquinariaId: '',
    userId: '',
    fechaInicio: '',
    fechaFin: '',
    estado: ''
  });
  const [opcionesFiltros, setOpcionesFiltros] = useState({
    maquinarias: [],
    usuarios: [],
    estados: ['pendiente', 'en_progreso', 'completada', 'cancelada', 'pausada']
  });
  const [paginacion, setPaginacion] = useState({
    current: 1,
    total: 1,
    totalItems: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchReparaciones = async (filtrosActuales = filtros, pagina = 1) => {
    setLoading(true);
    try {
      const params = buildReparacionQueryParams(filtrosActuales, pagina);

      console.log('Fetching with params:', params.toString());

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/reparaciones?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      console.log('API Response:', data);
      
      if (data.reparaciones) {
        const reparacionesOrdenadas = sortReparacionesByDate(data.reparaciones);
        setReparaciones(reparacionesOrdenadas);
        setPaginacion(data.pagination || { current: 1, total: 1, totalItems: 0 });
      } else {
        const allReparaciones = await getReparaciones(token);
        const reparacionesOrdenadas = sortReparacionesByDate(allReparaciones || []);
        setReparaciones(reparacionesOrdenadas);
      }
    } catch (err) {
      console.error('Error al cargar reparaciones:', err);
      setReparaciones([]);
      setError('Error al cargar reparaciones');
    } finally {
      setLoading(false);
    }
  };

  const fetchOpcionesFiltros = async () => {
    try {
      // Since the filtros endpoint doesn't exist, we'll populate from the main data
      const reparacionesData = await getReparaciones(token);
      if (reparacionesData && reparacionesData.length > 0) {
        const maquinarias = [...new Set(reparacionesData.map(r => r.maquinaria).filter(Boolean))];
        const usuarios = [...new Set(reparacionesData.map(r => r.user).filter(Boolean))];
        setOpcionesFiltros(prev => ({
          ...prev,
          maquinarias,
          usuarios,
          estados: ['pendiente', 'en_progreso', 'completada', 'cancelada', 'pausada']
        }));
      }
    } catch (err) {
      console.error('Error al cargar opciones de filtros:', err);
    }
  };

  const fetchFormData = async () => {
    try {
      const [usersData, maquinariasData, repuestosData] = await Promise.all([
        getUsers(token),
        getMaquinarias(token),
        getRepuestos(token)
      ]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setMaquinarias(Array.isArray(maquinariasData) ? maquinariasData : []);
      setRepuestos(Array.isArray(repuestosData) ? repuestosData : []);
    } catch (err) {
      console.error('Error al cargar datos del formulario:', err);
      // Ensure arrays remain as arrays even on error
      setUsers([]);
      setMaquinarias([]);
      setRepuestos([]);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    const nuevosFiltros = { ...filtros, [campo]: valor };
    setFiltros(nuevosFiltros);

    if (campo === 'search') {
      if (searchTimeout) clearTimeout(searchTimeout);
      setSearchTimeout(setTimeout(() => {
        fetchReparaciones(nuevosFiltros, 1);
      }, 300));
    } else {
      fetchReparaciones(nuevosFiltros, 1);
    }
  };

  const limpiarFiltros = () => {
    const filtrosVacios = clearReparacionFilters();
    setFiltros(filtrosVacios);
    fetchReparaciones(filtrosVacios, 1);
  };

  const handlePaginacion = (nuevaPagina) => {
    fetchReparaciones(filtros, nuevaPagina);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones
    if (!form.fecha || !form.maquinariaId || !form.userId) {
      setError('Fecha, maquinaria y responsable son obligatorios');
      return;
    }
    
    if (!isValidDate(form.fecha)) {
      setError('La fecha no es válida');
      return;
    }
    
    try {
      const reparacionData = {
        ...form,
        maquinariaId: Number(form.maquinariaId),
        userId: Number(form.userId),
        costo: form.costo ? Number(form.costo) : 0,
        duracionEstimada: form.duracionEstimada ? Number(form.duracionEstimada) : 0,
        repuestos: selectedRepuestos
      };
      
      await createReparacion(reparacionData, token);
      setForm({
        fecha: formatDateForInput(new Date()),
        maquinariaId: '',
        descripcion: '',
        userId: '',
        estado: getDefaultEstado(),
        prioridad: getDefaultPrioridad(),
        duracionEstimada: '',
        costo: ''
      });
      setSelectedRepuestos([]);
      setShowAddModal(false);
      if (onCreated) onCreated();
      fetchReparaciones();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (reparacion) => {
    setSelectedReparacion(reparacion);
  };

  const closeEditModal = () => {
    setSelectedReparacion(null);
  };

  const handleUpdateReparacion = async (id, reparacionData) => {
    try {
      await updateReparacion(id, reparacionData, token);
      fetchReparaciones();
      fetchOpcionesFiltros(); // Actualizar opciones de filtros
      if (onCreated) onCreated();
    } catch (err) {
      console.error('Error al actualizar reparación:', err);
      throw new Error(err.message || 'Error al actualizar la reparación');
    }
  };

  const handleDeleteReparacion = async (id) => {
    try {
      await deleteReparacion(id, token);
      fetchReparaciones();
      fetchOpcionesFiltros(); // Actualizar opciones de filtros
      if (onCreated) onCreated();
    } catch (err) {
      console.error('Error al eliminar reparación:', err);
      throw new Error(err.message || 'Error al eliminar la reparación');
    }
  };

  useEffect(() => {
    fetchReparaciones();
    fetchOpcionesFiltros();
    fetchFormData();
  }, []);

  return (
    <div className={CONTAINER_STYLES.main}>
      <div className={CONTAINER_STYLES.maxWidth}>
        
        {/* Header con botones de acción */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <div className={LAYOUT_STYLES.flexBetween}>
            <div>
              <h1 className={TEXT_STYLES.title}>Gestión de Reparaciones</h1>
              <p className={TEXT_STYLES.subtitle}>Administra el historial de reparaciones</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <label className="flex-1 sm:flex-initial">
                <span className="sr-only">Cargar CSV</span>
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setBulkError(''); setBulkSuccess('');
                    
                    Papa.parse(file, {
                      header: true,
                      complete: async (results) => {
                        const validRows = results.data.filter(row => row.fecha && row.maquinariaId && row.userId);
                        let successCount = 0, failCount = 0;
                        
                        for (const row of validRows) {
                          try {
                            await createReparacion({
                              fecha: row.fecha,
                              maquinariaId: Number(row.maquinariaId),
                              descripcion: row.descripcion || '',
                              userId: Number(row.userId),
                              estado: row.estado || getDefaultEstado(),
                              prioridad: row.prioridad || getDefaultPrioridad(),
                              costo: row.costo ? Number(row.costo) : 0,
                              duracionEstimada: row.duracionEstimada ? Number(row.duracionEstimada) : 0,
                              repuestos: []
                            }, token);
                            successCount++;
                          } catch (err) {
                            failCount++;
                          }
                        }
                        setBulkSuccess(`Creadas: ${successCount}`);
                        setBulkError(failCount ? `Fallidas: ${failCount}` : '');
                        if (onCreated && successCount) onCreated();
                        fetchReparaciones();
                      },
                      error: (err) => setBulkError('Error al procesar CSV'),
                    });
                  }}
                  className="hidden"
                  id="csv-upload"
                />
                <div className={BUTTON_STYLES.csv}>
                  <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Cargar CSV
                </div>
              </label>
              <button
                onClick={() => setShowAddModal(true)}
                className={BUTTON_STYLES.newItem}
              >
                <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nueva Reparación
              </button>
            </div>
          </div>
          
          {/* Mensajes de estado para carga masiva */}
          {bulkSuccess && (
            <div className={ALERT_STYLES.success}>
              {bulkSuccess}
            </div>
          )}
          {bulkError && (
            <div className={ALERT_STYLES.error}>
              {bulkError}
            </div>
          )}
        </div>

        {/* Filtros compactos */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <h2 className={TEXT_STYLES.sectionTitle}>Filtros</h2>
          
          <div className={LAYOUT_STYLES.gridFilters}>
            {/* Búsqueda */}
            <div className={LAYOUT_STYLES.searchSpan}>
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={filtros.search}
                  onChange={(e) => handleFiltroChange('search', e.target.value)}
                  placeholder="Buscar reparaciones..."
                  className={`${INPUT_STYLES.withIcon} ${INPUT_STYLES.placeholder}`}
                />
              </div>
            </div>

            {/* Maquinaria */}
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <select
                  value={filtros.maquinariaId}
                  onChange={(e) => handleFiltroChange('maquinariaId', e.target.value)}
                  className={INPUT_STYLES.select}
                >
                  <option value="" className={INPUT_STYLES.selectPlaceholder}>Maquinarias</option>
                  {Array.isArray(maquinarias) && maquinarias.map(maquinaria => (
                    <option key={maquinaria.id} value={maquinaria.id}>{maquinaria.nombre}</option>
                  ))}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Usuario */}
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <select
                  value={filtros.userId}
                  onChange={(e) => handleFiltroChange('userId', e.target.value)}
                  className={INPUT_STYLES.select}
                >
                  <option value="" className={INPUT_STYLES.selectPlaceholder}>Responsables</option>
                  {Array.isArray(users) && users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <select
                  value={filtros.estado}
                  onChange={(e) => handleFiltroChange('estado', e.target.value)}
                  className={INPUT_STYLES.select}
                >
                  <option value="" className={INPUT_STYLES.selectPlaceholder}>Estados</option>
                  {Array.isArray(opcionesFiltros.estados) && opcionesFiltros.estados.map(estado => (
                    <option key={estado} value={estado}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Rango de Fechas */}
            <div className="md:col-span-4 lg:col-span-2 xl:col-span-2 w-full">
              <div className={RANGE_STYLES.container}>
                <div className={RANGE_STYLES.wrapper}>
                  <div className={RANGE_STYLES.labelSection}>
                    <svg className={RANGE_STYLES.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className={RANGE_STYLES.labelText}>Rango de Fechas</span>
                  </div>
                  <div className={RANGE_STYLES.inputsWrapper}>
                    <input
                      type="date"
                      value={filtros.fechaInicio}
                      onChange={(e) => handleFiltroChange('fechaInicio', e.target.value)}
                      className={RANGE_STYLES.input}
                    />
                    <span className={RANGE_STYLES.separator}>-</span>
                    <input
                      type="date"
                      value={filtros.fechaFin}
                      onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                      className={RANGE_STYLES.input}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={LAYOUT_STYLES.gridButtons}>
            {/* Botón limpiar filtros */}
            <button
              type="button"
              onClick={limpiarFiltros}
              className={BUTTON_STYLES.filter.clear}
            >
              <svg className={ICON_STYLES.medium} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Lista de Reparaciones */}
        <div className={`${CONTAINER_STYLES.card} overflow-hidden`}>
          <div className={`${CONTAINER_STYLES.cardPadding} border-b border-gray-200`}>
            <div className={LAYOUT_STYLES.flexBetween}>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Reparaciones ({paginacion.totalItems || reparaciones.length})</h3>
                <p className={TEXT_STYLES.subtitle}>Ordenadas por fecha descendente</p>
              </div>
              {loading && (
                <div className={TEXT_STYLES.loading}>
                  <svg className={`${ICON_STYLES.small} ${ICON_STYLES.spin}`} fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                  </svg>
                  Cargando...
                </div>
              )}
            </div>
          </div>

          {/* Lista con overflow controlado */}
          <div className={`${LIST_STYLES.divider} overflow-x-hidden`}>
            {reparaciones.length === 0 ? (
              <div className={LIST_STYLES.emptyState}>
                No hay reparaciones que coincidan con los filtros
              </div>
            ) : (
              reparaciones.map((reparacion) => (
                <div key={reparacion.id} className={LIST_STYLES.item}>
                  <div className={`${LIST_STYLES.itemContent} list-item-content`}>
                    <div className="flex-1">
                      <div className={LIST_STYLES.itemHeader}>
                        <h3 className={TEXT_STYLES.itemTitle}>
                          {reparacion.maquinaria?.nombre || 'Maquinaria no especificada'}
                        </h3>
                        <div className={LIST_STYLES.itemActions}>
                          <button
                            onClick={() => navigate(`/reparaciones/${reparacion.id}`)}
                            className={`${BUTTON_STYLES.edit} bg-gray-50 hover:bg-gray-100 text-gray-700 mr-2`}
                            title="Ver detalles"
                          >
                            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openEditModal(reparacion)}
                            className={BUTTON_STYLES.edit}
                            title="Editar reparación"
                          >
                            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {reparacion.descripcion && (
                        <div className={LIST_STYLES.itemDescription}>
                          {reparacion.descripcion}
                        </div>
                      )}
                      <div className={LIST_STYLES.itemTagsRow}>
                        <div className={`${LIST_STYLES.itemTagsLeft} tags-container-mobile`}>
                          <span className={`${LIST_STYLES.itemTag} bg-gray-100 text-gray-700`} title={formatFecha(reparacion.fecha)}>
                            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="tag-truncate">{formatFecha(reparacion.fecha)}</span>
                          </span>
                          
                          <span className={`${LIST_STYLES.itemTag} ${getEstadoReparacionColorClass(reparacion.estado)}`}>
                            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {reparacion.estado?.charAt(0).toUpperCase() + reparacion.estado?.slice(1).replace('_', ' ')}
                          </span>

                          {reparacion.prioridad && (
                            <span className={`${LIST_STYLES.itemTag} ${getPrioridadColorClass(reparacion.prioridad)}`}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {reparacion.prioridad.charAt(0).toUpperCase() + reparacion.prioridad.slice(1)}
                            </span>
                          )}

                          {reparacion.user && (
                            <span className={`${LIST_STYLES.itemTag} bg-blue-100 text-blue-700`} title={reparacion.user.name}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="tag-truncate">{reparacion.user.name}</span>
                            </span>
                          )}

                          {reparacion.repuestos && reparacion.repuestos.length > 0 && (
                            <span className={`${LIST_STYLES.itemTag} bg-orange-100 text-orange-700`} title={formatRepuestosUsados(reparacion.repuestos)}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              <span className="tag-truncate">{reparacion.repuestos.length} repuestos</span>
                            </span>
                          )}

                          {reparacion.costo && reparacion.costo > 0 && (
                            <span className={`${LIST_STYLES.itemTag} bg-green-100 text-green-700`}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              ${Number(reparacion.costo).toLocaleString()}
                            </span>
                          )}

                          {diasDesdeReparacion(reparacion.fecha) <= 7 && (
                            <span className={`${LIST_STYLES.itemTag} bg-red-100 text-red-700`}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Hace {diasDesdeReparacion(reparacion.fecha)} días
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Paginación */}
          {paginacion.total > 1 && (
            <div className="border-t border-gray-200 bg-gray-50 py-3">
              <div className="px-4 sm:px-6">
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePaginacion(paginacion.current - 1)}
                    disabled={paginacion.current <= 1}
                    className={`${BUTTON_STYLES.pagination.base} ${
                      paginacion.current <= 1 
                        ? BUTTON_STYLES.pagination.disabled 
                        : BUTTON_STYLES.pagination.enabled
                    }`}
                  >
                    <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <div className="px-3 py-1 bg-white border border-gray-200 rounded-md">
                    <span className="text-xs font-medium text-gray-700">
                      {paginacion.current}/{paginacion.total}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handlePaginacion(paginacion.current + 1)}
                    disabled={paginacion.current >= paginacion.total}
                    className={`${BUTTON_STYLES.pagination.base} ${
                      paginacion.current >= paginacion.total 
                        ? BUTTON_STYLES.pagination.disabled 
                        : BUTTON_STYLES.pagination.enabled
                    }`}
                  >
                    <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de agregar reparación */}
        {showAddModal && (
          <div className={MODAL_STYLES.overlay}>
            <div className={MODAL_STYLES.container}>
              <div className={MODAL_STYLES.content}>
                <div className={MODAL_STYLES.header}>
                  <h2 className={MODAL_STYLES.title}>Nueva Reparación</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className={MODAL_STYLES.closeButton}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className={MODAL_STYLES.form}>
                  <div className={LAYOUT_STYLES.gridForm}>
                    <div>
                      <label className={INPUT_STYLES.label}>Fecha *</label>
                      <input
                        type="date"
                        value={form.fecha}
                        onChange={(e) => setForm({...form, fecha: e.target.value})}
                        className={INPUT_STYLES.base}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={INPUT_STYLES.label}>Maquinaria *</label>
                      <select
                        value={form.maquinariaId}
                        onChange={(e) => setForm({...form, maquinariaId: e.target.value})}
                        className={INPUT_STYLES.base}
                        required
                      >
                        <option value="">Seleccionar maquinaria</option>
                        {Array.isArray(maquinarias) && maquinarias.map(maquinaria => (
                          <option key={maquinaria.id} value={maquinaria.id}>
                            {maquinaria.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className={INPUT_STYLES.label}>Responsable *</label>
                      <select
                        value={form.userId}
                        onChange={(e) => setForm({...form, userId: e.target.value})}
                        className={INPUT_STYLES.base}
                        required
                      >
                        <option value="">Seleccionar responsable</option>
                        {Array.isArray(users) && users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className={INPUT_STYLES.label}>Estado</label>
                      <select
                        value={form.estado}
                        onChange={(e) => setForm({...form, estado: e.target.value})}
                        className={INPUT_STYLES.base}
                      >
                        {Array.isArray(opcionesFiltros.estados) && opcionesFiltros.estados.map(estado => (
                          <option key={estado} value={estado}>
                            {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className={INPUT_STYLES.label}>Prioridad</label>
                      <select
                        value={form.prioridad}
                        onChange={(e) => setForm({...form, prioridad: e.target.value})}
                        className={INPUT_STYLES.base}
                      >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                        <option value="critica">Crítica</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className={INPUT_STYLES.label}>Duración Estimada (horas)</label>
                      <input
                        type="number"
                        value={form.duracionEstimada}
                        onChange={(e) => setForm({...form, duracionEstimada: e.target.value})}
                        className={INPUT_STYLES.base}
                        min="0"
                        step="0.5"
                      />
                    </div>
                    
                    <div>
                      <label className={INPUT_STYLES.label}>Costo Estimado</label>
                      <input
                        type="number"
                        value={form.costo}
                        onChange={(e) => setForm({...form, costo: e.target.value})}
                        className={INPUT_STYLES.base}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className={INPUT_STYLES.label}>Descripción</label>
                      <textarea
                        value={form.descripcion}
                        onChange={(e) => setForm({...form, descripcion: e.target.value})}
                        className={INPUT_STYLES.base}
                        rows={3}
                        placeholder="Describe el problema o trabajo a realizar..."
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
                          {Array.isArray(repuestos) && repuestos.map(repuesto => (
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

                  {error && (
                    <div className={ALERT_STYLES.errorModal}>
                      {error}
                    </div>
                  )}

                  <div className={MODAL_STYLES.buttonGroup}>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className={BUTTON_STYLES.secondary}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={BUTTON_STYLES.primary}
                    >
                      Crear Reparación
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edición */}
        {selectedReparacion && (
          <ReparacionEditModal
            reparacion={selectedReparacion}
            onClose={closeEditModal}
            onUpdate={handleUpdateReparacion}
            onDelete={handleDeleteReparacion}
            token={token}
          />
        )}
      </div>
    </div>
  );
}

export default ReparacionForm;
