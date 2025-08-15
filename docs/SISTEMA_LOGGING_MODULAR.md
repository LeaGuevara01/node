# Sistema de Logging Centralizado y Modular

## 📋 Resumen

Este documento describe la implementación completa del nuevo sistema de logging modular que reemplaza los `console.log` dispersos y proporciona una infraestructura centralizada para el monitoreo y debugging de la aplicación.

## 🎯 Objetivos Resueltos

- ✅ **Centralización**: Todos los logs pasan por un sistema unificado
- ✅ **Modularización**: Loggers específicos para diferentes contextos
- ✅ **Prevención de duplicados**: Sistema anti-spam para llamadas API duplicadas
- ✅ **Estructuración**: Logs con contexto, timestamps y metadatos
- ✅ **Configurabilidad**: Diferentes niveles según el entorno
- ✅ **Performance**: Monitoreo de tiempos y operaciones lentas
- ✅ **Migración**: Sistema para actualizar código deprecado

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
utils/
├── logger.js           # Logger principal y factory
├── apiLogger.js        # Logging especializado para APIs
└── ...

config/
└── loggingConfig.js    # Configuración centralizada

scripts/
└── migrateStyledComponentsLogging.js  # Migración de componentes deprecados

examples/
└── loggingExamples.js  # Ejemplos de uso
```

### Niveles de Logging

| Nivel | Valor | Uso                                  |
| ----- | ----- | ------------------------------------ |
| DEBUG | 0     | Información detallada para debugging |
| INFO  | 1     | Información general del flujo        |
| WARN  | 2     | Advertencias y deprecaciones         |
| ERROR | 3     | Errores y excepciones                |
| NONE  | 4     | Sin logging                          |

### Loggers Especializados

| Logger         | Contexto      | Uso                                         |
| -------------- | ------------- | ------------------------------------------- |
| `logger`       | General       | Logging principal de la aplicación          |
| `apiLogger`    | API           | Llamadas HTTP, requests, responses          |
| `uiLogger`     | UI            | Componentes React, renders, interactions    |
| `dataLogger`   | Data          | Operaciones CRUD, estados, transformaciones |
| `filterLogger` | Filtros       | Aplicación de filtros, búsquedas            |
| `navLogger`    | Navegación    | Cambios de ruta, navegación                 |
| `authLogger`   | Autenticación | Login, logout, permisos                     |

## 🚀 Uso Básico

### 1. Import y Creación de Logger

```javascript
import { createLogger } from '../utils/logger';

// Logger específico para componente
const logger = createLogger('MiComponente');
```

### 2. Logging Básico

```javascript
// Información general
logger.info('Usuario autenticado', { userId: 123 });

// Debug detallado
logger.debug('Estado actualizado', { newState: {...} });

// Advertencias
logger.warn('Función deprecada utilizada');

// Errores
logger.error('Error de validación', { error: error.message });

// Éxito
logger.success('Operación completada', { recordsProcessed: 10 });
```

### 3. Logging Especializado

```javascript
// API calls
logger.api('Llamada a backend', { endpoint: '/maquinarias' });

// Acciones del usuario
logger.user('Botón clickeado', { button: 'save' });

// Navegación
logger.navigation('Cambio de ruta', { from: '/', to: '/maquinarias' });

// Filtros
logger.filter('Filtros aplicados', { categoria: 'Tractores' });

// Datos
logger.data('Registros cargados', { count: 20 });
```

## 🌐 Logging de APIs

### Uso Manual

```javascript
import { logApiRequest, logApiSuccess, logApiError } from '../utils/apiLogger';

async function getMaquinarias(token, filtros) {
  const url = 'http://localhost:4000/api/maquinaria';
  const startTime = logApiRequest(url, 'GET', filtros);

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    logApiSuccess(url, 'GET', data, startTime, {
      expectedField: 'maquinarias',
    });
    return data;
  } catch (error) {
    logApiError(url, 'GET', error, startTime);
    throw error;
  }
}
```

### Uso con Wrapper Automático

```javascript
import { withApiLogging } from '../utils/apiLogger';

