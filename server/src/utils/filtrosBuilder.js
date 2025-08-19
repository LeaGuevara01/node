// utils/filtrosBuilder.js
// Funciones utilitarias para construir filtros Prisma dinámicos

/**
 * Filtro flexible para string: exacto, contains, array, etc.
 * @param {string|string[]} value
 * @param {Object} options
 * @returns {Object|undefined}
 */
function buildStringFilter(value, options = { mode: 'insensitive', contains: true }) {
  if (!value || value === 'all') return undefined;
  if (Array.isArray(value)) {
    // Si es array, usar OR con contains
    return {
      OR: value
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) =>
          options.contains
            ? { contains: v, mode: options.mode }
            : { equals: v }
        ),
    };
  }
  // Si es string, usar contains o equals
  return options.contains
    ? { contains: value.trim(), mode: options.mode }
    : { equals: value.trim() };
}

/**
 * Filtro para rangos numéricos
 * @param {number|string} min
 * @param {number|string} max
 * @returns {Object|undefined}
 */
function buildRangeFilter(min, max) {
  const filter = {};
  if (min !== undefined && min !== null && min !== '') filter.gte = Number(min);
  if (max !== undefined && max !== null && max !== '') filter.lte = Number(max);
  return Object.keys(filter).length ? filter : undefined;
}

module.exports = {
  buildStringFilter,
  buildRangeFilter,
};
