/**
 * Ejemplos de Implementación Modular de Estilos
 * 
 * Este archivo muestra diferentes formas de aplicar el sistema
 * de estilos modulares a páginas existentes.
 */

import React, { useState, useEffect } from 'react';
import {
  StyledPageWrapper,
  withStyledPage,
  useStyledPage,
  StyledForm,
  StyledList,
  StyledDashboard,
  ContentSection,
  Alert,
  PageLayout
} from '../styles';

// ===== EJEMPLO 1: Página simple con wrapper =====

function SimplePageExample() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  return (
    <StyledPageWrapper
      title="Mi Página Simple"
      subtitle="Ejemplo de página con estilos automáticos"
      showBackButton={true}
      onBack={() => console.log('Volver')}
    >
      <ContentSection title="Contenido Principal">
        <p>Este es el contenido de mi página con estilos aplicados automáticamente.</p>
      </ContentSection>
    </StyledPageWrapper>
  );
}

// ===== EJEMPLO 2: Usar HOC (Higher Order Component) =====

function MyPageComponent({ pageState }) {
  const { loading, setLoading, setSuccess, setErrorState } = pageState;

  const handleLoad = async () => {
    setLoading(true);
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess({ message: 'Datos cargados exitosamente' });
    } catch (error) {
      setErrorState('Error al cargar datos');
    }
  };

  return (
    <ContentSection title="Mi Componente">
      <button 
        onClick={handleLoad}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Cargar Datos
      </button>
    </ContentSection>
  );
}

const StyledMyPage = withStyledPage(MyPageComponent, {
  title: "Mi Página con HOC",
  subtitle: "Usando Higher Order Component",
  showBackButton: true,
  initialLoading: false
});

// ===== EJEMPLO 3: Usar hook personalizado =====

function HookBasedPage() {
  const { StyledPage, pageState } = useStyledPage({
    title: "Página con Hook",
    subtitle: "Usando hook personalizado",
    initialLoading: false
  });

  return (
    <StyledPage>
      <ContentSection title="Contenido con Hook">
        <p>Esta página usa el hook useStyledPage para gestionar estilos.</p>
        <Alert type="success" title="Éxito">
          Página cargada correctamente con estilos automáticos.
        </Alert>
      </ContentSection>
    </StyledPage>
  );
}

// ===== EJEMPLO 4: Formulario con estilos automáticos =====

function AutoStyledFormExample() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Formulario enviado correctamente');
      setFormData({ name: '', email: '' });
    } catch (err) {
      setError('Error al enviar formulario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <StyledForm
        title="Formulario de Ejemplo"
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        success={success}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </StyledForm>
    </PageLayout>
  );
}

// ===== EJEMPLO 5: Lista con estilos automáticos =====

function AutoStyledListExample() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      try {
        setItems([
          { id: 1, name: 'Item 1', description: 'Descripción del item 1' },
          { id: 2, name: 'Item 2', description: 'Descripción del item 2' },
          { id: 3, name: 'Item 3', description: 'Descripción del item 3' },
        ]);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar items');
        setLoading(false);
      }
    }, 1000);
  }, []);

  const renderItem = (item) => (
    <div key={item.id} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
      <h3 className="font-medium text-gray-900">{item.name}</h3>
      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
    </div>
  );

  return (
    <PageLayout>
      <StyledList
        title="Lista de Elementos"
        items={items}
        renderItem={renderItem}
        loading={loading}
        error={error}
        emptyMessage="No hay elementos disponibles"
        emptyIcon="📋"
      />
    </PageLayout>
  );
}

// ===== EJEMPLO 6: Dashboard con estilos automáticos =====

function AutoStyledDashboardExample() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de estadísticas
    setTimeout(() => {
      setStats({
        maquinarias: 25,
        repuestos: 150,
        proveedores: 12,
        reparaciones: 8
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleStatsCardClick = (type) => {
    console.log(`Navegando a: ${type}`);
    alert(`Navegando a sección: ${type}`);
  };

  return (
    <StyledDashboard
      title="Dashboard Automático"
      subtitle="Dashboard con estilos aplicados automáticamente"
      stats={stats}
      onStatsCardClick={handleStatsCardClick}
      loading={loading}
    >
      <ContentSection title="Información Adicional">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900">Actividad Reciente</h3>
            <p className="text-blue-700 text-sm mt-1">Sin actividad reciente</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900">Estado del Sistema</h3>
            <p className="text-green-700 text-sm mt-1">Todos los sistemas operativos</p>
          </div>
        </div>
      </ContentSection>
    </StyledDashboard>
  );
}

// ===== EJEMPLO 7: Migración de página existente =====

// Página original (sin estilos modulares)
function OriginalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pl-12 md:pl-60">
        <div className="px-4 py-4">
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h1 className="text-2xl font-bold">Mi Página Original</h1>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Contenido de la página original</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Página migrada (con estilos modulares)
function MigratedPage() {
  return (
    <StyledPageWrapper
      title="Mi Página Migrada"
      subtitle="Página migrada al sistema modular"
    >
      <ContentSection>
        <p>Contenido de la página migrada con estilos automáticos</p>
      </ContentSection>
    </StyledPageWrapper>
  );
}

// ===== EXPORTACIONES =====

export {
  SimplePageExample,
  StyledMyPage,
  HookBasedPage,
  AutoStyledFormExample,
  AutoStyledListExample,
  AutoStyledDashboardExample,
  OriginalPage,
  MigratedPage
};

export default {
  SimplePageExample,
  StyledMyPage,
  HookBasedPage,
  AutoStyledFormExample,
  AutoStyledListExample,
  AutoStyledDashboardExample,
  OriginalPage,
  MigratedPage
};
