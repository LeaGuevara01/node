/**
 * Utilidades para ordenación y filtrado de datos
 */

/**
 * Ordena una lista de repuestos por stock descendente y nombre alfabético
 * @param {Array} repuestos - Array de repuestos
 * @returns {Array} - Array ordenado
 */
export const sortRepuestosByStock = (repuestos) => {
  return repuestos.sort((a, b) => {
    if (b.stock !== a.stock) {
      return b.stock - a.stock; // Descendente por stock
    }
    return a.nombre.localeCompare(b.nombre); // Alfabético por nombre si stock es igual
  });
};

/**
 * Construye parámetros de query para la API
 * @param {Object} filtros - Objeto con filtros activos
 * @param {number} pagina - Número de página
 * @param {number} limit - Límite de elementos por página
 * @returns {URLSearchParams} - Parámetros de query
 */
export const buildQueryParams = (filtros, pagina = 1, limit = 10) => {
  const params = new URLSearchParams({
    page: pagina.toString(),
    limit: limit.toString(),
    sortBy: 'stock',
    sortOrder: 'desc'
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
 * Limpia todos los filtros y retorna estado inicial
 * @returns {Object} - Objeto con filtros vacíos
 */
export const clearAllFilters = () => ({
  search: '',
  categoria: '',
  ubicacion: '',
  stockMin: '',
  stockMax: '',
  sinStock: false
});

/**
 * Parsea un rango de valores desde un string (ej: "10-50" o "10+" o "-50")
 * @param {string} rangeString - String del rango
 * @returns {Object} - Objeto con min y max
 */
export const parseRange = (rangeString) => {
  if (!rangeString || rangeString.trim() === '') {
    return { min: null, max: null };
  }

  const trimmed = rangeString.trim();
  
  // Formato "min-max" (ej: "10-50")
  if (trimmed.includes('-') && !trimmed.startsWith('-')) {
    const [minStr, maxStr] = trimmed.split('-');
    return {
      min: minStr ? Number(minStr) : null,
      max: maxStr ? Number(maxStr) : null
    };
  }
  
  // Formato "min+" (ej: "10+")
  if (trimmed.endsWith('+')) {
    const minStr = trimmed.slice(0, -1);
    return {
      min: minStr ? Number(minStr) : null,
      max: null
    };
  }
  
  // Formato "-max" (ej: "-50")
  if (trimmed.startsWith('-')) {
    const maxStr = trimmed.slice(1);
    return {
      min: null,
      max: maxStr ? Number(maxStr) : null
    };
  }
  
  // Formato simple "valor" (se interpreta como valor exacto)
  const value = Number(trimmed);
  if (!isNaN(value)) {
    return {
      min: value,
      max: value
    };
  }
  
  return { min: null, max: null };
};
