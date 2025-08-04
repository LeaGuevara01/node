// Archivo temporal para crear la estructura correcta
// Layout structure for maquinarias:
/*
<div className={LIST_STYLES.itemHeader}>
  <h3 className={LIST_STYLES.itemTitle}>{maquinaria.nombre}</h3>
</div>
{(maquinaria.modelo || maquinaria.estado) && (
  <div className={LIST_STYLES.itemDescription}>
    {maquinaria.modelo && (
      <span className="flex-1">{maquinaria.modelo}</span>
    )}
    <span className={`${LIST_STYLES.itemTag} ${getEstadoColorClass(maquinaria.estado)} flex-shrink-0`}>
      <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {maquinaria.estado || 'Sin estado'}
    </span>
  </div>
)}
<div className={LIST_STYLES.itemTagsRow}>
  <div className={LIST_STYLES.itemTagsLeft}>
    {maquinaria.categoria && (
      <span className={`${LIST_STYLES.itemTag} ${getColorFromString(maquinaria.categoria, 'categoria')}`}>
        <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        {maquinaria.categoria}
      </span>
    )}
    {maquinaria.ubicacion && (
      <span className={`${LIST_STYLES.itemTag} ${getColorFromString(maquinaria.ubicacion, 'ubicacion')}`}>
        <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {maquinaria.ubicacion}
      </span>
    )}
    {maquinaria.anio && (
      <span className={`${LIST_STYLES.itemTag} ${TEXT_STYLES.gray}`}>
        <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {formatAnio(maquinaria.anio)}
      </span>
    )}
  </div>
  <div className={LIST_STYLES.itemActions}>
    <button
      onClick={() => openEditModal(maquinaria)}
      className={BUTTON_STYLES.edit}
    >
      <svg className={ICON_STYLES.small} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>
  </div>
</div>
*/
