/**
 * Estilos específicos para páginas de detalles (RepuestoDetails, MaquinariaDetails, etc.)
 * Actualizado para usar el sistema de design tokens
 */

import { DESIGN_TOKENS } from './tokens/designTokens';
import { COMPONENT_VARIANTS } from './tokens/componentVariants';

// Estilos base para contenedores de detalles
export const DETAILS_CONTAINER = {
  main: 'min-h-screen bg-gradient-subtle py-3 animate-fade-in',
  maxWidth: 'container-agricultural space-y-3',
  card: 'card-agricultural',
  cardPadding: 'p-3 sm:p-4',
  grid: 'grid grid-cols-1 lg:grid-cols-3 gap-4',
  gridTwoColumns: 'grid grid-cols-1 lg:grid-cols-2 gap-4',
};

// Estilos para headers de detalles
export const DETAILS_HEADER = {
  container: 'flex items-center gap-3 mb-2',
  backButton: 'p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-105',
  title: 'text-2xl font-bold text-gray-900',
  subtitle: 'text-gray-600',
};

// Estilos para secciones de información
export const DETAILS_SECTION = {
  title: 'text-lg font-semibold text-agricultural-crop-700 mb-4',
  subtitle: 'text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4',
  grid: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  gridThree: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
  field:
    'mt-1 p-3 bg-gradient-subtle border border-agricultural-earth-200 rounded-md transition-all duration-200',
  fieldWithIcon:
    'mt-1 p-3 bg-gradient-subtle border border-agricultural-earth-200 rounded-md flex items-center transition-all duration-200',
  fieldLabel: 'block text-sm font-medium text-gray-700 mb-2',
};

// Estilos para imágenes
export const DETAILS_IMAGE = {
  container:
    'aspect-square bg-gradient-subtle rounded-xl overflow-hidden border-2 border-dashed border-agricultural-earth-300 hover:border-agricultural-crop-400 transition-all duration-300',
  image: 'w-full h-full object-cover transition-transform duration-300 hover:scale-105',
  placeholder: 'w-full h-full flex items-center justify-center',
  placeholderContent: 'text-center text-gray-500',
  upload:
    'block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-agricultural-crop-50 file:text-agricultural-crop-700 hover:file:bg-agricultural-crop-100 transition-all duration-200',
  uploadText: 'mt-1 text-xs text-gray-500',
};

// Estilos para tags y etiquetas
export const DETAILS_TAGS = {
  container: 'flex flex-wrap gap-2',
  tag: 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200',
  tagWithIcon:
    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-200',
};

// Estilos para estadísticas
export const DETAILS_STATS = {
  grid: 'grid grid-cols-2 sm:grid-cols-3 gap-4',
  card: 'text-center p-4 rounded-lg bg-gradient-to-br from-white to-agricultural-crop-50 shadow-agricultural transition-all duration-200 hover:shadow-agricultural-lg hover:scale-105',
  value: 'text-2xl font-bold text-agricultural-crop-700',
  label: 'text-sm text-agricultural-crop-600',
};

// Estilos para acciones
export const DETAILS_ACTIONS = {
  container: 'flex flex-wrap gap-4',
  button:
    'inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200',
  primary:
    'text-white bg-agricultural-crop-600 hover:bg-agricultural-crop-700 focus:ring-agricultural-crop-500 hover:shadow-glow-green',
  secondary:
    'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 focus:ring-agricultural-crop-500',
  success:
    'text-agricultural-crop-700 bg-agricultural-crop-50 border-agricultural-crop-200 hover:bg-agricultural-crop-100 focus:ring-agricultural-crop-500',
  danger: 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100 focus:ring-red-500',
};

// Estilos para iconos
export const DETAILS_ICONS = {
  small: 'w-4 h-4',
  medium: 'w-5 h-5',
  large: 'w-6 h-6',
  extraLarge: 'w-12 h-12',
  spin: 'animate-spin',
};

// Estilos para alertas
export const DETAILS_ALERTS = {
  success:
    'p-3 bg-agricultural-crop-50 border border-agricultural-crop-200 rounded-md text-agricultural-crop-800 animate-slide-up',
  error: 'p-3 bg-red-50 border border-red-200 rounded-md text-red-800 animate-slide-up',
  warning:
    'p-3 bg-agricultural-machinery-50 border border-agricultural-machinery-200 rounded-md text-agricultural-machinery-800 animate-slide-up',
  info: 'p-3 bg-agricultural-sky-50 border border-agricultural-sky-200 rounded-md text-agricultural-sky-800 animate-slide-up',
};

// Estilos para loading
export const DETAILS_LOADING = {
  container: 'flex items-center justify-center min-h-96',
  content: 'text-sm text-gray-500 flex items-center gap-2',
  spinner: 'w-5 h-5 animate-spin text-agricultural-crop-600',
};
