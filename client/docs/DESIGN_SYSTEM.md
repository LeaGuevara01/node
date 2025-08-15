# 🎨 Sistema de Design Tokens y Componentes Modulares

## 📋 Descripción General

Este sistema proporciona una arquitectura completa de design tokens, componentes reutilizables y filtros inteligentes para la aplicación agrícola. Está diseñado para garantizar consistencia visual, facilitar el mantenimiento y acelerar el desarrollo.

## 🏗️ Arquitectura del Sistema

### 1. **Design Tokens** (`/styles/tokens/`)

- `designTokens.js` - Valores base del sistema (colores, tipografía, espaciado)
- `componentVariants.js` - Variantes de componentes reutilizables
- `visualStatus.js` - Estados visuales para entidades del sistema

### 2. **Componentes Modulares** (`/components/shared/`)

- `Button.jsx` - Sistema universal de botones
- `StatusBadge.jsx` - Componente inteligente de estados
- `Layout.jsx` - Componentes de layout responsivo
- `SmartFilters.jsx` - Sistema de filtros con tokens
- `UniversalList.jsx` - Listado modular reutilizable

### 3. **Estilos Migrados** (`/styles/`)

- Estilos existentes actualizados para usar design tokens
- Compatibilidad total con componentes actuales

## 🚀 Inicio Rápido

### Importación Básica

```jsx
import { Button, StatusBadge, UniversalList, DESIGN_TOKENS } from '../styles';
```

### Uso de Design Tokens

```jsx
// En componentes
import { DESIGN_TOKENS } from '../styles/tokens/designTokens';

const { colors, spacing, typography } = DESIGN_TOKENS;

// En CSS/Tailwind (ya configurado)
className = 'bg-agricultural-crop-500 text-white p-lg';
```

## 🎯 Componentes Principales

### 1. Button Universal

```jsx
import { Button, SaveButton, CreateButton } from '../styles';

// Botón básico
<Button variant="primary" size="md" icon="💾">
  Guardar
</Button>

// Botones predefinidos
<SaveButton loading={saving} onClick={handleSave} />
<CreateButton onClick={handleCreate} />

// Grupos de botones
<FormButtonGroup
  onSave={handleSave}
  onCancel={handleCancel}
  loading={loading}
/>
```

### 2. StatusBadge Inteligente

```jsx
import { StatusBadge, StatusFilter } from '../styles';

// Badge automático para stock
<StatusBadge
  type="stock"
  data={{ cantidad: 5, stockMinimo: 10 }}
  showIcon={true}
/>

// Badge para estados de maquinaria
<StatusBadge
  type="maquinaria"
  status="operativa"
  interactive
  onClick={handleStatusClick}
/>

// Filtro de estados
<StatusFilter
  type="stock"
  selectedStatus={selectedStatus}
  onStatusChange={setSelectedStatus}
  showCounts={true}
  counts={statusCounts}
/>
```

### 3. Layout Responsivo

```jsx
import { PageContainer, ContentContainer, Card, ResponsiveGrid } from '../styles';

function MyPage() {
  return (
    <PageContainer theme="agricultural">
      <ContentContainer maxWidth="7xl">
        <Card variant="agricultural" padding="lg">
          <ResponsiveGrid columns="stats">{/* Contenido */}</ResponsiveGrid>
        </Card>
      </ContentContainer>
    </PageContainer>
  );
}
```

### 4. Filtros Inteligentes

```jsx
import { SmartFilterPanel, useSmartFilters, TextFilter, SelectFilter } from '../styles';

function MyListPage() {
  const { filters, applyFilter, saveCurrentFilter, applySavedFilter, hasActiveFilters } =
    useSmartFilters({}, 'my_page_filters');

  return (
    <SmartFilterPanel
      onApply={() => fetchData(filters)}
      onSave={saveCurrentFilter}
      hasActiveFilters={hasActiveFilters}
    >
      <TextFilter
        label="Buscar"
        value={filters.search}
        onChange={(value) => applyFilter({ search: value })}
      />

      <SelectFilter
        label="Categoría"
        value={filters.categoria}
        onChange={(value) => applyFilter({ categoria: value })}
        options={categoriaOptions}
      />
    </SmartFilterPanel>
  );
}
```

### 5. UniversalList - Listado Modular

```jsx
import UniversalList from '../components/shared/UniversalList';

function RepuestosPage() {
  const fields = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'codigo', label: 'Código' },
    {
      key: 'precio',
      label: 'Precio',
      format: (value) => `$${value.toLocaleString()}`,
    },
  ];

  const filterConfig = [
    {
      key: 'search',
      type: 'text',
      label: 'Buscar',
      placeholder: 'Buscar repuestos...',
    },
    {
      key: 'categoria',
      type: 'select',
      label: 'Categoría',
      options: categoriaOptions,
    },
  ];

  return (
    <UniversalList
      title="Repuestos"
      apiEndpoint="/api/repuestos"
      fields={fields}
      filterConfig={filterConfig}
      statusConfig={{
        type: 'stock',
        field: 'estado',
        data: (item) => ({ cantidad: item.cantidad, stockMinimo: 10 }),
      }}
      onCreateNew={() => navigate('/repuestos/nuevo')}
    />
  );
}
```

## 🎨 Sistema de Temas

### Colores Agrícolas

