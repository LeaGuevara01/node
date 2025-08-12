/**
 * Sistema de Variantes de Componentes
 * Define estilos reutilizables para diferentes estados y tipos de componentes
 */

import { DESIGN_TOKENS } from './designTokens';

const { colors, spacing, typography, shadows, borders, animations } = DESIGN_TOKENS;

// Variantes de Botones
export const BUTTON_VARIANTS = {
  // Estilos base comunes a todos los botones
  base: `
    inline-flex items-center justify-center
    font-medium rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    select-none cursor-pointer
  `,

  // Variantes de estilo
  variants: {
    // Botón primario del sistema
    primary: `
      bg-brand-700 text-white border border-brand-700
      hover:bg-brand-800 hover:border-brand-800
      focus:ring-brand-500
      active:bg-brand-900
    `,

    // Botón de éxito (verde)
    success: `
      bg-green-600 text-white border border-green-600
      hover:bg-green-700 hover:border-green-700
      focus:ring-green-500
      active:bg-green-800
    `,

    // Botón de advertencia (amarillo/naranja)
    warning: `
      bg-yellow-500 text-white border border-yellow-500
      hover:bg-yellow-600 hover:border-yellow-600
      focus:ring-yellow-500
      active:bg-yellow-700
    `,

    // Botón de peligro (rojo)
    danger: `
      bg-red-600 text-white border border-red-600
      hover:bg-red-700 hover:border-red-700
      focus:ring-red-500
      active:bg-red-800
    `,

    // Botón secundario (outline)
    secondary: `
      bg-white text-gray-700 border border-gray-300
      hover:bg-gray-50 hover:border-gray-400
      focus:ring-brand-500
      active:bg-gray-100
    `,

    // Botón fantasma (sin fondo)
    ghost: `
      bg-transparent text-gray-700 border border-transparent
      hover:bg-gray-100
      focus:ring-brand-500
      active:bg-gray-200
    `,

    // Variantes temáticas agrícolas
    agricultural: `
      bg-gradient-to-r from-green-600 to-green-700
      text-white border border-green-600 shadow-md
      hover:from-green-700 hover:to-green-800 hover:shadow-lg
      focus:ring-green-500
      active:from-green-800 active:to-green-900
    `,

    machinery: `
      bg-gradient-to-r from-yellow-500 to-yellow-600
      text-white border border-yellow-500 shadow-md
      hover:from-yellow-600 hover:to-yellow-700 hover:shadow-lg
      focus:ring-yellow-500
      active:from-yellow-700 active:to-yellow-800
    `,

    earth: `
      bg-gradient-to-r from-amber-600 to-amber-700
      text-white border border-amber-600 shadow-md
      hover:from-amber-700 hover:to-amber-800 hover:shadow-lg
      focus:ring-amber-500
      active:from-amber-800 active:to-amber-900
    `,

    // Botón de link
    link: `
      bg-transparent text-brand-700 border border-transparent
      hover:text-brand-900 hover:underline
      focus:ring-brand-500
      active:text-brand-950
    `
  },

  // Tamaños de botones
  sizes: {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  },

  // Estados especiales
  states: {
    loading: 'opacity-75 cursor-wait',
    disabled: 'opacity-50 cursor-not-allowed pointer-events-none'
  }
};

// Variantes de Cards
export const CARD_VARIANTS = {
  // Estilos base para cards
  base: `
    bg-white rounded-xl border border-gray-200
    transition-all duration-200
    overflow-hidden
  `,

  // Variantes de estilo
  variants: {
    // Card por defecto
    default: `
      shadow-sm
      hover:shadow-md
    `,

    // Card interactivo (clickeable)
    interactive: `
      shadow-sm cursor-pointer
      hover:shadow-lg hover:scale-[1.02]
      active:scale-[0.98]
    `,

    // Card de estadísticas
    stats: `
      shadow-md text-center p-6
      hover:shadow-lg hover:scale-105
      border-l-4 border-brand-600
      bg-gradient-to-br from-white to-brand-50
    `,

    // Cards temáticas agrícolas
    agricultural: `
      shadow-md border-l-4 border-brown-500
      bg-gradient-to-br from-white to-brown-50
      hover:shadow-lg hover:scale-[1.02]
    `,

    machinery: `
      shadow-md border-l-4 border-yellow-500
      bg-gradient-to-br from-white to-yellow-50
      hover:shadow-lg hover:scale-[1.02]
    `,

    earth: `
      shadow-md border-l-4 border-amber-600
      bg-gradient-to-br from-white to-amber-50
      hover:shadow-lg hover:scale-[1.02]
    `,

    // Card de alerta
    alert: `
      shadow-lg border-2 border-red-200
      bg-gradient-to-br from-red-50 to-red-100
    `,

    // Card de éxito
    success: `
      shadow-lg border-2 border-green-200
      bg-gradient-to-br from-green-50 to-green-100
    `,

    // Card elevado
    elevated: `
      shadow-xl
      hover:shadow-2xl hover:scale-[1.02]
    `,

    // Card plano
    flat: `
      shadow-none border-2 border-gray-200
      hover:border-gray-300
    `
  },

  // Tamaños de padding
  padding: {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }
};

