// Rutas: Compras
// GET / (lista), GET /stats, GET /:id, POST/PUT/DELETE (admin)

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  listCompras,
  getCompra,
  createCompra,
  updateCompra,
  deleteCompra,
  statsCompras,
} = require('../controllers/compraController');
const validateCompra = require('../middleware/validateCompra');

router.get('/', auth, listCompras);
router.get('/stats', auth, statsCompras);
router.get('/:id', auth, getCompra);

router.post(
  '/',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden crear compras' });
    next();
  },
  validateCompra,
  createCompra
);

router.put(
  '/:id',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden editar compras' });
    next();
  },
  validateCompra,
  updateCompra
);

router.delete(
  '/:id',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden eliminar compras' });
    next();
  },
  deleteCompra
);

module.exports = router;
