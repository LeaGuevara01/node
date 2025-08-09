/**
 * Página de listado de Maquinarias refactorizada
 * 
 * Esta página ahora utiliza el nuevo sistema de navegación unificado:
 * - AppLayout para layout consistente
 * - NavigationButtons para botones estándar
 * - Contexto de navegación para manejo de rutas
 * - Componentes modulares para funcionalidad
 * - Sistema de logging centralizado y modular
 * - Prevención de llamadas API duplicadas
 */

// Página: Maquinarias (refactor)
// Rol: listado con filtros avanzados y navegación a detalles/formulario

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { createMaquinaria, getMaquinarias, getMaquinariaFilters, updateMaquinaria, deleteMaquinaria } from '../services/api';
import AppLayout from '../components/navigation/AppLayout';
import { CreateButton, ExportButton, ImportButton } from '../components/navigation/NavigationButtons';
import MaquinariaEditModal from '../components/MaquinariaEditModal';
import EstadoIcon from '../components/EstadoIcon';
import BaseListPage from '../components/shared/BaseListPage';
import { useAdvancedFilters } from '../hooks/useAdvancedFilters';
import { usePagination } from '../hooks/usePagination';
import { useNavigation } from '../hooks/useNavigation';
import { MAQUINARIA_FILTERS_CONFIG } from '../config/filtersConfig';
import { getColorFromString } from '../utils/colorUtils';
import { sortMaquinariasByCategory, getEstadoColorClass, formatAnio } from '../utils/maquinariaUtils';
import { createLogger } from '../utils/logger';
import { logFilterApplication, logPaginationChange, logBulkOperation } from '../utils/apiLogger';
import { 
  BUTTON_STYLES, 
  ICON_STYLES,
  LIST_STYLES
} from '../styles/repuestoStyles';

// Logger específico para este componente
const logger = createLogger('MaquinariasPage');

