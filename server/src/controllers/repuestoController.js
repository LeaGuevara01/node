// Módulo: Repuesto Controller
// Rol: listar/CRUD, filtros (categoría, ubicacion, stock), estadísticas
// Notas: respuestas con { repuestos, pagination } y endpoints auxiliares

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
      max: maxStr ? parseInt(maxStr) : null,
    };
  }

  // Formato "min+" (ej: "10+")
  if (trimmed.endsWith('+')) {
    const minStr = trimmed.slice(0, -1);
    return {
      min: minStr ? parseInt(minStr) : null,
      max: null,
    };
  }

  // Formato "-max" (ej: "-50")
  if (trimmed.startsWith('-')) {
    const maxStr = trimmed.slice(1);
    return {
      min: null,
      max: maxStr ? parseInt(maxStr) : null,
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
      disponibilidad,
      precioMin,
      precioMax,
      codigo,
      page = 1,
      limit = 50,
      sortBy = 'nombre',
      sortOrder = 'asc',
    } = req.query;

    // Limitar el máximo de registros por petición
    const MAX_LIMIT = 1000;
    let parsedLimit = parseInt(limit);
    if (isNaN(parsedLimit) || parsedLimit < 1) parsedLimit = 50;
    if (parsedLimit > MAX_LIMIT) parsedLimit = MAX_LIMIT;

    // Construir filtros dinámicamente con AND/OR correctamente agrupados
    const baseWhere = {};
    const andConds = [];
    const orderBy = {};

    // Filtro de búsqueda por nombre, código o descripción
    if (search) {
      const searchTerms = Array.isArray(search) ? search : search.split(',');
      const searchOR = searchTerms.flatMap((term) => {
        const t = term.trim();
        if (!t) return [];
        return [
          { nombre: { contains: t, mode: 'insensitive' } },
          { codigo: { contains: t, mode: 'insensitive' } },
          { descripcion: { contains: t, mode: 'insensitive' } },
        ];
      });
      if (searchOR.length) andConds.push({ OR: searchOR });
    }

    // Filtros modularizados
    const { buildStringFilter, buildRangeFilter } = require('../utils/filtrosBuilder');

    // Filtro por código apilado
    let codigos = [];
    if (Array.isArray(codigo)) {
      codigos = codigo;
    } else if (typeof codigo === 'string') {
      codigos = codigo.split(',').map(c => c.trim()).filter(Boolean);
    }
    if (codigos.length > 0) {
      andConds.push({
        OR: codigos.map(c => ({ codigo: { contains: c, mode: 'insensitive' } }))
      });
    }

    // Filtro por categoría apilado
    let categorias = [];
    if (Array.isArray(categoria)) {
      categorias = categoria;
    } else if (typeof categoria === 'string') {
      categorias = categoria.split(',').map(c => c.trim()).filter(Boolean);
    }
    if (categorias.length > 0) {
      andConds.push({
        OR: categorias.map(c => ({ categoria: { contains: c, mode: 'insensitive' } }))
      });
    }

    // Filtro por stock (rango)
    const stockFilter = buildRangeFilter(stockMin, stockMax);
    if (stockFilter && Object.keys(stockFilter).length) {
      andConds.push({ stock: stockFilter });
    }

    // Filtro por ubicación apilado
    let ubicaciones = [];
    if (Array.isArray(ubicacion)) {
      ubicaciones = ubicacion;
    } else if (typeof ubicacion === 'string') {
      ubicaciones = ubicacion.split(',').map(u => u.trim()).filter(Boolean);
    }
    if (ubicaciones.length > 0) {
      andConds.push({
        OR: ubicaciones.map(u => ({ ubicacion: { contains: u, mode: 'insensitive' } }))
      });
    }

    // Filtro por stock mínimo
    if (stockMin) {
      baseWhere.stock = { ...(baseWhere.stock || {}), gte: parseInt(stockMin) };
    }

    // Filtro por stock máximo
    if (stockMax) {
      baseWhere.stock = { ...(baseWhere.stock || {}), lte: parseInt(stockMax) };
    }

    // Filtro para repuestos sin stock
    const applySinStockOnly = sinStock === 'true';
    if (applySinStockOnly) {
      baseWhere.stock = { lte: 0 };
    }

    // Filtro por disponibilidad (alineado con Dashboard: 0 | 1 | >=2)
    if (disponibilidad && !applySinStockOnly) {
      // Normalizar valor/es y permitir múltiples separados por coma
      const normalize = (v) =>
        (v || '')
          .toString()
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '');
      const values = Array.isArray(disponibilidad) ? disponibilidad : disponibilidad.split(',');
      const norms = values.map(normalize);

      // Construir condiciones OR según buckets
      const orConds = [];
      if (norms.some((v) => ['sin stock', 'sinstock', '0', 'cero', 'zero'].includes(v))) {
        orConds.push({ stock: { lte: 0 } });
      }
      if (norms.some((v) => ['bajo', '1', 'uno', 'low'].includes(v) || v.startsWith('bajo'))) {
        orConds.push({ stock: 1 });
      }
      if (
        norms.some(
          (v) =>
            ['normal', '>=2', '2+', 'dos', 'twoplus', 'two+', 'dosplus'].includes(v) ||
            v.includes('2')
        )
      ) {
        orConds.push({ stock: { gte: 2 } });
      }
      if (orConds.length > 0) {
        andConds.push({ OR: orConds });
      }
    }

    // Filtros por precio (acepta 0 como valor válido)
    if (precioMin !== undefined && precioMin !== '') {
      baseWhere.precio = { ...(baseWhere.precio || {}), gte: parseInt(precioMin) };
    }
    if (precioMax !== undefined && precioMax !== '') {
      baseWhere.precio = { ...(baseWhere.precio || {}), lte: parseInt(precioMax) };
    }

    // Configurar ordenamiento
    orderBy[sortBy] = sortOrder;

  // Paginación
  const skip = (parseInt(page) - 1) * parsedLimit;
  const take = parsedLimit;

    // Ejecutar consulta con filtros
    const finalWhere = andConds.length
      ? Object.keys(baseWhere).length
        ? { AND: [baseWhere, ...andConds] }
        : { AND: andConds }
      : baseWhere;

    const [repuestos, total] = await Promise.all([
      prisma.repuesto.findMany({
        where: finalWhere,
        orderBy,
        skip,
        take,
      }),
      prisma.repuesto.count({ where: finalWhere }),
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
        totalItems: total,
      },
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
      categoria: categoria || null,
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
      categoria: categoria || null,
    };

    const repuesto = await prisma.repuesto.update({
      where: { id: Number(id) },
      data,
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
      where: { id: Number(id) },
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
    const [categorias, ubicaciones, estadisticas, precioStats] = await Promise.all([
      // Obtener categorías únicas
      prisma.repuesto.findMany({
        select: { categoria: true },
        where: { categoria: { not: null } },
        distinct: ['categoria'],
      }),
      // Obtener ubicaciones únicas
      prisma.repuesto.findMany({
        select: { ubicacion: true },
        where: { ubicacion: { not: null } },
        distinct: ['ubicacion'],
      }),
      // Obtener estadísticas de stock
      prisma.repuesto.aggregate({
        _min: { stock: true },
        _max: { stock: true },
        _count: { id: true },
      }),
      // Rango de precios
      prisma.repuesto.aggregate({
        _min: { precio: true },
        _max: { precio: true },
      }),
    ]);

    res.json({
      categorias: categorias.map((c) => c.categoria).sort(),
      ubicaciones: ubicaciones.map((u) => u.ubicacion).sort(),
      disponibilidades: ['Sin stock', 'Bajo (1)', 'Normal (≥2)'],
      stockRange: {
        min: estadisticas._min.stock || 0,
        max: estadisticas._max.stock || 0,
      },
      precioRange: {
        min: precioStats._min.precio ?? 0,
        max: precioStats._max.precio ?? 0,
      },
      totalRepuestos: estadisticas._count.id,
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
      stockIgualUno,
      stockNormalDosPlus,
      porCategoria,
      porUbicacion,
    ] = await Promise.all([
      // Total de repuestos
      prisma.repuesto.count(),

      // Repuestos sin stock
      prisma.repuesto.count({
        where: { stock: { lte: 0 } },
      }),

      // Repuestos con stock bajo (exactamente 1)
      prisma.repuesto.count({ where: { stock: 1 } }),

      // Repuestos con stock normal (>= 2)
      prisma.repuesto.count({ where: { stock: { gte: 2 } } }),

      // Agrupado por categoría
      prisma.repuesto.groupBy({
        by: ['categoria'],
        _count: { id: true },
        _sum: { stock: true },
        where: { categoria: { not: null } },
      }),

      // Agrupado por ubicación
      prisma.repuesto.groupBy({
        by: ['ubicacion'],
        _count: { id: true },
        _sum: { stock: true },
        where: { ubicacion: { not: null } },
      }),
    ]);

    res.json({
      resumen: {
        total: totalRepuestos,
        sinStock: repuestosSinStock,
        stockBajo: stockIgualUno,
        stockDisponible: stockNormalDosPlus,
      },
      porCategoria: porCategoria.map((item) => ({
        categoria: item.categoria,
        cantidad: item._count.id,
        stockTotal: item._sum.stock || 0,
      })),
      porUbicacion: porUbicacion.map((item) => ({
        ubicacion: item.ubicacion,
        cantidad: item._count.id,
        stockTotal: item._sum.stock || 0,
      })),
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
          { codigo: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        nombre: true,
        codigo: true,
        stock: true,
        categoria: true,
        ubicacion: true,
      },
      take: 10,
      orderBy: { nombre: 'asc' },
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
        id: parseInt(id),
      },
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

exports.bulkImportRepuestos = async (req, res) => {
  const repuestos = req.body.repuestos;
  if (!Array.isArray(repuestos)) {
    return res.status(400).json({ error: 'Formato inválido, se espera un array de repuestos' });
  }
  try {
    const created = [];
    for (const item of repuestos) {
      // Normaliza los campos y convierte stock a número
      const data = {
        nombre: item.nombre,
        stock: item.stock ? Number(item.stock) : 0,
        codigo: item.codigo || null,
        descripcion: item.descripcion || null,
        precio: item.precio ? Number(item.precio) : null,
        proveedor: item.proveedor || null,
        ubicacion: item.ubicacion || null,
        categoria: item.categoria || null,
      };
      const repuesto = await prisma.repuesto.create({ data });
      created.push(repuesto);
    }
    res.status(201).json({ created });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
