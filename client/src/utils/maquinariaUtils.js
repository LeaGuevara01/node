/**
 * Utilidades específicas para manejo de maquinarias
 */

/**
 * Ordena una lista de maquinarias por categoría, modelo y nombre
 * @param {Array} maquinarias - Array de maquinarias
 * @returns {Array} - Array ordenado
 */
export const sortMaquinariasByCategory = (maquinarias) => {
  return maquinarias.sort((a, b) => {
    // Primero por categoría
    if (a.categoria !== b.categoria) {
      return a.categoria.localeCompare(b.categoria);
    }
    // Luego por modelo
    if (a.modelo !== b.modelo) {
      return a.modelo.localeCompare(b.modelo);
    }
    // Finalmente por nombre
    return a.nombre.localeCompare(b.nombre);
  });
};

/**
 * Construye parámetros de query para la API de maquinarias
 * @param {Object} filtros - Objeto con filtros activos
 * @param {number} pagina - Número de página
 * @param {number} limit - Límite de elementos por página
 * @returns {URLSearchParams} - Parámetros de query
 */
export const buildMaquinariaQueryParams = (filtros, pagina = 1, limit = 10) => {
  const params = new URLSearchParams({
    page: pagina.toString(),
    limit: limit.toString(),
    sortBy: 'categoria',
    sortOrder: 'asc'
  });

  // Agregar filtros activos
  Object.keys(filtros).forEach(key => {
    if (filtros[key] !== '' && filtros[key] !== false && filtros[key] !== null && filtros[key] !== undefined) {
      params.append(key, filtros[key].toString());
    }
  });

  return params;
};

/**
 * Limpia todos los filtros de maquinarias y retorna estado inicial
 * @returns {Object} - Objeto con filtros vacíos
 */
export const clearMaquinariaFilters = () => ({
  busqueda: '',
  categoria: '',
  estado: '',
  proveedor: '',
  anioMin: '',
  anioMax: ''
});

/**
 * Determina la clase de color para el estado de la maquinaria
 * @param {string} estado - Estado de la maquinaria
 * @returns {string} - Clase CSS de color con background
 */
export const getEstadoColorClass = (estado) => {
  if (!estado) return 'bg-gray-100 text-gray-700';
  
  const estadoLower = estado.toLowerCase();
  
  if (estadoLower.includes('operativo') || estadoLower.includes('funcionando') || estadoLower.includes('activo')) {
    return 'bg-green-100 text-green-700';
  }
  if (estadoLower.includes('mantenimiento') || estadoLower.includes('reparacion') || estadoLower.includes('revision')) {
    return 'bg-yellow-100 text-yellow-700';
  }
  if (estadoLower.includes('averiado') || estadoLower.includes('roto') || estadoLower.includes('fuera de servicio')) {
    return 'bg-red-100 text-red-700';
  }
  
  return 'bg-blue-100 text-blue-700'; // Para otros estados
};

/**
 * Formatea el año para mostrar, manejando valores nulos
 * @param {number|null} anio - Año de la maquinaria
 * @returns {string} - Año formateado o texto por defecto
 */
export const formatAnio = (anio) => {
  if (!anio || anio === 0) return 'No especificado';
  return anio.toString();
};
