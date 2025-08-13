/**
 * Sistema de Estados Visuales para Entidades Agrícolas
 * Define estilos específicos para diferentes estados de las entidades del sistema
 */

import { DESIGN_TOKENS } from './designTokens';

const { colors, icons } = DESIGN_TOKENS;

// Estados de Maquinaria
export const MAQUINARIA_STATUS = {
  operativa: {
    label: 'Operativa',
    bg: 'bg-brown-100',
    text: 'text-brown-800',
    border: 'border-brown-200',
    icon: '✅',
    iconColor: 'text-brown-600',
    dot: 'bg-brown-500',
    description: 'Funcionando correctamente',
  },

  mantenimiento: {
    label: 'En Mantenimiento',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: '🔧',
    iconColor: 'text-yellow-600',
    dot: 'bg-yellow-500',
    description: 'Requiere mantenimiento',
  },

  reparacion: {
    label: 'En Reparación',
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    icon: '🛠️',
    iconColor: 'text-orange-600',
    dot: 'bg-orange-500',
    description: 'Siendo reparada',
  },

  inactiva: {
    label: 'Inactiva',
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: '❌',
    iconColor: 'text-red-600',
    dot: 'bg-red-500',
    description: 'No operativa',
  },

  reservada: {
    label: 'Reservada',
    bg: 'bg-brand-100',
    text: 'text-brand-800',
    border: 'border-brand-200',
    icon: '📅',
    iconColor: 'text-brand-600',
    dot: 'bg-brand-500',
    description: 'Reservada para trabajo',
  },
};

// Estados de Stock de Repuestos
export const STOCK_STATUS = {
  alto: {
    label: 'Stock Alto',
    bg: 'bg-brown-100',
    text: 'text-brown-800',
    border: 'border-brown-200',
    icon: '📈',
    iconColor: 'text-brown-600',
    dot: 'bg-brown-500',
    threshold: (stock, min) => stock > min * 2,
    description: 'Stock abundante',
    priority: 1,
  },

  normal: {
    label: 'Stock Normal',
    bg: 'bg-brand-100',
    text: 'text-brand-800',
    border: 'border-brand-200',
    icon: '📊',
    iconColor: 'text-brand-600',
    dot: 'bg-brand-500',
    threshold: (stock, min) => stock > min && stock <= min * 2,
    description: 'Stock adecuado',
    priority: 2,
  },

  bajo: {
    label: 'Stock Bajo',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: '⚠️',
    iconColor: 'text-yellow-600',
    dot: 'bg-yellow-500',
    threshold: (stock, min) => stock > 0 && stock <= min,
    description: 'Necesita reposición',
    priority: 3,
  },

  critico: {
    label: 'Stock Crítico',
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    icon: '🚨',
    iconColor: 'text-orange-600',
    dot: 'bg-orange-500',
    threshold: (stock, min) => stock > 0 && stock <= min * 0.5,
    description: 'Reposición urgente',
    priority: 4,
  },

  agotado: {
    label: 'Agotado',
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: '❌',
    iconColor: 'text-red-600',
    dot: 'bg-red-500',
    threshold: (stock) => stock === 0,
    description: 'Sin stock disponible',
    priority: 5,
  },
};

// Estados de Reparaciones
export const REPARACION_STATUS = {
  pendiente: {
    label: 'Pendiente',
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: '⏳',
    iconColor: 'text-gray-600',
    dot: 'bg-gray-500',
    description: 'En cola de reparación',
  },

  enProgreso: {
    label: 'En Progreso',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: '🔧',
    iconColor: 'text-blue-600',
    dot: 'bg-blue-500',
    description: 'Siendo reparada',
  },

  esperandoRepuestos: {
    label: 'Esperando Repuestos',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: '📦',
    iconColor: 'text-yellow-600',
    dot: 'bg-yellow-500',
    description: 'Aguardando componentes',
  },

  enPruebas: {
    label: 'En Pruebas',
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    icon: '🧪',
    iconColor: 'text-purple-600',
    dot: 'bg-purple-500',
    description: 'Verificando funcionamiento',
  },

  completada: {
    label: 'Completada',
    bg: 'bg-brown-100',
    text: 'text-brown-800',
    border: 'border-brown-200',
    icon: '✅',
    iconColor: 'text-brown-600',
    dot: 'bg-brown-500',
    description: 'Reparación finalizada',
  },

  cancelada: {
    label: 'Cancelada',
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: '❌',
    iconColor: 'text-red-600',
    dot: 'bg-red-500',
    description: 'Reparación cancelada',
  },
};

// Estados de Proveedores
export const PROVEEDOR_STATUS = {
  activo: {
    label: 'Activo',
    bg: 'bg-brown-100',
    text: 'text-brown-800',
    border: 'border-brown-200',
    icon: '✅',
    iconColor: 'text-brown-600',
    dot: 'bg-brown-500',
    description: 'Proveedor operativo',
  },

  inactivo: {
    label: 'Inactivo',
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: '⏸️',
    iconColor: 'text-gray-600',
    dot: 'bg-gray-500',
    description: 'Temporalmente inactivo',
  },

  bloqueado: {
    label: 'Bloqueado',
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: '🚫',
    iconColor: 'text-red-600',
    dot: 'bg-red-500',
    description: 'Acceso bloqueado',
  },

  revision: {
    label: 'En Revisión',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: '🔍',
    iconColor: 'text-yellow-600',
    dot: 'bg-yellow-500',
    description: 'Documentación en revisión',
  },
};

