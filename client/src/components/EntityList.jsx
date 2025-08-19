// EntityList.jsx
import React from 'react';
import { LIST_STYLES, BUTTON_STYLES } from '../styles/componentStyles';

/**
 * EntityList - Listado genérico de entidades
 * @param {Array} items - Array de objetos a mostrar
 * @param {Array} fields - Campos a mostrar [{ label, key }]
 * @param {Function} onView - Acción para ver detalles
 * @param {Function} onEdit - Acción para editar
 * @param {Function} onDelete - Acción para eliminar
 * @param {Boolean} isAdmin - Si muestra acciones de admin
 */
function EntityList({ items, fields, onView, onEdit, onDelete, isAdmin }) {
  return (
    <div className="overflow-y-auto max-h-[60vh]">
      <ul className={LIST_STYLES.list}>
        {items.map((item) => (
          <li key={item.id} className={LIST_STYLES.item + ' flex-col items-start'}>
            <div className="w-full flex flex-col gap-1">
              {fields.map((f) => (
                <span key={f.key}><strong>{f.label}:</strong> {item[f.key]}</span>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {onView && (
                <button className={BUTTON_STYLES.primary} onClick={() => onView(item.id)}>
                  Ver
                </button>
              )}
              {onEdit && (
                <button className={BUTTON_STYLES.primary} onClick={() => onEdit(item)}>
                  Editar
                </button>
              )}
              {isAdmin && onDelete && (
                <button className={BUTTON_STYLES.secondary} onClick={() => onDelete(item.id)}>
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

export default EntityList;
