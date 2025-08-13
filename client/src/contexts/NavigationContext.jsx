/**
 * Contexto de Navegación
 * Rol: estado global y helpers de rutas
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavigationContext = createContext();

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [sectionFilters, setSectionFilters] = useState({});

  // Funciones de navegación centralizadas
  const navigateToListPage = useCallback((type, filters = {}) => {
    const routes = {
      maquinarias: '/maquinarias',
      repuestos: '/repuestos', 
      proveedores: '/proveedores',
  reparaciones: '/reparaciones',
  usuarios: '/usuarios',
  compras: '/compras'
    };

    const route = routes[type];
    if (route) {
      // Aplicar filtros si se proporcionan
      if (Object.keys(filters).length > 0) {
        setSectionFilters(prev => ({
          ...prev,
          [type]: filters
        }));
      }
      
      navigate(route);
      addToHistory({ type: 'list', entity: type, route, filters });
    }
  }, [navigate]);

  // Nueva función para navegación directa desde dashboard
  const navigateFromDashboard = useCallback((section, action = 'view', itemId = null) => {
    const baseRoutes = {
      maquinarias: '/maquinarias',
      repuestos: '/repuestos', 
      proveedores: '/proveedores',
      reparaciones: '/reparaciones',
      usuarios: '/usuarios',
      compras: '/compras'
    };

    let targetRoute = baseRoutes[section];
    
    if (action === 'create') {
      // Para compras la ruta de creación es '/nueva'
      if (section === 'compras') {
        targetRoute += '/nueva';
      } else {
        targetRoute += '/nuevo';
      }
    } else if (action === 'edit' && itemId) {
      targetRoute += `/${itemId}/editar`;
    } else if (action === 'detail' && itemId) {
      targetRoute += `/${itemId}`;
    }
    
    if (targetRoute) {
      navigate(targetRoute);
      addToHistory({ 
        type: 'dashboard-navigation', 
        entity: section, 
        route: targetRoute,
        action,
        itemId 
      });
    }
  }, [navigate]);

  const navigateToDetailPage = useCallback((type, id) => {
    const routes = {
      maquinarias: `/maquinarias/${id}`,
      repuestos: `/repuestos/${id}`,
      proveedores: `/proveedores/${id}`,
  reparaciones: `/reparaciones/${id}`,
  usuarios: `/usuarios/${id}`,
  compras: `/compras/${id}`
    };

    const route = routes[type];
    if (route) {
      navigate(route);
      addToHistory({ type: 'detail', entity: type, id, route });
    }
  }, [navigate]);

  const navigateToFormPage = useCallback((type, id = null) => {
    const routes = {
      maquinarias: id ? `/maquinarias/editar/${id}` : '/maquinarias/formulario',
      repuestos: id ? `/repuestos/editar/${id}` : '/repuestos/formulario',
      proveedores: id ? `/proveedores/editar/${id}` : '/proveedores/formulario',
  // Reparaciones usa modales en la página de listado
  reparaciones: '/reparaciones',
  usuarios: id ? `/usuarios/editar/${id}` : '/usuarios/formulario',
  // Para compras aún no hay edición dedicada; ambas rutas apuntan a creación
  compras: '/compras/nueva'
    };

    const route = routes[type];
    if (route) {
      navigate(route);
      addToHistory({ type: 'form', entity: type, id, route });
    }
  }, [navigate]);

  const navigateToDashboard = useCallback(() => {
    navigate('/');
    addToHistory({ type: 'dashboard', route: '/' });
  }, [navigate]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Gestión del historial de navegación
  const addToHistory = useCallback((entry) => {
    setNavigationHistory(prev => {
      const newHistory = [...prev, { ...entry, timestamp: Date.now() }];
      // Mantener solo los últimos 10 elementos
      return newHistory.slice(-10);
    });
  }, []);

  // Obtener información de la página actual
  const getCurrentPageInfo = useCallback(() => {
    const pathname = location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length === 0) {
      return { type: 'dashboard', entity: null, id: null };
    }
    
    const [entity, action, id] = segments;
    
    return {
      type: action === 'formulario' || action === 'editar' ? 'form' : 
            !isNaN(action) ? 'detail' : 'list',
      entity,
      id: !isNaN(action) ? action : id,
      action
    };
  }, [location.pathname]);

  // Gestión de filtros por sección
  const updateSectionFilters = useCallback((section, filters) => {
    setSectionFilters(prev => ({
      ...prev,
      [section]: filters
    }));
  }, []);

  const getSectionFilters = useCallback((section) => {
    return sectionFilters[section] || {};
  }, [sectionFilters]);

  const clearSectionFilters = useCallback((section) => {
    setSectionFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[section];
      return newFilters;
    });
  }, []);

  const value = {
    // Estado
    currentPath: location.pathname,
    navigationHistory,
    currentPageInfo: getCurrentPageInfo(),
    sectionFilters,
    
    // Funciones de navegación
    navigateToListPage,
    navigateToDetailPage,
    navigateToFormPage,
    navigateToDashboard,
    navigateFromDashboard,
    goBack,
    navigate, // Función nativa para casos especiales
    
    // Gestión de filtros
    updateSectionFilters,
    getSectionFilters,
    clearSectionFilters,
    
    // Utilidades
    addToHistory
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationProvider;
