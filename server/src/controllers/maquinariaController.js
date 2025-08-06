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

    console.log('🔍 Filtros recibidos en backend:', { search, categoria, ubicacion, estado, anioMin, anioMax });

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Construir el where object para filtros
    const where = {};
    const andConditions = [];

    if (search) {
      // Handle multiple search terms (comma-separated or array)
      let terminos = [];
      
      console.log('🔍 Valor de búsqueda RAW recibido:', search, 'Tipo:', typeof search);
      
      if (typeof search === 'string') {
        // Si es string, dividir por comas para múltiples términos
        terminos = search.split(',').map(t => t.trim()).filter(t => t);
        console.log('🔍 String dividido en términos:', terminos);
      } else if (Array.isArray(search)) {
        terminos = search.filter(t => t && t.trim());
        console.log('🔍 Array de términos filtrado:', terminos);
      } else {
        terminos = [search.toString()];
        console.log('🔍 Término convertido a string:', terminos);
      }
      
      console.log('🔍 Términos de búsqueda FINALES procesados:', terminos);
      
      if (terminos.length > 0) {
        // Para todos los casos (único o múltiple), usar OR entre términos
        // Cada término se busca en todos los campos (OR interno)
        // Y entre términos también es OR (busca cualquier término)
        const searchCondition = {
          OR: terminos.flatMap(termino => [
            { nombre: { contains: termino, mode: 'insensitive' } },
            { modelo: { contains: termino, mode: 'insensitive' } },
            { descripcion: { contains: termino, mode: 'insensitive' } },
            { numero_serie: { contains: termino, mode: 'insensitive' } },
            { proveedor: { contains: termino, mode: 'insensitive' } }
          ])
        };
        andConditions.push(searchCondition);
        console.log('🔍 Condición de búsqueda FLEXIBLE agregada:', JSON.stringify(searchCondition, null, 2));
      }
    }

    if (categoria) {
      // Handle comma-separated values for multiple category filters
      const categorias = categoria.split(',').map(c => c.trim()).filter(c => c);
      console.log('🏷️ Categorías procesadas:', categorias);
      if (categorias.length === 1) {
        andConditions.push({ categoria: { contains: categorias[0], mode: 'insensitive' } });
      } else if (categorias.length > 1) {
        andConditions.push({
          OR: categorias.map(c => ({ categoria: { contains: c, mode: 'insensitive' } }))
        });
      }
    }

    if (ubicacion) {
      // Handle comma-separated values for multiple location filters
      const ubicaciones = ubicacion.split(',').map(u => u.trim()).filter(u => u);
      console.log('📍 Ubicaciones procesadas:', ubicaciones);
      if (ubicaciones.length === 1) {
        andConditions.push({ ubicacion: { contains: ubicaciones[0], mode: 'insensitive' } });
      } else if (ubicaciones.length > 1) {
        andConditions.push({
          OR: ubicaciones.map(u => ({ ubicacion: { contains: u, mode: 'insensitive' } }))
        });
      }
    }

    if (estado) {
      // Handle comma-separated values for multiple status filters
      const estados = estado.split(',').map(e => e.trim()).filter(e => e);
      console.log('✅ Estados procesados:', estados);
      if (estados.length === 1) {
        andConditions.push({ estado: { contains: estados[0], mode: 'insensitive' } });
      } else if (estados.length > 1) {
        andConditions.push({
          OR: estados.map(e => ({ estado: { contains: e, mode: 'insensitive' } }))
        });
      }
    }

    if (anioMin || anioMax) {
      const anioCondition = {};
      if (anioMin) anioCondition.gte = parseInt(anioMin);
      if (anioMax) anioCondition.lte = parseInt(anioMax);
      andConditions.push({ anio: anioCondition });
      console.log('📅 Filtro de año agregado:', anioCondition);
    }

    // Construir la cláusula where final
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    console.log('🔍 Query WHERE final:', JSON.stringify(where, null, 2));

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

// Obtener una maquinaria por ID
exports.getMaquinariaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const maquinaria = await prisma.maquinaria.findUnique({
      where: { 
        id: parseInt(id) 
      }
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
