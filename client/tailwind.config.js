/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      // Colores personalizados del sistema agrícola
      colors: {
        // Paleta sobria, industrial
        brand: {
          50: '#f3f5f9',
          100: '#e7ebf3',
          200: '#c7cfdf',
          300: '#a3b0cb',
          400: '#6f82a7',
          500: '#4a5a84',
          600: '#36466f',
          700: '#2e406b', // azul principal solicitado
          800: '#253356',
          900: '#1b2741',
        },
        brown: {
          50: '#f8f3ef',
          100: '#efe3d6',
          200: '#e0c7af',
          300: '#caa27e',
          400: '#a97c54',
          500: '#8b5e3c', // marrón industrial
          600: '#714a31',
          700: '#5a3b28',
          800: '#482f21',
          900: '#3a261b',
        },

        // Colores agrícolas especializados
        agricultural: {
          // Verde tierra/cultivos
          earth: {
            50: '#f7f8f4',
            100: '#eef0e8',
            200: '#dde1d2',
            300: '#c6cdb4',
            400: '#a8b18f',
            500: '#8b966e',
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
            500: '#22c55e',
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
            500: '#0ea5e9',
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
            500: '#f59e0b',
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
            500: '#bfa094',
            600: '#a08072',
            700: '#8b6f5e',
            800: '#74614f',
            900: '#5d4e43',
          },
        },
      },

      // Familias de fuente
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['Monaco', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },

      // Espaciado adicional
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem',
        144: '36rem',
      },

      // Sombras personalizadas
      boxShadow: {
        agricultural:
          '0 4px 6px -1px rgba(34, 197, 94, 0.1), 0 2px 4px -2px rgba(34, 197, 94, 0.1)',
        'agricultural-lg':
          '0 10px 15px -3px rgba(34, 197, 94, 0.1), 0 4px 6px -4px rgba(34, 197, 94, 0.1)',
        machinery: '0 4px 6px -1px rgba(245, 158, 11, 0.1), 0 2px 4px -2px rgba(245, 158, 11, 0.1)',
        soft: '0 2px 15px 0 rgba(0, 0, 0, 0.05)',
        glow: '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.3)',
      },

      // Animaciones personalizadas
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite alternate',
      },

      // Keyframes para animaciones
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
      },

      // Gradientes personalizados
      backgroundImage: {
        'gradient-agricultural': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'gradient-machinery': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'gradient-earth': 'linear-gradient(135deg, #8b966e 0%, #6f7a56 100%)',
        'gradient-sky': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        'gradient-forest': 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
        'gradient-light': 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        'gradient-warm': 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
        'gradient-cool': 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      },

      // Bordes personalizados
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // Z-index personalizado
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100',
      },

      // Tamaños máximos personalizados
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        '10xl': '104rem',
      },

      // Alturas personalizadas
      height: {
        128: '32rem',
        144: '36rem',
      },

      // Anchos personalizados
      width: {
        128: '32rem',
        144: '36rem',
      },
    },
  },
  plugins: [
    // Plugin para formularios (si está instalado)
    // require('@tailwindcss/forms'),

    // Plugin para tipografía (si está instalado)
    // require('@tailwindcss/typography'),

    // Plugin personalizado para utilities agrícolas
    function ({ addUtilities }) {
      const newUtilities = {
        // Utilidades para contenedores agrícolas
        '.container-industrial': {
          '@apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8': {},
        },
        // Utilidades para cards industriales
        '.card-industrial': {
          '@apply bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden': {},
        },

        // Utilidades para botones industriales
        '.btn-industrial': {
          '@apply bg-brand-700 hover:bg-brand-800 text-white px-6 py-3 rounded-lg font-medium shadow-sm transition-all duration-200':
            {},
        },

        // Utilidades para texto industrial
        '.text-industrial': {
          '@apply text-brand-700': {},
        },

        // Utilidades de animación
        '.animate-fade-in-up': {
          animation: 'fadeIn 0.3s ease-out, slideUp 0.3s ease-out',
        },

        // Utilidades para scrollbar personalizado
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': 'rgb(156 163 175) transparent',
        },

        '.scrollbar-thin::-webkit-scrollbar': {
          width: '6px',
        },

        '.scrollbar-thin::-webkit-scrollbar-track': {
          background: 'transparent',
        },

        '.scrollbar-thin::-webkit-scrollbar-thumb': {
          'background-color': 'rgb(156 163 175)',
          'border-radius': '20px',
        },

        '.scrollbar-thin::-webkit-scrollbar-thumb:hover': {
          'background-color': 'rgb(107 114 128)',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],

  // Variantes adicionales
  variants: {
    extend: {
      backgroundColor: ['active'],
      borderColor: ['active'],
      textColor: ['active'],
      scale: ['active'],
      opacity: ['disabled'],
    },
  },

  // Configuración de purge/content más específica
  safelist: [
    // Safelist para clases dinámicas de estados
    {
      pattern: /bg-(green|yellow|red|blue|orange|purple|gray)-(50|100|200)/,
    },
    {
      pattern: /text-(green|yellow|red|blue|orange|purple|gray)-(600|700|800)/,
    },
    {
      pattern: /border-(green|yellow|red|blue|orange|purple|gray)-(200|300)/,
    },
    // Safelist para animaciones
    'animate-spin',
    'animate-pulse',
    'animate-bounce',
    // Safelist para utilidades comunes
    'cursor-pointer',
    'cursor-not-allowed',
    'pointer-events-none',
  ],
};
