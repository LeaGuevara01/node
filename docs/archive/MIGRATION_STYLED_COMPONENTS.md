# 🔄 Guía de Migración: StyledComponents → Sistema Modular

## ⚠️ Componentes Deprecados

Los siguientes componentes de `styledComponents.js` están **DEPRECADOS** y serán eliminados en septiembre 2025:

- `StyledPageWrapper`
- `withStyledPage`
- `useStyledPage`
- `StyledForm`
- `StyledList`
- `StyledDashboard`

## 🎯 Migraciones Recomendadas

### 1. StyledPageWrapper → AppLayout + PageContainer

**❌ ANTES (Deprecado):**

```jsx
import { StyledPageWrapper } from '../styles/styledComponents';

function MiPagina() {
  return (
    <StyledPageWrapper
      title="Mi Página"
      subtitle="Descripción de la página"
      loading={loading}
      error={error}
    >
      <div>Contenido...</div>
    </StyledPageWrapper>
  );
}
```

**✅ DESPUÉS (Recomendado):**

```jsx
import AppLayout from '../components/navigation/AppLayout';
import { PageContainer } from '../styles';

function MiPagina({ token, role, onLogout }) {
  return (
    <AppLayout
      title="Mi Página"
      subtitle="Descripción de la página"
      token={token}
      role={role}
      onLogout={onLogout}
      currentSection="mi-seccion"
    >
      <PageContainer>
        <div>Contenido...</div>
      </PageContainer>
    </AppLayout>
  );
}
```

### 2. StyledForm → FormLayout

**❌ ANTES (Deprecado):**

```jsx
import { StyledForm } from '../styles/styledComponents';

function MiFormulario() {
  return (
    <StyledForm
      title="Mi Formulario"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      success={success}
    >
      <input type="text" name="campo" />
    </StyledForm>
  );
}
```

**✅ DESPUÉS (Recomendado):**

```jsx
import { FormLayout, Alert, LoadingState } from '../styles';

function MiFormulario() {
  return (
    <FormLayout title="Mi Formulario">
      {error && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="campo" />

        {loading && <LoadingState message="Procesando..." />}
      </form>
    </FormLayout>
  );
}
```

### 3. StyledList → UniversalList

**❌ ANTES (Deprecado):**

```jsx
import { StyledList } from '../styles/styledComponents';

function MiLista({ items }) {
  return (
    <StyledList
      title="Mi Lista"
      items={items}
      renderItem={(item) => <div>{item.name}</div>}
      emptyMessage="No hay elementos"
      loading={loading}
      error={error}
    />
  );
}
```

**✅ DESPUÉS (Recomendado):**

```jsx
import { UniversalList, ListLayout } from '../styles';

function MiLista({ items }) {
  return (
    <ListLayout title="Mi Lista">
      <UniversalList
        data={items}
        renderItem={(item) => <div>{item.name}</div>}
        emptyMessage="No hay elementos"
        loading={loading}
        error={error}
      />
    </ListLayout>
  );
}
```

### 4. StyledDashboard → PageContainer + StatsGrid

**❌ ANTES (Deprecado):**

```jsx
import { StyledDashboard } from '../styles/styledComponents';

function MiDashboard({ stats }) {
  return (
    <StyledDashboard
      title="Dashboard"
      stats={stats}
      onStatsCardClick={handleCardClick}
      loading={loading}
    >
      <div>Contenido adicional...</div>
    </StyledDashboard>
  );
}
```

**✅ DESPUÉS (Recomendado):**

```jsx
import { PageContainer, StatsGrid } from '../styles';

function MiDashboard({ stats }) {
  return (
    <PageContainer>
      <div className="space-y-6">
        <StatsGrid stats={stats} onCardClick={handleCardClick} variant="default" />

        <div>Contenido adicional...</div>
      </div>
    </PageContainer>
  );
}
```

## 🛠️ Script de Migración Automática

Para ayudarte con la migración, puedes usar el siguiente script:

```bash
# Desde la carpeta client/
node scripts/migrateStyledComponents.js
```

