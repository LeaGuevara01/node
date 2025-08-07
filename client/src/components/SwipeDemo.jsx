/**
 * SwipeDemo - Componente de demostración de gestos táctiles
 * 
 * Muestra visualmente cuando se detectan gestos de deslizamiento
 * y proporciona feedback al usuario sobre el funcionamiento
 */

import React, { useState } from 'react';
import useSwipeGestures from '../hooks/useSwipeGestures';

const SwipeDemo = () => {
  const [lastGesture, setLastGesture] = useState(null);
  const [gestureCount, setGestureCount] = useState({ left: 0, right: 0 });

  const swipeRef = useSwipeGestures(
    () => {
      // Deslizar hacia izquierda
      setLastGesture({ direction: 'left', time: Date.now() });
      setGestureCount(prev => ({ ...prev, left: prev.left + 1 }));
      console.log('👈 Deslizamiento hacia izquierda detectado');
    },
    () => {
      // Deslizar hacia derecha
      setLastGesture({ direction: 'right', time: Date.now() });
      setGestureCount(prev => ({ ...prev, right: prev.right + 1 }));
      console.log('👉 Deslizamiento hacia derecha detectado');
    },
    50 // threshold
  );

  const resetDemo = () => {
    setLastGesture(null);
    setGestureCount({ left: 0, right: 0 });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        🖐️ Demostración de Gestos Táctiles
      </h3>
      
      <div
        ref={swipeRef}
        className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-300 flex flex-col items-center justify-center text-center p-4 mb-4 touch-none"
      >
        <div className="text-4xl mb-2">
          {lastGesture?.direction === 'left' && '👈'}
          {lastGesture?.direction === 'right' && '👉'}
          {!lastGesture && '👆'}
        </div>
        
        <p className="text-gray-600 text-sm mb-2">
          Desliza tu dedo hacia izquierda o derecha en esta área
        </p>
        
        {lastGesture && (
          <div className="text-center">
            <p className="text-lg font-semibold text-blue-600 mb-1">
              ¡Gesto detectado!
            </p>
            <p className="text-sm text-gray-500">
              Deslizamiento hacia {lastGesture.direction === 'left' ? 'izquierda' : 'derecha'}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(lastGesture.time).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {gestureCount.left}
          </div>
          <div className="text-xs text-red-600">
            👈 Izquierda
          </div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {gestureCount.right}
          </div>
          <div className="text-xs text-green-600">
            👉 Derecha
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex space-x-2">
        <button
          onClick={resetDemo}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          🔄 Resetear
        </button>
      </div>

      {/* Instrucciones */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">💡 Instrucciones:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• En móvil: Usa tu dedo para deslizar</li>
          <li>• En desktop: Haz click y arrastra</li>
          <li>• Mínimo 50px de distancia</li>
          <li>• Funciona en cualquier dirección</li>
        </ul>
      </div>

      {/* Estado del dispositivo */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500">
          Dispositivo: {
            'ontouchstart' in window 
              ? '📱 Táctil' 
              : '🖱️ Desktop'
          }
        </div>
      </div>
    </div>
  );
};

export default SwipeDemo;
