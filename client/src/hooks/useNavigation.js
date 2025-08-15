/**
 * Hook personalizado para manejar la navegación
 * Ahora utiliza el contexto de navegación para mayor funcionalidad
 */
import { useNavigationContext } from '../contexts/NavigationContext';

export const useNavigation = () => {
  const context = useNavigationContext();

  // Si no hay contexto disponible, devolver funciones básicas
  if (!context) {
    console.warn('useNavigation usado fuera de NavigationProvider, funciones limitadas');
    return {
      navigateToListPage: () => console.warn('NavigationProvider no disponible'),
      navigateToDetailPage: () => console.warn('NavigationProvider no disponible'),
      navigateToFormPage: () => console.warn('NavigationProvider no disponible'),
      navigateToDashboard: () => console.warn('NavigationProvider no disponible'),
      goBack: () => console.warn('NavigationProvider no disponible'),
      currentPageInfo: null,
      navigationHistory: [],
    };
  }

  return context;
};

export default useNavigation;