Este script:

- ✅ Identifica archivos que usan componentes deprecados
- ✅ Sugiere reemplazos automáticos
- ✅ Crea backups de archivos modificados
- ✅ Actualiza imports automáticamente

## 📋 Checklist de Migración

### Por Página/Componente:

- [ ] ✅ Identificar uso de componentes deprecados
- [ ] 🔄 Reemplazar con equivalentes modulares
- [ ] 🧪 Probar funcionalidad
- [ ] ✨ Optimizar con nuevas características
- [ ] 📝 Documentar cambios

### Global:

- [ ] 🔍 Escanear toda la aplicación
- [ ] 📊 Crear inventario de archivos afectados
- [ ] ⏰ Planificar migración por prioridades
- [ ] 🎯 Ejecutar migración por fases
- [ ] 🧹 Limpiar imports no utilizados

## 🎁 Beneficios del Nuevo Sistema

### ✨ Ventajas del Sistema Modular:

1. **🧩 Composición**: Combina componentes según necesidad
2. **⚡ Performance**: Tree-shaking y lazy loading mejorado
3. **🎨 Flexibilidad**: Más control sobre estilos y layout
4. **🔧 Mantenibilidad**: Componentes más pequeños y especializados
5. **📱 Responsive**: Mejor soporte para diseño adaptativo
6. **♿ Accesibilidad**: Componentes optimizados para a11y

### 📈 Nuevas Características:

- **Design Tokens**: Sistema de tokens consistente
- **Theme Support**: Soporte para temas claro/oscuro
- **Advanced Layouts**: Layouts más sofisticados
- **Smart Components**: Componentes con lógica inteligente
- **Better TypeScript**: Mejor tipado y autocompletado

## 🚀 Ejemplos Avanzados

### Dashboard Moderno con Nuevo Sistema:

```jsx
import { AppLayout, PageContainer, StatsGrid, Card, ResponsiveGrid } from '../styles';

function DashboardModerno({ token, role, onLogout }) {
  return (
    <AppLayout
      title="Dashboard Moderno"
      currentSection="dashboard"
      token={token}
      role={role}
      onLogout={onLogout}
    >
      <PageContainer className="space-y-6">
        {/* Estadísticas principales */}
        <StatsGrid stats={stats} variant="agricultural" onCardClick={handleNavigate} />

        {/* Grid de contenido */}
        <ResponsiveGrid columns="auto-fit">
          <Card title="Actividad Reciente">{/* Contenido */}</Card>

          <Card title="Alertas del Sistema">{/* Contenido */}</Card>
        </ResponsiveGrid>
      </PageContainer>
    </AppLayout>
  );
}
```

### Formulario Avanzado:

```jsx
import { AppLayout, FormLayout, Card, FormButtonGroup, SaveButton, CancelButton } from '../styles';

function FormularioAvanzado() {
  return (
    <AppLayout title="Formulario Avanzado">
      <FormLayout>
        <Card title="Información Básica">{/* Campos del formulario */}</Card>

        <Card title="Configuración Avanzada">{/* Más campos */}</Card>

        <FormButtonGroup>
          <SaveButton onClick={handleSave} loading={saving} />
          <CancelButton onClick={handleCancel} />
        </FormButtonGroup>
      </FormLayout>
    </AppLayout>
  );
}
```

## 📞 Soporte

Si tienes dudas durante la migración:

1. 📖 Consulta la documentación completa en `/docs/DESIGN_SYSTEM.md`
2. 🔍 Revisa ejemplos en `/src/pages/examples/`
3. 🧪 Usa el playground en `/src/pages/StyleExamples.jsx`
4. 📝 Crea un issue si encuentras problemas

## 🗓️ Timeline

- **🔔 Agosto 2025**: Marcado como deprecado + warnings
- **📢 Septiembre 2025**: Migración recomendada completa
- **🗑️ Octubre 2025**: Eliminación de componentes deprecados

¡La migración mejorará significativamente la mantenibilidad y flexibilidad de tu aplicación! 🎉
