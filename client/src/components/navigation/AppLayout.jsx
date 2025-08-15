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
import BusquedaRapida from '../BusquedaRapida';

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
  className = '',
  // Nuevo: props para header de detalles
  isDetails = false,
  detailsInfo = null,
  onEdit = null,
  onDelete = null,
  showSearch = true,
  collapseUserOnMd = false,
  // Nuevo: ocultar búsqueda rápida en desktop (reservarla para móvil)
  hideSearchOnDesktop = false,
}) => {
  const [sidebarActive, setSidebarActive] = useState(currentSection);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
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

  // Escuchar evento global para abrir búsqueda en móvil
  useEffect(() => {
    const handler = () => setShowMobileSearch(true);
    window.addEventListener('open-global-search', handler);
    return () => window.removeEventListener('open-global-search', handler);
  }, []);

  // Generar breadcrumbs automáticamente si no se proporcionan
  const autoBreadcrumbs =
    breadcrumbs.length > 0 ? breadcrumbs : generateAutoBreadcrumbs(location.pathname);

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
      <div className={`transition-all duration-300 ${isMobile ? 'ml-0' : 'ml-64'}`}>
        {/* Modal de búsqueda móvil */}
        {isMobile && showMobileSearch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold">Búsqueda Rápida</h3>
                  <button
                    onClick={() => setShowMobileSearch(false)}
                    className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
                    aria-label="Cerrar búsqueda"
                  >
                    ✕
                  </button>
                </div>
                <BusquedaRapida token={token} />
              </div>
            </div>
          </div>
        )}

        {/* Header móvil */}
        {isMobile && (
          <div className="bg-white shadow-sm border-b border-gray-200 px-3 py-2.5 flex items-center justify-between md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>

            {title && (
              <h1 className="hidden sm:block text-lg font-semibold text-gray-900 truncate flex-1 ml-3">
                {title}
              </h1>
            )}

            {/* Acciones móviles */}
            <div className="flex items-center space-x-1 shrink-0">
              {actions ? (
                // Mostrar acciones pero forzando solo iconos en sm
                <div className="flex items-center space-x-1 [&_span]:hidden sm:[&_span]:inline [&_.mr-2]:mr-0 sm:[&_svg+span]:ml-2">
                  {actions}
                </div>
              ) : (
                // Fallback: buscar + editar/eliminar para detalles
                <>
                  {showSearch && (
                    <button
                      className="inline-flex items-center leading-none p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => window.dispatchEvent(new CustomEvent('open-global-search'))}
                      title="Buscar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="align-middle h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.386a1 1 0 01-1.414 1.415l-4.387-4.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                  {isDetails && onEdit && (
                    <button
                      onClick={onEdit}
                      className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      title="Editar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 7.125L16.875 4.5"
                        />
                      </svg>
                    </button>
                  )}
                  {isDetails && onDelete && (
                    <button
                      onClick={onDelete}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Eliminar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673A2.25 2.25 0 0115.917 21.75H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201V5.25m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  )}
                </>
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
            isDetails={isDetails}
            detailsInfo={detailsInfo}
            onEdit={onEdit}
            onDelete={onDelete}
            showSearch={showSearch}
            collapseUserOnMd={collapseUserOnMd}
            hideSearchOnDesktop={hideSearchOnDesktop}
          />
        )}

        {/* Contenido principal */}
        <div className="px-2 sm:px-4 lg:px-6 pt-2 sm:pt-4 pb-4">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Breadcrumbs */}
            {autoBreadcrumbs.length > 0 && (
              <div className="hidden sm:block">
                <Breadcrumbs items={autoBreadcrumbs} />
              </div>
            )}

            {/* Título y breadcrumb mobile */}
            {isMobile && (
              <div>
                {/* Indicador breadcrumb compacto en pantallas chicas */}
                {autoBreadcrumbs.length > 1 && (
                  <div className="text-xs text-gray-500 mb-1">
                    {autoBreadcrumbs
                      .map((b) => b.label)
                      .slice(0, 2) // Mostrar solo los dos primeros niveles
                      .join(' > ')}
                  </div>
                )}
                {/* Título si no se pasó explícito */}
                {!title && (
                  <h1 className="text-xl font-bold text-gray-900">
                    {autoBreadcrumbs[autoBreadcrumbs.length - 1]?.label || 'Dashboard'}
                  </h1>
                )}
              </div>
            )}

            {/* Contenido de la página */}
            <main className="pb-4 sm:pb-6">{children}</main>
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
    maquinarias: 'Maquinarias',
    repuestos: 'Repuestos',
    proveedores: 'Proveedores',
    reparaciones: 'Reparaciones',
    usuarios: 'Usuarios',
    formulario: 'Formulario',
    editar: 'Editar',
    nuevo: 'Nuevo',
    dashboard: 'Dashboard',
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
