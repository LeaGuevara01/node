/**
 * Página de listado de Maquinarias refactorizada
 * 
 * Esta página ahora utiliza el nuevo sistema de navegación unificado:
 * - AppLayout para layout consistente
 * - NavigationButtons para botones estándar
 * - Contexto de navegación para manejo de rutas
 * - Componentes modulares para funcionalidad
 */

import React, { useState, useEffect } from 'react';
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
import { 
  BUTTON_STYLES, 
  ICON_STYLES,
  LIST_STYLES
} from '../styles/repuestoStyles';

function MaquinariasPage({ token, role, onLogout }) {
  const { navigateToDetailPage } = useNavigation();
  
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
   */
  const fetchMaquinarias = async (filtrosActuales = {}, pagina = 1) => {
    setLoading(true);
    try {
      console.log('Fetching maquinarias with consolidated filters:', filtrosActuales, 'page:', pagina);

      const data = await getMaquinarias(token, filtrosActuales, pagina);
      console.log('API Response:', data);
      
      if (data.maquinarias) {
        setMaquinarias(data.maquinarias);
        actualizarPaginacion(data.paginacion);
        console.log(`✅ Loaded ${data.maquinarias.length} maquinarias for page ${pagina}`);
      } else {
        console.warn('No maquinarias data in response:', data);
        setMaquinarias([]);
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching maquinarias:', err);
      setError('Error al cargar las maquinarias');
      setMaquinarias([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cargar opciones para filtros
   */
  const cargarOpcionesFiltros = async () => {
    await cargarOpcionesFiltrosMaquinaria();
  };

  /**
   * Aplicar filtros y recargar datos
   */
  const aplicarFiltros = () => {
    aplicarFiltrosActuales();
    fetchMaquinarias(filtrosConsolidados, 1);
  };

  /**
   * Navegar a detalles de maquinaria
   */
  const handleMaquinariaClick = (maquinaria) => {
    navigateToDetailPage('maquinarias', maquinaria.id);
  };

  /**
   * Maneja la apertura del modal de edición
   */
  const openEditModal = (maquinaria) => {
    setSelectedMaquinaria(maquinaria);
  };

  /**
   * Maneja la actualización de una maquinaria
   */
  const handleUpdate = async (id, updatedMaquinaria) => {
    try {
      await updateMaquinaria(id, updatedMaquinaria, token);
      fetchMaquinarias(filtrosConsolidados, paginacion.paginaActual);
      setSelectedMaquinaria(null);
    } catch (err) {
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
      await deleteMaquinaria(id, token);
      fetchMaquinarias(filtrosConsolidados, paginacion.paginaActual);
    } catch (err) {
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/maquinarias/bulk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setBulkSuccess(`✅ ${data.count} maquinarias importadas correctamente`);
        setBulkError('');
        fetchMaquinarias(filtrosConsolidados, 1);
      } else {
        const errorData = await response.json();
        setBulkError(`❌ Error: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (err) {
      setBulkError('❌ Error de conexión al importar');
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
                <span>📅 Año: {formatAnio(maquinaria.anio)}</span>
              )}
              {maquinaria.categoria && (
                <span className={`px-2 py-1 rounded text-xs font-medium ${getColorFromString(maquinaria.categoria)}`}>
                  🏷️ {maquinaria.categoria}
                </span>
              )}
              {maquinaria.ubicacion && (
                <span>📍 {maquinaria.ubicacion}</span>
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

  // Efectos
  useEffect(() => {
    fetchMaquinarias();
    cargarOpcionesFiltros();
  }, []);

  useEffect(() => {
    fetchMaquinarias(filtrosConsolidados, 1);
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
        onClick={() => console.log('Exportar maquinarias')}
      />
      <ImportButton 
        onClick={() => document.getElementById('file-upload').click()}
      />
      <CreateButton 
        entity="maquinarias"
        label="Nueva Maquinaria"
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
        handlePaginacion={(pagina) => fetchMaquinarias(filtrosConsolidados, pagina)}
        
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
