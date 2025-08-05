/**
 * MaquinariaForm Modular - Versión con Sistema de Estilos Modulares
 * 
 * Esta versión utiliza el sistema de design tokens y componentes modulares
 * para mantener consistencia visual y facilitar el mantenimiento.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { 
  createMaquinaria, 
  updateMaquinaria, 
  getMaquinarias, 
  deleteMaquinaria, 
  getMaquinariaFilters 
} from '../services/api';

// Importar sistema de estilos modulares
import {
  StyledPageWrapper,
  ContentSection,
  StyledForm,
  StyledList,
  ResponsiveGrid,
  Alert,
  LoadingState,
  usePageState,
  PAGE_STYLES,
  classNames
} from '../styles';

// Componentes específicos
import MaquinariaEditModal from '../components/MaquinariaEditModal';
import EstadoIcon from '../components/EstadoIcon';
import { getColorFromString } from '../utils/colorUtils';
import { 
  sortMaquinariasByCategory, 
  buildMaquinariaQueryParams, 
  clearMaquinariaFilters, 
  getEstadoColorClass, 
  formatAnio 
} from '../utils/maquinariaUtils';

function MaquinariaFormModular({ token, onCreated }) {
  const navigate = useNavigate();
  const pageState = usePageState(false);
  
  // Estados del formulario
  const [form, setForm] = useState({
    nombre: '', 
    modelo: '', 
    categoria: '', 
    anio: '', 
    numero_serie: '', 
    descripcion: '', 
    proveedor: '', 
    ubicacion: '', 
    estado: ''
  });
  
  // Estados de la aplicación
  const [maquinarias, setMaquinarias] = useState([]);
  const [selectedMaquinaria, setSelectedMaquinaria] = useState(null);
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    search: '',
    categoria: '',
    ubicacion: '',
    estado: '',
    anioMin: '',
    anioMax: ''
  });
  
  const [opcionesFiltros, setOpcionesFiltros] = useState({
    categorias: [],
    ubicaciones: [],
    estados: [],
    anioRange: { min: 1900, max: new Date().getFullYear() }
  });
  
  // Estados de UI
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoVista, setModoVista] = useState('grid'); // 'grid' | 'list'
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 12;

  // ===== EFECTOS =====
  
  useEffect(() => {
    cargarDatos();
    cargarFiltros();
  }, [token]);

  useEffect(() => {
    cargarMaquinarias();
  }, [filtros, paginaActual]);

  // ===== FUNCIONES DE CARGA =====
  
  const cargarDatos = async () => {
    await Promise.all([
      cargarMaquinarias(),
      cargarFiltros()
    ]);
  };

  const cargarMaquinarias = async () => {
    pageState.setLoading(true);
    try {
      const params = buildMaquinariaQueryParams(filtros, paginaActual, itemsPorPagina);
      const data = await getMaquinarias(token, params, paginaActual);
      
      const maquinariasArray = Array.isArray(data) ? data : (data?.maquinarias || []);
      setMaquinarias(maquinariasArray);
      pageState.setSuccess(maquinariasArray);
    } catch (error) {
      console.error('Error cargando maquinarias:', error);
      pageState.setErrorState('Error al cargar maquinarias');
    }
  };

  const cargarFiltros = async () => {
    try {
      const filtrosData = await getMaquinariaFilters(token);
      setOpcionesFiltros(prev => ({
        ...prev,
        ...filtrosData
      }));
    } catch (error) {
      console.error('Error cargando filtros:', error);
    }
  };

  // ===== FUNCIONES DEL FORMULARIO =====
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    pageState.setLoading(true);
    setError('');

    try {
      await createMaquinaria(token, form);
      
      // Resetear formulario
      setForm({
        nombre: '', modelo: '', categoria: '', anio: '', numero_serie: '', 
        descripcion: '', proveedor: '', ubicacion: '', estado: ''
      });
      
      // Recargar datos
      await cargarMaquinarias();
      if (onCreated) onCreated();
      
      setBulkSuccess('Maquinaria creada exitosamente');
      setTimeout(() => setBulkSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error creando maquinaria:', error);
      setError(error.response?.data?.error || 'Error al crear maquinaria');
    } finally {
      pageState.setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta maquinaria?')) return;
    
    try {
      await deleteMaquinaria(token, id);
      await cargarMaquinarias();
      setBulkSuccess('Maquinaria eliminada exitosamente');
      setTimeout(() => setBulkSuccess(''), 3000);
    } catch (error) {
      setError('Error al eliminar maquinaria');
    }
  };

  // ===== FUNCIONES DE FILTROS =====
  
  const aplicarFiltro = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    setFiltros(clearMaquinariaFilters());
    setPaginaActual(1);
  };

  // ===== FUNCIONES DE IMPORTACIÓN =====
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          pageState.setLoading(true);
          setBulkError('');
          setBulkSuccess('');

          for (const row of results.data) {
            if (row.nombre) {
              await createMaquinaria(token, {
                nombre: row.nombre || '',
                modelo: row.modelo || '',
                categoria: row.categoria || '',
                anio: row.anio ? parseInt(row.anio) : '',
                numero_serie: row.numero_serie || '',
                descripcion: row.descripcion || '',
                proveedor: row.proveedor || '',
                ubicacion: row.ubicacion || '',
                estado: row.estado || 'operativa'
              });
            }
          }

          await cargarMaquinarias();
          setBulkSuccess(`${results.data.length} maquinarias importadas exitosamente`);
        } catch (error) {
          setBulkError('Error en la importación masiva');
        } finally {
          pageState.setLoading(false);
        }
      }
    });
  };

  // ===== RENDER DE COMPONENTES =====
  
  const renderMaquinariaCard = (maquinaria) => (
    <div 
      key={maquinaria.id}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{maquinaria.nombre}</h3>
          <p className="text-sm text-gray-600">{maquinaria.modelo}</p>
        </div>
        <EstadoIcon estado={maquinaria.estado} />
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <span className="font-medium w-20">Categoría:</span>
          <span 
            className="px-2 py-1 rounded text-xs font-medium"
            style={{ 
              backgroundColor: getColorFromString(maquinaria.categoria) + '20',
              color: getColorFromString(maquinaria.categoria)
            }}
          >
            {maquinaria.categoria}
          </span>
        </div>
        
        {maquinaria.anio && (
          <div className="flex items-center">
            <span className="font-medium w-20">Año:</span>
            <span>{formatAnio(maquinaria.anio)}</span>
          </div>
        )}
        
        {maquinaria.ubicacion && (
          <div className="flex items-center">
            <span className="font-medium w-20">Ubicación:</span>
            <span>{maquinaria.ubicacion}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => navigate(`/maquinaria/${maquinaria.id}`)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Ver detalles
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedMaquinaria(maquinaria);
              setMostrarModal(true);
            }}
            className="text-gray-600 hover:text-gray-800 text-sm"
          >
            Editar
          </button>
          <button
            onClick={() => handleDelete(maquinaria.id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  const renderFiltros = () => (
    <ContentSection title="Filtros de Búsqueda">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Búsqueda general */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <input
            type="text"
            value={filtros.search}
            onChange={(e) => aplicarFiltro('search', e.target.value)}
            placeholder="Nombre, modelo, serie..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filtro por categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={filtros.categoria}
            onChange={(e) => aplicarFiltro('categoria', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las categorías</option>
            {opcionesFiltros.categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Filtro por estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={filtros.estado}
            onChange={(e) => aplicarFiltro('estado', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            {opcionesFiltros.estados.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>

        {/* Filtro por ubicación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <select
            value={filtros.ubicacion}
            onChange={(e) => aplicarFiltro('ubicacion', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las ubicaciones</option>
            {opcionesFiltros.ubicaciones.map(ubi => (
              <option key={ubi} value={ubi}>{ubi}</option>
            ))}
          </select>
        </div>

        {/* Rango de años */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año mínimo
          </label>
          <input
            type="number"
            value={filtros.anioMin}
            onChange={(e) => aplicarFiltro('anioMin', e.target.value)}
            min={opcionesFiltros.anioRange.min}
            max={opcionesFiltros.anioRange.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año máximo
          </label>
          <input
            type="number"
            value={filtros.anioMax}
            onChange={(e) => aplicarFiltro('anioMax', e.target.value)}
            min={opcionesFiltros.anioRange.min}
            max={opcionesFiltros.anioRange.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={limpiarFiltros}
          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
        >
          Limpiar filtros
        </button>
        
        <div className="text-sm text-gray-600">
          {maquinarias.length} maquinaria(s) encontrada(s)
        </div>
      </div>
    </ContentSection>
  );

  // ===== RENDER PRINCIPAL =====
  
  return (
    <StyledPageWrapper
      title="🚜 Gestión de Maquinarias"
      subtitle="Administra el inventario de maquinarias agrícolas"
      loading={pageState.loading}
      error={pageState.error}
    >
      {/* Alertas */}
      {bulkSuccess && (
        <Alert type="success" title="Éxito" onClose={() => setBulkSuccess('')}>
          {bulkSuccess}
        </Alert>
      )}
      
      {bulkError && (
        <Alert type="error" title="Error" onClose={() => setBulkError('')}>
          {bulkError}
        </Alert>
      )}
      
      {error && (
        <Alert type="error" title="Error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Formulario de nueva maquinaria */}
      <StyledForm
        title="Agregar Nueva Maquinaria"
        onSubmit={handleSubmit}
        loading={pageState.loading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({...form, nombre: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo
            </label>
            <input
              type="text"
              value={form.modelo}
              onChange={(e) => setForm({...form, modelo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <input
              type="text"
              value={form.categoria}
              onChange={(e) => setForm({...form, categoria: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año
            </label>
            <input
              type="number"
              value={form.anio}
              onChange={(e) => setForm({...form, anio: e.target.value})}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Serie
            </label>
            <input
              type="text"
              value={form.numero_serie}
              onChange={(e) => setForm({...form, numero_serie: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={form.estado}
              onChange={(e) => setForm({...form, estado: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar estado</option>
              <option value="operativa">Operativa</option>
              <option value="mantenimiento">En Mantenimiento</option>
              <option value="reparacion">En Reparación</option>
              <option value="inactiva">Inactiva</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({...form, descripcion: e.target.value})}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Importar desde CSV
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="text-sm text-gray-600"
            />
          </div>
          
          <button
            type="submit"
            disabled={pageState.loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {pageState.loading ? 'Guardando...' : 'Guardar Maquinaria'}
          </button>
        </div>
      </StyledForm>

      {/* Filtros */}
      {renderFiltros()}

      {/* Lista de maquinarias */}
      <ContentSection 
        title={`Maquinarias Registradas (${maquinarias.length})`}
      >
        <ResponsiveGrid columns="cards">
          {maquinarias.map(renderMaquinariaCard)}
        </ResponsiveGrid>
        
        {maquinarias.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🚜</div>
            <p>No se encontraron maquinarias</p>
          </div>
        )}
      </ContentSection>

      {/* Modal de edición */}
      {mostrarModal && selectedMaquinaria && (
        <MaquinariaEditModal
          maquinaria={selectedMaquinaria}
          isOpen={mostrarModal}
          onClose={() => {
            setMostrarModal(false);
            setSelectedMaquinaria(null);
          }}
          onSave={async () => {
            await cargarMaquinarias();
            setMostrarModal(false);
            setSelectedMaquinaria(null);
          }}
          token={token}
        />
      )}
    </StyledPageWrapper>
  );
}

export default MaquinariaFormModular;
