import { ICON_STYLES } from '../styles/repuestoStyles';

/**
 * Configuraciones de filtros para diferentes entidades
 */

// Iconos reutilizables
const ICONS = {
  search: (
    <svg
      className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  categoria: (
    <svg
      className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  ),
  ubicacion: (
    <svg
      className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  estado: (
    <svg
      className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  anio: (
    <svg
      className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  codigo: (
    <svg
      className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
    </svg>
  ),
  disponibilidad: (
    <svg
      className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  ),
  precio: (
    <svg
      className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
      />
    </svg>
  ),
  nombre: (
    <svg
      className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  contacto: (
    <svg
      className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  ),
  fecha: (
    <svg
      className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  tipo: (
    <svg
      className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  prioridad: (
    <svg
      className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
};

/**
 * Configuración de filtros para Maquinarias
 */
export const MAQUINARIA_FILTERS_CONFIG = (opcionesFiltros) => [
  {
    name: 'search',
    type: 'search',
    placeholder: 'Buscar maquinarias...',
    icon: ICONS.search,
    // En md (2 columnas) debe ocupar todo el ancho => col-span-2
    span: 'sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2',
  },
  // Nuevo: búsqueda por modelo (1x1) para la grilla 2x2
  {
    name: 'modelo',
    type: 'text',
    placeholder: 'Modelo... ',
    icon: ICONS.search,
    span: 'sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1',
  },
  {
    name: 'categoria',
    type: 'select',
    placeholder: 'Todas las categorías',
    icon: ICONS.categoria,
    options: opcionesFiltros.categorias || [],
    // En md queremos 2x2 => cada select ocupa 1 columna
    span: 'sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1',
  },
  {
    name: 'ubicacion',
    type: 'select',
    placeholder: 'Todas las ubicaciones',
    icon: ICONS.ubicacion,
    options: opcionesFiltros.ubicaciones || [],
    span: 'sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1',
  },
  {
    name: 'estado',
    type: 'select',
    placeholder: 'Todos los estados',
    icon: ICONS.estado,
    options: opcionesFiltros.estados || [],
    span: 'sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1',
  },
  {
    name: 'anio',
    type: 'range',
    icon: ICONS.anio,
    minField: 'anioMin',
    maxField: 'anioMax',
    minPlaceholder: 'Año mínimo',
    maxPlaceholder: 'Año máximo',
    responsivePlaceholders: {
      min: { sm: 'Mín', md: 'Mínimo', lg: 'Año mínimo' },
      max: { sm: 'Máx', md: 'Máximo', lg: 'Año máximo' },
    },
    min: opcionesFiltros.anioRange?.min || 1900,
    max: opcionesFiltros.anioRange?.max || new Date().getFullYear(),
    // Indica que los valores del rango son numéricos
    valueType: 'number',
    // Mover min/max a una fila dedicada (2x1), como en repuestos
    span: 'sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2',
  },
];

/**
 * Configuración de filtros para Repuestos
 */
export const REPUESTO_FILTERS_CONFIG = (opcionesFiltros) => [
  {
    name: 'search',
    type: 'search',
    placeholder: 'Buscar repuestos...',
    icon: ICONS.search,
    // Buscar 2x1: en grid de 2 cols desde sm ocupa 2 columnas
    span: 'sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2',
  },
  {
    name: 'codigo',
    type: 'text',
    placeholder: 'Código del repuesto...',
    icon: ICONS.codigo,
    // Código 1x1
    span: 'sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1',
  },
  {
    name: 'categoria',
    type: 'select',
    placeholder: 'Todas las categorías',
    icon: ICONS.categoria,
    options: opcionesFiltros.categorias || [],
    // Parte del 2x2
    span: 'sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1',
  },
  {
    name: 'ubicacion',
    type: 'select',
    placeholder: 'Todas las ubicaciones',
    icon: ICONS.ubicacion,
    options: opcionesFiltros.ubicaciones || [],
    // Parte del 2x2
    span: 'sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1',
  },
  {
    name: 'disponibilidad',
    type: 'select',
    placeholder: 'Toda disponibilidad',
    icon: ICONS.disponibilidad,
    options: opcionesFiltros.disponibilidades || [],
    // Parte del 2x2
    span: 'sm:col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1',
  },
  {
    name: 'precio',
    type: 'range',
    icon: ICONS.precio,
    minField: 'precioMin',
    maxField: 'precioMax',
    minPlaceholder: 'Precio mínimo',
    maxPlaceholder: 'Precio máximo',
    min: opcionesFiltros.precioRange?.min ?? 0,
    max: opcionesFiltros.precioRange?.max ?? 10000,
    step: '0.01',
    inputType: 'number',
    // Precio min/max 2x1
    span: 'sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2',
  },
];

/**
 * Configuración de filtros para Proveedores
 */
export const PROVEEDOR_FILTERS_CONFIG = (opcionesFiltros) => [
  {
    name: 'search',
    type: 'search',
    placeholder: 'Buscar proveedores...',
    icon: ICONS.search,
    span: 'sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2',
  },
  {
    name: 'nombre',
    type: 'text',
    placeholder: 'Nombre del proveedor...',
    icon: ICONS.nombre,
  },
  {
    name: 'contacto',
    type: 'text',
    placeholder: 'Email o teléfono...',
    icon: ICONS.contacto,
  },
];

/**
 * Configuración de filtros para Reparaciones
 */
export const REPARACION_FILTERS_CONFIG = (opcionesFiltros) => [
  {
    name: 'search',
    type: 'search',
    placeholder: 'Buscar reparaciones...',
    icon: ICONS.search,
    span: 'sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2',
  },
  {
    name: 'tipo',
    type: 'select',
    placeholder: 'Todos los tipos',
    icon: ICONS.tipo,
    options: opcionesFiltros.tipos || [],
  },
  {
    name: 'estado',
    type: 'select',
    placeholder: 'Todos los estados',
    icon: ICONS.estado,
    options: opcionesFiltros.estados || [],
  },
  {
    name: 'prioridad',
    type: 'select',
    placeholder: 'Todas las prioridades',
    icon: ICONS.prioridad,
    options: opcionesFiltros.prioridades || [],
  },
  {
    name: 'fecha',
    type: 'range',
    icon: ICONS.fecha,
    minField: 'fechaMin',
    maxField: 'fechaMax',
    minPlaceholder: 'Desde',
    maxPlaceholder: 'Hasta',
    inputType: 'date',
    responsivePlaceholders: {
      min: { sm: 'Desde', md: 'Fecha desde', lg: 'Fecha desde' },
      max: { sm: 'Hasta', md: 'Fecha hasta', lg: 'Fecha hasta' },
    },
    min: '2000-01-01',
    max: '2100-12-31',
    span: 'sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2',
  },
];

/**
 * Configuración de filtros para Usuarios
 */
export const USUARIO_FILTERS_CONFIG = (opcionesFiltros) => [
  {
    name: 'search',
    type: 'search',
    placeholder: 'Buscar usuarios...',
    icon: ICONS.search,
    span: 'sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-2',
  },
  {
    name: 'nombre',
    type: 'text',
    placeholder: 'Nombre del usuario...',
    icon: ICONS.nombre,
  },
  {
    name: 'email',
    type: 'text',
    placeholder: 'Email...',
    icon: ICONS.contacto,
  },
  {
    name: 'rol',
    type: 'select',
    placeholder: 'Todos los roles',
    icon: ICONS.estado,
    options: opcionesFiltros.roles || [],
  },
  {
    name: 'estado',
    type: 'select',
    placeholder: 'Todos los estados',
    icon: ICONS.estado,
    options: opcionesFiltros.estados || [],
  },
];

export default {
  MAQUINARIA_FILTERS_CONFIG,
  REPUESTO_FILTERS_CONFIG,
  PROVEEDOR_FILTERS_CONFIG,
  REPARACION_FILTERS_CONFIG,
  USUARIO_FILTERS_CONFIG,
};
