// Utilidad: reparacionUtils
// Rol: helpers para transformaciones y resúmenes de reparaciones

// Utilidades para gestión de reparaciones
// Funciones de ordenamiento, filtrado y formateo de datos

/**
 * Ordena reparaciones por fecha descendente
 */
export const sortReparacionesByDate = (reparaciones) => {
  return [...reparaciones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
};

/**
 * Construye parámetros de consulta para la API de reparaciones
 */
export const buildReparacionQueryParams = (filtros, pagina = 1) => {
  const params = new URLSearchParams();
  
  if (filtros.search) params.append('search', filtros.search);
  if (filtros.maquinariaId) params.append('maquinariaId', filtros.maquinariaId);
  if (filtros.userId) params.append('userId', filtros.userId);
  if (filtros.repuestoId) params.append('repuestoId', filtros.repuestoId);
  if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
  if (filtros.fechaFin) params.append('fechaFin', filtros.fechaFin);
  if (filtros.estado) params.append('estado', filtros.estado);
  params.append('page', pagina.toString());
  params.append('limit', '20');
  
  return params;
};

/**
 * Limpia todos los filtros de reparaciones
 */
export const clearReparacionFilters = () => ({
  search: '',
  maquinariaId: '',
  userId: '',
  repuestoId: '',
  fechaInicio: '',
  fechaFin: '',
  estado: ''
});

/**
 * Formatea fecha para display
 */
export const formatFecha = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formatea fecha en formato corto (mm/dd) para pantallas pequeñas
 */
export const formatFechaCorta = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit'
  });
};

/**
 * Formatea fecha para input date
 */
export const formatDateForInput = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toISOString().split('T')[0];
};

/**
 * Calcula días desde la reparación
 */
export const diasDesdeReparacion = (fecha) => {
  if (!fecha) return 0;
  const hoy = new Date();
  const fechaReparacion = new Date(fecha);
  const diffTime = Math.abs(hoy - fechaReparacion);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Obtiene color para estado de reparación
 */
export const getEstadoReparacionColorClass = (estado) => {
  const estados = {
    'pendiente': 'bg-yellow-100 text-yellow-700',
    'en_progreso': 'bg-brand-100 text-brand-800',
    'completada': 'bg-brown-100 text-brown-800',
    'cancelada': 'bg-red-100 text-red-700',
    'pausada': 'bg-gray-100 text-gray-700'
  };
  
  return estados[estado] || 'bg-gray-100 text-gray-700';
};

/**
 * Obtiene color para prioridad de reparación
 */
export const getPrioridadColorClass = (prioridad) => {
  const prioridades = {
    'baja': 'bg-green-100 text-green-700',
    'media': 'bg-yellow-100 text-yellow-700',
    'alta': 'bg-orange-100 text-orange-700',
    'critica': 'bg-red-100 text-red-700'
  };
  
  return prioridades[prioridad] || 'bg-gray-100 text-gray-700';
};

/**
 * Calcula costo total de repuestos
 */
export const calculateCostoRepuestos = (repuestos) => {
  if (!repuestos || !Array.isArray(repuestos)) return 0;
  
  return repuestos.reduce((total, repuesto) => {
    const precio = repuesto.precio || 0;
    const cantidad = repuesto.cantidad || 1;
    return total + (precio * cantidad);
  }, 0);
};

/**
 * Formatea lista de repuestos para mostrar
 */
export const formatRepuestosUsados = (repuestos) => {
  if (!repuestos || !Array.isArray(repuestos)) return '';
  
  return repuestos.map(rep => {
    const cantidad = rep.cantidad || 1;
    return cantidad > 1 ? `${rep.nombre} (x${cantidad})` : rep.nombre;
  }).join(', ');
};

/**
 * Valida si una fecha es válida
 */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Obtiene el estado por defecto
 */
export const getDefaultEstado = () => 'pendiente';

/**
 * Obtiene la prioridad por defecto
 */
export const getDefaultPrioridad = () => 'media';

/**
 * Formatea duración en horas a texto legible
 */
export const formatDuracion = (horas) => {
  if (!horas || horas === 0) return 'No especificado';
  
  if (horas < 1) {
    const minutos = Math.round(horas * 60);
    return `${minutos} minutos`;
  }
  
  if (horas < 24) {
    return `${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  }
  
  const dias = Math.floor(horas / 24);
  const horasRestantes = horas % 24;
  
  if (horasRestantes === 0) {
    return `${dias} ${dias === 1 ? 'día' : 'días'}`;
  }
  
  return `${dias} ${dias === 1 ? 'día' : 'días'} y ${horasRestantes} ${horasRestantes === 1 ? 'hora' : 'horas'}`;
};

/**
 * Genera resumen de reparación
 */
export const generateResumenReparacion = (reparacion) => {
  if (!reparacion) return '';
  
  const maquinaria = reparacion.maquinaria?.nombre || 'Maquinaria no especificada';
  const fecha = formatFecha(reparacion.fecha);
  const repuestos = reparacion.repuestos?.length || 0;
  
  return `${maquinaria} - ${fecha}${repuestos > 0 ? ` (${repuestos} repuestos)` : ''}`;
};
