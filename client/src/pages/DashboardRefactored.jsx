/**
 * Dashboard Principal Refactorizado del Sistema de Gestión Agrícola
 * 
 * Este dashboard refactorizado utiliza:
 * - AppLayout para navegación consistente
 * - NavigationButtons para acciones estándar
 * - Contexto de navegación para manejo de rutas
 * - Componentes modulares para mejor mantenibilidad
 * 
 * Página: Dashboard (refactor)
 * Rol: vista principal con navegación rápida y métricas
 */

import React, { useEffect, useState } from 'react';
import { Activity, BarChart3, Wrench, Package, Zap } from 'lucide-react';
import { getMaquinarias, getRepuestos, getProveedores, getReparaciones } from '../services/api';
import AppLayout from '../components/navigation/AppLayout';
import { CreateButton } from '../components/navigation/NavigationButtons';
import { useNavigation } from '../hooks/useNavigation';
import StatsCard from '../components/StatsCard';
import QuickActionCard, { SectionCards } from '../components/QuickActionCard';
import WelcomeCard from '../components/WelcomeCard';
import RoleGuard from '../components/RoleGuard';

function DashboardRefactored({ token, role, onLogout }) {
  const { navigateToListPage, navigateToFormPage, navigateFromDashboard } = useNavigation();
  
  // Estados para almacenar los datos de cada entidad
  const [data, setData] = useState({
    maquinarias: [],
    repuestos: [],
    proveedores: [],
    reparaciones: []
  });
  
  // Estados de control de la UI
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    maquinarias: 0,
    repuestos: 0,
    proveedores: 0,
    reparaciones: 0
  });

  /**
   * Función para cargar todos los datos del sistema
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      // Cargar datos en paralelo para mejor rendimiento
      const [maquinariasData, repuestosData, proveedoresData, reparacionesData] = await Promise.all([
        getMaquinarias(token, {}, 1, true), // forStats = true para obtener todos
        getRepuestos(token, {}, 1, true), 
        getProveedores(token, {}, 1, true), 
        getReparaciones(token, {}, 1, true) 
      ]);
      
      // Procesar datos recibidos
      const processedMaquinarias = Array.isArray(maquinariasData) ? maquinariasData : (maquinariasData?.maquinarias || []);
      const processedRepuestos = Array.isArray(repuestosData) ? repuestosData : (repuestosData?.repuestos || []);
      const processedProveedores = Array.isArray(proveedoresData) ? proveedoresData : (proveedoresData?.proveedores || []);
      const processedReparaciones = Array.isArray(reparacionesData) ? reparacionesData : (reparacionesData?.data || reparacionesData?.reparaciones || []);
      
      // Actualizar estados
      const newData = {
        maquinarias: processedMaquinarias,
        repuestos: processedRepuestos,
        proveedores: processedProveedores,
        reparaciones: processedReparaciones
      };
      
      setData(newData);
      
      // Calcular estadísticas
      setStats({
        maquinarias: processedMaquinarias.length,
        repuestos: processedRepuestos.length,
        proveedores: processedProveedores.length,
        reparaciones: processedReparaciones.length
      });

      console.log('Dashboard - Data loaded:', {
        maquinarias: processedMaquinarias.length,
        repuestos: processedRepuestos.length,
        proveedores: processedProveedores.length,
        reparaciones: processedReparaciones.length
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el clic en las tarjetas de estadísticas
   * Navega directamente a la página de listado correspondiente
   */
  const handleStatsCardClick = (type) => {
    navigateToListPage(type);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, [token]);

  // Mostrar indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <AppLayout
        title="Dashboard"
        subtitle="Sistema de Gestión Agrícola"
        token={token}
        role={role}
        onLogout={onLogout}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <span className="mt-4 text-lg text-gray-600">Cargando datos del sistema...</span>
          </div>
        </div>
      </AppLayout>
    );
  }

  // El dashboard no muestra acciones en el header para evitar botones fuera de contexto
  const quickActions = null;

  // Derivar maquinarias "En reparación" a partir de reparaciones recientes (últimos 30 días)
  const enReparacionCount = (() => {
    try {
      const THRESHOLD_DAYS = 30;
      const now = Date.now();
      const ids = new Set(
        (data.reparaciones || [])
          .filter(r => {
            if (!r?.maquinariaId) return false;
            if (!r?.fecha) return true; // si no hay fecha, contarlo como activo conservadoramente
            const t = new Date(r.fecha).getTime();
            if (Number.isNaN(t)) return false;
            const diffDays = (now - t) / (1000 * 60 * 60 * 24);
            return diffDays <= THRESHOLD_DAYS;
          })
          .map(r => r.maquinariaId)
      );
      return ids.size;
    } catch {
      return 0;
    }
  })();

  return (
    <AppLayout
      currentSection={null} // null = dashboard
      title="Dashboard"
      subtitle="Sistema de Gestión Agrícola"
  actions={quickActions}
      token={token}
      role={role}
      onLogout={onLogout}
    >
      <div className="space-y-6 lg:space-y-8">
        {/* Header del sistema - Mejorado para móvil */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm text-center border border-gray-200 border-l-4 border-l-green-500">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Activity size={40} className="text-green-600" />
            Sistema de Gestión Agrícola
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Gestión integral de maquinarias, repuestos, proveedores y reparaciones
          </p>
        </div>

        {/* Tarjetas de estadísticas - Responsive mejorado */}
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex flex-col sm:flex-row sm:items-center">
            <span className="flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-600" />
              Resumen del Sistema
            </span>
            <span className="mt-1 sm:mt-0 sm:ml-2 text-xs sm:text-sm font-normal text-gray-500">
              (Toca una tarjeta para ver detalles)
            </span>
          </h2>
          
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            <StatsCard 
              type="maquinarias" 
              title="Maquinarias" 
              value={stats.maquinarias}
              onClick={handleStatsCardClick}
            />
            <StatsCard 
              type="repuestos" 
              title="Repuestos" 
              value={stats.repuestos}
              onClick={handleStatsCardClick}
            />
            <StatsCard 
              type="proveedores" 
              title="Proveedores" 
              value={stats.proveedores}
              onClick={handleStatsCardClick}
            />
            <StatsCard 
              type="reparaciones" 
              title="Reparaciones" 
              value={stats.reparaciones}
              onClick={handleStatsCardClick}
            />
          </div>
        </div>

        {/* Resumen de estados - Layout responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Wrench size={20} className="text-orange-600" />
              Estado de Maquinarias
            </h3>
            <StatusSummary
              data={data.maquinarias}
              statusField="estado"
              definitions={MACHINERY_STATUS_DEFS}
              extraCounts={{ 'En reparación': enReparacionCount }}
            />
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Package size={20} className="text-purple-600" />
              Estado de Stock
            </h3>
            <StockSummary
              data={data.repuestos}
              stockField="cantidad"
              mode="discrete"
            />
          </div>
        </div>

        {/* Tarjeta de bienvenida con guía */}
        <WelcomeCard role={role} />

        {/* Sección de acciones rápidas adicionales - Con navegación directa */}
        <div className="space-y-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Zap size={20} className="text-yellow-600" />
            Acciones Rápidas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <QuickActionCard
              type="maquinarias"
              title={SectionCards.maquinarias.title}
              icon={SectionCards.maquinarias.icon}
              description={SectionCards.maquinarias.description}
              quickActions={SectionCards.maquinarias.quickActions.map(action => ({
                ...action,
                action: () => {
                  if (action.key === 'view') {
                    navigateToListPage('maquinarias');
                  } else if (action.key === 'create') {
                    navigateFromDashboard('maquinarias', 'create');
                  } else if (action.key === 'maintenance') {
                    navigateToListPage('maquinarias', { estado: 'En mantenimiento' });
                  }
                }
              }))}
            />
            
            <QuickActionCard
              type="repuestos"
              title={SectionCards.repuestos.title}
              icon={SectionCards.repuestos.icon}
              description={SectionCards.repuestos.description}
              quickActions={SectionCards.repuestos.quickActions.map(action => ({
                ...action,
                action: () => {
                  if (action.key === 'view') {
                    navigateToListPage('repuestos');
                  } else if (action.key === 'create') {
                    navigateFromDashboard('repuestos', 'create');
                  } else if (action.key === 'low-stock') {
                    navigateToListPage('repuestos', { stockBajo: true });
                  }
                }
              }))}
            />
            
            <QuickActionCard
              type="proveedores"
              title={SectionCards.proveedores.title}
              icon={SectionCards.proveedores.icon}
              description={SectionCards.proveedores.description}
              quickActions={SectionCards.proveedores.quickActions.map(action => ({
                ...action,
                action: () => {
                  if (action.key === 'view') {
                    navigateToListPage('proveedores');
                  } else if (action.key === 'create') {
                    navigateFromDashboard('proveedores', 'create');
                  }
                }
              }))}
            />
            
            <QuickActionCard
              type="reparaciones"
              title={SectionCards.reparaciones.title}
              icon={SectionCards.reparaciones.icon}
              description={SectionCards.reparaciones.description}
              quickActions={SectionCards.reparaciones.quickActions.map(action => ({
                ...action,
                action: () => {
                  if (action.key === 'view') {
                    navigateToListPage('reparaciones');
                  } else if (action.key === 'create') {
                    navigateFromDashboard('reparaciones', 'create');
                  } else if (action.key === 'pending') {
                    navigateToListPage('reparaciones', { estado: 'Pendiente' });
                  }
                }
              }))}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Definiciones de estados de maquinaria (modular)
const MACHINERY_STATUS_DEFS = [
  { key: 'Operativa', label: 'Operativa', class: 'bg-green-100 text-green-800' },
  { key: 'En mantenimiento', label: 'En mantenimiento', class: 'bg-yellow-100 text-yellow-800' },
  { key: 'En reparación', label: 'En reparación', class: 'bg-blue-100 text-blue-800' },
  { key: 'Averiada', label: 'Averiada', class: 'bg-red-100 text-red-800' },
  { key: 'Fuera de servicio', label: 'Fuera de servicio', class: 'bg-gray-100 text-gray-800' }
];

/**
 * Resumen de estados genérico con definiciones opcionales
 */
const StatusSummary = ({ data, statusField, definitions = null, extraCounts = {} }) => {
  const counts = data.reduce((acc, item) => {
    const raw = item?.[statusField];
    const status = raw == null || String(raw).trim() === '' ? 'Sin estado' : raw;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  if (definitions && Array.isArray(definitions)) {
    return (
      <div className="space-y-3">
        {definitions.map(def => {
          const base = counts[def.key] || 0;
          const override = Number.isFinite(extraCounts?.[def.key]) ? extraCounts[def.key] : null;
          const value = override !== null ? override : base;
          return (
            <div key={def.key} className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded text-sm font-medium ${def.class}`}>
                {def.label}
              </span>
              <span className="text-sm font-medium text-gray-600">{value}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback: listar estados detectados
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return (
    <div className="space-y-3">
      {entries.map(([status, count]) => (
        <div key={status} className="flex items-center justify-between">
          <span className="px-2 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800">{status}</span>
          <span className="text-sm font-medium text-gray-600">{count}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * Resumen de stock con modo discreto (0/1/2+)
 */
const StockSummary = ({ data, stockField, mode = 'discrete' }) => {
  if (mode === 'discrete') {
    const summary = data.reduce((acc, item) => {
      // Detecta cantidad desde varios campos posibles
      const candidates = [stockField, 'stock', 'existencia', 'cantidadDisponible', 'cantidad_disponible', 'cantidad'];
      const raw = candidates
        .map(field => item?.[field])
        .find(v => v !== undefined && v !== null && v !== '');
      let qty;
      if (typeof raw === 'string') {
        const cleaned = raw.replace(/[^0-9-]/g, '');
        const parsed = Number.parseInt(cleaned, 10);
        qty = Number.isFinite(parsed) ? parsed : 0;
      } else {
        const num = Number(raw);
        qty = Number.isFinite(num) ? num : 0;
      }
      if (qty <= 0) acc.zero += 1; else if (qty === 1) acc.one += 1; else acc.twoPlus += 1;
      return acc;
    }, { zero: 0, one: 0, twoPlus: 0 });

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 rounded text-sm font-medium bg-red-100 text-red-800">Sin stock (0)</span>
          <span className="text-sm font-medium text-gray-600">{summary.zero}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800">Bajo (1)</span>
          <span className="text-sm font-medium text-gray-600">{summary.one}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800">Normal (≥2)</span>
          <span className="text-sm font-medium text-gray-600">{summary.twoPlus}</span>
        </div>
      </div>
    );
  }

  // Fallback (no usado normalmente)
  const stockAnalysis = data.reduce((acc, item) => {
    const stock = parseInt(item[stockField]) || 0;
    if (stock <= 0) acc.critical++; else if (stock === 1) acc.low++; else acc.normal++;
    return acc;
  }, { critical: 0, low: 0, normal: 0 });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="px-2 py-1 rounded text-sm font-medium bg-red-100 text-red-800">Sin stock</span>
        <span className="text-sm font-medium text-gray-600">{stockAnalysis.critical}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="px-2 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800">Bajo</span>
        <span className="text-sm font-medium text-gray-600">{stockAnalysis.low}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800">Normal</span>
        <span className="text-sm font-medium text-gray-600">{stockAnalysis.normal}</span>
      </div>
    </div>
  );
};

export default DashboardRefactored;
