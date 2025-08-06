// Página dedicada para el listado y gestión de maquinarias
// Refactorizada usando componentes modulares

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMaquinaria, getMaquinarias, getMaquinariaFilters, updateMaquinaria, deleteMaquinaria } from '../services/api';
import MaquinariaEditModal from '../components/MaquinariaEditModal';
import EstadoIcon from '../components/EstadoIcon';
import BaseListPage from '../components/shared/BaseListPage';
import { useAdvancedFilters } from '../hooks/useAdvancedFilters';
import { usePagination } from '../hooks/usePagination';
import { MAQUINARIA_FILTERS_CONFIG } from '../config/filtersConfig';
import { getColorFromString } from '../utils/colorUtils';
import { sortMaquinariasByCategory, getEstadoColorClass, formatAnio } from '../utils/maquinariaUtils';
import { 
  BUTTON_STYLES, 
  ICON_STYLES,
  LIST_STYLES
} from '../styles/repuestoStyles';

function MaquinariasPage({ token, onCreated }) {
  const navigate = useNavigate();
  
  // Estados principales
  const [maquinarias, setMaquinarias] = useState([]);
  const [selectedMaquinaria, setSelectedMaquinaria] = useState(null);
  const [error, setError] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');

  // Hook de paginación
  const { 
    paginacion, 
    loading, 
    setLoading, 
    handlePaginacion, 
    actualizarPaginacion 
  } = usePagination({ limit: 20 });

  /**
   * Carga las maquinarias con filtros aplicados
   */
  const fetchMaquinarias = async (filtrosActuales = {}, pagina = 1) => {
    setLoading(true);
    try {
      console.log('Fetching maquinarias with consolidated filters:', filtrosActuales, 'page:', pagina);

      const data = await getMaquinarias(token, filtrosActuales, pagina);
      console.log('API Response:', data);
      
      if (data.maquinarias) {
        const maquinariasOrdenadas = sortMaquinariasByCategory(data.maquinarias);
        setMaquinarias(maquinariasOrdenadas);
        actualizarPaginacion(data.pagination || { current: 1, total: 1, totalItems: 0, limit: 20 });
      } else {
        // Respuesta legacy sin paginación
        const maquinariasOrdenadas = sortMaquinariasByCategory(data || []);
        setMaquinarias(maquinariasOrdenadas);
        actualizarPaginacion({ current: 1, total: 1, totalItems: maquinariasOrdenadas.length, limit: 20 });
      }
      setError('');
    } catch (err) {
      console.error('Error al cargar maquinarias:', err);
      setMaquinarias([]);
      setError('Error al cargar maquinarias: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga las opciones de filtros
   */
  const fetchOpcionesFiltros = async () => {
    try {
      const data = await getMaquinariaFilters(token);
      return data;
    } catch (err) {
      console.error('Error al cargar opciones de filtros:', err);
      return {};
    }
  };

  // Hook de filtros avanzados
  const {
    filtrosTemporales,
    tokensActivos,
    filtrosConsolidados,
    opcionesFiltros,
    handleFiltroChange,
    aplicarFiltrosActuales,
    removerToken,
    limpiarTodosFiltros,
    cargarOpcionesFiltros
  } = useAdvancedFilters({}, fetchMaquinarias, fetchOpcionesFiltros);

  /**
   * Maneja la carga masiva de CSV
   */
  const handleFileUpload = async (csvData) => {
    const validRows = csvData.filter(row => row.nombre && row.modelo && row.categoria);
    let successCount = 0, failCount = 0;
    
    for (const row of validRows) {
      try {
        await createMaquinaria({
          nombre: row.nombre || '',
          modelo: row.modelo || '',
          categoria: row.categoria || '',
          anio: row.anio ? Number(row.anio) : null,
          numero_serie: row.numero_serie || '',
          descripcion: row.descripcion || '',
          proveedor: row.proveedor || '',
          ubicacion: row.ubicacion || '',
          estado: row.estado || ''
        }, token);
        successCount++;
      } catch (err) {
        console.error('Error creating maquinaria:', err);
        failCount++;
      }
    }
    
    setBulkSuccess(`Creadas: ${successCount}`);
    setBulkError(failCount ? `Fallidas: ${failCount}` : '');
    
    if (successCount > 0) {
      if (onCreated) onCreated();
      fetchMaquinarias(filtrosConsolidados, 1);
      cargarOpcionesFiltros();
    }
  };

  /**
   * Abre modal de edición
   */
  const openEditModal = (maquinaria) => {
    setSelectedMaquinaria(maquinaria);
  };

  /**
   * Cierra modal de edición
   */
  const closeEditModal = () => {
    setSelectedMaquinaria(null);
  };

  /**
   * Navega a la vista de detalles
   */
  const handleView = (maquinaria) => {
    navigate(`/maquinarias/${maquinaria.id}`);
  };

  /**
   * Actualiza una maquinaria
   */
  const handleUpdateMaquinaria = async (id, maquinariaData) => {
    try {
      await updateMaquinaria({ ...maquinariaData, id }, token);
      fetchMaquinarias(filtrosConsolidados, paginacion.current);
      cargarOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al actualizar: ' + err.message);
    }
  };

  /**
   * Elimina una maquinaria
   */
  const handleDeleteMaquinaria = async (id) => {
    try {
      await deleteMaquinaria(id, token);
      fetchMaquinarias(filtrosConsolidados, paginacion.current);
      cargarOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  /**
   * Renderiza un elemento de maquinaria
   */
  const renderMaquinaria = (maquinaria) => (
    <>
      <div className={LIST_STYLES.itemHeader}>
        <div className="flex items-center gap-2">
          <h3 className={LIST_STYLES.itemTitle}>{maquinaria.nombre}</h3>
          <span className={`hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColorClass(maquinaria.estado)}`}>
            <EstadoIcon estado={maquinaria.estado} className="w-3 h-3" />
            <span className="ml-1">{maquinaria.estado || 'Sin estado'}</span>
          </span>
        </div>
        <div className={LIST_STYLES.itemActions}>
          <button
            onClick={() => handleView(maquinaria)}
            className={`${BUTTON_STYLES.edit} bg-gray-50 hover:bg-gray-100 text-gray-700 mr-2`}
            title="Ver detalles"
          >
            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => openEditModal(maquinaria)}
            className={BUTTON_STYLES.edit}
            title="Editar maquinaria"
          >
            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
      </div>
      {maquinaria.modelo && (
        <div className={LIST_STYLES.itemDescription}>
          {maquinaria.modelo}
        </div>
      )}
      <div className={LIST_STYLES.itemTagsRow}>
        <div className={`${LIST_STYLES.itemTagsLeft} tags-container-mobile`}>
          <span className={`${LIST_STYLES.itemTagCode} bg-gray-100 text-gray-700 hidden sm:flex`} title={maquinaria.numero_serie || 'Sin número de serie'}>
            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="tag-truncate">{maquinaria.numero_serie || 'Sin N° serie'}</span>
          </span>
          {maquinaria.ubicacion && (
            <span className={`${LIST_STYLES.itemTagLocation} ${getColorFromString(maquinaria.ubicacion, 'ubicacion')}`} title={maquinaria.ubicacion}>
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="tag-truncate">{maquinaria.ubicacion}</span>
            </span>
          )}
          {maquinaria.categoria && (
            <span className={`${LIST_STYLES.itemTagCategory} ${getColorFromString(maquinaria.categoria, 'categoria')}`} title={maquinaria.categoria}>
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="tag-truncate">{maquinaria.categoria}</span>
            </span>
          )}
          {maquinaria.anio && (
            <span className={`${LIST_STYLES.itemTag} bg-gray-100 text-gray-700`}>
              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatAnio(maquinaria.anio)}
            </span>
          )}
        </div>
      </div>
    </>
  );

  // Efectos
  useEffect(() => {
    fetchMaquinarias();
    cargarOpcionesFiltros();
  }, []);

  return (
    <>
      <BaseListPage
        title="Listado de Maquinarias"
        subtitle="Gestiona y filtra todas las maquinarias del sistema"
        entityName="Maquinaria"
        entityNamePlural="Maquinarias"
        createRoute="/maquinarias/formulario"
        
        items={maquinarias}
        loading={loading}
        error={error}
        
        filtrosTemporales={filtrosTemporales}
        handleFiltroChange={handleFiltroChange}
        aplicarFiltrosActuales={aplicarFiltrosActuales}
        limpiarTodosFiltros={limpiarTodosFiltros}
        tokensActivos={tokensActivos}
        removerToken={removerToken}
        opcionesFiltros={opcionesFiltros}
        camposFiltros={MAQUINARIA_FILTERS_CONFIG(opcionesFiltros)}
        
        paginacion={paginacion}
        handlePaginacion={handlePaginacion}
        
        onFileUpload={handleFileUpload}
        bulkError={bulkError}
        setBulkError={setBulkError}
        bulkSuccess={bulkSuccess}
        setBulkSuccess={setBulkSuccess}
        
        renderItem={renderMaquinaria}
      />

      {/* Modal de edición */}
      {selectedMaquinaria && (
        <MaquinariaEditModal
          maquinaria={selectedMaquinaria}
          onClose={closeEditModal}
          onUpdate={handleUpdateMaquinaria}
          onDelete={handleDeleteMaquinaria}
          token={token}
        />
      )}
    </>
  );
}

export default MaquinariasPage;
    categoria: '',
    ubicacion: '',
    estado: '',
    anioMin: '',
    anioMax: ''
  });
  const [tokensActivos, setTokensActivos] = useState([]); // Array de tokens de filtros aplicados
  const [filtrosConsolidados, setFiltrosConsolidados] = useState({}); // Filtros enviados a la API
  const [opcionesFiltros, setOpcionesFiltros] = useState({
    categorias: [],
    ubicaciones: [],
    estados: [],
    anioRange: { min: 1900, max: new Date().getFullYear() }
  });
  
  // Estados para paginación
  const [paginacion, setPaginacion] = useState({
    current: 1,
    total: 1,
    totalItems: 0,
    limit: 20
  });
  
  // Estado para búsqueda con debounce
  const [searchTimeout, setSearchTimeout] = useState(null);

  /**
   * Carga las maquinarias con filtros aplicados
   */
  const fetchMaquinarias = async (filtrosActuales = filtrosConsolidados, pagina = 1) => {
    setLoading(true);
    try {
      console.log('Fetching maquinarias with consolidated filters:', filtrosActuales, 'page:', pagina);

      const data = await getMaquinarias(token, filtrosActuales, pagina);
      console.log('API Response:', data);
      
      if (data.maquinarias) {
        const maquinariasOrdenadas = sortMaquinariasByCategory(data.maquinarias);
        setMaquinarias(maquinariasOrdenadas);
        setPaginacion(data.pagination || { current: 1, total: 1, totalItems: 0, limit: 20 });
      } else {
        // Respuesta legacy sin paginación
        const maquinariasOrdenadas = sortMaquinariasByCategory(data || []);
        setMaquinarias(maquinariasOrdenadas);
        setPaginacion({ current: 1, total: 1, totalItems: maquinariasOrdenadas.length, limit: 20 });
      }
      setError('');
    } catch (err) {
      console.error('Error al cargar maquinarias:', err);
      setMaquinarias([]);
      setError('Error al cargar maquinarias: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga las opciones de filtros
   */
  const fetchOpcionesFiltros = async () => {
    try {
      const data = await getMaquinariaFilters(token);
      setOpcionesFiltros(data);
    } catch (err) {
      console.error('Error al cargar opciones de filtros:', err);
    }
  };

  /**
   * Maneja cambios en los filtros temporales
   */
  const handleFiltroChange = (campo, valor) => {
    const nuevosFiltros = { ...filtrosTemporales, [campo]: valor };
    setFiltrosTemporales(nuevosFiltros);
  };

  /**
   * Genera un ID único para cada token
   */
  const generarTokenId = (tipo, valor) => {
    return `${tipo}_${valor}_${Date.now()}`;
  };

  /**
   * Obtiene el ícono para cada tipo de filtro
   */
  const obtenerIconoFiltro = (tipo) => {
    const iconos = {
      search: (
        <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      categoria: (
        <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      ubicacion: (
        <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      estado: (
        <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      anio: (
        <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    };
    return iconos[tipo] || iconos.search;
  };

  /**
   * Aplica un filtro individual como token
   */
  const aplicarFiltroComoToken = (tipo, valor) => {
    if (!valor || valor === '') return;

    // Crear nuevo token
    const nuevoToken = {
      id: generarTokenId(tipo, valor),
      tipo,
      valor,
      label: generarLabelToken(tipo, valor),
      icon: obtenerIconoFiltro(tipo)
    };

    // Agregar token a la lista
    const nuevosTokens = [...tokensActivos, nuevoToken];
    setTokensActivos(nuevosTokens);

    // Consolidar filtros para API
    const nuevosConsolidados = consolidarFiltrosDeTokens(nuevosTokens);
    setFiltrosConsolidados(nuevosConsolidados);
    
    // Ejecutar búsqueda
    fetchMaquinarias(nuevosConsolidados, 1);
  };

  /**
   * Genera el label para mostrar en el token
   */
  const generarLabelToken = (tipo, valor) => {
    const labels = {
      search: `Búsqueda: "${valor}"`,
      categoria: `Categoría: ${valor}`,
      ubicacion: `Ubicación: ${valor}`,
      estado: `Estado: ${valor}`,
      anioMin: `Año mín: ${valor}`,
      anioMax: `Año máx: ${valor}`
    };
    return labels[tipo] || `${tipo}: ${valor}`;
  };

  /**
   * Consolida todos los tokens en un objeto de filtros para la API
   */
  const consolidarFiltrosDeTokens = (tokens) => {
    console.log('🔧 Consolidando tokens:', tokens);
    const consolidados = {};
    
    tokens.forEach(token => {
      if (token.tipo === 'search') {
        // Para búsqueda, crear array para múltiples términos (siempre array)
        if (!consolidados.search) {
          consolidados.search = [];
        }
        if (!consolidados.search.includes(token.valor)) {
          consolidados.search.push(token.valor);
        }
        console.log('🔍 Términos de búsqueda consolidados:', consolidados.search);
      } else if (token.tipo === 'anio') {
        // Para rango de años, manejar anioMin y anioMax
        const { anioMin, anioMax } = token.valor;
        if (anioMin) consolidados.anioMin = anioMin;
        if (anioMax) consolidados.anioMax = anioMax;
      } else if (token.tipo === 'categoria') {
        // Para categorías, crear array para múltiples valores (siempre array)
        if (!consolidados.categoria) {
          consolidados.categoria = [];
        }
        if (!consolidados.categoria.includes(token.valor)) {
          consolidados.categoria.push(token.valor);
        }
        console.log('📂 Categorías consolidadas:', consolidados.categoria);
      } else if (token.tipo === 'ubicacion') {
        // Para ubicaciones, crear array para múltiples valores (siempre array)
        if (!consolidados.ubicacion) {
          consolidados.ubicacion = [];
        }
        if (!consolidados.ubicacion.includes(token.valor)) {
          consolidados.ubicacion.push(token.valor);
        }
        console.log('📍 Ubicaciones consolidadas:', consolidados.ubicacion);
      } else if (token.tipo === 'estado') {
        // Para estados, crear array para múltiples valores (siempre array)
        if (!consolidados.estado) {
          consolidados.estado = [];
        }
        if (!consolidados.estado.includes(token.valor)) {
          consolidados.estado.push(token.valor);
        }
        console.log('✅ Estados consolidados:', consolidados.estado);
      } else {
        // Para otros filtros, usar el valor directo
        consolidados[token.tipo] = token.valor;
      }
    });

    console.log('🔹 Resultado final de consolidación:', consolidados);
    return consolidados;
  };

  /**
   * Aplica los filtros temporales como tokens
   */
  const aplicarFiltrosActuales = () => {
    console.log('🚀 Aplicando filtros temporales:', filtrosTemporales);
    const nuevosTokens = [...tokensActivos];
    let cambiosRealizados = false;
    
    // Manejar rango de años como un solo token si hay valores
    if (filtrosTemporales.anioMin || filtrosTemporales.anioMax) {
      const { anioMin, anioMax } = filtrosTemporales;
      
      // Verificar si ya existe un token de rango similar
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
        console.log('📅 Token de año agregado:', nuevoToken);
      }
    }
    
    // Procesar otros filtros temporales no vacíos
    Object.keys(filtrosTemporales).forEach(campo => {
      // Skip año fields ya que los manejamos arriba
      if (campo === 'anioMin' || campo === 'anioMax') return;
      
      const valor = filtrosTemporales[campo];
      if (valor && valor.trim() !== '') {
        // Verificar si ya existe un token exactamente igual (mismo tipo y valor)
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
          console.log(`🏷️ Token de ${campo} agregado:`, nuevoToken);
        } else {
          console.log(`⚠️ Token de ${campo} ya existe, no se agrega duplicado`);
        }
      }
    });

    console.log('📦 Todos los tokens después de aplicar:', nuevosTokens);

    // Solo actualizar si hay cambios
    if (cambiosRealizados) {
      // Actualizar estados
      setTokensActivos(nuevosTokens);
      
      // Consolidar y aplicar
      const nuevosConsolidados = consolidarFiltrosDeTokens(nuevosTokens);
      setFiltrosConsolidados(nuevosConsolidados);
      console.log('🔹 Filtros consolidados enviados a API:', nuevosConsolidados);
      fetchMaquinarias(nuevosConsolidados, 1);
    } else {
      console.log('❌ No se realizaron cambios, no se aplican filtros');
    }
    
    // Resetear filtros temporales después de aplicar
    setFiltrosTemporales({
      search: '',
      categoria: '',
      ubicacion: '',
      estado: '',
      anioMin: '',
      anioMax: ''
    });
    console.log('🧹 Filtros temporales reseteados');
  };

  /**
   * Remueve un token específico
   */
  const removerToken = (tokenId) => {
    const nuevosTokens = tokensActivos.filter(token => token.id !== tokenId);
    setTokensActivos(nuevosTokens);
    
    const nuevosConsolidados = consolidarFiltrosDeTokens(nuevosTokens);
    setFiltrosConsolidados(nuevosConsolidados);
    fetchMaquinarias(nuevosConsolidados, 1);
  };

  /**
   * Limpia todos los filtros y tokens
   */
  const limpiarTodosFiltros = () => {
    // Resetear filtros temporales
    setFiltrosTemporales({
      search: '',
      categoria: '',
      ubicacion: '',
      estado: '',
      anioMin: '',
      anioMax: ''
    });
    
    // Limpiar tokens
    setTokensActivos([]);
    setFiltrosConsolidados({});
    
    // Recargar sin filtros
    fetchMaquinarias({}, 1);
  };

  /**
   * Maneja el cambio de página
   */
  const handlePaginacion = (nuevaPagina) => {
    fetchMaquinarias(filtrosConsolidados, nuevaPagina);
  };

  /**
   * Maneja la carga masiva de CSV
   */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setBulkError('');
    setBulkSuccess('');
    
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const validRows = results.data.filter(row => row.nombre && row.modelo && row.categoria);
        let successCount = 0, failCount = 0;
        
        for (const row of validRows) {
          try {
            await createMaquinaria({
              nombre: row.nombre || '',
              modelo: row.modelo || '',
              categoria: row.categoria || '',
              anio: row.anio ? Number(row.anio) : null,
              numero_serie: row.numero_serie || '',
              descripcion: row.descripcion || '',
              proveedor: row.proveedor || '',
              ubicacion: row.ubicacion || '',
              estado: row.estado || ''
            }, token);
            successCount++;
          } catch (err) {
            console.error('Error creating maquinaria:', err);
            failCount++;
          }
        }
        
        setBulkSuccess(`Creadas: ${successCount}`);
        setBulkError(failCount ? `Fallidas: ${failCount}` : '');
        
        if (successCount > 0) {
          if (onCreated) onCreated();
          fetchMaquinarias();
          fetchOpcionesFiltros();
        }
      },
      error: (err) => setBulkError('Error al procesar CSV: ' + err.message),
    });
  };

  /**
   * Abre modal de edición
   */
  const openEditModal = (maquinaria) => {
    setSelectedMaquinaria(maquinaria);
  };

  /**
   * Cierra modal de edición
   */
  const closeEditModal = () => {
    setSelectedMaquinaria(null);
  };

  /**
   * Actualiza una maquinaria
   */
  const handleUpdateMaquinaria = async (id, maquinariaData) => {
    try {
      await updateMaquinaria({ ...maquinariaData, id }, token);
      fetchMaquinarias();
      fetchOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al actualizar: ' + err.message);
    }
  };

  /**
   * Elimina una maquinaria
   */
  const handleDeleteMaquinaria = async (id) => {
    try {
      await deleteMaquinaria(id, token);
      fetchMaquinarias();
      fetchOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  /**
   * Genera tokens de rango de años como un solo token
   */
  const aplicarRangoAnios = () => {
    const { anioMin, anioMax } = filtrosTemporales;
    
    if (anioMin || anioMax) {
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
      
      const nuevosTokens = [...tokensActivos, nuevoToken];
      setTokensActivos(nuevosTokens);
      
      // Resetear campos de año
      setFiltrosTemporales(prev => ({ ...prev, anioMin: '', anioMax: '' }));
      
      // Consolidar y aplicar
      const nuevosConsolidados = consolidarFiltrosDeTokens(nuevosTokens);
      setFiltrosConsolidados(nuevosConsolidados);
      fetchMaquinarias(nuevosConsolidados, 1);
    }
  };

  // Efectos
  useEffect(() => {
    fetchMaquinarias();
    fetchOpcionesFiltros();
  }, []);

  return (
    <div className={CONTAINER_STYLES.main}>
      <div className={CONTAINER_STYLES.maxWidth}>
        
        {/* Header con botones de acción */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <div className={LAYOUT_STYLES.flexBetween}>
            <div>
              <h1 className={TEXT_STYLES.title}>Listado de Maquinarias</h1>
              <p className={TEXT_STYLES.subtitle}>Gestiona y filtra todas las maquinarias del sistema</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <label className="flex-1 sm:flex-initial">
                <span className="sr-only">Cargar CSV</span>
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload-maquinaria"
                />
                <div className={BUTTON_STYLES.csv}>
                  <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Cargar CSV
                </div>
              </label>
              <button
                onClick={() => navigate('/maquinarias/formulario')}
                className={BUTTON_STYLES.newItem}
              >
                <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nueva Maquinaria
              </button>
            </div>
          </div>
          
          {/* Mensajes de estado para carga masiva */}
          {bulkSuccess && (
            <div className={ALERT_STYLES.success}>
              {bulkSuccess}
            </div>
          )}
          {bulkError && (
            <div className={ALERT_STYLES.error}>
              {bulkError}
            </div>
          )}
          {error && (
            <div className={ALERT_STYLES.error}>
              {error}
            </div>
          )}
        </div>

        {/* Filtros avanzados */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <h2 className={TEXT_STYLES.sectionTitle}>Filtros Avanzados</h2>
          
          <div className={LAYOUT_STYLES.gridFilters}>
            {/* Búsqueda */}
            <div className={LAYOUT_STYLES.searchSpan}>
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={filtrosTemporales.search}
                  onChange={(e) => handleFiltroChange('search', e.target.value)}
                  placeholder="Buscar maquinarias..."
                  className={`${INPUT_STYLES.withIcon} ${INPUT_STYLES.placeholder}`}
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <select
                  value={filtrosTemporales.categoria}
                  onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                  className={INPUT_STYLES.select}
                >
                  <option value="" className={INPUT_STYLES.selectPlaceholder}>Todas las categorías</option>
                  {opcionesFiltros.categorias?.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <select
                  value={filtrosTemporales.ubicacion}
                  onChange={(e) => handleFiltroChange('ubicacion', e.target.value)}
                  className={INPUT_STYLES.select}
                >
                  <option value="" className={INPUT_STYLES.selectPlaceholder}>Todas las ubicaciones</option>
                  {opcionesFiltros.ubicaciones?.map(ubicacion => (
                    <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
                  ))}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="md:col-span-2 lg:col-span-1 xl:col-span-1">
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <select
                  value={filtrosTemporales.estado}
                  onChange={(e) => handleFiltroChange('estado', e.target.value)}
                  className={INPUT_STYLES.select}
                >
                  <option value="" className={INPUT_STYLES.selectPlaceholder}>Todos los estados</option>
                  {opcionesFiltros.estados?.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
                <div className={POSITION_STYLES.iconRight}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Rango de Años */}
            <div className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2 w-full">
              <div className={POSITION_STYLES.relative}>
                <div className={POSITION_STYLES.iconLeft}>
                  <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.gray}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="pl-10 pr-3 py-2 border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={filtrosTemporales.anioMin}
                      onChange={(e) => handleFiltroChange('anioMin', e.target.value)}
                      placeholder="Año mínimo"
                      className="flex-1 border-0 p-0 text-sm placeholder-gray-500 focus:outline-none focus:ring-0"
                      min={opcionesFiltros.anioRange?.min || 1900}
                      max={opcionesFiltros.anioRange?.max || new Date().getFullYear()}
                      step="1"
                    />
                    <span className="text-gray-400 text-sm">-</span>
                    <input
                      type="number"
                      value={filtrosTemporales.anioMax}
                      onChange={(e) => handleFiltroChange('anioMax', e.target.value)}
                      placeholder="Año máximo"
                      className="flex-1 border-0 p-0 text-sm placeholder-gray-500 focus:outline-none focus:ring-0"
                      min={opcionesFiltros.anioRange?.min || 1900}
                      max={opcionesFiltros.anioRange?.max || new Date().getFullYear()}
                      step="1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción de filtros */}
          <div className={LAYOUT_STYLES.gridButtons}>
            <button
              type="button"
              onClick={aplicarFiltrosActuales}
              className={`${BUTTON_STYLES.primary} w-full flex items-center justify-center gap-2`}
              disabled={Object.values(filtrosTemporales).every(val => !val || val === '')}
            >
              <svg className={ICON_STYLES.medium} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Aplicar
            </button>
            
            <button
              type="button"
              onClick={limpiarTodosFiltros}
              className={`${BUTTON_STYLES.filter.clear} w-full flex items-center justify-center gap-2`}
            >
              <svg className={ICON_STYLES.medium} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpiar
            </button>
          </div>

          {/* Tokens de filtros aplicados */}
          {tokensActivos.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Filtros activos:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {tokensActivos.map(token => (
                  <span
                    key={token.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-colors"
                  >
                    {token.icon}
                    <span className="ml-1">{token.label}</span>
                    <button
                      onClick={() => removerToken(token.id)}
                      className="ml-2 hover:text-blue-600 focus:outline-none"
                      title="Remover filtro"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Lista de Maquinarias */}
        <div className={`${CONTAINER_STYLES.card} overflow-hidden`}>
          <div className={`${CONTAINER_STYLES.cardPadding} border-b border-gray-200`}>
            <div className={LAYOUT_STYLES.flexBetween}>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Maquinarias ({paginacion.totalItems})
                </h3>
              </div>
              {loading && (
                <div className={TEXT_STYLES.loading}>
                  <svg className={`${ICON_STYLES.small} ${ICON_STYLES.spin}`} fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                  </svg>
                  Cargando...
                </div>
              )}
            </div>
          </div>

          {/* Lista con overflow controlado */}
          <div className={`${LIST_STYLES.divider} overflow-x-hidden`}>
            {maquinarias.length === 0 ? (
              <div className={LIST_STYLES.emptyState}>
                {loading ? 'Cargando...' : 'No hay maquinarias que coincidan con los filtros aplicados'}
              </div>
            ) : (
              maquinarias.map((maquinaria) => (
                <div key={maquinaria.id} className={LIST_STYLES.item}>
                  <div className={`${LIST_STYLES.itemContent} list-item-content`}>
                    <div className="flex-1">
                      <div className={LIST_STYLES.itemHeader}>
                        <div className="flex items-center gap-2">
                          <h3 className={LIST_STYLES.itemTitle}>{maquinaria.nombre}</h3>
                          <span className={`hidden sm:inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEstadoColorClass(maquinaria.estado)}`}>
                            <EstadoIcon estado={maquinaria.estado} className="w-3 h-3" />
                            <span className="ml-1">{maquinaria.estado || 'Sin estado'}</span>
                          </span>
                        </div>
                        <div className={LIST_STYLES.itemActions}>
                          <button
                            onClick={() => navigate(`/maquinarias/${maquinaria.id}`)}
                            className={`${BUTTON_STYLES.edit} bg-gray-50 hover:bg-gray-100 text-gray-700 mr-2`}
                            title="Ver detalles"
                          >
                            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => openEditModal(maquinaria)}
                            className={BUTTON_STYLES.edit}
                            title="Editar maquinaria"
                          >
                            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      {maquinaria.modelo && (
                        <div className={LIST_STYLES.itemDescription}>
                          {maquinaria.modelo}
                        </div>
                      )}
                      <div className={LIST_STYLES.itemTagsRow}>
                        <div className={`${LIST_STYLES.itemTagsLeft} tags-container-mobile`}>
                          <span className={`${LIST_STYLES.itemTagCode} bg-gray-100 text-gray-700 hidden sm:flex`} title={maquinaria.numero_serie || 'Sin número de serie'}>
                            <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="tag-truncate">{maquinaria.numero_serie || 'Sin N° serie'}</span>
                          </span>
                          {maquinaria.ubicacion && (
                            <span className={`${LIST_STYLES.itemTagLocation} ${getColorFromString(maquinaria.ubicacion, 'ubicacion')}`} title={maquinaria.ubicacion}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="tag-truncate">{maquinaria.ubicacion}</span>
                            </span>
                          )}
                          {maquinaria.categoria && (
                            <span className={`${LIST_STYLES.itemTagCategory} ${getColorFromString(maquinaria.categoria, 'categoria')}`} title={maquinaria.categoria}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              <span className="tag-truncate">{maquinaria.categoria}</span>
                            </span>
                          )}
                          {maquinaria.anio && (
                            <span className={`${LIST_STYLES.itemTag} bg-gray-100 text-gray-700`}>
                              <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {formatAnio(maquinaria.anio)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Paginación mejorada */}
          {paginacion.total > 1 && (
            <div className="border-t border-gray-200 bg-gray-50 py-3">
              <div className="px-4 sm:px-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-700">
                    Mostrando {((paginacion.current - 1) * paginacion.limit) + 1} - {Math.min(paginacion.current * paginacion.limit, paginacion.totalItems)} de {paginacion.totalItems} resultados
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePaginacion(paginacion.current - 1)}
                      disabled={paginacion.current <= 1}
                      className={`${BUTTON_STYLES.pagination.base} ${
                        paginacion.current <= 1 
                          ? BUTTON_STYLES.pagination.disabled 
                          : BUTTON_STYLES.pagination.enabled
                      }`}
                    >
                      <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="px-3 py-1 bg-white border border-gray-200 rounded-md">
                      <span className="text-xs font-medium text-gray-700">
                        {paginacion.current}/{paginacion.total}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handlePaginacion(paginacion.current + 1)}
                      disabled={paginacion.current >= paginacion.total}
                      className={`${BUTTON_STYLES.pagination.base} ${
                        paginacion.current >= paginacion.total 
                          ? BUTTON_STYLES.pagination.disabled 
                          : BUTTON_STYLES.pagination.enabled
                      }`}
                    >
                      <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal de edición */}
        {selectedMaquinaria && (
          <MaquinariaEditModal
            maquinaria={selectedMaquinaria}
            onClose={closeEditModal}
            onUpdate={handleUpdateMaquinaria}
            onDelete={handleDeleteMaquinaria}
            token={token}
          />
        )}
      </div>
    </div>
  );
}

export default MaquinariasPage;
