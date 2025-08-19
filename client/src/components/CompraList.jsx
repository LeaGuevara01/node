// CompraList.jsx
import React from 'react';
import { LIST_STYLES, BUTTON_STYLES } from '../styles/componentStyles';

function CompraList({ compras, onView, onDelete, isAdmin }) {
  return (
    <div className="overflow-y-auto max-h-[60vh]">
      <ul className={LIST_STYLES.list}>
        {compras.map((c) => (
          <li key={c.id} className={LIST_STYLES.item + ' flex-col items-start'}>
            <div className="w-full flex flex-col gap-1">
              <span className="font-semibold text-lg">Compra #{c.id}</span>
              <span>Fecha: {new Date(c.fecha).toLocaleDateString()}</span>
              <span>Proveedor: {c.proveedor?.nombre || c.proveedorId}</span>
              <span>Estado: {c.estado}</span>
              <span>Total: {c.total ?? '-'}</span>
            </div>
            <div className="flex gap-2 mt-2">
              <button className={BUTTON_STYLES.primary} onClick={() => onView(c.id)}>
                Ver
              </button>
              {isAdmin && (
                <button className={BUTTON_STYLES.secondary} onClick={() => onDelete(c.id)}>
                  Eliminar
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CompraList;
