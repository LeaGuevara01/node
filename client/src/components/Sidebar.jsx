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
import { Truck, Settings, Building2, Wrench, Users, BarChart3, Menu } from 'lucide-react';

// Configuración de las secciones disponibles en el sistema
const sections = [
  { key: 'maquinarias', label: 'Maquinarias', icon: Truck },
  { key: 'repuestos', label: 'Repuestos', icon: Settings },
  { key: 'proveedores', label: 'Proveedores', icon: Building2 },
  { key: 'reparaciones', label: 'Reparaciones', icon: Wrench },
  { key: 'usuarios', label: 'Usuarios', icon: Users },
];

function Sidebar({ active, setActive }) {
  // Estado para controlar si el sidebar está abierto en mobile
  const [open, setOpen] = useState(false);
  
  return (
    <>
      {/* Barra de activación mobile - solo visible en pantallas pequeñas */}
      {/* Actúa como "botón hamburguesa" para abrir el sidebar */}
      <div 
        className={`md:hidden fixed top-0 left-0 w-12 h-full bg-gray-800 z-50 transition-all duration-300 cursor-pointer hover:bg-gray-700 ${
          open ? 'w-0 opacity-0' : 'w-12 opacity-100'
        }`}
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center justify-center h-12 pt-16">
          <Menu className="text-white" size={20} />
        </div>
      </div>
      
      {/* Sidebar principal de navegación */}
      {/* Fixed positioning para evitar afectar el flujo del documento */}
      {/* Animación de slide desde la izquierda en mobile */}
      <nav className={`fixed top-0 left-0 h-full w-56 bg-gray-900 text-white shadow-xl z-50 transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} border-r-2 border-gray-700`}>
        {/* Header del sidebar con título */}
        <div 
          className="py-3 px-4 font-bold text-xl border-b border-gray-700 bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => { setActive(null); setOpen(false); }}
        >
          Secciones
        </div>
        
        {/* Lista de navegación */}
        <ul className="mt-2 px-2">
          {/* Botón Dashboard - sección principal */}
          <li className="mb-2">
            <button
              className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-200 ${
                active === null
                  ? 'bg-green-600 text-white border-l-4 border-green-400 shadow-md'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => { setActive(null); setOpen(false); }}
            >
              <div className="flex items-center">
                <BarChart3 size={18} className="mr-2" />
                Dashboard
              </div>
            </button>
          </li>
          
          {/* Renderizar botones para cada sección configurada */}
          {sections.map(s => (
            <li key={s.key} className="mb-1">
              <button
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-md ${
                  active === s.key ? 'bg-gray-700 font-semibold border-l-4 border-blue-400' : ''
                }`}
                onClick={() => { setActive(s.key); setOpen(false); }}
              >
                <div className="flex items-center">
                  <s.icon size={18} className="mr-2" />
                  {s.label}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Overlay semitransparente para mobile cuando el sidebar está abierto */}
      {/* Permite cerrar el sidebar tocando fuera de él */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300" 
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
