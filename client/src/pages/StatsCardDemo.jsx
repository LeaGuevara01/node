/**
 * Ejemplo de implementación del sistema de cartas clickeables
 * 
 * Este archivo demuestra cómo usar tanto el StatsCard original mejorado
 * como el nuevo StatsCard del sistema de design tokens.
 */

import React, { useState } from 'react';
import StatsCard from '../components/StatsCard'; // Original mejorado
import { StatsCard as NewStatsCard, StatsGrid } from '../styles'; // Nuevo sistema

// Datos de ejemplo
const mockStats = {
  maquinarias: 25,
  repuestos: 150,
  proveedores: 12,
  reparaciones: 8
};

function StatsCardDemo() {
  const [activeSection, setActiveSection] = useState(null);

  const handleCardClick = (type) => {
    console.log(`Navegando a: ${type}`);
    setActiveSection(type);
  };

  const handleBack = () => {
    setActiveSection(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🚀 Demo: Cartas de Estadísticas Clickeables
          </h1>
          <p className="text-gray-600">
            Comparación entre componentes original y nuevo sistema de design tokens
          </p>
        </div>

        {!activeSection ? (
          <>
            {/* Versión Original Mejorada */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                📊 StatsCard Original (Mejorado)
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatsCard 
                  type="maquinarias" 
                  title="Maquinarias" 
                  value={mockStats.maquinarias}
                  onClick={handleCardClick}
                />
                <StatsCard 
                  type="repuestos" 
                  title="Repuestos" 
                  value={mockStats.repuestos}
                  onClick={handleCardClick}
                />
                <StatsCard 
                  type="proveedores" 
                  title="Proveedores" 
                  value={mockStats.proveedores}
                  onClick={handleCardClick}
                />
                <StatsCard 
                  type="reparaciones" 
                  title="Reparaciones" 
                  value={mockStats.reparaciones}
                  onClick={handleCardClick}
                />
              </div>
            </section>

            {/* Nuevo Sistema con Design Tokens */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                🎨 StatsCard Nuevo (Design Tokens)
              </h2>
              
              {/* Variante Default */}
              <h3 className="text-lg font-medium text-gray-700 mb-3">Variante Default</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <NewStatsCard 
                  type="maquinarias" 
                  title="Maquinarias" 
                  value={mockStats.maquinarias}
                  onClick={handleCardClick}
                  variant="default"
                />
                <NewStatsCard 
                  type="repuestos" 
                  title="Repuestos" 
                  value={mockStats.repuestos}
                  onClick={handleCardClick}
                  variant="default"
                  subtitle="En stock"
                />
                <NewStatsCard 
                  type="proveedores" 
                  title="Proveedores" 
                  value={mockStats.proveedores}
                  onClick={handleCardClick}
                  variant="default"
                  trend="up"
                />
                <NewStatsCard 
                  type="reparaciones" 
                  title="Reparaciones" 
                  value={mockStats.reparaciones}
                  onClick={handleCardClick}
                  variant="default"
                  subtitle="Pendientes"
                  trend="down"
                />
              </div>

              {/* Variante Agricultural */}
              <h3 className="text-lg font-medium text-gray-700 mb-3">Variante Agricultural</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <NewStatsCard 
                  type="maquinarias" 
                  title="Maquinarias" 
                  value={mockStats.maquinarias}
                  onClick={handleCardClick}
                  variant="agricultural"
                />
                <NewStatsCard 
                  type="repuestos" 
                  title="Repuestos" 
                  value={mockStats.repuestos}
                  onClick={handleCardClick}
                  variant="agricultural"
                  subtitle="En inventario"
                />
                <NewStatsCard 
                  type="proveedores" 
                  title="Proveedores" 
                  value={mockStats.proveedores}
                  onClick={handleCardClick}
                  variant="agricultural"
                  trend="stable"
                />
                <NewStatsCard 
                  type="reparaciones" 
                  title="Reparaciones" 
                  value={mockStats.reparaciones}
                  onClick={handleCardClick}
                  variant="agricultural"
                  subtitle="En proceso"
                />
              </div>

              {/* StatsGrid Component */}
              <h3 className="text-lg font-medium text-gray-700 mb-3">StatsGrid Component</h3>
              <StatsGrid 
                stats={mockStats}
                onCardClick={handleCardClick}
                variant="agricultural"
              />
            </section>

            {/* Instrucciones */}
            <section className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                💡 Cómo usar en tu Dashboard
              </h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p><strong>1. Importa el componente:</strong></p>
                <code className="block bg-blue-100 p-2 rounded text-xs">
                  import StatsCard from '../components/StatsCard';
                </code>
                
                <p><strong>2. Usa en tu componente:</strong></p>
                <code className="block bg-blue-100 p-2 rounded text-xs">
                  &lt;StatsCard type="maquinarias" title="Maquinarias" value={25} onClick={handleClick} /&gt;
                </code>
                
                <p><strong>3. Maneja la navegación:</strong></p>
                <code className="block bg-blue-100 p-2 rounded text-xs">
                  const handleClick = (type) =&gt; setActiveSection(type);
                </code>
              </div>
            </section>
          </>
        ) : (
          /* Vista de sección activa */
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBack}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  ← Volver
                </button>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800 capitalize">
                    {activeSection}
                  </h2>
                  <p className="text-gray-600">
                    Sección de gestión de {activeSection}
                  </p>
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-700">
                Total: {mockStats[activeSection]}
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-4">
                🎯 ¡Perfecto! Has navegado a la sección de <strong>{activeSection}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Aquí cargarías el componente específico (MaquinariaForm, RepuestoForm, etc.)
              </p>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default StatsCardDemo;
