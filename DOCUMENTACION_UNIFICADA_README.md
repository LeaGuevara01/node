# Documentación Unificada del Proyecto

## 1. Resumen de Implementaciones

### Modularización y Estandarización
- Se crearon los componentes genéricos `EntityList` y `EntityForm` para listar y editar entidades de forma modular.
- Todas las páginas principales (`Compras`, `Usuarios`, `Repuestos`, `Reparaciones`, `Proveedores`, `Maquinarias`, `Componentes`) fueron refactorizadas para usar estos componentes y el layout unificado (`AppLayout`).
- Se centralizaron los estilos en `componentStyles.js` para mantener coherencia visual.

### Backend y Migraciones
- Se eliminaron campos obsoletos (ej: `precio` en el modelo de `Componente`).
- Se implementaron relaciones entre `Compras`, `Proveedores` y `Repuestos` en Prisma.
- Se realizaron migraciones y backups de datos antes y después de los cambios.

## 2. Registro de Deprecaciones
- Componentes específicos de listas y formularios para cada entidad fueron deprecados y reemplazados por los genéricos.
- Lógica de filtrado y modales personalizada fue centralizada o eliminada.
- Estilos individuales migrados a `componentStyles.js`.

## 3. Migraciones Realizadas
- Prisma: Actualización de esquemas y migraciones ejecutadas con respaldo previo.
- Backup: Scripts de backup y restauración documentados en `scripts/`.
- Restauración: Proceso validado y documentado.

## 4. Instrucciones de Uso
- Para agregar una nueva entidad, crear el modelo en Prisma, migrar, y reutilizar `EntityList`/`EntityForm` en la nueva página.
- Para mantener estilos, modificar únicamente `componentStyles.js`.
- Para restaurar datos, usar los scripts de backup en la carpeta `scripts/`.

## 5. Mantenimiento
- Mantener la modularidad y evitar duplicación de código.
- Registrar futuras deprecaciones y migraciones en los archivos correspondientes.

---

### Archivos Relevantes
- `client/src/components/EntityList.jsx`
- `client/src/components/EntityForm.jsx`
- `client/src/pages/*Page.jsx`
- `client/src/componentStyles.js`
- `server/prisma/schema.prisma`
- `scripts/backup/restore scripts`

## 6. Historial de Cambios
- Modularización completa de páginas principales.
- Refactorización de estilos y lógica común.
- Migraciones y backups realizados.
- Registro de deprecaciones y migraciones actualizado.

---

Para detalles técnicos, consultar los archivos mencionados y los logs de migración en `docs/` y `scripts/`.
