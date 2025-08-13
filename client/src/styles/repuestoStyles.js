/**
 * Constantes de estilos CSS para el componente RepuestoForm
 */

// Clases base para contenedores
export const CONTAINER_STYLES = {
  main: 'min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-3',
  maxWidth: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3',
  card: 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden',
  cardPadding: 'p-3 sm:p-4',
};

// Clases para inputs y formularios
export const INPUT_STYLES = {
  base: 'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-700 focus:border-transparent text-gray-700',
  withIcon:
    'w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-700 focus:border-transparent text-gray-700',
  placeholder: 'placeholder-gray-500',
  select:
    'w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-700 focus:border-transparent appearance-none text-gray-700',
  selectPlaceholder: 'text-gray-500',
  label: 'block text-sm font-medium text-gray-700 mb-2',
  textarea:
    'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-700 focus:border-transparent text-gray-900 resize-vertical min-h-[100px]',
};

// Clases para botones
export const BUTTON_STYLES = {
  primary:
    'bg-brand-700 hover:bg-brand-800 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2',
  secondary:
    'bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2',
  danger:
    'bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2',
  edit: 'bg-brand-50 hover:bg-brand-100 text-brand-700 p-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center mt-1 flex-shrink-0',
  csv: 'bg-brown-50 hover:bg-brown-100 text-brown-700 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 text-center flex items-center justify-center gap-2 font-semibold opacity-90 hover:opacity-100 border border-brown-200 hover:border-brown-300',
  newItem:
    'bg-brand-50 hover:bg-brand-100 text-brand-700 px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 opacity-90 hover:opacity-100 w-full sm:w-auto border border-brand-200 hover:border-brand-300',
  backButton:
    'inline-flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 gap-2 text-sm font-medium shadow-sm',
  backButtonLarge:
    'inline-flex items-center px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 gap-3 text-base font-medium shadow-sm hover:shadow-md',
  filter: {
    inactive:
      'bg-gray-50 border-gray-300 text-gray-500 hover:bg-gray-100 focus:ring-gray-500 font-semibold',
    active:
      'bg-red-50 border-red-300 text-red-700 hover:bg-red-100 focus:ring-red-500 font-semibold',
    clear:
      'w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200 flex items-center justify-center gap-2 font-medium',
  },
  pagination: {
    enabled: 'bg-brand-700 hover:bg-brand-800 text-white shadow-sm hover:shadow-md',
    disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60',
    base: 'px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1 border border-transparent',
  },
};

// Clases para layouts y grids
export const LAYOUT_STYLES = {
  flexBetween: 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3',
  gridFilters: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3',
  gridButtons: 'grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3',
  gridForm: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  searchSpan: 'sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2',
  filterSpan: 'md:col-span-1 lg:col-span-1 xl:col-span-1',
  rangeSpan: 'sm:col-span-2 md:col-span-2 lg:col-span-1 xl:col-span-1',
};

// Clases para iconos
export const ICON_STYLES = {
  xs: 'w-3 h-3',
  small: 'w-3.5 h-3.5',
  medium: 'w-5 h-5',
  large: 'w-6 h-6',
  extraLarge: 'w-12 h-12',
  gray: 'text-gray-400',
  spin: 'animate-spin',
};

// Clases para textos y tipografía
export const TEXT_STYLES = {
  title: 'text-2xl font-bold text-brand-700',
  subtitle: 'text-gray-600',
  sectionTitle: 'text-lg font-semibold mb-3 text-gray-900',
  itemTitle: 'font-semibold text-gray-900 text-[17px]',
  small: 'text-[13px]',
  gray: 'text-gray-500',
  loading: 'text-sm text-gray-500 flex items-center gap-2',
};

// Clases para estados y alertas
export const ALERT_STYLES = {
  success: 'mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-800',
  error: 'mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800',
  errorModal: 'p-3 bg-red-50 border border-red-200 rounded-lg text-red-800',
};

// Clases para modales
export const MODAL_STYLES = {
  overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50',
  container: 'bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto',
  header: 'flex justify-between items-center mb-6',
  title: 'text-xl font-semibold text-gray-800',
  closeButton:
    'text-gray-500 hover:text-gray-700 text-2xl flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200',
  content: 'p-6',
  form: 'space-y-4',
  buttonGroup: 'flex flex-col sm:flex-row gap-3 pt-4 justify-between sm:justify-between',
};

