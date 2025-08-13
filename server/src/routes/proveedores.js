// Rutas: Proveedores
// GET / (lista+filtros), GET /filtros, GET /estadisticas, GET /busqueda, GET /:id, CRUD por id

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  getFilterOptions,
  getEstadisticas,
  busquedaRapida,
} = require('../controllers/proveedorController');

// Rutas públicas (o con autenticación básica)
router.get('/', auth, getProveedores);
router.get('/filtros', auth, getFilterOptions);
router.get('/estadisticas', auth, getEstadisticas);
router.get('/busqueda', auth, busquedaRapida);
router.get('/:id', auth, getProveedorById);

// Rutas que requieren permisos de administrador
router.post(
  '/',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden crear proveedores' });
    next();
  },
  createProveedor
);

router.put(
  '/:id',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden editar proveedores' });
    next();
  },
  updateProveedor
);

router.delete(
  '/:id',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden eliminar proveedores' });
    next();
  },
  deleteProveedor
);

module.exports = router;
