/**
 * Sistema Modular de Estilos para Páginas
 * 
 * Este módulo proporciona clases y componentes base para mantener
 * consistencia visual en todas las páginas de la aplicación.
 */

// ===== CLASES BASE PARA PÁGINAS =====

export const PAGE_STYLES = {
  // Layout principal de página
  pageContainer: `
    min-h-screen bg-gray-50
  `,
  
  // Contenedor principal con sidebar
  mainContent: `
    pl-12 md:pl-60 transition-all duration-200
  `,
  
  // Contenedor de contenido
  contentWrapper: `
    px-2 sm:px-4 lg:px-6 py-4 max-w-7xl mx-auto
  `,
  
  // Header de página
  pageHeader: `
    bg-white rounded-lg shadow-sm p-4 mb-6 border-l-4 border-brand-600
  `,
  
  // Título principal
  pageTitle: `
    text-3xl md:text-4xl font-bold text-gray-800 mb-2
  `,
  
  // Subtítulo
  pageSubtitle: `
    text-gray-600 text-lg
  `,
  
  // Sección de contenido
  contentSection: `
    bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6
  `,
  
  // Grid responsivo
  responsiveGrid: `
    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
  `,
  
  // Botón de navegación
  backButton: `
    flex items-center space-x-2 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 
    transition-colors cursor-pointer text-gray-700 hover:text-gray-900
  `,
  
  // Estados de carga
  loadingContainer: `
    flex items-center justify-center h-64
  `,
  
  loadingSpinner: `
    animate-spin rounded-full h-12 w-12 border-b-2 border-brand-700
  `,
  
  loadingText: `
    ml-3 text-lg text-gray-600
  `,
  
  // Estados vacíos
  emptyState: `
    text-center py-12 text-gray-500
  `,
  
  // Alertas y notificaciones
  alertSuccess: `
    bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4
  `,
  
  alertError: `
    bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4
  `,
  
  alertWarning: `
    bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4
  `,
  
  alertInfo: `
    bg-brand-50 border border-brand-200 text-brand-800 px-4 py-3 rounded-lg mb-4
  `
};

// ===== COMPONENTES BASE =====

import React from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';

/**
 * Layout base para páginas con sidebar
 */
export function PageLayout({ children, className = '' }) {
  return (
    <div className={`${PAGE_STYLES.pageContainer} ${className}`}>
      <div className={PAGE_STYLES.mainContent}>
        <div className={PAGE_STYLES.contentWrapper}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Header estándar para páginas
 */
export function PageHeader({ 
  title, 
  subtitle, 
  onBack, 
  children, 
  showBackButton = false,
  className = '' 
}) {
  return (
    <div className={`${PAGE_STYLES.pageHeader} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && onBack && (
            <button 
              onClick={onBack}
              className={PAGE_STYLES.backButton}
              aria-label="Volver"
            >
              <ChevronLeft size={20} />
              <span>Volver</span>
            </button>
          )}
          <div>
            <h1 className={PAGE_STYLES.pageTitle}>{title}</h1>
            {subtitle && (
              <p className={PAGE_STYLES.pageSubtitle}>{subtitle}</p>
            )}
          </div>
        </div>
        {children && (
          <div className="flex items-center space-x-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Sección de contenido estándar
 */
export function ContentSection({ 
  title, 
  children, 
  className = '',
  padding = 'p-6'
}) {
  return (
    <section className={`bg-white rounded-xl shadow-sm border border-gray-200 ${padding} mb-6 ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      )}
      {children}
    </section>
  );
}

/**
 * Estado de carga estándar
 */
export function LoadingState({ message = 'Cargando...' }) {
  return (
    <div className={PAGE_STYLES.loadingContainer}>
      <Loader2 className={PAGE_STYLES.loadingSpinner} />
      <span className={PAGE_STYLES.loadingText}>{message}</span>
    </div>
  );
}

/**
 * Estado vacío estándar
 */
export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className = '' 
}) {
  return (
    <div className={`${PAGE_STYLES.emptyState} ${className}`}>
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      {title && <h3 className="text-lg font-medium text-gray-700 mb-2">{title}</h3>}
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {action && action}
    </div>
  );
}

/**
 * Componente de alerta
 */
export function Alert({ type = 'info', title, children, onClose }) {
  const alertStyles = {
    success: PAGE_STYLES.alertSuccess,
    error: PAGE_STYLES.alertError,
    warning: PAGE_STYLES.alertWarning,
    info: PAGE_STYLES.alertInfo
  };

  return (
    <div className={alertStyles[type]}>
      <div className="flex items-start justify-between">
        <div>
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <div>{children}</div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="ml-4 text-current opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Grid responsivo estándar
 */
export function ResponsiveGrid({ 
  children, 
  columns = 'default',
  gap = 'gap-4',
  className = '' 
}) {
  const columnStyles = {
    default: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    stats: 'grid-cols-2 lg:grid-cols-4',
    cards: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    list: 'grid-cols-1',
    two: 'grid-cols-1 lg:grid-cols-2',
    three: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <div className={`grid ${columnStyles[columns]} ${gap} ${className}`}>
      {children}
    </div>
  );
}

// ===== HOOKS UTILITARIOS =====

/**
 * Hook para gestionar estado de página
 */
export function usePageState(initialLoading = true) {
  const [loading, setLoading] = React.useState(initialLoading);
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState(null);

  const resetState = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  const setSuccess = (newData) => {
    setData(newData);
    setError(null);
    setLoading(false);
  };

  const setErrorState = (errorMessage) => {
    setError(errorMessage);
    setData(null);
    setLoading(false);
  };

  return {
    loading,
    error,
    data,
    setLoading,
    setError,
    setData,
    resetState,
    setSuccess,
    setErrorState
  };
}

/**
 * Hook para navegación de páginas
 */
export function usePageNavigation() {
  const [currentPage, setCurrentPage] = React.useState(null);
  const [previousPage, setPreviousPage] = React.useState(null);

  const navigateTo = (page) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
  };

  const goBack = () => {
    if (previousPage) {
      setCurrentPage(previousPage);
      setPreviousPage(null);
    }
  };

  return {
    currentPage,
    previousPage,
    navigateTo,
    goBack,
    canGoBack: !!previousPage
  };
}

// ===== CONSTANTES DE ESTILO =====

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

export const COLORS = {
  primary: 'agricultural-crop',
  secondary: 'agricultural-earth',
  accent: 'agricultural-machinery',
  neutral: 'gray'
};

export const SPACING = {
  xs: '0.5rem',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
  xl: '3rem'
};

export const ANIMATIONS = {
  fast: 'duration-150',
  normal: 'duration-200',
  slow: 'duration-300'
};

// ===== UTILIDADES DE CLASE =====

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const conditionalClass = (condition, trueClass, falseClass = '') => {
  return condition ? trueClass : falseClass;
};

// ===== EXPORTACIONES ADICIONALES =====

export default {
  PAGE_STYLES,
  PageLayout,
  PageHeader,
  ContentSection,
  LoadingState,
  EmptyState,
  Alert,
  ResponsiveGrid,
  usePageState,
  usePageNavigation,
  BREAKPOINTS,
  COLORS,
  SPACING,
  ANIMATIONS,
  classNames,
  conditionalClass
};
