/**
 * Estilos específicos para componentes de Proveedores
 * Extiende los estilos base de detailsStyles.js y repuestoStyles.js
 */

// Importar estilos base
import { DETAILS_CONTAINER, DETAILS_SECTION, DETAILS_TAGS } from './detailsStyles';
import { BUTTON_STYLES, INPUT_STYLES, LAYOUT_STYLES } from './repuestoStyles';

// Estilos específicos para proveedores
export const PROVEEDOR_STYLES = {
  // Contenedores específicos para proveedores
  container: {
    ...DETAILS_CONTAINER,
    // Overwrites específicos si necesarios
  },
  
  // Formularios de proveedores
  form: {
    grid: "grid grid-cols-1 md:grid-cols-2 gap-6",
    fieldGroup: "space-y-4",
    section: "bg-gray-50 rounded-xl p-6 space-y-4",
    sectionTitle: "text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4"
  },

  // Campos específicos de proveedores
  fields: {
    cuit: "font-mono text-sm",
    telefono: "font-mono text-sm",
    email: "text-blue-600 hover:text-blue-800 transition-colors",
    web: "text-blue-600 hover:text-blue-800 transition-colors break-all",
    direccion: "leading-relaxed",
    productos: "flex flex-wrap gap-2"
  },

  // Tags para productos
  productTag: {
    base: "inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium",
    default: "bg-blue-100 text-blue-800",
    hover: "hover:bg-blue-200 transition-colors cursor-pointer"
  },

  // Cards de información
  infoCard: {
    base: "bg-gray-50 rounded-xl p-6",
    title: "text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4",
    content: "space-y-4"
  },

  // Estados específicos
  states: {
    loading: "flex items-center justify-center min-h-96",
    empty: "text-center text-gray-500 py-12",
    error: "bg-red-50 border border-red-200 rounded-xl p-6 text-red-800"
  },

  // Botones específicos para proveedores
  buttons: {
    ...BUTTON_STYLES,
    contact: "bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 hover:border-green-300",
    website: "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 hover:border-purple-300"
  },

  // Lista de proveedores
  list: {
    container: "space-y-4",
    item: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow",
    header: "flex items-start justify-between",
    title: "text-lg font-semibold text-gray-900",
    subtitle: "text-sm text-gray-600 mt-1",
    actions: "flex items-center gap-2 ml-4",
    content: "mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
    field: "text-sm",
    label: "font-medium text-gray-700",
    value: "text-gray-600 mt-1"
  },

  // Filtros específicos
  filters: {
    container: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
    field: "space-y-2",
    clearButton: "col-span-full flex justify-center mt-4"
  },

  // Modal de edición
  modal: {
    overlay: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
    container: "bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden",
    header: "px-6 py-4 border-b border-gray-200 flex items-center justify-between",
    title: "text-lg font-semibold text-gray-900",
    closeButton: "text-gray-400 hover:text-gray-600 transition-colors",
    content: "px-6 py-4 max-h-[70vh] overflow-y-auto",
    footer: "px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3"
  },

  // Responsive breakpoints específicos
  responsive: {
    hideOnMobile: "hidden sm:block",
    showOnMobile: "block sm:hidden",
    stackOnMobile: "flex flex-col sm:flex-row gap-3",
    gridCollapse: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  }
};

// Utilidades específicas para proveedores
export const PROVEEDOR_UTILS = {
  // Clases para estados de conexión/contacto
  contactStatus: {
    available: "bg-green-100 text-green-800",
    unavailable: "bg-red-100 text-red-800",
    unknown: "bg-gray-100 text-gray-800"
  },

  // Iconos específicos para proveedores
  icons: {
    supplier: "w-5 h-5 text-blue-600",
    contact: "w-4 h-4 text-green-600",
    location: "w-4 h-4 text-gray-600",
    products: "w-4 h-4 text-purple-600"
  }
};

// Exportar todo como un objeto unificado
export default {
  ...PROVEEDOR_STYLES,
  utils: PROVEEDOR_UTILS
};
