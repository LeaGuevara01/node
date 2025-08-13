import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCompra } from '../services/api';

export default function CompraForm({ token }) {
  const [proveedorId, setProveedorId] = useState('');
  const [estado, setEstado] = useState('PENDIENTE');
  const [notas, setNotas] = useState('');
  const [detalles, setDetalles] = useState([{ repuestoId: '', cantidad: 1, precioUnitario: '' }]);
  const navigate = useNavigate();

  const addDetalle = () =>
    setDetalles([...detalles, { repuestoId: '', cantidad: 1, precioUnitario: '' }]);
  const updateDetalle = (idx, field, value) => {
    const next = detalles.slice();
    next[idx][field] = value;
    setDetalles(next);
  };
  const removeDetalle = (idx) => setDetalles(detalles.filter((_, i) => i !== idx));

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      proveedorId: Number(proveedorId),
      estado,
      notas: notas || undefined,
      detalles: detalles.map((d) => ({
        repuestoId: Number(d.repuestoId),
        cantidad: Number(d.cantidad),
        precioUnitario: d.precioUnitario ? Number(d.precioUnitario) : undefined,
      })),
    };
    await createCompra(payload, token);
    navigate('/compras');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Nueva compra</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="number"
            placeholder="Proveedor ID"
            value={proveedorId}
            onChange={(e) => setProveedorId(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="PENDIENTE">Pendiente</option>
            <option value="RECIBIDA">Recibida</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
          <input
            type="text"
            placeholder="Notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div>
          <h2 className="font-semibold mb-2">Detalles</h2>
          {detalles.map((d, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2">
              <input
                type="number"
                placeholder="Repuesto ID"
                value={d.repuestoId}
                onChange={(e) => updateDetalle(idx, 'repuestoId', e.target.value)}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Cantidad"
                value={d.cantidad}
                onChange={(e) => updateDetalle(idx, 'cantidad', e.target.value)}
                className="border p-2 rounded"
                required
              />
              <input
                type="number"
                placeholder="Precio unitario"
                value={d.precioUnitario}
                onChange={(e) => updateDetalle(idx, 'precioUnitario', e.target.value)}
                className="border p-2 rounded"
              />
              <button type="button" onClick={() => removeDetalle(idx)} className="text-red-600">
                Eliminar
              </button>
            </div>
          ))}
          <button type="button" onClick={addDetalle} className="bg-gray  -200 px-3 py-2 rounded">
            Agregar detalle
          </button>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-3 py-2 rounded">
            Guardar
          </button>
          <button
            type="button"
            onClick={() => navigate('/compras')}
            className="border px-3 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
