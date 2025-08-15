import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar paginación
 * @param {Object} initialPagination - Configuración inicial de paginación
 * @param {Function} fetchDataFunction - Función para obtener datos paginados
 */
export const usePagination = (initialPagination = {}, fetchDataFunction) => {
  const [paginacion, setPaginacion] = useState({
    current: 1,
    total: 1,
    totalItems: 0,
    limit: 10,
    ...initialPagination,
  });

  const [loading, setLoading] = useState(false);

  /**
   * Maneja el cambio de página
   */
  const handlePaginacion = useCallback(
    (nuevaPagina) => {
      if (fetchDataFunction) {
        fetchDataFunction(undefined, nuevaPagina);
      }
    },
    [fetchDataFunction]
  );

  /**
   * Actualiza los datos de paginación
   */
  const actualizarPaginacion = useCallback((nuevaPaginacion) => {
    setPaginacion((prev) => ({
      ...prev,
      ...nuevaPaginacion,
    }));
  }, []);

  /**
   * Resetea la paginación a la primera página
   */
  const resetearPaginacion = useCallback(() => {
    setPaginacion((prev) => ({
      ...prev,
      current: 1,
    }));
  }, []);

  /**
   * Calcula el rango de elementos mostrados
   */
  const calcularRango = useCallback(() => {
    const inicio = (paginacion.current - 1) * paginacion.limit + 1;
    const fin = Math.min(paginacion.current * paginacion.limit, paginacion.totalItems);
    return { inicio, fin };
  }, [paginacion]);

  return {
    paginacion,
    loading,
    setLoading,
    handlePaginacion,
    actualizarPaginacion,
    resetearPaginacion,
    calcularRango,
  };
};

export default usePagination;
