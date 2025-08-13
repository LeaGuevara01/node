// client/src/pages/UsuariosPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUsuarios,
  getUsuarioFilters,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from '../services/api';
import UserEditModal from '../components/UserEditModal';
import BaseListPage from '../components/shared/BaseListPage';
import { useAdvancedFilters } from '../hooks/useAdvancedFilters.jsx';
import { usePagination } from '../hooks/usePagination';
import { USUARIO_FILTERS_CONFIG } from '../config/filtersConfig';
import { getColorFromString } from '../utils/colorUtils';
import { BUTTON_STYLES, ICON_STYLES, LIST_STYLES } from '../styles/repuestoStyles';
import AppLayout from '../components/navigation/AppLayout';

function UsuariosPage({ token, role, onLogout, onCreated }) {
  const navigate = useNavigate();

  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [error, setError] = useState('');
  const [bulkError, setBulkError] = useState('');
  const [bulkSuccess, setBulkSuccess] = useState('');

  // Hook de paginación
  const { paginacion, loading, setLoading, handlePaginacion, actualizarPaginacion } = usePagination(
    { limit: 10 }
  );

  /**
   * Carga los usuarios con filtros aplicados
   */
  const fetchUsuarios = async (filtrosActuales = {}, pagina = 1) => {
    setLoading(true);
    try {
      const data = await getUsuarios(token, filtrosActuales, pagina);

      if (data.usuarios) {
        setUsuarios(data.usuarios);
        actualizarPaginacion(data.pagination || { current: 1, total: 1, totalItems: 0, limit: 10 });
      } else {
        setUsuarios(data || []);
        actualizarPaginacion({ current: 1, total: 1, totalItems: data.length, limit: 10 });
      }
      setError('');
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setUsuarios([]);
      setError('Error al cargar usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga las opciones de filtros
   */
  const fetchOpcionesFiltros = async () => {
    try {
      const data = await getUsuarioFilters(token);
      return data;
    } catch (err) {
      console.error('Error al cargar opciones de filtros:', err);
      return {};
    }
  };

  // Hook de filtros avanzados
  const {
    filtrosTemporales,
    tokensActivos,
    filtrosConsolidados,
    opcionesFiltros,
    handleFiltroChange,
    aplicarFiltrosActuales,
    removerToken,
    limpiarTodosFiltros,
    cargarOpcionesFiltros,
  } = useAdvancedFilters({}, fetchUsuarios, fetchOpcionesFiltros);

  /**
   * Maneja la carga masiva de CSV
   */
  const handleFileUpload = async (csvData) => {
    const validRows = csvData.filter((row) => row.username && row.password);
    let successCount = 0,
      failCount = 0;

    for (const row of validRows) {
      try {
        await createUsuario(
          {
            username: row.username || '',
            password: row.password || '',
            email: row.email || '',
            nombre: row.nombre || '',
            rol: row.rol || 'User',
            activo: row.activo !== 'false',
          },
          token
        );
        successCount++;
      } catch (err) {
        console.error('Error creating usuario:', err);
        failCount++;
      }
    }

    setBulkSuccess(`Creados: ${successCount}`);
    setBulkError(failCount ? `Fallidas: ${failCount}` : '');

    if (successCount > 0) {
      if (onCreated) onCreated();
      fetchUsuarios(filtrosConsolidados, 1);
      cargarOpcionesFiltros();
    }
  };

  /**
   * Abre modal de edición
   */
  const openEditModal = (usuario) => {
    setSelectedUsuario(usuario);
  };

  /**
   * Cierra modal de edición
   */
  const closeEditModal = () => {
    setSelectedUsuario(null);
  };

  /**
   * Navega a la vista de detalles
   */
  const handleView = (usuario) => {
    navigate(`/usuarios/${usuario.id}`);
  };

  /**
   * Actualiza un usuario
   */
  const handleUpdateUsuario = async (id, usuarioData) => {
    try {
      await updateUsuario(id, usuarioData, token);
      fetchUsuarios(filtrosConsolidados, paginacion.current);
      cargarOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al actualizar: ' + err.message);
    }
  };

  /**
   * Elimina un usuario
   */
  const handleDeleteUsuario = async (id) => {
    try {
      await deleteUsuario(id, token);
      fetchUsuarios(filtrosConsolidados, paginacion.current);
      cargarOpcionesFiltros();
      if (onCreated) onCreated();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  const getRolBadge = (rol) => {
    switch (rol?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivoBadge = (activo) => {
    return activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  /**
   * Renderiza un elemento de usuario
   */
  const renderUsuario = (usuario) => (
    <>
      <div className={LIST_STYLES.itemHeader}>
        <div className="flex items-center gap-2">
          <h3 className={LIST_STYLES.itemTitle}>{usuario.username}</h3>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRolBadge(usuario.rol)}`}
          >
            {usuario.rol}
          </span>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActivoBadge(usuario.activo)}`}
          >
            {usuario.activo ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div className={LIST_STYLES.itemActions}>
          <button
            onClick={() => handleView(usuario)}
            className={`${BUTTON_STYLES.edit} bg-gray-50 hover:bg-gray-100 text-gray-700 mr-2`}
            title="Ver detalles"
          >
            <svg
              className={ICON_STYLES.small}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
          <button
            onClick={() => openEditModal(usuario)}
            className={BUTTON_STYLES.edit}
            title="Editar usuario"
          >
            <svg
              className={ICON_STYLES.small}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      </div>
      {usuario.nombre && <div className={LIST_STYLES.itemDescription}>{usuario.nombre}</div>}
      <div className={LIST_STYLES.itemTagsRow}>
        <div className={`${LIST_STYLES.itemTagsLeft} tags-container-mobile`}>
          {usuario.email && (
            <span
              className={`${LIST_STYLES.itemTag} bg-blue-100 text-blue-700`}
              title={usuario.email}
            >
              <svg
                className={ICON_STYLES.small}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="tag-truncate">{usuario.email}</span>
            </span>
          )}
          {usuario.ultimo_acceso && (
            <span className={`${LIST_STYLES.itemTag} bg-gray-100 text-gray-700`}>
              <svg
                className={ICON_STYLES.small}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Último: {new Date(usuario.ultimo_acceso).toLocaleDateString()}
            </span>
          )}
          {usuario.creado_en && (
            <span className={`${LIST_STYLES.itemTag} bg-green-100 text-green-700`}>
              <svg
                className={ICON_STYLES.small}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Creado: {new Date(usuario.creado_en).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </>
  );

  // Efectos
  useEffect(() => {
    fetchUsuarios();
    cargarOpcionesFiltros();
  }, []);

  const breadcrumbs = [{ label: 'Inicio', href: '/' }, { label: 'Usuarios' }];

  return (
    <AppLayout
      currentSection="usuarios"
      breadcrumbs={breadcrumbs}
      title="Gestión de Usuarios"
      subtitle="Administra roles y accesos"
      token={token}
      role={role}
      onLogout={onLogout}
    >
      <BaseListPage
        title="Listado de Usuarios"
        subtitle="Gestiona y filtra todos los usuarios del sistema"
        entityName="Usuario"
        entityNamePlural="Usuarios"
        createRoute="/usuarios/formulario"
        items={usuarios}
        loading={loading}
        error={error}
        filtrosTemporales={filtrosTemporales}
        handleFiltroChange={handleFiltroChange}
        aplicarFiltrosActuales={aplicarFiltrosActuales}
        limpiarTodosFiltros={limpiarTodosFiltros}
        tokensActivos={tokensActivos}
        removerToken={removerToken}
        opcionesFiltros={opcionesFiltros}
        camposFiltros={USUARIO_FILTERS_CONFIG(opcionesFiltros)}
        paginacion={paginacion}
        handlePaginacion={(pagina) => fetchUsuarios(filtrosConsolidados, pagina)}
        onFileUpload={handleFileUpload}
        bulkError={bulkError}
        setBulkError={setBulkError}
        bulkSuccess={bulkSuccess}
        setBulkSuccess={setBulkSuccess}
        renderItem={renderUsuario}
      />

      {/* Modal de edición */}
      {selectedUsuario && (
        <UserEditModal
          usuario={selectedUsuario}
          onClose={closeEditModal}
          onUpdate={handleUpdateUsuario}
          onDelete={handleDeleteUsuario}
          token={token}
        />
      )}
    </AppLayout>
  );
}

export default UsuariosPage;
