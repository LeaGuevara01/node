const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMaquinarias, createMaquinaria, updateMaquinaria, deleteMaquinaria, getMaquinariaFilters } = require('../controllers/maquinariaController');

router.get('/', auth, getMaquinarias);
router.get('/filtros', auth, getMaquinariaFilters);

router.post('/', auth, (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Solo administradores pueden crear maquinaria' });
  next();
}, createMaquinaria);

router.put('/:id', auth, (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Solo administradores pueden editar maquinaria' });
  next();
}, updateMaquinaria);

router.delete('/:id', auth, (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Solo administradores pueden eliminar maquinaria' });
  next();
}, deleteMaquinaria);

module.exports = router;
