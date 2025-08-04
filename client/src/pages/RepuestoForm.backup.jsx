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
      // Construir parámetros de query usando utilidad
      const params = buildQueryParams(filtrosActuales, pagina);

      console.log('Fetching with params:', params.toString()); // Debug log

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/repuestos?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      console.log('API Response:', data); // Debug log
      
      if (data.repuestos) {
        // Ordenar por stock descendente usando utilidad
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
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // For search field, add debounce to avoid too many API calls
    if (campo === 'search') {
      const timeout = setTimeout(() => {
        fetchRepuestos(nuevosFiltros, 1);
      }, 500); // Wait 500ms after user stops typing
      setSearchTimeout(timeout);
    } else {
      // For other filters, apply immediately
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

  useEffect(() => {
    if (token) {
      fetchRepuestos();
      fetchOpcionesFiltros();
    }
  }, [token]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.nombre || !form.stock || !form.codigo) {
      setError('Nombre, stock y código son obligatorios');
      return;
    }
    try {
      const res = await createRepuesto({
        ...form,
        stock: Number(form.stock),
        precio: form.precio ? Number(form.precio) : undefined
      }, token);
      if (res.id) {
        onCreated && onCreated(res);
        setForm({ nombre: '', stock: '', codigo: '', descripcion: '', precio: '', proveedor: '', ubicacion: '', categoria: '' });
        setShowAddModal(false); // Cerrar modal después de crear
        fetchRepuestos(); // Actualizar la lista después de crear
      } else {
        setError(res.error || 'Error al crear repuesto');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleEdit = (repuesto) => {
    setSelectedRepuesto(repuesto);
  };

  const handleUpdate = async (updatedRepuesto) => {
    setError('');
    try {
      const res = await updateRepuesto(updatedRepuesto, token);
      if (res.id) {
        onCreated && onCreated(res);
        setSelectedRepuesto(null);
        fetchRepuestos(); // Actualizar la lista después de editar
      } else {
        setError(res.error || 'Error al actualizar repuesto');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteRepuesto(id, token);
      fetchRepuestos(); // Actualizar la lista después de eliminar
      setSelectedRepuesto(null);
    } catch (err) {
      console.error('Error al eliminar repuesto:', err);
      setError('Error al eliminar repuesto');
    }
  };

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
                    setBulkError('');
                    setBulkSuccess('');
                    const file = e.target.files[0];
                    if (!file) return;
                    Papa.parse(file, {
                      header: true,
                      skipEmptyLines: true,
                      complete: async (results) => {
                        const rows = results.data;
                        let successCount = 0;
                        let failCount = 0;
                        for (const row of rows) {
                          try {
                            const res = await createRepuesto(row, token);
                            if (res.id) successCount++;
                            else failCount++;
                          } catch {
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Cargar CSV
                </div>
              </label>
              <button
                onClick={() => setShowAddModal(true)}
                className={BUTTON_STYLES.newItem}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo Repuesto
              </button>
            </div>
          </div>
          
          {/* Mensajes de carga CSV */}
          {bulkSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800">
              {bulkSuccess}
            </div>
          )}
          {bulkError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
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
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <select
                  value={filtros.ubicacion}
                  onChange={(e) => handleFiltroChange('ubicacion', e.target.value)}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-500"
                >
                  <option value="" className="text-gray-500">Ubicaciones</option>
                  {opcionesFiltros.ubicaciones?.map(ubicacion => (
                    <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Stock mínimo */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <input
                  type="number"
                  value={filtros.stockMin}
                  onChange={(e) => handleFiltroChange('stockMin', e.target.value)}
                  placeholder="Stock mínimo"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {/* Botón Solo sin stock */}
            <button
              type="button"
              onClick={() => handleFiltroChange('sinStock', !filtros.sinStock)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors duration-200 flex items-center justify-center gap-2 ${
                filtros.sinStock
                  ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100 focus:ring-red-500'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
              }`}
            >
              {filtros.sinStock ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Solo sin stock
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Incluir todo stock
                </>
              )}
            </button>

            {/* Botón limpiar filtros */}
            <button
              type="button"
              onClick={limpiarFiltros}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Lista de Repuestos */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-3 sm:p-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-800">Repuestos</h2>
              {loading ? (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Cargando...
                </div>
              ) : (
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {paginacion.totalItems} repuestos encontrados
                </div>
              )}
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {Array.isArray(repuestos) && repuestos.length > 0 ? (
              repuestos.map((repuesto, index) => (
                <div key={repuesto.id || index} className="p-3 sm:p-5 hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex items-start gap-3">
                    <button 
                      onClick={() => handleEdit(repuesto)} 
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center mt-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">{repuesto.nombre}</h3>
                        <span className={`font-medium flex items-center gap-1 text-sm ml-4 ${getStockColorClass(repuesto.stock)}`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          {repuesto.stock}
                        </span>
                      </div>
                      <div className="flex flex-wrap justify-between gap-4 mt-1 text-sm">
                        <div className="flex flex-wrap gap-4">
                          {repuesto.codigo && (
                            <span className="flex items-center gap-1 text-gray-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {repuesto.codigo}
                            </span>
                          )}
                          {repuesto.categoria && (
                            <span className={`flex items-center gap-1 ${getColorFromString(repuesto.categoria, 'categoria')}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              {repuesto.categoria}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          {repuesto.ubicacion && (
                            <span className={`flex items-center gap-1 ${getColorFromString(repuesto.ubicacion, 'ubicacion')}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {repuesto.ubicacion}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                {loading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span>Cargando repuestos...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>No hay repuestos disponibles</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Paginación */}
          {paginacion.total > 1 && (
            <div className="p-3 sm:p-5 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Página {paginacion.current} de {paginacion.total}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePaginacion(paginacion.current - 1)}
                    disabled={!paginacion.hasPrev}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                      paginacion.hasPrev
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                  </button>
                  <button
                    onClick={() => handlePaginacion(paginacion.current + 1)}
                    disabled={!paginacion.hasNext}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                      paginacion.hasNext
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Siguiente
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para agregar repuesto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Nuevo Repuesto</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                    <input 
                      name="nombre" 
                      value={form.nombre} 
                      onChange={handleChange} 
                      placeholder="Nombre del repuesto" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código *</label>
                    <input 
                      name="codigo" 
                      value={form.codigo} 
                      onChange={handleChange} 
                      placeholder="Código único" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                    <input 
                      name="stock" 
                      value={form.stock} 
                      onChange={handleChange} 
                      placeholder="Cantidad en stock" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      type="number" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                    <input 
                      name="precio" 
                      value={form.precio} 
                      onChange={handleChange} 
                      placeholder="Precio unitario" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      type="number" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <input 
                      name="categoria" 
                      value={form.categoria} 
                      onChange={handleChange} 
                      placeholder="Categoría del repuesto" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
                    <input 
                      name="ubicacion" 
                      value={form.ubicacion} 
                      onChange={handleChange} 
                      placeholder="Ubicación física" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                  <input 
                    name="proveedor" 
                    value={form.proveedor} 
                    onChange={handleChange} 
                    placeholder="Nombre del proveedor" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea 
                    name="descripcion" 
                    value={form.descripcion} 
                    onChange={handleChange} 
                    placeholder="Descripción detallada del repuesto..." 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    rows="3" 
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
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
          item={selectedRepuesto}
          onClose={() => setSelectedRepuesto(null)}
          onSave={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default RepuestoForm;
