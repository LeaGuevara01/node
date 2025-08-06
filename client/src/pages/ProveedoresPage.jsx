// client/src/pages/ProveedoresPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getProveedores, 
  getProveedorFilters, 
  createProveedor, 
  updateProveedor, 
  deleteProveedor 
} from '../services/api';
import ProveedorEditModal from '../components/ProveedorEditModal';
import BaseListPage from '../components/shared/BaseListPage';
import { useAdvancedFilters } from '../hooks/useAdvancedFilters.jsx';
import { usePagination } from '../hooks/usePagination';
import { PROVEEDOR_FILTERS_CONFIG } from '../config/filtersConfig';
import { getColorFromString } from '../utils/colorUtils';
import { 
  BUTTON_STYLES, 
  ICON_STYLES,
  LIST_STYLES
} from '../styles/repuestoStyles';

function ProveedoresPage({ token, onCreated }) {
  const navigate = useNavigate();
  
  // Estados principales
  const [proveedores, setProveedores] = useState([]);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
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
   * Carga los proveedores con filtros aplicados
   */
  const fetchProveedores = async (filtrosActuales = {}, pagina = 1) => {
    setLoading(true);
    try {
      const data = await getProveedores(token, filtrosActuales, pagina);
      
      if (data.proveedores) {
        setProveedores(data.proveedores);
        actualizarPaginacion(data.pagination || { current: 1, total: 1, totalItems: 0, limit: 20 });
      } else {
        setProveedores(data || []);
        actualizarPaginacion({ current: 1, total: 1, totalItems: data.length, limit: 20 });
      }
      setError('');
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
      setProveedores([]);
      setError('Error al cargar proveedores: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga las opciones de filtros
   */
  const fetchOpcionesFiltros = async () => {
    try {
      const data = await getProveedorFilters(token);
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
  } = useAdvancedFilters({}, fetchProveedores, fetchOpcionesFiltros);

  /**
   * Maneja la carga masiva de CSV
   */
  const handleFileUpload = async (csvData) => {
    const validRows = csvData.filter(row => row.nombre);
    let successCount = 0, failCount = 0;
    
    for (const row of validRows) {
      try {
        await createProveedor({
          nombre: row.nombre || '',
          contacto: row.contacto || '',
          telefono: row.telefono || '',
          email: row.email || '',
          direccion: row.direccion || '',
          ubicacion: row.ubicacion || '',
          notas: row.notas || ''
        }, token);
        successCount++;
      } catch (err) {
        console.error('Error creating proveedor:', err);
        failCount++;
      }
    }
    
    setBulkSuccess(`Creados: ${successCount}`);
    setBulkError(failCount ? `Fallidas: ${failCount}` : '');
    
    if (successCount > 0) {
      if (onCreated) onCreated();
      fetchProveedores(filtrosConsolidados, 1);
      cargarOpcionesFiltros();
    }
  };

  /**
   * Abre modal de edición
   */
  const openEditModal = (proveedor) => {
    setSelectedProveedor(proveedor);
  };

  /**
   * Cierra modal de edición
   */
  const closeEditModal = () => {
    setSelectedProveedor(null);
  };

  /**
   * Navega a la vista de detalles
   */
  const handleView = (proveedor) => {
    navigate(`/proveedores/${proveedor.id}`);
  };

  /**
   * Actualiza un proveedor
   */
  const handleUpdateProveedor = async (id, proveedorData) => {
    try {
      await updateProveedor(id, proveedorData, token);
      fetchProveedores(filtrosConsolidados, paginacion.current);
      cargarOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al actualizar: ' + err.message);
    }
  };

  /**
   * Elimina un proveedor
   */
  const handleDeleteProveedor = async (id) => {
    try {
      await deleteProveedor(id, token);
      fetchProveedores(filtrosConsolidados, paginacion.current);
      cargarOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  /**
   * Renderiza un elemento de proveedor
   */
  const renderProveedor = (proveedor) => (
    <>
      <div className={LIST_STYLES.itemHeader}>
        <div className="flex items-center gap-2">
          <h3 className={LIST_STYLES.itemTitle}>{proveedor.nombre}</h3>
        </div>
        <div className={LIST_STYLES.itemActions}>
          <button
            onClick={() => handleView(proveedor)}
            className={`${BUTTON_STYLES.edit} bg-gray-50 hover:bg-gray-100 text-gray-700 mr-2`}
            title="Ver detalles"
          >
            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => openEditModal(proveedor)}
            className={BUTTON_STYLES.edit}
            title="Editar proveedor"
          >
            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>
      {proveedor.direccion && (
        <div className={LIST_STYLES.itemDescription}>
          {proveedor.direccion}
        </div>
      )}
      <div className={LIST_STYLES.itemTagsRow}>
        <div className={`${LIST_STYLES.itemTagsLeft} tags-container-mobile`}>
          {proveedor.contacto && (
            <span className={`${LIST_STYLES.itemTagCode} bg-blue-100 text-blue-700`} title={proveedor.contacto}>
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="tag-truncate">{proveedor.contacto}</span>
            </span>
          )}
          {proveedor.telefono && (
            <span className={`${LIST_STYLES.itemTag} bg-green-100 text-green-700`} title={proveedor.telefono}>
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="tag-truncate">{proveedor.telefono}</span>
            </span>
          )}
          {proveedor.email && (
            <span className={`${LIST_STYLES.itemTag} bg-purple-100 text-purple-700`} title={proveedor.email}>
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="tag-truncate">{proveedor.email}</span>
            </span>
          )}
          {proveedor.ubicacion && (
            <span className={`${LIST_STYLES.itemTagLocation} ${getColorFromString(proveedor.ubicacion, 'ubicacion')}`} title={proveedor.ubicacion}>
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="tag-truncate">{proveedor.ubicacion}</span>
            </span>
          )}
        </div>
      </div>
    </>
  );

  // Efectos
  useEffect(() => {
    fetchProveedores();
    cargarOpcionesFiltros();
  }, []);

  return (
    <>
      <BaseListPage
        title="Listado de Proveedores"
        subtitle="Gestiona y filtra todos los proveedores del sistema"
        entityName="Proveedor"
        entityNamePlural="Proveedores"
        createRoute="/proveedores/formulario"
        
        items={proveedores}
        loading={loading}
        error={error}
        
        filtrosTemporales={filtrosTemporales}
        handleFiltroChange={handleFiltroChange}
        aplicarFiltrosActuales={aplicarFiltrosActuales}
        limpiarTodosFiltros={limpiarTodosFiltros}
        tokensActivos={tokensActivos}
        removerToken={removerToken}
        opcionesFiltros={opcionesFiltros}
        camposFiltros={PROVEEDOR_FILTERS_CONFIG(opcionesFiltros)}
        
        paginacion={paginacion}
        handlePaginacion={(pagina) => fetchProveedores(filtrosConsolidados, pagina)}
        
        onFileUpload={handleFileUpload}
        bulkError={bulkError}
        setBulkError={setBulkError}
        bulkSuccess={bulkSuccess}
        setBulkSuccess={setBulkSuccess}
        
        renderItem={renderProveedor}
      />

      {/* Modal de edición */}
      {selectedProveedor && (
        <ProveedorEditModal
          proveedor={selectedProveedor}
          onClose={closeEditModal}
          onUpdate={handleUpdateProveedor}
          onDelete={handleDeleteProveedor}
          token={token}
        />
      )}
    </>
  );
}

export default ProveedoresPage;
