import React from 'react';
import { 
  CONTAINER_STYLES, 
  INPUT_STYLES, 
  BUTTON_STYLES, 
  LAYOUT_STYLES,
  ICON_STYLES,
  TEXT_STYLES,
  POSITION_STYLES
} from '../../styles/repuestoStyles';

/**
 * Componente modular para filtros avanzados con sistema de tokens
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.filtrosTemporales - Estado temporal de filtros
 * @param {Function} props.handleFiltroChange - Función para manejar cambios en filtros
 * @param {Function} props.aplicarFiltrosActuales - Función para aplicar filtros como tokens
 * @param {Function} props.limpiarTodosFiltros - Función para limpiar todos los filtros
 * @param {Array} props.tokensActivos - Array de tokens activos
 * @param {Function} props.removerToken - Función para remover un token específico
 * @param {Object} props.opcionesFiltros - Opciones disponibles para los filtros
 * @param {Array} props.camposFiltros - Configuración de campos de filtros a mostrar
 * @param {string} props.titulo - Título de la sección de filtros
 */
const AdvancedFilters = ({
  filtrosTemporales,
  handleFiltroChange,
  aplicarFiltrosActuales,
  limpiarTodosFiltros,
  tokensActivos,
  removerToken,
  opcionesFiltros,
  camposFiltros,
  titulo = "Filtros Avanzados"
}) => {

  /**
   * Renderiza un campo de entrada de texto con icono
   */
  const renderTextInput = (campo) => (
    <div className={campo.span || "md:col-span-2 lg:col-span-1 xl:col-span-1"} key={campo.name}>
      <div className={POSITION_STYLES.relative}>
        <div className={POSITION_STYLES.iconLeft}>
          {campo.icon}
        </div>
        <input
          type={campo.type === 'search' ? 'search' : 'text'}
          value={filtrosTemporales[campo.name] || ''}
          onChange={(e) => handleFiltroChange(campo.name, e.target.value)}
          onKeyDown={(e) => {
            if (campo.type === 'search') {
              if (e.key === 'Enter') {
                e.preventDefault();
                aplicarFiltrosActuales();
              } else if (e.key === 'Escape' || e.key === 'Esc') {
                e.preventDefault();
                limpiarTodosFiltros();
              }
            }
          }}
          placeholder={campo.placeholder}
          className={`${INPUT_STYLES.withIcon} ${INPUT_STYLES.placeholder}`}
        />
      </div>
    </div>
  );

  /**
   * Renderiza un campo select con opciones
   */
  const renderSelect = (campo) => (
    <div className={campo.span || "md:col-span-2 lg:col-span-1 xl:col-span-1"} key={campo.name}>
      <div className={POSITION_STYLES.relative}>
        <div className={POSITION_STYLES.iconLeft}>
          {campo.icon}
        </div>
        <select
          /*
           * Normalizamos el value del select a string para el DOM,
           * y convertimos de vuelta a primitivo (string|number) en onChange.
           */
          value={
            filtrosTemporales[campo.name] === 0
              ? '0'
              : (filtrosTemporales[campo.name] ?? '') + ''
          }
          onChange={(e) => {
            const raw = e.target.value;
            const normalized = raw === ''
              ? ''
              : (campo.valueType === 'number' ? Number(raw) : raw);
            handleFiltroChange(campo.name, normalized);
          }}
          className={INPUT_STYLES.select}
        >
          <option value="" className={INPUT_STYLES.selectPlaceholder}>
            {campo.placeholder}
          </option>
          {campo.options?.map((option, idx) => {
            const isObj = typeof option === 'object' && option !== null;
            const value = isObj ? option.value : option;
            const label = isObj ? (option.label ?? String(option.value)) : String(option);
            const domValue = value === 0 ? '0' : String(value ?? '');
            return (
              <option key={isObj ? `${value}-${idx}` : String(option)} value={domValue}>
                {label}
              </option>
            );
          })}
        </select>
        <div className={POSITION_STYLES.iconRight}>
          <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

  /**
   * Renderiza un campo de rango numérico (años, precios, etc.)
   */
  const renderRangeInput = (campo) => {
    // Resolve responsive placeholders per input
    const getResponsivePlaceholder = (map, fallback) => {
      if (!map) return fallback || '';
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      if (w < 640) return map.sm || fallback || '';
      if (w < 1024) return map.md || fallback || '';
      return map.lg || fallback || '';
    };

    const minPh = getResponsivePlaceholder(campo?.responsivePlaceholders?.min, campo.minPlaceholder);
    const maxPh = getResponsivePlaceholder(campo?.responsivePlaceholders?.max, campo.maxPlaceholder);

    return (
      <div className={campo.span || "sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 w-full"} key={campo.name}>
        <div className={POSITION_STYLES.relative}>
          <div className={POSITION_STYLES.iconLeft}>
            {campo.icon}
          </div>
          {/* Contenedor con altura y estilos consistentes con inputs estándar */}
          <div className="pl-10 pr-3 h-12 sm:h-12 flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white relative">
            <div className="flex items-center gap-2 w-full">
              <input
                type={campo.inputType || "number"}
                value={
                  filtrosTemporales[campo.minField] === 0
                    ? 0
                    : (filtrosTemporales[campo.minField] ?? '')
                }
                onChange={(e) => {
                  const raw = e.target.value;
                  const normalized = raw === '' ? '' : Number(raw);
                  handleFiltroChange(campo.minField, normalized);
                }}
                placeholder={minPh}
                className="flex-1 border-0 p-0 text-sm placeholder-gray-400 focus:outline-none focus:ring-0 bg-transparent text-center"
                min={campo.min}
                max={campo.max}
                step={campo.step || "1"}
                inputMode={campo.inputType === 'number' ? 'numeric' : undefined}
              />
              <span className="text-gray-300 text-sm">-</span>
              <input
                type={campo.inputType || "number"}
                value={
                  filtrosTemporales[campo.maxField] === 0
                    ? 0
                    : (filtrosTemporales[campo.maxField] ?? '')
                }
                onChange={(e) => {
                  const raw = e.target.value;
                  const normalized = raw === '' ? '' : Number(raw);
                  handleFiltroChange(campo.maxField, normalized);
                }}
                placeholder={maxPh}
                className="flex-1 border-0 p-0 text-sm placeholder-gray-400 focus:outline-none focus:ring-0 bg-transparent text-center"
                min={campo.min}
                max={campo.max}
                step={campo.step || "1"}
                inputMode={campo.inputType === 'number' ? 'numeric' : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renderiza un campo de fecha
   */
  const renderDateInput = (campo) => (
    <div className={campo.span || "md:col-span-2 lg:col-span-1 xl:col-span-1"} key={campo.name}>
      <div className={POSITION_STYLES.relative}>
        <div className={POSITION_STYLES.iconLeft}>
          {campo.icon}
        </div>
        <input
          type="date"
          value={filtrosTemporales[campo.name] || ''}
          onChange={(e) => handleFiltroChange(campo.name, e.target.value)}
          className={`${INPUT_STYLES.withIcon} ${INPUT_STYLES.placeholder}`}
        />
      </div>
    </div>
  );

  /**
   * Renderiza un campo según su tipo
   */
  const renderField = (campo) => {
    switch (campo.type) {
      case 'text':
      case 'search':
        return renderTextInput(campo);
      case 'select':
        return renderSelect(campo);
      case 'range':
        return renderRangeInput(campo);
      case 'date':
        return renderDateInput(campo);
      default:
        return renderTextInput(campo);
    }
  };

  return (
    <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
      <h2 className={TEXT_STYLES.sectionTitle}>{titulo}</h2>
      
      <div className={LAYOUT_STYLES.gridFilters}>
        {camposFiltros.map(campo => renderField(campo))}
      </div>

      {/* Botones de acción de filtros */}
      <div className={LAYOUT_STYLES.gridButtons}>
        <button
          type="button"
          onClick={limpiarTodosFiltros}
          className={`${BUTTON_STYLES.filter.clear} w-full flex items-center justify-center gap-2`}
        >
          <svg className={ICON_STYLES.medium} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Limpiar
        </button>

        <button
          type="button"
          onClick={aplicarFiltrosActuales}
          className={`${BUTTON_STYLES.primary} w-full flex items-center justify-center gap-2`}
          disabled={Object.values(filtrosTemporales).every(val => val === '' || val === null || val === undefined)}
        >
          <svg className={ICON_STYLES.medium} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Aplicar
        </button>
      </div>

      {/* Tokens de filtros aplicados */}
      {tokensActivos.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Filtros activos:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tokensActivos.map(token => (
              <span
                key={token.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-colors"
              >
                {token.icon}
                <span className="ml-1">{token.label}</span>
                <button
                  onClick={() => removerToken(token.id)}
                  className="ml-2 hover:text-blue-600 focus:outline-none"
                  title="Remover filtro"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