// Estados de Usuarios
export const USER_STATUS = {
  activo: {
    label: 'Activo',
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: '✅',
    iconColor: 'text-green-600',
    dot: 'bg-green-500',
    description: 'Usuario activo',
  },

  inactivo: {
    label: 'Inactivo',
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: '⏸️',
    iconColor: 'text-gray-600',
    dot: 'bg-gray-500',
    description: 'Cuenta inactiva',
  },

  suspendido: {
    label: 'Suspendido',
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: '🚫',
    iconColor: 'text-red-600',
    dot: 'bg-red-500',
    description: 'Acceso suspendido',
  },

  nuevo: {
    label: 'Nuevo',
    bg: 'bg-brand-100',
    text: 'text-brand-800',
    border: 'border-brand-200',
    icon: '🆕',
    iconColor: 'text-brand-600',
    dot: 'bg-brand-500',
    description: 'Usuario recién registrado',
  },
};

// Prioridades generales
export const PRIORITY_STATUS = {
  baja: {
    label: 'Baja',
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: '⬇️',
    iconColor: 'text-gray-600',
    dot: 'bg-gray-500',
    value: 1,
  },

  normal: {
    label: 'Normal',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: '➡️',
    iconColor: 'text-blue-600',
    dot: 'bg-blue-500',
    value: 2,
  },

  alta: {
    label: 'Alta',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: '⬆️',
    iconColor: 'text-yellow-600',
    dot: 'bg-yellow-500',
    value: 3,
  },

  urgente: {
    label: 'Urgente',
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    icon: '🔥',
    iconColor: 'text-orange-600',
    dot: 'bg-orange-500',
    value: 4,
  },

  critica: {
    label: 'Crítica',
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: '🚨',
    iconColor: 'text-red-600',
    dot: 'bg-red-500',
    value: 5,
  },
};

// Estados de conectividad/sincronización
export const SYNC_STATUS = {
  sincronizado: {
    label: 'Sincronizado',
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: '✅',
    iconColor: 'text-green-600',
    dot: 'bg-green-500',
    description: 'Datos actualizados',
  },

  sincronizando: {
    label: 'Sincronizando',
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: '🔄',
    iconColor: 'text-blue-600',
    dot: 'bg-blue-500',
    description: 'Actualizando datos',
    animated: true,
  },

  desincronizado: {
    label: 'Desincronizado',
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: '⚠️',
    iconColor: 'text-yellow-600',
    dot: 'bg-yellow-500',
    description: 'Datos desactualizados',
  },

  error: {
    label: 'Error de Sync',
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: '❌',
    iconColor: 'text-red-600',
    dot: 'bg-red-500',
    description: 'Error en sincronización',
  },

  offline: {
    label: 'Sin Conexión',
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200',
    icon: '📴',
    iconColor: 'text-gray-600',
    dot: 'bg-gray-500',
    description: 'Sin conexión a internet',
  },
};

// Funciones utilitarias para determinar estados
export const STATUS_UTILS = {
  // Determinar estado de stock basado en cantidad y mínimo
  getStockStatus: (cantidad, stockMinimo = 10) => {
    for (const [key, status] of Object.entries(STOCK_STATUS)) {
      if (status.threshold && status.threshold(cantidad, stockMinimo)) {
        return { key, ...status };
      }
    }
    return { key: 'normal', ...STOCK_STATUS.normal };
  },

  // Obtener estado por clave
  getStatus: (statusMap, key) => {
    return statusMap[key] || null;
  },

  // Obtener todos los estados de un tipo
  getAllStatuses: (statusMap) => {
    return Object.entries(statusMap).map(([key, status]) => ({
      key,
      ...status,
    }));
  },

  // Ordenar por prioridad
  sortByPriority: (statuses, priorityField = 'priority') => {
    return statuses.sort((a, b) => (b[priorityField] || 0) - (a[priorityField] || 0));
  },

  // Filtrar por estado
  filterByStatus: (items, statusField, statusKey) => {
    return items.filter((item) => item[statusField] === statusKey);
  },

  // Contar elementos por estado
  countByStatus: (items, statusField) => {
    const counts = {};
    items.forEach((item) => {
      const status = item[statusField];
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  },
};

// Export principal
export const VISUAL_STATUS = {
  maquinaria: MAQUINARIA_STATUS,
  stock: STOCK_STATUS,
  reparacion: REPARACION_STATUS,
  proveedor: PROVEEDOR_STATUS,
  user: USER_STATUS,
  priority: PRIORITY_STATUS,
  sync: SYNC_STATUS,
  utils: STATUS_UTILS,
};
