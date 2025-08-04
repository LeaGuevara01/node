import React, { useState, useEffect } from 'react';
import { getRepuestos } from '../services/api';

const RepuestosPage = ({ token, role }) => {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    categorias: [],
    ubicaciones: [],
    stockRange: { min: 0, max: 0 }
  });
  
  // Estado de filtros
  const [filters, setFilters] = useState({
    search: '',
    categoria: 'all',
    ubicacion: 'all',
    stockMin: '',
    stockMax: '',
    sinStock: false,
    codigo: '',
    page: 1,
    limit: 20,
    sortBy: 'nombre',
    sortOrder: 'asc'
  });

  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    hasNext: false,
    hasPrev: false,
    totalItems: 0
  });

  // Cargar opciones de filtros al montar el componente
  useEffect(() => {
    loadFilterOptions();
  }, []);

  // Cargar repuestos cuando cambien los filtros
  useEffect(() => {
    loadRepuestos();
  }, [filters]);

  const loadFilterOptions = async () => {
    try {
      const response = await fetch('/api/repuestos/filtros', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setFilterOptions(data);
    } catch (error) {
      console.error('Error cargando opciones de filtros:', error);
    }
  };

  const loadRepuestos = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      // Agregar parámetros no vacíos
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== 'all' && value !== false) {
          queryParams.append(key, value);
        }
        if (key === 'sinStock' && value === true) {
          queryParams.append(key, 'true');
        }
      });

      const response = await fetch(`/api/repuestos?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = await response.json();
      setRepuestos(data.repuestos || data);
      
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error cargando repuestos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Resetear a primera página cuando cambian filtros
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categoria: 'all',
      ubicacion: 'all',
      stockMin: '',
      stockMax: '',
      sinStock: false,
      codigo: '',
      page: 1,
      limit: 20,
      sortBy: 'nombre',
      sortOrder: 'asc'
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const getStockBadge = (stock) => {
    if (stock <= 0) return 'bg-red-100 text-red-800';
    if (stock <= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Gestión de Repuestos</h1>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Búsqueda general */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre, código o descripción..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código
            </label>
            <input
              type="text"
              placeholder="Código específico..."
              value={filters.codigo}
              onChange={(e) => handleFilterChange('codigo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={filters.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las categorías</option>
              {filterOptions.categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>

          {/* Filtro por ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <select
              value={filters.ubicacion}
              onChange={(e) => handleFilterChange('ubicacion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las ubicaciones</option>
              {filterOptions.ubicaciones.map(ubicacion => (
                <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtros de stock */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock mínimo
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.stockMin}
              onChange={(e) => handleFilterChange('stockMin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock máximo
            </label>
            <input
              type="number"
              placeholder="999"
              value={filters.stockMax}
              onChange={(e) => handleFilterChange('stockMax', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.sinStock}
                onChange={(e) => handleFilterChange('sinStock', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Solo sin stock</span>
            </label>
          </div>

          <div className="flex items-end space-x-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Ordenamiento y resultados */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="nombre">Nombre</option>
                <option value="codigo">Código</option>
                <option value="stock">Stock</option>
                <option value="categoria">Categoría</option>
                <option value="ubicacion">Ubicación</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orden
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {pagination.totalItems > 0 ? (
              `Mostrando ${((pagination.current - 1) * filters.limit) + 1}-${Math.min(pagination.current * filters.limit, pagination.totalItems)} de ${pagination.totalItems} repuestos`
            ) : (
              'No se encontraron repuestos'
            )}
          </div>
        </div>
      </div>

      {/* Lista de repuestos */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando repuestos...</p>
          </div>
        ) : repuestos.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No se encontraron repuestos con los filtros aplicados
          </div>
        ) : (
          <>
            {/* Tabla de repuestos */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Repuesto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {repuestos.map((repuesto) => (
                    <tr key={repuesto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {repuesto.nombre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {repuesto.codigo || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockBadge(repuesto.stock)}`}>
                          {repuesto.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {repuesto.categoria || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {repuesto.ubicacion || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {repuesto.descripcion || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {pagination.total > 1 && (
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.current - 1)}
                      disabled={!pagination.hasPrev}
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Anterior
                    </button>
                    
                    <span className="text-sm text-gray-700">
                      Página {pagination.current} de {pagination.total}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(pagination.current + 1)}
                      disabled={!pagination.hasNext}
                      className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Siguiente
                    </button>
                  </div>

                  <div>
                    <select
                      value={filters.limit}
                      onChange={(e) => handleFilterChange('limit', e.target.value)}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="10">10 por página</option>
                      <option value="20">20 por página</option>
                      <option value="50">50 por página</option>
                      <option value="100">100 por página</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RepuestosPage;