```jsx
// Paleta principal
colors: {
  agricultural: {
    earth: { 500: '#8b966e' },    // Verde tierra
    crop: { 500: '#22c55e' },     // Verde cultivo
    sky: { 500: '#0ea5e9' },      // Azul cielo
    machinery: { 500: '#f59e0b' }, // Dorado maquinaria
    soil: { 500: '#bfa094' }      // Marrón tierra
  }
}

// Uso en Tailwind
className="bg-agricultural-crop-500 text-agricultural-earth-900"
```

### Gradientes Temáticos

```jsx
// Predefinidos en Tailwind
className = 'bg-gradient-agricultural'; // Verde
className = 'bg-gradient-machinery'; // Dorado
className = 'bg-gradient-earth'; // Tierra
className = 'bg-gradient-sky'; // Azul
```

## 🔧 Estados Visuales

### Tipos de Estado Disponibles

1. **Maquinaria**: `operativa`, `mantenimiento`, `reparacion`, `inactiva`
2. **Stock**: `alto`, `normal`, `bajo`, `critico`, `agotado`
3. **Reparaciones**: `pendiente`, `enProgreso`, `completada`, `cancelada`
4. **Proveedores**: `activo`, `inactivo`, `bloqueado`
5. **Usuarios**: `activo`, `inactivo`, `suspendido`

### Uso Automático

```jsx
// El componente calcula automáticamente el estado del stock
<StatusBadge type="stock" data={{ cantidad: 3, stockMinimo: 10 }} />
// Resultado: Badge rojo "Stock Bajo"
```

## 📊 Filtros con Tokens

### Características

- **Persistencia**: Los filtros se guardan en localStorage
- **Tokens compartibles**: URLs con estado de filtros
- **Filtros guardados**: Los usuarios pueden guardar configuraciones
- **Sincronización URL**: Los filtros se reflejan en la URL

### Tipos de Filtro

1. **TextFilter**: Búsqueda de texto
2. **SelectFilter**: Lista desplegable
3. **RangeFilter**: Rango numérico (min-max)
4. **DateFilter**: Rango de fechas
5. **StatusFilter**: Filtro por estados visuales

## 🚀 Migración de Componentes Existentes

### Paso 1: Importar el Sistema

```jsx
// Antes
import { DETAILS_CONTAINER } from '../styles/detailsStyles';

// Después
import { DETAILS_CONTAINER, Card, Button, StatusBadge } from '../styles';
```

### Paso 2: Reemplazar Estilos

```jsx
// Antes
<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

// Después
<Card variant="default" padding="lg">
```

### Paso 3: Usar Componentes Modulares

```jsx
// Antes
<button
  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
  onClick={handleSave}
>
  Guardar
</button>

// Después
<SaveButton onClick={handleSave} loading={saving} />
```

## 📈 Beneficios del Sistema

### 🎯 **Consistencia**

- Colores, espaciado y tipografía unificados
- Comportamientos predecibles entre componentes
- Estados visuales estandardizados

### 🚀 **Productividad**

- Componentes listos para usar
- Menos código duplicado
- Desarrollo más rápido

### 🔧 **Mantenibilidad**

- Cambios centralizados
- Fácil actualización de estilos
- Componentes testeable

### 📱 **Responsive Design**

- Layouts adaptativos automáticos
- Breakpoints consistentes
- Mobile-first approach

## 🛠️ Herramientas de Desarrollo

### VS Code Extensions Recomendadas

- **Tailwind CSS IntelliSense**: Autocompletado de clases
- **ES7+ React/Redux/React-Native snippets**: Snippets de React

### Scripts NPM

```bash
# Desarrollo con hot reload
npm run dev

# Build de producción
npm run build

# Linting de estilos
npm run lint:css
```

## 📝 Ejemplos Prácticos

### Dashboard con Métricas

```jsx
import { PageContainer, ContentContainer, ResponsiveGrid, Card, StatusSummary } from '../styles';

function Dashboard({ data }) {
  return (
    <PageContainer theme="agricultural">
      <ContentContainer>
        <ResponsiveGrid columns="stats">
          <Card variant="stats">
            <h3>Total Maquinarias</h3>
            <p className="text-3xl font-bold">{data.maquinarias}</p>
          </Card>

          <Card variant="stats">
            <h3>Repuestos</h3>
            <p className="text-3xl font-bold">{data.repuestos}</p>
          </Card>
        </ResponsiveGrid>

        <StatusSummary type="stock" data={data.repuestos} statusField="estado" />
      </ContentContainer>
    </PageContainer>
  );
}
```

### Formulario con Validación

```jsx
import { FormLayout, Button, FormButtonGroup } from '../styles';

function RepuestoForm() {
  return (
    <FormLayout title="Nuevo Repuesto" subtitle="Agregar repuesto al inventario">
      <form onSubmit={handleSubmit}>
        {/* Campos del formulario */}

        <FormButtonGroup
          onSave={handleSave}
          onCancel={() => navigate('/repuestos')}
          loading={saving}
        />
      </form>
    </FormLayout>
  );
}
```

## 🔄 Actualizaciones Futuras

### Roadmap

1. **Modo Oscuro**: Soporte para tema dark
2. **Más Componentes**: DataTable, DatePicker, etc.
3. **Animaciones**: Sistema de animaciones más rico
4. **Accesibilidad**: Mejoras de a11y
5. **Internacionalización**: Soporte i18n

### Contribuir

- Reportar bugs en el sistema de diseño
- Proponer nuevos componentes
- Mejorar la documentación
- Optimizar performance

---

**🌾 Sistema desarrollado para la excelencia en UX agrícola**

**✨ Consistente • Modular • Escalable • Responsive**
