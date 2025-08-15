/**
 * TextInputWithSuggestions - Campo de texto con sugerencias desplegables
 *
 * Componente reutilizable que muestra sugerencias basadas en datos existentes
 *
 * @param {string} value - Valor actual del input
 * @param {Function} onChange - Callback cuando cambia el valor
 * @param {string} placeholder - Placeholder del input
 * @param {Array} suggestions - Lista de sugerencias
 * @param {Function} onSuggestionClick - Callback cuando se hace click en una sugerencia
 * @param {boolean} showSuggestions - Si mostrar las sugerencias
 * @param {Function} onFocus - Callback al hacer focus
 * @param {Function} onBlur - Callback al perder focus
 * @param {string} className - Clases CSS adicionales
 */

import React, { useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const TextInputWithSuggestions = ({
  value = '',
  onChange,
  placeholder = '',
  suggestions = [],
  onSuggestionClick,
  showSuggestions = false,
  onFocus,
  onBlur,
  className = '',
  maxSuggestions = 8,
  emptyMessage = 'No se encontraron sugerencias',
}) => {
  const inputRef = useRef(null);

  const handleSuggestionClick = (suggestion, event) => {
    event.preventDefault();
    event.stopPropagation();

    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }

    // Mantener focus en el input después de seleccionar
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const limitedSuggestions = suggestions.slice(0, maxSuggestions);

  const handleInputClick = () => {
    // Mostrar sugerencias al hacer click si hay valor
    if (onFocus && value.length > 0) {
      onFocus();
    }
  };

  const handleInputFocus = () => {
    // Mostrar sugerencias al hacer focus si hay valor
    if (onFocus) {
      onFocus();
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onClick={handleInputClick}
        onFocus={handleInputFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${className}`}
        autoComplete="off"
      />

      {/* Indicador de sugerencias disponibles */}
      {!showSuggestions && suggestions.length > 0 && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      )}

      {/* Lista de sugerencias */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto z-50">
          {limitedSuggestions.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              {value.length > 0 ? emptyMessage : 'Escribe para ver sugerencias'}
            </div>
          ) : (
            limitedSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-brand-50 hover:text-brand-700 transition-colors border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-brand-50"
                onMouseDown={(e) => handleSuggestionClick(suggestion, e)}
                tabIndex={-1} // Evita navegación con tab
              >
                <div className="flex items-center">
                  <Search size={12} className="mr-2 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{suggestion}</span>
                </div>
              </button>
            ))
          )}

          {/* Mostrar contador si hay más sugerencias */}
          {suggestions.length > maxSuggestions && (
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
              Mostrando {maxSuggestions} de {suggestions.length} sugerencias
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextInputWithSuggestions;
