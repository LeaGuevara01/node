import React from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import {
  CONTAINER_STYLES,
  BUTTON_STYLES,
  LAYOUT_STYLES,
  ICON_STYLES,
  TEXT_STYLES,
  ALERT_STYLES,
  LIST_STYLES,
} from '../../styles/repuestoStyles';
import AdvancedFilters from './AdvancedFilters';
import Pagination from './Pagination';

/**
 * Template base reutilizable para páginas de listado con filtros avanzados
 * @param {Object} props - Propiedades del componente
 */
const BaseListPage = ({
  // Configuración básica
  title,
  subtitle,
  entityName,
  entityNamePlural,
  createRoute,

  // Datos y estado
  items,
  loading,
  error,

  // Filtros
  filtrosTemporales,
  handleFiltroChange,
  aplicarFiltrosActuales,
  limpiarTodosFiltros,
  tokensActivos,
  removerToken,
  opcionesFiltros,
  camposFiltros,

  // Paginación
  paginacion,
  handlePaginacion,

  // Acciones de elementos
  onEdit,
  onView,
  onDelete,
  onItemClick,

  // Carga masiva
  onFileUpload,
  bulkError,
  setBulkError,
  bulkSuccess,
  setBulkSuccess,
  csvHeaders = [],

  // Renderizado personalizado
  renderItem,
  renderItemActions,

  // Props adicionales
  children,
  headerActions,
  showCsvUpload = true,
  showNewButton = true,
}) => {
  const navigate = useNavigate();

  /**
   * Maneja la carga masiva de archivo (se envía el File al handler)
   */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBulkError && setBulkError('');
    setBulkSuccess && setBulkSuccess('');

    if (onFileUpload) {
      onFileUpload(file);
    }
  };

  /**
   * Renderiza las acciones por defecto de un elemento
   */
  const renderDefaultItemActions = (item) => (
    <div className={LIST_STYLES.itemActions} onClick={(e) => e.stopPropagation()}>
      {onView && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(item);
          }}
          className={`${BUTTON_STYLES.edit} bg-gray-50 hover:bg-gray-100 text-gray-700 mr-2`}
          title={`Ver detalles de ${entityName}`}
        >
          <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      )}
      {onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(item);
          }}
          className={BUTTON_STYLES.edit}
          title={`Editar ${entityName}`}
        >
          <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
      )}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item);
          }}
          className={`${BUTTON_STYLES.edit} text-red-600 hover:bg-red-50`}
          title={`Eliminar ${entityName}`}
        >
          <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <div className={CONTAINER_STYLES.main}>
      <div className={CONTAINER_STYLES.maxWidth}>
        {/* Header con botones de acción */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <div className={LAYOUT_STYLES.flexBetween}>
            <div>
              <h1 className={TEXT_STYLES.title}>{title}</h1>
              {subtitle && <p className={TEXT_STYLES.subtitle}>{subtitle}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {showCsvUpload && onFileUpload && (
                <label className="flex-1 sm:flex-initial">
                  <span className="sr-only">Cargar CSV</span>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id={`csv-upload-${entityName}`}
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
              )}
              {showNewButton && createRoute && (
                <button onClick={() => navigate(createRoute)} className={BUTTON_STYLES.newItem}>
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
                  Nuevo {entityName}
                </button>
              )}
              {headerActions}
            </div>
          </div>

          {/* Mensajes de estado para carga masiva */}
          {bulkSuccess && <div className={ALERT_STYLES.success}>{bulkSuccess}</div>}
          {bulkError && <div className={ALERT_STYLES.error}>{bulkError}</div>}
          {error && <div className={ALERT_STYLES.error}>{error}</div>}
        </div>

        {/* Filtros avanzados */}
        {camposFiltros && camposFiltros.length > 0 && (
          <AdvancedFilters
            filtrosTemporales={filtrosTemporales}
            handleFiltroChange={handleFiltroChange}
            aplicarFiltrosActuales={aplicarFiltrosActuales}
            limpiarTodosFiltros={limpiarTodosFiltros}
            tokensActivos={tokensActivos}
            removerToken={removerToken}
            opcionesFiltros={opcionesFiltros}
            camposFiltros={camposFiltros}
            titulo="Filtros Avanzados"
          />
        )}

        {/* Lista de elementos */}
        <div className={`${CONTAINER_STYLES.card} overflow-hidden`}>
          <div className={`${CONTAINER_STYLES.cardPadding} border-b border-gray-200`}>
            <div className={LAYOUT_STYLES.flexBetween}>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {entityNamePlural} (
                  {paginacion?.totalItems ?? (Array.isArray(items) ? items.length : 0)})
                </h3>
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
            {items?.length === 0 ? (
              <div className={LIST_STYLES.emptyState}>
                {loading
                  ? 'Cargando...'
                  : `No hay ${entityNamePlural.toLowerCase()} que coincidan con los filtros aplicados`}
              </div>
            ) : (
              (Array.isArray(items) ? items : []).map((item) => (
                <div
                  key={item.id}
                  className={`${LIST_STYLES.item} ${onItemClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  onClick={onItemClick ? () => onItemClick(item) : undefined}
                  role={onItemClick ? 'button' : undefined}
                  tabIndex={onItemClick ? 0 : undefined}
                  onKeyDown={
                    onItemClick
                      ? (e) => {
                          if (e.key === 'Enter') onItemClick(item);
                        }
                      : undefined
                  }
                >
                  <div className={`${LIST_STYLES.itemContent} list-item-content`}>
                    <div className="flex-1">
                      {renderItem ? (
                        renderItem(item)
                      ) : (
                        <div className={LIST_STYLES.itemHeader}>
                          <h3 className={LIST_STYLES.itemTitle}>
                            {item.nombre || item.title || `${entityName} #${item.id}`}
                          </h3>
                          {renderItemActions
                            ? renderItemActions(item)
                            : renderDefaultItemActions(item)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Paginación */}
          <Pagination paginacion={paginacion} onPageChange={handlePaginacion} loading={loading} />
        </div>

        {/* Contenido adicional */}
        {children}
      </div>
    </div>
  );
};

export default BaseListPage;