const getMaquinarias = withApiLogging(
  async function (token, filtros) {
    const response = await fetch('http://localhost:4000/api/maquinaria');
    return response.json();
  },
  {
    name: 'getMaquinarias',
    extractUrl: () => 'http://localhost:4000/api/maquinaria',
    extractFilters: (args) => args[1] || {},
  }
);
```

### Prevención de Duplicados

El sistema automáticamente detecta y previene requests API duplicados:

```
🔄 Request duplicado detectado { url: '/api/maquinaria', method: 'GET' }
```

## 📊 Logging de Operaciones

### CRUD Operations

```javascript
import { logCrudOperation } from '../utils/apiLogger';

// Crear
logCrudOperation('CREATE', 'maquinaria', null, formData);

// Actualizar
logCrudOperation('UPDATE', 'maquinaria', id, updateData);

// Eliminar
logCrudOperation('DELETE', 'maquinaria', id);

// Leer
logCrudOperation('READ', 'maquinaria', id);
```

### Filtros y Paginación

```javascript
import { logFilterApplication, logPaginationChange } from '../utils/apiLogger';

// Aplicación de filtros
logFilterApplication(filtros, tokensActivos);

// Cambio de página
logPaginationChange(page, totalPages, totalItems);
```

### Operaciones Masivas

```javascript
import { logBulkOperation } from '../utils/apiLogger';

// Importación masiva
logBulkOperation('IMPORT', 'maquinarias', recordCount, result);

// Exportación
logBulkOperation('EXPORT', 'maquinarias', recordCount);
```

## ⚛️ Uso en Componentes React

### Hook Personalizado

```javascript
function useMaquinarias() {
  const logger = createLogger('useMaquinarias');

  React.useEffect(() => {
    logger.info('Hook inicializado');
    return () => logger.debug('Hook desmontado');
  }, []);

  // ... lógica del hook
}
```

### Lifecycle Logging

```javascript
function MiComponente() {
  const logger = createLogger('MiComponente');

  React.useEffect(() => {
    logger.info('🚀 Componente montado');

    return () => {
      logger.debug('🧹 Componente desmontado');
    };
  }, []);

  React.useEffect(() => {
    logger.debug('🔄 Props cambiaron', { newProps });
  }, [props]);
}
```

### Event Handlers

```javascript
function handleSubmit(formData) {
  logger.user('Formulario enviado', {
    form: 'maquinaria-create',
    fields: Object.keys(formData),
  });

  try {
    // ... lógica de submit
    logger.success('Formulario procesado correctamente');
  } catch (error) {
    logger.error('Error en formulario', { error: error.message });
  }
}
```

## ⚙️ Configuración

### Por Entorno

```javascript
// config/loggingConfig.js
const ENVIRONMENT_CONFIGS = {
  development: {
    level: LOG_LEVELS.DEBUG,
    enableApiLogging: true,
    enablePerformanceLogging: true,
    enableDeprecationWarnings: true,
  },

  production: {
    level: LOG_LEVELS.WARN,
    enableApiLogging: true,
    enablePerformanceLogging: true,
    enableDeprecationWarnings: false,
  },
};
```

### Inicialización

```javascript
// main.jsx o App.jsx
import { initializeLogging } from './config/loggingConfig';

// Inicializar al arrancar la app
initializeLogging();
```

## 🔧 Migración de Código Deprecado

### Componentes Deprecados

El sistema detecta automáticamente el uso de componentes deprecados:

```javascript
// ANTES (deprecado)
console.log('Fetching maquinarias with filters:', filtros);
console.warn('StyledPageWrapper está DEPRECADO');

// DESPUÉS (nuevo sistema)
const logger = createLogger('MaquinariasPage');
logger.api('Cargando maquinarias', { filtros });

