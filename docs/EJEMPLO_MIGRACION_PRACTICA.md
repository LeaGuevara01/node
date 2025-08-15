# 🎯 Ejemplo Práctico de Migración

## Archivo: MaquinariaFormModular.jsx

### ❌ ANTES (con StyledPageWrapper)

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor } from 'lucide-react';
import Papa from 'papaparse';
import {
  createMaquinaria,
  getMaquinarias,
  updateMaquinaria,
  deleteMaquinaria,
} from '../services/api';

// Sistema deprecado
import {
  StyledPageWrapper,
  StyledForm,
  StyledList,
  ContentSection,
  Alert,
  LoadingState,
} from '../styles';

function MaquinariaFormModular({ token, role, onLogout }) {
  // ... lógica del componente ...

  return (
    <StyledPageWrapper
      title="Gestión de Maquinarias"
      subtitle="Administra el inventario de maquinarias agrícolas"
      loading={pageState.loading}
      error={pageState.error}
    >
      {/* Formulario */}
      <StyledForm
        title="Nueva Maquinaria"
        onSubmit={handleSubmit}
        loading={saving}
        error={error}
        success={success}
      >
        {/* campos del formulario */}
      </StyledForm>

      {/* Lista de maquinarias */}
      <StyledList
        title="Maquinarias Registradas"
        items={maquinarias}
        renderItem={renderMaquinariaCard}
        loading={loading}
        error={error}
      />
    </StyledPageWrapper>
  );
}
```

### ✅ DESPUÉS (con Sistema Modular)

```jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor } from 'lucide-react';
import Papa from 'papaparse';
import {
  createMaquinaria,
  getMaquinarias,
  updateMaquinaria,
  deleteMaquinaria,
} from '../services/api';

// Nuevo sistema modular
import AppLayout from '../components/navigation/AppLayout';
import {
  PageContainer,
  FormLayout,
  UniversalList,
  ListLayout,
  Card,
  Alert,
  LoadingState,
} from '../styles';

function MaquinariaFormModular({ token, role, onLogout }) {
  // ... lógica del componente ...

  return (
    <AppLayout
      title="Gestión de Maquinarias"
      subtitle="Administra el inventario de maquinarias agrícolas"
      currentSection="maquinarias"
      token={token}
      role={role}
      onLogout={onLogout}
    >
      <PageContainer className="space-y-6">
        {/* Formulario con nuevo sistema */}
        <Card>
          <FormLayout title="Nueva Maquinaria">
            {error && <Alert type="error">{error}</Alert>}
            {success && <Alert type="success">{success}</Alert>}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* campos del formulario */}

              {saving && <LoadingState message="Guardando..." />}
            </form>
          </FormLayout>
        </Card>

        {/* Lista con nuevo sistema */}
        <Card>
          <ListLayout title="Maquinarias Registradas">
            <UniversalList
              data={maquinarias}
              renderItem={renderMaquinariaCard}
              loading={loading}
              error={error}
              emptyMessage="No hay maquinarias registradas"
              emptyIcon={<Tractor className="w-16 h-16 text-gray-400" />}
            />
          </ListLayout>
        </Card>
      </PageContainer>
    </AppLayout>
  );
}
```

## 🔄 Pasos de la Migración

### 1. Actualizar Imports

```jsx
// ❌ Eliminar
import { StyledPageWrapper, StyledForm, StyledList } from '../styles';

// ✅ Agregar
import AppLayout from '../components/navigation/AppLayout';
import { PageContainer, FormLayout, UniversalList, ListLayout, Card } from '../styles';
```

### 2. Cambiar el Wrapper Principal

```jsx
// ❌ Antes
<StyledPageWrapper title="Mi Título" loading={loading}>

// ✅ Después
<AppLayout
  title="Mi Título"
  currentSection="mi-seccion"
  token={token}
  role={role}
  onLogout={onLogout}
>
  <PageContainer>
```

### 3. Migrar Formularios

```jsx
// ❌ Antes
<StyledForm title="Mi Form" onSubmit={submit} loading={loading} error={error}>
  <input />
</StyledForm>

// ✅ Después
<FormLayout title="Mi Form">
  {error && <Alert type="error">{error}</Alert>}
  <form onSubmit={submit}>
    <input />
    {loading && <LoadingState />}
  </form>
</FormLayout>
```

### 4. Migrar Listas

```jsx
// ❌ Antes
<StyledList
  title="Mi Lista"
  items={items}
  renderItem={renderItem}
  loading={loading}
/>

// ✅ Después
<ListLayout title="Mi Lista">
  <UniversalList
    data={items}
    renderItem={renderItem}
    loading={loading}
  />
</ListLayout>
```

## 💡 Beneficios Obtenidos

### ✨ Mejoras Técnicas:

- **Mejor separación de responsabilidades**
- **Más flexibilidad en el layout**
- **Mejor performance con tree-shaking**
- **Componentes más testeable individualmente**

### 🎨 Mejoras Visuales:

- **Navegación consistente con AppLayout**
- **Breadcrumbs automáticos**
- **Mejor responsive design**
- **Sidebar unificado**

### 🛠️ Mejoras de Desarrollo:

- **Mejor autocompletado con TypeScript**
- **Componentes más modulares**
- **Easier debugging**
- **Mejor documentación**

¡La migración es relativamente sencilla y los beneficios valen mucho la pena! 🚀
