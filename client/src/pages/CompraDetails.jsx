import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompra } from '../services/api';

export default function CompraDetails({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [compra, setCompra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getCompra(id, token);
        setCompra(data);
      } catch (e) {
        setError('No se pudo cargar la compra');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  if (loading) return <div className="p-4 text-gray-600">Cargando...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!compra) return <div className="p-4">No encontrada</div>;

  return (
    <div className="p-4">
      <button onClick={() => navigate('/compras')} className="mb-4 text-blue-600">← Volver</button>
      <h1 className="text-2xl font-semibold mb-2">Compra #{compra.id}</h1>
      <div className="mb-4 text-sm text-gray-700">Fecha: {new Date(compra.fecha).toLocaleString()} | Estado: {compra.estado}</div>
      <div className="mb-2">Proveedor: {compra.proveedor?.nombre || compra.proveedorId}</div>
      {compra.notas && <div className="mb-4">Notas: {compra.notas}</div>}

      <div className="bg-white rounded shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Repuesto</th>
              <th className="p-2">Cantidad</th>
              <th className="p-2">Precio unitario</th>
            </tr>
          </thead>
          <tbody>
            {compra.detalles?.map(d => (
              <tr key={d.id} className="border-b">
                <td className="p-2">{d.repuesto?.nombre || d.repuestoId}</td>
                <td className="p-2">{d.cantidad}</td>
                <td className="p-2">{d.precioUnitario ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 font-semibold">Total: {compra.total ?? '-'}</div>
    </div>
  );
}
