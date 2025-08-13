/**
 * Sistema de Filtros Inteligentes
 * Permite crear, guardar y aplicar filtros personalizados con tokens
 */

import React, { useState, useEffect, useMemo } from 'react';
import { StatusBadge, StatusFilter } from './StatusBadge';
import Button, { SearchButton, RefreshButton } from './Button';
import { Card } from './Layout';

/**
 * Hook para gestión de filtros inteligentes
 */
export const useSmartFilters = (initialFilters = {}, storageKey = 'smart_filters') => {
  const [filters, setFilters] = useState(initialFilters);
  const [savedFilters, setSavedFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar filtros guardados del localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    }
  }, [storageKey]);

  // Aplicar filtro
  const applyFilter = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters(initialFilters);
  };

  // Guardar filtro actual
  const saveCurrentFilter = (name, description = '') => {
    const filterToken = {
      id: Date.now().toString(),
      name,
      description,
      filters,
      createdAt: new Date().toISOString(),
      appliedCount: 0,
    };

    const updated = [...savedFilters, filterToken];
    setSavedFilters(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    return filterToken;
  };

  // Aplicar filtro guardado
  const applySavedFilter = (filterId) => {
    const savedFilter = savedFilters.find((f) => f.id === filterId);
    if (savedFilter) {
      setFilters(savedFilter.filters);

      // Incrementar contador de uso
      const updated = savedFilters.map((f) =>
        f.id === filterId
          ? { ...f, appliedCount: f.appliedCount + 1, lastUsed: new Date().toISOString() }
          : f
      );
      setSavedFilters(updated);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  // Eliminar filtro guardado
  const deleteSavedFilter = (filterId) => {
    const updated = savedFilters.filter((f) => f.id !== filterId);
    setSavedFilters(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  // Generar token de filtro (para compartir)
  const generateFilterToken = () => {
    return btoa(JSON.stringify(filters));
  };

  // Aplicar filtro desde token
  const applyFilterFromToken = (token) => {
    try {
      const decodedFilters = JSON.parse(atob(token));
      setFilters(decodedFilters);
      return true;
    } catch (error) {
      console.error('Invalid filter token:', error);
      return false;
    }
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(
      (value) =>
        value !== '' &&
        value !== null &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0)
    );
  }, [filters]);

  // Contar filtros activos
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (value) =>
        value !== '' &&
        value !== null &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0)
    ).length;
  }, [filters]);

  return {
    filters,
    setFilters,
    applyFilter,
    clearFilters,
    savedFilters,
    saveCurrentFilter,
    applySavedFilter,
    deleteSavedFilter,
    generateFilterToken,
    applyFilterFromToken,
    hasActiveFilters,
    activeFilterCount,
    isLoading,
    setIsLoading,
  };
};

/**
 * Componente de filtro de texto
 */
export const TextFilter = ({
  label,
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          block w-full px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          text-sm
        "
      />
    </div>
  );
};

/**
 * Componente de filtro de selección
 */
export const SelectFilter = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  className = '',
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="
          block w-full px-3 py-2 border border-gray-300 rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          text-sm
        "
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * Componente de filtro de rango numérico
 */
export const RangeFilter = ({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = 'Min',
  maxPlaceholder = 'Max',
  className = '',
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex space-x-2">
        <input
          type="number"
          value={minValue || ''}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder={minPlaceholder}
          className="
            block w-full px-3 py-2 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-sm
          "
        />
        <span className="self-center text-gray-500">—</span>
        <input
          type="number"
          value={maxValue || ''}
          onChange={(e) => onMaxChange(e.target.value)}
          placeholder={maxPlaceholder}
          className="
            block w-full px-3 py-2 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-sm
          "
        />
      </div>
    </div>
  );
};

/**
 * Componente de filtro de fecha
 */
export const DateFilter = ({
  label,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className = '',
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex space-x-2">
        <input
          type="date"
          value={startDate || ''}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="
            block w-full px-3 py-2 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-sm
          "
        />
        <span className="self-center text-gray-500">—</span>
        <input
          type="date"
          value={endDate || ''}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="
            block w-full px-3 py-2 border border-gray-300 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-sm
          "
        />
      </div>
    </div>
  );
};

/**
 * Panel principal de filtros inteligentes
 */
