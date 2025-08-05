/**
 * Dashboard Principal del Sistema de Gestión Agrícola
 * 
 * Este componente es el punto central de la aplicación que:
 * - Muestra estadísticas generales del sistema
 * - Permite navegación entre diferentes secciones
 * - Controla el estado activo de las secciones
 * - Renderiza los formularios correspondientes según la sección activa
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
import StatsCard from '../components/StatsCard';
import WelcomeCard from '../components/WelcomeCard';

function Dashboard({ token, role, onLogout }) {
  // Estados para almacenar los datos de cada entidad
  const [maquinarias, setMaquinarias] = useState([]);
  const [repuestos, setRepuestos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [reparaciones, setReparaciones] = useState([]);
  
  // Estados de control de la UI
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null); // null = dashboard, otro valor = sección específica
  
  // Calcular estadísticas para las tarjetas del dashboard
  const stats = {
    maquinarias: maquinarias.length,
    repuestos: repuestos.length,
    proveedores: proveedores.length,
    reparaciones: reparaciones.length
  };

  /**
   * Función para cargar todos los datos del sistema
   * Se ejecuta al montar el componente y cuando se necesita refrescar
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      // Cargar datos en paralelo para mejor rendimiento
      const [maquinariasData, repuestosData, proveedoresData, reparacionesData] = await Promise.all([
        getMaquinarias(token, {}, 1, true), // forStats = true para obtener todos
        getRepuestos(token),
        getProveedores(token),
        getReparaciones(token)
      ]);
      
      // Actualizar estados con los datos obtenidos
      console.log('Dashboard - Raw data received:', {
        maquinariasData,
        repuestosData,
        proveedoresData,
        reparacionesData
      });
      
      console.log('Dashboard - Reparaciones data structure:', {
        isArray: Array.isArray(reparacionesData),
        hasData: reparacionesData?.data,
        dataLength: reparacionesData?.data?.length,
        hasReparaciones: reparacionesData?.reparaciones,
        reparacionesLength: reparacionesData?.reparaciones?.length
      });
      
      const processedMaquinarias = Array.isArray(maquinariasData) ? maquinariasData : (maquinariasData?.maquinarias || []);
      const processedRepuestos = Array.isArray(repuestosData) ? repuestosData : (repuestosData?.repuestos || []);
      const processedProveedores = Array.isArray(proveedoresData) ? proveedoresData : (proveedoresData?.proveedores || []);
      const processedReparaciones = Array.isArray(reparacionesData) ? reparacionesData : (reparacionesData?.data || reparacionesData?.reparaciones || []);
      
      console.log('Dashboard - Processed arrays:', {
        maquinarias: processedMaquinarias.length,
        repuestos: processedRepuestos.length,
        proveedores: processedProveedores.length,
        reparaciones: processedReparaciones.length
      });
      
      setMaquinarias(processedMaquinarias);
      setRepuestos(processedRepuestos);
      setProveedores(processedProveedores);
      setReparaciones(processedReparaciones);
    } catch (error) {
      console.error("Error fetching data:", error);
      // En caso de error, se mantienen los datos existentes
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
   * Redirige al usuario a la sección correspondiente
   * @param {string} type - Tipo de carta clickeada (maquinarias, repuestos, etc.)
   */
  const handleStatsCardClick = (type) => {
    setActiveSection(type);
  };

  // Mostrar indicador de carga mientras se obtienen los datos
  if (loading) return <div className="text-center mt-10">Cargando datos...</div>;

  return (
    /* Layout principal con sidebar fijo y contenido adaptable */
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar de navegación - siempre visible en desktop, overlay en mobile */}
      <Sidebar active={activeSection} setActive={setActiveSection} />
      
      {/* Área de contenido principal */}
      {/* pl-12 en mobile para evitar overlap con botón hamburguesa */}
      {/* pl-60 en desktop para dejar espacio al sidebar de 224px */}
      <div className="pl-12 md:pl-60">
      <div className="px-2 sm:px-4 lg:px-6 py-2">
        {/* Header */}
        <div className="flex justify-between items-center">
          {/* Espaciado para layout sin título específico */}
        </div>        {/* Dashboard principal - mostrar estadísticas cuando no hay sección activa */}
        {!activeSection && (
          <div className="space-y-4">
            {/* Título de la aplicación */}
            <div className="text-center bg-white rounded-lg shadow-sm p-2 mt-3 border-l-4 border-green-600">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                🌾 Sistema de Gestión Agrícola
              </h1>
              <p className="text-gray-600 text-lg">
                Gestión integral de maquinarias, repuestos, proveedores y reparaciones
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
            
            <WelcomeCard role={role} />
          </div>
        )}
        
        {/* Secciones */}
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
          <>
            <RoleGuard role={role} allowed={["Admin"]}>
              <UserRegisterForm token={token} onRegistered={fetchData} />
            </RoleGuard>
            {/* Aquí podrías agregar un listado de usuarios si tienes endpoint */}
          </>
        )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
