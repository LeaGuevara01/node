import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompras, getComprasStats, deleteCompra } from '../services/api';
import AppLayout from '../components/navigation/AppLayout';

export default function ComprasPage({ token, role, onLogout }) {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({ estado: '', proveedorId: '' });
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ data: [], pagination: { current: 1, total: 1 } });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const isAdmin = role && role.toLowerCase() === 'admin';

  const load = async () => {
    setLoading(true);
    try {
      const res = await getCompras(token, filtros, page);
      setData(res);
      const st = await getComprasStats(token);
      setStats(st);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [page]);

  const breadcrumbs = [{ label: 'Inicio', href: '/' }, { label: 'Compras' }];

  const pageActions = (
    <>
      {isAdmin && (
        <button
          onClick={() => navigate('/compras/nueva')}
          className="bg-green-600 text-white px-3 py-2 rounded"
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
      <div className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <select
            value={filtros.estado}
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
            className="border p-2 rounded"
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
            className="border p-2 rounded"
          />
          <button
            onClick={() => {
              setPage(1);
              load();
            }}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            Filtrar
          </button>
        </div>

        {stats && (
          <div className="mb-4 text-sm text-gray-700">
            <div>
              Por estado: {stats.porEstado.map((s) => `${s.estado}: ${s._count.id}`).join(' | ')}
            </div>
          </div>
        )}

        <div className="bg-white rounded shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Fecha</th>
                <th className="p-2">Proveedor</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Total</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{new Date(c.fecha).toLocaleDateString()}</td>
                  <td className="p-2">{c.proveedor?.nombre || c.proveedorId}</td>
                  <td className="p-2">{c.estado}</td>
                  <td className="p-2">{c.total ?? '-'}</td>
                  <td className="p-2 space-x-2">
                    <button className="text-blue-600" onClick={() => navigate(`/compras/${c.id}`)}>
                      Ver
                    </button>
                    {isAdmin && (
                      <button
                        className="text-red-600"
                        onClick={async () => {
                          if (confirm('¿Eliminar compra?')) {
                            await deleteCompra(c.id, token);
                            load();
                          }
                        }}
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>
            Página {data.pagination.current} de {data.pagination.total}
          </span>
          <button
            disabled={data.pagination.current >= data.pagination.total}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>

        {loading && <div className="mt-2 text-gray-500">Cargando...</div>}
      </div>
    </AppLayout>
  );
}
