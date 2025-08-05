import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRepuestoById, updateRepuesto } from '../services/api';
import { getColorFromString, getStockColorClass } from '../utils/colorUtils';
import { formatFecha } from '../utils/reparacionUtils';
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

function RepuestoDetails({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repuesto, setRepuesto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const fetchRepuesto = async () => {
    try {
      setLoading(true);
      const data = await getRepuestoById(id, token);
      setRepuesto(data);
    } catch (err) {
      setError('Error al cargar los detalles del repuesto');
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

    try {
      setUploading(true);
      setError('');
      setUploadSuccess('');

      const formData = new FormData();
      formData.append('foto', file);

      // Simular subida de archivo - aquí deberías implementar la API real
      const response = await fetch(`/api/repuestos/${id}/foto`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setRepuesto(prev => ({ ...prev, foto_url: result.foto_url }));
        setUploadSuccess('Foto subida exitosamente');
      } else {
        throw new Error('Error al subir la foto');
      }
    } catch (err) {
      setError('Error al subir la foto: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (id && token) {
      fetchRepuesto();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className={CONTAINER_STYLES.main}>
        <div className={CONTAINER_STYLES.maxWidth}>
          <div className="flex items-center justify-center min-h-64">
            <div className={TEXT_STYLES.loading}>
              <svg className={`${ICON_STYLES.medium} ${ICON_STYLES.spin}`} fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
              </svg>
              Cargando detalles...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !repuesto) {
    return (
      <div className={CONTAINER_STYLES.main}>
        <div className={CONTAINER_STYLES.maxWidth}>
          <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
            <div className={ALERT_STYLES.error}>
              {error}
            </div>
            <button
              onClick={() => navigate('/')}
              className={`${BUTTON_STYLES.secondary} mt-4`}
            >
              Volver a Repuestos
            </button>
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
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => navigate('/repuestos')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Volver a repuestos"
                >
                  <svg className={ICON_STYLES.medium} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className={TEXT_STYLES.title}>Detalles de Repuesto</h1>
              </div>
              <p className={TEXT_STYLES.subtitle}>Información completa y gestión de fotos</p>
            </div>
          </div>
        </div>

        {repuesto && (
          <>
            {/* Información principal */}
            <div className={`${CONTAINER_STYLES.card} ${CONTAINER_STYLES.cardPadding}`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Foto */}
                <div className="lg:col-span-1">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Fotografía</h3>
                    <div className="space-y-4">
                      <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                        {repuesto.foto_url ? (
                          <img
                            src={repuesto.foto_url}
                            alt={repuesto.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <svg className={`${ICON_STYLES.extraLarge} mx-auto mb-3 text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm font-medium">Sin fotografía</p>
                              <p className="text-xs text-gray-400 mt-1">Arrastra una imagen o haz clic para subir</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Upload de foto */}
                      <div>
                        <label className="block">
                          <span className="sr-only">Subir foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="hidden"
                          />
                          <div className={`${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'} w-full text-center transition-all duration-200 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300`}>
                            {uploading ? (
                              <div className="flex items-center justify-center gap-3">
                                <svg className={`${ICON_STYLES.small} ${ICON_STYLES.spin} text-blue-600`} fill="none" viewBox="0 0 24 24">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                                </svg>
                                <span className="text-sm font-medium text-gray-600">Subiendo...</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-3">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">
                                  {repuesto.foto_url ? 'Cambiar foto' : 'Subir foto'}
                                </span>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                      
                      {/* Mensajes de estado */}
                      {uploadSuccess && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm font-medium text-green-800">{uploadSuccess}</span>
                          </div>
                        </div>
                      )}
                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-red-800">{error}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información detallada */}
                <div className="lg:col-span-2">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del repuesto</h3>
                    <div className="space-y-6">
                    
                    {/* Título y descripción */}
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">{repuesto.nombre}</h2>
                      </div>
                      {repuesto.descripcion && (
                        <p className="text-lg text-gray-600 leading-relaxed">{repuesto.descripcion}</p>
                      )}
                    </div>

                    {/* Etiquetas en grid */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Información de producto</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Stock */}
                        <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getStockColorClass(repuesto.stock).includes('red') ? 'bg-red-100' : getStockColorClass(repuesto.stock).includes('yellow') ? 'bg-yellow-100' : 'bg-green-100'}`}>
                            <svg className={`w-5 h-5 ${getStockColorClass(repuesto.stock).includes('red') ? 'text-red-600' : getStockColorClass(repuesto.stock).includes('yellow') ? 'text-yellow-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Stock</p>
                            <p className="text-sm font-semibold text-gray-900">{repuesto.stock} unidades</p>
                          </div>
                        </div>
                        {repuesto.codigo && (
                          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase">Código</p>
                              <p className="text-sm font-semibold text-gray-900">{repuesto.codigo}</p>
                            </div>
                          </div>
                        )}
                        {repuesto.categoria && (
                          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getColorFromString(repuesto.categoria, 'categoria').replace('text-', 'bg-').replace('-700', '-100')}`}>
                              <svg className={`w-5 h-5 ${getColorFromString(repuesto.categoria, 'categoria')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase">Categoría</p>
                              <p className="text-sm font-semibold text-gray-900">{repuesto.categoria}</p>
                            </div>
                          </div>
                        )}
                        {repuesto.ubicacion && (
                          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getColorFromString(repuesto.ubicacion, 'ubicacion').replace('text-', 'bg-').replace('-700', '-100')}`}>
                              <svg className={`w-5 h-5 ${getColorFromString(repuesto.ubicacion, 'ubicacion')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase">Ubicación</p>
                              <p className="text-sm font-semibold text-gray-900">{repuesto.ubicacion}</p>
                            </div>
                          </div>
                        )}
                        {repuesto.precio && (
                          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase">Precio</p>
                              <p className="text-sm font-semibold text-gray-900">${Number(repuesto.precio).toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                        {repuesto.proveedor && (
                          <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase">Proveedor</p>
                              <p className="text-sm font-semibold text-gray-900">{repuesto.proveedor}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Información adicional */}
                    {(repuesto.created_at || repuesto.updated_at) && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Información del sistema</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {repuesto.created_at && (
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Fecha de creación</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {formatFecha(repuesto.created_at)}
                                </p>
                              </div>
                            </div>
                          )}
                          {repuesto.updated_at && (
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase">Última actualización</p>
                                <p className="text-sm font-semibold text-gray-900">
                                  {formatFecha(repuesto.updated_at)}
                                </p>
                              </div>
                            </div>
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
      </div>
    </div>
  );
}

export default RepuestoDetails;
