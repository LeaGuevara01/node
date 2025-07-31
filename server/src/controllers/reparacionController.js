const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getReparaciones = async (req, res) => {
  try {
    const reparaciones = await prisma.reparacion.findMany({ 
      include: { 
        repuestos: { include: { repuesto: true } }, 
        usuario: { select: { id: true, username: true } },
        maquinaria: { select: { id: true, nombre: true, modelo: true } }
      } 
    });
    res.json(reparaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createReparacion = async (req, res) => {
  const { fecha, maquinariaId, descripcion, repuestos, userId } = req.body;
  try {
    // Validate if maquinariaId exists
    const maquinariaExists = await prisma.maquinaria.findUnique({ where: { id: maquinariaId } });
    if (!maquinariaExists) {
      return res.status(400).json({ error: 'El ID de maquinaria no existe.' });
    }

    // Validate if userId exists (if provided)
    if (userId) {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) {
        return res.status(400).json({ error: 'El ID de usuario no existe.' });
      }
    }

    const reparacion = await prisma.reparacion.create({
      data: {
        fecha: new Date(fecha),
        maquinariaId,
        descripcion: descripcion || null,
        userId: userId || null,
        repuestos: {
          create: (repuestos || []).map(r => ({ repuestoId: r.repuestoId, cantidad: r.cantidad }))
        }
      },
      include: { 
        repuestos: { include: { repuesto: true } }, 
        usuario: { select: { id: true, username: true } },
        maquinaria: { select: { id: true, nombre: true, modelo: true } }
      }
    });
    res.status(201).json(reparacion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateReparacion = async (req, res) => {
  const { id } = req.params;
  const { fecha, maquinariaId, descripcion, repuestos, userId } = req.body;
  try {
    // Validate if maquinariaId exists
    const maquinariaExists = await prisma.maquinaria.findUnique({ where: { id: maquinariaId } });
    if (!maquinariaExists) {
      return res.status(400).json({ error: 'El ID de maquinaria no existe.' });
    }

    // Validate if userId exists (if provided)
    if (userId) {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) {
        return res.status(400).json({ error: 'El ID de usuario no existe.' });
      }
    }

    // First, delete existing repuestos relationships
    await prisma.reparacionRepuesto.deleteMany({
      where: { reparacionId: Number(id) }
    });

    // Update the reparacion with new data
    const reparacion = await prisma.reparacion.update({
      where: { id: Number(id) },
      data: {
        fecha: new Date(fecha),
        maquinariaId,
        descripcion: descripcion || null,
        userId: userId || null,
        repuestos: {
          create: (repuestos || []).map(r => ({ repuestoId: r.repuestoId, cantidad: r.cantidad }))
        }
      },
      include: { 
        repuestos: { include: { repuesto: true } }, 
        usuario: { select: { id: true, username: true } },
        maquinaria: { select: { id: true, nombre: true, modelo: true } }
      }
    });
    res.json(reparacion);
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Reparación no encontrada' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

exports.deleteReparacion = async (req, res) => {
  const { id } = req.params;
  try {
    // Delete the reparacion (cascading will handle repuestos relationships)
    await prisma.reparacion.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Reparación eliminada' });
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Reparación no encontrada' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};
