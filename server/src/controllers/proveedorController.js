// Módulo: Proveedor Controller
// Rol: CRUD de proveedores, filtros y estadísticas
// Notas: paginación y ordenamiento simples, búsqueda flexible OR

const prisma = require('../lib/prisma');

/**
 * GET /api/proveedores
 * Query: search?, nombre?, contacto?, page=1, limit=50, sortBy=nombre, sortOrder=asc
 * Respuesta: { proveedores: [], pagination: { current, total, hasNext, hasPrev, totalItems } }
 */
exports.getProveedores = async (req, res) => {
  try {
    const {
      search,
      nombre,
      contacto,
      page = 1,
      limit = 50,
      sortBy = 'nombre',
      sortOrder = 'asc',
    } = req.query;

    // Construir filtros dinámicamente
    const where = {};
    const orderBy = {};

    // Filtro de búsqueda general (OR por múltiples campos)
    if (search) {
      const searchTerms = Array.isArray(search) ? search : search.split(',');
      where.OR = searchTerms.flatMap((term) => [
        { nombre: { contains: term.trim(), mode: 'insensitive' } },
        { contacto: { contains: term.trim(), mode: 'insensitive' } },
        { cuit: { contains: term.trim(), mode: 'insensitive' } },
        { email: { contains: term.trim(), mode: 'insensitive' } },
        { telefono: { contains: term.trim(), mode: 'insensitive' } },
        { direccion: { contains: term.trim(), mode: 'insensitive' } },
        { ubicacion: { contains: term.trim(), mode: 'insensitive' } },
        { notas: { contains: term.trim(), mode: 'insensitive' } },
      ]);
    }

    // Filtro por nombre específico (puede ser múltiple)
    if (nombre) {
      const nombreTerms = Array.isArray(nombre) ? nombre : nombre.split(',');
      if (nombreTerms.length === 1) {
        where.nombre = { contains: nombreTerms[0].trim(), mode: 'insensitive' };
      } else {
        where.OR = [
          ...(where.OR || []),
          ...nombreTerms.map((term) => ({
            nombre: { contains: term.trim(), mode: 'insensitive' },
          })),
        ];
      }
    }

    // Filtro por información de contacto (email/teléfono)
    if (contacto) {
      const contactoTerms = Array.isArray(contacto) ? contacto : contacto.split(',');
      const contactoConditions = contactoTerms.flatMap((term) => [
        { email: { contains: term.trim(), mode: 'insensitive' } },
        { telefono: { contains: term.trim(), mode: 'insensitive' } },
      ]);

      if (where.OR) {
        where.OR.push(...contactoConditions);
      } else {
        where.OR = contactoConditions;
      }
    }

    // Ordenamiento
    orderBy[sortBy] = sortOrder;

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [proveedores, total] = await Promise.all([
      prisma.proveedor.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.proveedor.count({ where }),
    ]);

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
        totalItems: total,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/proveedores/filtros
 * Resumen de campos disponibles para búsqueda y conteos básicos.
 */
exports.getFilterOptions = async (req, res) => {
  try {
    const [estadisticas] = await Promise.all([
      prisma.proveedor.aggregate({
        _count: { id: true },
      }),
    ]);

    res.json({
      totalProveedores: estadisticas._count.id,
      campos: {
        nombre: 'Nombre del proveedor',
        contacto: 'Persona de contacto',
        cuit: 'CUIT',
        email: 'Email de contacto',
        telefono: 'Teléfono',
        direccion: 'Dirección',
        ubicacion: 'Ubicación',
        notas: 'Notas',
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/proveedores/:id
 * 404 si no existe.
 */
exports.getProveedorById = async (req, res) => {
  try {
    const proveedor = await prisma.proveedor.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(proveedor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/proveedores
 * Body: { nombre, contacto?, cuit?, telefono?, email?, direccion?, ubicacion?, web?, productos?[], notas? }
 * 201 si creado, 400 si validación falla.
 */
exports.createProveedor = async (req, res) => {
  const { nombre, contacto, cuit, telefono, email, direccion, ubicacion, web, productos, notas } =
    req.body;
  try {
    const data = {
      nombre,
      contacto: contacto || null,
      cuit: cuit || null,
      telefono: telefono || null,
      email: email || null,
      direccion: direccion || null,
      ubicacion: ubicacion || null,
      web: web || null,
      productos: productos || [],
      notas: notas || null,
    };

    const proveedor = await prisma.proveedor.create({ data });
    res.status(201).json(proveedor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * PUT /api/proveedores/:id
 * 404 si no existe; 400 otros errores.
 */
exports.updateProveedor = async (req, res) => {
  const { id } = req.params;
  const { nombre, contacto, cuit, telefono, email, direccion, ubicacion, web, productos, notas } =
    req.body;
  try {
    const data = {
      nombre,
      contacto: contacto || null,
      cuit: cuit || null,
      telefono: telefono || null,
      email: email || null,
      direccion: direccion || null,
      ubicacion: ubicacion || null,
      web: web || null,
      productos: productos || [],
      notas: notas || null,
    };

    const proveedor = await prisma.proveedor.update({
      where: { id: Number(id) },
      data,
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

/**
 * DELETE /api/proveedores/:id
 * 200 si eliminado; 404 si no existe.
 */
exports.deleteProveedor = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.proveedor.delete({
      where: { id: Number(id) },
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

/**
 * GET /api/proveedores/estadisticas
 * Resumen agregado de cobertura de contacto.
 */
exports.getEstadisticas = async (req, res) => {
  try {
    const [totalProveedores, conEmail, conTelefono, conDireccion] = await Promise.all([
      prisma.proveedor.count(),
      prisma.proveedor.count({
        where: {
          email: { not: null },
          email: { not: '' },
        },
      }),
      prisma.proveedor.count({
        where: {
          telefono: { not: null },
          telefono: { not: '' },
        },
      }),
      prisma.proveedor.count({
        where: {
          direccion: { not: null },
          direccion: { not: '' },
        },
      }),
    ]);

    res.json({
      resumen: {
        total: totalProveedores,
        conEmail: conEmail,
        conTelefono: conTelefono,
        conDireccion: conDireccion,
        sinContacto: totalProveedores - Math.max(conEmail, conTelefono),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/proveedores/busqueda?q=term
 * Retorna top 10 por nombre/cuit/email.
 */
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
          { contacto: { contains: q, mode: 'insensitive' } },
          { cuit: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        nombre: true,
        contacto: true,
        cuit: true,
        email: true,
        telefono: true,
        direccion: true,
        ubicacion: true,
      },
      take: 10,
      orderBy: { nombre: 'asc' },
    });

    res.json(proveedores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
