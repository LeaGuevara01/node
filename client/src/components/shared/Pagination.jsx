import React from 'react';
import { BUTTON_STYLES, ICON_STYLES } from '../../styles/repuestoStyles';

/**
 * Componente reutilizable de paginación
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.paginacion - Datos de paginación
 * @param {Function} props.onPageChange - Función llamada al cambiar de página
 * @param {boolean} props.loading - Estado de carga
 */
const Pagination = ({ paginacion, onPageChange, loading = false }) => {
  const { current, total, totalItems, limit } = paginacion;

  // No mostrar paginación si solo hay una página
  if (total <= 1) {
    return null;
  }

  const calcularRango = () => {
    const inicio = ((current - 1) * limit) + 1;
    const fin = Math.min(current * limit, totalItems);
    return { inicio, fin };
  };

  const { inicio, fin } = calcularRango();

  return (
    <div className="border-t border-gray-200 bg-gray-50 py-3">
      <div className="px-4 sm:px-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Mostrando {inicio} - {fin} de {totalItems} resultados
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(current - 1)}
              disabled={current <= 1 || loading}
              className={`${BUTTON_STYLES.pagination.base} ${
                current <= 1 || loading
                  ? BUTTON_STYLES.pagination.disabled 
                  : BUTTON_STYLES.pagination.enabled
              }`}
              title="Página anterior"
            >
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="px-3 py-1 bg-white border border-gray-200 rounded-md">
              <span className="text-xs font-medium text-gray-700">
                {current}/{total}
              </span>
            </div>
            
            <button
              onClick={() => onPageChange(current + 1)}
              disabled={current >= total || loading}
              className={`${BUTTON_STYLES.pagination.base} ${
                current >= total || loading
                  ? BUTTON_STYLES.pagination.disabled 
                  : BUTTON_STYLES.pagination.enabled
              }`}
              title="Página siguiente"
            >
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
