/**
 * Ejemplo de implementación de FilterDropdown actualizado
 *
 * FilterDropdown tiene las sugerencias integradas directamente
 * sin necesidad de hooks externos
 */

import React, { useState } from 'react';
import FilterDropdown from '../FilterDropdown';

const FilterDropdownExample = () => {
  const [filters, setFilters] = useState({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Datos para sugerencias
  const maquinariasData = [
    { marca: 'John Deere', modelo: 'X500' },
    { marca: 'Case IH', modelo: 'Magnum' },
    { marca: 'New Holland', modelo: 'T7' },
    { marca: 'Massey Ferguson', modelo: 'MF 4700' },
  ];

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filtros aplicados:', newFilters);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">FilterDropdown con Sugerencias</h2>

      <div className="flex justify-end mb-4">
        <FilterDropdown
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
          <pre>{JSON.stringify(filters, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FilterDropdownExample;
