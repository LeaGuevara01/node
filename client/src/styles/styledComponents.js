/**
 * Sistema de Auto-Aplicación de Estilos
 * 
 * Este componente wrapper aplica automáticamente estilos consistentes
 * a cualquier página, asegurando uniformidad visual en toda la aplicación.
 */

import React from 'react';
import { 
  PageLayout, 
  PageHeader, 
  ContentSection,
  LoadingState,
  Alert,
  PAGE_STYLES,
  usePageState 
} from './pageStyles';

/**
 * Wrapper principal que aplica estilos automáticamente
 */
export function StyledPageWrapper({ 
  children,
  title,
  subtitle,
  showBackButton = false,
  onBack,
  loading = false,
  error = null,
  headerActions,
  className = '',
  layout = 'sidebar' // 'sidebar', 'full', 'centered'
}) {
  
  const layoutClasses = {
    sidebar: PAGE_STYLES.mainContent,
    full: 'min-h-screen',
    centered: 'min-h-screen flex items-center justify-center'
  };

  if (loading) {
    return (
      <PageLayout>
        <LoadingState message="Cargando página..." />
      </PageLayout>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className={layoutClasses[layout]}>
        <div className={PAGE_STYLES.contentWrapper}>
          {(title || subtitle || showBackButton || headerActions) && (
            <PageHeader
              title={title}
              subtitle={subtitle}
              showBackButton={showBackButton}
              onBack={onBack}
            >
              {headerActions}
            </PageHeader>
          )}
          
          {error && (
            <Alert type="error" title="Error">
              {error}
            </Alert>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * HOC (Higher Order Component) para aplicar estilos automáticamente
 */
export function withStyledPage(WrappedComponent, pageConfig = {}) {
  return function StyledComponent(props) {
    const pageState = usePageState(pageConfig.initialLoading);
    
    return (
      <StyledPageWrapper
        title={pageConfig.title}
        subtitle={pageConfig.subtitle}
        showBackButton={pageConfig.showBackButton}
        onBack={pageConfig.onBack}
        loading={pageState.loading}
        error={pageState.error}
        headerActions={pageConfig.headerActions}
        layout={pageConfig.layout}
      >
        <WrappedComponent 
          {...props} 
          pageState={pageState}
        />
      </StyledPageWrapper>
    );
  };
}

/**
 * Hook para manejar estilos de página de forma declarativa
 */
export function useStyledPage(config = {}) {
  const pageState = usePageState(config.initialLoading);
  
  const StyledPage = ({ children, ...props }) => (
    <StyledPageWrapper
      {...config}
      {...props}
      loading={pageState.loading}
      error={pageState.error}
    >
      {children}
    </StyledPageWrapper>
  );
  
  return {
    StyledPage,
    pageState
  };
}

/**
 * Componente para formularios con estilos automáticos
 */
export function StyledForm({ 
  title,
  children, 
  onSubmit, 
  loading = false,
  error = null,
  success = null,
  className = ''
}) {
  return (
    <ContentSection 
      title={title}
      className={className}
    >
      {error && (
        <Alert type="error" title="Error en el formulario">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert type="success" title="Éxito">
          {success}
        </Alert>
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        
        {loading && (
          <div className="text-center py-4">
            <LoadingState message="Procesando..." />
          </div>
        )}
      </form>
    </ContentSection>
  );
}

/**
 * Componente para listas con estilos automáticos
 */
export function StyledList({ 
  title,
  items = [],
  renderItem,
  emptyMessage = "No hay elementos para mostrar",
  emptyIcon = "📋",
  loading = false,
  error = null,
  className = '',
  gridColumns = 'default'
}) {
  
  if (loading) {
    return (
      <ContentSection title={title}>
        <LoadingState />
      </ContentSection>
    );
  }
  
  if (error) {
    return (
      <ContentSection title={title}>
        <Alert type="error" title="Error al cargar datos">
          {error}
        </Alert>
      </ContentSection>
    );
  }
  
  return (
    <ContentSection title={title} className={className}>
      {items.length === 0 ? (
        <div className={PAGE_STYLES.emptyState}>
          <div className="text-4xl mb-4">{emptyIcon}</div>
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className={`grid ${gridColumns === 'default' ? 'grid-cols-1 gap-4' : gridColumns}`}>
          {items.map((item, index) => renderItem(item, index))}
        </div>
      )}
    </ContentSection>
  );
}

/**
 * Componente para dashboard con estilos automáticos
 */
export function StyledDashboard({ 
  title = "Dashboard",
  subtitle,
  stats = {},
  onStatsCardClick,
  children,
  loading = false,
  error = null 
}) {
  // Importar StatsCard si está disponible
  let StatsCard;
  try {
    StatsCard = require('../components/StatsCard').default;
  } catch (e) {
    console.warn('StatsCard no encontrado, usando placeholder');
  }
  
  return (
    <StyledPageWrapper
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
    >
      {/* Grid de estadísticas */}
      {Object.keys(stats).length > 0 && (
        <ContentSection title="Resumen del Sistema">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(stats).map(([key, value]) => (
              StatsCard ? (
                <StatsCard
                  key={key}
                  type={key}
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  onClick={onStatsCardClick}
                />
              ) : (
                <div key={key} className="bg-white p-4 rounded-lg shadow border">
                  <h3 className="text-sm text-gray-600 capitalize">{key}</h3>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              )
            ))}
          </div>
        </ContentSection>
      )}
      
      {/* Contenido adicional */}
      {children}
    </StyledPageWrapper>
  );
}

// ===== UTILIDADES DE APLICACIÓN AUTOMÁTICA =====

/**
 * Función para aplicar estilos a componentes existentes
 */
export function applyPageStyles(ComponentClass, config = {}) {
  return class extends ComponentClass {
    render() {
      const originalRender = super.render();
      
      return (
        <StyledPageWrapper {...config}>
          {originalRender}
        </StyledPageWrapper>
      );
    }
  };
}

/**
 * Decorador para clases de componentes
 */
export function styledPage(config = {}) {
  return function(target) {
    return applyPageStyles(target, config);
  };
}

export default {
  StyledPageWrapper,
  withStyledPage,
  useStyledPage,
  StyledForm,
  StyledList,
  StyledDashboard,
  applyPageStyles,
  styledPage
};
