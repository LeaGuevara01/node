/**
 * Breadcrumbs - Componente de navegación de ruta
 *
 * Muestra la ruta actual de navegación con enlaces clickeables
 *
 * @param {Array} items - Array de breadcrumbs [{label, href}]
 * @param {string} separator - Separador entre breadcrumbs
 * @param {string} className - Clases adicionales
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Truck, Settings, Building2, Wrench, Users, BarChart3, Wheat, ShoppingCart } from 'lucide-react';

const Breadcrumbs = ({ items = [], separator = 'chevron', className = '' }) => {
  // Mapeo de iconos por label, monocromáticos y consistentes con Sidebar/Dashboard
  const iconMap = {
    'Inicio': <Home size={16} className="mr-1 text-gray-500" />,
    'Dashboard': <BarChart3 size={16} className="mr-1 text-gray-500" />,
    'Maquinarias': <Truck size={16} className="mr-1 text-gray-500" />,
    'Equipos': <Truck size={16} className="mr-1 text-gray-500" />,
    'Repuestos': <Settings size={16} className="mr-1 text-gray-500" />,
    'Proveedores': <Building2 size={16} className="mr-1 text-gray-500" />,
    'Reparaciones': <Wrench size={16} className="mr-1 text-gray-500" />,
    'Compras': <ShoppingCart size={16} className="mr-1 text-gray-500" />,
    'Usuarios': <Users size={16} className="mr-1 text-gray-500" />,
    'Sistema Agrícola': <Wheat size={16} className="mr-1 text-gray-500" />,
  };
  if (!items || items.length === 0) return null;

  const renderSeparator = () => {
    if (separator === 'chevron') {
      return <ChevronRight size={16} className="text-gray-400 mx-2" />;
    }
    return <span className="text-gray-400 mx-2">/</span>;
  };

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && renderSeparator()}
            {item.href ? (
              <Link
                to={item.href}
                className={`flex items-center ${index === items.length - 1 ? 'text-gray-900 font-semibold underline' : 'text-gray-500 hover:text-gray-700 transition-colors'}`}
                aria-current={index === items.length - 1 ? 'page' : undefined}
              >
                {iconMap[item.label]}
                {item.label}
              </Link>
            ) : (
              <span className={`flex items-center text-gray-900 font-semibold`}>
                {iconMap[item.label]}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
