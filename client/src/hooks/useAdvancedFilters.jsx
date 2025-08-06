import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar filtros avanzados con sistema de tokens
 * @param {Object} initialFilters - Filtros iniciales
 * @param {Function} fetchDataFunction - Función para obtener datos filtrados
 * @param {Function} fetchOptionsFunction - Función para obtener opciones de filtros
 */
export const useAdvancedFilters = (initialFilters = {}, fetchDataFunction, fetchOptionsFunction) => {
  // Estados para filtros con sistema de tokens
  const [filtrosTemporales, setFiltrosTemporales] = useState({
    search: '',
    categoria: '',
    ubicacion: '',
    estado: '',
    anioMin: '',
    anioMax: '',
    ...initialFilters
  });
  
  const [tokensActivos, setTokensActivos] = useState([]);
  const [filtrosConsolidados, setFiltrosConsolidados] = useState({});
  const [opcionesFiltros, setOpcionesFiltros] = useState({
    categorias: [],
    ubicaciones: [],
    estados: [],
    anioRange: { min: 1900, max: new Date().getFullYear() }
  });

  /**
   * Genera un ID único para cada token
   */
  const generarTokenId = useCallback((tipo, valor) => {
    return `${tipo}_${valor}_${Date.now()}`;
  }, []);

  /**
   * Obtiene el ícono para cada tipo de filtro
   */
  const obtenerIconoFiltro = useCallback((tipo) => {
    const iconos = {
      search: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      categoria: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      ubicacion: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      estado: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      anio: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      // Iconos específicos para repuestos
      codigo: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      disponibilidad: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      precio: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      // Iconos específicos para proveedores
      nombre: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      contacto: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      // Iconos específicos para reparaciones
      fecha: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      tipo: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      prioridad: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    };
    return iconos[tipo] || iconos.search;
  }, []);

  /**
   * Genera el label para mostrar en el token
   */
  const generarLabelToken = useCallback((tipo, valor) => {
    const labels = {
      search: `Búsqueda: "${valor}"`,
      categoria: `Categoría: ${valor}`,
      ubicacion: `Ubicación: ${valor}`,
      estado: `Estado: ${valor}`,
      anioMin: `Año mín: ${valor}`,
      anioMax: `Año máx: ${valor}`,
      // Labels específicos para repuestos
      codigo: `Código: "${valor}"`,
      disponibilidad: `Disponibilidad: ${valor}`,
      precio: `Precio: ${valor}`,
      // Labels específicos para proveedores
      nombre: `Nombre: "${valor}"`,
      contacto: `Contacto: "${valor}"`,
      // Labels específicos para reparaciones
      fecha: `Fecha: ${valor}`,
      tipo: `Tipo: ${valor}`,
      prioridad: `Prioridad: ${valor}`
    };
    return labels[tipo] || `${tipo}: ${valor}`;
  }, []);

  /**
   * Consolida todos los tokens en un objeto de filtros para la API
   */
  const consolidarFiltrosDeTokens = useCallback((tokens) => {
    console.log('🔧 Consolidando tokens:', tokens);
    const consolidados = {};
    
    tokens.forEach(token => {
      if (token.tipo === 'search' || token.tipo === 'codigo' || token.tipo === 'nombre' || token.tipo === 'contacto') {
        // Para campos de búsqueda de texto, crear array para múltiples términos
        if (!consolidados[token.tipo]) {
          consolidados[token.tipo] = [];
        }
        if (!consolidados[token.tipo].includes(token.valor)) {
          consolidados[token.tipo].push(token.valor);
        }
      } else if (token.tipo === 'anio') {
        // Para rango de años, manejar anioMin y anioMax
        const { anioMin, anioMax } = token.valor;
        if (anioMin) consolidados.anioMin = anioMin;
        if (anioMax) consolidados.anioMax = anioMax;
      } else if (token.tipo === 'precio') {
        // Para rango de precios, manejar precioMin y precioMax
        if (typeof token.valor === 'object') {
          const { precioMin, precioMax } = token.valor;
          if (precioMin) consolidados.precioMin = precioMin;
          if (precioMax) consolidados.precioMax = precioMax;
        } else {
          consolidados.precio = token.valor;
        }
      } else if (token.tipo === 'fecha') {
        // Para rango de fechas, manejar fechaMin y fechaMax
        if (typeof token.valor === 'object') {
          const { fechaMin, fechaMax } = token.valor;
          if (fechaMin) consolidados.fechaMin = fechaMin;
          if (fechaMax) consolidados.fechaMax = fechaMax;
        } else {
          consolidados.fecha = token.valor;
        }
      } else {
        // Para otros filtros categóricos, crear array para múltiples valores
        if (!consolidados[token.tipo]) {
          consolidados[token.tipo] = [];
        }
        if (!consolidados[token.tipo].includes(token.valor)) {
          consolidados[token.tipo].push(token.valor);
        }
      }
    });

    console.log('🔹 Resultado final de consolidación:', consolidados);
    return consolidados;
  }, []);

  /**
   * Maneja cambios en los filtros temporales
   */
  const handleFiltroChange = useCallback((campo, valor) => {
    setFiltrosTemporales(prev => ({ ...prev, [campo]: valor }));
  }, []);

  /**
   * Aplica los filtros temporales como tokens
   */
  const aplicarFiltrosActuales = useCallback(() => {
    console.log('🚀 Aplicando filtros temporales:', filtrosTemporales);
    const nuevosTokens = [...tokensActivos];
    let cambiosRealizados = false;
    
    // Manejar rango de años como un solo token si hay valores
    if (filtrosTemporales.anioMin || filtrosTemporales.anioMax) {
      const { anioMin, anioMax } = filtrosTemporales;
      
      const rangoExiste = nuevosTokens.some(t => 
        t.tipo === 'anio' && 
        t.valor.anioMin === anioMin && 
        t.valor.anioMax === anioMax
      );
      
      if (!rangoExiste) {
        let valor = '';
        let label = '';
        
        if (anioMin && anioMax) {
          valor = `${anioMin}-${anioMax}`;
          label = `Años: ${anioMin} - ${anioMax}`;
        } else if (anioMin) {
          valor = `${anioMin}+`;
          label = `Año mín: ${anioMin}`;
        } else if (anioMax) {
          valor = `-${anioMax}`;
          label = `Año máx: ${anioMax}`;
        }
        
        const nuevoToken = {
          id: generarTokenId('anio', valor),
          tipo: 'anio',
          valor: { anioMin, anioMax },
          label,
          icon: obtenerIconoFiltro('anio')
        };
        
        nuevosTokens.push(nuevoToken);
        cambiosRealizados = true;
      }
    }
    
    // Manejar rango de precios como un solo token si hay valores
    if (filtrosTemporales.precioMin || filtrosTemporales.precioMax) {
      const { precioMin, precioMax } = filtrosTemporales;
      
      const rangoExiste = nuevosTokens.some(t => 
        t.tipo === 'precio' && 
        typeof t.valor === 'object' &&
        t.valor.precioMin === precioMin && 
        t.valor.precioMax === precioMax
      );
      
      if (!rangoExiste) {
        let valor = '';
        let label = '';
        
        if (precioMin && precioMax) {
          valor = `${precioMin}-${precioMax}`;
          label = `Precios: $${precioMin} - $${precioMax}`;
        } else if (precioMin) {
          valor = `${precioMin}+`;
          label = `Precio mín: $${precioMin}`;
        } else if (precioMax) {
          valor = `-${precioMax}`;
          label = `Precio máx: $${precioMax}`;
        }
        
        const nuevoToken = {
          id: generarTokenId('precio', valor),
          tipo: 'precio',
          valor: { precioMin, precioMax },
          label,
          icon: obtenerIconoFiltro('precio')
        };
        
        nuevosTokens.push(nuevoToken);
        cambiosRealizados = true;
      }
    }
    
    // Manejar rango de fechas como un solo token si hay valores
    if (filtrosTemporales.fechaMin || filtrosTemporales.fechaMax) {
      const { fechaMin, fechaMax } = filtrosTemporales;
      
      const rangoExiste = nuevosTokens.some(t => 
        t.tipo === 'fecha' && 
        typeof t.valor === 'object' &&
        t.valor.fechaMin === fechaMin && 
        t.valor.fechaMax === fechaMax
      );
      
      if (!rangoExiste) {
        let valor = '';
        let label = '';
        
        if (fechaMin && fechaMax) {
          valor = `${fechaMin}_${fechaMax}`;
          label = `Fechas: ${fechaMin} - ${fechaMax}`;
        } else if (fechaMin) {
          valor = `${fechaMin}+`;
          label = `Fecha desde: ${fechaMin}`;
        } else if (fechaMax) {
          valor = `-${fechaMax}`;
          label = `Fecha hasta: ${fechaMax}`;
        }
        
        const nuevoToken = {
          id: generarTokenId('fecha', valor),
          tipo: 'fecha',
          valor: { fechaMin, fechaMax },
          label,
          icon: obtenerIconoFiltro('fecha')
        };
        
        nuevosTokens.push(nuevoToken);
        cambiosRealizados = true;
      }
    }
    
    // Procesar otros filtros temporales no vacíos
    Object.keys(filtrosTemporales).forEach(campo => {
      // Skip campos de rango ya que los manejamos arriba
      if (['anioMin', 'anioMax', 'precioMin', 'precioMax', 'fechaMin', 'fechaMax'].includes(campo)) return;
      
      const valor = filtrosTemporales[campo];
      if (valor && valor.trim() !== '') {
        const tokenExistente = nuevosTokens.find(t => t.tipo === campo && t.valor === valor);
        if (!tokenExistente) {
          const nuevoToken = {
            id: generarTokenId(campo, valor),
            tipo: campo,
            valor,
            label: generarLabelToken(campo, valor),
            icon: obtenerIconoFiltro(campo)
          };
          nuevosTokens.push(nuevoToken);
          cambiosRealizados = true;
        }
      }
    });

    if (cambiosRealizados) {
      setTokensActivos(nuevosTokens);
      const nuevosConsolidados = consolidarFiltrosDeTokens(nuevosTokens);
      setFiltrosConsolidados(nuevosConsolidados);
      
      // Ejecutar función de fetch de datos
      if (fetchDataFunction) {
        fetchDataFunction(nuevosConsolidados, 1);
      }
    }
    
    // Resetear filtros temporales después de aplicar
    setFiltrosTemporales(prev => {
      const reset = {};
      Object.keys(prev).forEach(key => {
        reset[key] = '';
      });
      return reset;
    });
  }, [filtrosTemporales, tokensActivos, generarTokenId, obtenerIconoFiltro, generarLabelToken, consolidarFiltrosDeTokens, fetchDataFunction]);

  /**
   * Remueve un token específico
   */
  const removerToken = useCallback((tokenId) => {
    const nuevosTokens = tokensActivos.filter(token => token.id !== tokenId);
    setTokensActivos(nuevosTokens);
    
    const nuevosConsolidados = consolidarFiltrosDeTokens(nuevosTokens);
    setFiltrosConsolidados(nuevosConsolidados);
    
    if (fetchDataFunction) {
      fetchDataFunction(nuevosConsolidados, 1);
    }
  }, [tokensActivos, consolidarFiltrosDeTokens, fetchDataFunction]);

  /**
   * Limpia todos los filtros y tokens
   */
  const limpiarTodosFiltros = useCallback(() => {
    // Resetear filtros temporales
    setFiltrosTemporales(prev => {
      const reset = {};
      Object.keys(prev).forEach(key => {
        reset[key] = '';
      });
      return reset;
    });
    
    // Limpiar tokens
    setTokensActivos([]);
    setFiltrosConsolidados({});
    
    // Recargar sin filtros
    if (fetchDataFunction) {
      fetchDataFunction({}, 1);
    }
  }, [fetchDataFunction]);

  /**
   * Carga las opciones de filtros
   */
  const cargarOpcionesFiltros = useCallback(async () => {
    if (fetchOptionsFunction) {
      try {
        const data = await fetchOptionsFunction();
        setOpcionesFiltros(data);
      } catch (err) {
        console.error('Error al cargar opciones de filtros:', err);
      }
    }
  }, [fetchOptionsFunction]);

  return {
    // Estados
    filtrosTemporales,
    tokensActivos,
    filtrosConsolidados,
    opcionesFiltros,
    
    // Funciones
    handleFiltroChange,
    aplicarFiltrosActuales,
    removerToken,
    limpiarTodosFiltros,
    cargarOpcionesFiltros,
    obtenerIconoFiltro,
    generarLabelToken,
    
    // Setters para casos especiales
    setFiltrosTemporales,
    setTokensActivos,
    setFiltrosConsolidados,
    setOpcionesFiltros
  };
};

export default useAdvancedFilters;
