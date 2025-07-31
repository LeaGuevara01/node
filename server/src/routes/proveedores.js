const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProveedores, createProveedor, updateProveedor, deleteProveedor } = require('../controllers/proveedorController');

router.get('/', auth, getProveedores);

router.post('/', auth, (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Solo administradores pueden crear proveedores' });
  next();
}, createProveedor);

router.put('/:id', auth, (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Solo administradores pueden editar proveedores' });
  next();
}, updateProveedor);

router.delete('/:id', auth, (req, res, next) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Solo administradores pueden eliminar proveedores' });
  next();
}, deleteProveedor);

module.exports = router;
