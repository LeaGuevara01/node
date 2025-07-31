const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getRepuestos, createRepuesto, updateRepuesto, deleteRepuesto } = require('../controllers/repuestoController');

router.get('/', auth, getRepuestos);

router.post('/', auth, (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Solo administradores pueden crear repuestos' });
  next();
}, createRepuesto);

router.put('/:id', auth, (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Solo administradores pueden editar repuestos' });
  next();
}, updateRepuesto);

router.delete('/:id', auth, (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Solo administradores pueden eliminar repuestos' });
  next();
}, deleteRepuesto);

module.exports = router;
