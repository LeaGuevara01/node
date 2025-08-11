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
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ 
  items = [], 
  separator = 'chevron', 
  className = '' 
}) => {
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
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && renderSeparator()}
              
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                >
                  {index === 0 && item.label === 'Inicio' && (
                    <Home size={16} className="mr-1" />
                  )}
                  {item.label}
                </Link>
              ) : (
                <span className={`flex items-center ${isLast ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  {index === 0 && item.label === 'Inicio' && (
                    <Home size={16} className="mr-1" />
                  )}
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
