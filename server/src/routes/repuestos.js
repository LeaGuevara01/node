// Rutas: Repuestos
// GET / (lista+filtros), GET /filtros, GET /estadisticas, GET /busqueda, CRUD por id

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getRepuestos,
  createRepuesto,
  updateRepuesto,
  deleteRepuesto,
  getFilterOptions,
  getEstadisticas,
  busquedaRapida,
  getRepuestoById,
} = require('../controllers/repuestoController');

// Rutas públicas (o con autenticación básica)
router.get('/', auth, getRepuestos);
router.get('/filtros', auth, getFilterOptions);
router.get('/estadisticas', auth, getEstadisticas);
router.get('/busqueda', auth, busquedaRapida);
router.get('/:id', auth, getRepuestoById);

// Rutas que requieren permisos de administrador
router.post(
  '/',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden crear repuestos' });
    next();
  },
  createRepuesto
);

router.put(
  '/:id',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden editar repuestos' });
    next();
  },
  updateRepuesto
);

router.delete(
  '/:id',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden eliminar repuestos' });
    next();
  },
  deleteRepuesto
);

module.exports = router;
