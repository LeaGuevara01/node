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
  formatFechaCorta,
  formatDateForInput,
  diasDesdeReparacion,
  formatRepuestosUsados,
  isValidDate,
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
    userId: ''
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
    repuestoId: '',
    fechaInicio: '',
    fechaFin: ''
  });
  const [opcionesFiltros, setOpcionesFiltros] = useState({
    maquinarias: [],
    usuarios: []
  });
  const [paginacion, setPaginacion] = useState({
    current: 1,
    total: 1,
    totalItems: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Estados para filtros de formulario
  const [maquinariaFilter, setMaquinariaFilter] = useState({
    search: '',
    categoria: '',
    ubicacion: '',
    estado: ''
  });
  const [repuestoFilter, setRepuestoFilter] = useState({
    search: '',
    categoria: '',
    ubicacion: '',
    minStock: ''
  });
  const [showMaquinariaFilter, setShowMaquinariaFilter] = useState(false);
  const [showRepuestoFilter, setShowRepuestoFilter] = useState(false);
  const [filteredMaquinarias, setFilteredMaquinarias] = useState([]);
  const [filteredRepuestos, setFilteredRepuestos] = useState([]);

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
      
      if (data.data) {
        // Nueva estructura de respuesta con paginación
        const reparacionesOrdenadas = sortReparacionesByDate(data.data);
        setReparaciones(reparacionesOrdenadas);
        setPaginacion(data.pagination || { current: 1, total: 1, totalItems: 0 });
      } else if (data.reparaciones) {
        // Estructura antigua como respaldo
        const reparacionesOrdenadas = sortReparacionesByDate(data.reparaciones);
        setReparaciones(reparacionesOrdenadas);
        setPaginacion(data.pagination || { current: 1, total: 1, totalItems: 0 });
      } else if (Array.isArray(data)) {
        // Respuesta directa como array
        const reparacionesOrdenadas = sortReparacionesByDate(data);
        setReparaciones(reparacionesOrdenadas);
        setPaginacion({ current: 1, total: 1, totalItems: data.length });
      } else {
        setReparaciones([]);
        setPaginacion({ current: 1, total: 1, totalItems: 0 });
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
          usuarios
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
        getMaquinarias(token, {}, 1, true), // Usar forStats=true para obtener todas las maquinarias
        getRepuestos(token)
      ]);
      
      setUsers(Array.isArray(usersData) ? usersData : []);
      setMaquinarias(Array.isArray(maquinariasData) ? maquinariasData : []);
      setRepuestos(Array.isArray(repuestosData) ? repuestosData : []);
      setFilteredMaquinarias(Array.isArray(maquinariasData) ? maquinariasData : []);
      setFilteredRepuestos(Array.isArray(repuestosData) ? repuestosData : []);
    } catch (err) {
      console.error('Error al cargar datos del formulario:', err);
      // Ensure arrays remain as arrays even on error
      setUsers([]);
      setMaquinarias([]);
      setRepuestos([]);
      setFilteredMaquinarias([]);
      setFilteredRepuestos([]);
    }
  };

  // Función para filtrar maquinarias
  const filterMaquinarias = (filter) => {
    let filtered = [...maquinarias];
    
    if (filter.search) {
      filtered = filtered.filter(m => 
        m.nombre?.toLowerCase().includes(filter.search.toLowerCase()) ||
        m.modelo?.toLowerCase().includes(filter.search.toLowerCase())
      );
    }
    
    if (filter.categoria) {
      filtered = filtered.filter(m => 
        m.categoria?.toLowerCase().includes(filter.categoria.toLowerCase())
      );
    }
    
    if (filter.ubicacion) {
      filtered = filtered.filter(m => 
        m.ubicacion?.toLowerCase().includes(filter.ubicacion.toLowerCase())
      );
    }
    
    if (filter.estado) {
      filtered = filtered.filter(m => 
        m.estado?.toLowerCase().includes(filter.estado.toLowerCase())
      );
    }
    
    setFilteredMaquinarias(filtered);
  };

  // Función para filtrar repuestos
  const filterRepuestos = (filter) => {
    let filtered = [...repuestos];
    
    if (filter.search) {
      filtered = filtered.filter(r => 
        r.nombre?.toLowerCase().includes(filter.search.toLowerCase()) ||
        r.codigo?.toLowerCase().includes(filter.search.toLowerCase())
      );
    }
    
    if (filter.categoria) {
      filtered = filtered.filter(r => 
        r.categoria?.toLowerCase().includes(filter.categoria.toLowerCase())
      );
    }
    
    if (filter.ubicacion) {
      filtered = filtered.filter(r => 
        r.ubicacion?.toLowerCase().includes(filter.ubicacion.toLowerCase())
      );
    }
    
    if (filter.minStock) {
      const minStock = parseInt(filter.minStock);
      if (!isNaN(minStock)) {
        filtered = filtered.filter(r => r.stock >= minStock);
      }
    }
    
    setFilteredRepuestos(filtered);
  };

  const handleMaquinariaFilterChange = (field, value) => {
    const newFilter = { ...maquinariaFilter, [field]: value };
    setMaquinariaFilter(newFilter);
    filterMaquinarias(newFilter);
  };

  const handleRepuestoFilterChange = (field, value) => {
    const newFilter = { ...repuestoFilter, [field]: value };
    setRepuestoFilter(newFilter);
    filterRepuestos(newFilter);
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
        fecha: form.fecha,
        maquinariaId: Number(form.maquinariaId),
        descripcion: form.descripcion || null,
        userId: Number(form.userId),
        repuestos: selectedRepuestos
      };
      
      await createReparacion(reparacionData, token);
      setForm({
        fecha: formatDateForInput(new Date()),
        maquinariaId: '',
        descripcion: '',
        userId: ''
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
    if (!token) {
      return;
    }
    
    fetchReparaciones();
    fetchOpcionesFiltros();
    fetchFormData();
  }, [token]);

  // Effect para actualizar filtros cuando cambian las maquinarias
  useEffect(() => {
    if (maquinarias.length > 0) {
      filterMaquinarias(maquinariaFilter);
    }
  }, [maquinarias]);

  // Effect para actualizar filtros cuando cambian los repuestos
  useEffect(() => {
    if (repuestos.length > 0) {
      filterRepuestos(repuestoFilter);
    }
  }, [repuestos]);

  return (
    <div className={CONTAINER_STYLES.main}>
      <div className={CONTAINER_STYLES.maxWidth}>
        
        {/* Header con botones de acción */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <div className={LAYOUT_STYLES.flexBetween}>
            <div>
              <h1 className={TEXT_STYLES.title}>Gestión de Reparaciones</h1>
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
            <div className={LAYOUT_STYLES.filterSpan}>
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
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
                  {Array.isArray(maquinarias) && maquinarias.length > 0 ? (
                    maquinarias.map(maquinaria => (
                      <option key={maquinaria.id} value={maquinaria.id}>
                        {maquinaria.nombre} - {maquinaria.modelo || 'Sin modelo'}
                      </option>
                    ))
                  ) : (
                    <option disabled>No hay maquinarias</option>
                  )}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Usuario */}
            <div className={LAYOUT_STYLES.filterSpan}>
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
                    <option key={user.id} value={user.id}>{user.username}</option>
                  ))}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Componentes/Repuestos */}
            <div className={LAYOUT_STYLES.filterSpan}>
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <select
                  value={filtros.repuestoId}
                  onChange={(e) => handleFiltroChange('repuestoId', e.target.value)}
                  className={INPUT_STYLES.select}
                >
                  <option value="" className={INPUT_STYLES.selectPlaceholder}>Componentes</option>
                  {Array.isArray(repuestos) && repuestos.length > 0 ? (
                    repuestos.map(repuesto => (
                      <option key={repuesto.id} value={repuesto.id}>
                        {repuesto.nombre}{repuesto.codigo ? ` - ${repuesto.codigo}` : ''}
                      </option>
                    ))
                  ) : (
                    <option disabled>No hay componentes</option>
                  )}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Rango de Fechas */}
            <div className={LAYOUT_STYLES.rangeSpan}>
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
                      placeholder="Desde"
                      title="Desde"
                    />
                    <span className={RANGE_STYLES.separator}>-</span>
                    <input
                      type="date"
                      value={filtros.fechaFin}
                      onChange={(e) => handleFiltroChange('fechaFin', e.target.value)}
                      className={RANGE_STYLES.input}
                      placeholder="Hasta"
                      title="Hasta"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botón limpiar filtros extendido */}
          <div className="mt-6">
            <button
              type="button"
              onClick={limpiarFiltros}
              className={`${BUTTON_STYLES.filter.clear} w-full`}
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
                            <span className="tag-truncate hidden sm:inline">{formatFecha(reparacion.fecha)}</span>
                            <span className="tag-truncate sm:hidden">{formatFechaCorta(reparacion.fecha)}</span>
                          </span>

                          {reparacion.usuario && (
                            <span className={`${LIST_STYLES.itemTag} bg-blue-100 text-blue-700`} title={reparacion.usuario.username}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span className="tag-truncate">{reparacion.usuario.username}</span>
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

                          {diasDesdeReparacion(reparacion.fecha) <= 7 && (
                            <span className={`${LIST_STYLES.itemTag} bg-red-100 text-red-700 hidden sm:flex`}>
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
                      <div className="space-y-2">
                        {/* Botón para mostrar/ocultar filtros */}
                        <button
                          type="button"
                          onClick={() => setShowMaquinariaFilter(!showMaquinariaFilter)}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100"
                        >
                          <span>Filtrar maquinarias ({filteredMaquinarias.length} disponibles)</span>
                          <svg className={`w-4 h-4 transform ${showMaquinariaFilter ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* Panel de filtros */}
                        {showMaquinariaFilter && (
                          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md space-y-2">
                            <input
                              type="text"
                              placeholder="Buscar por nombre o modelo..."
                              value={maquinariaFilter.search}
                              onChange={(e) => handleMaquinariaFilterChange('search', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                placeholder="Categoría"
                                value={maquinariaFilter.categoria}
                                onChange={(e) => handleMaquinariaFilterChange('categoria', e.target.value)}
                                className="px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <input
                                type="text"
                                placeholder="Ubicación"
                                value={maquinariaFilter.ubicacion}
                                onChange={(e) => handleMaquinariaFilterChange('ubicacion', e.target.value)}
                                className="px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <input
                                type="text"
                                placeholder="Estado"
                                value={maquinariaFilter.estado}
                                onChange={(e) => handleMaquinariaFilterChange('estado', e.target.value)}
                                className="px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                            </div>
                          </div>
                        )}
                        
                        <select
                          value={form.maquinariaId}
                          onChange={(e) => setForm({...form, maquinariaId: e.target.value})}
                          className={INPUT_STYLES.base}
                          required
                        >
                          <option value="">Seleccionar maquinaria</option>
                          {filteredMaquinarias.map(maquinaria => (
                            <option key={maquinaria.id} value={maquinaria.id}>
                              {maquinaria.nombre} - {maquinaria.modelo || 'Sin modelo'} 
                              {maquinaria.categoria && ` (${maquinaria.categoria})`}
                            </option>
                          ))}
                        </select>
                      </div>
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
                            {user.username}
                          </option>
                        ))}
                      </select>
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
                        {/* Botón para mostrar/ocultar filtros de repuestos */}
                        <button
                          type="button"
                          onClick={() => setShowRepuestoFilter(!showRepuestoFilter)}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100"
                        >
                          <span>Filtrar repuestos ({filteredRepuestos.length} disponibles)</span>
                          <svg className={`w-4 h-4 transform ${showRepuestoFilter ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* Panel de filtros de repuestos */}
                        {showRepuestoFilter && (
                          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md space-y-2">
                            <input
                              type="text"
                              placeholder="Buscar por nombre o código..."
                              value={repuestoFilter.search}
                              onChange={(e) => handleRepuestoFilterChange('search', e.target.value)}
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <div className="grid grid-cols-4 gap-2">
                              <input
                                type="text"
                                placeholder="Categoría"
                                value={repuestoFilter.categoria}
                                onChange={(e) => handleRepuestoFilterChange('categoria', e.target.value)}
                                className="px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <input
                                type="text"
                                placeholder="Ubicación"
                                value={repuestoFilter.ubicacion}
                                onChange={(e) => handleRepuestoFilterChange('ubicacion', e.target.value)}
                                className="px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <input
                                type="number"
                                placeholder="Stock mínimo"
                                value={repuestoFilter.minStock}
                                onChange={(e) => handleRepuestoFilterChange('minStock', e.target.value)}
                                className="px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setRepuestoFilter({ search: '', categoria: '', ubicacion: '', minStock: '' });
                                  setFilteredRepuestos(repuestos);
                                }}
                                className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                              >
                                Limpiar
                              </button>
                            </div>
                          </div>
                        )}
                        
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
                          {filteredRepuestos.map(repuesto => (
                            <option key={repuesto.id} value={repuesto.id}>
                              {repuesto.nombre} 
                              {repuesto.codigo && ` (${repuesto.codigo})`}
                              {repuesto.categoria && ` - ${repuesto.categoria}`}
                              - Stock: {repuesto.stock}
                              {repuesto.ubicacion && ` - ${repuesto.ubicacion}`}
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
            item={selectedReparacion}
            onClose={closeEditModal}
            onSave={(data) => handleUpdateReparacion(data.id, data)}
            onDelete={handleDeleteReparacion}
            users={users}
            maquinarias={maquinarias}
            repuestos={repuestos}
          />
        )}
      </div>
    </div>
  );
}

export default ReparacionForm;
