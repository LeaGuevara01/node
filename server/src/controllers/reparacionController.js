const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getReparaciones = async (req, res) => {
  try {
    const { 
      search, 
      maquinariaId, 
      userId, 
      repuestoId,
      fechaInicio, 
      fechaFin, 
      estado,
      page = 1, 
      limit = 20 
    } = req.query;

    const where = {};
    const include = {
      repuestos: { include: { repuesto: true } }, 
      usuario: { select: { id: true, username: true } },
      maquinaria: { select: { id: true, nombre: true, modelo: true } }
    };

    // Filtro por búsqueda de texto
    if (search) {
      where.OR = [
        { descripcion: { contains: search, mode: 'insensitive' } },
        { maquinaria: { nombre: { contains: search, mode: 'insensitive' } } },
        { usuario: { username: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Filtros específicos
    if (maquinariaId) {
      where.maquinariaId = Number(maquinariaId);
    }

    if (userId) {
      where.userId = Number(userId);
    }

    // Filtro por repuesto/componente
    if (repuestoId) {
      where.repuestos = {
        some: {
          repuestoId: Number(repuestoId)
        }
      };
    }

    // Filtro por rango de fechas
    if (fechaInicio || fechaFin) {
      where.fecha = {};
      if (fechaInicio) {
        where.fecha.gte = new Date(fechaInicio);
      }
      if (fechaFin) {
        where.fecha.lte = new Date(fechaFin);
      }
    }

    // Paginación
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [reparaciones, total] = await Promise.all([
      prisma.reparacion.findMany({
        where,
        include,
        skip,
        take,
        orderBy: { fecha: 'desc' }
      }),
      prisma.reparacion.count({ where })
    ]);

    res.json({
      data: reparaciones,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / take),
        totalItems: total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReparacion = async (req, res) => {
  const { id } = req.params;
  try {
    const reparacion = await prisma.reparacion.findUnique({
      where: { id: Number(id) },
      include: { 
        repuestos: { include: { repuesto: true } }, 
        usuario: { select: { id: true, username: true } },
        maquinaria: { select: { id: true, nombre: true, modelo: true } }
      }
    });
    
    if (!reparacion) {
      return res.status(404).json({ error: 'Reparación no encontrada' });
    }
    
    res.json(reparacion);
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
