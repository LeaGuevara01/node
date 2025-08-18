// Módulo: Maquinaria Controller
// Rol: listar/CRUD, filtros avanzados, opciones de filtros
// Notas: paginación (page/limit), orden (sortBy/sortOrder), búsqueda flexible

const prisma = require('../lib/prisma.js');

// (parseAnioRange function removed because it is not used)

// Listar maquinarias con filtros, paginación y ordenamiento
exports.getMaquinarias = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      modelo,
      categoria,
      ubicacion,
      estado,
      anioMin,
      anioMax,
      sortBy = 'categoria',
      sortOrder = 'asc',
    } = req.query;

    // Limitar el máximo de registros por petición
    const MAX_LIMIT = 100;
    let parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1) parsedLimit = 10;
    if (parsedLimit > MAX_LIMIT) parsedLimit = MAX_LIMIT;

    const skip = (parseInt(page) - 1) * parsedLimit;
    const take = parsedLimit;

    // Construir el where object para filtros
    const andConditions = [];
    let terminos = [];
    if (search) {
      if (typeof search === 'string') {
        terminos = search.split(',').map((t) => t.trim()).filter((t) => t);
      } else if (Array.isArray(search)) {
        terminos = search.filter((t) => t);
      }
      if (terminos.length > 0) {
        andConditions.push({
          OR: terminos.map((t) => ({
            OR: [
              { nombre: { contains: t, mode: 'insensitive' } },
              { modelo: { contains: t, mode: 'insensitive' } },
              { categoria: { contains: t, mode: 'insensitive' } },
              { ubicacion: { contains: t, mode: 'insensitive' } },
              { estado: { contains: t, mode: 'insensitive' } },
            ],
          })),
        });
      }
    }

    if (modelo) {
      // Permitir búsqueda por múltiples términos separados por coma, LIKE
      const modelos = Array.isArray(modelo) ? modelo : modelo.split(',').map((m) => m.trim()).filter((m) => m);
      if (modelos.length > 0) {
        andConditions.push({
          OR: modelos.map((m) => ({ modelo: { contains: m, mode: 'insensitive' } })),
        });
      }
    }
    if (categoria) {
      const categorias = Array.isArray(categoria) ? categoria : categoria.split(',').map((c) => c.trim()).filter((c) => c);
      if (categorias.length > 0) {
        andConditions.push({
          OR: categorias.map((c) => ({ categoria: { contains: c, mode: 'insensitive' } })),
        });
      }
    }
    if (ubicacion) {
      const ubicaciones = Array.isArray(ubicacion) ? ubicacion : ubicacion.split(',').map((u) => u.trim()).filter((u) => u);
      if (ubicaciones.length > 0) {
        andConditions.push({
          OR: ubicaciones.map((u) => ({ ubicacion: { contains: u, mode: 'insensitive' } })),
        });
      }
    }
    if (estado) {
      const estados = Array.isArray(estado) ? estado : estado.split(',').map((e) => e.trim()).filter((e) => e);
      if (estados.length > 0) {
        andConditions.push({
          OR: estados.map((e) => ({ estado: { contains: e, mode: 'insensitive' } })),
        });
      }
    }
    if (anioMin) {
      andConditions.push({ anio: { gte: Number(anioMin) } });
    }
    if (anioMax) {
      andConditions.push({ anio: { lte: Number(anioMax) } });
    }

    const where = andConditions.length > 0 ? { AND: andConditions } : {};

    // Consulta principal
    const [maquinarias, total] = await Promise.all([
      prisma.maquinaria.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.maquinaria.count({ where }),
    ]);

    res.json({
      maquinarias,
      page: parseInt(page),
      limit: parsedLimit,
      total,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear maquinaria
exports.createMaquinaria = async (req, res) => {
  const {
    nombre,
    modelo,
    categoria,
    anio,
    numero_serie,
    descripcion,
    proveedor,
    ubicacion,
    estado,
  } = req.body;
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
      estado: estado || null,
    };

    const maquinaria = await prisma.maquinaria.create({
      data,
    });
    res.json(maquinaria);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar maquinaria
exports.updateMaquinaria = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    modelo,
    categoria,
    anio,
    numero_serie,
    descripcion,
    proveedor,
    ubicacion,
    estado,
  } = req.body;
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
      estado: estado || null,
    };

    const maquinaria = await prisma.maquinaria.update({
      where: { id: Number(id) },
      data,
    });
    res.json(maquinaria);
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Maquinaria no encontrada' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

