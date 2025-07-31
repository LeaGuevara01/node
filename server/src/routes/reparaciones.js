const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getReparaciones, createReparacion, updateReparacion, deleteReparacion } = require('../controllers/reparacionController');

router.get('/', auth, getReparaciones);

router.post('/', auth, (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Solo administradores pueden crear reparaciones' });
  next();
}, createReparacion);

router.put('/:id', auth, (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Solo administradores pueden editar reparaciones' });
  next();
}, updateReparacion);

router.delete('/:id', auth, (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Solo administradores pueden eliminar reparaciones' });
  next();
}, deleteReparacion);

module.exports = router;
