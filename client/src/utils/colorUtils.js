/**
 * Utilidades para generar colores dinámicos
 */

/**
 * Genera un hash numérico a partir de una cadena de texto
 * @param {string} str - Cadena de texto a procesar
 * @returns {number} - Hash numérico
 */
export const generateStringHash = (str) => {
  if (!str) return 0;

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

/**
 * Genera una clase de color dinámico basada en un string y tipo
 * @param {string} str - Cadena de texto base
 * @param {string} type - Tipo de elemento ('categoria' o 'ubicacion')
 * @returns {string} - Clase CSS de color con background
 */
export const getColorFromString = (str, type = 'categoria') => {
  if (!str) return 'bg-gray-100 text-gray-700';

  const hash = generateStringHash(str);

  if (type === 'categoria') {
    // Paleta con mayor contraste entre tonos
    const colors = [
      'bg-brand-200 text-brand-900',
      'bg-fuchsia-200 text-fuchsia-900',
      'bg-indigo-200 text-indigo-900',
      'bg-teal-200 text-teal-900',
      'bg-amber-200 text-amber-900',
      'bg-emerald-200 text-emerald-900',
      'bg-rose-200 text-rose-900',
      'bg-cyan-200 text-cyan-900',
    ];
    return colors[Math.abs(hash) % colors.length];
  } else {
    // Para ubicaciones relacionadas con John Deere (JD), usar tonos verdes con mejor contraste
    if (
      str.toLowerCase().includes('jd') ||
      str.toLowerCase().includes('john') ||
      str.toLowerCase().includes('deere')
    ) {
      const brownColors = [
        'bg-brown-200 text-brown-900',
        'bg-amber-200 text-amber-900',
        'bg-yellow-200 text-yellow-900',
        'bg-brown-100 text-brown-900',
        'bg-amber-100 text-amber-900',
        'bg-yellow-100 text-yellow-900',
      ];
      return brownColors[Math.abs(hash) % brownColors.length];
    }

    // Para otras ubicaciones, usar la paleta original de rojos/naranjas
    const colors = [
      'bg-gray-100 text-gray-700', // opción neutra similar a código
      'bg-red-100 text-red-700',
      'bg-orange-100 text-orange-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
      'bg-pink-100 text-pink-700',
      'bg-red-50 text-red-800',
    ];
    return colors[Math.abs(hash) % colors.length];
  }
};

/**
 * Determina la clase de color para el stock basado en la cantidad
 * @param {number} stock - Cantidad en stock
 * @returns {string} - Clase CSS de color con background
 */
export const getStockColorClass = (stock, ubicacion) => {
  // Regla especial: para ubicación "insumos" siempre azul
  if (typeof ubicacion === 'string' && ubicacion.toLowerCase().includes('insumos')) {
    return 'bg-brand-100 text-brand-700';
  }
  // Buckets alineados con el Dashboard
  if (stock <= 0) return 'bg-red-100 text-red-700'; // Sin stock (0)
  if (stock === 1) return 'bg-yellow-100 text-yellow-700'; // Bajo (1)
  return 'bg-brown-100 text-brown-800'; // Normal (≥2) acorde paleta industrial
};
