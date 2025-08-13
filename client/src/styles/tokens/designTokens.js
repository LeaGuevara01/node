/**
 * Sistema de Design Tokens para la Aplicación Agrícola
 * Centraliza todos los valores de diseño para mantener consistencia
 */

// Paleta de colores base
export const COLORS = {
  // Colores primarios del sistema
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Principal
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Colores de éxito (verde)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Principal
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Colores de advertencia (amarillo/naranja)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Principal
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Colores de error (rojo)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Principal
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Colores neutros (grises)
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Tema Agrícola Especializado
  agricultural: {
    // Verde tierra/cultivos
    earth: {
      50: '#f7f8f4',
      100: '#eef0e8',
      200: '#dde1d2',
      300: '#c6cdb4',
      400: '#a8b18f',
      500: '#8b966e', // Verde tierra principal
      600: '#6f7a56',
      700: '#5a6246',
      800: '#484f3b',
      900: '#3d4233',
    },

    // Verde cultivos/cosecha
    crop: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e', // Verde cultivo principal
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },

    // Azul cielo/agua
    sky: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Azul cielo principal
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },

    // Dorado maquinaria/herramientas
    machinery: {
      50: '#fefce8',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b', // Dorado maquinaria principal
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },

    // Marrón tierra/suelo
    soil: {
      50: '#fdf8f6',
      100: '#f2e8e5',
      200: '#eaddd7',
      300: '#e0cec7',
      400: '#d2bab0',
      500: '#bfa094', // Marrón tierra principal
      600: '#a08072',
      700: '#8b6f5e',
      800: '#74614f',
      900: '#5d4e43',
    },
  },
};

// Espaciado estandarizado
export const SPACING = {
  // Espaciado en rem (base 16px)
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  '3xl': '2.5rem', // 40px
  '4xl': '3rem', // 48px
  '5xl': '4rem', // 64px
  '6xl': '5rem', // 80px

  // Espaciado de contenedores
  container: {
    xs: '1rem',
    sm: '1.5rem',
    md: '2rem',
    lg: '3rem',
    xl: '4rem',
  },

  // Espaciado de componentes
  component: {
    padding: {
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
      xl: '1.25rem 2.5rem',
    },
    margin: {
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
  },
};

// Tipografía
export const TYPOGRAPHY = {
  // Tamaños de fuente
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
    '6xl': '3.75rem', // 60px
  },

  // Pesos de fuente
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Altura de línea
  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Familias de fuente
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    serif: ['Georgia', 'Cambria', 'serif'],
    mono: ['Monaco', 'Menlo', 'monospace'],
    display: ['Poppins', 'system-ui', 'sans-serif'],
  },
};

// Sombras
export const SHADOWS = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

  // Sombras temáticas
  agricultural: {
    card: '0 4px 6px -1px rgb(34 197 94 / 0.1), 0 2px 4px -2px rgb(34 197 94 / 0.1)',
    hover: '0 10px 15px -3px rgb(34 197 94 / 0.1), 0 4px 6px -4px rgb(34 197 94 / 0.1)',
    focus: '0 0 0 3px rgb(34 197 94 / 0.1)',
  },
};

// Bordes y radios
export const BORDERS = {
  width: {
    0: '0px',
    1: '1px',
    2: '2px',
    4: '4px',
    8: '8px',
  },

  radius: {
    none: '0px',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Estilos de borde
  style: {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    double: 'double',
    none: 'none',
  },
};

// Animaciones y transiciones
export const ANIMATIONS = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },

  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Transiciones predefinidas
  transition: {
    all: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors:
      'color 200ms cubic-bezier(0.4, 0, 0.2, 1), background-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    shadow: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// Breakpoints para responsive design
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Z-index estándar
export const Z_INDEX = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  // Componentes específicos
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modalBackdrop: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
  notification: '1080',
};

// Iconografía temática agrícola
export const AGRICULTURAL_ICONS = {
  entities: {
    maquinarias: '🚜',
    repuestos: '🔧',
    proveedores: '🏭',
    reparaciones: '🛠️',
    usuarios: '👤',
  },

  status: {
    operativa: '✅',
    mantenimiento: '🔧',
    inactiva: '❌',
    reparacion: '🛠️',
    disponible: '✅',
    agotado: '❌',
    bajo: '⚠️',
  },

  actions: {
    crear: '➕',
    editar: '✏️',
    eliminar: '🗑️',
    ver: '👁️',
    guardar: '💾',
    cancelar: '❌',
    buscar: '🔍',
    filtrar: '🔽',
    exportar: '📤',
    importar: '📥',
  },

  general: {
    home: '🏠',
    dashboard: '📊',
    settings: '⚙️',
    notification: '🔔',
    help: '❓',
    logout: '🚪',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
  },
};

// Gradientes predefinidos
export const GRADIENTS = {
  agricultural: {
    primary: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    earth: 'linear-gradient(135deg, #8b966e 0%, #6f7a56 100%)',
    sky: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    machinery: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    sunset: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    forest: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
  },

  backgrounds: {
    light: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    subtle: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    warm: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
    cool: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
  },
};

// Configuración de componentes por defecto
export const COMPONENT_DEFAULTS = {
  button: {
    padding: SPACING.component.padding.md,
    borderRadius: BORDERS.radius.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    transition: ANIMATIONS.transition.all,
  },

  card: {
    padding: SPACING.xl,
    borderRadius: BORDERS.radius.xl,
    shadow: SHADOWS.base,
    backgroundColor: '#ffffff',
    border: `${BORDERS.width[1]} solid ${COLORS.neutral[200]}`,
  },

  input: {
    padding: SPACING.component.padding.md,
    borderRadius: BORDERS.radius.md,
    fontSize: TYPOGRAPHY.fontSize.base,
    border: `${BORDERS.width[1]} solid ${COLORS.neutral[300]}`,
    focusBorder: `${BORDERS.width[2]} solid ${COLORS.agricultural.crop[500]}`,
  },
};

// Export del objeto completo de tokens
export const DESIGN_TOKENS = {
  colors: COLORS,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  shadows: SHADOWS,
  borders: BORDERS,
  animations: ANIMATIONS,
  breakpoints: BREAKPOINTS,
  zIndex: Z_INDEX,
  icons: AGRICULTURAL_ICONS,
  gradients: GRADIENTS,
  defaults: COMPONENT_DEFAULTS,
};
