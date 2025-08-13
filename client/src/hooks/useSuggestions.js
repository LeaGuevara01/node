/**
 * useSuggestions - Hook para manejar sugerencias en filtros
 *
 * Proporciona funcionalidad de autocompletado con sugerencias
 * basadas en datos existentes
 *
 * @param {Array} data - Datos fuente para generar sugerencias
 * @param {Object} fieldConfig - Configuración de campos con sugerencias
 */

import { useState, useMemo, useCallback } from 'react';

const useSuggestions = (data = [], fieldConfig = {}) => {
  const [activeSuggestions, setActiveSuggestions] = useState({});
  const [suggestionInputs, setSuggestionInputs] = useState({});

  // Generar sugerencias por campo basadas en datos
  const generateSuggestions = useCallback(
    (fieldKey, inputValue = '') => {
      if (!data || !Array.isArray(data) || inputValue.length === 0) {
        return [];
      }

      const config = fieldConfig[fieldKey];
      if (!config || !config.getSuggestions) {
        return [];
      }

      try {
        return config.getSuggestions(inputValue, data);
      } catch (error) {
        console.error(`Error generating suggestions for field ${fieldKey}:`, error);
        return [];
      }
    },
    [data, fieldConfig]
  );

  // Mostrar sugerencias para un campo
  const showSuggestions = useCallback((fieldKey) => {
    setActiveSuggestions((prev) => ({
      ...prev,
      [fieldKey]: true,
    }));
  }, []);

  // Ocultar sugerencias para un campo
  const hideSuggestions = useCallback((fieldKey) => {
    // Delay para permitir click en sugerencias
    setTimeout(() => {
      setActiveSuggestions((prev) => ({
        ...prev,
        [fieldKey]: false,
      }));
    }, 200);
  }, []);

  // Ocultar todas las sugerencias
  const hideAllSuggestions = useCallback(() => {
    setActiveSuggestions({});
  }, []);

  // Manejar click en sugerencia
  const handleSuggestionClick = useCallback(
    (fieldKey, suggestion, onFilterChange) => {
      // Actualizar el valor del input
      setSuggestionInputs((prev) => ({
        ...prev,
        [fieldKey]: suggestion,
      }));

      // Notificar cambio de filtro
      if (onFilterChange) {
        onFilterChange(fieldKey, suggestion);
      }

      // Ocultar sugerencias
      hideSuggestions(fieldKey);
    },
    [hideSuggestions]
  );

  // Manejar cambio en input de texto
  const handleInputChange = useCallback(
    (fieldKey, value, onFilterChange) => {
      // Actualizar valor local
      setSuggestionInputs((prev) => ({
        ...prev,
        [fieldKey]: value,
      }));

      // Notificar cambio de filtro
      if (onFilterChange) {
        onFilterChange(fieldKey, value);
      }

      // Mostrar/ocultar sugerencias según el valor
      const hasConfig = fieldConfig[fieldKey] && fieldConfig[fieldKey].getSuggestions;
      if (hasConfig && value.length > 0) {
        showSuggestions(fieldKey);
      } else {
        hideSuggestions(fieldKey);
      }
    },
    [fieldConfig, showSuggestions, hideSuggestions]
  );

  // Resetear todas las sugerencias
  const resetSuggestions = useCallback(() => {
    setSuggestionInputs({});
    setActiveSuggestions({});
  }, []);

  // Obtener valor del input para un campo
  const getInputValue = useCallback(
    (fieldKey, fallbackValue = '') => {
      return suggestionInputs[fieldKey] !== undefined ? suggestionInputs[fieldKey] : fallbackValue;
    },
    [suggestionInputs]
  );

  // Verificar si un campo tiene sugerencias activas
  const hasSuggestions = useCallback(
    (fieldKey) => {
      return activeSuggestions[fieldKey] === true;
    },
    [activeSuggestions]
  );

  // Obtener sugerencias para un campo específico
  const getSuggestions = useCallback(
    (fieldKey, inputValue) => {
      return generateSuggestions(fieldKey, inputValue);
    },
    [generateSuggestions]
  );

  return {
    // Estados
    activeSuggestions,
    suggestionInputs,

    // Funciones principales
    showSuggestions,
    hideSuggestions,
    hideAllSuggestions,
    handleSuggestionClick,
    handleInputChange,
    resetSuggestions,

    // Utilidades
    getInputValue,
    hasSuggestions,
    getSuggestions,
  };
};

// Configuraciones predefinidas para diferentes tipos de campos
export const createFieldConfig = {
  // Campo de marca (para maquinarias, repuestos, etc.)
  marca: (dataFieldName = 'marca') => ({
    getSuggestions: (inputValue, data) => {
      const marcas = [
        ...new Set(
          data
            .map((item) => item[dataFieldName])
            .filter(Boolean)
            .map((marca) => marca.toString().trim())
        ),
      ];

      return marcas
        .filter((marca) => marca.toLowerCase().includes(inputValue.toLowerCase()))
        .sort()
        .slice(0, 10);
    },
  }),

  // Campo de proveedor
  proveedor: (dataFieldName = 'proveedor') => ({
    getSuggestions: (inputValue, data) => {
      const proveedores = [
        ...new Set(
          data
            .map((item) => item[dataFieldName] || item.nombreProveedor)
            .filter(Boolean)
            .map((proveedor) => proveedor.toString().trim())
        ),
      ];

      return proveedores
        .filter((proveedor) => proveedor.toLowerCase().includes(inputValue.toLowerCase()))
        .sort()
        .slice(0, 10);
    },
  }),

  // Campo de localidad/ciudad
  localidad: (dataFieldName = 'localidad') => ({
    getSuggestions: (inputValue, data) => {
      const localidades = [
        ...new Set(
          data
            .map((item) => item[dataFieldName] || item.ciudad)
            .filter(Boolean)
            .map((loc) => loc.toString().trim())
        ),
      ];

      return localidades
        .filter((localidad) => localidad.toLowerCase().includes(inputValue.toLowerCase()))
        .sort()
        .slice(0, 10);
    },
  }),

  // Campo genérico de texto
  generic: (dataFieldName, transformer = null) => ({
    getSuggestions: (inputValue, data) => {
      const values = [
        ...new Set(
          data
            .map((item) => {
              let value = item[dataFieldName];
              if (transformer && typeof transformer === 'function') {
                value = transformer(value);
              }
              return value;
            })
            .filter(Boolean)
            .map((val) => val.toString().trim())
        ),
      ];

      return values
        .filter((value) => value.toLowerCase().includes(inputValue.toLowerCase()))
        .sort()
        .slice(0, 10);
    },
  }),
};

export default useSuggestions;
