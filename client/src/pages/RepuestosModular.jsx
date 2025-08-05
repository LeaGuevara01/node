/**
 * Página de Repuestos usando el Sistema Modular
 * Ejemplo de implementación del nuevo sistema de componentes
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import UniversalList from '../components/shared/UniversalList';

const RepuestosPage = ({ token }) => {
  const navigate = useNavigate();

  // Configuración de campos para mostrar
  const fields = [
    {
      key: 'nombre',
      label: 'Nombre',
      format: (value) => value || 'Sin nombre'
    },
    {
      key: 'codigo',
      label: 'Código'
    },
    {
      key: 'categoria',
      label: 'Categoría'
    },
    {
      key: 'ubicacion',
      label: 'Ubicación'
    },
    {
      key: 'cantidad',
      label: 'Stock',
      format: (value) => `${value || 0} unidades`
    },
    {
      key: 'precio',
      label: 'Precio',
      format: (value) => value ? `$${parseFloat(value).toLocaleString()}` : 'N/A'
    }
  ];

  // Configuración de filtros inteligentes
  const filterConfig = [
    {
      key: 'search',
      type: 'text',
      label: 'Buscar',
      placeholder: 'Buscar por nombre, código o descripción...'
    },
    {
      key: 'categoria',
      type: 'select',
      label: 'Categoría',
      placeholder: 'Todas las categorías',
      options: [
        { value: 'motor', label: 'Motor' },
        { value: 'transmision', label: 'Transmisión' },
        { value: 'hidraulico', label: 'Sistema Hidráulico' },
        { value: 'electrico', label: 'Sistema Eléctrico' },
        { value: 'neumatico', label: 'Neumáticos' },
        { value: 'filtros', label: 'Filtros' },
        { value: 'aceites', label: 'Aceites y Lubricantes' },
        { value: 'otros', label: 'Otros' }
      ]
    },
    {
      key: 'ubicacion',
      type: 'select',
      label: 'Ubicación',
      placeholder: 'Todas las ubicaciones',
      options: [
        { value: 'deposito', label: 'Depósito Principal' },
        { value: 'taller', label: 'Taller' },
        { value: 'oficina', label: 'Oficina' },
        { value: 'campo', label: 'Campo' }
      ]
    },
    {
      key: 'stockRange',
      type: 'range',
      label: 'Rango de Stock',
      minKey: 'stockMin',
      maxKey: 'stockMax',
      minPlaceholder: 'Min',
      maxPlaceholder: 'Max'
    },
    {
      key: 'estado',
      type: 'status',
      label: 'Estado de Stock',
      statusType: 'stock'
    },
    {
      key: 'sinStock',
      type: 'select',
      label: 'Stock',
      placeholder: 'Todos',
      options: [
        { value: 'true', label: 'Solo sin stock' },
        { value: 'false', label: 'Solo con stock' }
      ]
    }
  ];

  // Configuración de estado visual
  const statusConfig = {
    type: 'stock',
    field: 'estado',
    data: (item) => ({
      cantidad: item.cantidad,
      stockMinimo: item.stockMinimo || 10
    })
  };

  // Configuración de acciones
  const actions = [
    {
      type: 'view',
      action: (item) => navigate(`/repuestos/${item.id}`)
    },
    {
      type: 'edit',
      action: (item) => navigate(`/repuestos/${item.id}/edit`)
    },
    {
      type: 'delete',
      action: (item) => {
        if (window.confirm(`¿Estás seguro de eliminar el repuesto "${item.nombre}"?`)) {
          // Lógica de eliminación
          console.log('Eliminar repuesto:', item);
        }
      }
    }
  ];

  // Handlers
  const handleItemClick = (item) => {
    navigate(`/repuestos/${item.id}`);
  };

  const handleCreateNew = () => {
    navigate('/repuestos/nuevo');
  };

  const handleExport = () => {
    // Lógica de exportación
    console.log('Exportar repuestos');
  };

  return (
    <UniversalList
      title="Gestión de Repuestos"
      subtitle="Administra el inventario de repuestos y componentes"
      apiEndpoint={`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/repuestos`}
      
      fields={fields}
      filterConfig={filterConfig}
      statusConfig={statusConfig}
      actions={actions}
      
      onItemClick={handleItemClick}
      onCreateNew={handleCreateNew}
      onExport={handleExport}
      
      pageSize={20}
      enableSearch={true}
      enableFilters={true}
      enablePagination={true}
      enableExport={true}
      
      storageKey="repuestos_filters"
    />
  );
};

export default RepuestosPage;
