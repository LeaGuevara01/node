const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Función para parsear rangos de año
const parseAnioRange = (rangeString) => {
  if (!rangeString || rangeString.trim() === '') {
    return { min: null, max: null };
  }

  const trimmed = rangeString.trim();
  
  // Formato "min-max" (ej: "2010-2020")
  if (trimmed.includes('-') && !trimmed.startsWith('-')) {
    const [minStr, maxStr] = trimmed.split('-');
    return {
      min: minStr ? parseInt(minStr) : null,
      max: maxStr ? parseInt(maxStr) : null
    };
  }
  
  // Formato "min+" (ej: "2010+")
  if (trimmed.endsWith('+')) {
    const minStr = trimmed.slice(0, -1);
    return {
      min: minStr ? parseInt(minStr) : null,
      max: null
    };
  }
  
  // Formato "-max" (ej: "-2020")
  if (trimmed.startsWith('-')) {
    const maxStr = trimmed.slice(1);
    return {
      min: null,
      max: maxStr ? parseInt(maxStr) : null
    };
  }
  
  // Formato simple "valor" (se interpreta como valor exacto)
  const value = parseInt(trimmed);
  if (!isNaN(value)) {
    return { min: value, max: value };
  }
  
  return { min: null, max: null };
};

exports.getMaquinarias = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      categoria, 
      ubicacion, 
      estado,
      anioMin,
      anioMax,
      sortBy = 'categoria',
      sortOrder = 'asc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Construir el where object para filtros
    const where = {};

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { modelo: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
        { numero_serie: { contains: search, mode: 'insensitive' } },
        { proveedor: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (categoria) {
      where.categoria = { contains: categoria, mode: 'insensitive' };
    }

    if (ubicacion) {
      where.ubicacion = { contains: ubicacion, mode: 'insensitive' };
    }

    if (estado) {
      where.estado = { contains: estado, mode: 'insensitive' };
    }

    if (anioMin || anioMax) {
      where.anio = {};
      if (anioMin) where.anio.gte = parseInt(anioMin);
      if (anioMax) where.anio.lte = parseInt(anioMax);
    }

    // Configurar ordenamiento
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    // Ejecutar consultas
    const [maquinarias, total] = await Promise.all([
      prisma.maquinaria.findMany({
        where,
        skip,
        take,
        orderBy
      }),
      prisma.maquinaria.count({ where })
    ]);

    // Respuesta con paginación
    res.json({
      maquinarias,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / take),
        totalItems: total,
        limit: take
      }
    });
  } catch (err) {
    console.error('Error en getMaquinarias:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.createMaquinaria = async (req, res) => {
  const { nombre, modelo, categoria, anio, numero_serie, descripcion, proveedor, ubicacion, estado } = req.body;
  try {
    const data = { 
      nombre, 
      modelo, 
      categoria,
      anio: anio ? Number(anio) : null,
      numero_serie: numero_serie || null,
      descripcion: descripcion || null,
      proveedor: proveedor || null,
      ubicacion: ubicacion || null,
      estado: estado || null
    };

    const maquinaria = await prisma.maquinaria.create({ data });
    res.status(201).json(maquinaria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMaquinaria = async (req, res) => {
  const { id } = req.params;
  const { nombre, modelo, categoria, anio, numero_serie, descripcion, proveedor, ubicacion, estado } = req.body;
  try {
    const data = { 
      nombre, 
      modelo, 
      categoria,
      anio: anio ? Number(anio) : null,
      numero_serie: numero_serie || null,
      descripcion: descripcion || null,
      proveedor: proveedor || null,
      ubicacion: ubicacion || null,
      estado: estado || null
    };

    const maquinaria = await prisma.maquinaria.update({
      where: { id: Number(id) },
      data
    });
    res.json(maquinaria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMaquinaria = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.maquinaria.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Maquinaria eliminada' });
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Maquinaria no encontrada' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

// Nuevo endpoint para obtener opciones de filtros
exports.getMaquinariaFilters = async (req, res) => {
  try {
    const [categorias, ubicaciones, estados, estadisticas] = await Promise.all([
      prisma.maquinaria.findMany({
        select: { categoria: true },
        where: { categoria: { not: null } },
        distinct: ['categoria']
      }),
      prisma.maquinaria.findMany({
        select: { ubicacion: true },
        where: { ubicacion: { not: null } },
        distinct: ['ubicacion']
      }),
      prisma.maquinaria.findMany({
        select: { estado: true },
        where: { estado: { not: null } },
        distinct: ['estado']
      }),
      // Obtener estadísticas de años
      prisma.maquinaria.aggregate({
        _min: { anio: true },
        _max: { anio: true },
        _count: { id: true }
      })
    ]);

    res.json({
      categorias: categorias.map(item => item.categoria).filter(Boolean).sort(),
      ubicaciones: ubicaciones.map(item => item.ubicacion).filter(Boolean).sort(),
      estados: estados.map(item => item.estado).filter(Boolean).sort(),
      anioRange: {
        min: estadisticas._min.anio || 1900,
        max: estadisticas._max.anio || new Date().getFullYear()
      },
      totalMaquinarias: estadisticas._count.id
    });
  } catch (err) {
    console.error('Error en getMaquinariaFilters:', err);
    res.status(500).json({ error: err.message });
  }
};
