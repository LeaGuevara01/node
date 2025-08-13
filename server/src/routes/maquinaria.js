// Rutas: Maquinaria
// GET / (lista+filtros), GET /filtros, GET /:id, CRUD por id

const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const auth = require('../middleware/auth');
const {
  getMaquinarias,
  createMaquinaria,
  updateMaquinaria,
  deleteMaquinaria,
  getMaquinariaFilters,
  getMaquinariaById,
} = require('../controllers/maquinariaController');

router.get('/', auth, getMaquinarias);
router.get('/filtros', auth, getMaquinariaFilters);
router.get('/:id', auth, getMaquinariaById);

router.post(
  '/',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden crear maquinaria' });
    next();
  },
  createMaquinaria
);

router.put(
  '/:id',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden editar maquinaria' });
    next();
  },
  updateMaquinaria
);

router.delete(
  '/:id',
  auth,
  (req, res, next) => {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden eliminar maquinaria' });
    next();
  },
  deleteMaquinaria
);

// Importación masiva (bulk) de maquinarias
router.post('/bulk', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.isAdmin)
      return res.status(403).json({ error: 'Solo administradores pueden importar maquinarias' });
    if (!req.file) return res.status(400).json({ error: 'Archivo no proporcionado' });

    // TODO: Parsear CSV/XLSX del buffer req.file.buffer y crear registros
    // Por ahora, responder con un conteo simulado de filas detectadas
    // Mejor: integrar un servicio de importación real en controllers/services
    const filename = req.file.originalname || '';
    // Respuesta placeholder
    return res.status(200).json({ count: 0, filename });
  } catch (err) {
    console.error('Error en importación de maquinarias:', err);
    return res.status(500).json({ error: 'Error interno al importar maquinarias' });
  }
});

module.exports = router;
