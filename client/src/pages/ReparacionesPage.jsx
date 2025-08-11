// client/src/pages/ReparacionesPage.jsx
// Página: Reparaciones
// Rol: listado con filtros por fechas/entidades y acceso a detalles

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getReparaciones, 
  getReparacionFilters, 
  createReparacion, 
  updateReparacion, 
  deleteReparacion 
} from '../services/api';
import ReparacionEditModal from '../components/ReparacionEditModal';
import BaseListPage from '../components/shared/BaseListPage';
import { useAdvancedFilters } from '../hooks/useAdvancedFilters.jsx';
import { usePagination } from '../hooks/usePagination';
import { REPARACION_FILTERS_CONFIG } from '../config/filtersConfig';
import { getColorFromString } from '../utils/colorUtils';
import { 
  BUTTON_STYLES, 
  ICON_STYLES,
  LIST_STYLES
} from '../styles/repuestoStyles';
import AppLayout from '../components/navigation/AppLayout';

function ReparacionesPage({ token, role, onLogout, onCreated }) {
  const navigate = useNavigate();
  
  // Estados principales
  const [reparaciones, setReparaciones] = useState([]);
  const [selectedReparacion, setSelectedReparacion] = useState(null);
  const [error, setError] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');

  // Hook de paginación
  const { 
    paginacion, 
    loading, 
    setLoading, 
    handlePaginacion, 
    actualizarPaginacion 
  } = usePagination({ limit: 20 });

  /**
   * Carga las reparaciones con filtros aplicados
   */
  const fetchReparaciones = async (filtrosActuales = {}, pagina = 1) => {
    setLoading(true);
    try {
      const data = await getReparaciones(token, filtrosActuales, pagina);
      const items = data.reparaciones || data.data || (Array.isArray(data) ? data : []);
      setReparaciones(Array.isArray(items) ? items : []);
      actualizarPaginacion(data.pagination || { current: pagina, total: 1, totalItems: Array.isArray(items) ? items.length : 0, limit: 20 });
      setError('');
    } catch (err) {
      console.error('Error al cargar reparaciones:', err);
      setReparaciones([]);
      setError('Error al cargar reparaciones: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga las opciones de filtros
   */
  const fetchOpcionesFiltros = async () => {
    try {
      const data = await getReparacionFilters(token);
      return data;
    } catch (err) {
      console.error('Error al cargar opciones de filtros:', err);
      return {};
    }
  };

  // Hook de filtros avanzados
  const {
    filtrosTemporales,
    tokensActivos,
    filtrosConsolidados,
    opcionesFiltros,
    handleFiltroChange,
    aplicarFiltrosActuales,
    removerToken,
    limpiarTodosFiltros,
    cargarOpcionesFiltros
  } = useAdvancedFilters({}, fetchReparaciones, fetchOpcionesFiltros);

  /**
   * Maneja la carga masiva de CSV
   */
  const handleFileUpload = async (csvData) => {
    const validRows = csvData.filter(row => row.descripcion);
    let successCount = 0, failCount = 0;
    
    for (const row of validRows) {
      try {
        await createReparacion({
          descripcion: row.descripcion || '',
          tipo: row.tipo || '',
          estado: row.estado || 'Pendiente',
          prioridad: row.prioridad || 'Media',
          fecha_inicio: row.fecha_inicio || new Date().toISOString().split('T')[0],
          fecha_estimada: row.fecha_estimada || '',
          costo_estimado: row.costo_estimado ? Number(row.costo_estimado) : 0,
          maquinaria_id: row.maquinaria_id ? Number(row.maquinaria_id) : null,
          tecnico: row.tecnico || '',
          notas: row.notas || ''
        }, token);
        successCount++;
      } catch (err) {
        console.error('Error creating reparacion:', err);
        failCount++;
      }
    }
    
    setBulkSuccess(`Creadas: ${successCount}`);
    setBulkError(failCount ? `Fallidas: ${failCount}` : '');
    
    if (successCount > 0) {
      if (onCreated) onCreated();
      fetchReparaciones(filtrosConsolidados, 1);
      cargarOpcionesFiltros();
    }
  };

  /**
   * Abre modal de edición
   */
  const openEditModal = (reparacion) => {
    setSelectedReparacion(reparacion);
  };

  /**
   * Cierra modal de edición
   */
  const closeEditModal = () => {
    setSelectedReparacion(null);
  };

  /**
   * Navega a la vista de detalles
   */
  const handleView = (reparacion) => {
    navigate(`/reparaciones/${reparacion.id}`);
  };

  /**
   * Actualiza una reparación
   */
  const handleUpdateReparacion = async (id, reparacionData) => {
    try {
      await updateReparacion(id, reparacionData, token);
      fetchReparaciones(filtrosConsolidados, paginacion.current);
      cargarOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al actualizar: ' + err.message);
    }
  };

  /**
   * Elimina una reparación
   */
  const handleDeleteReparacion = async (id) => {
    try {
      await deleteReparacion(id, token);
      fetchReparaciones(filtrosConsolidados, paginacion.current);
      cargarOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  const getEstadoBadge = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'en_progreso':
      case 'en progreso':
        return 'bg-blue-100 text-blue-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadBadge = (prioridad) => {
    switch (prioridad?.toLowerCase()) {
      case 'alta':
        return 'bg-red-100 text-red-800';
      case 'media':
        return 'bg-yellow-100 text-yellow-800';
      case 'baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Renderiza un elemento de reparación
   */
  const renderReparacion = (reparacion) => {
    const titulo = (
      reparacion.descripcion?.trim() ||
      [reparacion.maquinaria?.nombre, reparacion.maquinaria?.modelo].filter(Boolean).join(' ') ||
      `Reparación #${reparacion.id}`
    );
    const fechaStr = reparacion.fecha ? new Date(reparacion.fecha).toLocaleDateString() : '';
    const responsable = reparacion.usuario?.username || reparacion.tecnico || '';
    const repuestosCount = Array.isArray(reparacion.repuestos) ? reparacion.repuestos.length : 0;

    return (
      <>
        <div className={LIST_STYLES.itemHeader}>
          <div className="flex items-start gap-2 min-w-0">
            <h3 className={`${LIST_STYLES.itemTitle} truncate`} title={titulo}>{titulo}</h3>
            {reparacion.estado && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoBadge(reparacion.estado)}`}>
                {reparacion.estado}
              </span>
            )}
          </div>
          {/* Acciones en header de detalles; fila clickeable abre detalles */}
        </div>

        {/* Meta compacta visible también en móviles */}
        <div className="mt-1 text-xs sm:text-sm text-gray-600 flex flex-wrap gap-x-3 gap-y-1">
          {reparacion.maquinaria && (
            <span className="inline-flex items-center gap-1" title="Maquinaria">
              <svg className={ICON_STYLES.xs} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h10M5 7h14"/></svg>
              <span className="truncate max-w-[10rem] sm:max-w-[16rem]">{[reparacion.maquinaria?.nombre, reparacion.maquinaria?.modelo].filter(Boolean).join(' ')}</span>
            </span>
          )}
          {responsable && (
            <span className="inline-flex items-center gap-1" title="Responsable">
              <svg className={ICON_STYLES.xs} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <span className="truncate max-w-[8rem] sm:max-w-[12rem]">{responsable}</span>
            </span>
          )}
          {fechaStr && (
            <span className="inline-flex items-center gap-1" title="Fecha">
              <svg className={ICON_STYLES.xs} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {fechaStr}
            </span>
          )}
          {repuestosCount > 0 && (
            <span className="inline-flex items-center gap-1" title="Repuestos usados">
              <svg className={ICON_STYLES.xs} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3l.75 4.5L6 9l4.5.75L9.75 15l2.25-3.75L14.25 15l-.75-4.5L18 9l-4.5-.75L14.25 3 12 6.75 9.75 3z"/></svg>
              {repuestosCount} repuesto{repuestosCount !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {reparacion.notas && (
          <div className={`${LIST_STYLES.itemDescription} mt-2`}>{reparacion.notas}</div>
        )}

        <div className={LIST_STYLES.itemTagsRow}>
          <div className={`${LIST_STYLES.itemTagsLeft} tags-container-mobile`}>
            {reparacion.tipo && (
              <span className={`${LIST_STYLES.itemTagCategory} ${getColorFromString(reparacion.tipo, 'tipo')}`} title={reparacion.tipo}>
                <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="tag-truncate">{reparacion.tipo}</span>
              </span>
            )}
            {reparacion.prioridad && (
              <span className={`${LIST_STYLES.itemTag} ${getPrioridadBadge(reparacion.prioridad)}`}>
                <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {reparacion.prioridad}
              </span>
            )}
            {fechaStr && (
              <span className={`${LIST_STYLES.itemTag} bg-gray-100 text-gray-700`}>
                <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {fechaStr}
              </span>
            )}
          </div>
          <div className={LIST_STYLES.itemTagsRight}>
            {typeof reparacion.costo_estimado === 'number' && (
              <span className={`${LIST_STYLES.itemTag} bg-green-100 text-green-800`}>
                ${reparacion.costo_estimado.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </>
    );
  };

  // Efectos
  useEffect(() => {
    fetchReparaciones();
    cargarOpcionesFiltros();
  }, []);

  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Reparaciones' }
  ];

  return (
    <AppLayout
      currentSection="reparaciones"
      breadcrumbs={breadcrumbs}
      title="Gestión de Reparaciones"
      subtitle="Administra órdenes de trabajo y mantenimiento"
      token={token}
      role={role}
      onLogout={onLogout}
    >
      <BaseListPage
        title="Listado de Reparaciones"
        subtitle="Gestiona y filtra todas las reparaciones del sistema"
        entityName="Reparación"
        entityNamePlural="Reparaciones"
        createRoute="/reparaciones/formulario"
  showCsvUpload={false}
        
        items={reparaciones}
        loading={loading}
        error={error}
        
        filtrosTemporales={filtrosTemporales}
        handleFiltroChange={handleFiltroChange}
        aplicarFiltrosActuales={aplicarFiltrosActuales}
        limpiarTodosFiltros={limpiarTodosFiltros}
        tokensActivos={tokensActivos}
        removerToken={removerToken}
        opcionesFiltros={opcionesFiltros}
        camposFiltros={REPARACION_FILTERS_CONFIG(opcionesFiltros)}
        
        paginacion={paginacion}
        handlePaginacion={(pagina) => fetchReparaciones(filtrosConsolidados, pagina)}
        
  onItemClick={(item) => navigate(`/reparaciones/${item.id}`)}
  onFileUpload={undefined}
        bulkError={bulkError}
        setBulkError={setBulkError}
        bulkSuccess={bulkSuccess}
        setBulkSuccess={setBulkSuccess}
        
        renderItem={renderReparacion}
      />

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
  </AppLayout>
  );
}

export default ReparacionesPage;