// Eliminar maquinaria
exports.deleteMaquinaria = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.maquinaria.delete({
      where: { id: Number(id) },
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
        distinct: ['categoria'],
      }),
      prisma.maquinaria.findMany({
        select: { ubicacion: true },
        where: { ubicacion: { not: null } },
        distinct: ['ubicacion'],
      }),
      prisma.maquinaria.findMany({
        select: { estado: true },
        where: { estado: { not: null } },
        distinct: ['estado'],
      }),
      // Obtener estadísticas de años
      prisma.maquinaria.aggregate({
        _min: { anio: true },
        _max: { anio: true },
        _count: { id: true },
      }),
    ]);

    res.json({
      categorias: categorias
        .map((item) => item.categoria)
        .filter(Boolean)
        .sort(),
      ubicaciones: ubicaciones
        .map((item) => item.ubicacion)
        .filter(Boolean)
        .sort(),
      estados: estados
        .map((item) => item.estado)
        .filter(Boolean)
        .sort(),
      anioRange: {
        min: estadisticas._min.anio || 1900,
        max: estadisticas._max.anio || new Date().getFullYear(),
      },
      totalMaquinarias: estadisticas._count.id,
    });
  } catch (err) {
    console.error('Error en getMaquinariaFilters:', err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener maquinaria por ID
exports.getMaquinariaById = async (req, res) => {
  try {
    const { id } = req.params;

    const maquinaria = await prisma.maquinaria.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!maquinaria) {
      return res.status(404).json({ error: 'Maquinaria no encontrada' });
    }

    res.json(maquinaria);
  } catch (err) {
    console.error('Error al obtener maquinaria por ID:', err);
    res.status(500).json({ error: err.message });
  }
};
exports.createMaquinaria = async (req, res) => {
  const {
    nombre,
    modelo,
    categoria,
    anio,
    numero_serie,
    descripcion,
    proveedor,
    ubicacion,
    estado,
  } = req.body;
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
      estado: estado || null,
    };

    const maquinaria = await prisma.maquinaria.create({
      data,
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
      where: { id: Number(id) },
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
        distinct: ['categoria'],
      }),
      prisma.maquinaria.findMany({
        select: { ubicacion: true },
        where: { ubicacion: { not: null } },
        distinct: ['ubicacion'],
      }),
      prisma.maquinaria.findMany({
        select: { estado: true },
        where: { estado: { not: null } },
        distinct: ['estado'],
      }),
      // Obtener estadísticas de años
      prisma.maquinaria.aggregate({
        _min: { anio: true },
        _max: { anio: true },
        _count: { id: true },
      }),
    ]);

    res.json({
      categorias: categorias
        .map((item) => item.categoria)
        .filter(Boolean)
        .sort(),
      ubicaciones: ubicaciones
        .map((item) => item.ubicacion)
        .filter(Boolean)
        .sort(),
      estados: estados
        .map((item) => item.estado)
        .filter(Boolean)
        .sort(),
      anioRange: {
        min: estadisticas._min.anio || 1900,
        max: estadisticas._max.anio || new Date().getFullYear(),
      },
      totalMaquinarias: estadisticas._count.id,
    });
  } catch (err) {
    console.error('Error en getMaquinariaFilters:', err);
    res.status(500).json({ error: err.message });
  }
};
exports.getMaquinariaById = async (req, res) => {
  try {
    const { id } = req.params;

    const maquinaria = await prisma.maquinaria.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!maquinaria) {
      return res.status(404).json({ error: 'Maquinaria no encontrada' });
    }

    res.json(maquinaria);
  } catch (err) {
    console.error('Error al obtener maquinaria por ID:', err);
    res.status(500).json({ error: err.message });
  }
};
