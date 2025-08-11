/**
 * Página de detalles de Maquinaria refactorizada
 * 
 * Esta página utiliza el nuevo sistema de navegación:
 * - AppLayout para layout consistente
 * - NavigationButtons para botones estándar
 * - Breadcrumbs automáticos
 * - Contexto de navegación para manejo de rutas
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Tractor, 
  Building2, 
  ClipboardList, 
  Calendar, 
  Hash, 
  MapPin, 
  Tag,
  FileText,
  DollarSign,
  Wrench,
  Edit
} from 'lucide-react';
import { getMaquinariaById, updateMaquinaria } from '../services/api';
import AppLayout from '../components/navigation/AppLayout';
import { BackButton, EditButton, DeleteButton } from '../components/navigation/NavigationButtons';
import { useNavigation } from '../hooks/useNavigation';
import { getColorFromString } from '../utils/colorUtils';
import { getEstadoColorClass, formatFechaDetalle } from '../utils/maquinariaUtils';
import { 
  CONTAINER_STYLES, 
  INPUT_STYLES, 
  BUTTON_STYLES, 
  LAYOUT_STYLES,
  ICON_STYLES,
  TEXT_STYLES,
  ALERT_STYLES,
  LIST_STYLES
} from '../styles/repuestoStyles';

function MaquinariaDetailsRefactored({ token }) {
  const { id } = useParams();
  const { navigateToListPage, navigateToFormPage } = useNavigation();
  
  // Estados
  const [maquinaria, setMaquinaria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  /**
   * Cargar datos de la maquinaria
   */
  const fetchMaquinaria = async () => {
    try {
      setLoading(true);
      const data = await getMaquinariaById(id, token);
      setMaquinaria(data);
      setError('');
    } catch (err) {
      console.error('Error loading maquinaria:', err);
      setError('Error al cargar los detalles de la maquinaria');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja la actualización rápida de estado
   */
  const handleQuickStatusUpdate = async (newStatus) => {
    if (!maquinaria) return;
    
    try {
      setUpdating(true);
      await updateMaquinaria(id, { ...maquinaria, estado: newStatus }, token);
      setMaquinaria({ ...maquinaria, estado: newStatus });
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Error al actualizar el estado');
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Maneja la eliminación de la maquinaria
   */
  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta maquinaria?')) {
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/maquinarias/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Regresar a la lista después de eliminar
        navigateToListPage('maquinarias');
      } else {
        setError('Error al eliminar la maquinaria');
      }
    } catch (err) {
      setError('Error al eliminar la maquinaria');
    } finally {
      setUpdating(false);
    }
  };

  // Handler de edición: navegar al formulario de edición
  const handleEdit = () => {
    if (!id) return;
    navigateToFormPage('maquinarias', id);
  };

  // Cargar datos al montar
  useEffect(() => {
    fetchMaquinaria();
  }, [id, token]);

  // Definir breadcrumbs
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Maquinarias', href: '/maquinarias' },
    { label: maquinaria?.nombre || `Maquinaria #${id}` }
  ];

  // Acciones de la página (si se necesitan adicionales, evitar duplicar editar/eliminar con el header)
  const pageActions = null;

  // Estado de carga
  if (loading) {
    return (
      <AppLayout
        currentSection="maquinarias"
        breadcrumbs={breadcrumbs}
        title="Detalles de Maquinaria"
        token={token}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando detalles...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Estado de error
  if (error && !maquinaria) {
    return (
      <AppLayout
        currentSection="maquinarias"
        breadcrumbs={breadcrumbs}
        title="Error"
        token={token}
      >
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <div className={ALERT_STYLES.error}>
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <BackButton 
              onClick={() => navigateToListPage('maquinarias')}
              label="Volver a Maquinarias"
            />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      currentSection="maquinarias"
      breadcrumbs={breadcrumbs}
  title={`Detalles: ${maquinaria?.nombre || 'Maquinaria'}`}
      subtitle={`${maquinaria?.marca || ''} ${maquinaria?.modelo || ''}`}
  actions={pageActions}
  isDetails={true}
  detailsInfo={{ categoria: maquinaria?.categoria }}
  onEdit={handleEdit}
  onDelete={handleDelete}
  showSearch={true}
      token={token}
    >
      <div className="space-y-6">
        
        {/* Mensaje de error */}
        {error && (
          <div className={ALERT_STYLES.error}>
            {error}
          </div>
        )}

        {/* Información principal */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Columna izquierda - Información básica */}
            <div className="lg:col-span-2">
              <h3 className={`${TEXT_STYLES.subtitle} mb-4`}>Información General</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <FieldDisplay 
                  label="Nombre"
                  value={maquinaria.nombre}
                  icon={<Tractor size={16} className="text-green-600" />}
                />
                
                <FieldDisplay 
                  label="Marca"
                  value={maquinaria.marca}
                  icon={<Building2 size={16} className="text-blue-600" />}
                />
                
                <FieldDisplay 
                  label="Modelo"
                  value={maquinaria.modelo}
                  icon={<ClipboardList size={16} className="text-purple-600" />}
                />
                
                <FieldDisplay 
                  label="Año"
                  value={maquinaria.anio}
                  icon={<Calendar size={16} className="text-orange-600" />}
                />
                
                <FieldDisplay 
                  label="Número de Serie"
                  value={maquinaria.numero_serie}
                  icon={<Hash size={16} className="text-gray-600" />}
                />
                
                <FieldDisplay 
                  label="Ubicación"
                  value={maquinaria.ubicacion}
                  icon={<MapPin size={16} className="text-red-600" />}
                />
                
                <FieldDisplay 
                  label="Categoría"
                  value={maquinaria.categoria}
                  icon={<Tag size={16} className="text-indigo-600" />}
                  badge={false}
                />
                
              </div>
              
              {/* Descripción */}
              {maquinaria.descripcion && (
                <div className="mt-6">
                  <FieldDisplay 
                    label="Descripción"
                    value={maquinaria.descripcion}
                    icon={<FileText size={16} className="text-slate-600" />}
                    multiline={true}
                  />
                </div>
              )}
            </div>

            {/* Columna derecha - Estado y acciones */}
            <div>
              <h3 className={`${TEXT_STYLES.subtitle} mb-4`}>Estado y Control</h3>
              
              {/* Estado actual */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Estado Actual</div>
                <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getEstadoColorClass(maquinaria.estado)}`}>
                  {maquinaria.estado || 'Sin estado'}
                </div>
              </div>

              {/* Acciones rápidas de estado */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-3">Cambiar Estado:</div>
                <div className="space-y-2">
                  {['Operativa', 'En mantenimiento', 'Averiada', 'Fuera de servicio'].map((estado) => (
                    <button
                      key={estado}
                      onClick={() => handleQuickStatusUpdate(estado)}
                      disabled={updating || maquinaria.estado === estado}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        maquinaria.estado === estado 
                          ? 'bg-blue-100 text-blue-800 cursor-not-allowed' 
                          : 'bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {estado}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fechas importantes */}
              <div className="space-y-3">
                {maquinaria.fecha_compra && (
                  <FieldDisplay 
                    label="Fecha de Compra"
                    value={formatFechaDetalle(maquinaria.fecha_compra)}
                    icon={<DollarSign size={16} className="text-green-600" />}
                    small={true}
                  />
                )}
                
                {maquinaria.fecha_ultimo_mantenimiento && (
                  <FieldDisplay 
                    label="Último Mantenimiento"
                    value={formatFechaDetalle(maquinaria.fecha_ultimo_mantenimiento)}
                    icon={<Wrench size={16} className="text-orange-600" />}
                    small={true}
                  />
                )}
                
                {maquinaria.creado_en && (
                  <FieldDisplay 
                    label="Registrado"
                    value={formatFechaDetalle(maquinaria.creado_en)}
                    icon={<Edit size={16} className="text-blue-600" />}
                    small={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Historial de mantenimientos (placeholder) */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <h3 className={`${TEXT_STYLES.subtitle} mb-4`}>Historial de Mantenimientos</h3>
          <div className="text-center py-8 text-gray-500">
            <p>Funcionalidad en desarrollo</p>
            <p className="text-sm">Pronto podrás ver el historial completo de mantenimientos</p>
          </div>
        </div>

        {/* Botón de regreso */}
        <div className="flex justify-end">
          <BackButton 
            onClick={() => navigateToListPage('maquinarias')}
            label="Volver a Maquinarias"
          />
        </div>
      </div>
    </AppLayout>
  );
}

/**
 * Componente para mostrar un campo de información
 */
const FieldDisplay = ({ 
  label, 
  value, 
  icon, 
  badge = false, 
  multiline = false, 
  small = false 
}) => {
  if (!value) return null;

  const textSize = small ? 'text-sm' : 'text-base';
  
  return (
    <div className={small ? 'py-2' : 'py-3'}>
      <div className={`text-xs font-medium text-gray-500 mb-1 flex items-center`}>
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </div>
      <div className={textSize}>
        {badge ? (
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getColorFromString(value)}`}>
            {value}
          </span>
        ) : multiline ? (
          <div className="text-gray-900 whitespace-pre-wrap">{value}</div>
        ) : (
          <span className="text-gray-900">{value}</span>
        )}
      </div>
    </div>
  );
};

export default MaquinariaDetailsRefactored;
