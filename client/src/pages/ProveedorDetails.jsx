import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProveedorById, updateProveedor } from '../services/api';
import { 
  formatCuit, 
  formatTelefono, 
  getCiudadColorClass, 
  extractCiudadFromDireccion, 
  formatProductos, 
  parseProductos, 
  validateEmail, 
  validateUrl, 
  formatUrl 
} from '../utils/proveedorUtils';
import { getColorFromString } from '../utils/colorUtils';
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

function ProveedorDetails({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/proveedores/${id}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setProveedor({ ...proveedor, imagen: result.imagenUrl });
        setUploadSuccess('Imagen actualizada correctamente');
      } else {
        throw new Error('Error al subir la imagen');
      }
    } catch (err) {
      setError('Error al subir la imagen: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchProveedor();
  }, [id]);

  if (loading) {
    return (
      <div className={`${CONTAINER_STYLES.main} flex items-center justify-center min-h-96`}>
        <div className={TEXT_STYLES.loading}>
          <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.spin}`} fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
          </svg>
          Cargando detalles del proveedor...
        </div>
      </div>
    );
  }

  if (error && !proveedor) {
    return (
      <div className={CONTAINER_STYLES.main}>
        <div className={CONTAINER_STYLES.maxWidth}>
          <div className={ALERT_STYLES.error}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!proveedor) {
    return (
      <div className={CONTAINER_STYLES.main}>
        <div className={CONTAINER_STYLES.maxWidth}>
          <div className={ALERT_STYLES.error}>
            Proveedor no encontrado
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={CONTAINER_STYLES.main}>
      <div className={CONTAINER_STYLES.maxWidth}>
        
        {/* Header */}
        <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
          <div className={LAYOUT_STYLES.flexBetween}>
            <div>
              <button
                onClick={() => navigate('/proveedores')}
                className={`${BUTTON_STYLES.secondary} mb-4`}
              >
                <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver a Proveedores
              </button>
              <h1 className={TEXT_STYLES.title}>{proveedor.nombre}</h1>
              <p className={TEXT_STYLES.subtitle}>Detalles del proveedor</p>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {error && (
          <div className={ALERT_STYLES.error}>
            {error}
          </div>
        )}
        
        {uploadSuccess && (
          <div className={ALERT_STYLES.success}>
            {uploadSuccess}
          </div>
        )}

        {/* Información principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna izquierda - Imagen */}
          <div className="lg:col-span-1">
            <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Imagen</h3>
              
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                  {proveedor.imagen ? (
                    <img 
                      src={proveedor.imagen} 
                      alt={proveedor.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m14 0V9a2 2 0 00-2-2M9 7h6m-6 4h6m-6 4h6m-6 4h6" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">Sin imagen</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block">
                    <span className="sr-only">Elegir imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={uploading}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG hasta 5MB</p>
                </div>
                
                {uploading && (
                  <div className="flex items-center space-x-2">
                    <svg className={`${ICON_STYLES.small} ${ICON_STYLES.spin}`} fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                    </svg>
                    <span className="text-sm text-gray-600">Subiendo imagen...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna derecha - Información */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Información básica */}
            <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
              
              <div className={LAYOUT_STYLES.gridForm}>
                <div>
                  <label className={INPUT_STYLES.label}>Nombre</label>
                  <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                    {proveedor.nombre}
                  </div>
                </div>
                
                {proveedor.cuit && (
                  <div>
                    <label className={INPUT_STYLES.label}>CUIT</label>
                    <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                      {formatCuit(proveedor.cuit)}
                    </div>
                  </div>
                )}
                
                {proveedor.telefono && (
                  <div>
                    <label className={INPUT_STYLES.label}>Teléfono</label>
                    <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center">
                      <svg className={`${ICON_STYLES.small} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${proveedor.telefono}`} className="text-blue-600 hover:text-blue-800">
                        {formatTelefono(proveedor.telefono)}
                      </a>
                    </div>
                  </div>
                )}
                
                {proveedor.email && (
                  <div>
                    <label className={INPUT_STYLES.label}>Email</label>
                    <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center">
                      <svg className={`${ICON_STYLES.small} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${proveedor.email}`} className="text-blue-600 hover:text-blue-800">
                        {proveedor.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {proveedor.web && (
                  <div>
                    <label className={INPUT_STYLES.label}>Sitio Web</label>
                    <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center">
                      <svg className={`${ICON_STYLES.small} mr-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <a href={formatUrl(proveedor.web)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        {proveedor.web}
                      </a>
                    </div>
                  </div>
                )}
                
                {proveedor.direccion && (
                  <div className="sm:col-span-2">
                    <label className={INPUT_STYLES.label}>Dirección</label>
                    <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md flex items-start">
                      <svg className={`${ICON_STYLES.small} mr-2 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p>{proveedor.direccion}</p>
                        {extractCiudadFromDireccion(proveedor.direccion) && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getCiudadColorClass(extractCiudadFromDireccion(proveedor.direccion))}`}>
                            {extractCiudadFromDireccion(proveedor.direccion)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Productos */}
            {proveedor.productos && proveedor.productos.length > 0 && (
              <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos que Suministra</h3>
                
                <div className="flex flex-wrap gap-2">
                  {proveedor.productos.map((producto, index) => (
                    <span 
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getColorFromString(producto, 'producto')}`}
                    >
                      <svg className={`${ICON_STYLES.small} mr-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      {producto}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Estadísticas */}
            <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {proveedor.productos?.length || 0}
                  </div>
                  <div className="text-sm text-blue-600">Productos</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {proveedor.reparaciones_count || 0}
                  </div>
                  <div className="text-sm text-green-600">Reparaciones</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {proveedor.repuestos_count || 0}
                  </div>
                  <div className="text-sm text-purple-600">Repuestos</div>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate(`/proveedores/${proveedor.id}/edit`)}
                  className={BUTTON_STYLES.primary}
                >
                  <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar Proveedor
                </button>
                
                <button
                  onClick={() => navigate('/repuestos', { state: { proveedorFilter: proveedor.nombre } })}
                  className={BUTTON_STYLES.secondary}
                >
                  <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Ver Repuestos
                </button>
                
                <button
                  onClick={() => navigate('/reparaciones', { state: { proveedorFilter: proveedor.nombre } })}
                  className={`${BUTTON_STYLES.secondary} bg-green-50 border-green-200 text-green-700 hover:bg-green-100`}
                >
                  <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ver Reparaciones
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProveedorDetails;
