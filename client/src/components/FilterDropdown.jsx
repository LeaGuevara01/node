/**
 * FilterDropdown - Componente de filtros desplegables
 *
 * Proporciona filtros avanzados para secciones de la aplicación:
 * - Filtros por categoría, estado, fecha
 * - Búsqueda rápida
 * - Ordenamiento
 * - Reset de filtros
 *
 * @param {Object} filters - Filtros actuales
 * @param {Function} onFiltersChange - Callback cuando cambian filtros
 * @param {Array} categories - Categorías disponibles
 * @param {Array} statuses - Estados disponibles
 * @param {string} section - Sección actual (maquinarias, repuestos, etc.)
 * @param {boolean} isOpen - Si el dropdown está abierto
 * @param {Function} onToggle - Toggle del dropdown
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Filter,
  X,
  Search,
  Calendar,
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

const FilterDropdown = ({
  filters = {},
  onFiltersChange,
  categories = [],
  statuses = [],
  section = '',
  isOpen = false,
  onToggle,
  data = [], // Datos para generar sugerencias
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [activeSuggestions, setActiveSuggestions] = useState({}); // Control de sugerencias por campo
  const [suggestionInputs, setSuggestionInputs] = useState({}); // Valores de input para sugerencias
  const dropdownRef = useRef(null);
  const inputRefs = useRef({}); // Referencias a los inputs

  // Configuración de filtros por sección con sugerencias
  const sectionConfig = {
    maquinarias: {
      fields: [
        {
          key: 'tipo',
          label: 'Tipo de Maquinaria',
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
        {
          key: 'marca',
          label: 'Marca',
          type: 'text',
          suggestions: true,
          getSuggestions: (inputValue) => {
            if (!data || !Array.isArray(data)) return [];
            const marcas = [...new Set(data.map((item) => item.marca).filter(Boolean))];
            return marcas.filter((marca) => marca.toLowerCase().includes(inputValue.toLowerCase()));
          },
        },
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
        {
          key: 'proveedor',
          label: 'Proveedor',
          type: 'text',
          suggestions: true,
          getSuggestions: (inputValue) => {
            if (!data || !Array.isArray(data)) return [];
            const proveedores = [
              ...new Set(
                data.map((item) => item.proveedor || item.nombreProveedor).filter(Boolean)
              ),
            ];
            return proveedores.filter((proveedor) =>
              proveedor.toLowerCase().includes(inputValue.toLowerCase())
            );
          },
        },
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
        {
          key: 'localidad',
          label: 'Localidad',
          type: 'text',
          suggestions: true,
          getSuggestions: (inputValue) => {
            if (!data || !Array.isArray(data)) return [];
            const localidades = [
              ...new Set(data.map((item) => item.localidad || item.ciudad).filter(Boolean)),
            ];
            return localidades.filter((localidad) =>
              localidad.toLowerCase().includes(inputValue.toLowerCase())
            );
          },
        },
        { key: 'activo', label: 'Solo Activos', type: 'checkbox' },
      ],
    },
    reparaciones: {
      fields: [
        {
          key: 'estado',
          label: 'Estado',
          type: 'select',
          options: ['Pendiente', 'En proceso', 'Completada', 'Cancelada'],
        },
        {
          key: 'tipo',
          label: 'Tipo',
          type: 'select',
          options: ['Preventivo', 'Correctivo', 'Emergencia'],
        },
        { key: 'fechaInicio', label: 'Fecha Inicio', type: 'date' },
        { key: 'fechaFin', label: 'Fecha Fin', type: 'date' },
      ],
    },
  };

  const currentFields = sectionConfig[section]?.fields || [];

  // Funciones para manejar sugerencias
  const showSuggestions = (fieldKey, show = true) => {
    setActiveSuggestions((prev) => ({
      ...prev,
      [fieldKey]: show,
    }));
  };

  const hideSuggestions = (fieldKey) => {
    // Delay para permitir click en sugerencias
    setTimeout(() => {
      setActiveSuggestions((prev) => ({
        ...prev,
        [fieldKey]: false,
      }));
    }, 200);
  };

  const handleSuggestionClick = (fieldKey, suggestion) => {
    updateFilter(fieldKey, suggestion);
    setSuggestionInputs((prev) => ({
      ...prev,
      [fieldKey]: suggestion,
    }));
    hideSuggestions(fieldKey);
  };

  const handleTextInputChange = (fieldKey, value) => {
    setSuggestionInputs((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
    updateFilter(fieldKey, value);

    // Mostrar sugerencias si el campo las soporta
    const field = currentFields.find((f) => f.key === fieldKey);
    if (field?.suggestions && value.length > 0) {
      showSuggestions(fieldKey);
    } else {
      hideSuggestions(fieldKey);
    }
  };

  const getSuggestionsForField = (field, inputValue = '') => {
    if (!field.suggestions || !field.getSuggestions) return [];
    if (inputValue.length === 0) return [];
    return field.getSuggestions(inputValue).slice(0, 8); // Máximo 8 sugerencias
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
        // Cerrar todas las sugerencias
        setActiveSuggestions({});
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

  // Aplicar filtros
  const handleApplyFilters = () => {
    const newFilters = {
      ...localFilters,
      search: searchTerm,
    };
    onFiltersChange(newFilters);
    setActiveSuggestions({}); // Cerrar todas las sugerencias
    onToggle(false);
  };

  // Resetear filtros
  const handleResetFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    setSearchTerm('');
    setSuggestionInputs({}); // Limpiar inputs de sugerencias
    setActiveSuggestions({}); // Cerrar todas las sugerencias
    onFiltersChange(emptyFilters);
  };

  // Actualizar filtro local
  const updateFilter = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Contar filtros activos
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
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Filter size={18} className="mr-2" />
            Filtros de {section?.charAt(0).toUpperCase() + section?.slice(1)}
          </h3>
          <button onClick={() => onToggle(false)} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={18} />
          </button>
        </div>

        {/* Búsqueda rápida */}
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

        {/* Filtros específicos */}
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

              {field.type === 'text' && (
                <div className="relative">
                  <input
                    ref={(el) => {
                      if (el) inputRefs.current[field.key] = el;
                    }}
                    type="text"
                    placeholder={`Filtrar por ${field.label.toLowerCase()}`}
                    value={
                      suggestionInputs[field.key] !== undefined
                        ? suggestionInputs[field.key]
                        : localFilters[field.key] || ''
                    }
                    onChange={(e) => handleTextInputChange(field.key, e.target.value)}
                    onFocus={() => {
                      if (field.suggestions) {
                        const inputValue =
                          suggestionInputs[field.key] || localFilters[field.key] || '';
                        if (inputValue.length > 0) {
                          showSuggestions(field.key);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (field.suggestions) {
                        hideSuggestions(field.key);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {/* Lista de sugerencias */}
                  {field.suggestions && activeSuggestions[field.key] && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-50">
                      {(() => {
                        const inputValue =
                          suggestionInputs[field.key] || localFilters[field.key] || '';
                        const suggestions = getSuggestionsForField(field, inputValue);

                        if (suggestions.length === 0) {
                          return (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              {inputValue.length > 0
                                ? 'No se encontraron sugerencias'
                                : 'Escribe para ver sugerencias'}
                            </div>
                          );
                        }

                        return suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100 last:border-b-0"
                            onClick={() => handleSuggestionClick(field.key, suggestion)}
                            onMouseDown={(e) => e.preventDefault()} // Previene blur del input
                          >
                            <div className="flex items-center">
                              <Search size={12} className="mr-2 text-gray-400" />
                              {suggestion}
                            </div>
                          </button>
                        ));
                      })()}
                    </div>
                  )}

                  {/* Indicador de sugerencias disponibles */}
                  {field.suggestions && !activeSuggestions[field.key] && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <ChevronDown size={16} className="text-gray-400" />
                    </div>
                  )}
                </div>
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

              {field.type === 'date' && (
                <input
                  type="date"
                  value={localFilters[field.key] || ''}
                  onChange={(e) => updateFilter(field.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              )}

              {field.type === 'range' && (
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    min={field.min}
                    max={field.max}
                    value={localFilters[field.key]?.min || ''}
                    onChange={(e) =>
                      updateFilter(field.key, {
                        ...localFilters[field.key],
                        min: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Máx"
                    min={field.min}
                    max={field.max}
                    value={localFilters[field.key]?.max || ''}
                    onChange={(e) =>
                      updateFilter(field.key, {
                        ...localFilters[field.key],
                        max: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer con acciones */}
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

export default FilterDropdown;
