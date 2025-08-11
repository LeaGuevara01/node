// Archivo optimizado para ProveedorForm.jsx con utilidades modulares
// Este archivo es una versión refactorizada que usa las utilidades creadas

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { createProveedor, updateProveedor, getProveedores, deleteProveedor } from '../services/api';
import ProveedorEditModal from '../components/ProveedorEditModal';
import { getColorFromString } from '../utils/colorUtils';
import AppLayout from '../components/navigation/AppLayout';
import { 
  sortProveedoresByName, 
  buildProveedorQueryParams, 
  clearProveedorFilters,
  formatCuit,
  formatTelefono,
  getCiudadColorClass,
  extractCiudadFromDireccion,
  formatProductos,
  parseProductos,
  validateEmail,
  validateUrl,
  formatUrl
} from '../utils/proveedorUtils';
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
import { DETAILS_CONTAINER } from '../styles/detailsStyles';
import { PROVEEDOR_STYLES } from '../styles/proveedorStyles';

function ProveedorForm({ token, onCreated }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '', cuit: '', telefono: '', email: '', direccion: '', web: '', productos: ''
  });
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    search: '',
    ciudad: '',
    productos: ''
  });
  const [opcionesFiltros, setOpcionesFiltros] = useState({
    ciudades: [],
    productos: []
  });
  const [paginacion, setPaginacion] = useState({
    current: 1,
    total: 1,
    totalItems: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchProveedores = async (filtrosActuales = filtros, pagina = 1) => {
    setLoading(true);
    try {
      const params = buildProveedorQueryParams(filtrosActuales, pagina);

      console.log('Fetching with params:', params.toString());

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/proveedores?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      console.log('API Response:', data);
      
      if (data.proveedores) {
        const proveedoresOrdenados = sortProveedoresByName(data.proveedores);
        setProveedores(proveedoresOrdenados);
        setPaginacion(data.pagination || { current: 1, total: 1, totalItems: 0 });
      } else {
        const allProveedores = await getProveedores(token);
        const proveedoresOrdenados = sortProveedoresByName(allProveedores || []);
        setProveedores(proveedoresOrdenados);
      }
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
      setProveedores([]);
      setError('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  const fetchOpcionesFiltros = async () => {
    try {
      // Since the filtros endpoint doesn't exist, we'll populate from the main data
      const proveedoresData = await getProveedores(token);
      if (proveedoresData && proveedoresData.length > 0) {
        const ubicaciones = [...new Set(proveedoresData.map(p => p.ubicacion).filter(Boolean))];
        const sectores = [...new Set(proveedoresData.map(p => p.sector).filter(Boolean))];
        
        // Extraer ciudades de direcciones
        const ciudades = [...new Set(
          proveedoresData
            .map(p => extractCiudadFromDireccion(p.direccion))
            .filter(Boolean)
        )];
        
        // Extraer productos (asumir que están separados por comas)
        const productos = [...new Set(
          proveedoresData
            .flatMap(p => {
              if (typeof p.productos === 'string') {
                return p.productos.split(',').map(prod => prod.trim()).filter(Boolean);
              } else if (Array.isArray(p.productos)) {
                return p.productos.filter(Boolean);
              }
              return [];
            })
        )];
        
        setOpcionesFiltros(prev => ({
          ...prev,
          ubicaciones,
          sectores,
          ciudades,
          productos
        }));
      }
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
        fetchProveedores(nuevosFiltros, 1);
      }, 300));
    } else {
      fetchProveedores(nuevosFiltros, 1);
    }
  };

  const limpiarFiltros = () => {
    const filtrosVacios = clearProveedorFilters();
    setFiltros(filtrosVacios);
    fetchProveedores(filtrosVacios, 1);
  };

  const handlePaginacion = (nuevaPagina) => {
    fetchProveedores(filtros, nuevaPagina);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    
    if (form.email && !validateEmail(form.email)) {
      setError('El formato del email no es válido');
      return;
    }
    
    if (form.web && !validateUrl(form.web)) {
      setError('El formato de la URL no es válido');
      return;
    }
    
    try {
      const proveedorData = {
        ...form,
        productos: parseProductos(form.productos)
      };
      await createProveedor(proveedorData, token);
      setForm({ nombre: '', cuit: '', telefono: '', email: '', direccion: '', web: '', productos: '' });
      setShowAddModal(false);
      if (onCreated) onCreated();
      fetchProveedores();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEditModal = (proveedor) => {
    setSelectedProveedor(proveedor);
  };

  const closeEditModal = () => {
    setSelectedProveedor(null);
  };

  const handleUpdateProveedor = async (id, proveedorData) => {
    try {
      await updateProveedor(id, proveedorData, token);
      fetchProveedores();
      fetchOpcionesFiltros(); // Actualizar opciones de filtros
      closeEditModal(); // Cerrar modal después de actualizar
      if (onCreated) onCreated();
    } catch (err) {
      console.error('Error al actualizar proveedor:', err);
      throw new Error(err.message || 'Error al actualizar el proveedor');
    }
  };

  const handleDeleteProveedor = async (id) => {
    try {
      await deleteProveedor(id, token);
      fetchProveedores();
      fetchOpcionesFiltros(); // Actualizar opciones de filtros
      closeEditModal(); // Cerrar modal después de eliminar
      if (onCreated) onCreated();
    } catch (err) {
      console.error('Error al eliminar proveedor:', err);
      throw new Error(err.message || 'Error al eliminar el proveedor');
    }
  };

  useEffect(() => {
    fetchProveedores();
    fetchOpcionesFiltros();
  }, []);

  return (
    <AppLayout
      currentSection="proveedores"
      // Usamos breadcrumbs automáticos (Inicio > Proveedores > Formulario/Editar)
      title="Gestión de Proveedores"
      subtitle="Crea y edita proveedores"
      token={token}
      hideSearchOnDesktop={true}
      collapseUserOnMd={true}
    >
      <div className={DETAILS_CONTAINER.maxWidth}>
        
        {/* Header con botones de acción */}
        <div className={`${DETAILS_CONTAINER.card} ${DETAILS_CONTAINER.cardPadding}`}>
          <div className={LAYOUT_STYLES.flexBetween}>
            <div>
              <h1 className={TEXT_STYLES.title}>Gestión de Proveedores</h1>
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
                        const validRows = results.data.filter(row => row.nombre);
                        let successCount = 0, failCount = 0;
                        
                        for (const row of validRows) {
                          try {
                            await createProveedor({
                              nombre: row.nombre || '',
                              cuit: row.cuit || '',
                              telefono: row.telefono || '',
                              email: row.email || '',
                              direccion: row.direccion || '',
                              web: row.web || '',
                              productos: parseProductos(row.productos || '')
                            }, token);
                            successCount++;
                          } catch (err) {
                            failCount++;
                          }
                        }
                        setBulkSuccess(`Creados: ${successCount}`);
                        setBulkError(failCount ? `Fallidos: ${failCount}` : '');
                        if (onCreated && successCount) onCreated();
                        fetchProveedores();
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
                Nuevo Proveedor
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
        <div className={`${DETAILS_CONTAINER.card} ${DETAILS_CONTAINER.cardPadding}`}>
          <h2 className={TEXT_STYLES.sectionTitle}>Filtros</h2>
          
          <div className={PROVEEDOR_STYLES.filters.container}>
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
                  placeholder="Buscar proveedores..."
                  className={`${INPUT_STYLES.withIcon} ${INPUT_STYLES.placeholder}`}
                />
              </div>
            </div>

            {/* Ciudad */}
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <select
                  value={filtros.ciudad}
                  onChange={(e) => handleFiltroChange('ciudad', e.target.value)}
                  className={INPUT_STYLES.select}
                >
                  <option value="" className={INPUT_STYLES.selectPlaceholder}>Ciudades</option>
                  {opcionesFiltros.ciudades?.map(ciudad => (
                    <option key={ciudad} value={ciudad}>{ciudad}</option>
                  ))}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Productos */}
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <select
                  value={filtros.productos}
                  onChange={(e) => handleFiltroChange('productos', e.target.value)}
                  className={INPUT_STYLES.select}
                >
                  <option value="" className={INPUT_STYLES.selectPlaceholder}>Productos</option>
                  {opcionesFiltros.productos?.map(producto => (
                    <option key={producto} value={producto}>{producto}</option>
                  ))}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
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

        {/* Lista de Proveedores */}
        <div className={`${DETAILS_CONTAINER.card} overflow-hidden`}>
          <div className={`${DETAILS_CONTAINER.cardPadding} border-b border-gray-200`}>
            <div className={LAYOUT_STYLES.flexBetween}>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Proveedores</h3>
                <p className={TEXT_STYLES.subtitle}>Ordenados alfabéticamente</p>
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
            {proveedores.length === 0 ? (
              <div className={LIST_STYLES.emptyState}>
                No hay proveedores que coincidan con los filtros
              </div>
            ) : (
              proveedores.map((proveedor) => (
                <div key={proveedor.id} className={LIST_STYLES.item}>
                  <div className={`${LIST_STYLES.itemContent} list-item-content`}>
                    <div className="flex-1">
                      <div className={LIST_STYLES.itemHeader}>
                        <h3 className={TEXT_STYLES.itemTitle}>{proveedor.nombre}</h3>
                        <div className={LIST_STYLES.itemActions}>
                          <button
                            onClick={() => navigate(`/proveedores/${proveedor.id}`)}
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
                          {proveedor.cuit && (
                            <span className={`${LIST_STYLES.itemTagCode} bg-blue-100 text-blue-700 hidden sm:flex`} title={formatCuit(proveedor.cuit)}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="tag-truncate">{formatCuit(proveedor.cuit)}</span>
                            </span>
                          )}
                          {proveedor.telefono && (
                            <span className={`${LIST_STYLES.itemTag} bg-green-100 text-green-700`} title={formatTelefono(proveedor.telefono)}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="tag-truncate">{formatTelefono(proveedor.telefono)}</span>
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
                          {proveedor.direccion && (
                            <span className={`${LIST_STYLES.itemTagLocation} ${getCiudadColorClass(extractCiudadFromDireccion(proveedor.direccion))}`} title={extractCiudadFromDireccion(proveedor.direccion)}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="tag-truncate">{extractCiudadFromDireccion(proveedor.direccion)}</span>
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

        {/* Modal de agregar proveedor */}
        {showAddModal && (
          <div className={MODAL_STYLES.overlay}>
            <div className={MODAL_STYLES.container}>
              <div className={MODAL_STYLES.content}>
                <div className={MODAL_STYLES.header}>
                  <h2 className={MODAL_STYLES.title}>Nuevo Proveedor</h2>
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
                      <label className={INPUT_STYLES.label}>Nombre *</label>
                      <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => setForm({...form, nombre: e.target.value})}
                        className={INPUT_STYLES.base}
                        required
                      />
                    </div>
                    <div>
                      <label className={INPUT_STYLES.label}>CUIT</label>
                      <input
                        type="text"
                        value={form.cuit}
                        onChange={(e) => setForm({...form, cuit: e.target.value})}
                        className={INPUT_STYLES.base}
                        placeholder="20-12345678-9"
                      />
                    </div>
                    <div>
                      <label className={INPUT_STYLES.label}>Teléfono</label>
                      <input
                        type="text"
                        value={form.telefono}
                        onChange={(e) => setForm({...form, telefono: e.target.value})}
                        className={INPUT_STYLES.base}
                        placeholder="(011) 1234-5678"
                      />
                    </div>
                    <div>
                      <label className={INPUT_STYLES.label}>Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                        className={INPUT_STYLES.base}
                        placeholder="contacto@proveedor.com"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={INPUT_STYLES.label}>Dirección</label>
                      <input
                        type="text"
                        value={form.direccion}
                        onChange={(e) => setForm({...form, direccion: e.target.value})}
                        className={INPUT_STYLES.base}
                        placeholder="Calle 123, Ciudad, Provincia"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={INPUT_STYLES.label}>Sitio Web</label>
                      <input
                        type="text"
                        value={form.web}
                        onChange={(e) => setForm({...form, web: e.target.value})}
                        className={INPUT_STYLES.base}
                        placeholder="www.proveedor.com"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={INPUT_STYLES.label}>Productos (separados por coma)</label>
                      <textarea
                        value={form.productos}
                        onChange={(e) => setForm({...form, productos: e.target.value})}
                        className={INPUT_STYLES.base}
                        rows={3}
                        placeholder="Repuestos hidráulicos, Filtros, Aceites..."
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
                      Crear Proveedor
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

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
      </div>
    </AppLayout>
  );
}

export default ProveedorForm;
