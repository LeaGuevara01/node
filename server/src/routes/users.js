// Rutas: Usuarios
// GET / (lista), PUT /:id, DELETE /:id; POST /bulk (importación masiva)

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const auth = require('../middleware/auth');
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserFilters,
} = require('../controllers/userController');

router.get('/', auth, getUsers);
router.post(
  '/',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden crear usuarios' });
    next();
  },
  createUser
);
router.get('/filtros', auth, getUserFilters);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

// Importación masiva (bulk) de usuarios
router.post('/bulk', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden importar usuarios' });
    if (!req.file) return res.status(400).json({ error: 'Archivo no proporcionado' });

    // TODO: Parsear CSV/XLSX del buffer req.file.buffer y crear usuarios
    // Respuesta placeholder para validar el flujo end-to-end
    const filename = req.file.originalname || '';
    return res.status(200).json({ count: 0, filename });
  } catch (err) {
    console.error('Error en importación de usuarios:', err);
    return res.status(500).json({ error: 'Error interno al importar usuarios' });
  }
});

module.exports = router;
