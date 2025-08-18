// Módulo: Reparación Controller
// Rol: listar/CRUD de reparaciones, incluye relaciones (maquinaria, usuario, repuestos)
// Notas: filtros por fechas, usuario, maquinaria y repuesto

const prisma = require('../lib/prisma');

exports.getReparaciones = async (req, res) => {
  try {
    const {
      search,
      maquinariaId,
      userId,
      repuestoId,
      fechaInicio,
      fechaFin,
      fechaMin,
      fechaMax,
      estado,
      page = 1,
      limit = 20,
    } = req.query;

    const where = {};
    const include = {
      repuestos: { include: { repuesto: true } },
      usuario: { select: { id: true, username: true } },
      maquinaria: { select: { id: true, nombre: true, modelo: true } },
    };

    // Filtro por búsqueda de texto
    if (search) {
      where.OR = [
        { descripcion: { contains: search, mode: 'insensitive' } },
        { maquinaria: { nombre: { contains: search, mode: 'insensitive' } } },
        { usuario: { username: { contains: search, mode: 'insensitive' } } },
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
          repuestoId: Number(repuestoId),
        },
      };
    }

    // Filtro por rango de fechas
    const fechaDesde = fechaInicio || fechaMin;
    const fechaHasta = fechaFin || fechaMax;
    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) {
        where.fecha.gte = new Date(fechaDesde);
      }
      if (fechaHasta) {
        where.fecha.lte = new Date(fechaHasta);
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
        orderBy: { fecha: 'desc' },
      }),
      prisma.reparacion.count({ where }),
    ]);

    res.json({
      data: reparaciones,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / take),
        totalItems: total,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReparacion = async (req, res) => {
  const { id } = req.params;
  try {
    // Validación temprana de ID numérico
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID de reparación inválido' });
    }
    const reparacion = await prisma.reparacion.findUnique({
      where: { id: Number(id) },
      include: {
        repuestos: { include: { repuesto: true } },
        usuario: { select: { id: true, username: true } },
        maquinaria: { select: { id: true, nombre: true, modelo: true } },
      },
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
          create: (repuestos || []).map((r) => ({
            repuestoId: r.repuestoId,
            cantidad: r.cantidad,
          })),
        },
      },
      include: {
        repuestos: { include: { repuesto: true } },
        usuario: { select: { id: true, username: true } },
        maquinaria: { select: { id: true, nombre: true, modelo: true } },
      },
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
      where: { reparacionId: Number(id) },
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
          create: (repuestos || []).map((r) => ({
            repuestoId: r.repuestoId,
            cantidad: r.cantidad,
          })),
        },
      },
      include: {
        repuestos: { include: { repuesto: true } },
        usuario: { select: { id: true, username: true } },
        maquinaria: { select: { id: true, nombre: true, modelo: true } },
      },
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
      where: { id: Number(id) },
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

// Opciones de filtros para reparaciones
// Nota: el modelo de Reparacion no incluye campos tipo/estado/prioridad en la BD,
// por lo que devolvemos opciones estándar y el rango de fechas real desde los datos.
exports.getReparacionFilters = async (req, res) => {
  try {
    const stats = await prisma.reparacion.aggregate({
      _min: { fecha: true },
      _max: { fecha: true },
      _count: { id: true },
    });

    const fechaMin = stats._min.fecha ? stats._min.fecha.toISOString().slice(0, 10) : null;
    const fechaMax = stats._max.fecha ? stats._max.fecha.toISOString().slice(0, 10) : null;

    // Opciones predefinidas comunes para mantenimiento
    const tipos = ['Correctivo', 'Preventivo', 'Predictivo'];
    const estados = ['Pendiente', 'En Progreso', 'Completada', 'Cancelada'];
    const prioridades = ['Alta', 'Media', 'Baja'];

    return res.json({
      tipos,
      estados,
      prioridades,
      fechaRange: { min: fechaMin, max: fechaMax },
      totalReparaciones: stats._count.id,
    });
  } catch (err) {
    console.error('Error en getReparacionFilters:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getReparacionFiltersSimple = async (req, res) => {
  try {
    // Obtener opciones de maquinaria y repuestos para filtros simples
    const [maquinarias, repuestos, fechas] = await Promise.all([
      prisma.maquinaria.findMany({
        select: { id: true, nombre: true, modelo: true },
        orderBy: { nombre: 'asc' },
      }),
      prisma.repuesto.findMany({
        select: { id: true, nombre: true, codigo: true, categoria: true },
        orderBy: { nombre: 'asc' },
      }),
      prisma.reparacion.aggregate({
        _min: { fecha: true },
        _max: { fecha: true },
      }),
    ]);

    res.json({
      maquinarias,
      repuestos,
      fechaRange: {
        min: fechas._min.fecha,
        max: fechas._max.fecha,
      },
      // Puedes agregar más opciones estándar si el modelo lo permite
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
