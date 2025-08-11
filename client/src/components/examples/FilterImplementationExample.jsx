/**
 * Ejemplo de implementación de FilterDropdownV2 con datos
 * 
 * Este ejemplo muestra cómo:
 * 1. Importar FilterDropdownV2
 * 2. Pasar datos para sugerencias
 * 3. Manejar cambios de filtros
 * 4. Integrar en páginas existentes
 */

import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import FilterDropdownV2 from '../FilterDropdownV2';

const FilterImplementationExample = () => {
  // 1. Estado para controlar filtros y dropdown
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 2. Datos de ejemplo para sugerencias (reemplaza con tus datos reales)
  const maquinariasData = [
    { id: 1, marca: 'John Deere', modelo: 'X500', tipo: 'Tractor', estado: 'Operativa' },
    { id: 2, marca: 'Case IH', modelo: 'Magnum', tipo: 'Tractor', estado: 'En mantenimiento' },
    { id: 3, marca: 'New Holland', modelo: 'T7', tipo: 'Tractor', estado: 'Operativa' },
    { id: 4, marca: 'Massey Ferguson', modelo: 'MF 4700', tipo: 'Tractor', estado: 'Averiada' },
    { id: 5, marca: 'Claas', modelo: 'Lexion', tipo: 'Cosechadora', estado: 'Operativa' }
  ];

  const repuestosData = [
    { id: 1, nombre: 'Filtro de aceite', proveedor: 'AutoPartes SA', categoria: 'Motor' },
    { id: 2, nombre: 'Bomba hidráulica', proveedor: 'HidroTech', categoria: 'Hidráulico' },
    { id: 3, nombre: 'Alternador', proveedor: 'ElectroMax', categoria: 'Eléctrico' },
    { id: 4, nombre: 'Embrague', proveedor: 'AutoPartes SA', categoria: 'Transmisión' }
  ];

  const proveedoresData = [
    { id: 1, nombre: 'AutoPartes SA', localidad: 'Buenos Aires', tipo: 'Repuestos' },
    { id: 2, nombre: 'HidroTech', localidad: 'Córdoba', tipo: 'Servicios' },
    { id: 3, nombre: 'ElectroMax', localidad: 'Rosario', tipo: 'Repuestos' },
    { id: 4, nombre: 'AgriServicios', localidad: 'Mendoza', tipo: 'Servicios' }
  ];

  // 3. Función para manejar cambios de filtros
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filtros aplicados:', newFilters);
    
    // Aquí aplicarías los filtros a tus datos
    // Ejemplo: filtrarDatos(newFilters);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Ejemplos de FilterDropdownV2 con Sugerencias</h1>
      
      {/* Ejemplo 1: Filtros para Maquinarias */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Filtros de Maquinarias</h2>
        <div className="flex justify-end mb-4">
          <FilterDropdownV2
            filters={filters}
            onFiltersChange={handleFiltersChange}
            section="maquinarias"
            isOpen={isFilterOpen}
            onToggle={setIsFilterOpen}
            data={maquinariasData} // ← Pasar tus datos aquí
          />
        </div>
        
        {/* Mostrar filtros activos */}
        {Object.keys(filters).length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Filtros Activos:</h3>
            <pre className="text-sm text-blue-600">
              {JSON.stringify(filters, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Ejemplo 2: Filtros para Repuestos */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Filtros de Repuestos</h2>
        <div className="flex justify-end mb-4">
          <FilterDropdownV2
            filters={filters}
            onFiltersChange={handleFiltersChange}
            section="repuestos"
            isOpen={isFilterOpen}
            onToggle={setIsFilterOpen}
            data={repuestosData} // ← Pasar tus datos aquí
          />
        </div>
      </div>

      {/* Ejemplo 3: Filtros para Proveedores */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Filtros de Proveedores</h2>
        <div className="flex justify-end mb-4">
          <FilterDropdownV2
            filters={filters}
            onFiltersChange={handleFiltersChange}
            section="proveedores"
            isOpen={isFilterOpen}
            onToggle={setIsFilterOpen}
            data={proveedoresData} // ← Pasar tus datos aquí
          />
        </div>
      </div>

      {/* Guía de implementación */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          Guía de Implementación:
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>1. Importar:</strong> <code className="bg-white px-1 rounded">import FilterDropdownV2 from '../FilterDropdownV2';</code></p>
          <p><strong>2. Estado:</strong> <code className="bg-white px-1 rounded">const [filters, setFilters] = useState({});</code></p>
          <p><strong>3. Props requeridas:</strong></p>
          <ul className="ml-4 list-disc">
            <li><code className="bg-white px-1 rounded">data={tusDatos}</code> - Array con datos para sugerencias</li>
            <li><code className="bg-white px-1 rounded">section="maquinarias"</code> - Sección actual</li>
            <li><code className="bg-white px-1 rounded">onFiltersChange={handleFiltersChange}</code> - Callback de filtros</li>
          </ul>
          <p><strong>4. Campos con sugerencias automáticas:</strong></p>
          <ul className="ml-4 list-disc">
            <li><strong>Maquinarias:</strong> marca, modelo</li>
            <li><strong>Repuestos:</strong> proveedor, categoria</li>
            <li><strong>Proveedores:</strong> localidad, nombre</li>
            <li><strong>Reparaciones:</strong> tecnico, observaciones</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FilterImplementationExample;
