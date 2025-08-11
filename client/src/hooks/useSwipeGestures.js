/**
 * useSwipeGestures - Hook para manejar gestos táctiles
 * 
 * Detecta gestos de deslizamiento hacia izquierda y derecha
 * para controlar el sidebar móvil
 * 
 * @param {Function} onSwipeLeft - Callback para deslizar izquierda
 * @param {Function} onSwipeRight - Callback para deslizar derecha
 * @param {number} threshold - Distancia mínima para activar gesto (default: 50px)
 */

import { useEffect, useRef } from 'react';

const useSwipeGestures = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const startX = useRef(0);
  const startY = useRef(0);
  const startTime = useRef(0);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let isTracking = false;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      startTime.current = Date.now();
      isTracking = true;
    };

    const handleTouchMove = (e) => {
      if (!isTracking) return;
      
      // Prevenir scroll vertical durante el gesto horizontal
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - startX.current);
      const deltaY = Math.abs(touch.clientY - startY.current);
      
      if (deltaX > deltaY && deltaX > 10) {
        // Solo prevenir el comportamiento por defecto si el evento es cancelable
        // para evitar el warning: "Ignored attempt to cancel a touchmove event with cancelable=false"
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (!isTracking) return;
      
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();
      
      const deltaX = endX - startX.current;
      const deltaY = endY - startY.current;
      const deltaTime = endTime - startTime.current;
      
      // Verificar si es un gesto válido
      const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
      const isQuickSwipe = deltaTime < 300; // Menos de 300ms
      const isLongEnoughSwipe = Math.abs(deltaX) > threshold;
      
      if (isHorizontalSwipe && (isQuickSwipe || isLongEnoughSwipe)) {
        if (deltaX > 0 && onSwipeRight) {
          // Deslizar hacia la derecha (abrir sidebar)
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          // Deslizar hacia la izquierda (cerrar sidebar)
          onSwipeLeft();
        }
      }
      
      isTracking = false;
    };

    const handleTouchCancel = () => {
      isTracking = false;
    };

    // Añadir event listeners con passive: false para poder usar preventDefault
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return elementRef;
};

export default useSwipeGestures;
