// Archivo optimizado para RepuestoForm.jsx con utilidades modulares
// Este archivo es una versión refactorizada que usa las utilidades creadas

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { createRepuesto, updateRepuesto, getRepuestos, deleteRepuesto } from '../services/api';
import RepuestoEditModal from '../components/RepuestoEditModal';
import { getColorFromString, getStockColorClass } from '../utils/colorUtils';
import { sortRepuestosByStock, buildQueryParams, clearAllFilters } from '../utils/dataUtils';
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
  POSITION_STYLES
} from '../styles/repuestoStyles';

function RepuestoForm({ token, onCreated }) {
  const [form, setForm] = useState({
    nombre: '', stock: '', codigo: '', descripcion: '', precio: '', proveedor: '', ubicacion: '', categoria: ''
  });
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedRepuesto, setSelectedRepuesto] = useState(null);
  const [repuestos, setRepuestos] = useState([]);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    search: '',
    categoria: '',
    ubicacion: '',
    stockMin: '',
    sinStock: false
  });
  const [opcionesFiltros, setOpcionesFiltros] = useState({
    categorias: [],
    ubicaciones: []
  });
  const [paginacion, setPaginacion] = useState({
    current: 1,
    total: 1,
    totalItems: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchRepuestos = async (filtrosActuales = filtros, pagina = 1) => {
    setLoading(true);
    try {
      const params = buildQueryParams(filtrosActuales, pagina);

      console.log('Fetching with params:', params.toString());

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/repuestos?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      console.log('API Response:', data);
      
      if (data.repuestos) {
        const repuestosOrdenados = sortRepuestosByStock(data.repuestos);
        setRepuestos(repuestosOrdenados);
        setPaginacion(data.pagination || { current: 1, total: 1, totalItems: 0 });
      } else {
        setRepuestos([]);
      }
    } catch (err) {
      console.error('Error al cargar repuestos:', err);
      setRepuestos([]);
      setError('Error al cargar repuestos');
    } finally {
      setLoading(false);
    }
  };

  const fetchOpcionesFiltros = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/repuestos/filtros`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOpcionesFiltros(data);
    } catch (err) {
      console.error('Error al cargar opciones de filtros:', err);
    }
  };

  const handleFiltroChange = (campo, valor) => {
    const nuevosFiltros = { ...filtros, [campo]: valor };
    setFiltros(nuevosFiltros);

    if (campo === 'search') {
      if (searchTimeout) clearTimeout(searchTimeout);
      setSearchTimeout(setTimeout(() => {
        fetchRepuestos(nuevosFiltros, 1);
      }, 300));
    } else {
      fetchRepuestos(nuevosFiltros, 1);
    }
  };

  const limpiarFiltros = () => {
    const filtrosVacios = clearAllFilters();
    setFiltros(filtrosVacios);
    fetchRepuestos(filtrosVacios, 1);
  };

  const handlePaginacion = (nuevaPagina) => {
    fetchRepuestos(filtros, nuevaPagina);
  };

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
      fetchRepuestos();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (repuesto) => {
    setSelectedRepuesto(repuesto);
  };

  const closeEditModal = () => {
    setSelectedRepuesto(null);
  };

  const handleUpdateRepuesto = async (id, repuestoData) => {
    try {
      await updateRepuesto(id, repuestoData, token);
      fetchRepuestos();
      if (onCreated) onCreated();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRepuesto = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este repuesto?')) {
      try {
        await deleteRepuesto(id, token);
        fetchRepuestos();
        if (onCreated) onCreated();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchRepuestos();
    fetchOpcionesFiltros();
  }, []);

  return (
    <div className={CONTAINER_STYLES.main}>
      <div className={CONTAINER_STYLES.maxWidth}>
        
        {/* Header con botones de acción */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <div className={LAYOUT_STYLES.flexBetween}>
            <div>
              <h1 className={TEXT_STYLES.title}>Gestión de Repuestos</h1>
              <p className={TEXT_STYLES.subtitle}>Administra tu inventario de repuestos</p>
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
                        const validRows = results.data.filter(row => row.nombre && row.categoria);
                        let successCount = 0, failCount = 0;
                        
                        for (const row of validRows) {
                          try {
                            await createRepuesto({
                              nombre: row.nombre || '',
                              stock: Number(row.stock) || 0,
                              codigo: row.codigo || '',
                              descripcion: row.descripcion || '',
                              precio: Number(row.precio) || 0,
                              proveedor: row.proveedor || '',
                              ubicacion: row.ubicacion || '',
                              categoria: row.categoria || ''
                            }, token);
                            successCount++;
                          } catch (err) {
                            failCount++;
                          }
                        }
                        setBulkSuccess(`Creados: ${successCount}`);
                        setBulkError(failCount ? `Fallidos: ${failCount}` : '');
                        if (onCreated && successCount) onCreated();
                        fetchRepuestos();
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
                Nuevo Repuesto
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
                  placeholder="Buscar repuestos..."
                  className={`${INPUT_STYLES.withIcon} ${INPUT_STYLES.placeholder}`}
                />
              </div>
            </div>

            {/* Categoría */}
            <div>
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <select
                  value={filtros.categoria}
                  onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                  className={INPUT_STYLES.select}
                >
                  <option value="" className={INPUT_STYLES.selectPlaceholder}>Categorías</option>
                  {opcionesFiltros.categorias?.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div>
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <select
                  value={filtros.ubicacion}
                  onChange={(e) => handleFiltroChange('ubicacion', e.target.value)}
                  className={INPUT_STYLES.select}
                >
                  <option value="" className={INPUT_STYLES.selectPlaceholder}>Ubicaciones</option>
                  {opcionesFiltros.ubicaciones?.map(ubicacion => (
                    <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
                  ))}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Stock mínimo */}
            <div>
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <input
                  type="number"
                  value={filtros.stockMin}
                  onChange={(e) => handleFiltroChange('stockMin', e.target.value)}
                  placeholder="Stock mínimo"
                  className={`${INPUT_STYLES.withIcon} ${INPUT_STYLES.placeholder}`}
                />
              </div>
            </div>

            {/* Sin stock */}
            <div>
              <button
                type="button"
                onClick={() => handleFiltroChange('sinStock', !filtros.sinStock)}
                className={`${INPUT_STYLES.base} ${filtros.sinStock ? BUTTON_STYLES.filter.active : BUTTON_STYLES.filter.inactive} flex items-center justify-center gap-2`}
              >
                <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {filtros.sinStock ? 'Mostrando sin stock' : 'Filtrar sin stock'}
              </button>
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

        {/* Lista de Repuestos */}
        <div className={CONTAINER_STYLES.card}>
          <div className={`${CONTAINER_STYLES.cardPadding} border-b border-gray-200`}>
            <div className={LAYOUT_STYLES.flexBetween}>
              <div>
                <h3 className={TEXT_STYLES.title}>Repuestos ({paginacion.totalItems})</h3>
                <p className={TEXT_STYLES.subtitle}>Ordenados por stock descendente</p>
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

          {/* Lista */}
          <div className={LIST_STYLES.divider}>
            {repuestos.length === 0 ? (
              <div className={LIST_STYLES.emptyState}>
                No hay repuestos que coincidan con los filtros
              </div>
            ) : (
              repuestos.map((repuesto) => (
                <div key={repuesto.id} className={LIST_STYLES.item}>
                  <div className={LIST_STYLES.itemContent}>
                    <div className="flex-1">
                      <div className={LIST_STYLES.itemHeader}>
                        <h3 className={LIST_STYLES.itemTitle}>{repuesto.nombre}</h3>
                        <span className={`font-medium flex items-center gap-1 text-sm ml-4 ${getStockColorClass(repuesto.stock)}`}>
                          <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          {repuesto.stock}
                        </span>
                      </div>
                      <div className={LIST_STYLES.itemDetails}>
                        <div className={LIST_STYLES.itemLeft}>
                          {repuesto.codigo && (
                            <span className={`flex items-center gap-1 ${TEXT_STYLES.gray}`}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {repuesto.codigo}
                            </span>
                          )}
                          {repuesto.categoria && (
                            <span className={`flex items-center gap-1 ${getColorFromString(repuesto.categoria, 'categoria')}`}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              {repuesto.categoria}
                            </span>
                          )}
                          {repuesto.ubicacion && (
                            <span className={`flex items-center gap-1 ${getColorFromString(repuesto.ubicacion, 'ubicacion')}`}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {repuesto.ubicacion}
                            </span>
                          )}
                          {repuesto.precio && (
                            <span className={`flex items-center gap-1 ${TEXT_STYLES.gray}`}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              ${Number(repuesto.precio).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className={LIST_STYLES.itemRight}>
                          <button
                            onClick={() => openEditModal(repuesto)}
                            className={BUTTON_STYLES.edit}
                          >
                            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
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
            <div className={`${CONTAINER_STYLES.cardPadding} border-t border-gray-200 flex justify-center gap-2`}>
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
                Anterior
              </button>
              
              <span className="px-4 py-2 text-sm text-gray-600 flex items-center">
                Página {paginacion.current} de {paginacion.total}
              </span>
              
              <button
                onClick={() => handlePaginacion(paginacion.current + 1)}
                disabled={paginacion.current >= paginacion.total}
                className={`${BUTTON_STYLES.pagination.base} ${
                  paginacion.current >= paginacion.total 
                    ? BUTTON_STYLES.pagination.disabled 
                    : BUTTON_STYLES.pagination.enabled
                }`}
              >
                Siguiente
                <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => setForm({...form, nombre: e.target.value})}
                        className={INPUT_STYLES.base}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                      <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({...form, stock: e.target.value})}
                        className={INPUT_STYLES.base}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                      <input
                        type="text"
                        value={form.codigo}
                        onChange={(e) => setForm({...form, codigo: e.target.value})}
                        className={INPUT_STYLES.base}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                      <input
                        type="number"
                        value={form.precio}
                        onChange={(e) => setForm({...form, precio: e.target.value})}
                        className={INPUT_STYLES.base}
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                      <input
                        type="text"
                        value={form.proveedor}
                        onChange={(e) => setForm({...form, proveedor: e.target.value})}
                        className={INPUT_STYLES.base}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                      <input
                        type="text"
                        value={form.ubicacion}
                        onChange={(e) => setForm({...form, ubicacion: e.target.value})}
                        className={INPUT_STYLES.base}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                      <input
                        type="text"
                        value={form.categoria}
                        onChange={(e) => setForm({...form, categoria: e.target.value})}
                        className={INPUT_STYLES.base}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
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
      </div>
    </div>
  );
}

export default RepuestoForm;