function MaquinariasPage({ token, role, onLogout }) {
  const { navigateToDetailPage } = useNavigation();
  
  // Estados principales
  const [maquinarias, setMaquinarias] = useState([]);
  const [selectedMaquinaria, setSelectedMaquinaria] = useState(null);
  const [error, setError] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  
  // Ref para prevenir llamadas duplicadas
  const fetchingRef = useRef(false);
  const lastFetchParamsRef = useRef(null);

  // Hook de paginación
  const { 
    paginacion, 
    loading, 
    setLoading, 
    handlePaginacion, 
    actualizarPaginacion 
  } = usePagination({ limit: 20 });

  // Hook de filtros avanzados con configuración específica de maquinarias
  const {
    filtrosTemporales,
    filtrosConsolidados,
    tokensActivos,
    opcionesFiltros,
    handleFiltroChange,
    aplicarFiltrosActuales,
    limpiarTodosFiltros,
    removerToken,
    cargarOpcionesFiltros: cargarOpcionesFiltrosMaquinaria
  } = useAdvancedFilters({
    endpoint: getMaquinariaFilters,
    token
  });

  /**
   * Carga las maquinarias con filtros aplicados
   * Incluye prevención de llamadas duplicadas
   */
  const fetchMaquinarias = async (filtrosActuales = {}, pagina = 1) => {
    // Generar clave única para esta llamada
    const fetchKey = JSON.stringify({ filtros: filtrosActuales, pagina });
    
    // Prevenir llamadas duplicadas
    if (fetchingRef.current && lastFetchParamsRef.current === fetchKey) {
      logger.debug('🔄 Llamada duplicada prevenida', { filtros: filtrosActuales, pagina });
      return;
    }
    
    fetchingRef.current = true;
    lastFetchParamsRef.current = fetchKey;
    setLoading(true);
    
    try {
      logger.data('📊 Cargando maquinarias', { 
        filtros: Object.keys(filtrosActuales).length,
        pagina 
      });

      const data = await getMaquinarias(token, filtrosActuales, pagina);
      
      if (data.maquinarias) {
        setMaquinarias(data.maquinarias);
        actualizarPaginacion(data.paginacion || data.pagination);
        
        logger.success(`Cargadas ${data.maquinarias.length} maquinarias`, {
          pagina,
          total: data.paginacion?.totalElementos || data.pagination?.total || 0
        });
      } else {
        logger.warn('Respuesta API sin datos de maquinarias', data);
        setMaquinarias([]);
      }
      
      setError('');
    } catch (err) {
      logger.error('Error al cargar maquinarias', { error: err.message, filtros: filtrosActuales, pagina });
      setError('Error al cargar las maquinarias');
      setMaquinarias([]);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
      // Limpiar la clave después de un breve delay
      setTimeout(() => {
        if (lastFetchParamsRef.current === fetchKey) {
          lastFetchParamsRef.current = null;
        }
      }, 1000);
    }
  };

  /**
   * Cargar opciones para filtros
   */
  const cargarOpcionesFiltros = async () => {
    try {
      logger.debug('🔧 Cargando opciones de filtros');
      await cargarOpcionesFiltrosMaquinaria();
      logger.success('Opciones de filtros cargadas');
    } catch (error) {
      logger.error('Error al cargar opciones de filtros', { error: error.message });
    }
  };

  /**
   * Aplicar filtros y recargar datos
   */
  const aplicarFiltros = () => {
    logFilterApplication(filtrosConsolidados, tokensActivos);
    aplicarFiltrosActuales();
    fetchMaquinarias(filtrosConsolidados, 1);
  };

  /**
   * Navegar a detalles de maquinaria
   */
  const handleMaquinariaClick = (maquinaria) => {
    logger.navigation('Navegando a detalle de maquinaria', { id: maquinaria.id, nombre: maquinaria.nombre });
    navigateToDetailPage('maquinarias', maquinaria.id);
  };

  /**
   * Maneja la apertura del modal de edición
   */
  const openEditModal = (maquinaria) => {
    logger.user('Abriendo modal de edición', { id: maquinaria.id });
    setSelectedMaquinaria(maquinaria);
  };

  /**
   * Maneja la actualización de una maquinaria
   */
  const handleUpdate = async (id, updatedMaquinaria) => {
    try {
      logger.data('Actualizando maquinaria', { id });
      await updateMaquinaria(id, updatedMaquinaria, token);
      fetchMaquinarias(filtrosConsolidados, paginacion.paginaActual);
      setSelectedMaquinaria(null);
      logger.success('Maquinaria actualizada correctamente');
    } catch (err) {
      logger.error('Error al actualizar maquinaria', { error: err.message, id });
      setError('Error al actualizar la maquinaria');
    }
  };

  /**
   * Maneja la eliminación de una maquinaria
   */
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta maquinaria?')) {
      return;
    }

    try {
      logger.data('Eliminando maquinaria', { id });
      await deleteMaquinaria(id, token);
      fetchMaquinarias(filtrosConsolidados, paginacion.paginaActual);
      logger.success('Maquinaria eliminada correctamente');
    } catch (err) {
      logger.error('Error al eliminar maquinaria', { error: err.message, id });
      setError('Error al eliminar la maquinaria');
    }
  };

  /**
   * Maneja la subida de archivos masiva
   */
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      logger.data('🗂️ Iniciando importación masiva', { fileName: file.name, size: file.size });
      
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/maquinaria/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const successMessage = `✅ ${data.count} maquinarias importadas correctamente`;
        setBulkSuccess(successMessage);
        setBulkError('');
        
        logBulkOperation('IMPORT', 'maquinarias', data.count, { success: true });
        logger.success('Importación masiva completada', { count: data.count });
        
        fetchMaquinarias(filtrosConsolidados, 1);
      } else {
        const errorData = await response.json();
        const errorMessage = `❌ Error: ${errorData.error || 'Error desconocido'}`;
        setBulkError(errorMessage);
        
        logBulkOperation('IMPORT', 'maquinarias', 0, { 
          success: false, 
          error: errorData.error 
        });
        logger.error('Error en importación masiva', { error: errorData.error });
      }
    } catch (err) {
      const errorMessage = '❌ Error de conexión al importar';
      setBulkError(errorMessage);
      
      logBulkOperation('IMPORT', 'maquinarias', 0, { 
        success: false, 
        error: err.message 
      });
      logger.error('Error de conexión en importación', { error: err.message });
    }
  };

  // Renderizado de cada maquinaria
  const renderMaquinaria = (maquinaria) => (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Nombre y marca */}
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              {maquinaria.nombre || 'Sin nombre'}
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Marca:</strong> {maquinaria.marca || 'N/A'} | 
              <strong> Modelo:</strong> {maquinaria.modelo || 'N/A'}
            </p>

            {/* Información adicional */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {maquinaria.anio && (
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Año: {formatAnio(maquinaria.anio)}</span>
              )}
              {maquinaria.categoria && (
                <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getColorFromString(maquinaria.categoria)}`}>
                  <Tag className="w-3 h-3" /> {maquinaria.categoria}
                </span>
              )}
              {maquinaria.ubicacion && (
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {maquinaria.ubicacion}</span>
              )}
            </div>
          </div>
          
          {/* Estado y acciones */}
          <div className="flex items-center space-x-3">
            {/* Estado visual */}
            <div className="text-right">
              <EstadoIcon estado={maquinaria.estado} />
              <div className={`text-sm font-medium ${getEstadoColorClass(maquinaria.estado)}`}>
                {maquinaria.estado || 'Sin estado'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // Efectos con logging mejorado
  useEffect(() => {
    logger.info('🚀 Componente MaquinariasPage inicializado');
    fetchMaquinarias();
    cargarOpcionesFiltros();
    
    return () => {
      logger.debug('🧹 Componente MaquinariasPage desmontado');
    };
  }, []);

  useEffect(() => {
    // Solo ejecutar si hay filtros consolidados válidos
    const hasValidFilters = Object.keys(filtrosConsolidados).some(key => {
      const value = filtrosConsolidados[key];
      return value !== '' && 
             value !== false && 
             value !== null && 
             value !== undefined &&
             !(Array.isArray(value) && value.length === 0);
    });

    if (hasValidFilters) {
      logger.filter('🔍 Filtros consolidados cambiados, recargando datos');
      fetchMaquinarias(filtrosConsolidados, 1);
    }
  }, [filtrosConsolidados]);

  // Definir breadcrumbs
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Maquinarias' }
  ];

  // Acciones de la página
  const pageActions = (
    <div className="flex items-center space-x-3">
      <ExportButton 
        onClick={() => {
          logger.user('🚀 Exportar maquinarias solicitado');
          // TODO: Implementar exportación
        }}
      />
      <ImportButton 
        onClick={() => {
          logger.user('📥 Importar maquinarias solicitado');
          document.getElementById('file-upload').click();
        }}
      />
      <CreateButton 
        entity="maquinarias"
        label="Nueva Maquinaria"
        onClick={() => logger.user('➕ Crear nueva maquinaria solicitado')}
      />
    </div>
  );

  return (
    <AppLayout
      currentSection="maquinarias"
      breadcrumbs={breadcrumbs}
      title="Gestión de Maquinarias"
      subtitle="Administra el inventario de maquinaria agrícola"
      actions={pageActions}
      token={token}
      role={role}
      onLogout={onLogout}
    >
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
        aplicarFiltrosActuales={aplicarFiltros}
        limpiarTodosFiltros={limpiarTodosFiltros}
        tokensActivos={tokensActivos}
        removerToken={removerToken}
        opcionesFiltros={opcionesFiltros}
        camposFiltros={MAQUINARIA_FILTERS_CONFIG(opcionesFiltros)}
        
        paginacion={paginacion}
        handlePaginacion={(pagina) => {
          logPaginationChange(pagina, paginacion.totalPaginas, paginacion.totalElementos);
          fetchMaquinarias(filtrosConsolidados, pagina);
        }}
        
        onFileUpload={handleFileUpload}
        bulkError={bulkError}
        setBulkError={setBulkError}
        bulkSuccess={bulkSuccess}
        setBulkSuccess={setBulkSuccess}
        
        onItemClick={handleMaquinariaClick}
        onEdit={openEditModal}
        onDelete={handleDelete}
        renderItem={renderMaquinaria}
        
        sortFunction={(items) => sortMaquinariasByCategory(items)}
      />

      {/* Modal de edición */}
      {selectedMaquinaria && (
        <MaquinariaEditModal
          maquinaria={selectedMaquinaria}
          onClose={() => setSelectedMaquinaria(null)}
          onUpdate={handleUpdate}
          token={token}
        />
      )}

      {/* Input oculto para subir archivos */}
      <input
        id="file-upload"
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => {
          if (e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
          }
        }}
        style={{ display: 'none' }}
      />
    </AppLayout>
  );
}

export default MaquinariasPage;
