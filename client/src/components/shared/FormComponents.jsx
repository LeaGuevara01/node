// Shared components for form layouts
import React from 'react';
import {
  CONTAINER_STYLES,
  INPUT_STYLES,
  BUTTON_STYLES,
  LAYOUT_STYLES,
  ICON_STYLES,
  TEXT_STYLES,
  ALERT_STYLES,
  POSITION_STYLES,
  RANGE_STYLES
} from '../styles/repuestoStyles';

export const FormHeader = ({ title, subtitle, onAdd, onUpload, addButtonText = "Nuevo", showAdd = true, showUpload = true }) => (
  <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
    <div className={LAYOUT_STYLES.flexBetween}>
      <div>
        <h1 className={TEXT_STYLES.title}>{title}</h1>
        <p className={TEXT_STYLES.subtitle}>{subtitle}</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        {showUpload && (
          <label className="flex-1 sm:flex-initial">
            <span className="sr-only">Cargar CSV</span>
            <input 
              type="file" 
              accept=".csv" 
              onChange={onUpload}
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
        )}
        {showAdd && (
          <button
            onClick={onAdd}
            className={BUTTON_STYLES.newItem}
          >
            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {addButtonText}
          </button>
        )}
      </div>
    </div>
  </div>
);

export const FilterSection = ({ children, title = "Filtros", onClearFilters }) => (
  <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
    <h2 className={TEXT_STYLES.sectionTitle}>{title}</h2>
    
    <div className={LAYOUT_STYLES.gridFilters}>
      {children}
    </div>

    <div className={LAYOUT_STYLES.gridButtons}>
      <button
        type="button"
        onClick={onClearFilters}
        className={BUTTON_STYLES.filter.clear}
      >
        <svg className={ICON_STYLES.medium} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Limpiar filtros
      </button>
    </div>
  </div>
);

export const SearchInput = ({ value, onChange, placeholder = "Buscar..." }) => (
  <div className={LAYOUT_STYLES.searchSpan}>
    <div className={POSITION_STYLES.relative}>
      <div className={POSITION_STYLES.iconLeft}>
        <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${INPUT_STYLES.withIcon} ${INPUT_STYLES.placeholder}`}
      />
    </div>
  </div>
);

export const SelectFilter = ({ value, onChange, options = [], placeholder, icon, field }) => (
  <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
    <div className={POSITION_STYLES.relative}>
      <div className={POSITION_STYLES.iconLeft}>
        {icon}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className={INPUT_STYLES.select}
      >
        <option value="" className={INPUT_STYLES.selectPlaceholder}>{placeholder}</option>
        {Array.isArray(options) && options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className={POSITION_STYLES.iconRight}>
        <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

export const DateRangeFilter = ({ startDate, endDate, onStartChange, onEndChange }) => (
  <div className="md:col-span-4 lg:col-span-2 xl:col-span-2 w-full">
    <div className={RANGE_STYLES.container}>
      <div className={RANGE_STYLES.wrapper}>
        <div className={RANGE_STYLES.labelSection}>
          <svg className={RANGE_STYLES.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className={RANGE_STYLES.labelText}>Rango de Fechas</span>
        </div>
        <div className={RANGE_STYLES.inputsWrapper}>
          <input
            type="date"
            value={startDate}
            onChange={onStartChange}
            className={RANGE_STYLES.input}
          />
          <span className={RANGE_STYLES.separator}>-</span>
          <input
            type="date"
            value={endDate}
            onChange={onEndChange}
            className={RANGE_STYLES.input}
          />
        </div>
      </div>
    </div>
  </div>
);

export const StatusMessages = ({ error, success, bulkError, bulkSuccess }) => (
  <>
    {success && (
      <div className={ALERT_STYLES.success}>
        {success}
      </div>
    )}
    {error && (
      <div className={ALERT_STYLES.error}>
        {error}
      </div>
    )}
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
  </>
);

export const LoadingSpinner = ({ text = "Cargando..." }) => (
  <div className={TEXT_STYLES.loading}>
    <svg className={`${ICON_STYLES.small} ${ICON_STYLES.spin}`} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
    </svg>
    {text}
  </div>
);

export const EmptyState = ({ message = "No hay elementos disponibles" }) => (
  <div className={LIST_STYLES.emptyState}>
    {message}
  </div>
);

export const PaginationControls = ({ pagination, onPageChange }) => {
  if (pagination.total <= 1) return null;

  return (
    <div className="border-t border-gray-200 bg-gray-50 py-3">
      <div className="px-4 sm:px-6">
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => onPageChange(pagination.current - 1)}
            disabled={pagination.current <= 1}
            className={`${BUTTON_STYLES.pagination.base} ${
              pagination.current <= 1 
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
              {pagination.current}/{pagination.total}
            </span>
          </div>
          
          <button
            onClick={() => onPageChange(pagination.current + 1)}
            disabled={pagination.current >= pagination.total}
            className={`${BUTTON_STYLES.pagination.base} ${
              pagination.current >= pagination.total 
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
  );
};
