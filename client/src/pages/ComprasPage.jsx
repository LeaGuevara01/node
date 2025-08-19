import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompras, getComprasStats, deleteCompra } from '../services/api';
import { PAGE_STYLES, BUTTON_STYLES, FORM_STYLES } from '../styles/componentStyles';
import EntityList from '../components/EntityList';
import EntityForm from '../components/EntityForm';
import AppLayout from '../components/navigation/AppLayout';

function ComprasPage({ token, role, onLogout }) {
  const navigate = useNavigate();
  const [compras, setCompras] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ current: 1, total: 1 });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ estado: '', proveedorId: '' });
  const isAdmin = role && role.toLowerCase() === 'admin';

  const fetchCompras = async () => {
    setLoading(true);
    try {
      const res = await getCompras(token, filtros, page);
      setCompras(res.data || []);
      setPagination(res.pagination || { current: 1, total: 1 });
    } catch (e) {
      setError('Error al cargar compras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompras();
    // eslint-disable-next-line
  }, [page]);

  // Acciones para el listado y formulario
  const handleView = (id) => navigate(`/compras/${id}`);
  const handleEdit = (compra) => {
    setSelected(compra);
    setShowForm(true);
  };
  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar compra?')) {
      try {
        await deleteCompra(id, token);
        fetchCompras();
      } catch (e) {
        setError('Error al eliminar compra');
      }
    }
  };
  const handleCreate = async (form) => {
    try {
      await createCompra(form, token);
      setShowForm(false);
      setSelected(null);
      setError('');
      setPage(1); // Volver a la primera página para ver la nueva compra
      fetchCompras();
    } catch (e) {
      setError('Error al crear compra');
    }
  };

  const breadcrumbs = [{ label: 'Inicio', href: '/' }, { label: 'Compras' }];
  const pageActions = (
    <>
      {isAdmin && (
        <button
          onClick={() => {
            setShowForm(true);
            setSelected(null);
            setError('');
          }}
          className={BUTTON_STYLES.primary}
        >
          Nueva compra
        </button>
      )}
    </>
  );

  return (
    <AppLayout
      currentSection="compras"
      breadcrumbs={breadcrumbs}
      title="Gestión de Compras"
      subtitle="Registra y revisa las compras realizadas"
      actions={pageActions}
      token={token}
      role={role}
      onLogout={onLogout}
    >
      <div className={PAGE_STYLES.container}>
        <div className="flex gap-3 mb-6">
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            className={FORM_STYLES.input}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="RECIBIDA">Recibida</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
          <input
            type="number"
            placeholder="Proveedor ID"
            value={filtros.proveedorId}
            onChange={(e) => setFiltros({ ...filtros, proveedorId: e.target.value })}
            className={FORM_STYLES.input}
          />
          <button
            onClick={() => { setPage(1); fetchCompras(); }}
            className={BUTTON_STYLES.primary}
          >
            Filtrar
          </button>
        </div>
        {error && <div className={PAGE_STYLES.error}>{error}</div>}
        <EntityList
          items={compras}
          fields={[
            { label: 'ID', key: 'id' },
            { label: 'Fecha', key: 'fecha' },
            { label: 'Proveedor', key: 'proveedorId' },
            { label: 'Estado', key: 'estado' },
            { label: 'Total', key: 'total' },
          ]}
          onView={handleView}
          onEdit={null}
          onDelete={handleDelete}
          isAdmin={isAdmin}
        />
        {compras.length === 0 && !loading && (
          <div className="text-gray-400 text-center mt-8">No hay compras registradas.</div>
        )}
        <div className="flex justify-between mt-4">
          <button
            disabled={pagination.current <= 1}
            onClick={() => setPage((p) => p - 1)}
            className={BUTTON_STYLES.secondary + ' disabled:opacity-50'}
          >
            Anterior
          </button>
          <span>
            Página {pagination.current} de {pagination.total}
          </span>
          <button
            disabled={pagination.current >= pagination.total}
            onClick={() => setPage((p) => p + 1)}
            className={BUTTON_STYLES.secondary + ' disabled:opacity-50'}
          >
            Siguiente
          </button>
        </div>
        {showForm && (
          <EntityForm
            fields={[
              { label: 'Proveedor ID', key: 'proveedorId' },
              { label: 'Estado', key: 'estado' },
              { label: 'Total', key: 'total', type: 'number' },
              { label: 'Fecha', key: 'fecha', type: 'date' },
            ]}
            initialData={selected}
            onSubmit={handleCreate}
            onClose={() => { setShowForm(false); setSelected(null); }}
          />
        )}
        {loading && <div className="mt-2 text-gray-500">Cargando...</div>}
      </div>
    </AppLayout>
  );
}

export default ComprasPage;
