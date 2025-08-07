/**
 * TopNavBar - Barra superior de navegación
 * 
 * Componente de barra superior que proporciona:
 * - Información contextual de la página actual
 * - Acciones rápidas y botones de la página
 * - Información del usuario y logout
 * - Búsqueda global (opcional)
 * 
 * @param {string} title - Título de la página actual
 * @param {string} subtitle - Subtítulo de la página
 * @param {React.Node} actions - Botones/acciones adicionales
 * @param {string} token - Token de autenticación
 * @param {string} role - Rol del usuario
 * @param {Function} onLogout - Función de logout
 * @param {boolean} showSearch - Mostrar barra de búsqueda
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Bell, Settings as SettingsIcon } from 'lucide-react';
import BusquedaRapida from '../BusquedaRapida';

const TopNavBar = ({ 
  title = '', 
  subtitle = '', 
  actions = null,
  token,
  role,
  onLogout,
  showSearch = true 
}) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Información de la página actual - Responsive */}
            <div className="flex-1 min-w-0 pr-4">
              {title && (
                <div>
                  <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Área central - Búsqueda y acciones - Responsive */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              {/* Búsqueda rápida - Ocultar en móvil si hay acciones */}
              {showSearch && (
                <button
                  onClick={() => setShowSearchModal(true)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Búsqueda rápida (Ctrl+K)"
                >
                  <Search size={18} className="sm:w-5 sm:h-5" />
                </button>
              )}

              {/* Acciones personalizadas de la página */}
              {actions && (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {actions}
                </div>
              )}

              {/* Notificaciones - Ocultar en móvil pequeño si hay muchas acciones */}
              <button
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative hidden sm:block"
                title="Notificaciones"
              >
                <Bell size={18} className="sm:w-5 sm:h-5" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500 rounded-full"></span>
              </button>
            </div>

            {/* Área de usuario - Responsive */}
            <div className="relative ml-2 sm:ml-4">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{role}</div>
                </div>
              </button>

              {/* Menú desplegable de usuario - Responsive */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">Usuario: {role}</div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Navegar a configuraciones si existe la ruta
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center active:bg-gray-200"
                  >
                    <SettingsIcon size={16} className="mr-2" />
                    Configuración
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center active:bg-red-100"
                  >
                    <LogOut size={16} className="mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal de búsqueda rápida - Responsive */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16 sm:pt-20 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-semibold">Búsqueda Rápida</h3>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>
              <BusquedaRapida token={token} />
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar menú de usuario */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default TopNavBar;
