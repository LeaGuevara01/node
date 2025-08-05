/**
 * Sistema de Layout Responsive
 * Componentes reutilizables para layouts consistentes en toda la aplicación
 */

import React from 'react';
import { COMPONENT_VARIANTS } from '../../styles/tokens/componentVariants';

/**
 * Contenedor principal de página
 */
export const PageContainer = ({ 
  children, 
  theme = 'default',
  className = '' 
}) => {
  const themeClasses = {
    default: 'bg-gradient-to-br from-gray-50 to-gray-100',
    agricultural: 'bg-gradient-agricultural',
    machinery: 'bg-gradient-machinery',
    earth: 'bg-gradient-earth',
    sky: 'bg-gradient-sky'
  };

  return (
    <div className={`
      min-h-screen transition-colors duration-300
      ${themeClasses[theme] || themeClasses.default}
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * Contenedor de contenido con padding responsivo
 */
export const ContentContainer = ({ 
  children, 
  maxWidth = '7xl',
  spacing = 'md',
  className = '' 
}) => {
  const spacingClasses = {
    sm: 'space-y-4 py-4',
    md: 'space-y-6 py-6',
    lg: 'space-y-8 py-8',
    xl: 'space-y-10 py-10'
  };

  return (
    <div className={`
      max-w-${maxWidth} mx-auto px-4 sm:px-6 lg:px-8
      ${spacingClasses[spacing]}
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * Sección con fondo y bordes
 */
export const Section = ({ 
  children, 
  title,
  subtitle,
  padding = 'md',
  className = '' 
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  return (
    <section className={`
      bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden
      ${paddingClasses[padding]}
      ${className}
    `}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
};

/**
 * Grid responsivo genérico
 */
export const ResponsiveGrid = ({ 
  children, 
  columns = 'responsive',
  gap = '6',
  className = '' 
}) => {
  const { grids } = COMPONENT_VARIANTS.layout;
  
  const gridClasses = {
    responsive: grids.responsive,
    twoColumns: grids.twoColumns,
    fourColumns: grids.fourColumns,
    stats: grids.stats,
    form: grids.form,
    custom: `grid gap-${gap}`
  };

  return (
    <div className={`
      ${gridClasses[columns] || gridClasses.responsive}
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * Flex container con variantes comunes
 */
export const FlexContainer = ({ 
  children, 
  direction = 'horizontal',
  justify = 'start',
  align = 'center',
  wrap = false,
  gap = '4',
  className = '' 
}) => {
  const directionClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline'
  };

  return (
    <div className={`
      flex
      ${directionClasses[direction]}
      ${justifyClasses[justify]}
      ${alignClasses[align]}
      ${wrap ? 'flex-wrap' : ''}
      gap-${gap}
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * Card container con variantes
 */
export const Card = ({ 
  children, 
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '' 
}) => {
  const { base, variants, padding: paddingVariants } = COMPONENT_VARIANTS.card;

  return (
    <div className={`
      ${base}
      ${variants[variant] || variants.default}
      ${paddingVariants[padding]}
      ${hover ? 'hover:shadow-lg hover:scale-[1.02]' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

/**
 * Header de página con breadcrumbs
 */
export const PageHeader = ({ 
  title, 
  subtitle,
  breadcrumbs = [],
  actions,
  className = '' 
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="mb-4">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-gray-700">
                    {crumb.label}
                  </a>
                ) : (
                  <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Header principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="mt-4 sm:mt-0 flex gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Layout para formularios
 */
export const FormLayout = ({ 
  children, 
  title,
  subtitle,
  maxWidth = '2xl',
  className = '' 
}) => {
  return (
    <div className={`max-w-${maxWidth} mx-auto ${className}`}>
      <Card padding="lg">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </Card>
    </div>
  );
};

/**
 * Layout para páginas de detalles
 */
export const DetailsLayout = ({ 
  children, 
  header,
  sidebar,
  main,
  className = '' 
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {header}
      
      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        {sidebar && (
          <div className="lg:col-span-1">
            {sidebar}
          </div>
        )}
        
        {/* Main content */}
        <div className={sidebar ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {main || children}
        </div>
      </div>
    </div>
  );
};

/**
 * Layout para listados con filtros
 */
export const ListLayout = ({ 
  header,
  filters,
  toolbar,
  content,
  sidebar,
  className = '' 
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      {header}
      
      {/* Filtros */}
      {filters && (
        <Card padding="md">
          {filters}
        </Card>
      )}
      
      {/* Contenido principal */}
      <div className={sidebar ? 'grid grid-cols-1 lg:grid-cols-4 gap-6' : ''}>
        {/* Sidebar de filtros */}
        {sidebar && (
          <div className="lg:col-span-1">
            {sidebar}
          </div>
        )}
        
        {/* Área principal */}
        <div className={sidebar ? 'lg:col-span-3' : ''}>
          {/* Toolbar */}
          {toolbar && (
            <div className="mb-6">
              {toolbar}
            </div>
          )}
          
          {/* Contenido */}
          {content}
        </div>
      </div>
    </div>
  );
};

/**
 * Modal layout
 */
export const ModalLayout = ({ 
  children, 
  title,
  size = 'md',
  onClose,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`
          relative bg-white rounded-xl shadow-xl
          ${sizeClasses[size]} w-full
          animate-slide-up
          ${className}
        `}>
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton loader para layouts
 */
export const LayoutSkeleton = ({ type = 'page' }) => {
  const skeletons = {
    page: (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    ),
    
    card: (
      <div className="animate-pulse p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    ),
    
    list: (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  };

  return skeletons[type] || skeletons.page;
};

/**
 * Layout con sticky header
 */
export const StickyHeaderLayout = ({ 
  header, 
  children, 
  className = '' 
}) => {
  return (
    <div className={className}>
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        {header}
      </div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
};

export default {
  PageContainer,
  ContentContainer,
  Section,
  ResponsiveGrid,
  FlexContainer,
  Card,
  PageHeader,
  FormLayout,
  DetailsLayout,
  ListLayout,
  ModalLayout,
  LayoutSkeleton,
  StickyHeaderLayout
};
