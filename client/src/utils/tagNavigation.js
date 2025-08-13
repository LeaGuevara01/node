/**
 * Centralized resolver for future tag redirections.
 * Returns action object { type: 'whatsapp' | 'link', value: string }
 */
export function resolveTagAction({ entity, tagKey, tagValue, entityId }) {
  if (entity === 'proveedor' && tagKey === 'telefono') {
    return { type: 'whatsapp', value: tagValue };
  }

  if (entity === 'maquinaria') {
    if (tagKey === 'seccion' && tagValue) {
      return {
        type: 'link',
        value: `/maquinarias/${entityId}?section=${encodeURIComponent(tagValue)}`,
      };
    }
    if (tagKey === 'catalogo') {
      // Align to compras list with maquinaria filter
      return { type: 'link', value: `/compras?maquinaria=${encodeURIComponent(entityId)}` };
    }
  }

  if (entity === 'repuesto') {
    if (tagKey === 'catalogo') {
      // Align to compras list with repuesto filter
      return { type: 'link', value: `/compras?repuesto=${encodeURIComponent(entityId)}` };
    }
  }

  return null;
}
