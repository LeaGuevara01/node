// Página: Repuestos
// Rol: listado con filtros, CRUD y navegación a detalles

// client/src/pages/RepuestosPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getRepuestos, 
  getRepuestoFilters, 
  createRepuesto, 
  updateRepuesto, 
  deleteRepuesto 
} from '../services/api';
import RepuestoEditModal from '../components/RepuestoEditModal';
import BaseListPage from '../components/shared/BaseListPage';
import { useAdvancedFilters } from '../hooks/useAdvancedFilters.jsx';
import { usePagination } from '../hooks/usePagination';
import { REPUESTO_FILTERS_CONFIG } from '../config/filtersConfig';
import { getColorFromString } from '../utils/colorUtils';
import { 
  BUTTON_STYLES, 
  ICON_STYLES,
  LIST_STYLES,
  MODAL_STYLES,
  INPUT_STYLES,
  LAYOUT_STYLES,
  ALERT_STYLES
} from '../styles/repuestoStyles';
import AppLayout from '../components/navigation/AppLayout';

function RepuestosPage({ token, role, onLogout, onCreated }) {
  const navigate = useNavigate();
  
  // Estados principales
  const [repuestos, setRepuestos] = useState([]);
  const [selectedRepuesto, setSelectedRepuesto] = useState(null);
  const [error, setError] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Estado del formulario
  const [form, setForm] = useState({
    nombre: '', stock: '', codigo: '', descripcion: '', precio: '', proveedor: '', ubicacion: '', categoria: ''
  });

  // Hook de paginación
  const { 
    paginacion, 
    loading, 
    setLoading, 
    handlePaginacion, 
    actualizarPaginacion 
  } = usePagination({ limit: 20 });

  /**
   * Carga los repuestos con filtros aplicados
   */
  const fetchRepuestos = async (filtrosActuales = {}, pagina = 1) => {
    setLoading(true);
    try {
      const data = await getRepuestos(token, filtrosActuales, pagina);
      
      if (data.repuestos) {
        setRepuestos(data.repuestos);
        actualizarPaginacion(data.pagination || { current: 1, total: 1, totalItems: 0, limit: 20 });
      } else {
        setRepuestos(data || []);
        actualizarPaginacion({ current: 1, total: 1, totalItems: data.length, limit: 20 });
      }
      setError('');
    } catch (err) {
      console.error('Error al cargar repuestos:', err);
      setRepuestos([]);
      setError('Error al cargar repuestos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga las opciones de filtros
   */
  const fetchOpcionesFiltros = async () => {
    try {
      const data = await getRepuestoFilters(token);
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
  } = useAdvancedFilters({}, fetchRepuestos, fetchOpcionesFiltros);

  /**
   * Maneja la carga masiva de CSV
   */
  const handleFileUpload = async (csvData) => {
    const validRows = csvData.filter(row => row.nombre && row.codigo);
    let successCount = 0, failCount = 0;
    
    for (const row of validRows) {
      try {
        await createRepuesto({
          nombre: row.nombre || '',
          codigo: row.codigo || '',
          categoria: row.categoria || '',
          ubicacion: row.ubicacion || '',
          stock: row.stock ? Number(row.stock) : 0,
          precio: row.precio ? Number(row.precio) : 0,
          descripcion: row.descripcion || ''
        }, token);
        successCount++;
      } catch (err) {
        console.error('Error creating repuesto:', err);
        failCount++;
      }
    }
    
    setBulkSuccess(`Creados: ${successCount}`);
    setBulkError(failCount ? `Fallidas: ${failCount}` : '');
    
    if (successCount > 0) {
      if (onCreated) onCreated();
      fetchRepuestos(filtrosConsolidados, 1);
      cargarOpcionesFiltros();
    }
  };

  /**
   * Abre modal de edición
   */
  const openEditModal = (repuesto) => {
    setSelectedRepuesto(repuesto);
  };

  /**
   * Cierra modal de edición
   */
  const closeEditModal = () => {
    setSelectedRepuesto(null);
  };

  /**
   * Navega a la vista de detalles
   */
  const handleView = (repuesto) => {
    navigate(`/repuestos/${repuesto.id}`);
  };

  /**
   * Actualiza un repuesto
   */
  const handleUpdateRepuesto = async (id, repuestoData) => {
    try {
      await updateRepuesto(id, repuestoData, token);
      fetchRepuestos(filtrosConsolidados, paginacion.current);
      cargarOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al actualizar: ' + err.message);
    }
  };

  /**
   * Elimina un repuesto
   */
  const handleDeleteRepuesto = async (id) => {
    try {
      await deleteRepuesto(id, token);
      fetchRepuestos(filtrosConsolidados, paginacion.current);
      cargarOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  /**
   * Maneja el envío del formulario de agregar repuesto
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const repuestoData = {
        ...form,
        precio: Number(form.precio),
        stock: Number(form.stock),
      };
      await createRepuesto(repuestoData, token);
      setForm({ nombre: '', stock: '', codigo: '', descripcion: '', precio: '', proveedor: '', ubicacion: '', categoria: '' });
      setShowAddModal(false);
      if (onCreated) onCreated();
      fetchRepuestos(filtrosConsolidados, 1);
      cargarOpcionesFiltros();
      setBulkSuccess('Repuesto creado exitosamente');
    } catch (err) {
      setError(err.message);
    }
  };

  const getStockBadge = (stock) => {
    if (stock <= 0) return 'bg-red-100 text-red-800';
    if (stock <= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  /**
   * Renderiza un elemento de repuesto
   */
  const renderRepuesto = (repuesto) => (
    <>
      <div className={LIST_STYLES.itemHeader}>
        <div className="flex items-center gap-2">
          <h3 className={LIST_STYLES.itemTitle}>{repuesto.nombre}</h3>
        </div>
        <div className={LIST_STYLES.itemActions}>
          <button
            onClick={() => handleView(repuesto)}
            className={`${BUTTON_STYLES.edit} bg-gray-50 hover:bg-gray-100 text-gray-700 mr-2`}
            title="Ver detalles"
          >
            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => openEditModal(repuesto)}
            className={BUTTON_STYLES.edit}
            title="Editar repuesto"
          >
            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>
      {repuesto.descripcion && (
        <div className={LIST_STYLES.itemDescription}>
          {repuesto.descripcion}
        </div>
      )}
      <div className={LIST_STYLES.itemTagsRow}>
        <div className={`${LIST_STYLES.itemTagsLeft} tags-container-mobile`}>
          <span className={`${LIST_STYLES.itemTagCode} bg-gray-100 text-gray-700`} title={repuesto.codigo || 'Sin código'}>
            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="tag-truncate">{repuesto.codigo || 'Sin código'}</span>
          </span>
          {repuesto.ubicacion && (
            <span className={`${LIST_STYLES.itemTagLocation} ${getColorFromString(repuesto.ubicacion, 'ubicacion')}`} title={repuesto.ubicacion}>
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="tag-truncate">{repuesto.ubicacion}</span>
            </span>
          )}
          {repuesto.categoria && (
            <span className={`${LIST_STYLES.itemTagCategory} ${getColorFromString(repuesto.categoria, 'categoria')}`} title={repuesto.categoria}>
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="tag-truncate">{repuesto.categoria}</span>
            </span>
          )}
        </div>
        <div className={LIST_STYLES.itemTagsRight}>
          <span className={`${LIST_STYLES.itemTag} ${getStockBadge(repuesto.stock)}`}>
            Stock: {repuesto.stock}
          </span>
          <span className={`${LIST_STYLES.itemTag} bg-blue-100 text-blue-800`}>
            ${repuesto.precio?.toFixed(2) || '0.00'}
          </span>
        </div>
      </div>
    </>
  );

  // Efectos
  useEffect(() => {
    fetchRepuestos();
    cargarOpcionesFiltros();
  }, []);

  // Breadcrumbs y acciones para el encabezado
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Repuestos' }
  ];

  const pageActions = (
    <button
      onClick={() => setShowAddModal(true)}
      className={BUTTON_STYLES.newItem}
    >
      <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Nuevo Repuesto
    </button>
  );

  return (
    <AppLayout
      currentSection="repuestos"
      breadcrumbs={breadcrumbs}
      title="Gestión de Repuestos"
      subtitle="Administra el inventario de repuestos"
      actions={pageActions}
      token={token}
      role={role}
      onLogout={onLogout}
    >
      <BaseListPage
        title="Listado de Repuestos"
        subtitle="Gestiona y filtra todos los repuestos del inventario"
        entityName="Repuesto"
        entityNamePlural="Repuestos"
        showNewButton={false}
        
        items={repuestos}
        loading={loading}
        error={error}
        
        filtrosTemporales={filtrosTemporales}
        handleFiltroChange={handleFiltroChange}
        aplicarFiltrosActuales={aplicarFiltrosActuales}
        limpiarTodosFiltros={limpiarTodosFiltros}
        tokensActivos={tokensActivos}
        removerToken={removerToken}
        opcionesFiltros={opcionesFiltros}
        camposFiltros={REPUESTO_FILTERS_CONFIG(opcionesFiltros)}
        
        paginacion={paginacion}
        handlePaginacion={(pagina) => fetchRepuestos(filtrosConsolidados, pagina)}
        
        onFileUpload={handleFileUpload}
        bulkError={bulkError}
        setBulkError={setBulkError}
        bulkSuccess={bulkSuccess}
        setBulkSuccess={setBulkSuccess}
        
        renderItem={renderRepuesto}
        
  headerActions={pageActions}
      />

      {/* Modal de agregar repuesto */}
      {showAddModal && (
        <div className={MODAL_STYLES.overlay}>
          <div className={MODAL_STYLES.container}>
            <div className={MODAL_STYLES.content}>
              <div className={MODAL_STYLES.header}>
                <h2 className={MODAL_STYLES.title}>Nuevo Repuesto</h2>
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
                    <label className={INPUT_STYLES.label}>Nombre</label>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => setForm({...form, nombre: e.target.value})}
                      className={INPUT_STYLES.base}
                      required
                    />
                  </div>
                  <div>
                    <label className={INPUT_STYLES.label}>Stock</label>
                    <input
                      type="number"
                      value={form.stock}
                      onChange={(e) => setForm({...form, stock: e.target.value})}
                      className={INPUT_STYLES.base}
                      required
                    />
                  </div>
                  <div>
                    <label className={INPUT_STYLES.label}>Código</label>
                    <input
                      type="text"
                      value={form.codigo}
                      onChange={(e) => setForm({...form, codigo: e.target.value})}
                      className={INPUT_STYLES.base}
                    />
                  </div>
                  <div>
                    <label className={INPUT_STYLES.label}>Precio</label>
                    <input
                      type="number"
                      value={form.precio}
                      onChange={(e) => setForm({...form, precio: e.target.value})}
                      className={INPUT_STYLES.base}
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className={INPUT_STYLES.label}>Proveedor</label>
                    <input
                      type="text"
                      value={form.proveedor}
                      onChange={(e) => setForm({...form, proveedor: e.target.value})}
                      className={INPUT_STYLES.base}
                    />
                  </div>
                  <div>
                    <label className={INPUT_STYLES.label}>Ubicación</label>
                    <input
                      type="text"
                      value={form.ubicacion}
                      onChange={(e) => setForm({...form, ubicacion: e.target.value})}
                      className={INPUT_STYLES.base}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={INPUT_STYLES.label}>Categoría</label>
                    <input
                      type="text"
                      value={form.categoria}
                      onChange={(e) => setForm({...form, categoria: e.target.value})}
                      className={INPUT_STYLES.base}
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={INPUT_STYLES.label}>Descripción</label>
                    <textarea
                      value={form.descripcion}
                      onChange={(e) => setForm({...form, descripcion: e.target.value})}
                      className={INPUT_STYLES.base}
                      rows={3}
                    />
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
                    Crear Repuesto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {selectedRepuesto && (
        <RepuestoEditModal
          repuesto={selectedRepuesto}
          onClose={closeEditModal}
          onUpdate={handleUpdateRepuesto}
          onDelete={handleDeleteRepuesto}
          token={token}
        />
      )}
  </AppLayout>
  );
}

export default RepuestosPage;
