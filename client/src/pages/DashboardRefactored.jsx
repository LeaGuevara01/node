/**
 * Dashboard Principal Refactorizado del Sistema de Gestión Agrícola
 * 
 * Este dashboard refactorizado utiliza:
 * - AppLayout para navegación consistente
 * - NavigationButtons para acciones estándar
 * - Contexto de navegación para manejo de rutas
 * - Componentes modulares para mejor mantenibilidad
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

  // Acciones rápidas del dashboard - Responsive
  const quickActions = (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <RoleGuard role={role} allowed={["Admin", "User"]}>
        <CreateButton 
          entity="maquinarias"
          label="Nueva Maquinaria"
          size="small"
        />
      </RoleGuard>
      <RoleGuard role={role} allowed={["Admin", "User"]}>
        <CreateButton 
          entity="repuestos"
          label="Nuevo Repuesto"
          size="small"
        />
      </RoleGuard>
      <RoleGuard role={role} allowed={["Admin", "User"]}>
        <CreateButton 
          entity="proveedores"
          label="Nuevo Proveedor"
          size="small"
        />
      </RoleGuard>
      <RoleGuard role={role} allowed={["Admin"]}>
        <CreateButton 
          entity="reparaciones"
          label="Nueva Reparación"
          size="small"
        />
      </RoleGuard>
    </div>
  );

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
      <div className="space-y-8">
        {/* Header del sistema - Mejorado para móvil */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm text-center border-l-4 border-green-500" style={{border: '1px solid #e5e7eb', borderLeft: '4px solid #10b981'}}>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
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
              colorMapping={{
                'Operativa': 'bg-green-100 text-green-800',
                'En mantenimiento': 'bg-yellow-100 text-yellow-800',
                'Averiada': 'bg-red-100 text-red-800',
                'Fuera de servicio': 'bg-gray-100 text-gray-800'
              }}
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
              thresholds={{ low: 10, critical: 5 }}
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

/**
 * Componente para mostrar resumen de estados
 */
const StatusSummary = ({ data, statusField, colorMapping = {} }) => {
  const statusCounts = data.reduce((acc, item) => {
    const status = item[statusField] || 'Sin estado';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      {Object.entries(statusCounts).map(([status, count]) => (
        <div key={status} className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded text-sm font-medium ${
            colorMapping[status] || 'bg-gray-100 text-gray-800'
          }`}>
            {status}
          </span>
          <span className="text-sm font-medium text-gray-600">{count}</span>
        </div>
      ))}
    </div>
  );
};

/**
 * Componente para mostrar resumen de stock
 */
const StockSummary = ({ data, stockField, thresholds = { low: 10, critical: 5 } }) => {
  const stockAnalysis = data.reduce((acc, item) => {
    const stock = parseInt(item[stockField]) || 0;
    if (stock <= thresholds.critical) {
      acc.critical++;
    } else if (stock <= thresholds.low) {
      acc.low++;
    } else {
      acc.normal++;
    }
    return acc;
  }, { critical: 0, low: 0, normal: 0 });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="px-2 py-1 rounded text-sm font-medium bg-red-100 text-red-800">
          Stock Crítico (≤{thresholds.critical})
        </span>
        <span className="text-sm font-medium text-gray-600">{stockAnalysis.critical}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="px-2 py-1 rounded text-sm font-medium bg-yellow-100 text-yellow-800">
          Stock Bajo (≤{thresholds.low})
        </span>
        <span className="text-sm font-medium text-gray-600">{stockAnalysis.low}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="px-2 py-1 rounded text-sm font-medium bg-green-100 text-green-800">
          Stock Normal
        </span>
        <span className="text-sm font-medium text-gray-600">{stockAnalysis.normal}</span>
      </div>
    </div>
  );
};

export default DashboardRefactored;
