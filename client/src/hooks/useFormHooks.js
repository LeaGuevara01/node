// Shared custom hooks for form management
import { useState, useEffect } from 'react';

export const useFormState = (initialState) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const setError = (field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearErrors = () => setErrors({});

  const resetForm = () => {
    setForm(initialState);
    clearErrors();
  };

  return {
    form,
    setForm,
    errors,
    loading,
    setLoading,
    updateField,
    setError,
    clearErrors,
    resetForm
  };
};

export const useFilterState = (initialFilters) => {
  const [filtros, setFiltros] = useState(initialFilters);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const handleFiltroChange = (campo, valor, onFilterChange) => {
    const nuevosFiltros = { ...filtros, [campo]: valor };
    setFiltros(nuevosFiltros);

    if (campo === 'search' && onFilterChange) {
      if (searchTimeout) clearTimeout(searchTimeout);
      setSearchTimeout(setTimeout(() => {
        onFilterChange(nuevosFiltros, 1);
      }, 300));
    } else if (onFilterChange) {
      onFilterChange(nuevosFiltros, 1);
    }
  };

  const limpiarFiltros = (defaultFilters, onFilterChange) => {
    setFiltros(defaultFilters);
    if (onFilterChange) {
      onFilterChange(defaultFilters, 1);
    }
  };

  return {
    filtros,
    setFiltros,
    handleFiltroChange,
    limpiarFiltros
  };
};

export const usePagination = () => {
  const [paginacion, setPaginacion] = useState({
    current: 1,
    total: 1,
    totalItems: 0
  });

  const handlePaginacion = (nuevaPagina, onPageChange) => {
    if (onPageChange) {
      onPageChange(nuevaPagina);
    }
  };

  return {
    paginacion,
    setPaginacion,
    handlePaginacion
  };
};

export const useBulkOperations = () => {
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');

  const clearBulkMessages = () => {
    setBulkError('');
    setBulkSuccess('');
  };

  return {
    bulkError,
    setBulkError,
    bulkSuccess,
    setBulkSuccess,
    clearBulkMessages
  };
};
