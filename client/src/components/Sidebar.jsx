/**
 * Componente Sidebar - Navegación lateral del sistema
 * 
 * Proporciona navegación entre diferentes secciones del sistema con:
 * - Diseño responsive (overlay en mobile, fijo en desktop)
 * - Iconos de Lucide React para cada sección
 * - Estados visuales para la sección activa
 * - Animaciones suaves de apertura/cierre
 * 
 * @param {string|null} active - Sección actualmente activa (null = dashboard)
 * @param {function} setActive - Función para cambiar la sección activa
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Settings, Building2, Wrench, Users, BarChart3, Menu, X, Wheat, ShoppingCart } from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';

// Configuración de las secciones disponibles en el sistema
const sections = [
  { key: 'maquinarias', label: 'Maquinarias', icon: Truck },
  { key: 'repuestos', label: 'Repuestos', icon: Settings },
  { key: 'proveedores', label: 'Proveedores', icon: Building2 },
  { key: 'reparaciones', label: 'Reparaciones', icon: Wrench },
  { key: 'compras', label: 'Compras', icon: ShoppingCart },
  { key: 'usuarios', label: 'Usuarios', icon: Users },
];

function Sidebar({ active, setActive, isMobileMenuOpen = false, setIsMobileMenuOpen }) {
  const navigate = useNavigate();
  const { navigateToListPage, navigateToDashboard } = useNavigation();
  // Estado para controlar si el sidebar está abierto en mobile (legacy)
  const [open, setOpen] = useState(false);
  
  // Usar el estado del AppLayout si está disponible
  const isOpen = isMobileMenuOpen !== undefined ? isMobileMenuOpen : open;
  const setIsOpen = setIsMobileMenuOpen || setOpen;
  
  /**
   * Maneja la navegación en el sidebar
   */
  const handleNavigation = (key) => {
    // Navegar directamente a las páginas de listado con filtros avanzados
    navigateToListPage(key);
    setIsOpen(false);
  };
  
  return (
    <>
      {/* Sidebar principal de navegación */}
      {/* Fixed positioning en desktop, slide-in en mobile */}
      <nav className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-xl z-50 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } border-r-2 border-gray-700`}>
        {/* Header del sidebar con título y botón de cerrar en mobile */}
        <div className="py-4 px-6 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
            <div 
            className="font-bold text-xl cursor-pointer hover:text-gray-300 transition-colors flex-1 flex items-center gap-2"
            onClick={() => { setActive && setActive(null); navigateToDashboard(); setIsOpen(false); }}
          >
            <Wheat className="w-6 h-6 text-green-400" />
            Sistema Agrícola
          </div>
          
          {/* Botón cerrar solo en mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Lista de navegación */}
        <div className="flex-1 overflow-y-auto py-4">
          <ul className="px-4 space-y-1">
            {/* Botón Dashboard - sección principal */}
            <li>
              <button
                className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-200 flex items-center ${
                  active === null
                    ? 'bg-green-600 text-white border-l-4 border-green-400 shadow-md'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => { setActive && setActive(null); navigateToDashboard(); setIsOpen(false); }}
              >
                <BarChart3 size={20} className="mr-3" />
                <span className="font-medium">Dashboard</span>
              </button>
            </li>
            
            {/* Separador */}
            <li className="py-2">
              <div className="border-t border-gray-700"></div>
              <div className="text-xs text-gray-500 mt-2 px-4 font-semibold uppercase tracking-wider">
                Gestión
              </div>
            </li>
            
            {/* Renderizar botones para cada sección configurada */}
            {sections.map(s => (
              <li key={s.key}>
                <button
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-md flex items-center group ${
                    active === s.key ? 'bg-gray-700 font-semibold border-l-4 border-blue-400 text-white' : 'text-gray-300'
                  }`}
                  onClick={() => handleNavigation(s.key)}
                >
                  <s.icon size={20} className="mr-3 group-hover:text-blue-400" />
                  <span>{s.label}</span>
                  {/* Indicador visual para sección activa */}
                  {active === s.key && (
                    <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Footer del sidebar */}
        <div className="border-t border-gray-700 p-4">
          <div className="text-xs text-gray-500 text-center">
            Sistema Agrícola v2.0
          </div>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
