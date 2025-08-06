// Página dedicada para el listado y gestión de maquinarias
// Refactorizada usando componentes modulares

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMaquinaria, getMaquinarias, getMaquinariaFilters, updateMaquinaria, deleteMaquinaria } from '../services/api';
import MaquinariaEditModal from '../components/MaquinariaEditModal';
import EstadoIcon from '../components/EstadoIcon';
import BaseListPage from '../components/shared/BaseListPage';
import { useAdvancedFilters } from '../hooks/useAdvancedFilters';
import { usePagination } from '../hooks/usePagination';
import { MAQUINARIA_FILTERS_CONFIG } from '../config/filtersConfig';
import { getColorFromString } from '../utils/colorUtils';
import { sortMaquinariasByCategory, getEstadoColorClass, formatAnio } from '../utils/maquinariaUtils';
import { 
  BUTTON_STYLES, 
  ICON_STYLES,
  LIST_STYLES
} from '../styles/repuestoStyles';

function MaquinariasPage({ token, onCreated }) {
  const navigate = useNavigate();
  
  // Estados principales
  const [maquinarias, setMaquinarias] = useState([]);
  const [selectedMaquinaria, setSelectedMaquinaria] = useState(null);
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
   * Carga las maquinarias con filtros aplicados
   */
  const fetchMaquinarias = async (filtrosActuales = {}, pagina = 1) => {
    setLoading(true);
    try {
      console.log('Fetching maquinarias with consolidated filters:', filtrosActuales, 'page:', pagina);

      const data = await getMaquinarias(token, filtrosActuales, pagina);
      console.log('API Response:', data);
      
      if (data.maquinarias) {
        const maquinariasOrdenadas = sortMaquinariasByCategory(data.maquinarias);
        setMaquinarias(maquinariasOrdenadas);
        actualizarPaginacion(data.pagination || { current: 1, total: 1, totalItems: 0, limit: 20 });
      } else {
        // Respuesta legacy sin paginación
        const maquinariasOrdenadas = sortMaquinariasByCategory(data || []);
        setMaquinarias(maquinariasOrdenadas);
        actualizarPaginacion({ current: 1, total: 1, totalItems: maquinariasOrdenadas.length, limit: 20 });
      }
      setError('');
    } catch (err) {
      console.error('Error al cargar maquinarias:', err);
      setMaquinarias([]);
      setError('Error al cargar maquinarias: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga las opciones de filtros
   */
  const fetchOpcionesFiltros = async () => {
    try {
      const data = await getMaquinariaFilters(token);
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
  } = useAdvancedFilters({}, fetchMaquinarias, fetchOpcionesFiltros);

  /**
   * Maneja la carga masiva de CSV
   */
  const handleFileUpload = async (csvData) => {
    const validRows = csvData.filter(row => row.nombre && row.modelo && row.categoria);
    let successCount = 0, failCount = 0;
    
    for (const row of validRows) {
      try {
        await createMaquinaria({
          nombre: row.nombre || '',
          modelo: row.modelo || '',
          categoria: row.categoria || '',
          anio: row.anio ? Number(row.anio) : null,
          numero_serie: row.numero_serie || '',
          descripcion: row.descripcion || '',
          proveedor: row.proveedor || '',
          ubicacion: row.ubicacion || '',
          estado: row.estado || ''
        }, token);
        successCount++;
      } catch (err) {
        console.error('Error creating maquinaria:', err);
        failCount++;
      }
    }
    
    setBulkSuccess(`Creadas: ${successCount}`);
    setBulkError(failCount ? `Fallidas: ${failCount}` : '');
    
    if (successCount > 0) {
      if (onCreated) onCreated();
      fetchMaquinarias(filtrosConsolidados, 1);
      cargarOpcionesFiltros();
    }
  };

  /**
   * Abre modal de edición
   */
  const openEditModal = (maquinaria) => {
    setSelectedMaquinaria(maquinaria);
  };

  /**
   * Cierra modal de edición
   */
  const closeEditModal = () => {
    setSelectedMaquinaria(null);
  };

  /**
   * Navega a la vista de detalles
   */
  const handleView = (maquinaria) => {
    navigate(`/maquinarias/${maquinaria.id}`);
  };

  /**
   * Actualiza una maquinaria
   */
  const handleUpdateMaquinaria = async (id, maquinariaData) => {
    try {
      await updateMaquinaria({ ...maquinariaData, id }, token);
      fetchMaquinarias(filtrosConsolidados, paginacion.current);
      cargarOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al actualizar: ' + err.message);
    }
  };

  /**
   * Elimina una maquinaria
   */
  const handleDeleteMaquinaria = async (id) => {
    try {
      await deleteMaquinaria(id, token);
      fetchMaquinarias(filtrosConsolidados, paginacion.current);
      cargarOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  /**
   * Renderiza un elemento de maquinaria
   */
  const renderMaquinaria = (maquinaria) => (
    <>
      <div className={LIST_STYLES.itemHeader}>
        <div className="flex items-center gap-2">
          <h3 className={LIST_STYLES.itemTitle}>{maquinaria.nombre}</h3>
          <span className={`hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColorClass(maquinaria.estado)}`}>
            <EstadoIcon estado={maquinaria.estado} className="w-3 h-3" />
            <span className="ml-1">{maquinaria.estado || 'Sin estado'}</span>
          </span>
        </div>
        <div className={LIST_STYLES.itemActions}>
          <button
            onClick={() => handleView(maquinaria)}
            className={`${BUTTON_STYLES.edit} bg-gray-50 hover:bg-gray-100 text-gray-700 mr-2`}
            title="Ver detalles"
          >
            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => openEditModal(maquinaria)}
            className={BUTTON_STYLES.edit}
            title="Editar maquinaria"
          >
            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>
      {maquinaria.modelo && (
        <div className={LIST_STYLES.itemDescription}>
          {maquinaria.modelo}
        </div>
      )}
      <div className={LIST_STYLES.itemTagsRow}>
        <div className={`${LIST_STYLES.itemTagsLeft} tags-container-mobile`}>
          <span className={`${LIST_STYLES.itemTagCode} bg-gray-100 text-gray-700 hidden sm:flex`} title={maquinaria.numero_serie || 'Sin número de serie'}>
            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="tag-truncate">{maquinaria.numero_serie || 'Sin N° serie'}</span>
          </span>
          {maquinaria.ubicacion && (
            <span className={`${LIST_STYLES.itemTagLocation} ${getColorFromString(maquinaria.ubicacion, 'ubicacion')}`} title={maquinaria.ubicacion}>
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="tag-truncate">{maquinaria.ubicacion}</span>
            </span>
          )}
          {maquinaria.categoria && (
            <span className={`${LIST_STYLES.itemTagCategory} ${getColorFromString(maquinaria.categoria, 'categoria')}`} title={maquinaria.categoria}>
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="tag-truncate">{maquinaria.categoria}</span>
            </span>
          )}
          {maquinaria.anio && (
            <span className={`${LIST_STYLES.itemTag} bg-gray-100 text-gray-700`}>
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatAnio(maquinaria.anio)}
            </span>
          )}
        </div>
      </div>
    </>
  );

  // Efectos
  useEffect(() => {
    fetchMaquinarias();
    cargarOpcionesFiltros();
  }, []);

  return (
    <>
      <BaseListPage
        title="Listado de Maquinarias"
        subtitle="Gestiona y filtra todas las maquinarias del sistema"
        entityName="Maquinaria"
        entityNamePlural="Maquinarias"
        createRoute="/maquinarias/formulario"
        
        items={maquinarias}
        loading={loading}
        error={error}
        
        filtrosTemporales={filtrosTemporales}
        handleFiltroChange={handleFiltroChange}
        aplicarFiltrosActuales={aplicarFiltrosActuales}
        limpiarTodosFiltros={limpiarTodosFiltros}
        tokensActivos={tokensActivos}
        removerToken={removerToken}
        opcionesFiltros={opcionesFiltros}
        camposFiltros={MAQUINARIA_FILTERS_CONFIG(opcionesFiltros)}
        
        paginacion={paginacion}
        handlePaginacion={handlePaginacion}
        
        onFileUpload={handleFileUpload}
        bulkError={bulkError}
        setBulkError={setBulkError}
        bulkSuccess={bulkSuccess}
        setBulkSuccess={setBulkSuccess}
        
        renderItem={renderMaquinaria}
      />

      {/* Modal de edición */}
      {selectedMaquinaria && (
        <MaquinariaEditModal
          maquinaria={selectedMaquinaria}
          onClose={closeEditModal}
          onUpdate={handleUpdateMaquinaria}
          onDelete={handleDeleteMaquinaria}
          token={token}
        />
      )}
    </>
  );
}

export default MaquinariasPage;
