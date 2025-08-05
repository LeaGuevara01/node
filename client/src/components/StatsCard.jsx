/**
 * Componente StatsCard - Tarjeta de estadísticas para el dashboard
 * 
 * Muestra de forma visual las estadísticas del sistema con:
 * - Iconos de Lucide React específicos para cada tipo
 * - Esquema de colores diferenciado por categoría
 * - Animaciones de hover suaves
 * - Diseño consistente y responsive
 * 
 * @param {string} type - Tipo de estadística (maquinarias, repuestos, proveedores, reparaciones)
 * @param {string} title - Título a mostrar en la tarjeta
 * @param {number} value - Valor numérico de la estadística
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

function StatsCard({ type, title, value }) {
  // Obtener estilos e icono según el tipo
  const style = cardStyles[type];
  const IconComponent = iconMap[type];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center">
        {/* Contenedor del icono con colores temáticos */}
        <div className={`p-2 rounded-full ${style.bgColor} ${style.textColor} mr-3`}>
          <IconComponent size={20} />
        </div>
        
        {/* Información textual */}
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl font-semibold text-gray-900">{value || 0}</p>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
