/**
 * MaquinariasPageWithFilters - Página de maquinarias con filtros integrados
 * 
 * Ejemplo de página de sección que incluye:
 * - Filtros desplegables personalizables
 * - Navegación responsive
 * - Gestión de estado de filtros
 * - Integración con el sistema de navegación
 */

import React, { useState, useEffect } from 'react';
import { Tractor } from 'lucide-react';
import { getMaquinarias } from '../services/api';
import AppLayout from '../components/navigation/AppLayout';
import FilterDropdownV2 from '../components/FilterDropdownV2'; // ← Cambiar a V2
import QuickActionCard from '../components/QuickActionCard';
import { CreateButton, EditButton, ViewButton, DeleteButton } from '../components/navigation/NavigationButtons';
import { useNavigation } from '../hooks/useNavigation';
import StatsCard from '../components/StatsCard';
import RoleGuard from '../components/RoleGuard';

function MaquinariasPageWithFilters({ token, role, onLogout }) {
  const { getSectionFilters, updateSectionFilters } = useNavigation();
  
  // Estados
  const [maquinarias, setMaquinarias] = useState([]);
  const [filteredMaquinarias, setFilteredMaquinarias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState(getSectionFilters('maquinarias') || {});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Cargar datos
  useEffect(() => {
    fetchMaquinarias();
  }, [token]);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    applyFilters();
  }, [maquinarias, currentFilters]);

  const fetchMaquinarias = async () => {
    try {
      setLoading(true);
      const response = await getMaquinarias(token);
      const data = Array.isArray(response) ? response : response.maquinarias || [];
      setMaquinarias(data);
    } catch (err) {
      console.error('Error fetching maquinarias:', err);
      setError('Error al cargar las maquinarias');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...maquinarias];

    // Filtro de búsqueda general
    if (currentFilters.search) {
      const searchTerm = currentFilters.search.toLowerCase();
      filtered = filtered.filter(maq => 
        maq.marca?.toLowerCase().includes(searchTerm) ||
        maq.modelo?.toLowerCase().includes(searchTerm) ||
        maq.tipo?.toLowerCase().includes(searchTerm) ||
        maq.numeroSerie?.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por tipo
    if (currentFilters.tipo) {
      filtered = filtered.filter(maq => maq.tipo === currentFilters.tipo);
    }

    // Filtro por estado
    if (currentFilters.estado) {
      filtered = filtered.filter(maq => maq.estado === currentFilters.estado);
    }

    // Filtro por marca
    if (currentFilters.marca) {
      filtered = filtered.filter(maq => 
        maq.marca?.toLowerCase().includes(currentFilters.marca.toLowerCase())
      );
    }

    // Filtro por rango de año
    if (currentFilters.año?.min) {
      filtered = filtered.filter(maq => parseInt(maq.año) >= parseInt(currentFilters.año.min));
    }
    if (currentFilters.año?.max) {
      filtered = filtered.filter(maq => parseInt(maq.año) <= parseInt(currentFilters.año.max));
    }

    setFilteredMaquinarias(filtered);
  };

  const handleFiltersChange = (newFilters) => {
    setCurrentFilters(newFilters);
    updateSectionFilters('maquinarias', newFilters);
  };

  const handleDeleteMaquinaria = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta maquinaria?')) {
      try {
        // Aquí iría la lógica de eliminación
        console.log('Eliminar maquinaria:', id);
        fetchMaquinarias(); // Recargar datos
      } catch (err) {
        console.error('Error eliminando maquinaria:', err);
      }
    }
  };

  // Calcular estadísticas
  const stats = {
    total: maquinarias.length,
    operativas: maquinarias.filter(m => m.estado === 'Operativa').length,
    enMantenimiento: maquinarias.filter(m => m.estado === 'En mantenimiento').length,
    averiadas: maquinarias.filter(m => m.estado === 'Averiada').length,
    filtered: filteredMaquinarias.length
  };

  // Acciones del header
  const headerActions = (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <FilterDropdownV2
        filters={currentFilters}
        onFiltersChange={handleFiltersChange}
        section="maquinarias"
        isOpen={isFilterOpen}
        onToggle={setIsFilterOpen}
        data={maquinarias} // ← Datos para generar sugerencias automáticas
      />
      
      <div className="flex items-center space-x-1">
        <button
          onClick={() => setViewMode('grid')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'grid' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
          title="Vista en cuadrícula"
        >
          <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
            <div className="bg-current rounded-sm"></div>
            <div className="bg-current rounded-sm"></div>
            <div className="bg-current rounded-sm"></div>
            <div className="bg-current rounded-sm"></div>
          </div>
        </button>
        
        <button
          onClick={() => setViewMode('list')}
          className={`p-2 rounded-lg transition-colors ${
            viewMode === 'list' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
          title="Vista en lista"
        >
          <div className="w-4 h-4 flex flex-col space-y-1">
            <div className="h-0.5 bg-current rounded"></div>
            <div className="h-0.5 bg-current rounded"></div>
            <div className="h-0.5 bg-current rounded"></div>
          </div>
        </button>
      </div>
      
      <RoleGuard role={role} allowed={["Admin", "User"]}>
        <CreateButton entity="maquinarias" />
      </RoleGuard>
    </div>
  );

  if (loading) {
    return (
      <AppLayout
        currentSection="maquinarias"
        title="Maquinarias"
        subtitle="Cargando..."
        token={token}
        role={role}
        onLogout={onLogout}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <span className="mt-4 text-lg text-gray-600">Cargando maquinarias...</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout
        currentSection="maquinarias"
        title="Maquinarias"
        subtitle="Error"
        token={token}
        role={role}
        onLogout={onLogout}
      >
        <div className="text-center text-red-600 p-8">
          <p className="text-xl mb-4">⚠️ {error}</p>
          <button
            onClick={fetchMaquinarias}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      currentSection="maquinarias"
      title="Gestión de Maquinarias"
      subtitle="Administra tu flota de maquinaria agrícola"
      actions={headerActions}
      token={token}
      role={role}
      onLogout={onLogout}
  hideSearchOnDesktop={true}
  collapseUserOnMd={true}
    >
      <div className="space-y-6">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">{stats.operativas}</div>
            <div className="text-sm text-gray-600">Operativas</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">{stats.enMantenimiento}</div>
            <div className="text-sm text-gray-600">Mantenimiento</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{stats.averiadas}</div>
            <div className="text-sm text-gray-600">Averiadas</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>

        {/* Lista de maquinarias */}
        {filteredMaquinarias.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Tractor size={64} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {maquinarias.length === 0 ? 'No hay maquinarias registradas' : 'No se encontraron maquinarias'}
            </h3>
            <p className="text-gray-600 mb-6">
              {maquinarias.length === 0 
                ? 'Comienza agregando tu primera maquinaria al sistema'
                : 'Intenta ajustar los filtros para ver más resultados'
              }
            </p>
            <RoleGuard role={role} allowed={["Admin", "User"]}>
              <CreateButton entity="maquinarias" label="Agregar Primera Maquinaria" />
            </RoleGuard>
          </div>
        ) : (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
              : 'space-y-4'
            }
          `}>
            {filteredMaquinarias.map((maquinaria) => (
              <MaquinariaCard
                key={maquinaria.id}
                maquinaria={maquinaria}
                viewMode={viewMode}
                role={role}
                onDelete={() => handleDeleteMaquinaria(maquinaria.id)}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// Componente para mostrar cada maquinaria
const MaquinariaCard = ({ maquinaria, viewMode, role, onDelete }) => {
  const estadoColors = {
    'Operativa': 'bg-green-100 text-green-800',
    'En mantenimiento': 'bg-yellow-100 text-yellow-800',
    'Averiada': 'bg-red-100 text-red-800',
    'Fuera de servicio': 'bg-gray-100 text-gray-800'
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                {maquinaria.marca} {maquinaria.modelo}
              </h3>
              <p className="text-sm text-gray-600">{maquinaria.tipo}</p>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Serie:</span> {maquinaria.numeroSerie}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Año:</span> {maquinaria.año}
            </div>
            <div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoColors[maquinaria.estado]}`}>
                {maquinaria.estado}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <ViewButton entity="maquinarias" id={maquinaria.id} size="small" />
            <RoleGuard role={role} allowed={["Admin", "User"]}>
              <EditButton entity="maquinarias" id={maquinaria.id} size="small" />
            </RoleGuard>
            <RoleGuard role={role} allowed={["Admin"]}>
              <DeleteButton onClick={onDelete} size="small" />
            </RoleGuard>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 truncate">
            {maquinaria.marca} {maquinaria.modelo}
          </h3>
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estadoColors[maquinaria.estado]}`}>
            {maquinaria.estado}
          </span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <div><span className="font-medium">Tipo:</span> {maquinaria.tipo}</div>
          <div><span className="font-medium">Serie:</span> {maquinaria.numeroSerie}</div>
          <div><span className="font-medium">Año:</span> {maquinaria.año}</div>
        </div>
        
        <div className="flex items-center justify-between">
          <ViewButton entity="maquinarias" id={maquinaria.id} size="small" />
          
          <div className="flex space-x-1">
            <RoleGuard role={role} allowed={["Admin", "User"]}>
              <EditButton entity="maquinarias" id={maquinaria.id} size="small" />
            </RoleGuard>
            <RoleGuard role={role} allowed={["Admin"]}>
              <DeleteButton onClick={onDelete} size="small" />
            </RoleGuard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaquinariasPageWithFilters;
