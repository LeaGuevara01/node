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
        getMaquinarias(token),
        getRepuestos(token),
        getProveedores(token),
        getReparaciones(token)
      ]);
      
      // Actualizar estados con los datos obtenidos
      setMaquinarias(maquinariasData);
      setRepuestos(repuestosData);
      setProveedores(proveedoresData);
      setReparaciones(reparacionesData);
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
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header con título y información del usuario */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestión de Taller Agrícola</h1>
              <div className="text-sm text-gray-600 mt-1">Usuario: <span className="font-semibold">{role}</span></div>
            </div>
          </div>
        
        {/* Dashboard principal - mostrar estadísticas cuando no hay sección activa */}
        {!activeSection && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                type="maquinarias" 
                title="Maquinarias" 
                value={stats.maquinarias} 
              />
              <StatsCard 
                type="repuestos" 
                title="Repuestos" 
                value={stats.repuestos} 
              />
              <StatsCard 
                type="proveedores" 
                title="Proveedores" 
                value={stats.proveedores} 
              />
              <StatsCard 
                type="reparaciones" 
                title="Reparaciones" 
                value={stats.reparaciones} 
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
