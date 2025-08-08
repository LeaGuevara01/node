const prisma = require('../lib/prisma');

// Función para parsear rangos de stock/año
const parseStockRange = (rangeString) => {
  if (!rangeString || rangeString.trim() === '') {
    return { min: null, max: null };
  }

  const trimmed = rangeString.trim();
  
  // Formato "min-max" (ej: "10-50")
  if (trimmed.includes('-') && !trimmed.startsWith('-')) {
    const [minStr, maxStr] = trimmed.split('-');
    return {
      min: minStr ? parseInt(minStr) : null,
      max: maxStr ? parseInt(maxStr) : null
    };
  }
  
  // Formato "min+" (ej: "10+")
  if (trimmed.endsWith('+')) {
    const minStr = trimmed.slice(0, -1);
    return {
      min: minStr ? parseInt(minStr) : null,
      max: null
    };
  }
  
  // Formato "-max" (ej: "-50")
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

exports.getRepuestos = async (req, res) => {
  try {
    const { 
      search, 
      categoria, 
      ubicacion, 
      stockMin, 
      stockMax, 
      sinStock,
      codigo,
      page = 1, 
      limit = 50,
      sortBy = 'nombre',
      sortOrder = 'asc'
    } = req.query;

    // Construir filtros dinámicamente
    const where = {};
    const orderBy = {};

    // Filtro de búsqueda por nombre, código o descripción
    if (search) {
      const searchTerms = Array.isArray(search) ? search : search.split(',');
      where.OR = searchTerms.flatMap(term => [
        { nombre: { contains: term.trim(), mode: 'insensitive' } },
        { codigo: { contains: term.trim(), mode: 'insensitive' } },
        { descripcion: { contains: term.trim(), mode: 'insensitive' } }
      ]);
    }

    // Filtro por código específico (puede ser múltiple)
    if (codigo) {
      const codigoTerms = Array.isArray(codigo) ? codigo : codigo.split(',');
      if (codigoTerms.length === 1) {
        where.codigo = { contains: codigoTerms[0].trim(), mode: 'insensitive' };
      } else {
        where.OR = [...(where.OR || []), ...codigoTerms.map(term => ({
          codigo: { contains: term.trim(), mode: 'insensitive' }
        }))];
      }
    }

    // Filtro por categoría
    if (categoria && categoria !== 'all') {
      where.categoria = categoria;
    }

    // Filtro por ubicación
    if (ubicacion && ubicacion !== 'all') {
      where.ubicacion = ubicacion;
    }

    // Filtro por stock mínimo
    if (stockMin) {
      where.stock = { ...where.stock, gte: parseInt(stockMin) };
    }

    // Filtro por stock máximo
    if (stockMax) {
      where.stock = { ...where.stock, lte: parseInt(stockMax) };
    }

    // Filtro para repuestos sin stock
    if (sinStock === 'true') {
      where.stock = { lte: 0 };
    }

    // Configurar ordenamiento
    orderBy[sortBy] = sortOrder;

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Ejecutar consulta con filtros
    const [repuestos, total] = await Promise.all([
      prisma.repuesto.findMany({
        where,
        orderBy,
        skip,
        take
      }),
      prisma.repuesto.count({ where })
    ]);

    // Calcular información de paginación
    const totalPages = Math.ceil(total / take);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      repuestos,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        hasNext: hasNextPage,
        hasPrev: hasPrevPage,
        totalItems: total
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createRepuesto = async (req, res) => {
  const { nombre, stock, codigo, descripcion, precio, proveedor, ubicacion, categoria } = req.body;
  try {
    const data = { 
      nombre, 
      stock: Number(stock),
      codigo: codigo || null,
      descripcion: descripcion || null,
      precio: precio ? Number(precio) : null,
      proveedor: proveedor || null,
      ubicacion: ubicacion || null,
      categoria: categoria || null
    };

    const repuesto = await prisma.repuesto.create({ data });
    res.status(201).json(repuesto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateRepuesto = async (req, res) => {
  const { id } = req.params;
  const { nombre, stock, codigo, descripcion, precio, proveedor, ubicacion, categoria } = req.body;
  try {
    const data = { 
      nombre, 
      stock: Number(stock),
      codigo: codigo || null,
      descripcion: descripcion || null,
      precio: precio ? Number(precio) : null,
      proveedor: proveedor || null,
      ubicacion: ubicacion || null,
      categoria: categoria || null
    };

    const repuesto = await prisma.repuesto.update({
      where: { id: Number(id) },
      data
    });
    res.json(repuesto);
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Repuesto no encontrado' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

exports.deleteRepuesto = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.repuesto.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Repuesto eliminado' });
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Repuesto no encontrado' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

// Obtener opciones únicas para filtros
exports.getFilterOptions = async (req, res) => {
  try {
    const [categorias, ubicaciones, estadisticas] = await Promise.all([
      // Obtener categorías únicas
      prisma.repuesto.findMany({
        select: { categoria: true },
        where: { categoria: { not: null } },
        distinct: ['categoria']
      }),
      // Obtener ubicaciones únicas
      prisma.repuesto.findMany({
        select: { ubicacion: true },
        where: { ubicacion: { not: null } },
        distinct: ['ubicacion']
      }),
      // Obtener estadísticas de stock
      prisma.repuesto.aggregate({
        _min: { stock: true },
        _max: { stock: true },
        _count: { id: true }
      })
    ]);

    res.json({
      categorias: categorias.map(c => c.categoria).sort(),
      ubicaciones: ubicaciones.map(u => u.ubicacion).sort(),
      stockRange: {
        min: estadisticas._min.stock || 0,
        max: estadisticas._max.stock || 0
      },
      totalRepuestos: estadisticas._count.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener estadísticas de repuestos
exports.getEstadisticas = async (req, res) => {
  try {
    const [
      totalRepuestos,
      repuestosSinStock,
      stockBajo,
      porCategoria,
      porUbicacion
    ] = await Promise.all([
      // Total de repuestos
      prisma.repuesto.count(),
      
      // Repuestos sin stock
      prisma.repuesto.count({
        where: { stock: { lte: 0 } }
      }),
      
      // Repuestos con stock bajo (menos de 3)
      prisma.repuesto.count({
        where: { stock: { lte: 2, gt: 0 } }
      }),
      
      // Agrupado por categoría
      prisma.repuesto.groupBy({
        by: ['categoria'],
        _count: { id: true },
        _sum: { stock: true },
        where: { categoria: { not: null } }
      }),
      
      // Agrupado por ubicación
      prisma.repuesto.groupBy({
        by: ['ubicacion'],
        _count: { id: true },
        _sum: { stock: true },
        where: { ubicacion: { not: null } }
      })
    ]);

    res.json({
      resumen: {
        total: totalRepuestos,
        sinStock: repuestosSinStock,
        stockBajo: stockBajo,
        stockDisponible: totalRepuestos - repuestosSinStock
      },
      porCategoria: porCategoria.map(item => ({
        categoria: item.categoria,
        cantidad: item._count.id,
        stockTotal: item._sum.stock || 0
      })),
      porUbicacion: porUbicacion.map(item => ({
        ubicacion: item.ubicacion,
        cantidad: item._count.id,
        stockTotal: item._sum.stock || 0
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Búsqueda rápida de repuestos
exports.busquedaRapida = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const repuestos = await prisma.repuesto.findMany({
      where: {
        OR: [
          { nombre: { contains: q, mode: 'insensitive' } },
          { codigo: { contains: q, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        nombre: true,
        codigo: true,
        stock: true,
        categoria: true,
        ubicacion: true
      },
      take: 10,
      orderBy: { nombre: 'asc' }
    });

    res.json(repuestos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un repuesto por ID
exports.getRepuestoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const repuesto = await prisma.repuesto.findUnique({
      where: { 
        id: parseInt(id) 
      }
    });

    if (!repuesto) {
      return res.status(404).json({ error: 'Repuesto no encontrado' });
    }

    res.json(repuesto);
  } catch (err) {
    console.error('Error al obtener repuesto por ID:', err);
    res.status(500).json({ error: err.message });
  }
};
