/**
 * Componentes compartidos para páginas de detalles
 * Rol: layout, estados y elementos reutilizables
 * Notas: prioriza composición y accesibilidad
 */
import React from 'react';
import {
  DETAILS_CONTAINER,
  DETAILS_HEADER,
  DETAILS_SECTION,
  DETAILS_IMAGE,
  DETAILS_TAGS,
  DETAILS_STATS,
  DETAILS_ACTIONS,
  DETAILS_ALERTS,
  DETAILS_LOADING,
} from '../../styles/detailsStyles';
import { COMMON_ICONS } from '../../utils/detailsUtils.jsx';

// Header con botón de volver
export const DetailsHeader = ({ title, onBack, backTooltip = 'Volver' }) => {
  return (
    <div className={`${DETAILS_CONTAINER.card} ${DETAILS_CONTAINER.cardPadding}`}>
      <div className={DETAILS_HEADER.container}>
        <button onClick={onBack} className={DETAILS_HEADER.backButton} title={backTooltip}>
          {COMMON_ICONS.back}
        </button>
        <h1 className={DETAILS_HEADER.title}>{title}</h1>
      </div>
    </div>
  );
};

// Alertas de estado
export const DetailsAlert = ({ type = 'info', children }) => {
  return <div className={DETAILS_ALERTS[type]}>{children}</div>;
};

// Estado de carga
export const DetailsLoading = ({ message = 'Cargando...' }) => {
  return (
    <div className={`${DETAILS_CONTAINER.main} ${DETAILS_LOADING.container}`}>
      <div className={DETAILS_LOADING.content}>
        <svg className={DETAILS_LOADING.spinner} fill="none" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            className="opacity-25"
          ></circle>
          <path
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            className="opacity-75"
          ></path>
        </svg>
        {message}
      </div>
    </div>
  );
};

// Sección con título
export const DetailsSection = ({ title, children, className }) => {
  return (
    <div
      className={`${DETAILS_CONTAINER.card} ${DETAILS_CONTAINER.cardPadding} ${className || ''}`}
    >
      <h3 className={DETAILS_SECTION.title}>{title}</h3>
      {children}
    </div>
  );
};

// Campo con icono
export const FieldWithIcon = ({ label, value, icon, link, className = '' }) => {
  if (!value) return null;

  const content = (
    <div className={DETAILS_SECTION.fieldWithIcon}>
      {icon}
      {link ? (
        <a href={link} className="text-blue-600 hover:text-blue-800 ml-2">
          {value}
        </a>
      ) : (
        <span className="ml-2">{value}</span>
      )}
    </div>
  );

  return (
    <div className={className}>
      <label className={DETAILS_SECTION.fieldLabel}>{label}</label>
      {content}
    </div>
  );
};

// Campo simple
export const SimpleField = ({ label, value, className = '' }) => {
  if (!value) return null;

  return (
    <div className={className}>
      <label className={DETAILS_SECTION.fieldLabel}>{label}</label>
      <div className={DETAILS_SECTION.field}>{value}</div>
    </div>
  );
};

// Tarjeta de estadística
export const StatCard = ({ value, label, bgColor = 'bg-blue-50', textColor = 'text-blue-600' }) => {
  return (
    <div className={`text-center p-4 ${bgColor} rounded-lg`}>
      <div className={`text-2xl font-bold ${textColor}`}>{value || 0}</div>
      <div className={`text-sm ${textColor}`}>{label}</div>
    </div>
  );
};

// Botón de acción
export const ActionButton = ({ onClick, type = 'secondary', icon, children, className = '' }) => {
  const baseClasses = `${DETAILS_ACTIONS.button} ${DETAILS_ACTIONS[type]} ${className}`;

  return (
    <button onClick={onClick} className={baseClasses}>
      {icon}
      {children}
    </button>
  );
};

// Imagen con upload
export const ImageUpload = ({
  image,
  alt,
  onUpload,
  uploading = false,
  accept = 'image/*',
  maxSize = '5MB',
}) => {
  return (
    <div className="space-y-4">
      <div className={DETAILS_IMAGE.container}>
        {image ? (
          <img src={image} alt={alt} className={DETAILS_IMAGE.image} />
        ) : (
          <div className={DETAILS_IMAGE.placeholder}>
            <div className={DETAILS_IMAGE.placeholderContent}>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m14 0V9a2 2 0 00-2-2M9 7h6m-6 4h6m-6 4h6m-6 4h6"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">Sin imagen</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block">
          <span className="sr-only">Elegir imagen</span>
          <input
            type="file"
            accept={accept}
            onChange={onUpload}
            className={DETAILS_IMAGE.upload}
            disabled={uploading}
          />
        </label>
        <p className={DETAILS_IMAGE.uploadText}>PNG, JPG hasta {maxSize}</p>
      </div>

      {uploading && (
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            ></circle>
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              className="opacity-75"
            ></path>
          </svg>
          <span className="text-sm text-gray-600">Subiendo imagen...</span>
        </div>
      )}
    </div>
  );
};
