/**
 * Componente de Listado Universal Modular
 * Sistema reutilizable para mostrar listados con filtros, paginación y acciones
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  PageContainer,
  ContentContainer,
  PageHeader,
  ListLayout,
  Card,
  ResponsiveGrid,
  LayoutSkeleton,
} from './Layout';
import {
  SmartFilterPanel,
  useSmartFilters,
  TextFilter,
  SelectFilter,
  RangeFilter,
  ActiveFiltersIndicator,
  SavedFiltersManager,
} from './SmartFilters';
import { StatusBadge, StatusSummary, useStatus } from './StatusBadge';
import Button, { CreateButton, ExportButton, RefreshButton, ListActionGroup } from './Button';

/**
 * Hook para gestión de datos de listado
 */
export const useListData = (apiEndpoint, initialFilters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchData = async (filters = {}, page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await fetch(`${apiEndpoint}?${params}`);
      if (!response.ok) {
        throw new Error('Error al cargar los datos');
      }

      const result = await response.json();

      // Manejar diferentes formatos de respuesta
      if (result.data && Array.isArray(result.data)) {
        setData(result.data);
        setPagination(result.pagination || pagination);
      } else if (Array.isArray(result)) {
        setData(result);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (err) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchData(initialFilters, pagination.page, pagination.limit);
  };

  return {
    data,
    setData,
    loading,
    error,
    pagination,
    fetchData,
    refresh,
  };
};

/**
 * Componente de elemento de lista
 */
export const ListItem = ({
  item,
  fields = [],
  actions = [],
  statusConfig,
  onClick,
  className = '',
}) => {
  return (
    <Card
      variant="interactive"
      padding="md"
      className={`cursor-pointer ${className}`}
      onClick={() => onClick && onClick(item)}
    >
      <div className="flex items-center justify-between">
        {/* Información principal */}
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            {/* Campo principal (título) */}
            {fields[0] && (
              <h3 className="text-lg font-semibold text-gray-900">
                {item[fields[0].key] || 'Sin título'}
              </h3>
            )}

            {/* Estado */}
            {statusConfig && (
              <StatusBadge
                type={statusConfig.type}
                status={item[statusConfig.field]}
                data={statusConfig.data ? statusConfig.data(item) : {}}
                size="sm"
              />
            )}
          </div>

          {/* Campos adicionales */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {fields.slice(1).map((field) => (
              <div key={field.key} className="text-sm">
                <span className="text-gray-500">{field.label}:</span>
                <span className="ml-1 text-gray-900">
                  {field.format ? field.format(item[field.key]) : item[field.key] || 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Acciones */}
        {actions.length > 0 && (
          <div className="ml-4">
            <ListActionGroup
              onView={() => actions.find((a) => a.type === 'view')?.action(item)}
              onEdit={() => actions.find((a) => a.type === 'edit')?.action(item)}
              onDelete={() => actions.find((a) => a.type === 'delete')?.action(item)}
              showView={actions.some((a) => a.type === 'view')}
              showEdit={actions.some((a) => a.type === 'edit')}
              showDelete={actions.some((a) => a.type === 'delete')}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

/**
 * Componente de paginación
 */
export const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* Botón anterior */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </Button>

      {/* Números de página */}
      {getPageNumbers().map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {/* Botón siguiente */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </Button>
    </div>
  );
};

/**
 * Componente principal de listado universal
 */
export const UniversalList = ({
  // Configuración básica
  title,
  subtitle,
  apiEndpoint,

  // Configuración de campos
  fields = [],

  // Configuración de filtros
  filterConfig = [],

  // Configuración de estado
  statusConfig,

  // Configuración de acciones
  actions = [],

  // Callbacks
  onItemClick,
  onCreateNew,
  onExport,

  // Props adicionales
  className = '',
  pageSize = 20,
  enableSearch = true,
  enableFilters = true,
  enablePagination = true,
  enableExport = false,

  // Configuración de storage para filtros
  storageKey = 'universal_list_filters',
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Estado del listado
  const { data, loading, error, pagination, fetchData, refresh } = useListData(apiEndpoint);

  // Filtros inteligentes
  const initialFilters = useMemo(() => {
    const filters = {};
    filterConfig.forEach((config) => {
      const paramValue = searchParams.get(config.key);
      if (paramValue) {
        filters[config.key] = paramValue;
      }
    });
    return filters;
  }, [searchParams, filterConfig]);

  const {
    filters,
    applyFilter,
    clearFilters,
    savedFilters,
    saveCurrentFilter,
    applySavedFilter,
    deleteSavedFilter,
    hasActiveFilters,
    activeFilterCount,
    isLoading: isFilterLoading,
    setIsLoading: setIsFilterLoading,
  } = useSmartFilters(initialFilters, `${storageKey}_${title?.toLowerCase()}`);

  // Estado para vista de filtros guardados
  const [showSavedFilters, setShowSavedFilters] = useState(false);

  // Hook de estado para badges
  const statusHook = statusConfig ? useStatus(statusConfig.type) : null;

  // Sincronizar filtros con URL
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Cargar datos cuando cambien los filtros
  useEffect(() => {
    fetchData(filters, 1, pageSize);
  }, [filters, pageSize]);

  // Aplicar filtros
  const handleApplyFilters = async () => {
    setIsFilterLoading(true);
    await fetchData(filters, 1, pageSize);
    setIsFilterLoading(false);
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    clearFilters();
    const params = new URLSearchParams();
    setSearchParams(params);
  };

  // Cambiar página
  const handlePageChange = (page) => {
    fetchData(filters, page, pageSize);
  };

  // Remover filtro específico
  const handleRemoveFilter = (filterKey) => {
    applyFilter({ [filterKey]: '' });
  };

  // Renderizar filtros
  const renderFilters = () => {
    if (!enableFilters || filterConfig.length === 0) return null;

    return (
      <SmartFilterPanel
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onSave={saveCurrentFilter}
        savedFilters={savedFilters}
        onApplySaved={applySavedFilter}
        onDeleteSaved={deleteSavedFilter}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
        isLoading={isFilterLoading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filterConfig.map((config) => {
            const commonProps = {
              key: config.key,
              label: config.label,
              value: filters[config.key],
              onChange: (value) => applyFilter({ [config.key]: value }),
            };

            switch (config.type) {
              case 'text':
                return <TextFilter {...commonProps} placeholder={config.placeholder} />;

              case 'select':
                return (
                  <SelectFilter
                    {...commonProps}
                    options={config.options}
                    placeholder={config.placeholder}
                  />
                );

              case 'range':
                return (
                  <RangeFilter
                    {...commonProps}
                    minValue={filters[config.minKey]}
                    maxValue={filters[config.maxKey]}
                    onMinChange={(value) => applyFilter({ [config.minKey]: value })}
                    onMaxChange={(value) => applyFilter({ [config.maxKey]: value })}
                    minPlaceholder={config.minPlaceholder}
                    maxPlaceholder={config.maxPlaceholder}
                  />
                );

              case 'status':
                return statusHook ? (
                  <div key={config.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {config.label}
                    </label>
                    <StatusFilter
                      type={config.statusType}
                      selectedStatus={filters[config.key]}
                      onStatusChange={(status) => applyFilter({ [config.key]: status })}
                    />
                  </div>
                ) : null;

              default:
                return null;
            }
          })}
        </div>
      </SmartFilterPanel>
    );
  };

  // Renderizar toolbar
  const renderToolbar = () => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filtros activos */}
        <ActiveFiltersIndicator
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearFilters}
        />

        {/* Acciones */}
        <div className="flex items-center space-x-3">
          {/* Botón de filtros guardados */}
          {savedFilters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSavedFilters(!showSavedFilters)}
              icon="📁"
            >
              Filtros ({savedFilters.length})
            </Button>
          )}

          {/* Botón de exportar */}
          {enableExport && <ExportButton onClick={onExport} />}

          {/* Botón de actualizar */}
          <RefreshButton onClick={refresh} loading={loading} />

          {/* Botón de crear nuevo */}
          {onCreateNew && <CreateButton onClick={onCreateNew} />}
        </div>
      </div>
    );
  };

  // Renderizar contenido principal
  const renderContent = () => {
    if (loading && data.length === 0) {
      return <LayoutSkeleton type="list" />;
    }

    if (error) {
      return (
        <Card padding="lg" className="text-center">
          <div className="text-red-600 mb-4">❌ {error}</div>
          <Button variant="primary" onClick={refresh}>
            Reintentar
          </Button>
        </Card>
      );
    }

    if (data.length === 0 && !loading) {
      return (
        <Card padding="lg" className="text-center">
          <div className="text-gray-500 mb-4">
            {hasActiveFilters
              ? 'No se encontraron resultados con los filtros aplicados'
              : 'No hay elementos para mostrar'}
          </div>
          {hasActiveFilters && (
            <Button variant="secondary" onClick={handleClearFilters}>
              Limpiar filtros
            </Button>
          )}
          {onCreateNew && !hasActiveFilters && <CreateButton onClick={onCreateNew} />}
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {/* Resumen de estados */}
        {statusConfig && statusHook && (
          <StatusSummary type={statusConfig.type} data={data} statusField={statusConfig.field} />
        )}

        {/* Lista de elementos */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <ListItem
              key={item.id || index}
              item={item}
              fields={fields}
              actions={actions}
              statusConfig={statusConfig}
              onClick={onItemClick}
            />
          ))}
        </div>

        {/* Paginación */}
        {enablePagination && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        )}
      </div>
    );
  };

  return (
    <PageContainer className={className}>
      <ContentContainer>
        <ListLayout
          header={
            <PageHeader
              title={title}
              subtitle={subtitle}
              breadcrumbs={[{ label: 'Inicio', href: '/' }, { label: title }]}
            />
          }
          filters={renderFilters()}
          toolbar={renderToolbar()}
          content={renderContent()}
          sidebar={
            showSavedFilters ? (
              <SavedFiltersManager
                savedFilters={savedFilters}
                onApply={applySavedFilter}
                onDelete={deleteSavedFilter}
              />
            ) : null
          }
        />
      </ContentContainer>
    </PageContainer>
  );
};

export default UniversalList;