// Clases para elementos de lista
export const LIST_STYLES = {
  divider: 'divide-y divide-gray-200',
  item: 'p-2 sm:p-4 hover:bg-gray-50 transition-colors duration-150',
  itemContent: 'flex items-start gap-3',
  itemHeader: 'flex justify-between items-center mb-1',
  itemDetails: 'flex flex-wrap items-center gap-3 mt-1 text-[13px] sm:text-sm min-h-[24px]',
  itemLeft: 'flex flex-wrap items-center gap-3 flex-1 min-w-0',
  itemRight: 'flex items-center flex-shrink-0 ml-2',
  itemTag:
    'flex items-center justify-center gap-1 px-2 py-1 rounded-md text-[12px] sm:text-sm font-medium tag-no-wrap flex-1 min-w-[60px]',
  itemTagStock:
    'flex items-center gap-1 px-2 py-1 rounded-md text-[12px] sm:text-sm font-medium tag-no-wrap flex-shrink-0 min-w-[45px] max-w-[70px]',
  itemTagCategory:
    'flex items-center justify-center gap-1 px-1.5 py-1 rounded-md text-[12px] sm:text-sm font-medium tag-no-wrap flex-1 min-w-[70px] max-w-[200px] sm:max-w-[220px] md:max-w-[240px] lg:flex-initial lg:max-w-none',
  itemTagWithEllipsis:
    'flex items-center justify-center gap-1 px-1.5 py-1 rounded-md text-[12px] sm:text-sm font-medium tag-no-wrap flex-1 min-w-[80px] max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:flex-initial lg:max-w-none',
  itemTagCode:
    'flex items-center justify-center gap-1 px-1.5 py-1 rounded-md text-[12px] sm:text-sm font-medium tag-no-wrap flex-1 min-w-[80px] max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:flex-initial lg:max-w-none',
  itemTagLocation:
    'flex items-center justify-center gap-1 px-1.5 py-1 rounded-md text-[12px] sm:text-sm font-medium tag-no-wrap flex-1 min-w-[70px] max-w-[200px] sm:max-w-[220px] md:max-w-[240px] lg:flex-initial lg:max-w-none',
  itemTagSupplier:
    'flex items-center justify-center gap-1 px-1.5 py-1 rounded-md text-[12px] sm:text-sm font-medium tag-no-wrap flex-1 min-w-[80px] max-w-[200px] sm:max-w-[220px] md:max-w-[240px] lg:flex-initial lg:max-w-none',
  itemDescription:
    'text-[15px] text-gray-700 mt-1 font-medium line-clamp-2 flex items-center justify-between gap-2 min-h-[24px]',
  itemTagsRow: 'flex items-center justify-between gap-2 mt-2 min-h-[28px] w-full',
  itemTagsLeft: 'flex items-center gap-1 sm:gap-2 flex-1 min-w-0 overflow-hidden',
  itemActions: 'flex items-center flex-shrink-0 ml-2 min-w-[40px]',
  emptyState: 'p-8 text-center text-gray-500',
};

// Clases para posicionamiento absoluto
export const POSITION_STYLES = {
  iconLeft: 'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none',
  iconRight: 'absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none',
  relative: 'relative',
};

// Clases para inputs embebidos (rangos)
export const RANGE_STYLES = {
  container:
    'relative border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-brand-700 focus-within:border-transparent w-full',
  wrapper: 'flex items-center py-3 min-w-0 w-full',
  labelSection: 'flex items-center px-3 min-w-0 flex-shrink-0',
  icon: 'w-5 h-5 mr-2 text-gray-400 flex-shrink-0',
  labelText: 'text-sm font-medium text-gray-600 whitespace-nowrap',
  inputsWrapper: 'flex items-center gap-1 px-3 flex-1 min-w-0 w-full',
  input:
    'flex-1 border-0 p-1 text-sm focus:ring-0 focus:outline-none bg-transparent placeholder-gray-500 min-w-0 w-16 text-gray-700 text-center',
  separator: 'text-gray-500 text-sm font-medium px-2 flex-shrink-0 select-none',
};
