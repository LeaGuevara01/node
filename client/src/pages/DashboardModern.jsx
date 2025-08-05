/**
 * Dashboard Principal Mejorado del Sistema de Gestión Agrícola
 * 
 * Versión modernizada que utiliza:
 * - Sistema de design tokens para consistencia visual
 * - Componentes modulares reutilizables
 * - Navegación mejorada con cartas clickeables
 * - Layout responsivo con agricultural theming
 * - Mejor accesibilidad y UX
 * 
 * @param {string} token - Token de autenticación del usuario
 * @param {string} role - Rol del usuario (Admin/User)
 * @param {function} onLogout - Función para cerrar sesión
 */

import React, { useEffect, useState } from 'react';
import { getMaquinarias, getRepuestos, getProveedores, getReparaciones } from '../services/api';
import MaquinariaForm from './MaquinariaForm';
import RepuestoForm from './RepuestoForm';
import ProveedorForm from './ProveedorForm';
import ReparacionForm from './ReparacionForm';
import RoleGuard from '../components/RoleGuard';
import UserRegisterForm from './UserRegisterForm';
import Sidebar from '../components/Sidebar';
import WelcomeCard from '../components/WelcomeCard';

// Importar componentes del nuevo sistema de design
import {
  PageContainer,
  ContentContainer,
  Card,
  StatsGrid,
  useStats,
  StatusSummary,
  DESIGN_TOKENS
} from '../styles';

function DashboardModern({ token, role, onLogout }) {
  // Estados para almacenar los datos de cada entidad
  const [data, setData] = useState({
    maquinarias: [],
    repuestos: [],
    proveedores: [],
    reparaciones: []
  });
  
  // Estados de control de la UI
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  
  // Usar el hook de estadísticas
  const stats = useStats(data);

  /**
   * Función para cargar todos los datos del sistema
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      const [maquinariasData, repuestosData, proveedoresData, reparacionesData] = await Promise.all([
        getMaquinarias(token, {}, 1, true),
        getRepuestos(token),
        getProveedores(token),
        getReparaciones(token)
      ]);
      
      // Procesar y normalizar datos
      const processedData = {
        maquinarias: Array.isArray(maquinariasData) ? maquinariasData : (maquinariasData?.maquinarias || []),
        repuestos: Array.isArray(repuestosData) ? repuestosData : (repuestosData?.repuestos || []),
        proveedores: Array.isArray(proveedoresData) ? proveedoresData : (proveedoresData?.proveedores || []),
        reparaciones: Array.isArray(reparacionesData) ? reparacionesData : (reparacionesData?.data || reparacionesData?.reparaciones || [])
      };
      
      setData(processedData);
      
      console.log('Dashboard Modern - Datos cargados:', {
        maquinarias: processedData.maquinarias.length,
        repuestos: processedData.repuestos.length,
        proveedores: processedData.proveedores.length,
        reparaciones: processedData.reparaciones.length
      });
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, [token]);

  /**
   * Maneja el click en las cartas de estadísticas
   * @param {string} type - Tipo de carta clickeada
   */
  const handleStatsCardClick = (type) => {
    console.log(`Navegando a sección: ${type}`);
    setActiveSection(type);
  };

  /**
   * Maneja la navegación de regreso al dashboard
   */
  const handleBackToDashboard = () => {
    setActiveSection(null);
  };

  // Mostrar indicador de carga
  if (loading) {
    return (
      <PageContainer theme="agricultural">
        <ContentContainer>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agricultural-crop-600"></div>
            <span className="ml-3 text-lg text-gray-600">Cargando datos del sistema...</span>
          </div>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar de navegación */}
      <Sidebar active={activeSection} setActive={setActiveSection} />
      
      {/* Área de contenido principal */}
      <div className="pl-12 md:pl-60">
        <PageContainer theme="agricultural">
          <ContentContainer>
            
            {/* Dashboard principal */}
            {!activeSection && (
              <div className="space-y-6">
                {/* Header del sistema */}
                <Card variant="agricultural" padding="lg" className="text-center border-l-4 border-agricultural-crop-500">
                  <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                      🌾 Sistema de Gestión Agrícola
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                      Gestión integral de maquinarias, repuestos, proveedores y reparaciones
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mt-3">
                      <span>Usuario:</span>
                      <span className="font-medium text-agricultural-crop-600">{role}</span>
                      <span>•</span>
                      <span>Sistema activo</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </Card>
                
                {/* Grid de estadísticas */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    📊 Resumen del Sistema
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      (Haz click en una carta para ver detalles)
                    </span>
                  </h2>
                  <StatsGrid 
                    stats={stats}
                    onCardClick={handleStatsCardClick}
                    variant="agricultural"
                  />
                </div>

                {/* Resumen de estados */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card variant="default" padding="lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      🔧 Estado de Maquinarias
                    </h3>
                    <StatusSummary
                      type="maquinaria"
                      data={data.maquinarias}
                      statusField="estado"
                    />
                  </Card>

                  <Card variant="default" padding="lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      📦 Estado de Stock
                    </h3>
                    <StatusSummary
                      type="stock"
                      data={data.repuestos}
                      statusField="cantidad"
                    />
                  </Card>
                </div>
                
                {/* Welcome Card */}
                <WelcomeCard role={role} />
              </div>
            )}
            
            {/* Secciones específicas con botón de regreso */}
            {activeSection && (
              <div className="space-y-4">
                {/* Header de sección con navegación */}
                <Card variant="default" padding="md" className="border-l-4 border-agricultural-sky-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleBackToDashboard}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                        aria-label="Volver al dashboard"
                      >
                        ←
                      </button>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 capitalize">
                          {activeSection}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Gestión de {activeSection} del sistema
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Total: <span className="font-semibold">{stats[activeSection]}</span>
                    </div>
                  </div>
                </Card>

                {/* Contenido de la sección */}
                {activeSection === 'maquinarias' && (
                  <RoleGuard role={role} allowed={["Admin", "User"]}>
                    <MaquinariaForm token={token} onCreated={fetchData} />
                  </RoleGuard>
                )}
                {activeSection === 'repuestos' && (
                  <RoleGuard role={role} allowed={["Admin", "User"]}>
                    <RepuestoForm token={token} onCreated={fetchData} />
                  </RoleGuard>
                )}
                {activeSection === 'proveedores' && (
                  <RoleGuard role={role} allowed={["Admin", "User"]}>
                    <ProveedorForm token={token} onCreated={fetchData} />
                  </RoleGuard>
                )}
                {activeSection === 'reparaciones' && (
                  <RoleGuard role={role} allowed={["Admin"]}>
                    <ReparacionForm token={token} onCreated={fetchData} />
                  </RoleGuard>
                )}
                {activeSection === 'usuarios' && (
                  <RoleGuard role={role} allowed={["Admin"]}>
                    <UserRegisterForm token={token} onRegistered={fetchData} />
                  </RoleGuard>
                )}
              </div>
            )}
            
          </ContentContainer>
        </PageContainer>
      </div>
    </div>
  );
}

export default DashboardModern;
