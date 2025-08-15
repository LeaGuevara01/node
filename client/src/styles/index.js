/**
 * Exportación central del sistema de design tokens y componentes modulares
 * Punto de acceso único para todo el sistema de diseño
 */

// Design Tokens
export { DESIGN_TOKENS } from './tokens/designTokens';
export { COMPONENT_VARIANTS } from './tokens/componentVariants';
export { VISUAL_STATUS } from './tokens/visualStatus';

// Componentes compartidos
export { default as Button } from '../components/shared/Button';
export {
  SaveButton,
  CancelButton,
  DeleteButton,
  EditButton,
  ViewButton,
  CreateButton,
  SearchButton,
  ExportButton,
  RefreshButton,
  BackButton,
  FormButtonGroup,
  ListActionGroup,
  ToggleButton,
  FloatingActionButton,
} from '../components/shared/Button';

export {
  StatusBadge,
  StatusIndicator,
  StatusFilter,
  StatusSummary,
  useStatus,
} from '../components/shared/StatusBadge';

export {
  PageContainer,
  ContentContainer,
  Section,
  ResponsiveGrid,
  FlexContainer,
  Card,
  PageHeader,
  FormLayout,
  DetailsLayout,
  ListLayout,
  ModalLayout,
  LayoutSkeleton,
  StickyHeaderLayout,
} from '../components/shared/Layout';

export {
  SmartFilterPanel,
  useSmartFilters,
  TextFilter,
  SelectFilter,
  RangeFilter,
  DateFilter,
  SavedFiltersManager,
  ActiveFiltersIndicator,
} from '../components/shared/SmartFilters';

export {
  UniversalList,
  useListData,
  ListItem,
  Pagination,
} from '../components/shared/UniversalList';

// Componente de estadísticas mejorado
export { default as StatsCard, StatsGrid, useStats } from '../components/shared/StatsCard';

// Sistema modular de estilos para páginas
export {
  PAGE_STYLES,
  PageLayout,
  ContentSection,
  LoadingState,
  EmptyState,
  Alert,
  usePageState,
  usePageNavigation,
  BREAKPOINTS,
  COLORS,
  SPACING,
  ANIMATIONS,
  classNames,
  conditionalClass,
} from './pageStyles';

// Componentes con estilos automáticos - ⚠️ DEPRECADOS
export {
  /** @deprecated Usar AppLayout + PageContainer */
  StyledPageWrapper,
  /** @deprecated Usar AppLayout directamente */
  withStyledPage,
  /** @deprecated Usar AppLayout + PageContainer */
  useStyledPage,
  /** @deprecated Usar FormLayout + componentes modulares */
  StyledForm,
  /** @deprecated Usar UniversalList + ListLayout */
  StyledList,
  /** @deprecated Usar PageContainer + StatsGrid */
  StyledDashboard,
  /** @deprecated No usar */
  applyPageStyles,
  /** @deprecated No usar */
  styledPage,
} from './styledComponents';

// Componentes de detalles existentes (migrados)
export {
  DetailsHeader,
  DetailsAlert,
  DetailsLoading,
  DetailsSection,
  FieldWithIcon,
  SimpleField,
  StatCard,
  ActionButton,
  ImageUpload,
} from '../components/shared/DetailsComponents';

// Estilos actualizados
export {
  DETAILS_CONTAINER,
  DETAILS_HEADER,
  DETAILS_SECTION,
  DETAILS_IMAGE,
  DETAILS_TAGS,
  DETAILS_STATS,
  DETAILS_ACTIONS,
  DETAILS_ICONS,
  DETAILS_ALERTS,
  DETAILS_LOADING,
} from './detailsStyles';

// Utilidades
export { STATUS_UTILS } from './tokens/visualStatus';

// Re-exportaciones para compatibilidad
export * from './tokens/designTokens';
export * from './tokens/componentVariants';
export * from './tokens/visualStatus';
