/**
 * Componente StatsCard - Tarjeta de estadísticas para el dashboard
 * 
 * Muestra de forma visual las estadísticas del sistema con:
 * - Iconos de Lucide React específicos para cada tipo
 * - Esquema de colores diferenciado por categoría
 * - Animaciones de hover suaves
 * - Diseño consistente y responsive
 * - Funcionalidad de click para navegar a la sección correspondiente
 * 
 * @param {string} type - Tipo de estadística (maquinarias, repuestos, proveedores, reparaciones)
 * @param {string} title - Título a mostrar en la tarjeta
 * @param {number} value - Valor numérico de la estadística
 * @param {function} onClick - Función que se ejecuta al hacer click en la tarjeta
 * @param {boolean} clickable - Indica si la tarjeta es clickeable (por defecto true)
 */

import React from 'react';
import { Truck, Settings, Building2, Wrench } from 'lucide-react';

// Configuración de estilos por tipo de estadística
// Cada tipo tiene su propio esquema de colores coherente
const cardStyles = {
  maquinarias: {
    bgColor: 'bg-blue-100',    // Fondo azul claro para el icono
    textColor: 'text-blue-600', // Texto azul para el icono
    dotColor: 'bg-blue-500'     // Color para indicadores opcionales
  },
  repuestos: {
    bgColor: 'bg-green-100',
    textColor: 'text-green-600',
    dotColor: 'bg-green-500'
  },
  proveedores: {
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-600',
    dotColor: 'bg-purple-500'
  },
  reparaciones: {
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-600',
    dotColor: 'bg-orange-500'
  }
};

// Mapeo de iconos de Lucide React para cada tipo
const iconMap = {
  maquinarias: Truck,      // Camión para maquinarias
  repuestos: Settings,     // Engranaje para repuestos
  proveedores: Building2,  // Edificio para proveedores
  reparaciones: Wrench     // Llave inglesa para reparaciones
};

function StatsCard({ type, title, value, onClick, clickable = true }) {
  // Obtener estilos e icono según el tipo
  const style = cardStyles[type];
  const IconComponent = iconMap[type];

  // Determinar clases CSS según si es clickeable - Responsive optimizado
  const cardClasses = `
    bg-white p-3 sm:p-4 rounded-lg shadow-md border border-gray-200 
    transition-all duration-200 group min-h-[80px] sm:min-h-[90px]
    ${clickable && onClick ? 
      'hover:shadow-xl hover:scale-105 cursor-pointer hover:border-gray-300 active:scale-100 touch-manipulation' : 
      'hover:shadow-lg'
    }
  `.trim();

  // Manejar el click
  const handleClick = () => {
    if (clickable && onClick) {
      onClick(type);
    }
  };

  return (
    <div 
      className={cardClasses}
      onClick={handleClick}
      role={clickable && onClick ? "button" : undefined}
      tabIndex={clickable && onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && clickable && onClick) {
          e.preventDefault();
          onClick(type);
        }
      }}
    >
      <div className="flex items-center justify-between h-full">
        {/* Contenedor del icono con colores temáticos - Responsive */}
        <div className="flex items-center w-full">
          <div className={`p-2 sm:p-2.5 rounded-full ${style.bgColor} ${style.textColor} mr-2 sm:mr-3 flex-shrink-0`}>
            <IconComponent size={16} className="sm:w-5 sm:h-5" />
          </div>
          
          {/* Información textual - Responsive */}
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
