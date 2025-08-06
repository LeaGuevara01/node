// client/src/hooks/useNavigation.js
import { useNavigate } from 'react-router-dom';

/**
 * Hook personalizado para manejar la navegación a páginas de listado
 * Centraliza las rutas y facilita futuras modificaciones
 */
export const useNavigation = () => {
  const navigate = useNavigate();

  /**
   * Navega a la página de listado correspondiente según el tipo
   * @param {string} type - Tipo de entidad (maquinarias, repuestos, etc.)
   */
  const navigateToListPage = (type) => {
    const routes = {
      maquinarias: '/maquinarias',
      repuestos: '/repuestos', 
      proveedores: '/proveedores',
      reparaciones: '/reparaciones',
      usuarios: '/usuarios'
    };

    const route = routes[type];
    if (route) {
      console.log(`🚀 Navegando a página de listado: ${type} (${route})`);
      navigate(route);
    } else {
      console.warn(`⚠️ No hay ruta definida para el tipo: ${type}`);
    }
  };

  /**
   * Navega a la página de detalles de una entidad específica
   * @param {string} type - Tipo de entidad
   * @param {string|number} id - ID de la entidad
   */
  const navigateToDetailPage = (type, id) => {
    const routes = {
      maquinarias: `/maquinarias/${id}`,
      repuestos: `/repuestos/${id}`,
      proveedores: `/proveedores/${id}`,
      reparaciones: `/reparaciones/${id}`,
      usuarios: `/usuarios/${id}`
    };

    const route = routes[type];
    if (route) {
      console.log(`🔍 Navegando a detalles: ${type}/${id} (${route})`);
      navigate(route);
    } else {
      console.warn(`⚠️ No hay ruta de detalles definida para el tipo: ${type}`);
    }
  };

  /**
   * Navega a la página de formulario/creación de una entidad
   * @param {string} type - Tipo de entidad
   */
  const navigateToFormPage = (type) => {
    const routes = {
      maquinarias: '/maquinarias/formulario',
      repuestos: '/repuestos/formulario',
      proveedores: '/proveedores/formulario',
      reparaciones: '/reparaciones/formulario',
      usuarios: '/usuarios/formulario'
    };

    const route = routes[type];
    if (route) {
      console.log(`➕ Navegando a formulario: ${type} (${route})`);
      navigate(route);
    } else {
      console.warn(`⚠️ No hay ruta de formulario definida para el tipo: ${type}`);
    }
  };

  /**
   * Navega al dashboard principal
   */
  const navigateToDashboard = () => {
    console.log('🏠 Navegando al dashboard');
    navigate('/dashboard');
  };

  return {
    navigateToListPage,
    navigateToDetailPage,
    navigateToFormPage,
    navigateToDashboard,
    // Funciones directas para compatibilidad
    navigate
  };
};

export default useNavigation;
