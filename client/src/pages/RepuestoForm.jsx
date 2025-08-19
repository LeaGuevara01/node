// Archivo optimizado para RepuestoForm.jsx con utilidades modulares
// Este archivo es una versión refactorizada que usa las utilidades creadas

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  POSITION_STYLES,
  RANGE_STYLES,
} from '../styles/repuestoStyles';

function RepuestoForm({ token, onCreated }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    stock: '',
    codigo: '',
    descripcion: '',
  // precio: '', // DEPRECATED: campo eliminado del modelo
    proveedor: '',
    ubicacion: '',
    categoria: '',
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
    stockMax: '',
    sinStock: false,
  });
  const [opcionesFiltros, setOpcionesFiltros] = useState({
    categorias: [],
    ubicaciones: [],
    stockRange: { min: 0, max: 100 },
  });
  const [paginacion, setPaginacion] = useState({
    current: 1,
    total: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchRepuestos = async (filtrosActuales = filtros, pagina = 1) => {
    setLoading(true);
    try {
      const params = buildQueryParams(filtrosActuales, pagina);

      console.log('Fetching with params:', params.toString());

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/repuestos?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/repuestos/filtros`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
      setSearchTimeout(
        setTimeout(() => {
          fetchRepuestos(nuevosFiltros, 1);
        }, 300)
      );
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
  // precio: Number(form.precio), // DEPRECATED
        stock: Number(form.stock),
      };
      await createRepuesto(repuestoData, token);
      setForm({
        nombre: '',
        stock: '',
        codigo: '',
        descripcion: '',
  // precio: '', // DEPRECATED
        proveedor: '',
        ubicacion: '',
        categoria: '',
      });
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
      fetchOpcionesFiltros(); // Actualizar opciones de filtros
      if (onCreated) onCreated();
    } catch (err) {
      console.error('Error al actualizar repuesto:', err);
      throw new Error(err.message || 'Error al actualizar el repuesto');
    }
  };

  const handleDeleteRepuesto = async (id) => {
    try {
      await deleteRepuesto(id, token);
      fetchRepuestos();
      fetchOpcionesFiltros(); // Actualizar opciones de filtros
      if (onCreated) onCreated();
    } catch (err) {
      console.error('Error al eliminar repuesto:', err);
      throw new Error(err.message || 'Error al eliminar el repuesto');
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
                    setBulkError('');
                    setBulkSuccess('');

                    Papa.parse(file, {
                      header: true,
                      complete: async (results) => {
                        const validRows = results.data.filter((row) => row.nombre && row.categoria);
                        let successCount = 0,
                          failCount = 0;

                        for (const row of validRows) {
                          try {
                            await createRepuesto(
                              {
                                nombre: row.nombre || '',
                                stock: Number(row.stock) || 0,
                                codigo: row.codigo || '',
                                descripcion: row.descripcion || '',
                                // precio: Number(row.precio) || 0, // DEPRECATED
                                proveedor: row.proveedor || '',
                                ubicacion: row.ubicacion || '',
                                categoria: row.categoria || '',
                              },
                              token
                            );
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
                  <svg
                    className={ICON_STYLES.small}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Cargar CSV
                </div>
              </label>
              <button onClick={() => setShowAddModal(true)} className={BUTTON_STYLES.newItem}>
                <svg
                  className={ICON_STYLES.small}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Nuevo Repuesto
              </button>
            </div>
          </div>

          {/* Mensajes de estado para carga masiva */}
          {bulkSuccess && <div className={ALERT_STYLES.success}>{bulkSuccess}</div>}
          {bulkError && <div className={ALERT_STYLES.error}>{bulkError}</div>}
        </div>

        {/* Filtros compactos */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <h2 className={TEXT_STYLES.sectionTitle}>Filtros</h2>

          <div className={LAYOUT_STYLES.gridFilters}>
            {/* Búsqueda */}
            <div className={LAYOUT_STYLES.searchSpan}>
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg
                    className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
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
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg
                    className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <select
                  value={filtros.categoria}
                  onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                  className={INPUT_STYLES.select}
                >
                  <option value="" className={INPUT_STYLES.selectPlaceholder}>
                    Categorías
                  </option>
                  {opcionesFiltros.categorias?.map((categoria) => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg
                    className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg
                    className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <select
                  value={filtros.ubicacion}
                  onChange={(e) => handleFiltroChange('ubicacion', e.target.value)}
                  className={INPUT_STYLES.select}
                >
                  <option value="" className={INPUT_STYLES.selectPlaceholder}>
                    Ubicaciones
                  </option>
                  {opcionesFiltros.ubicaciones?.map((ubicacion) => (
                    <option key={ubicacion} value={ubicacion}>
                      {ubicacion}
                    </option>
                  ))}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg
                    className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Rango de Stock */}
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-3 xl:col-span-3 w-full">
              <div className={RANGE_STYLES.container}>
                <div className={RANGE_STYLES.wrapper}>
                  <div className={RANGE_STYLES.labelSection}>
                    <svg
                      className={RANGE_STYLES.icon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    <span className={RANGE_STYLES.labelText}>Rango de Stock</span>
                  </div>
                  <div className={RANGE_STYLES.inputsWrapper}>
                    <input
                      type="number"
                      value={filtros.stockMin}
                      onChange={(e) => handleFiltroChange('stockMin', e.target.value)}
                      placeholder="D"
                      className={`${RANGE_STYLES.input} sm:hidden`}
                      min={opcionesFiltros.stockRange?.min || 0}
                      max={opcionesFiltros.stockRange?.max || 1000}
                      step="1"
                    />
                    <input
                      type="number"
                      value={filtros.stockMin}
                      onChange={(e) => handleFiltroChange('stockMin', e.target.value)}
                      placeholder="Desde"
                      className={`${RANGE_STYLES.input} hidden sm:block`}
                      min={opcionesFiltros.stockRange?.min || 0}
                      max={opcionesFiltros.stockRange?.max || 1000}
                      step="1"
                    />
                    <span className={RANGE_STYLES.separator}>-</span>
                    <input
                      type="number"
                      value={filtros.stockMax}
                      onChange={(e) => handleFiltroChange('stockMax', e.target.value)}
                      placeholder="H"
                      className={`${RANGE_STYLES.input} sm:hidden`}
                      min={opcionesFiltros.stockRange?.min || 0}
                      max={opcionesFiltros.stockRange?.max || 1000}
                      step="1"
                    />
                    <input
                      type="number"
                      value={filtros.stockMax}
                      onChange={(e) => handleFiltroChange('stockMax', e.target.value)}
                      placeholder="Hasta"
                      className={`${RANGE_STYLES.input} hidden sm:block`}
                      min={opcionesFiltros.stockRange?.min || 0}
                      max={opcionesFiltros.stockRange?.max || 1000}
                      step="1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={LAYOUT_STYLES.gridButtons}>
            {/* Botón filtrar sin stock */}
            <button
              type="button"
              onClick={() => handleFiltroChange('sinStock', !filtros.sinStock)}
              className={`${BUTTON_STYLES.filter.clear} ${filtros.sinStock ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100' : 'bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100'}`}
            >
              <svg
                className={ICON_STYLES.medium}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              {filtros.sinStock ? 'Mostrando sin stock' : 'Filtrar sin stock'}
            </button>

            {/* Botón limpiar filtros */}
            <button type="button" onClick={limpiarFiltros} className={BUTTON_STYLES.filter.clear}>
              <svg
                className={ICON_STYLES.medium}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Lista de Repuestos */}
        <div className={`${CONTAINER_STYLES.card} overflow-hidden`}>
          <div className={`${CONTAINER_STYLES.cardPadding} border-b border-gray-200`}>
            <div className={LAYOUT_STYLES.flexBetween}>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Repuestos</h3>
                <p className={TEXT_STYLES.subtitle}>Ordenados por stock descendente</p>
              </div>
              {loading && (
                <div className={TEXT_STYLES.loading}>
                  <svg
                    className={`${ICON_STYLES.small} ${ICON_STYLES.spin}`}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    ></circle>
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      className="opacity-75"
                    ></path>
                  </svg>
                  Cargando...
                </div>
              )}
            </div>
          </div>

          {/* Lista con overflow controlado */}
          <div className={`${LIST_STYLES.divider} overflow-x-hidden`}>
            {repuestos.length === 0 ? (
              <div className={LIST_STYLES.emptyState}>
                No hay repuestos que coincidan con los filtros
              </div>
            ) : (
              repuestos.map((repuesto) => (
                <div key={repuesto.id} className={LIST_STYLES.item}>
                  <div className={`${LIST_STYLES.itemContent} list-item-content`}>
                    <div className="flex-1">
                      <div className={LIST_STYLES.itemHeader}>
                        <h3 className={TEXT_STYLES.itemTitle}>{repuesto.nombre}</h3>
                        <div className={LIST_STYLES.itemActions}>
                          <button
                            onClick={() => navigate(`/repuestos/${repuesto.id}`)}
                            className={`${BUTTON_STYLES.edit} bg-gray-50 hover:bg-gray-100 text-gray-700 mr-2`}
                            title="Ver detalles"
                          >
                            <svg
                              className={ICON_STYLES.small}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => openEditModal(repuesto)}
                            className={BUTTON_STYLES.edit}
                            title="Editar repuesto"
                          >
                            <svg
                              className={ICON_STYLES.small}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className={LIST_STYLES.itemTagsRow}>
                        <div className={`${LIST_STYLES.itemTagsLeft} tags-container-mobile`}>
                          <span
                            className={`${LIST_STYLES.itemTagCode} bg-gray-100 text-gray-700`}
                            title={repuesto.codigo || 'Sin código'}
                          >
                            <svg
                              className={ICON_STYLES.small}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="tag-truncate">{repuesto.codigo || 'Sin código'}</span>
                          </span>
                          {repuesto.ubicacion && (
                            <span
                              className={`${LIST_STYLES.itemTagLocation} ${getColorFromString(repuesto.ubicacion, 'ubicacion')}`}
                              title={repuesto.ubicacion}
                            >
                              <svg
                                className={ICON_STYLES.small}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="tag-truncate">{repuesto.ubicacion}</span>
                            </span>
                          )}
                          {repuesto.categoria && (
                            <span
                              className={`${LIST_STYLES.itemTagCategory} ${getColorFromString(repuesto.categoria, 'categoria')} hidden sm:flex`}
                              title={repuesto.categoria}
                            >
                              <svg
                                className={ICON_STYLES.small}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                              <span className="tag-truncate">{repuesto.categoria}</span>
                            </span>
                          )}
                        </div>
                        <div className={LIST_STYLES.itemTagsRight}>
                          <span
                            className={`${LIST_STYLES.itemTagStock} ${getStockColorClass(repuesto.stock, repuesto.ubicacion)}`}
                            title={`Stock: ${repuesto.stock}`}
                          >
                            <svg
                              className={ICON_STYLES.small}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                              />
                            </svg>
                            <span className="tag-truncate">{repuesto.stock}</span>
                          </span>
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
                    <svg
                      className={ICON_STYLES.small}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
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
                    <svg
                      className={ICON_STYLES.small}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
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
                      <label className={INPUT_STYLES.label}>Nombre</label>
                      <input
                        type="text"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        className={INPUT_STYLES.base}
                        required
                      />
                    </div>
                    <div>
                      <label className={INPUT_STYLES.label}>Stock</label>
                      <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        className={INPUT_STYLES.base}
                        required
                      />
                    </div>
                    <div>
                      <label className={INPUT_STYLES.label}>Código</label>
                      <input
                        type="text"
                        value={form.codigo}
                        onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                        className={INPUT_STYLES.base}
                      />
                    </div>
                    <div>
                      {/* <label className={INPUT_STYLES.label}>Precio</label> */} // DEPRECATED
                      <input
                        type="number"
                        // value={form.precio} // DEPRECATED
                        // onChange={(e) => setForm({ ...form, precio: e.target.value })} // DEPRECATED
                        className={INPUT_STYLES.base}
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className={INPUT_STYLES.label}>Proveedor</label>
                      <input
                        type="text"
                        value={form.proveedor}
                        onChange={(e) => setForm({ ...form, proveedor: e.target.value })}
                        className={INPUT_STYLES.base}
                      />
                    </div>
                    <div>
                      <label className={INPUT_STYLES.label}>Ubicación</label>
                      <input
                        type="text"
                        value={form.ubicacion}
                        onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                        className={INPUT_STYLES.base}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={INPUT_STYLES.label}>Categoría</label>
                      <input
                        type="text"
                        value={form.categoria}
                        onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                        className={INPUT_STYLES.base}
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={INPUT_STYLES.label}>Descripción</label>
                      <textarea
                        value={form.descripcion}
                        onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                        className={INPUT_STYLES.base}
                        rows={3}
                      />
                    </div>
                  </div>

                  {error && <div className={ALERT_STYLES.errorModal}>{error}</div>}

                  <div className={MODAL_STYLES.buttonGroup}>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className={BUTTON_STYLES.secondary}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className={BUTTON_STYLES.primary}>
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
