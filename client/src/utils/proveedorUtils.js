// Utilidades para gestión de proveedores
// Funciones de ordenamiento, filtrado y formateo de datos

/**
 * Ordena proveedores alfabéticamente por nombre
 */
export const sortProveedoresByName = (proveedores) => {
  return [...proveedores].sort((a, b) => a.nombre.localeCompare(b.nombre));
};

/**
 * Construye parámetros de consulta para la API de proveedores
 */
export const buildProveedorQueryParams = (filtros, pagina = 1) => {
  const params = new URLSearchParams();
  
  if (filtros.search) params.append('search', filtros.search);
  if (filtros.ciudad) params.append('ciudad', filtros.ciudad);
  if (filtros.productos) params.append('productos', filtros.productos);
  params.append('page', pagina.toString());
  params.append('limit', '20');
  
  return params;
};

/**
 * Limpia todos los filtros de proveedores
 */
export const clearProveedorFilters = () => ({
  search: '',
  ciudad: '',
  productos: ''
});

/**
 * Formatea el CUIT con guiones
 */
export const formatCuit = (cuit) => {
  if (!cuit) return '';
  const cleaned = cuit.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 10)}-${cleaned.slice(10)}`;
  }
  return cuit;
};

/**
 * Valida formato de CUIT
 */
export const validateCuit = (cuit) => {
  const cleaned = cuit.replace(/\D/g, '');
  return cleaned.length === 11;
};

/**
 * Formatea teléfono con formato argentino
 */
export const formatTelefono = (telefono) => {
  if (!telefono) return '';
  const cleaned = telefono.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  return telefono;
};

/**
 * Extrae ciudad de la dirección
 */
export const extractCiudadFromDireccion = (direccion) => {
  if (!direccion) return '';
  const parts = direccion.split(',').map(part => part.trim());
  return parts.length > 1 ? parts[parts.length - 1] : '';
};

/**
 * Formatea array de productos como string
 */
export const formatProductos = (productos) => {
  if (!productos || !Array.isArray(productos)) return '';
  return productos.join(', ');
};

/**
 * Parsea string de productos a array
 */
export const parseProductos = (productosString) => {
  if (!productosString) return [];
  return productosString.split(',').map(p => p.trim()).filter(p => p.length > 0);
};

/**
 * Genera color para ciudad basado en hash
 */
export const getCiudadColorClass = (ciudad) => {
  if (!ciudad) return 'bg-gray-100 text-gray-700';
  
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-yellow-100 text-yellow-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
    'bg-red-100 text-red-700',
    'bg-teal-100 text-teal-700'
  ];
  
  let hash = 0;
  for (let i = 0; i < ciudad.length; i++) {
    hash = ciudad.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Valida email
 */
export const validateEmail = (email) => {
  if (!email) return true; // Email es opcional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida URL
 */
export const validateUrl = (url) => {
  if (!url) return true; // URL es opcional
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

/**
 * Formatea URL para mostrar
 */
export const formatUrl = (url) => {
  if (!url) return '';
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
};
