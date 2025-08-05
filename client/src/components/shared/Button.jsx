/**
 * Componente Universal de Button
 * Sistema unificado de botones con variantes, tamaños y estados
 */

import React, { forwardRef } from 'react';
import { COMPONENT_VARIANTS } from '../../styles/tokens/componentVariants';

/**
 * Componente Button Universal
 * 
 * @param {Object} props
 * @param {string} props.variant - Variante del botón (primary, success, warning, etc.)
 * @param {string} props.size - Tamaño del botón (xs, sm, md, lg, xl)
 * @param {boolean} props.loading - Estado de carga
 * @param {boolean} props.disabled - Estado deshabilitado
 * @param {React.ReactNode} props.icon - Icono del botón
 * @param {string} props.iconPosition - Posición del icono (left, right)
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {string} props.className - Clases CSS adicionales
 * @param {function} props.onClick - Función de click
 * @param {string} props.type - Tipo del botón (button, submit, reset)
 * @param {Object} props.ref - Referencia del botón
 */
const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const { base, variants, sizes, states } = COMPONENT_VARIANTS.button;

  // Construir clases CSS
  const buttonClasses = `
    ${base}
    ${variants[variant] || variants.primary}
    ${sizes[size] || sizes.md}
    ${loading ? states.loading : ''}
    ${(disabled && !loading) ? states.disabled : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Manejar click
  const handleClick = (e) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  // Icono de loading
  const LoadingIcon = () => (
    <svg 
      className="w-4 h-4 animate-spin" 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4" 
        className="opacity-25"
      />
      <path 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" 
        className="opacity-75"
      />
    </svg>
  );

  // Renderizar contenido
  const renderContent = () => {
    const iconElement = loading ? <LoadingIcon /> : icon;
    const hasIcon = iconElement && !loading;
    const hasLoadingIcon = loading;

    return (
      <>
        {/* Icono izquierdo */}
        {(hasIcon && iconPosition === 'left') && (
          <span className={children ? 'mr-2' : ''}>
            {iconElement}
          </span>
        )}
        
        {/* Icono de loading */}
        {hasLoadingIcon && (
          <span className={children ? 'mr-2' : ''}>
            <LoadingIcon />
          </span>
        )}

        {/* Texto del botón */}
        {children && (
          <span>
            {children}
          </span>
        )}

        {/* Icono derecho */}
        {(hasIcon && iconPosition === 'right') && (
          <span className={children ? 'ml-2' : ''}>
            {iconElement}
          </span>
        )}
      </>
    );
  };

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-label={loading ? 'Cargando...' : props['aria-label']}
      {...props}
    >
      {renderContent()}
    </button>
  );
});

Button.displayName = 'Button';

/**
 * Variantes predefinidas para casos comunes
 */

// Botón de guardar
export const SaveButton = ({ loading, ...props }) => (
  <Button
    variant="success"
    icon={loading ? null : '💾'}
    loading={loading}
    {...props}
  >
    {loading ? 'Guardando...' : 'Guardar'}
  </Button>
);

// Botón de cancelar
export const CancelButton = (props) => (
  <Button
    variant="secondary"
    icon="❌"
    {...props}
  >
    Cancelar
  </Button>
);

// Botón de eliminar
export const DeleteButton = ({ loading, ...props }) => (
  <Button
    variant="danger"
    icon={loading ? null : '🗑️'}
    loading={loading}
    {...props}
  >
    {loading ? 'Eliminando...' : 'Eliminar'}
  </Button>
);

// Botón de editar
export const EditButton = (props) => (
  <Button
    variant="secondary"
    icon="✏️"
    {...props}
  >
    Editar
  </Button>
);

// Botón de ver detalles
export const ViewButton = (props) => (
  <Button
    variant="ghost"
    icon="👁️"
    {...props}
  >
    Ver Detalles
  </Button>
);

// Botón de crear nuevo
export const CreateButton = (props) => (
  <Button
    variant="agricultural"
    icon="➕"
    {...props}
  >
    Crear Nuevo
  </Button>
);

// Botón de buscar
export const SearchButton = ({ loading, ...props }) => (
  <Button
    variant="primary"
    icon={loading ? null : '🔍'}
    loading={loading}
    {...props}
  >
    {loading ? 'Buscando...' : 'Buscar'}
  </Button>
);

// Botón de exportar
export const ExportButton = ({ loading, ...props }) => (
  <Button
    variant="machinery"
    icon={loading ? null : '📤'}
    loading={loading}
    size="sm"
    {...props}
  >
    {loading ? 'Exportando...' : 'Exportar'}
  </Button>
);

// Botón de refrescar
export const RefreshButton = ({ loading, ...props }) => (
  <Button
    variant="ghost"
    icon={loading ? null : '🔄'}
    loading={loading}
    size="sm"
    {...props}
  >
    {loading ? 'Actualizando...' : 'Actualizar'}
  </Button>
);

// Botón de volver
export const BackButton = (props) => (
  <Button
    variant="ghost"
    icon="←"
    size="sm"
    {...props}
  >
    Volver
  </Button>
);

/**
 * Grupo de botones para formularios
 */
export const FormButtonGroup = ({
  onSave,
  onCancel,
  onDelete,
  saveLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  deleteLabel = 'Eliminar',
  loading = false,
  disabled = false,
  showDelete = false,
  className = ''
}) => {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {/* Botón principal (Guardar) */}
      <SaveButton
        onClick={onSave}
        loading={loading}
        disabled={disabled}
      >
        {saveLabel}
      </SaveButton>

      {/* Botón secundario (Cancelar) */}
      <CancelButton
        onClick={onCancel}
        disabled={loading}
      >
        {cancelLabel}
      </CancelButton>

      {/* Botón de eliminar (opcional) */}
      {showDelete && (
        <DeleteButton
          onClick={onDelete}
          disabled={loading}
        >
          {deleteLabel}
        </DeleteButton>
      )}
    </div>
  );
};

/**
 * Grupo de botones para acciones de listado
 */
export const ListActionGroup = ({
  onEdit,
  onDelete,
  onView,
  showEdit = true,
  showDelete = true,
  showView = true,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {showView && (
        <ViewButton
          onClick={onView}
          disabled={disabled}
          size="sm"
        />
      )}
      
      {showEdit && (
        <EditButton
          onClick={onEdit}
          disabled={disabled}
          size="sm"
        />
      )}
      
      {showDelete && (
        <DeleteButton
          onClick={onDelete}
          disabled={disabled}
          size="sm"
        />
      )}
    </div>
  );
};

/**
 * Toggle Button (botón de alternancia)
 */
export const ToggleButton = ({
  active = false,
  activeVariant = 'agricultural',
  inactiveVariant = 'secondary',
  children,
  ...props
}) => {
  return (
    <Button
      variant={active ? activeVariant : inactiveVariant}
      {...props}
    >
      {children}
    </Button>
  );
};

/**
 * Floating Action Button
 */
export const FloatingActionButton = ({
  icon = '➕',
  position = 'bottom-right',
  ...props
}) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6'
  };

  return (
    <Button
      variant="agricultural"
      size="lg"
      className={`
        ${positionClasses[position]}
        rounded-full shadow-lg hover:shadow-xl
        z-50 animate-float
      `}
      icon={icon}
      {...props}
    />
  );
};

export default Button;
