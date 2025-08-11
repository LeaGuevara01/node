/**
 * Índice de componentes de navegación
 * Exporta todos los componentes del sistema de navegación refactorizado
 */

// Componentes principales de layout
export { default as AppLayout } from './AppLayout';
export { default as TopNavBar } from './TopNavBar';
export { default as Breadcrumbs } from './Breadcrumbs';

// Botones de navegación
export * from './NavigationButtons';

// Contexto y hooks
export { NavigationProvider, useNavigationContext } from '../contexts/NavigationContext';
