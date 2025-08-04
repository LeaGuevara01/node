/**
 * Constantes de estilos CSS para el componente RepuestoForm
 */

// Clases base para contenedores
export const CONTAINER_STYLES = {
  main: "min-h-screen bg-gray-50 p-2",
  maxWidth: "max-w-7xl mx-auto space-y-4",
  card: "bg-white rounded-lg shadow-sm",
  cardPadding: "p-3 sm:p-5"
};

// Clases para inputs y formularios
export const INPUT_STYLES = {
  base: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500",
  withIcon: "w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-500",
  placeholder: "placeholder-gray-500",
  select: "w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-500",
  selectPlaceholder: "text-gray-500",
  label: "block text-sm font-medium text-gray-500 mb-1"
};

// Clases para botones
export const BUTTON_STYLES = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors duration-200",
  danger: "bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2",
  edit: "bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center mt-1 flex-shrink-0",
  csv: "bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 text-center flex items-center justify-center gap-2 font-semibold opacity-90 hover:opacity-100 border border-green-200 hover:border-green-300",
  newItem: "bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 opacity-90 hover:opacity-100 w-full sm:w-auto border border-blue-200 hover:border-blue-300",
  filter: {
    inactive: "bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100 focus:ring-gray-500 font-semibold",
    active: "bg-red-50 border-red-300 text-red-700 hover:bg-red-100 focus:ring-red-500 font-semibold",
    clear: "w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
  },
  pagination: {
    enabled: "bg-blue-600 hover:bg-blue-700 text-white",
    disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
    base: "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
  }
};

// Clases para layouts y grids
export const LAYOUT_STYLES = {
  flexBetween: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3",
  gridFilters: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3",
  gridButtons: "grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3",
  gridForm: "grid grid-cols-1 sm:grid-cols-2 gap-4",
  searchSpan: "sm:col-span-2"
};

// Clases para iconos
export const ICON_STYLES = {
  small: "w-4 h-4",
  medium: "w-5 h-5",
  large: "w-6 h-6",
  extraLarge: "w-12 h-12",
  gray: "text-gray-400",
  spin: "animate-spin"
};

// Clases para textos y tipografía
export const TEXT_STYLES = {
  title: "text-2xl font-bold text-gray-900",
  subtitle: "text-gray-600",
  sectionTitle: "text-lg font-medium mb-3 text-gray-800",
  itemTitle: "font-medium text-gray-900",
  small: "text-sm",
  gray: "text-gray-500",
  loading: "text-sm text-gray-500 flex items-center gap-2"
};

// Clases para estados y alertas
export const ALERT_STYLES = {
  success: "mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800",
  error: "mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800",
  errorModal: "p-3 bg-red-50 border border-red-200 rounded-lg text-red-800"
};

// Clases para modales
export const MODAL_STYLES = {
  overlay: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
  container: "bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto",
  header: "flex justify-between items-center mb-6",
  title: "text-xl font-semibold text-gray-800",
  closeButton: "text-gray-500 hover:text-gray-700 text-2xl flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200",
  content: "p-6",
  form: "space-y-4",
  buttonGroup: "flex flex-col sm:flex-row gap-3 pt-4 justify-center sm:justify-end"
};

// Clases para elementos de lista
export const LIST_STYLES = {
  divider: "divide-y divide-gray-200",
  item: "p-3 sm:p-5 hover:bg-gray-50 transition-colors duration-150",
  itemContent: "flex items-start gap-3",
  itemHeader: "flex justify-between items-center mb-1",
  itemDetails: "flex flex-wrap items-center gap-3 mt-1 text-sm min-h-[24px]",
  itemLeft: "flex flex-wrap items-center gap-3 flex-1 min-w-0",
  itemRight: "flex items-center flex-shrink-0 ml-2",
  itemTag: "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap flex-shrink-0",
  itemTagStock: "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap flex-shrink-0",
  itemTagCategory: "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap flex-shrink-0 max-w-[120px]",
  itemTagWithEllipsis: "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium flex-shrink-0 max-w-[100px]",
  itemDescription: "text-sm text-gray-600 mt-1 font-medium line-clamp-1 flex items-center justify-between gap-2 min-h-[24px]",
  itemTagsRow: "flex items-center justify-between gap-2 mt-2 min-h-[28px]",
  itemTagsLeft: "flex items-center gap-2 flex-1 min-w-0 overflow-hidden",
  itemActions: "flex items-center flex-shrink-0 ml-2 min-w-[40px]",
  emptyState: "p-8 text-center text-gray-500"
};

// Clases para posicionamiento absoluto
export const POSITION_STYLES = {
  iconLeft: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
  iconRight: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none",
  relative: "relative"
};

// Clases para inputs embebidos (rangos)
export const RANGE_STYLES = {
  container: "relative border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent",
  wrapper: "flex items-center py-2 min-w-0",
  labelSection: "flex items-center px-3 min-w-0 flex-shrink-0",
  icon: "w-5 h-5 mr-2 text-gray-400 flex-shrink-0",
  labelText: "text-sm font-medium text-gray-500 whitespace-nowrap",
  inputsWrapper: "flex items-center gap-1 px-2 flex-1 min-w-0",
  input: "flex-1 border-0 p-1 text-sm focus:ring-0 focus:outline-none bg-transparent placeholder-gray-400 min-w-0 w-16",
  separator: "text-gray-400 text-xs font-medium px-1 flex-shrink-0"
};
