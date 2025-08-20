/**
 * BaseController - Controlador base reutilizable para CRUD operations
 * Elimina duplicación en maquinariaController, repuestoController, etc.
 */

const prisma = require('../../lib/prisma');

class BaseController {
  constructor(modelName, options = {}) {
    this.modelName = modelName;
    this.model = prisma[modelName];
    this.options = {
      searchableFields: options.searchableFields || ['nombre'],
      filterableFields: options.filterableFields || [],
      sortableFields: options.sortableFields || ['id'],
      maxLimit: options.maxLimit || 100,
      defaultLimit: options.defaultLimit || 10,
      ...options,
    };
  }

  /**
   * Construye el objeto where para filtros dinámicos
   */
  buildWhere(filters = {}) {
    const where = {};
    const andConditions = [];

    // Búsqueda general
    if (filters.search) {
      const searchTerms = Array.isArray(filters.search) ? filters.search : [filters.search];

      const searchConditions = searchTerms.flatMap((term) =>
        this.options.searchableFields.map((field) => ({
          [field]: { contains: term, mode: 'insensitive' },
        }))
      );

      if (searchConditions.length > 0) {
        andConditions.push({ OR: searchConditions });
      }
    }

    // Filtros específicos
    this.options.filterableFields.forEach((field) => {
      if (filters[field]) {
        const values = Array.isArray(filters[field]) ? filters[field] : [filters[field]];

        andConditions.push({
          OR: values.map((value) => ({
            [field]: { contains: value, mode: 'insensitive' },
          })),
        });
      }
    });

    // Rangos numéricos
    Object.keys(filters).forEach((key) => {
      if (key.endsWith('Min') || key.endsWith('Max')) {
        const field = key.replace(/Min|Max$/, '');
        const isMin = key.endsWith('Min');

        if (!where[field]) where[field] = {};
        where[field][isMin ? 'gte' : 'lte'] = parseInt(filters[key]);
      }
    });

    // Combinar condiciones
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    return where;
  }

  /**
   * Lista elementos con paginación y filtros
   */
  async list(req, res) {
    try {
      const {
        page = 1,
        limit = this.options.defaultLimit,
        sortBy = this.options.sortableFields[0],
        sortOrder = 'asc',
        ...filters
      } = req.query;

      // Validar límites
      const parsedLimit = Math.min(parseInt(limit), this.options.maxLimit);
      const skip = (parseInt(page) - 1) * parsedLimit;

      // Construir query
      const where = this.buildWhere(filters);
      const orderBy = { [sortBy]: sortOrder };

      const [items, total] = await Promise.all([
        this.model.findMany({
          where,
          skip,
          take: parsedLimit,
          orderBy,
        }),
        this.model.count({ where }),
      ]);

      res.json({
        [this.modelName.toLowerCase() + 's']: items,
        pagination: {
          page: parseInt(page),
          limit: parsedLimit,
          total,
          totalPages: Math.ceil(total / parsedLimit),
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtiene un elemento por ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const item = await this.model.findUnique({
        where: { id: parseInt(id) },
      });

      if (!item) {
        return res.status(404).json({ error: `${this.modelName} no encontrado` });
      }

      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Crea un nuevo elemento
   */
  async create(req, res) {
    try {
      const data = this.sanitizeData(req.body);
      const item = await this.model.create({ data });
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Actualiza un elemento
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = this.sanitizeData(req.body);

      const item = await this.model.update({
        where: { id: parseInt(id) },
        data,
      });

      res.json(item);
    } catch (error) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: `${this.modelName} no encontrado` });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  /**
   * Elimina un elemento
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.model.delete({
        where: { id: parseInt(id) },
      });
      res.json({ message: `${this.modelName} eliminado` });
    } catch (error) {
      if (error.code === 'P2025') {
        res.status(404).json({ error: `${this.modelName} no encontrado` });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  /**
   * Obtiene opciones para filtros
   */
  async getFilterOptions(req, res) {
    try {
      const options = {};

      // Obtener valores únicos para campos filtrables
      for (const field of this.options.filterableFields) {
        const values = await this.model.findMany({
          select: { [field]: true },
          where: { [field]: { not: null } },
          distinct: [field],
        });
        options[field + 's'] = values
          .map((item) => item[field])
          .filter(Boolean)
          .sort();
      }

      // Estadísticas generales
      const stats = await this.model.aggregate({
        _count: { id: true },
      });

      options.total = stats._count.id;

      res.json(options);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Sanitiza los datos de entrada
   */
  sanitizeData(data) {
    const sanitized = {};

    // Convertir strings numéricos a números
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (typeof value === 'string' && !isNaN(value) && value !== '') {
        sanitized[key] = parseInt(value);
      } else if (value !== undefined && value !== null) {
        sanitized[key] = value;
      }
    });

    return sanitized;
  }
}

module.exports = BaseController;
