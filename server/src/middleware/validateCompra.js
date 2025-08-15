module.exports = function validateCompra(req, res, next) {
  const { proveedorId, detalles } = req.body;
  if (!proveedorId) return res.status(400).json({ error: 'proveedorId es requerido' });
  if (!Array.isArray(detalles) || detalles.length === 0)
    return res.status(400).json({ error: 'detalles es requerido y no puede ser vacío' });
  for (const d of detalles) {
    if (!d.repuestoId) return res.status(400).json({ error: 'Cada detalle requiere repuestoId' });
    if (!d.cantidad || Number(d.cantidad) <= 0)
      return res.status(400).json({ error: 'Cada detalle requiere cantidad > 0' });
  }
  return next();
};
