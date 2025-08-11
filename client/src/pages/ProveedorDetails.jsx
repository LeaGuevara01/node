import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProveedorById, updateProveedor, deleteProveedor } from '../services/api';
import { 
  formatCuit, 
  formatTelefono, 
  extractCiudadFromDireccion, 
  formatUrl 
} from '../utils/proveedorUtils';
import TagLink from '../components/TagLink';
import { handleFileUpload, COMMON_ICONS } from '../utils/detailsUtils.jsx';
import { DetailsAlert, DetailsLoading, FieldWithIcon, SimpleField, ImageUpload } from '../components/shared/DetailsComponents';
import AppLayout from '../components/navigation/AppLayout';
import { useNavigation } from '../hooks/useNavigation';
import { DETAILS_CONTAINER } from '../styles/detailsStyles';
import { 
  CONTAINER_STYLES,
  INPUT_STYLES,
  BUTTON_STYLES,
  LAYOUT_STYLES,
  TEXT_STYLES,
  ALERT_STYLES
} from '../styles/repuestoStyles';

function ProveedorDetails({ token }) {
  const { id } = useParams();
  const { navigateToListPage, navigateToFormPage } = useNavigation();
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const fetchProveedor = async () => {
    try {
      setLoading(true);
      const data = await getProveedorById(id, token);
      setProveedor(data);
    } catch (err) {
      setError('Error al cargar los detalles del proveedor');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    setError('');
    setUploadSuccess('');
    
    try {
      const result = await handleFileUpload(file, id, 'proveedores', token);
      setProveedor(prev => ({ ...prev, imagen: result.imagen_url }));
      setUploadSuccess('Imagen subida exitosamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (id && token) {
      fetchProveedor();
    }
  }, [id, token]);

  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Proveedores', href: '/proveedores' },
    { label: proveedor?.nombre || `Proveedor #${id}` }
  ];

  const handleEdit = () => navigateToFormPage('proveedores', id);
  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este proveedor?')) return;
    try {
      await deleteProveedor(id, token);
      navigateToListPage('proveedores');
    } catch (e) {
      setError('Error al eliminar proveedor');
    }
  };

  if (loading) {
    return (
      <AppLayout currentSection="proveedores" breadcrumbs={breadcrumbs} title="Cargando proveedor..." token={token} isDetails={true}>
        <DetailsLoading message="Cargando proveedor..." />
      </AppLayout>
    );
  }

  if (error && !proveedor) {
    return (
      <AppLayout currentSection="proveedores" breadcrumbs={breadcrumbs} title="Error" token={token}>
        <div className={CONTAINER_STYLES.main}>
          <div className={CONTAINER_STYLES.maxWidth}>
            <DetailsAlert type="error" message={error} />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      currentSection="proveedores"
      breadcrumbs={breadcrumbs}
      title={`Detalles: ${proveedor?.nombre || 'Proveedor'}`}
      isDetails={true}
      onEdit={handleEdit}
      onDelete={handleDelete}
      token={token}
    >
      {error && <DetailsAlert type="error">{error}</DetailsAlert>}
      {uploadSuccess && <DetailsAlert type="success">{uploadSuccess}</DetailsAlert>}
      {proveedor && (
        <>
            {/* Información principal */}
            <div className={CONTAINER_STYLES.card}>
              <div className={CONTAINER_STYLES.cardPadding}>
                
                {/* Grid para imagen y información */}
                <div className={LAYOUT_STYLES.gridForm}>
                  
                  {/* Columna izquierda - Imagen */}
                  <div>
                    <h3 className={TEXT_STYLES.sectionTitle}>Imagen</h3>
                    <ImageUpload
                      currentImage={proveedor.imagen}
                      onUpload={handleImageUpload}
                      uploading={uploading}
                      altText={proveedor.nombre}
                    />
                  </div>

                  {/* Columna derecha - Información */}
                  <div>
                    <h3 className={TEXT_STYLES.sectionTitle}>Información del Proveedor</h3>
                    <div className="space-y-6">
                      
                      {/* Información básica */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Datos de contacto</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          {proveedor.cuit && (
                            <FieldWithIcon
                              icon={COMMON_ICONS.document}
                              label="CUIT"
                              value={formatCuit(proveedor.cuit)}
                            />
                          )}
                          
                          {proveedor.telefono && (
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-gray-700">Teléfono</span>
                              <div>
                                <TagLink
                                  type="whatsapp"
                                  value={proveedor.telefono}
                                  label={formatTelefono(proveedor.telefono)}
                                />
                              </div>
                            </div>
                          )}
                          
                          {proveedor.email && (
                            <FieldWithIcon
                              icon={COMMON_ICONS.email}
                              label="Email"
                              value={proveedor.email}
                              isLink={true}
                              linkPrefix="mailto:"
                            />
                          )}
                          
                          {proveedor.web && (
                            <FieldWithIcon
                              icon={COMMON_ICONS.web}
                              label="Sitio Web"
                              value={formatUrl(proveedor.web)}
                              isLink={true}
                            />
                          )}
                          
                          {proveedor.direccion && (
                            <div className="sm:col-span-2">
                              <FieldWithIcon
                                icon={COMMON_ICONS.location}
                                label="Dirección"
                                value={proveedor.direccion}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Productos */}
                      {proveedor.productos && proveedor.productos.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Productos/Servicios</h4>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(proveedor.productos) ? 
                              proveedor.productos.map((producto, index) => (
                                <span 
                                  key={index}
                                  className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800"
                                >
                                  {producto}
                                </span>
                              )) :
                              proveedor.productos.split(',').map((producto, index) => (
                                <span 
                                  key={index}
                                  className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-blue-100 text-blue-800"
                                >
                                  {producto.trim()}
                                </span>
                              ))
                            }
                          </div>
                        </div>
                      )}

                      {/* Información del sistema */}
                      {(proveedor.created_at || proveedor.updated_at) && (
                        <div className="bg-gray-50 rounded-xl p-6">
                          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Información del sistema</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {proveedor.created_at && (
                              <SimpleField 
                                label="Fecha de creación" 
                                value={new Date(proveedor.created_at).toLocaleDateString()} 
                              />
                            )}
                            {proveedor.updated_at && (
                              <SimpleField 
                                label="Última actualización" 
                                value={new Date(proveedor.updated_at).toLocaleDateString()} 
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </>
      )}
    </AppLayout>
  );
}

export default ProveedorDetails;
