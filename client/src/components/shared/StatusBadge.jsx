/**
 * Componente StatusBadge Inteligente
 * Sistema unificado para mostrar estados visuales en toda la aplicación
 */

import React from 'react';
import { VISUAL_STATUS } from '../../styles/tokens/visualStatus';

/**
 * Componente de badge de estado inteligente
 * 
 * @param {Object} props
 * @param {string} props.type - Tipo de entidad (maquinaria, stock, reparacion, etc.)
 * @param {string} props.status - Estado específico o valor para calcular estado
 * @param {string} props.label - Etiqueta personalizada (opcional)
 * @param {boolean} props.showIcon - Mostrar icono (default: true)
 * @param {boolean} props.showDot - Mostrar punto de color (default: false)
 * @param {string} props.size - Tamaño del badge (sm, md, lg)
 * @param {boolean} props.interactive - Si es clickeable (default: false)
 * @param {function} props.onClick - Función click (opcional)
 * @param {Object} props.data - Datos adicionales para cálculo de estado
 * @param {string} props.className - Clases CSS adicionales
 */
export const StatusBadge = ({
  type,
  status,
  label,
  showIcon = true,
  showDot = false,
  size = 'md',
  interactive = false,
  onClick,
  data = {},
  className = '',
  tooltip = true
}) => {
  // Obtener configuración de estado
  const getStatusConfig = () => {
    const statusMap = VISUAL_STATUS[type];
    if (!statusMap) {
      console.warn(`Tipo de estado no encontrado: ${type}`);
      return null;
    }

    // Para stock, calcular estado automáticamente
    if (type === 'stock' && data.cantidad !== undefined) {
      return VISUAL_STATUS.utils.getStockStatus(data.cantidad, data.stockMinimo);
    }

    // Para otros tipos, buscar estado específico
    return statusMap[status] ? { key: status, ...statusMap[status] } : null;
  };

  const statusConfig = getStatusConfig();

  if (!statusConfig) {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ${className}`}>
        {label || status || 'Desconocido'}
      </span>
    );
  }

  // Configuración de tamaños
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  };

  // Clases base
  const baseClasses = `
    inline-flex items-center rounded-full font-medium
    border transition-all duration-200
    ${sizeClasses[size]}
    ${statusConfig.bg}
    ${statusConfig.text}
    ${statusConfig.border}
    ${interactive ? 'cursor-pointer hover:opacity-80 hover:scale-105' : ''}
    ${statusConfig.animated ? 'animate-pulse' : ''}
    ${className}
  `;

  // Contenido del badge
  const content = (
    <>
      {/* Punto de estado */}
      {showDot && (
        <span 
          className={`w-2 h-2 rounded-full mr-2 ${statusConfig.dot} ${statusConfig.animated ? 'animate-ping' : ''}`}
          aria-hidden="true"
        />
      )}
      
      {/* Icono */}
      {showIcon && statusConfig.icon && (
        <span 
          className={`mr-1 ${statusConfig.iconColor || ''} ${statusConfig.animated ? 'animate-spin' : ''}`}
          aria-hidden="true"
        >
          {statusConfig.icon}
        </span>
      )}
      
      {/* Texto */}
      <span>
        {label || statusConfig.label}
      </span>
    </>
  );

  // Si es interactivo, usar button
  if (interactive && onClick) {
    return (
      <button
        onClick={onClick}
        className={baseClasses}
        title={tooltip ? statusConfig.description : undefined}
        aria-label={`${statusConfig.label}: ${statusConfig.description}`}
      >
        {content}
      </button>
    );
  }

  // Badge estático
  return (
    <span
      className={baseClasses}
      title={tooltip ? statusConfig.description : undefined}
      aria-label={`${statusConfig.label}: ${statusConfig.description}`}
    >
      {content}
    </span>
  );
};

/**
 * Componente de indicador de estado simple (solo punto de color)
 */
export const StatusIndicator = ({
  type,
  status,
  size = 'md',
  data = {},
  className = '',
  tooltip = true
}) => {
  const statusConfig = (() => {
    const statusMap = VISUAL_STATUS[type];
    if (!statusMap) return null;

    if (type === 'stock' && data.cantidad !== undefined) {
      return VISUAL_STATUS.utils.getStockStatus(data.cantidad, data.stockMinimo);
    }

    return statusMap[status] ? { key: status, ...statusMap[status] } : null;
  })();

  if (!statusConfig) return null;

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <span
      className={`
        inline-block rounded-full
        ${sizeClasses[size]}
        ${statusConfig.dot}
        ${statusConfig.animated ? 'animate-pulse' : ''}
        ${className}
      `}
      title={tooltip ? `${statusConfig.label}: ${statusConfig.description}` : undefined}
      aria-label={`Estado: ${statusConfig.label}`}
    />
  );
};

/**
 * Componente de lista de estados para filtros
 */
export const StatusFilter = ({
  type,
  selectedStatus,
  onStatusChange,
  showCounts = false,
  counts = {},
  className = ''
}) => {
  const statusMap = VISUAL_STATUS[type];
  if (!statusMap) return null;

  const statuses = VISUAL_STATUS.utils.getAllStatuses(statusMap);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Opción "Todos" */}
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name={`status-${type}`}
          value=""
          checked={!selectedStatus}
          onChange={() => onStatusChange('')}
          className="text-blue-600"
        />
        <span className="text-sm font-medium text-gray-700">
          Todos
          {showCounts && (
            <span className="text-gray-500 ml-1">
              ({Object.values(counts).reduce((a, b) => a + b, 0)})
            </span>
          )}
        </span>
      </label>

      {/* Opciones de estado */}
      {statuses.map((statusConfig) => (
        <label key={statusConfig.key} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={`status-${type}`}
            value={statusConfig.key}
            checked={selectedStatus === statusConfig.key}
            onChange={() => onStatusChange(statusConfig.key)}
            className="text-blue-600"
          />
          <StatusIndicator
            type={type}
            status={statusConfig.key}
            size="sm"
            tooltip={false}
          />
          <span className="text-sm text-gray-700">
            {statusConfig.label}
            {showCounts && counts[statusConfig.key] && (
              <span className="text-gray-500 ml-1">
                ({counts[statusConfig.key]})
              </span>
            )}
          </span>
        </label>
      ))}
    </div>
  );
};

/**
 * Componente de resumen de estados
 */
export const StatusSummary = ({
  type,
  data = [],
  statusField = 'estado',
  className = ''
}) => {
  const statusMap = VISUAL_STATUS[type];
  if (!statusMap) return null;

  const counts = VISUAL_STATUS.utils.countByStatus(data, statusField);
  const statuses = VISUAL_STATUS.utils.getAllStatuses(statusMap);

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ${className}`}>
      {statuses.map((statusConfig) => {
        const count = counts[statusConfig.key] || 0;
        const percentage = data.length > 0 ? Math.round((count / data.length) * 100) : 0;

        return (
          <div
            key={statusConfig.key}
            className={`
              p-4 rounded-lg border text-center
              ${statusConfig.bg}
              ${statusConfig.border}
              hover:shadow-md transition-shadow duration-200
            `}
          >
            <div className="flex items-center justify-center mb-2">
              <span className={`text-2xl ${statusConfig.iconColor}`}>
                {statusConfig.icon}
              </span>
            </div>
            <div className={`text-2xl font-bold ${statusConfig.text}`}>
              {count}
            </div>
            <div className={`text-sm ${statusConfig.text} opacity-75`}>
              {statusConfig.label}
            </div>
            <div className={`text-xs ${statusConfig.text} opacity-60 mt-1`}>
              {percentage}%
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Hook para trabajar con estados
 */
export const useStatus = (type) => {
  const statusMap = VISUAL_STATUS[type];

  const getStatus = (status, data = {}) => {
    if (!statusMap) return null;

    if (type === 'stock' && data.cantidad !== undefined) {
      return VISUAL_STATUS.utils.getStockStatus(data.cantidad, data.stockMinimo);
    }

    return statusMap[status] ? { key: status, ...statusMap[status] } : null;
  };

  const getAllStatuses = () => {
    return VISUAL_STATUS.utils.getAllStatuses(statusMap);
  };

  const filterByStatus = (items, statusKey, statusField = 'estado') => {
    return VISUAL_STATUS.utils.filterByStatus(items, statusField, statusKey);
  };

  const countByStatus = (items, statusField = 'estado') => {
    return VISUAL_STATUS.utils.countByStatus(items, statusField);
  };

  return {
    getStatus,
    getAllStatuses,
    filterByStatus,
    countByStatus,
    statusMap
  };
};

// Exports
export default StatusBadge;
