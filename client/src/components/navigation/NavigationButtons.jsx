/**
 * NavigationButtons - Componentes de botones de navegación reutilizables
 *
 * Proporciona botones estándar para navegación común:
 * - Botón de regreso
 * - Botón de ir al dashboard
 * - Botón de crear nuevo
 * - Botón de editar
 * - Botón de ver detalles
 */

import React from 'react';
import { ArrowLeft, Home, Plus, Edit, Eye, Save, X, Trash2, Download, Upload } from 'lucide-react';
import { useNavigation } from '../../hooks/useNavigation';

// Estilos base para los botones - Responsive optimizado
const BUTTON_STYLES = {
  base: 'inline-flex items-center justify-center px-3 sm:px-4 py-2 border text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 touch-manipulation',
  primary:
    'bg-blue-600 border-transparent text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800',
  secondary:
    'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 active:bg-gray-100',
  success:
    'bg-green-600 border-transparent text-white hover:bg-green-700 focus:ring-green-500 active:bg-green-800',
  danger:
    'bg-red-600 border-transparent text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800',
  warning:
    'bg-yellow-600 border-transparent text-white hover:bg-yellow-700 focus:ring-yellow-500 active:bg-yellow-800',
  ghost:
    'bg-transparent border-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500 active:bg-gray-200',
  small: 'px-2 sm:px-3 py-1.5 text-xs',
  large: 'px-4 sm:px-6 py-3 text-base sm:text-lg',
};

/**
 * Botón de regreso genérico
 */
export const BackButton = ({
  onClick,
  label = 'Volver',
  variant = 'secondary',
  size = '',
  className = '',
}) => {
  const { goBack } = useNavigation();

  const handleClick = onClick || goBack;

  return (
    <button
      onClick={handleClick}
      className={`${BUTTON_STYLES.base} ${BUTTON_STYLES[variant]} ${BUTTON_STYLES[size]} ${className}`}
    >
      <ArrowLeft size={16} className="mr-2" />
      {label}
    </button>
  );
};

/**
 * Botón para ir al dashboard
 */
export const DashboardButton = ({ variant = 'secondary', size = '', className = '' }) => {
  const { navigateToDashboard } = useNavigation();

  return (
    <button
      onClick={navigateToDashboard}
      className={`${BUTTON_STYLES.base} ${BUTTON_STYLES[variant]} ${BUTTON_STYLES[size]} ${className}`}
    >
      <Home size={16} className="mr-2" />
      Dashboard
    </button>
  );
};

/**
 * Botón para crear nuevo elemento
 */
export const CreateButton = ({
  entity,
  label,
  variant = 'primary',
  size = '',
  className = '',
  onClick,
}) => {
  const { navigateToFormPage } = useNavigation();

  const finalLabel =
    label || `Nueva ${entity ? entity.charAt(0).toUpperCase() + entity.slice(1) : 'Entrada'}`;
  const shortLabel = 'Nueva';

  return (
    <button
      onClick={onClick || (() => navigateToFormPage(entity))}
      className={`${BUTTON_STYLES.base} ${BUTTON_STYLES[variant]} ${BUTTON_STYLES[size]} ${className}`}
    >
      <Plus size={16} className="mr-2" />
      <span className="block lg:hidden">{shortLabel}</span>
      <span className="hidden lg:inline">{finalLabel}</span>
    </button>
  );
};

/**
 * Botón para editar elemento
 */
export const EditButton = ({
  entity,
  id,
  label = 'Editar',
  variant = 'secondary',
  size = '',
  className = '',
}) => {
  const { navigateToFormPage } = useNavigation();

  return (
    <button
      onClick={() => navigateToFormPage(entity, id)}
      className={`${BUTTON_STYLES.base} ${BUTTON_STYLES[variant]} ${BUTTON_STYLES[size]} ${className}`}
    >
      <Edit size={16} className="mr-2" />
      {label}
    </button>
  );
};

/**
 * Botón para ver detalles
 */
export const ViewButton = ({
  entity,
  id,
  label = 'Ver Detalles',
  variant = 'ghost',
  size = '',
  className = '',
}) => {
  const { navigateToDetailPage } = useNavigation();

  return (
    <button
      onClick={() => navigateToDetailPage(entity, id)}
      className={`${BUTTON_STYLES.base} ${BUTTON_STYLES[variant]} ${BUTTON_STYLES[size]} ${className}`}
    >
      <Eye size={16} className="mr-2" />
      {label}
    </button>
  );
};

/**
 * Botón de guardar
 */
export const SaveButton = ({
  onClick,
  label = 'Guardar',
  loading = false,
  variant = 'success',
  size = '',
  className = '',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${BUTTON_STYLES.base} ${BUTTON_STYLES[variant]} ${BUTTON_STYLES[size]} ${className} ${
        disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      ) : (
        <Save size={16} className="mr-2" />
      )}
      {loading ? 'Guardando...' : label}
    </button>
  );
};

/**
 * Botón de cancelar
 */
export const CancelButton = ({
  onClick,
  label = 'Cancelar',
  variant = 'secondary',
  size = '',
  className = '',
}) => {
  const { goBack } = useNavigation();

  const handleClick = onClick || goBack;

  return (
    <button
      onClick={handleClick}
      className={`${BUTTON_STYLES.base} ${BUTTON_STYLES[variant]} ${BUTTON_STYLES[size]} ${className}`}
    >
      <X size={16} className="mr-2" />
      {label}
    </button>
  );
};

/**
 * Botón de eliminar
 */
export const DeleteButton = ({
  onClick,
  label = 'Eliminar',
  variant = 'danger',
  size = '',
  className = '',
  loading = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${BUTTON_STYLES.base} ${BUTTON_STYLES[variant]} ${BUTTON_STYLES[size]} ${className} ${
        loading ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      ) : (
        <Trash2 size={16} className="mr-2" />
      )}
      {loading ? 'Eliminando...' : label}
    </button>
  );
};

/**
 * Botón de exportar
 */
export const ExportButton = ({
  onClick,
  label = 'Exportar',
  variant = 'secondary',
  size = '',
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`${BUTTON_STYLES.base} ${BUTTON_STYLES[variant]} ${BUTTON_STYLES[size]} ${className}`}
    >
      <Download size={16} className="mr-2" />
      {label}
    </button>
  );
};

/**
 * Botón de importar
 */
export const ImportButton = ({
  onClick,
  label = 'Importar',
  variant = 'secondary',
  size = '',
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`${BUTTON_STYLES.base} ${BUTTON_STYLES[variant]} ${BUTTON_STYLES[size]} ${className}`}
    >
      <Upload size={16} className="mr-2" />
      {label}
    </button>
  );
};

/**
 * Grupo de botones de acción comunes
 */
export const ActionButtonGroup = ({
  entity,
  id,
  showEdit = true,
  showDelete = true,
  showView = true,
  onDelete,
  className = '',
  size = 'small',
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showView && <ViewButton entity={entity} id={id} size={size} />}
      {showEdit && <EditButton entity={entity} id={id} size={size} />}
      {showDelete && <DeleteButton onClick={() => onDelete(id)} size={size} />}
    </div>
  );
};