// Variantes de Inputs
export const INPUT_VARIANTS = {
  // Estilos base
  base: `
    block w-full rounded-lg border transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  // Variantes de estilo
  variants: {
    // Input por defecto
    default: `
      border-gray-300 bg-white text-gray-900
      focus:border-brand-500 focus:ring-brand-500
      placeholder:text-gray-400
    `,

    // Input de éxito
    success: `
      border-green-300 bg-green-50 text-green-900
      focus:border-green-500 focus:ring-green-500
      placeholder:text-green-400
    `,

    // Input de error
    error: `
      border-red-300 bg-red-50 text-red-900
      focus:border-red-500 focus:ring-red-500
      placeholder:text-red-400
    `,

    // Input temático agrícola
    agricultural: `
      border-brown-300 bg-brown-50 text-brown-900
      focus:border-brown-500 focus:ring-brown-500
      placeholder:text-brown-400
    `,

    // Input ghost (sin bordes visibles)
    ghost: `
      border-transparent bg-gray-50 text-gray-900
      focus:border-gray-300 focus:ring-gray-300
      placeholder:text-gray-400
    `
  },

  // Tamaños
  sizes: {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  }
};

// Variantes de Badges/Tags
export const BADGE_VARIANTS = {
  // Estilos base
  base: `
    inline-flex items-center font-medium rounded-full
    transition-colors duration-200
  `,

  // Variantes de estilo
  variants: {
    // Badge por defecto
    default: `
      bg-gray-100 text-gray-800
      hover:bg-gray-200
    `,

    // Badge primario
    primary: `
      bg-brand-100 text-brand-800
      hover:bg-brand-200
    `,

    // Badge de éxito
    success: `
      bg-green-100 text-green-800
      hover:bg-green-200
    `,

    // Badge de advertencia
    warning: `
      bg-yellow-100 text-yellow-800
      hover:bg-yellow-200
    `,

    // Badge de error
    error: `
      bg-red-100 text-red-800
      hover:bg-red-200
    `,

    // Badges temáticos agrícolas
    agricultural: `
      bg-brown-100 text-brown-800 border border-brown-200
      hover:bg-brown-200
    `,

    machinery: `
      bg-yellow-100 text-yellow-800 border border-yellow-200
      hover:bg-yellow-200
    `,

    earth: `
      bg-amber-100 text-amber-800 border border-amber-200
      hover:bg-amber-200
    `,

    // Badge outline
    outline: `
      bg-transparent border border-gray-300 text-gray-700
      hover:bg-gray-50
    `
  },

  // Tamaños
  sizes: {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
  }
};

// Variantes de Alertas
export const ALERT_VARIANTS = {
  // Estilos base
  base: `
    p-4 rounded-lg border flex items-start space-x-3
    transition-all duration-200
  `,

  // Variantes de tipo
  variants: {
    info: `
      bg-brand-50 border-brand-200 text-brand-800
    `,

    success: `
      bg-green-50 border-green-200 text-green-800
    `,

    warning: `
      bg-yellow-50 border-yellow-200 text-yellow-800
    `,

    error: `
      bg-red-50 border-red-200 text-red-800
    `,

    // Alertas temáticas
    agricultural: `
      bg-brown-50 border-brown-200 text-brown-800
      border-l-4 border-l-brown-500
    `
  }
};

// Variantes de Layout
export const LAYOUT_VARIANTS = {
  // Contenedores principales
  containers: {
    page: `
      min-h-screen bg-gradient-to-br from-gray-50 to-gray-100
      transition-colors duration-300
    `,

    content: `
      max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
      space-y-6 py-6
    `,

    section: `
      bg-white rounded-xl shadow-sm border border-gray-200
      overflow-hidden
    `,

    // Layouts temáticos
    agricultural: `
      min-h-screen bg-gradient-to-br from-green-50 to-green-100
      transition-colors duration-300
    `,

    machinery: `
      min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100
      transition-colors duration-300
    `
  },

  // Grids responsivos
  grids: {
    // Grid de 1 columna en móvil, 2 en tablet, 3 en desktop
    responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    
    // Grid de 2 columnas responsivo
    twoColumns: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
    
    // Grid de 4 columnas responsivo
    fourColumns: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4',
    
    // Grid de stats/métricas
    stats: 'grid grid-cols-2 md:grid-cols-4 gap-4',
    
    // Grid de formulario
    form: 'grid grid-cols-1 md:grid-cols-2 gap-4'
  },

  // Flexbox layouts
  flex: {
    // Centrado completo
    center: 'flex items-center justify-center',
    
    // Entre elementos
    between: 'flex items-center justify-between',
    
    // Columna centrada
    column: 'flex flex-col items-center',
    
    // Horizontal con espacio
    horizontal: 'flex items-center space-x-4',
    
    // Vertical con espacio
    vertical: 'flex flex-col space-y-4',
    
    // Wrap responsivo
    wrap: 'flex flex-wrap items-center gap-4'
  }
};

// Estados de loading
export const LOADING_VARIANTS = {
  // Spinners
  spinner: {
    base: 'animate-spin rounded-full border-2 border-gray-200',
    
    variants: {
  primary: 'border-t-brand-700',
  success: 'border-t-brown-700',
      warning: 'border-t-yellow-600',
  agricultural: 'border-t-brown-600'
    },
    
    sizes: {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    }
  },

  // Skeletons
  skeleton: {
    base: 'animate-pulse bg-gray-200 rounded',
    
    variants: {
      text: 'h-4 bg-gray-200 rounded',
      title: 'h-6 bg-gray-200 rounded',
      avatar: 'w-10 h-10 bg-gray-200 rounded-full',
      card: 'h-32 bg-gray-200 rounded-lg'
    }
  }
};

// Export principal
export const COMPONENT_VARIANTS = {
  button: BUTTON_VARIANTS,
  card: CARD_VARIANTS,
  input: INPUT_VARIANTS,
  badge: BADGE_VARIANTS,
  alert: ALERT_VARIANTS,
  layout: LAYOUT_VARIANTS,
  loading: LOADING_VARIANTS
};
