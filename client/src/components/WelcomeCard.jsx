/**
 * Componente WelcomeCard - Tarjeta de bienvenida y guía del sistema
 * 
 * Proporciona información contextual sobre las funcionalidades disponibles:
 * - Lista de secciones del sistema con descripciones
 * - Filtrado de secciones según el rol del usuario
 * - Iconos visuales para cada sección
 * - Información de ayuda para nuevos usuarios
 * 
 * @param {string} role - Rol del usuario actual (Admin/User)
 */

import React from 'react';
import { Truck, Settings, Building2, Wrench, Users } from 'lucide-react';

// Configuración de información para cada sección del sistema
const sectionInfo = [
  {
    key: 'maquinarias',
    title: 'Maquinarias',
    description: 'Gestiona el inventario de maquinaria agrícola',
    dotColor: 'bg-blue-500',
    icon: Truck,
    iconColor: 'text-blue-600'
  },
  {
    key: 'repuestos',
    title: 'Repuestos',
    description: 'Control de stock de repuestos y componentes',
    dotColor: 'bg-green-500',
    icon: Settings,
    iconColor: 'text-green-600'
  },
  {
    key: 'proveedores',
    title: 'Proveedores',
    description: 'Directorio de proveedores y contactos',
    dotColor: 'bg-purple-500',
    icon: Building2,
    iconColor: 'text-purple-600'
  },
  {
    key: 'reparaciones',
    title: 'Reparaciones',
    description: 'Registro y seguimiento de reparaciones',
    dotColor: 'bg-orange-500',
    icon: Wrench,
    iconColor: 'text-orange-600'
  },
  {
    key: 'usuarios',
    title: 'Usuarios',
    description: 'Gestión de usuarios del sistema',
    dotColor: 'bg-red-500',
    icon: Users,
    iconColor: 'text-red-600',
    adminOnly: true  // Solo visible para administradores
  }
];

function WelcomeCard({ role }) {
  // Filtrar secciones según el rol del usuario
  // Las secciones con adminOnly solo se muestran a administradores
  const visibleSections = sectionInfo.filter(section => 
    !section.adminOnly || role === 'Admin'
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      {/* Título de bienvenida */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Bienvenido al Sistema de Gestión Agrícola
      </h3>
      
      {/* Descripción general */}
      <p className="text-gray-600 mb-4">
        Utiliza el menú lateral para navegar entre las diferentes secciones del sistema:
      </p>
      
      {/* Lista de secciones disponibles con iconos y descripciones */}
      <ul className="space-y-3 text-sm text-gray-600">
        {visibleSections.map(section => {
          const IconComponent = section.icon;
          return (
            <li key={section.key} className="flex items-center">
              {/* Icono de la sección */}
              <div className={`p-1.5 rounded-md ${section.iconColor} bg-gray-50 mr-3`}>
                <IconComponent size={16} />
              </div>
              {/* Título y descripción */}
              <span>
                <strong>{section.title}:</strong> {section.description}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default WelcomeCard;