export const SmartFilterPanel = ({
  children,
  onApply,
  onClear,
  onSave,
  savedFilters = [],
  onApplySaved,
  onDeleteSaved,
  hasActiveFilters = false,
  activeFilterCount = 0,
  isLoading = false,
  className = '',
}) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterDescription, setFilterDescription] = useState('');

  const handleSave = () => {
    if (filterName.trim()) {
      onSave(filterName.trim(), filterDescription.trim());
      setFilterName('');
      setFilterDescription('');
      setShowSaveModal(false);
    }
  };

  return (
    <Card className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
          {hasActiveFilters && (
            <StatusBadge
              type="sync"
              status="sincronizado"
              label={`${activeFilterCount} filtro${activeFilterCount !== 1 ? 's' : ''}`}
              size="sm"
            />
          )}
        </div>

        <div className="flex space-x-2">
          <RefreshButton onClick={onClear} disabled={!hasActiveFilters} size="sm" />
          <SearchButton onClick={onApply} loading={isLoading} size="sm" />
        </div>
      </div>

      {/* Filtros */}
      <div className="space-y-4">{children}</div>

      {/* Acciones */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSaveModal(true)}
            disabled={!hasActiveFilters}
            icon="💾"
          >
            Guardar Filtro
          </Button>
        </div>

        {/* Filtros guardados */}
        {savedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500">Guardados:</span>
            {savedFilters.slice(0, 3).map((filter) => (
              <Button
                key={filter.id}
                variant="ghost"
                size="sm"
                onClick={() => onApplySaved(filter.id)}
                className="text-xs"
              >
                {filter.name}
              </Button>
            ))}
            {savedFilters.length > 3 && (
              <span className="text-xs text-gray-400">+{savedFilters.length - 3} más</span>
            )}
          </div>
        )}
      </div>

      {/* Modal para guardar filtro */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h4 className="text-lg font-semibold mb-4">Guardar Filtro</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del filtro *
                </label>
                <input
                  type="text"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  placeholder="Ej: Stock bajo de repuestos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  value={filterDescription}
                  onChange={(e) => setFilterDescription(e.target.value)}
                  placeholder="Describe qué muestra este filtro..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="secondary" onClick={() => setShowSaveModal(false)}>
                Cancelar
              </Button>
              <Button variant="success" onClick={handleSave} disabled={!filterName.trim()}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

/**
 * Gestor de filtros guardados
 */
export const SavedFiltersManager = ({
  savedFilters = [],
  onApply,
  onDelete,
  onEdit,
  className = '',
}) => {
  return (
    <Card className={`${className}`}>
      <h4 className="text-lg font-semibold mb-4">Filtros Guardados</h4>

      {savedFilters.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No tienes filtros guardados</p>
      ) : (
        <div className="space-y-3">
          {savedFilters.map((filter) => (
            <div
              key={filter.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{filter.name}</h5>
                {filter.description && (
                  <p className="text-sm text-gray-600 mt-1">{filter.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>Usado {filter.appliedCount} veces</span>
                  <span>Creado {new Date(filter.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onApply(filter.id)} icon="▶️">
                  Aplicar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(filter.id)} icon="🗑️" />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

/**
 * Indicador de filtros activos
 */
export const ActiveFiltersIndicator = ({
  filters = {},
  onRemoveFilter,
  onClearAll,
  className = '',
}) => {
  const activeFilters = Object.entries(filters).filter(
    ([key, value]) =>
      value !== '' &&
      value !== null &&
      value !== undefined &&
      !(Array.isArray(value) && value.length === 0)
  );

  if (activeFilters.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600">Filtros activos:</span>

      {activeFilters.map(([key, value]) => (
        <StatusBadge
          key={key}
          type="sync"
          status="sincronizado"
          label={`${key}: ${value}`}
          interactive
          onClick={() => onRemoveFilter(key)}
          size="sm"
        />
      ))}

      <Button variant="ghost" size="sm" onClick={onClearAll} icon="❌">
        Limpiar todo
      </Button>
    </div>
  );
};

export default {
  useSmartFilters,
  TextFilter,
  SelectFilter,
  RangeFilter,
  DateFilter,
  SmartFilterPanel,
  SavedFiltersManager,
  ActiveFiltersIndicator,
};
