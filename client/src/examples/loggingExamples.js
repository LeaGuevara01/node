/**
 * Ejemplos de uso del Sistema de Logging Modular
 * 
 * Este archivo demuestra cómo usar el nuevo sistema de logging
 * en diferentes contextos y componentes de la aplicación.
 */

// ===== IMPORTS BÁSICOS =====
import { 
  logger, 
  createLogger, 
  apiLogger, 
  uiLogger, 
  dataLogger, 
  filterLogger 
} from '../utils/logger';
import { 
  logApiRequest, 
  logApiSuccess, 
  logApiError,
  logFilterApplication,
  logPaginationChange,
  logCrudOperation,
  withApiLogging 
} from '../utils/apiLogger';
import { initializeLogging } from '../config/loggingConfig';

// ===== EJEMPLO 1: LOGGING BÁSICO EN COMPONENTES =====

// Crear logger específico para un componente
const componentLogger = createLogger('MiComponente');

function ExampleComponent() {
  // Logging básico
  componentLogger.info('Componente montado');
  componentLogger.debug('Renderizando con props', { prop1: 'valor' });
  
  const handleClick = () => {
    componentLogger.user('Usuario hizo clic en botón');
  };

  const handleError = (error) => {
    componentLogger.error('Error en componente', { 
      error: error.message,
      stack: error.stack 
    });
  };

  return (
    <button onClick={handleClick}>
      Ejemplo con Logging
    </button>
  );
}

// ===== EJEMPLO 2: LOGGING EN SERVICIOS API =====

// Función API manual con logging
async function getMaquinariasManual(token, filtros = {}) {
  const url = 'http://localhost:4000/api/maquinaria';
  
  // Log de inicio
  const startTime = logApiRequest(url, 'GET', filtros);
  
  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    // Log de éxito
    logApiSuccess(url, 'GET', data, startTime, {
      expectedField: 'maquinarias'
    });
    
    return data;
  } catch (error) {
    // Log de error
    logApiError(url, 'GET', error, startTime);
    throw error;
  }
}

