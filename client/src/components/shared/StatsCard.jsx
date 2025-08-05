/**
 * StatsCard - Componente de tarjetas de estadísticas mejorado
 * 
 * Utiliza el sistema de design tokens para consistencia visual.
 * Incluye funcionalidad de navegación clickeable y mejor accesibilidad.
 * 
 * @param {string} type - Tipo de estadística (maquinarias, repuestos, proveedores, reparaciones)
 * @param {string} title - Título a mostrar en la tarjeta
 * @param {number} value - Valor numérico de la estadística
 * @param {function} onClick - Función que se ejecuta al hacer click en la tarjeta
 * @param {boolean} clickable - Indica si la tarjeta es clickeable (por defecto true)
 * @param {string} subtitle - Subtítulo opcional para información adicional
 * @param {string} trend - Indicador de tendencia opcional ('up', 'down', 'stable')
 * @param {string} variant - Variante visual ('default', 'agricultural', 'minimal')
 */

import React from 'react';
import { 
  Truck, 
  Settings, 
  Building2, 
  Wrench, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { DESIGN_TOKENS, COMPONENT_VARIANTS } from '../../styles';

// Configuración de iconos por tipo
const ICON_MAP = {
  maquinarias: Truck,
  repuestos: Settings,
  proveedores: Building2,
  reparaciones: Wrench
};

// Configuración de colores por tipo usando design tokens
const TYPE_COLORS = {
  maquinarias: {
    background: 'bg-agricultural-sky-50',
    text: 'text-agricultural-sky-600',
    accent: 'border-agricultural-sky-500',
    hover: 'hover:bg-agricultural-sky-100'
  },
  repuestos: {
    background: 'bg-agricultural-crop-50',
    text: 'text-agricultural-crop-600',
    accent: 'border-agricultural-crop-500',
    hover: 'hover:bg-agricultural-crop-100'
  },
  proveedores: {
    background: 'bg-agricultural-earth-50',
    text: 'text-agricultural-earth-600',
    accent: 'border-agricultural-earth-500',
    hover: 'hover:bg-agricultural-earth-100'
  },
  reparaciones: {
    background: 'bg-agricultural-machinery-50',
    text: 'text-agricultural-machinery-600',
    accent: 'border-agricultural-machinery-500',
    hover: 'hover:bg-agricultural-machinery-100'
  }
};

// Iconos para tendencias
const TREND_ICONS = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus
};

const TREND_COLORS = {
  up: 'text-green-500',
  down: 'text-red-500',
  stable: 'text-gray-400'
};

function StatsCard({ 
  type, 
  title, 
  value, 
  onClick, 
  clickable = true,
  subtitle,
  trend,
  variant = 'default'
}) {
  const IconComponent = ICON_MAP[type];
  const typeColors = TYPE_COLORS[type] || TYPE_COLORS.maquinarias;
  const TrendIcon = trend ? TREND_ICONS[trend] : null;
  
  // Clases base del componente
  const baseClasses = COMPONENT_VARIANTS.CARD_VARIANTS.default;
  
  // Clases específicas según variante
  const variantClasses = {
    default: `${baseClasses} border-l-4 ${typeColors.accent}`,
    agricultural: `${baseClasses} bg-gradient-to-br from-white to-agricultural-earth-25 border ${typeColors.accent}`,
    minimal: 'bg-white p-4 rounded-lg border border-gray-100'
  };

  // Clases de interactividad
  const interactiveClasses = clickable && onClick ? `
    cursor-pointer 
    transition-all duration-200 
    hover:shadow-lg 
    hover:scale-[1.02] 
    active:scale-100
    ${typeColors.hover}
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2 
    focus:ring-agricultural-crop-500
  ` : '';

  const cardClasses = `
    ${variantClasses[variant]}
    ${interactiveClasses}
    group
  `.replace(/\s+/g, ' ').trim();

  // Manejar eventos
  const handleClick = () => {
    if (clickable && onClick) {
      onClick(type);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && clickable && onClick) {
      e.preventDefault();
      onClick(type);
    }
  };

  return (
    <div 
      className={cardClasses}
      onClick={handleClick}
      role={clickable && onClick ? "button" : undefined}
      tabIndex={clickable && onClick ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={clickable && onClick ? `Ver detalles de ${title}` : undefined}
    >
      <div className="flex items-center justify-between">
        {/* Contenido principal */}
        <div className="flex items-center space-x-3">
          {/* Icono */}
          <div className={`
            p-3 rounded-full 
            ${typeColors.background} 
            ${typeColors.text}
            transition-transform duration-200
            ${clickable && onClick ? 'group-hover:scale-110' : ''}
          `}>
            <IconComponent size={24} className="transition-all duration-200" />
          </div>
          
          {/* Información textual */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : (value || 0)}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Indicadores derechos */}
        <div className="flex flex-col items-end space-y-2">
          {/* Indicador de tendencia */}
          {TrendIcon && (
            <div className={`p-1 ${TREND_COLORS[trend]}`}>
              <TrendIcon size={16} />
            </div>
          )}
          
          {/* Flecha de navegación */}
          {clickable && onClick && (
            <div className={`
              p-1 rounded-full 
              ${typeColors.text} 
              opacity-0 
              group-hover:opacity-100 
              transition-opacity duration-200
              transform translate-x-1 
              group-hover:translate-x-0
            `}>
              <ChevronRight size={16} />
            </div>
          )}
        </div>
      </div>

      {/* Barra de progreso opcional (para versiones futuras) */}
      {variant === 'agricultural' && (
        <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${typeColors.accent.replace('border-', 'bg-')} rounded-full transition-all duration-500`}
            style={{ width: `${Math.min((value / 100) * 100, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default StatsCard;

// Componente de resumen de estadísticas
export function StatsGrid({ stats, onCardClick, variant = 'default' }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(stats).map(([type, value]) => (
        <StatsCard
          key={type}
          type={type}
          title={type.charAt(0).toUpperCase() + type.slice(1)}
          value={value}
          onClick={onCardClick}
          variant={variant}
        />
      ))}
    </div>
  );
}

// Hook para gestionar estadísticas
export function useStats(data) {
  const stats = React.useMemo(() => {
    return {
      maquinarias: Array.isArray(data.maquinarias) ? data.maquinarias.length : 0,
      repuestos: Array.isArray(data.repuestos) ? data.repuestos.length : 0,
      proveedores: Array.isArray(data.proveedores) ? data.proveedores.length : 0,
      reparaciones: Array.isArray(data.reparaciones) ? data.reparaciones.length : 0
    };
  }, [data]);

  return stats;
}
