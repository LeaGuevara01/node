/**
 * QuickActionCard - Tarjeta de acción rápida mejorada
 * 
 * Proporciona navegación directa desde el dashboard a las secciones
 * con opciones de crear, ver lista, y acceder a acciones específicas
 * 
 * @param {string} type - Tipo de sección (maquinarias, repuestos, etc.)
 * @param {string} title - Título de la sección
 * @param {string} icon - Emoji o icono para mostrar
 * @param {number} count - Cantidad de elementos en la sección
 * @param {Array} quickActions - Acciones rápidas disponibles
 * @param {Function} onNavigate - Callback de navegación
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  Plus, 
  List, 
  Eye, 
  Edit3, 
  Tractor,
  Package,
  Building2,
  Wrench
} from 'lucide-react';
import { useNavigation } from '../hooks/useNavigation';

const QuickActionCard = ({
  type,
  title,
  icon,
  count = 0,
  description = '',
  quickActions = [],
  className = ''
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const cardRef = useRef(null);
  const { navigateFromDashboard, navigateToListPage } = useNavigation();

  const defaultQuickActions = [
    {
      key: 'view',
      label: 'Ver Lista',
      icon: <List size={14} />,
      action: () => navigateToListPage(type),
      color: 'text-blue-600 hover:bg-blue-50'
    },
    {
      key: 'create',
      label: 'Crear Nuevo',
      icon: <Plus size={14} />,
      action: () => navigateFromDashboard(type, 'create'),
      color: 'text-green-600 hover:bg-green-50'
    }
  ];

  const actions = quickActions.length > 0 ? quickActions : defaultQuickActions;

  // Detectar entorno táctil (coarse pointer / no hover)
  useEffect(() => {
    const touch = matchMedia('(hover: none), (pointer: coarse)').matches || 'ontouchstart' in window;
    setIsTouch(touch);
  }, []);

  // Cerrar acciones al tocar fuera en móvil
  useEffect(() => {
    if (!isTouch || !showActions) return;
    const handleOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setShowActions(false);
      }
    };
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('click', handleOutside);
    return () => {
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('click', handleOutside);
    };
  }, [isTouch, showActions]);

  const handleMainClick = () => {
    // En táctil: primer tap abre, segundo tap (ya abierto) navega
    if (isTouch) {
      if (!showActions) {
        setShowActions(true);
        return;
      }
    }
    navigateToListPage(type);
  };

  const handleActionClick = (e, actionFn) => {
    e.stopPropagation();
    actionFn();
  };

  return (
    <div 
      ref={cardRef}
      className={`bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group cursor-pointer flex flex-col h-full ${className}`}
      onMouseEnter={() => { if (!isTouch) setShowActions(true); }}
      onMouseLeave={() => { if (!isTouch) setShowActions(false); }}
    >
      {/* Main Content */}
      <div 
        onClick={handleMainClick}
        className="p-4 sm:p-5 hover:bg-gray-50 transition-colors flex-1 min-h-[112px]"
        role="button"
        aria-expanded={showActions}
        aria-haspopup="true"
        aria-label={isTouch ? `${title} - ${showActions ? 'ocultar acciones' : 'mostrar acciones'}` : title}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl sm:text-3xl">
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <div className="mt-1 text-xs sm:text-sm text-gray-600 leading-snug h-10 overflow-hidden">
                {description}
              </div>
            </div>
          </div>
          
          <ChevronRight 
            size={20} 
            className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" 
          />
        </div>
      </div>

      {/* Quick Actions - Visible on hover */}
      <div 
        className={`
          border-t border-gray-100 transition-all duration-300 overflow-hidden
          ${showActions ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="p-3 bg-gray-50 flex flex-wrap items-center justify-center gap-2">
          {actions.map((action, index) => (
            <button
              key={action.key || index}
              onClick={(e) => handleActionClick(e, action.action)}
              className={`
                flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-md text-xs font-medium
                border border-transparent hover:border-gray-300 transition-all duration-200
                ${action.color || 'text-gray-600 hover:bg-gray-100'}
              `}
              title={action.label}
              aria-label={action.label}
            >
              {action.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Configuración predefinida para diferentes secciones
export const SectionCards = {
  maquinarias: {
  title: 'Equipos',
    icon: <Tractor size={20} />,
  description: 'Gestión de equipos agrícolas',
    quickActions: [
      {
        key: 'view',
    label: 'Ver Lista',
        icon: <List size={14} />,
        color: 'text-blue-600 hover:bg-blue-50'
      },
      {
        key: 'create',
    label: 'Nuevo Equipo',
        icon: <Plus size={14} />,
        color: 'text-green-600 hover:bg-green-50'
      },
      {
        key: 'maintenance',
        label: 'Mantenimiento',
        icon: <Edit3 size={14} />,
        color: 'text-orange-600 hover:bg-orange-50'
      }
    ]
  },
  repuestos: {
    title: 'Repuestos',
    icon: <Package size={20} />,
    description: 'Inventario de repuestos',
    quickActions: [
      {
        key: 'view',
        label: 'Ver Inventario',
        icon: <List size={14} />,
        color: 'text-blue-600 hover:bg-blue-50'
      },
      {
        key: 'create',
        label: 'Nuevo Repuesto',
        icon: <Plus size={14} />,
        color: 'text-green-600 hover:bg-green-50'
      },
      {
        key: 'low-stock',
        label: 'Stock Bajo',
        icon: <Eye size={14} />,
        color: 'text-red-600 hover:bg-red-50'
      }
    ]
  },
  proveedores: {
    title: 'Proveedores',
    icon: <Building2 size={20} />,
    description: 'Directorio de proveedores',
    quickActions: [
      {
        key: 'view',
        label: 'Ver Directorio',
        icon: <List size={14} />,
        color: 'text-blue-600 hover:bg-blue-50'
      },
      {
        key: 'create',
        label: 'Nuevo Proveedor',
        icon: <Plus size={14} />,
        color: 'text-green-600 hover:bg-green-50'
      }
    ]
  },
  reparaciones: {
    title: 'Reparaciones',
    icon: <Wrench size={20} />,
    description: 'Historial y programación',
    quickActions: [
      {
        key: 'view',
        label: 'Ver Historial',
        icon: <List size={14} />,
        color: 'text-blue-600 hover:bg-blue-50'
      },
      {
        key: 'create',
        label: 'Nueva Reparación',
        icon: <Plus size={14} />,
        color: 'text-green-600 hover:bg-green-50'
      },
      {
        key: 'pending',
        label: 'Pendientes',
        icon: <Eye size={14} />,
        color: 'text-yellow-600 hover:bg-yellow-50'
      }
    ]
  }
};

export default QuickActionCard;
