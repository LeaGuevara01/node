import React from 'react';
import AppLayout from '../components/navigation/AppLayout';

function ContextPlaceholder({ token, role, onLogout }) {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const [, , tipo, valor] = path.split('/');
  const decoded = valor ? decodeURIComponent(valor) : '';
  const titleMap = {
    categoria: 'Contexto de Categoría',
    ubicacion: 'Contexto de Ubicación'
  };

  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Contexto' },
    { label: titleMap[tipo] || tipo }
  ];

  return (
    <AppLayout
      currentSection="contexto"
      breadcrumbs={breadcrumbs}
      title={titleMap[tipo] || 'Contexto'}
      subtitle={`Valor: ${decoded}`}
      token={token}
      role={role}
      onLogout={onLogout}
    >
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-700">
          Esta es una página placeholder para futuras implementaciones de contexto
          (estadísticas de stock, mapa operativo, esquema categórico, repuestos y reparaciones asociadas, etc.).
        </p>
      </div>
    </AppLayout>
  );
}

export default ContextPlaceholder;
