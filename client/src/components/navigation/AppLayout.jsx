/**
 * AppLayout - Layout principal de la aplicación
 * 
 * Componente de layout unificado que proporciona:
 * - Navegación lateral (Sidebar) consistente
 * - Barra superior de navegación (TopNavBar)
 * - Breadcrumbs automáticos
 * - Área de contenido con padding responsivo
 * - Control de estado de navegación centralizado
 * 
 * @param {React.Node} children - Contenido de la página
 * @param {string} currentSection - Sección actual activa
 * @param {Array} breadcrumbs - Array de breadcrumbs [{label, href}]
 * @param {string} title - Título de la página
 * @param {string} subtitle - Subtítulo de la página
 * @param {React.Node} actions - Acciones adicionales para la barra superior
 * @param {string} token - Token de autenticación
 * @param {string} role - Rol del usuario
 * @param {Function} onLogout - Función de logout
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from '../Sidebar';
import TopNavBar from './TopNavBar';
import Breadcrumbs from './Breadcrumbs';
import useSwipeGestures from '../../hooks/useSwipeGestures';

const AppLayout = ({ 
  children, 
  currentSection = null,
  breadcrumbs = [],
  title = '',
  subtitle = '',
  actions = null,
  token,
  role,
  onLogout,
  className = ''
}) => {
  const [sidebarActive, setSidebarActive] = useState(currentSection);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Configurar gestos táctiles para el sidebar
  const swipeRef = useSwipeGestures(
    () => {
      // Deslizar hacia izquierda - cerrar sidebar
      if (isMobile && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    },
    () => {
      // Deslizar hacia derecha - abrir sidebar
      if (isMobile && !isMobileMenuOpen) {
        setIsMobileMenuOpen(true);
      }
    },
    60 // threshold en pixels
  );

  // Detectar si es mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Cerrar menú mobile al cambiar a desktop
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Cerrar menú mobile al cambiar de ruta
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Generar breadcrumbs automáticamente si no se proporcionan
  const autoBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : generateAutoBreadcrumbs(location.pathname);

  return (
    <div ref={swipeRef} className="min-h-screen bg-gray-50">
      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navegación lateral */}
      <Sidebar 
        active={sidebarActive} 
        setActive={setSidebarActive}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      {/* Área de contenido principal */}
      <div className={`transition-all duration-300 ${
        isMobile ? 'ml-0' : 'ml-64'
      }`}>
        
        {/* Header móvil */}
        {isMobile && (
          <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            
            {title && (
              <h1 className="text-lg font-semibold text-gray-900 truncate flex-1 ml-3">
                {title}
              </h1>
            )}
            
            {/* Botón de menú de usuario móvil */}
            <div className="flex items-center space-x-2">
              {actions && (
                <div className="hidden sm:flex items-center space-x-2">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Barra superior de navegación - solo desktop */}
        {!isMobile && (
          <TopNavBar 
            title={title}
            subtitle={subtitle}
            actions={actions}
            token={token}
            role={role}
            onLogout={onLogout}
          />
        )}
        
        {/* Contenido principal */}
        <div className="px-2 sm:px-4 lg:px-6 py-4">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Breadcrumbs */}
            {autoBreadcrumbs.length > 0 && (
              <div className="hidden sm:block">
                <Breadcrumbs items={autoBreadcrumbs} />
              </div>
            )}
            
            {/* Título mobile */}
            {isMobile && !title && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {autoBreadcrumbs[autoBreadcrumbs.length - 1]?.label || 'Dashboard'}
                </h1>
              </div>
            )}
            
            {/* Contenido de la página */}
            <main className="pb-4 sm:pb-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Genera breadcrumbs automáticamente basado en la ruta actual
 * @param {string} pathname - Ruta actual
 * @returns {Array} Array de breadcrumbs
 */
function generateAutoBreadcrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Inicio', href: '/' }];

  // Mapeo de rutas a nombres legibles
  const routeNames = {
    'maquinarias': 'Maquinarias',
    'repuestos': 'Repuestos',
    'proveedores': 'Proveedores',
    'reparaciones': 'Reparaciones',
    'usuarios': 'Usuarios',
    'formulario': 'Formulario',
    'editar': 'Editar',
    'nuevo': 'Nuevo',
    'dashboard': 'Dashboard'
  };

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // No agregar IDs a los breadcrumbs
    if (isNaN(segment)) {
      const label = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // El último elemento no necesita href
      const href = index === segments.length - 1 ? null : currentPath;
      
      breadcrumbs.push({ label, href });
    }
  });

  return breadcrumbs;
}

export default AppLayout;