// Función API con wrapper automático
const getMaquinariasAuto = withApiLogging(
  async function(token, filtros = {}) {
    const url = 'http://localhost:4000/api/maquinaria';
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  {
    name: 'getMaquinarias',
    extractUrl: () => 'http://localhost:4000/api/maquinaria',
    extractFilters: (args) => args[1] || {},
    logResponse: false
  }
);

// ===== EJEMPLO 3: LOGGING EN HOOKS PERSONALIZADOS =====

function useMaquinariasWithLogging() {
  const hookLogger = createLogger('useMaquinarias');
  
  const [maquinarias, setMaquinarias] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const fetchData = async (filtros) => {
    hookLogger.debug('Iniciando carga de datos', { filtros });
    setLoading(true);
    
    try {
      const data = await getMaquinariasAuto('token', filtros);
      setMaquinarias(data.maquinarias);
      hookLogger.success(`${data.maquinarias.length} maquinarias cargadas`);
    } catch (error) {
      hookLogger.error('Error en hook', { error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return { maquinarias, loading, fetchData };
}

// ===== EJEMPLO 4: LOGGING DE FILTROS =====

function FilterExample() {
  const filterLogger = createLogger('Filtros');
  
  const applyFilters = (filtros, tokens) => {
    // Log estructurado de aplicación de filtros
    logFilterApplication(filtros, tokens);
    
    // Log adicional del componente
    filterLogger.filter('Filtros aplicados en componente', {
      component: 'FilterExample',
      activeFilters: Object.keys(filtros).length,
      tokens: tokens.length
    });
  };

  return (
    <div>
      <button onClick={() => applyFilters({ categoria: 'Tractores' }, ['categoria:Tractores'])}>
        Aplicar Filtros
      </button>
    </div>
  );
}

// ===== EJEMPLO 5: LOGGING DE OPERACIONES CRUD =====

function CrudExample() {
  const crudLogger = createLogger('CRUD');

  const createMaquinaria = async (data) => {
    // Log de operación CRUD
    logCrudOperation('CREATE', 'maquinaria', null, data);
    
    crudLogger.data('Creando maquinaria', {
      operation: 'CREATE',
      hasData: !!data,
      fields: Object.keys(data || {})
    });

    try {
      // Simular API call
      const result = await mockApiCall('create', data);
      crudLogger.success('Maquinaria creada', { id: result.id });
      return result;
    } catch (error) {
      crudLogger.error('Error al crear', { error: error.message });
      throw error;
    }
  };

  const updateMaquinaria = async (id, data) => {
    logCrudOperation('UPDATE', 'maquinaria', id, data);
    crudLogger.data(`Actualizando maquinaria ${id}`);
    // ... lógica de actualización
  };

  const deleteMaquinaria = async (id) => {
    logCrudOperation('DELETE', 'maquinaria', id);
    crudLogger.data(`Eliminando maquinaria ${id}`);
    // ... lógica de eliminación
  };

  return (
    <div>
      <button onClick={() => createMaquinaria({ nombre: 'Tractor Nuevo' })}>
        Crear
      </button>
    </div>
  );
}

// ===== EJEMPLO 6: LOGGING EN EFECTOS Y LIFECYCLE =====

function LifecycleExample() {
  const lifecycleLogger = createLogger('Lifecycle');

  React.useEffect(() => {
    lifecycleLogger.info('🚀 Componente montado');
    
    // Cleanup function
    return () => {
      lifecycleLogger.debug('🧹 Componente desmontado');
    };
  }, []);

  React.useEffect(() => {
    lifecycleLogger.debug('🔄 Dependencias cambiaron');
  }, [/* dependencias */]);

  return <div>Ejemplo de Lifecycle</div>;
}

// ===== EJEMPLO 7: LOGGING DE PERFORMANCE =====

function PerformanceExample() {
  const perfLogger = createLogger('Performance');

  const heavyOperation = () => {
    const startTime = perfLogger.time('heavy-operation');
    
    // Simular operación pesada
    for (let i = 0; i < 1000000; i++) {
      // Cálculos pesados
    }
    
    const duration = perfLogger.timeEnd('heavy-operation', startTime);
    
    if (duration > 100) {
      perfLogger.warn('⏱️ Operación lenta detectada', { duration });
    }
  };

  return (
    <button onClick={heavyOperation}>
      Operación Pesada
    </button>
  );
}

// ===== EJEMPLO 8: LOGGING DE NAVEGACIÓN =====

function NavigationExample() {
  const navLogger = createLogger('Navigation');
  
  const handleNavigation = (path) => {
    navLogger.navigation('Navegando a nueva ruta', { 
      from: window.location.pathname,
      to: path,
      timestamp: new Date().toISOString()
    });
    
    // Lógica de navegación...
  };

  return (
    <nav>
      <button onClick={() => handleNavigation('/maquinarias')}>
        Ir a Maquinarias
      </button>
    </nav>
  );
}

// ===== EJEMPLO 9: LOGGING CON CONTEXTO ADICIONAL =====

function ContextExample({ userId, role }) {
  // Crear logger hijo con contexto adicional
  const contextLogger = createLogger(`User:${userId}`);
  
  const handleAction = () => {
    contextLogger.user('Acción del usuario', {
      userId,
      role,
      action: 'button-click',
      context: 'ContextExample',
      timestamp: Date.now()
    });
  };

  return (
    <button onClick={handleAction}>
      Acción con Contexto
    </button>
  );
}

// ===== EJEMPLO 10: INICIALIZACIÓN Y CONFIGURACIÓN =====

function initializeApp() {
  // Inicializar sistema de logging
  initializeLogging();
  
  // Logger principal de la aplicación
  logger.info('🚀 Aplicación iniciada', {
    version: process.env.REACT_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });

  // Configurar logging específico para la app
  const appLogger = createLogger('App');
  
  // Manejar errores globales
  window.addEventListener('error', (event) => {
    appLogger.error('Error global', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  appLogger.success('Sistema de logging configurado correctamente');
}

// ===== FUNCIONES HELPER PARA EJEMPLOS =====

async function mockApiCall(action, data) {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (Math.random() < 0.1) {
    throw new Error('Error simulado de API');
  }
  
  return { 
    id: Math.floor(Math.random() * 1000),
    action,
    data,
    timestamp: new Date().toISOString()
  };
}

// ===== EXPORTAR EJEMPLOS =====

export {
  ExampleComponent,
  FilterExample,
  CrudExample,
  LifecycleExample,
  PerformanceExample,
  NavigationExample,
  ContextExample,
  initializeApp,
  useMaquinariasWithLogging
};

// ===== DOCUMENTACIÓN DE USO =====

/**
 * GUÍA RÁPIDA DE USO:
 * 
 * 1. Import básico:
 *    import { createLogger } from '../utils/logger';
 *    const logger = createLogger('MiComponente');
 * 
 * 2. Logging básico:
 *    logger.info('Mensaje', { data: 'opcional' });
 *    logger.error('Error', { error: error.message });
 * 
 * 3. Logging de API:
 *    import { logApiRequest } from '../utils/apiLogger';
 *    const startTime = logApiRequest(url, 'GET', filtros);
 * 
 * 4. Logging especializado:
 *    logger.api('Llamada API', { url });
 *    logger.user('Acción usuario', { action });
 *    logger.filter('Filtros aplicados', { filtros });
 * 
 * 5. Inicialización:
 *    import { initializeLogging } from '../config/loggingConfig';
 *    initializeLogging(); // En el main.jsx o App.jsx
 */

export default {
  ExampleComponent,
  FilterExample,
  CrudExample,
  LifecycleExample,
  PerformanceExample,
  NavigationExample,
  ContextExample,
  useMaquinariasWithLogging,
  initializeApp
};
