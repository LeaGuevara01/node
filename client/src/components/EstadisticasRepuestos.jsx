import React, { useState, useEffect } from 'react';

const EstadisticasRepuestos = ({ token }) => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEstadisticas();
  }, []);

  const loadEstadisticas = async () => {
    try {
      const response = await fetch('/api/repuestos/estadisticas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setEstadisticas(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">No se pudieron cargar las estadísticas</p>
      </div>
    );
  }

  const { resumen, porCategoria, porUbicacion } = estadisticas;

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen General</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{resumen.total}</div>
            <div className="text-sm text-gray-600">Total repuestos</div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{resumen.stockDisponible}</div>
            <div className="text-sm text-gray-600">Con stock</div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{resumen.stockBajo}</div>
            <div className="text-sm text-gray-600">Stock bajo</div>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{resumen.sinStock}</div>
            <div className="text-sm text-gray-600">Sin stock</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por categoría */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Por Categoría</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {porCategoria.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-gray-900">{item.categoria}</div>
                  <div className="text-sm text-gray-600">Stock total: {item.stockTotal}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">{item.cantidad}</div>
                  <div className="text-xs text-gray-500">repuestos</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Por ubicación */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Por Ubicación</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {porUbicacion.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-gray-900">{item.ubicacion}</div>
                  <div className="text-sm text-gray-600">Stock total: {item.stockTotal}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-purple-600">{item.cantidad}</div>
                  <div className="text-xs text-gray-500">repuestos</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico simple de distribución por categoría */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Categoría</h3>
        <div className="space-y-2">
          {porCategoria.map((item, index) => {
            const percentage = (item.cantidad / resumen.total) * 100;
            const colors = [
              'bg-blue-500',
              'bg-green-500',
              'bg-yellow-500',
              'bg-red-500',
              'bg-purple-500',
              'bg-pink-500',
              'bg-indigo-500',
              'bg-gray-500',
            ];

            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-24 text-sm text-gray-600 truncate">{item.categoria}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${colors[index % colors.length]}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-12 text-sm text-gray-600 text-right">
                  {Math.round(percentage)}%
                </div>
                <div className="w-8 text-sm font-medium text-gray-900 text-right">
                  {item.cantidad}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EstadisticasRepuestos;
