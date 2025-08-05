/**
 * Estilos específicos para páginas de detalles (RepuestoDetails, MaquinariaDetails, etc.)
 */

// Estilos base para contenedores de detalles
export const DETAILS_CONTAINER = {
  main: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-3",
  maxWidth: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3",
  card: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden",
  cardPadding: "p-3 sm:p-4",
  grid: "grid grid-cols-1 lg:grid-cols-3 gap-4",
  gridTwoColumns: "grid grid-cols-1 lg:grid-cols-2 gap-4"
};

// Estilos para headers de detalles
export const DETAILS_HEADER = {
  container: "flex items-center gap-3 mb-2",
  backButton: "p-2 hover:bg-gray-100 rounded-lg transition-colors",
  title: "text-2xl font-bold text-gray-900",
  subtitle: "text-gray-600"
};

// Estilos para secciones de información
export const DETAILS_SECTION = {
  title: "text-lg font-semibold text-gray-900 mb-4",
  subtitle: "text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4",
  grid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  gridThree: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
  field: "mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md",
  fieldWithIcon: "mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center",
  fieldLabel: "block text-sm font-medium text-gray-700 mb-2"
};

// Estilos para imágenes
export const DETAILS_IMAGE = {
  container: "aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors",
  image: "w-full h-full object-cover",
  placeholder: "w-full h-full flex items-center justify-center",
  placeholderContent: "text-center text-gray-500",
  upload: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100",
  uploadText: "mt-1 text-xs text-gray-500"
};

// Estilos para tags y etiquetas
export const DETAILS_TAGS = {
  container: "flex flex-wrap gap-2",
  tag: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
  tagWithIcon: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
};

// Estilos para estadísticas
export const DETAILS_STATS = {
  grid: "grid grid-cols-2 sm:grid-cols-3 gap-4",
  card: "text-center p-4 rounded-lg",
  value: "text-2xl font-bold",
  label: "text-sm"
};

// Estilos para acciones
export const DETAILS_ACTIONS = {
  container: "flex flex-wrap gap-4",
  button: "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors",
  primary: "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  secondary: "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-blue-500",
  success: "text-green-700 bg-green-50 border-green-200 hover:bg-green-100 focus:ring-green-500",
  danger: "text-red-700 bg-red-50 border-red-200 hover:bg-red-100 focus:ring-red-500"
};

// Estilos para iconos
export const DETAILS_ICONS = {
  small: "w-4 h-4",
  medium: "w-5 h-5",
  large: "w-6 h-6",
  extraLarge: "w-12 h-12",
  spin: "animate-spin"
};

// Estilos para alertas
export const DETAILS_ALERTS = {
  success: "p-3 bg-green-50 border border-green-200 rounded-md text-green-800",
  error: "p-3 bg-red-50 border border-red-200 rounded-md text-red-800",
  warning: "p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800",
  info: "p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800"
};

// Estilos para loading
export const DETAILS_LOADING = {
  container: "flex items-center justify-center min-h-96",
  content: "text-sm text-gray-500 flex items-center gap-2",
  spinner: "w-5 h-5 animate-spin"
};
