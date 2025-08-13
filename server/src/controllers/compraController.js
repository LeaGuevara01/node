const prisma = require('../lib/prisma');

// Helper to compute totals
function computeTotal(detalles) {
  return detalles.reduce(
    (sum, d) => sum + Number(d.precioUnitario || 0) * Number(d.cantidad || 0),
    0
  );
}

exports.listCompras = async (req, res) => {
  try {
    const { page = 1, limit = 20, proveedorId, estado, fechaInicio, fechaFin, q } = req.query;
    const where = {};

    if (proveedorId) where.proveedorId = Number(proveedorId);
    if (estado) where.estado = { in: Array.isArray(estado) ? estado : String(estado).split(',') };
    if (fechaInicio || fechaFin) {
      where.fecha = {};
      if (fechaInicio) where.fecha.gte = new Date(fechaInicio);
      if (fechaFin) where.fecha.lte = new Date(fechaFin);
    }
    if (q) {
      where.OR = [
        { notas: { contains: q, mode: 'insensitive' } },
        { proveedor: { nombre: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [compras, total] = await Promise.all([
      prisma.compra.findMany({
        where,
        include: {
          proveedor: true,
          detalles: { include: { repuesto: true, maquinaria: true, reparacion: true } },
        },
        orderBy: { fecha: 'desc' },
        skip,
        take,
      }),
      prisma.compra.count({ where }),
    ]);

    res.json({
      data: compras,
      pagination: { current: Number(page), total: Math.ceil(total / take), totalItems: total },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await prisma.compra.findUnique({
      where: { id: Number(id) },
      include: {
        proveedor: true,
        detalles: { include: { repuesto: true, maquinaria: true, reparacion: true } },
      },
    });
    if (!compra) return res.status(404).json({ error: 'Compra no encontrada' });
    res.json(compra);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createCompra = async (req, res) => {
  try {
    const { fecha, proveedorId, estado = 'PENDIENTE', notas, detalles = [] } = req.body;

    // Validate proveedor exists
    const proveedor = await prisma.proveedor.findUnique({ where: { id: Number(proveedorId) } });
    if (!proveedor) return res.status(400).json({ error: 'Proveedor no existe' });

    // Validate repuestos referenced
    for (const d of detalles) {
      const rep = await prisma.repuesto.findUnique({ where: { id: Number(d.repuestoId) } });
      if (!rep) return res.status(400).json({ error: `Repuesto ${d.repuestoId} no existe` });
    }

    const total = computeTotal(detalles);

    const compra = await prisma.$transaction(async (tx) => {
      const created = await tx.compra.create({
        data: {
          fecha: fecha ? new Date(fecha) : new Date(),
          proveedorId: Number(proveedorId),
          estado,
          notas: notas || null,
          total,
          detalles: {
            create: detalles.map((d) => ({
              repuestoId: Number(d.repuestoId),
              cantidad: Number(d.cantidad || 1),
              precioUnitario: d.precioUnitario ? Number(d.precioUnitario) : null,
              maquinariaId: d.maquinariaId ? Number(d.maquinariaId) : null,
              reparacionId: d.reparacionId ? Number(d.reparacionId) : null,
            })),
          },
        },
        include: { proveedor: true, detalles: true },
      });

      // If estado RECIBIDA, update stock
      if (estado === 'RECIBIDA') {
        for (const d of detalles) {
          await tx.repuesto.update({
            where: { id: Number(d.repuestoId) },
            data: { stock: { increment: Number(d.cantidad || 0) } },
          });
        }
      }

      return created;
    });

    res.status(201).json(compra);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, proveedorId, estado, notas, detalles = [] } = req.body;

    const original = await prisma.compra.findUnique({
      where: { id: Number(id) },
      include: { detalles: true },
    });
    if (!original) return res.status(404).json({ error: 'Compra no encontrada' });

    // Basic validation
    if (proveedorId) {
      const proveedor = await prisma.proveedor.findUnique({ where: { id: Number(proveedorId) } });
      if (!proveedor) return res.status(400).json({ error: 'Proveedor no existe' });
    }

    const total = computeTotal(detalles);

    const updated = await prisma.$transaction(async (tx) => {
      // Reverse stock if changing from RECIBIDA to other and details changed (simplified: not reversing)
      // Strategy: Only apply stock increment if transitioning to RECIBIDA and was not previously RECIBIDA

      const compra = await tx.compra.update({
        where: { id: Number(id) },
        data: {
          fecha: fecha ? new Date(fecha) : original.fecha,
          proveedorId: proveedorId ? Number(proveedorId) : original.proveedorId,
          estado: estado || original.estado,
          notas: typeof notas === 'undefined' ? original.notas : notas,
          total,
          detalles: { deleteMany: {} },
        },
      });

      // Recreate details
      if (detalles.length) {
        await tx.compraDetalle.createMany({
          data: detalles.map((d) => ({
            compraId: compra.id,
            repuestoId: Number(d.repuestoId),
            cantidad: Number(d.cantidad || 1),
            precioUnitario: d.precioUnitario ? Number(d.precioUnitario) : null,
            maquinariaId: d.maquinariaId ? Number(d.maquinariaId) : null,
            reparacionId: d.reparacionId ? Number(d.reparacionId) : null,
          })),
        });
      }

      // Apply stock increment if needed
      if (estado === 'RECIBIDA' && original.estado !== 'RECIBIDA') {
        for (const d of detalles) {
          await tx.repuesto.update({
            where: { id: Number(d.repuestoId) },
            data: { stock: { increment: Number(d.cantidad || 0) } },
          });
        }
      }

      return compra;
    });

    const compraWithRels = await prisma.compra.findUnique({
      where: { id: updated.id },
      include: {
        proveedor: true,
        detalles: { include: { repuesto: true, maquinaria: true, reparacion: true } },
      },
    });

    res.json(compraWithRels);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCompra = async (req, res) => {
  try {
    const { id } = req.params;

    const compra = await prisma.compra.findUnique({ where: { id: Number(id) } });
    if (!compra) return res.status(404).json({ error: 'Compra no encontrada' });

    await prisma.$transaction(async (tx) => {
      await tx.compraDetalle.deleteMany({ where: { compraId: Number(id) } });
      await tx.compra.delete({ where: { id: Number(id) } });
    });

    res.json({ message: 'Compra eliminada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.statsCompras = async (req, res) => {
  try {
    const [porProveedor, porEstado, totalMensual] = await Promise.all([
      prisma.compra.groupBy({ by: ['proveedorId'], _count: { id: true }, _sum: { total: true } }),
      prisma.compra.groupBy({ by: ['estado'], _count: { id: true }, _sum: { total: true } }),
      prisma.$queryRaw`SELECT date_trunc('month', fecha) as mes, COUNT(*) as cantidad, SUM(COALESCE(total,0)) as total FROM "Compra" GROUP BY mes ORDER BY mes DESC LIMIT 12`,
    ]);

    res.json({ porProveedor, porEstado, totalMensual });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