deprecationLogger.warn('StyledPageWrapper está DEPRECADO', {
  component: 'StyledPageWrapper',
  replacement: 'AppLayout + PageContainer',
  migrationGuide: '/docs/MIGRATION_STYLED_COMPONENTS.md',
});
```

### Script de Migración

```javascript
import { runFullMigration } from '../scripts/migrateStyledComponentsLogging';

// Ejecutar migración completa
const result = runFullMigration();
console.log('Migración completada:', result);
```

## 📈 Performance y Métricas

### Medición de Tiempos

```javascript
const logger = createLogger('Performance');

// Iniciar timer
const startTime = logger.time('heavy-operation');

// ... operación pesada

// Finalizar y loggear
const duration = logger.timeEnd('heavy-operation', startTime);

if (duration > 1000) {
  logger.warn('Operación lenta detectada', { duration });
}
```

### Métricas de API

```javascript
import { getApiMetrics, resetApiMetrics } from '../utils/apiLogger';

// Obtener métricas actuales
const metrics = getApiMetrics();
logger.data('Métricas de API', metrics);

// Resetear métricas
resetApiMetrics();
```

### Monitoreo de Memoria

El sistema automáticamente monitorea el uso de memoria:

```
💾 Uso de memoria { used: 45, total: 67, limit: 2048 }
```

## 🔍 Debugging y Troubleshooting

### Niveles de Debug

```javascript
// Solo en desarrollo
if (process.env.NODE_ENV === 'development') {
  logger.debug('Información detallada de debugging', { state, props });
}

// Logging condicional
if (logger.level <= LOG_LEVELS.DEBUG) {
  logger.debug('Debug detallado');
}
```

### Captura de Errores

```javascript
// Errores globales automáticamente capturados
window.addEventListener('error', (event) => {
  logger.error('Error global', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
  });
});

// Promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Promise no manejada', { reason: event.reason });
});
```

## 🎨 Formato y Visualización

### Emojis y Colores

Los logs incluyen emojis para mejor visualización:

- 🔍 DEBUG
- ℹ️ INFO
- ⚠️ WARN
- ❌ ERROR
- ✅ SUCCESS
- 🌐 API
- 👤 USER
- 🧭 NAV

### Estructura del Log

```
[10:30:45.123] [ComponentName] 🌐 [API] ✅ Request completado { url: '/api/maquinaria', duration: '150ms' }
```

## 📁 Estructura de Archivos

```
src/
├── utils/
│   ├── logger.js                 # Sistema principal de logging
│   └── apiLogger.js              # Logging especializado para APIs
├── config/
│   └── loggingConfig.js          # Configuración centralizada
├── scripts/
│   └── migrateStyledComponentsLogging.js  # Migración de deprecados
├── examples/
│   └── loggingExamples.js        # Ejemplos de uso
└── styles/
    └── styledComponents.js       # Actualizado con nuevo logging
```

## 🔮 Próximos Pasos

### Mejoras Planificadas

1. **Dashboard de Logs**: Interfaz web para visualizar logs
2. **Persistencia**: Almacenar logs en localStorage/backend
3. **Alertas**: Notificaciones automáticas para errores críticos
4. **Métricas Avanzadas**: Análisis de patrones y tendencias
5. **Integración**: Conexión con servicios de monitoreo externos

### Migración Completa

1. ✅ Sistema base implementado
2. ✅ Migración de MaquinariasPageRefactored
3. ✅ Actualización de styled components deprecados
4. 🔄 Migración de otros componentes (en progreso)
5. 📋 Documentación y training (este documento)

## 📞 Soporte

Para preguntas sobre el sistema de logging:

- **Documentación**: Este documento
- **Ejemplos**: `src/examples/loggingExamples.js`
- **Configuración**: `src/config/loggingConfig.js`
- **Issues**: Reportar en el repositorio del proyecto

---

**Última actualización**: Agosto 2025  
**Versión del sistema**: 1.0.0  
**Estado**: ✅ Implementado y funcional
