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
    const colors = [
      'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-indigo-100 text-indigo-700', 
      'bg-teal-100 text-teal-700', 'bg-cyan-100 text-cyan-700', 'bg-emerald-100 text-emerald-700'
    ];
    return colors[Math.abs(hash) % colors.length];
  } else {
    // Para ubicaciones relacionadas con John Deere (JD), usar tonos verdes
    if (str.toLowerCase().includes('jd') || str.toLowerCase().includes('john') || str.toLowerCase().includes('deere')) {
      const greenColors = [
        'bg-green-100 text-green-700', 'bg-emerald-100 text-emerald-700', 'bg-lime-100 text-lime-700', 
        'bg-green-50 text-green-800', 'bg-emerald-50 text-emerald-800', 'bg-green-200 text-green-800'
      ];
      return greenColors[Math.abs(hash) % greenColors.length];
    }
    
    // Para otras ubicaciones, usar la paleta original de rojos/naranjas
    const colors = [
      'bg-red-100 text-red-700', 'bg-orange-100 text-orange-700', 'bg-amber-100 text-amber-700', 
      'bg-rose-100 text-rose-700', 'bg-pink-100 text-pink-700', 'bg-red-50 text-red-800'
    ];
    return colors[Math.abs(hash) % colors.length];
  }
};

/**
 * Determina la clase de color para el stock basado en la cantidad
 * @param {number} stock - Cantidad en stock
 * @returns {string} - Clase CSS de color con background
 */
export const getStockColorClass = (stock) => {
  if (stock <= 0) return 'bg-red-100 text-red-700';
  if (stock < 10) return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
};
