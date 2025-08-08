const prisma = require('../lib/prisma');

exports.getProveedores = async (req, res) => {
  try {
    const { 
      search, 
      nombre,
      contacto,
      page = 1, 
      limit = 50,
      sortBy = 'nombre',
      sortOrder = 'asc'
    } = req.query;

    // Construir filtros dinámicamente
    const where = {};
    const orderBy = {};

    // Filtro de búsqueda general
    if (search) {
      const searchTerms = Array.isArray(search) ? search : search.split(',');
      where.OR = searchTerms.flatMap(term => [
        { nombre: { contains: term.trim(), mode: 'insensitive' } },
        { cuit: { contains: term.trim(), mode: 'insensitive' } },
        { email: { contains: term.trim(), mode: 'insensitive' } },
        { telefono: { contains: term.trim(), mode: 'insensitive' } },
        { direccion: { contains: term.trim(), mode: 'insensitive' } }
      ]);
    }

    // Filtro por nombre específico (puede ser múltiple)
    if (nombre) {
      const nombreTerms = Array.isArray(nombre) ? nombre : nombre.split(',');
      if (nombreTerms.length === 1) {
        where.nombre = { contains: nombreTerms[0].trim(), mode: 'insensitive' };
      } else {
        where.OR = [...(where.OR || []), ...nombreTerms.map(term => ({
          nombre: { contains: term.trim(), mode: 'insensitive' }
        }))];
      }
    }

    // Filtro por información de contacto (email/teléfono)
    if (contacto) {
      const contactoTerms = Array.isArray(contacto) ? contacto : contacto.split(',');
      const contactoConditions = contactoTerms.flatMap(term => [
        { email: { contains: term.trim(), mode: 'insensitive' } },
        { telefono: { contains: term.trim(), mode: 'insensitive' } }
      ]);
      
      if (where.OR) {
        where.OR.push(...contactoConditions);
      } else {
        where.OR = contactoConditions;
      }
    }

    // Configurar ordenamiento
    orderBy[sortBy] = sortOrder;

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Ejecutar consulta con filtros
    const [proveedores, total] = await Promise.all([
      prisma.proveedor.findMany({
        where,
        orderBy,
        skip,
        take
      }),
      prisma.proveedor.count({ where })
    ]);

    // Calcular información de paginación
    const totalPages = Math.ceil(total / take);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      proveedores,
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

// Obtener opciones únicas para filtros (basado en campos reales del modelo)
exports.getFilterOptions = async (req, res) => {
  try {
    const [estadisticas] = await Promise.all([
      // Obtener estadísticas básicas
      prisma.proveedor.aggregate({
        _count: { id: true }
      })
    ]);

    res.json({
      // Como el modelo Proveedor no tiene campos categóricos como ubicacion o estado,
      // solo retornamos información básica
      totalProveedores: estadisticas._count.id,
      // Los filtros se basarán en búsqueda por texto en los campos disponibles
      campos: {
        nombre: 'Nombre del proveedor',
        cuit: 'CUIT',
        email: 'Email de contacto',
        telefono: 'Teléfono',
        direccion: 'Dirección'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProveedorById = async (req, res) => {
  try {
    const proveedor = await prisma.proveedor.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }
    
    res.json(proveedor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProveedor = async (req, res) => {
  const { nombre, cuit, telefono, email, direccion, web, productos } = req.body;
  try {
    const data = { 
      nombre,
      cuit: cuit || null,
      telefono: telefono || null,
      email: email || null,
      direccion: direccion || null,
      web: web || null,
      productos: productos || []
    };

    const proveedor = await prisma.proveedor.create({ data });
    res.status(201).json(proveedor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, cuit, telefono, email, direccion, web, productos } = req.body;
  try {
    const data = { 
      nombre,
      cuit: cuit || null,
      telefono: telefono || null,
      email: email || null,
      direccion: direccion || null,
      web: web || null,
      productos: productos || []
    };

    const proveedor = await prisma.proveedor.update({
      where: { id: Number(id) },
      data
    });
    res.json(proveedor);
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Proveedor no encontrado' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

exports.deleteProveedor = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.proveedor.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Proveedor eliminado' });
  } catch (err) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Proveedor no encontrado' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};

// Obtener estadísticas de proveedores
exports.getEstadisticas = async (req, res) => {
  try {
    const [
      totalProveedores,
      conEmail,
      conTelefono,
      conDireccion
    ] = await Promise.all([
      // Total de proveedores
      prisma.proveedor.count(),
      
      // Proveedores con email
      prisma.proveedor.count({
        where: { 
          email: { not: null },
          email: { not: '' }
        }
      }),
      
      // Proveedores con teléfono
      prisma.proveedor.count({
        where: { 
          telefono: { not: null },
          telefono: { not: '' }
        }
      }),
      
      // Proveedores con dirección
      prisma.proveedor.count({
        where: { 
          direccion: { not: null },
          direccion: { not: '' }
        }
      })
    ]);

    res.json({
      resumen: {
        total: totalProveedores,
        conEmail: conEmail,
        conTelefono: conTelefono,
        conDireccion: conDireccion,
        sinContacto: totalProveedores - Math.max(conEmail, conTelefono)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Búsqueda rápida de proveedores
exports.busquedaRapida = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const proveedores = await prisma.proveedor.findMany({
      where: {
        OR: [
          { nombre: { contains: q, mode: 'insensitive' } },
          { cuit: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        nombre: true,
        cuit: true,
        email: true,
        telefono: true,
        direccion: true
      },
      take: 10,
      orderBy: { nombre: 'asc' }
    });

    res.json(proveedores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
