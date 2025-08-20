import React, { useState, useEffect, useRef } from 'react';
import { Filter, X, Search, RotateCcw, SlidersHorizontal } from 'lucide-react';

const UniversalFilterSystem = ({
  filters = {},
  onFiltersChange,
  section = '',
  isOpen = false,
  onToggle,
  data = [],
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const dropdownRef = useRef(null);

  const sectionConfig = {
    maquinarias: {
      fields: [
        {
          key: 'tipo',
          label: 'Tipo',
          type: 'select',
          options: ['Tractor', 'Cosechadora', 'Arado', 'Sembradora'],
        },
        {
          key: 'estado',
          label: 'Estado',
          type: 'select',
          options: ['Operativa', 'En mantenimiento', 'Averiada', 'Fuera de servicio'],
        },
        { key: 'año', label: 'Año', type: 'range', min: 1990, max: new Date().getFullYear() },
        { key: 'marca', label: 'Marca', type: 'text-suggestions' },
        { key: 'modelo', label: 'Modelo', type: 'text-suggestions' },
      ],
    },
    repuestos: {
      fields: [
        {
          key: 'categoria',
          label: 'Categoría',
          type: 'select',
          options: ['Motor', 'Transmisión', 'Hidráulico', 'Eléctrico'],
        },
        { key: 'stockBajo', label: 'Stock Bajo', type: 'checkbox' },
        { key: 'proveedor', label: 'Proveedor', type: 'text-suggestions' },
        { key: 'precio', label: 'Precio', type: 'range', min: 0, max: 10000 },
      ],
    },
    proveedores: {
      fields: [
        {
          key: 'tipo',
          label: 'Tipo',
          type: 'select',
          options: ['Repuestos', 'Servicios', 'Maquinaria', 'Combustible'],
        },
        { key: 'localidad', label: 'Localidad', type: 'text-suggestions' },
        { key: 'activo', label: 'Solo Activos', type: 'checkbox' },
      ],
    },
  };

  const currentFields = sectionConfig[section]?.fields || [];

  const updateFilter = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    const newFilters = {
      ...localFilters,
      search: searchTerm,
    };
    onFiltersChange(newFilters);
    onToggle(false);
  };

  const handleResetFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    setSearchTerm('');
    onFiltersChange(emptyFilters);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const activeFiltersCount =
    Object.keys(localFilters).filter(
      (key) => localFilters[key] !== '' && localFilters[key] !== false && localFilters[key] != null
    ).length + (searchTerm ? 1 : 0);

  if (!isOpen) {
    return (
      <button
        onClick={() => onToggle(true)}
        className={`
          inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg
          bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          transition-colors duration-200 relative
          ${activeFiltersCount > 0 ? 'text-blue-600 border-blue-300' : 'text-gray-700'}
        `}
      >
        <SlidersHorizontal size={16} className="mr-2" />
        Filtros
        {activeFiltersCount > 0 && (
          <span className="ml-2 bg-blue-100 text-blue-600 text-xs rounded-full px-2 py-0.5">
            {activeFiltersCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <div className="absolute top-0 right-0 z-50 bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter size={18} className="mr-2" />
            Filtros de {section?.charAt(0).toUpperCase() + section?.slice(1)}
          </h3>
          <button onClick={() => onToggle(false)} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">Búsqueda general</label>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
          {currentFields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>

              {field.type === 'select' && (
                <select
                  value={localFilters[field.key] || ''}
                  onChange={(e) => updateFilter(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'text-suggestions' && (
                <input
                  type="text"
                  placeholder={`Filtrar por ${field.label.toLowerCase()}`}
                  value={localFilters[field.key] || ''}
                  onChange={(e) => updateFilter(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}

              {field.type === 'checkbox' && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={localFilters[field.key] || false}
                    onChange={(e) => updateFilter(field.key, e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{field.label}</span>
                </label>
              )}

              {field.type === 'range' && (
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    min={field.min}
                    max={field.max}
                    value={localFilters[field.key + 'Min'] || ''}
                    onChange={(e) => updateFilter(field.key + 'Min', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    min={field.min}
                    max={field.max}
                    value={localFilters[field.key + 'Max'] || ''}
                    onChange={(e) => updateFilter(field.key + 'Max', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw size={16} className="mr-2" />
            Resetear
          </button>

          <div className="flex space-x-2">
            <button
              onClick={() => onToggle(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalFilterSystem;
