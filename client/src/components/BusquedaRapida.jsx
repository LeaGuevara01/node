import React, { useState, useRef, useEffect } from 'react';
import { busquedaRapidaRepuestos } from '../services/api';

const BusquedaRapida = ({ token, onSelect }) => {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const buscarRepuestos = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResultados([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      const data = await busquedaRapidaRepuestos(searchQuery, token);
      setResultados(data.resultados || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce para evitar muchas consultas
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      buscarRepuestos(value);
    }, 300);
  };

  const handleSelect = (repuesto) => {
    setQuery(repuesto.nombre);
    setShowResults(false);
    if (onSelect) {
      onSelect(repuesto);
    }
  };

  const getStockColor = (stock) => {
    if (stock <= 0) return 'text-red-600';
    if (stock <= 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="relative" ref={inputRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar repuesto por nombre o código..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Resultados de búsqueda */}
      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {resultados.length === 0 && !loading && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              {query.length < 2 ? 'Escribe al menos 2 caracteres' : 'No se encontraron repuestos'}
            </div>
          )}

          {resultados.map((repuesto) => (
            <div
              key={repuesto.id}
              onClick={() => handleSelect(repuesto)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {repuesto.nombre}
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    {repuesto.codigo && (
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {repuesto.codigo}
                      </span>
                    )}
                    
                    {repuesto.categoria && (
                      <span className="text-blue-600">
                        {repuesto.categoria}
                      </span>
                    )}
                    
                    {repuesto.ubicacion && (
                      <span className="text-purple-600">
                        📍 {repuesto.ubicacion}
                      </span>
                    )}
                  </div>
                </div>

                <div className="ml-4 text-right">
                  <div className={`font-semibold ${getStockColor(repuesto.stock)}`}>
                    Stock: {repuesto.stock}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusquedaRapida;
